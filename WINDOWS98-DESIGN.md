# Windows 98 classroom — phase 1

The active interface uses `src/retro.css` and the React window components in `src/RetroDesktop.tsx`. The former glass/cityscape stylesheet is no longer imported. Earlier background images remain archived in the project but are not displayed.

- Solid teal desktop; opaque gray windows; navy title bars; beveled buttons; inset inputs; original CSS-drawn retro icons. No Microsoft logos or copied installation assets.
- Existing twelve pathways, single published lesson, instructional content, command copy, diagram controls, search, and the `academy-progress-v1` storage key are preserved.
- Minimize hides windows into the taskbar; maximize expands them; close hides them without deleting state. Start → Windows reopens closed windows. Window positions/open state reset when the app reloads; learning progress does not.
- Desktop shortcuts open the overview/progress, classroom, resources, and help. File/Edit/View/Tools/Help menus expose real actions. Back opens the overview and Forward opens the following pathway plan; no unpublished lesson is presented as finished.
- Notes persist separately under `academy-notes-v1`. Resources includes vendor references and a downloadable notes template.
- The clock uses the browser's local time. Environment status reports saved learning progress and explicitly states that VM telemetry is not connected. Terminal is a labeled command reference with no fabricated execution output.
- Responsive layouts stack windows on narrow screens; the navigation button or Start menu opens the pathway window. Reduced screen space uses a horizontally scrolling taskbar.

Run `npm run dev` for local review. `npm run build` checks TypeScript and creates GitHub Pages-compatible static output. No deployment has been configured or performed for this redesign.
