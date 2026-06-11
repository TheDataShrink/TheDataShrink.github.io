"""Live smoke test: drive datashrink-mcp-pbip over real MCP stdio, as a client would.

Spawns `py -3 -m datashrink_pbip` and exercises read, validate, and dry-run
write tools against the real workspace. Prints a PASS/FAIL line per check.
"""
import asyncio
import json
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

ROOT = r"C:\estates\demo"
PROJ = ROOT + r"\Annual Comparative income statement"

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS" if ok else "FAIL") + f"  {name}" + (f"  -- {detail}" if detail else ""))


def payload(res):
    """Extract the JSON payload from a CallToolResult."""
    if res.structuredContent is not None:
        sc = res.structuredContent
        return sc.get("result", sc) if isinstance(sc, dict) else sc
    text = "".join(c.text for c in res.content if getattr(c, "type", "") == "text")
    try:
        return json.loads(text)
    except Exception:
        return text


async def main():
    params = StdioServerParameters(command=sys.executable, args=["-m", "datashrink_pbip"])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # 1. tool surface
            tools = (await session.list_tools()).tools
            names = sorted(t.name for t in tools)
            check("list_tools: 24 pbip.* tools", len(names) == 24 and all(n.startswith("pbip.") for n in names), f"{len(names)} tools")

            # 2. project discovery
            r = payload(await session.call_tool("pbip.project.list", {"root": ROOT}))
            projects = r if isinstance(r, list) else r.get("projects", [])
            check("project.list finds 19 projects", len(projects) == 19, f"found {len(projects)}")

            # 3. inventory of the real project
            inv = payload(await session.call_tool("pbip.project.inventory", {"project_path": PROJ}))
            check("project.inventory runs", isinstance(inv, dict), str(inv)[:120] if not isinstance(inv, dict) else "")

            # 4. pages
            pages = payload(await session.call_tool("pbip.report.list_pages", {"project_path": PROJ}))
            page_list = pages if isinstance(pages, list) else pages.get("pages", [])
            check("list_pages: 10 pages", len(page_list) == 10, f"{len(page_list)} pages")

            # 5. semantic model
            model = payload(await session.call_tool("pbip.semantic_model.describe", {"project_path": PROJ}))
            tables = model.get("tables", []) if isinstance(model, dict) else []
            n_measures = sum(len(t.get("measures", [])) for t in tables)
            check("semantic_model.describe: 4 tables", len(tables) == 4, f"{len(tables)} tables, {n_measures} measures")

            # 6. standards lint (read-only)
            lint = payload(await session.call_tool("pbip.standards.lint", {"project_path": PROJ}))
            check("standards.lint runs", isinstance(lint, (dict, list)), str(lint)[:120])

            # 7. M read + lint
            m = payload(await session.call_tool("pbip.m.read", {"project_path": PROJ}))
            mlint = payload(await session.call_tool("pbip.m.lint", {"project_path": PROJ}))
            check("m.read returns partitions", isinstance(m, (dict, list)) and len(m) > 0)
            check("m.lint runs", isinstance(mlint, (dict, list)))

            # 8. theme read
            theme = payload(await session.call_tool("pbip.theme.read", {"project_path": PROJ}))
            check("theme.read runs", isinstance(theme, (dict, list)))

            # 9. component registry
            libs = payload(await session.call_tool("pbip.component.libraries", {"root": ROOT}))
            check("component.libraries runs", isinstance(libs, (dict, list)), str(libs)[:120])
            found = payload(await session.call_tool("pbip.component.search", {"path": PROJ, "query": "chart"}))
            comp_list = found if isinstance(found, list) else []
            check("component.search('chart') finds components", len(comp_list) > 0, f"{len(comp_list)} hits" if comp_list else str(found)[:160])

            # 10. binding validation against the live model
            v = payload(await session.call_tool("pbip.validate.bindings", {
                "project_path": PROJ,
                "bindings": {"Values": "∑ Key Measures[AC]"},
            }))
            check("validate.bindings resolves a real measure", isinstance(v, (dict, list)), str(v)[:160])

            # 11. DRY-RUN write: insert a visual (no write=True -> must not touch disk)
            first_page = page_list[0]
            page_id = first_page.get("id") or first_page.get("name") or first_page.get("page_id")
            ins = payload(await session.call_tool("pbip.visual.insert", {
                "project_path": PROJ,
                "page_id": page_id,
                "visual_type": "card",
                "bindings": {"Values": "∑ Key Measures[AC]"},
                "position": {"x": 100, "y": 100, "width": 200, "height": 100},
            }))
            ok = isinstance(ins, dict) and ins.get("dry_run") is True and ins.get("committed") is False
            check("visual.insert dry-run stages but does not commit", ok, json.dumps({k: ins.get(k) for k in ("ok", "dry_run", "committed")}) if isinstance(ins, dict) else str(ins)[:160])

            # 12. DRY-RUN page create
            pg = payload(await session.call_tool("pbip.report.create_page", {
                "project_path": PROJ, "display_name": "SMOKE TEST PAGE",
            }))
            ok = isinstance(pg, dict) and pg.get("dry_run") is True and pg.get("committed") is False
            check("report.create_page dry-run does not commit", ok, json.dumps({k: pg.get(k) for k in ("ok", "dry_run", "committed")}) if isinstance(pg, dict) else str(pg)[:160])

    n_fail = sum(1 for _, ok, _ in results if not ok)
    print(f"\n{len(results) - n_fail}/{len(results)} live MCP checks passed")
    sys.exit(1 if n_fail else 0)


asyncio.run(main())
