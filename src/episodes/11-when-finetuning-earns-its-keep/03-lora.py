"""
Episode 11, sample 3 — minimal LoRA finetune on a small open model.

This is the smallest example that actually trains. It uses HuggingFace's
PEFT + Transformers + Datasets, an 8B-class base model, and a JSONL
training file. Runs on a single 24GB GPU at the settings below.

Prereqs:
    pip install transformers peft datasets accelerate bitsandbytes
    huggingface-cli login   # if the base requires gated access

Training file format (one JSON object per line):
    {"input": "...", "output": "..."}

Run:
    python 03-lora.py training_examples.jsonl
"""

import sys

from datasets import load_dataset
from peft import LoraConfig, TaskType, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    BitsAndBytesConfig,
)
import torch


BASE = "meta-llama/Llama-3.1-8B-Instruct"     # pick a base your license/use allows
OUT_DIR = "./lora-out"
MAX_LEN = 2048


def main(data_path: str) -> None:
    # 4-bit quantization makes 8B fit on a 24GB GPU comfortably
    bnb = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )

    tok = AutoTokenizer.from_pretrained(BASE)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token

    base_model = AutoModelForCausalLM.from_pretrained(
        BASE,
        quantization_config=bnb,
        device_map="auto",
        torch_dtype=torch.bfloat16,
    )

    lora_cfg = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        task_type=TaskType.CAUSAL_LM,
    )
    model = get_peft_model(base_model, lora_cfg)
    model.print_trainable_parameters()

    ds = load_dataset("json", data_files=data_path)

    def format_example(ex):
        text = (
            "<|user|>\n" + ex["input"].strip() +
            "\n<|assistant|>\n" + ex["output"].strip() + tok.eos_token
        )
        out = tok(text, truncation=True, max_length=MAX_LEN, padding="max_length")
        out["labels"] = out["input_ids"].copy()
        return out

    ds = ds.map(format_example, remove_columns=ds["train"].column_names)

    args = TrainingArguments(
        output_dir=OUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=8,
        learning_rate=2e-4,
        warmup_ratio=0.03,
        bf16=True,
        logging_steps=10,
        save_steps=200,
        save_total_limit=2,
        report_to=[],   # add "wandb" or "tensorboard" if you use them
    )

    trainer = Trainer(model=model, args=args, train_dataset=ds["train"])
    trainer.train()

    model.save_pretrained(f"{OUT_DIR}/final")
    tok.save_pretrained(f"{OUT_DIR}/final")
    print(f"\nLoRA adapter saved to {OUT_DIR}/final")
    print("To use: load BASE, then `PeftModel.from_pretrained(base, OUT_DIR/final)`.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python 03-lora.py training_examples.jsonl")
        sys.exit(1)
    main(sys.argv[1])
