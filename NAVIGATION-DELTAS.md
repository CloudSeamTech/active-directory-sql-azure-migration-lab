# Navigation and teaching audit

| Before | After | Reason |
| --- | --- | --- |
| Twelve unrelated “pathways” | One selected **Active Directory & SQL Server Migration to Azure** pathway, with the same twelve ordered modules | Makes the end-to-end goal explicit without changing the curriculum |
| Expand each topic, then select “View pathway plan” | Select a module directly; its availability is stated on the same row | Removes a redundant click and makes unpublished content clear |
| My Computer and Lab Progress both open the same overview | Migration Pathway opens the overview and progress; Continue Lesson opens the available lesson | Removes duplicate destinations with misleading labels |
| Back and Home both open overview; Forward opens a plan | Pathway and Next module plan | Describes the actual destination rather than implying browser history or a published next lesson |
| Resources and Help repeated inside the Start menu's Windows list | Keep those actions once in Start; Windows lists auxiliary windows | Removes duplicate selections within one menu |
| `C:\>` and neon-green commands labeled PowerShell | `PS C:\>` example prompt, classic blue console, light-gray prompt/arguments, yellow command tokens | Distinguishes PowerShell from Command Prompt; color is a chosen presentation theme, not universal shell behavior |
| Window named Terminal but not interactive | Local Terminal connects to a real shell only on the optional companion; public site displays examples and setup instructions | No implication of execution or fabricated output |
| Progress denominator could imply entire curriculum completion | Published lesson count plus explicitly planned modules | Progress remains based on authored content only |

The raw commands copied to the clipboard do not contain the display prompt. The lesson now explains that each command must run on the specified host or guest; a local shell on the developer PC is not automatically a guest VM shell.

PowerShell colors vary with host, theme, and PSReadLine configuration. Reference: https://learn.microsoft.com/en-us/powershell/module/psreadline/set-psreadlineoption

The public GitHub Pages build cannot execute local PowerShell/Bash processes. The optional local companion runs under each learner's account on their own machine. Git Bash is installed on this development computer; no WSL Linux distribution was listed. Git Bash does not provide every Linux service or program. See LOCAL-TERMINAL.md for setup, security boundaries, and origin-specific browser storage.
