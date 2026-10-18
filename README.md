# Enterprise Infrastructure & Azure Migration Academy

## Current interface and optional terminal

The classroom now uses a Windows 98-style desktop. One **Active Directory & SQL Server Migration to Azure** pathway contains the original twelve ordered modules. See [navigation deltas](NAVIGATION-DELTAS.md) for duplicate-selection and explanation fixes.

For real interactive PowerShell/Bash on your own computer, run `npm run local` and open `http://127.0.0.1:4174/`. See [local terminal setup and scope](LOCAL-TERMINAL.md). The GitHub Pages build and normal design preview show examples and setup instructions, not a remote shell. Commands run with your account's permissions; installed tools determine which commands are available.

A browser-based classroom built with React, TypeScript, Tailwind CSS, and Vite. The first design-review release includes all twelve ordered pathways and **one published sample lesson** about VMware Workstation Pro virtual networking. Remaining pathways are explicitly planned, not completed coursework.

## Run locally

Install Node.js 22.12+ (or 24 LTS), then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check the production bundle:

```sh
npm run build
npm run preview
```

## Features

- Expandable ordered pathways, lesson/pathway search, responsive navigation, and course overview.
- Six self-assessed checkpoints and separate lesson completion, persisted locally in this browser. Storage failures show a warning; progress does not sync between devices.
- Interactive host-only/NAT/bridged architecture diagram, command copy buttons, and reusable command rendering.
- Complete sample teaching format: learning objectives, business context, prerequisites, click-by-click setup, explained commands, expected results, troubleshooting, rollback, and challenge.
- Disabled previous/next lesson controls accurately reflect that only one lesson is published. Pathway plans can be browsed independently; prerequisites are advisory during this preview.

## Scope and verification

The sample targets a Windows Workstation host and Windows test guest. It follows linked Broadcom networking documentation, but has not been executed against the learner's installed VMware release. Review the lab procedure on disposable VMs before treating it as validated course material. No Azure resources or paid backend are required.

The course dashboard reports completion of **published lessons only**, not completion of the full planned academy. Lesson checkpoints and completion are self-assessments, not automated lab verification.

## GitHub Pages compatibility

`npm run build` emits static files into `dist/`. Vite uses relative asset paths (`base: './'`), and navigation does not require server-side routes, making the output compatible with repository-based GitHub Pages hosting. No deployment or publishing workflow has been enabled; publishing is deferred until design approval.

## Next stage

Review readability, pathway navigation, and the sample's teaching quality. After approval, convert the supplied DOCX material into reviewed lessons. Do not populate unfinished pathways with fictitious completed material.
