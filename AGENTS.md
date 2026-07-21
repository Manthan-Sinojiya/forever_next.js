## Skills

### gstack (Garry Tan's AI Engineering Workflow)
A comprehensive AI engineering workflow toolkit. Use these slash commands:
- `/office-hours` — Product brainstorming & idea validation (start here for new features)
- `/plan-ceo-review` — Strategic scope review
- `/plan-eng-review` — Architecture & engineering review
- `/review` — Staff-engineer-level code review (run before committing)
- `/investigate` — Root-cause debugging (run when stuck on a bug)
- `/qa [url]` — QA testing in a real browser
- `/ship` — Automate tests + open PR
- `/cso` — Security audit (OWASP Top 10 + STRIDE)
- `/design-review` — UI/UX design audit & fixes
- `/design-shotgun` — Generate & iterate on design mockups
- `/autoplan` — Full review pipeline (CEO + design + eng, all in one)
- `/retro` — Weekly engineering retrospective
- `/learn` — Manage cross-session project learnings

Skill routing rules:
- New product ideas / brainstorming → invoke `/office-hours`
- Strategy or scope decisions → invoke `/plan-ceo-review`
- Architecture questions → invoke `/plan-eng-review`
- Bugs or errors → invoke `/investigate`
- QA / testing site behavior → invoke `/qa`
- Code review / diff check → invoke `/review`
- Ship / deploy / PR → invoke `/ship`
- Security concerns → invoke `/cso`
- UI polish → invoke `/design-review`

### ui-ux-pro-max (UI/UX Design Intelligence)
AI-powered design system generation with 84 UI styles, 192 color palettes, 161 reasoning rules, and 74 font pairings. Activates automatically for any UI/UX request.

Trigger phrases: "build a landing page", "design a dashboard", "create a UI", "make a component", "improve the design"

This project uses **Next.js + Tailwind CSS**. Always apply stack-specific guidelines for `next` and `html-tailwind`.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
