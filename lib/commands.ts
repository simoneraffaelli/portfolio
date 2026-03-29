import type { Section } from "./types"

export type CommandResult = { success: boolean; message?: string }

export const sectionAliases: Record<string, Section> = {
  about: "whoami",
  me: "whoami",
  who: "whoami",
  bio: "whoami",
  whoami: "whoami",
  projects: "projects",
  work: "projects",
  portfolio: "projects",
  builds: "projects",
  ls: "projects",
  contact: "contact",
  email: "contact",
  hire: "contact",
  reach: "contact",
  mail: "contact",
}

const easterEggCommands = [
  "matrix",
  "party",
  "glitch",
  "meow",
  "flip",
  "barrel roll",
  "bluepill",
  "konami",
  "iddqd",
  "rickroll",
  "sudo make me a sandwich",
  "fortune",
  "spin",
  "xyzzy",
]

export function pickRandomEasterEggCommands(count: number): string[] {
  const pool = [...easterEggCommands]

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, Math.min(count, pool.length))
}

/**
 * Pure response commands — no React state or DOM side effects needed.
 * Maps command aliases to their response message.
 */
const staticCommands: Record<string, string> = {
  "bluepill": "ignorance is bliss",
  "woof": "wrong species, try 'meow'",
  "bark": "wrong species, try 'meow'",
  "coffee": "brewing... error 418: i'm a teapot",
  "brew": "brewing... error 418: i'm a teapot",
  "java": "NullPointerException",
  "javascript": "[] + [] = '' ... trust me",
  "js": "[] + [] = '' ... trust me",
  "rust": "memory safety guaranteed (compiler screaming)",
  "python": "import antigravity",
  "pwd": "~/dev/portfolio",
  "cd ..": "you're already home",
  "cd": "you're already home",
  "cd ~": "you're already home",
  "cat": "meow? try the 'meow' command",
  "dog": "woof woof",
  "cow": " ____\n< moo >\n ----\n   ^__^\n   (oo)\\_______\n   (__)\\       )",
  "cowsay": " ____\n< moo >\n ----\n   ^__^\n   (oo)\\_______\n   (__)\\       )",
  "theme": "try: theme green | amber | rose | cyan | violet",
  "themes": "try: theme green | amber | rose | cyan | violet",
  "colors": "try: theme green | amber | rose | cyan | violet",
  "vim": "good luck exiting! (hint: :q!)",
  "nvim": "i see you're a person of culture",
  "neovim": "i see you're a person of culture",
  "emacs": "M-x butterfly",
  "nano": "a sensible choice",
  "code": "you're already looking at code",
  "vscode": "you're already looking at code",
  "cursor": "ai-powered fingers go brrrr",
  "git": "on branch main, portfolio looking fresh",
  "git status": "on branch main, portfolio looking fresh",
  "git push": "everything up-to-date",
  "git pull": "already up to date",
  "git commit": "nothing to commit, working tree clean",
  "npm": "added 847 packages in 0.3s",
  "npm install": "added 847 packages in 0.3s",
  "pnpm": "added 847 packages in 0.3s",
  "yarn": "added 847 packages in 0.3s",
  "bun": "added 847 packages in 0.3s",
  "deno": "permission denied. grant with --allow-dinosaur",
  "ping": "pong! 64 bytes, time=0.042ms",
  "pong": "ping! ...wait",
  "42": "the answer to life, the universe, and everything",
  "answer": "the answer to life, the universe, and everything",
  "69": "nice",
  "420": "blaze it",
  "xyzzy": "a hollow voice says 'fool'",
  "iddqd": "god mode activated (not really)",
  "exit": "there is no escape... refresh to restart",
  "quit": "there is no escape... refresh to restart",
  "q": "there is no escape... refresh to restart",
  ":q": "there is no escape... refresh to restart",
  ":q!": "there is no escape... refresh to restart",
  ":wq": "there is no escape... refresh to restart",
  "weather": "partly cloudy with a chance of commits",
  "version": "portfolio v2.0.0 (built with next.js)",
  "-v": "portfolio v2.0.0 (built with next.js)",
  "--version": "portfolio v2.0.0 (built with next.js)",
  "man": "RTFM: type 'help' for available commands",
  "make": "no makefile found, this is 2026",
  "make install": "no makefile found, this is 2026",
  "love": "<3",
  "heart": "<3",
  "<3": "<3",
  "thanks": "you're welcome! enjoy exploring",
  "thank you": "you're welcome! enjoy exploring",
  "thx": "you're welcome! enjoy exploring",
  "sorry": "no worries!",
  "please": "since you asked nicely... type 'help'",
  "money": "let's discuss that over coffee",
  "salary": "let's discuss that over coffee",
  "pay": "let's discuss that over coffee",
  "music": "lo-fi beats to code to...",
  "play": "lo-fi beats to code to...",
  "sleep": "developers don't sleep, they await",
  "zzz": "developers don't sleep, they await",
  "sudo make me a sandwich": "ok.",
  "make me a sandwich": "what? make it yourself",
  "hello world": "console.log('hello world')",
  "rickroll": "never gonna give you up, never gonna let you down...",
  "rick": "never gonna give you up, never gonna let you down...",
  "sus": "that's kinda sus",
  "amogus": "that's kinda sus",
  "among us": "that's kinda sus",
  "bruh": "bruh moment",
  "lol": "glad you're having fun!",
  "lmao": "glad you're having fun!",
  "haha": "glad you're having fun!",
  ":(": "turn that frown upside down :)",
  "sad": "turn that frown upside down :)",
  ":)": ":D",
  "happy": ":D",
  "smile": ":D",
  "ai": "i'm something of an ai myself",
  "chatgpt": "i'm something of an ai myself",
  "gpt": "i'm something of an ai myself",
  "claude": "i'm something of an ai myself",
  "blockchain": "it's just a linked list with extra steps",
  "crypto": "it's just a linked list with extra steps",
  "web3": "it's just a linked list with extra steps",
  "serverless": "there's still a server, it's just not your problem",
  "cloud": "it's just someone else's computer",
}

