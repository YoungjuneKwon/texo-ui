# Texo Playground

Texo Playground demonstrates 13 directive-based UI scenarios across three categories:

- Casual (5): tournament, tarot, meme editor, vibe picker, inventory
- Pro (4): API client, code visualizer, decision matrix, settlement
- Data (4): auto dashboard, interactive chart, dynamic form, expense tracker

## Run

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run serve`

## System Prompt Guide

Use concise system prompts that produce Markdown + directive blocks only.

Example template:

```text
You are a UI generation assistant.
Output valid markdown and Texo directives only.
Choose one directive and provide complete YAML attributes.
Do not output JSON.
```

Example directive request:

```text
Create a lunch decision UI using ::: tournament-bracket with 8 food items.
```
