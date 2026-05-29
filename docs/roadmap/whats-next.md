# What's Next — the path forward

Companion to [status-map.md](status-map.md). The status map is "where we are";
this is "what we do next, in what order, why."

> The thesis to land in market: **the .pbix era is ending. Power BI is becoming
> code, and humans + agents work it together.** The platform is open in
> method, paid in engine.

```mermaid
flowchart TB
  classDef now fill:#7a1f1f,stroke:#ef4444,color:#fff
  classDef month fill:#7a5c00,stroke:#facc15,color:#fff
  classDef quarter fill:#1e3a8a,stroke:#60a5fa,color:#fff
  classDef goal fill:#14532d,stroke:#4ade80,color:#fff

  subgraph WK["NOW — this week · the message"]
    direction TB
    WK1["index.html title + meta description<br/>kill the 'compliance co-pilot for telcos' copy<br/>that still ships in search and link previews"]:::now
    WK2["Home hero — declare the paradigm shift<br/>'the singular .pbix era is over;<br/>this is code + agents working together'"]:::now
    WK3["Editorial: Awatea to Northvale name slip<br/>+ soften unsourced 85pct / 3-5x metrics"]:::now
  end

  subgraph MO["THIS MONTH — content + structure"]
    direction TB
    MO1["Record Ep 0-7 video companions<br/>teleprompter live at /teleprompter<br/>the videos make the wedge visceral"]:::month
    MO2["Write Req 006 — custom-visual-library<br/>the bridge from concept to engine code"]:::month
    MO3["Split product repo · method public, engine private<br/>repo topology expresses the product thesis"]:::month
    MO4["Live synthetic-data Reflection artefact<br/>self-contained HTML/D3 you open in the pitch room<br/>Beat 3 of the pitch becomes real"]:::month
  end

  subgraph QU["THIS QUARTER — the Engine"]
    direction TB
    QU1["Engine Runtime · MCP aggregator server<br/>5 tools: reflect · score · validate · generate · remediate<br/>server to host, client to Microsoft's local server"]:::quarter
    QU2["Wire to power-bi-template guts<br/>analyzer · generator · validator · custom visual"]:::quarter
    QU3["First paid Reflection engagement<br/>sovereign, government-grade, MBIE-style"]:::quarter
  end

  G["THE WEDGE LANDS<br/>open Method · paid Engine<br/>the .pbix era ends here"]:::goal

  WK ==> MO ==> QU ==> G
```

## Reading the diagram

- **NOW — the message.** Three small surgical fixes. The biggest single one is
  the stale `index.html` `<title>` and `<meta description>`: it still pitches a
  compliance co-pilot for AU/NZ telcos, which is the *previous* product. Every
  link preview, every SERP entry, every social share carries the wrong story
  until that's fixed. The Home hero is on-message but not yet *paradigm-shift*
  on-message — it says "optimisation," not "the .pbix era is ending."
- **THIS MONTH — content + structure.** The teleprompter is in the repo for a
  reason: record the eight episodes. In parallel, write Requirement 006
  (the build spec for the modular visual library) so the bridge from concept
  to engine code exists, split the product repo so the topology matches the
  thesis, and produce the **live, self-contained Reflection artefact** that
  makes Beat 3 of the pitch real — the moment a buyer says *"I finally see
  what we built."*
- **THIS QUARTER — the Engine.** Build the MCP aggregator server (the five
  tools), wire it to the `power-bi-template` analyzer/generator/validator, and
  land the **first paid Reflection** engagement. That engagement is the
  product-market-fit signal, and it pays for the next round.

The path through the diagram is the path the wedge takes from documented
thesis → recorded story → tangible artefact → running product → first sale.