const randomResponses: Record<string, string[]> = {
  "hello": ["hey there!", "hello friend", "greetings, human", "sup!"],
  "hi": ["hey there!", "hello friend", "greetings, human", "sup!"],
  "hey": ["hey there!", "hello friend", "greetings, human", "sup!"],
  "yo": ["hey there!", "hello friend", "greetings, human", "sup!"],
  "fortune": [
    "the best code is no code at all",
    "it works on my machine",
    "undefined is not a function",
    "have you tried turning it off and on again?",
    "there are only 2 hard problems: cache invalidation, naming things, and off-by-one errors",
    "99 bugs in the code, take one down, patch it around, 127 bugs in the code",
    "works on my machine - ship it!",
    "git push --force (and pray)",
  ],
  "quote": [
    "the best code is no code at all",
    "it works on my machine",
    "undefined is not a function",
    "have you tried turning it off and on again?",
    "there are only 2 hard problems: cache invalidation, naming things, and off-by-one errors",
    "99 bugs in the code, take one down, patch it around, 127 bugs in the code",
    "works on my machine - ship it!",
    "git push --force (and pray)",
  ],
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Returns a result for commands that don't need React state or DOM side effects.
 * Returns `null` if the command needs to be handled by the component.
 */
export function getStaticResponse(command: string): CommandResult | null {
  if (staticCommands[command]) {
    return { success: true, message: staticCommands[command] }
  }

  if (randomResponses[command]) {
    return { success: true, message: pickRandom(randomResponses[command]) }
  }

  // Dynamic computed responses
  switch (command) {
    case "date":
    case "now":
      return {
        success: true,
        message: new Date().toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        }),
      }
    case "time":
      return { success: true, message: new Date().toLocaleTimeString() }
    case "uptime":
      return { success: true, message: `up ${Math.floor(Math.random() * 365)} days, still coding` }
    case "help":
    case "?":
    case "commands": {
      const suggestions = pickRandomEasterEggCommands(3)
      return {
        success: true,
        message: `whoami, projects, contact, playground <name> | all-commands | and also: ${suggestions.join(", ")}`,
      }
    }
  }

  return null
}
