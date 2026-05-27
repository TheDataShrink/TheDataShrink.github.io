"""
module_generator.py — config in, governed modules out.

A faithful sketch of the real generator in
spectrumefficiencylimited/power-bi-template (modules/scripts/module_generator.py,
driven by pbip_automation_orchestrator.py). The repo is the source of truth;
this trims it to the idea: the engine reads a YAML config + the library, applies
the validation rules, and emits module JSON. No visual is dragged by hand.

Orchestration shape:
    config.yaml -> analyze -> validate (gate) -> generate modules -> write PBIP
"""
import yaml
from pathlib import Path

# The estate's certified measures — the only patient-count binding the gate allows.
CERTIFIED = {"ER_Data.Number of Patients": "DISTINCTCOUNT('ER_Data'[Patient ID])"}


class ValidationError(Exception):
    """Raised when a config violates a rule with severity error/critical."""


def validate(config: dict) -> None:
    """The contract gate — the same rules scored in Episode 3's baseline.

    These mirror hospital_er.yaml's validation_rules. The engine refuses to
    generate from a config that breaks an error/critical rule, so a drifting
    report is never produced in the first place.
    """
    for kpi in config.get("kpis", []):
        v = kpi.get("validation", {})
        must = v.get("aggregation_must_be")
        if must and kpi.get("aggregation") != must:
            raise ValidationError(
                f"{kpi['field']}: aggregation must be {must} "
                f"(rule: patient_count_distinct) — got {kpi.get('aggregation')}"
            )

    date = config.get("date", {})
    rules = date.get("validation", {})
    if rules.get("no_datetime_joins") and date.get("uses_datetime_join", False):
        raise ValidationError("DateTime used as a join key (rule: no_datetime_joins)")
    if rules.get("require_calendar") and not date.get("has_calendar_table", False):
        raise ValidationError("No calendar table (rule: calendar_table_required)")


def generate_kpi_strip(config: dict) -> dict:
    """Emit a governed KPI-strip module from the config's KPI definitions."""
    brand = config["branding"]["primary_color"]
    return {
        "generated_from": "config/examples/hospital_er.yaml",
        "module_type": "kpi_strip",
        "domain": config["project"]["domain"],
        "cards": [
            {
                "field": k["field"],
                "display_name": k["display_name"],
                "aggregation": k["aggregation"],   # already passed the gate
                "format": k["format"],
                "primary_color": brand,
            }
            for k in config["kpis"]
        ],
    }


def run(config_path: str, out_dir: str) -> None:
    config = yaml.safe_load(Path(config_path).read_text())
    validate(config)                       # gate first — fail fast on a bad estate
    module = generate_kpi_strip(config)    # then generate
    out = Path(out_dir) / "kpi_strip_generated.json"
    out.write_text(__import__("json").dumps(module, indent=2))
    print(f"wrote {out} — {len(module['cards'])} governed cards")


if __name__ == "__main__":
    # python module_generator.py --config config/examples/hospital_er.yaml
    run("config/examples/hospital_er.yaml", "modules/scripts/generated_modules")
