# Optional real PowerShell and Bash terminal

The GitHub Pages classroom remains static. It never connects visitors to the author's computer. Each learner may run this optional companion on their own computer.

## Start

Install Node.js 22.12+ or 24 LTS and a supported shell. Windows PowerShell is available on Windows; PowerShell 7 is used when `pwsh.exe` is on PATH. Bash uses Git for Windows when installed in its standard location. On Linux/macOS, Bash and PowerShell are detected from PATH. A custom Bash executable can be supplied through `ACADEMY_BASH` before launch.

```text
npm install
npm run local
```

Open **http://127.0.0.1:4174/**. In Local Terminal select a shell and click **Connect**. Maximize the window for comfortable use. `npm run terminal:serve` reuses a previously built `dist` directory. Stop the companion with Ctrl+C in its launching console.

## What it does

- Uses xterm.js and node-pty/ConPTY for real interactive shell processes, ANSI output, command history, tab completion, resize, Ctrl+C, and exit status.
- Commands run as the account launching the companion, starting in this project folder. There is no sandbox or elevation. They do not run inside a lab VM unless the learner establishes a separate remote shell themselves.
- Available commands depend on installed software and permissions. It does not install Active Directory/SQL/Azure tools or claim to provide every command. Git Bash is not WSL or a full Linux distribution. Profiles are not loaded automatically.
- Shells start only after Connect. Disconnect, closing the browser connection, or leaving the lesson ends the process. Minimizing or hiding the window retains the mounted session; use Disconnect to stop it explicitly.
- Local companion binds only to `127.0.0.1:4174`, rejects unexpected Host/Origin and cross-site requests, checks a generated HttpOnly SameSite session cookie, and caps concurrent sessions at four. Do not expose it through port forwarding, public tunnels, reverse proxies, or a LAN bind.
- No startup commands are executed on behalf of the learner. The server does not log terminal input/output. Shells and commands may have their own history or logging behavior.

## Public versus local

On GitHub Pages or the Vite design preview (port 5173), the panel shows PowerShell examples and these setup instructions. On the companion (port 4174), it offers real shells. Both use the same course content, but browser storage belongs to each origin, so progress and notes do not automatically transfer between ports or domains. Existing progress is not deleted.

Native `node-pty` installation may require platform build tools if a prebuilt binary is unavailable. A shell that is not installed is not offered. A failed launch shows the actual error rather than fabricated output.
