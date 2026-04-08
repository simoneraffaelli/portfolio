# simone.ooo

An interactive, terminal-inspired developer portfolio built with Next.js.

Instead of static navigation and traditional hero sections, this site is designed like a playful command-line interface. It combines a clean minimal layout with lots of personality (kinda lol).

## What This Site Is

This project is a personal portfolio experience focused on:

- fast keyboard-first interaction
- interactive section navigation (whoami, projects, contact, playground)
- command-driven UX with aliases and easter eggs
- dynamic visual modes and micro-animations (matrix rain, glitch effects, party mode, etc.)
- a themed terminal aesthetic in both dark and light modes
- interactive canvas playgrounds showcasing creative coding demos

The core idea is to make browsing a portfolio feel more like using a developer tool than reading a static brochure page.

## Key Features

- Terminal input command parser with input history (arrow keys)
- Multiple aliases for navigation commands
- Theme controls (green, amber, rose, cyan, violet)
- Light/dark mode toggle
- Animated section transitions
- Scrollable content panes with custom styled scrollbars
- Dozens of hidden/fun commands and responses
- **Playground system** — extensible sub-commands for interactive canvas demos:
  - `playground pretext` — "Text Chaos": bouncing emoji orbs with real-time text reflow powered by [@chenglou/pretext](https://github.com/chenglou/pretext). Text flows around circular obstacles using JS-only layout (zero DOM reads). Click to spawn orbs, drag to move, right-click to pop.
  - `playground particletext` — "Particle Text": text and ASCII art rendered as thousands of individual character particles. Hover to scatter them with mouse repulsion physics, click to cycle through phrases (including braille art). Particles spring back to their home positions with velocity-based coloring.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide + Simple Icons
- [@chenglou/pretext](https://github.com/chenglou/pretext) — JS-only text layout engine (used in playground pretext)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open:

http://localhost:3000

## Project Structure

```
app/                        # app shell, global styles, metadata
components/
  portfolio.tsx             # command handler and main interactive logic
  terminal-input.tsx        # command input with history and feedback
  title-bar.tsx             # top nav with section tabs, theme, mode toggle
  matrix-rain.tsx           # matrix rain canvas overlay
  sections/
    whoami.tsx              # animated typing hero + skills grid
    projects.tsx            # collapsible project cards
    contact.tsx             # email copy + social links
    playground.tsx          # playground router — maps playground IDs to components
  playgrounds/
    pretext.tsx             # "Text Chaos" — bouncing orbs + real-time text reflow
    particle-text.tsx       # "Particle Text" — character particles with physics
  ui/
    simple-icon.tsx         # simple-icons wrapper component
hooks/
  use-easter-eggs.ts        # visual effects: matrix, glitch, party, meow, flip, spin
  use-simone-explosion.ts   # simone protocol letter-explosion animation
lib/
  canvas-utils.ts           # shared canvas helpers (CSS var → sRGB resolution)
  commands.ts               # command parsing, static responses, section aliases
  types.ts                  # Section and Theme types
  utils.ts                  # utility functions
public/                     # icons and static assets
```

## Command Reference

Below is the full list of recognized commands available in the terminal UI.

### Navigation Aliases

- `about`
- `me`
- `who`
- `bio`
- `whoami`
- `projects`
- `work`
- `portfolio`
- `builds`
- `ls`
- `contact`
- `email`
- `hire`
- `reach`
- `mail`
- `old` (opens `https://old.simone.ooo/` in a new tab)

### Playground Commands

- `playground` / `playgrounds` / `pg` — opens the playground section (lists available experiments)
- `playground pretext` / `pg pretext` — opens "Text Chaos" (bouncing orbs + text reflow)
- `playground particletext` / `pg particletext` — opens "Particle Text" (character particle physics)

### Help And Terminal Basics

- `help`
- `?`
- `commands`
- `all-cmds` (opens the full command reference in a new tab)
- `all-commands` (opens the full command reference in a new tab)
- `clear`
- `cls`
- `reset`

### Theme Commands

- `light`
- `day`
- `dark`
- `night`
- `theme green`
- `theme amber`
- `theme rose`
- `theme cyan`
- `theme violet`
- `theme`
- `themes`
- `colors`

### Greetings And Chat

- `hello`
- `hi`
- `hey`
- `yo`
- `thanks`
- `thank you`
- `thx`
- `sorry`
- `please`
- `love`
- `heart`
- `<3`
- `bruh`
- `lol`
- `lmao`
- `haha`
- `:(`
- `sad`
- `:)`
- `happy`
- `smile`

### Easter Eggs And Fun

- `meow`
- `cat language`
- `nyan`
- `simone` (explodes letters and makes them fall off-screen)
- `woof`
- `bark`
- `matrix`
- `neo`
- `redpill`
- `bluepill`
- `party`
- `disco`
- `rave`
- `glitch`
- `hack`
- `crash`
- `flip`
- `rotate`
- `australia`
- `spin`
- `barrel roll`
- `do a barrel roll`
- `konami`
- `xyzzy`
- `iddqd`
- `rickroll`
- `rick`
- `sus`
- `amogus`
- `among us`

### Danger Joke Commands

- `sudo`
- `sudo rm -rf`
- `sudo rm -rf /`
- `rm -rf /`
- `sudo make me a sandwich`
- `make me a sandwich`

### Dev And Programming Jokes

- `coffee`
- `brew`
- `java`
- `javascript`
- `js`
- `rust`
- `python`
- `vim`
- `nvim`
- `neovim`
- `emacs`
- `nano`
- `code`
- `vscode`
- `cursor`
- `hello world`
- `ai`
- `chatgpt`
- `gpt`
- `claude`
- `blockchain`
- `crypto`
- `web3`
- `serverless`
- `cloud`

### Git And Package Manager

- `git`
- `git status`
- `git push`
- `git pull`
- `git commit`
- `npm`
- `npm install`
- `pnpm`
- `yarn`
- `bun`
- `deno`
- `make`
- `make install`
- `man`

### Shell-Style Utility

- `pwd`
- `cd ..`
- `cd`
- `cd ~`
- `ping`
- `pong`
- `date`
- `now`
- `time`
- `weather`
- `uptime`
- `version`
- `-v`
- `--version`
- `fortune`
- `quote`

### Special Values

- `42`
- `answer`
- `69`
- `420`

### Work And Life Chatter

- `hire me`
- `money`
- `salary`
- `pay`
- `music`
- `play`
- `sleep`
- `zzz`

### Exit And Restart

- `exit`
- `quit`
- `q`
- `:q`
- `:q!`
- `:wq`
- `reboot`
- `restart`

### Misc

- `cat`
- `dog`
- `cow`
- `cowsay`
- `secret`
- `secrets`
- `easter`

## Notes

- Some commands trigger animations, temporary visual effects, or playful fake shell responses.
- Unknown commands return `zsh: command not found: <input>`.
- Playgrounds are canvas-based and fully theme-aware — they resolve CSS custom properties (oklch) to sRGB via a 1×1 canvas readback technique and re-sync automatically when the theme or light/dark mode changes.
- The playground system is wired through `components/sections/playground.tsx`: adding a new playground requires creating a component in `components/playgrounds/` and registering it in `components/sections/playground.tsx`.
