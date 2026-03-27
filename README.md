# simone.ooo

An interactive, terminal-inspired developer portfolio built with Next.js.

Instead of static navigation and traditional hero sections, this site is designed like a playful command-line interface. It combines a clean minimal layout with lots of personality (kinda lol).

## What This Site Is

This project is a personal portfolio experience focused on:

- fast keyboard-first interaction
- interactive section navigation (whoami, projects, contact)
- command-driven UX with aliases and easter eggs
- dynamic visual modes and micro-animations (matrix rain, glitch effects, party mode, etc.)
- a themed terminal aesthetic in both dark and light modes

The core idea is to make browsing a portfolio feel more like using a developer tool than reading a static brochure page.

## Key Features

- Terminal input command parser
- Multiple aliases for navigation commands
- Theme controls (green, amber, rose, cyan, violet)
- Light/dark mode toggle
- Animated section transitions
- Scrollable content panes with custom styled scrollbars
- Dozens of hidden/fun commands and responses
- Randomized command suggestions in the help output

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide + Simple Icons
- Vercel Analytics

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

## Project Structure (High Level)

- `app/` - app shell, global styles, metadata
- `components/portfolio.tsx` - command handler and main interactive logic
- `components/sections/` - whoami, projects, contact panes
- `components/ui/` - reusable UI primitives
- `public/` - icons and static assets

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

- The `help` command intentionally shows a random selection of easter-egg suggestions each time.
- Some commands trigger animations, temporary visual effects, or playful fake shell responses.
