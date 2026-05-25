# Episode 11, sample 2 — dataset quality and leakage stats.
#
# Run this on every dataset before you finetune. If any of the numbers
# below look bad, fix the data before you train. Training on bad data
# wastes time, money, and confidence in the model.
#
# Run:
#   Rscript 02-data-quality.R training_examples.csv eval_fixtures.csv

suppressMessages({
  library(dplyr)
  library(stringr)
})

args <- commandArgs(trailingOnly = TRUE)
train_path <- if (length(args) >= 1) args[1] else "training_examples.csv"
eval_path  <- if (length(args) >= 2) args[2] else "eval_fixtures.csv"

train <- read.csv(train_path, stringsAsFactors = FALSE)
eval_set <- if (file.exists(eval_path)) read.csv(eval_path, stringsAsFactors = FALSE) else NULL

stopifnot(all(c("input", "output") %in% names(train)))

# --- shape ---------------------------------------------------------------

cat("rows                    :", nrow(train), "\n")
cat("unique inputs           :", length(unique(train$input)), "\n")
cat("duplicate input ratio   :", sprintf("%.1f%%",
    100 * (1 - length(unique(train$input)) / nrow(train))), "\n")
cat("avg input length (char) :", round(mean(nchar(train$input))), "\n")
cat("avg output length (char):", round(mean(nchar(train$output))), "\n")
cat("inputs over 4000 char   :", sum(nchar(train$input) > 4000), "\n")
cat("outputs under 20 char   :", sum(nchar(train$output) < 20),
    " (likely garbage, check)\n")

# --- coverage ------------------------------------------------------------

if ("tag" %in% names(train)) {
  cat("\ncoverage by tag:\n")
  print(train %>% count(tag, sort = TRUE))
} else {
  cat("\n(no 'tag' column; add one for slice coverage analysis)\n")
}

# --- leakage with eval set ----------------------------------------------

if (!is.null(eval_set) && "input" %in% names(eval_set)) {
  leaks <- sum(train$input %in% eval_set$input)
  cat(sprintf("\nleakage with eval set   : %d (%.2f%% of training rows)\n",
              leaks, 100 * leaks / nrow(train)))
  if (leaks > 0) {
    cat("ACTION: remove these rows from training before finetuning.\n")
  }
} else {
  cat("\n(no eval fixture file found; skipping leakage check — DO NOT skip in real runs)\n")
}

# --- contradictions: same input, different output ------------------------

contradictions <- train %>%
  group_by(input) %>%
  summarise(n_outputs = n_distinct(output), .groups = "drop") %>%
  filter(n_outputs > 1) %>%
  nrow()
cat("contradictions          :", contradictions, "\n")
if (contradictions > 0) {
  cat("ACTION: resolve before training; the model will see noise as signal.\n")
}

# --- PII check (very crude) ----------------------------------------------

has_email <- str_detect(train$input, "[\\w.+-]+@[\\w-]+\\.[\\w.-]+") |
             str_detect(train$output, "[\\w.+-]+@[\\w-]+\\.[\\w.-]+")
has_card  <- str_detect(train$input, "\\b(?:\\d[ -]?){13,16}\\b") |
             str_detect(train$output, "\\b(?:\\d[ -]?){13,16}\\b")
cat("rows w/ likely email    :", sum(has_email), "\n")
cat("rows w/ likely card #   :", sum(has_card), "\n")
if (any(has_email) || any(has_card)) {
  cat("ACTION: redact PII before training. The model will memorize it.\n")
}
