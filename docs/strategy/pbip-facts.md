# PBIP — the facts we build on

Authoritative notes from the Microsoft docs, so our content and the Engine stay
technically honest. Source: [Power BI Desktop projects (PBIP) — Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview)
(doc dated 2025-12-15; read 2026-05-26). **PBIP is in preview** — state that
wherever we lean on it.

## What a PBIP actually is

Saving a Power BI Desktop file as a **Power BI Project (.pbip)** writes the report
and semantic model definitions as plain-text files in a folder structure:

```
Project/
├── AdventureWorks.Report/          ← report definition (PBIR)
│   └── definition.pbir             ← can open this directly in Desktop
├── AdventureWorks.SemanticModel/   ← semantic model definition (TMDL)
│   └── definition.pbism
├── .gitignore                      ← ignores .pbi/cache.abf, localSettings.json
└── AdventureWorks.pbip             ← just a POINTER to the report folder
```

Key correction to a common assumption: **the `.pbip` file is optional — a
shortcut.** It only points at the report folder. You can open the report and its
model straight from `definition.pbir`. One folder can hold multiple reports and
models.

## The asymmetry that matters for us

The report layer and the model layer are **not** equally agent-ready today:

| Layer | Format | External / programmatic editing |
| --- | --- | --- |
| **Semantic model** | **TMDL** in `/definition`, plus `definition.pbism` | **Fully supported.** Read + write via the [Tabular Object Model (TOM)](https://learn.microsoft.com/en-us/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo) or by editing TMDL text in VS Code. |
| **Report** | **PBIR**: `definition.pbir` + `report.json` | **Not supported in preview.** `report.json` (and `mobileState.json`, `semanticModelDiagramLayout.json`) schemas are **undocumented**; editing them outside Power BI Desktop is unsupported during preview. |

So **the supported programmatic surface today is the semantic model (TMDL/TOM)** —
generating measures, tables, relationships. The **report layer is the frontier**:
PBIR makes it text, which is what *enables* code-first report assembly, but the
schema is not yet a stable public contract. Our "agent assembles the report"
story is the direction of travel — honest framing is that the model layer is
production-ready now and the report layer is preview.

## Other facts worth keeping straight

- **Convert is Desktop-only.** PBIX ↔ PBIP conversion happens via Desktop
  *File > Save As* — **not** programmatically.
- **Deploy** to a Fabric workspace via: Fabric **Git Integration**, **Fabric
  APIs**, or **Power BI Desktop publish** (publish uses a temporary PBIX and
  pushes data + metadata; the API/Git paths deploy metadata only).
- **JSON schemas** for documented project files: [github.com/microsoft/json-schemas/tree/main/fabric](https://github.com/microsoft/json-schemas/tree/main/fabric).
- **Gotchas** to respect if we touch real files: 260-char Windows path limit
  (use short root paths); UTF-8 **without BOM**; Power BI uses CRLF (set Git
  `autocrlf`); sensitivity labels and report linguistic schema aren't supported;
  RLS role members and incremental-refresh partitions can't be set via the
  Fabric REST API.

## Why this strengthens, not weakens, the pitch

The preview caveat is a feature for us. We say it out loud: *the model layer is
where governed, programmatic change is safe today; the report layer is emerging.*
That candour is exactly what a sovereign, regulated buyer trusts — and it points
the Engine's first, safest value at the semantic model, which is where the
[analytics entropy](../concepts/analytics-entropy.md) lives anyway.
