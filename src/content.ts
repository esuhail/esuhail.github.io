// Everything the page says lives here. Components only decide how it looks,
// so updating a project means editing this file, not hunting through JSX.

import type { LucideIcon } from "lucide-react";
import { Cpu, GraduationCap, Swords } from "lucide-react";

export const person = {
  name: "Ehsan Suhail",
  intro: "Computer science student at George Mason University, graduating May 2028.",
  email: "esuhail731@gmail.com",
  github: "https://github.com/esuhail",
  githubUser: "esuhail",
  linkedin: "https://www.linkedin.com/in/esuhail",
};

export type Link = { label: string; href: string };
export type Decision = { problem: string; solution: string };

export type Project = {
  id: string;
  repo: string;
  icon: LucideIcon;
  name: string;
  summary: string;
  live?: Link;
  source: Link;
  stack: string[];
  image: { src: string; width: number; height: number; alt: string; shape: "wide" | "tall" };
  why: { title: string; body: string[] };
  decisions: { title: string; items: Decision[] };
  proof: string[];
  hasEstimator?: boolean;
  note?: { title: string; body: string };
};

export const projects: Project[] = [
  {
    id: "llm-bench",
    repo: "llm-bench",
    icon: Cpu,
    name: "LLM Bench",
    summary: "Check which AI models your graphics card can run, and how fast, before downloading them.",
    live: { label: "Open live site", href: "https://llm-bench.onrender.com" },
    source: { label: "Source", href: "https://github.com/esuhail/llm-bench" },
    stack: ["Python", "FastAPI", "PostgreSQL", "SQLite", "JavaScript", "Ollama", "GitHub Actions", "Render"],
    image: {
      src: "/img/llm-bench.webp", width: 1600, height: 911, shape: "wide",
      alt: "LLM Bench home page: a graphics card picker set to RX 6750 XT, and a speed race where three models write the same paragraph at their measured speeds.",
    },
    why: {
      title: "Why I built it",
      body: [
        "Local AI models are multi-gigabyte downloads, and you can't tell whether one runs well on your card until you've already downloaded it. I wanted a site someone who only knows the names ChatGPT and Claude could use: pick your graphics card, see what fits, see how fast it will answer.",
        "Writing one token means reading every active weight from graphics memory once, so speed is mostly limited by memory bandwidth. My first formula made a 0.6B model look half as efficient as a 9B model on the same card. Adding a fixed cost of about 1 ms per token fixed it: both came out near 55% efficiency.",
      ],
    },
    decisions: {
      title: "Getting numbers I could trust",
      items: [
        { problem: "The first run included the time to load the model", solution: "A warm-up run before measuring." },
        { problem: "Ollama cached prompts, so repeat runs looked faster", solution: "A unique prefix on every prompt." },
        { problem: "Thinking models generated thousands of hidden tokens", solution: "Thinking turned off for benchmarks." },
        { problem: "One model ran about 4% slower because of its own sampling default", solution: "The same sampling settings for every model." },
      ],
    },
    proof: [
      "22 pytest tests run on every push with GitHub Actions.",
      "Estimates are checked with leave-one-out testing against real benchmark results.",
      "Download and benchmark endpoints only run on your own machine and reject requests from other sites.",
    ],
    hasEstimator: true,
  },
  {
    id: "duel",
    repo: "duel",
    icon: Swords,
    name: "Duel",
    summary: "Quick 1v1 minigames against a friend, best of 3 or 5, from a 4-letter room code. No accounts and no game server.",
    live: { label: "Play Duel", href: "https://esuhail.github.io/duel/" },
    source: { label: "Source", href: "https://github.com/esuhail/duel" },
    stack: ["TypeScript", "React", "Vite", "WebRTC (PeerJS)", "Vitest", "Playwright", "GitHub Actions", "GitHub Pages"],
    image: {
      src: "/img/duel.webp", width: 840, height: 1720, shape: "tall",
      alt: "Duel start screen on a phone: four boxes for a room code, an on-screen letter keypad, and a Quick duel button.",
    },
    why: {
      title: "Why I built it",
      body: [
        "I wanted something my friends and I could open on our phones and play right away. Hosting a game server costs money and needs upkeep, so the host's browser is the server and the two phones talk directly over WebRTC. It costs nothing to run.",
      ],
    },
    decisions: {
      title: "Decisions that made it work",
      items: [
        { problem: "Lag shouldn't decide who wins", solution: "Both phones build the same puzzle from a shared seed (mulberry32) and play it locally, then send one score. Nothing crosses the network during a round." },
        { problem: "Both players need to start at the same moment", solution: "The guest pings the host 5 times, keeps the fastest round trip, and estimates the clock difference. The countdown lands within about 20 ms." },
        { problem: "Syncing whole game states is fragile", solution: "The match rules are one pure reducer that runs on both phones. The host sends the event it just applied, not the new state, so messages stay tiny." },
        { problem: "Phones drop connections", solution: "A heartbeat notices a lost player within about 8 seconds, the guest retries the same room, and the host waits 30 seconds before calling a forfeit." },
      ],
    },
    proof: [
      "48 Vitest tests: every puzzle reproduces from its seed, plus ties, forfeits, rejoins and garbage messages.",
      "7 Playwright tests open two browser windows and let bots play full matches, then a rematch.",
      "A real match between a phone on cellular data and a laptop on home Wi-Fi.",
      "CI runs on every push and deploys to GitHub Pages.",
    ],
  },
  {
    id: "canvas",
    repo: "canvas-companion",
    icon: GraduationCap,
    name: "Canvas Grade Companion",
    summary: "A Chrome side panel that recalculates your Canvas grades, checks them against Canvas's own totals, and tells you what you need on the work that's left.",
    source: { label: "Source", href: "https://github.com/esuhail/canvas-companion" },
    stack: ["TypeScript", "React", "Chrome extension (WXT)", "Vitest", "Playwright", "GitHub Actions"],
    image: {
      src: "/img/canvas-up-next.webp", width: 760, height: 1520, shape: "tall",
      alt: "Canvas Grade Companion side panel showing upcoming work ranked by how much of the grade each item is worth and when it is due.",
    },
    why: {
      title: "Why I'm building it",
      body: [
        "Canvas shows a total but not how it got there, and it can't answer the question students actually have: what do I need on the final? This panel works that out, and it only calls a number verified when it matches what Canvas reports.",
      ],
    },
    decisions: {
      title: "What it does",
      items: [
        { problem: "Verified grades", solution: "Recalculates every course total, including weighted categories and drop rules, and compares it with Canvas. On a real GMU account, every course with a reported total came out verified." },
        { problem: "Target solver", solution: "Pick a target grade and it answers in one sentence: the average you need on what's left, that you're already safe, or that the target is out of reach and what the ceiling is." },
        { problem: "Up next", solution: "One list across all courses, ranked by how much each item is worth and how soon it's due." },
        { problem: "Syllabus check", solution: "Reads grade weights and dates from a syllabus PDF and shows where it disagrees with Canvas." },
      ],
    },
    proof: [
      "190 Vitest unit tests. Drop rules are checked against a brute-force version, and every solver answer is fed back through the grade engine.",
      "An end-to-end test loads the built extension in Chrome against a stand-in Canvas server and asserts it only ever sends read requests.",
      "Read-only by design: no server, no account, no access token. Nothing leaves the browser.",
    ],
  },
];

export type SkillGroup = { title: string; skills: { name: string; usedIn: string[] }[] };

const LB = "LLM Bench", DU = "Duel", CA = "Canvas", SITE = "This site";

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", usedIn: [LB] },
      { name: "TypeScript", usedIn: [DU, CA, SITE] },
      { name: "JavaScript", usedIn: [LB] },
      { name: "SQL", usedIn: [LB] },
      { name: "Java", usedIn: ["Coursework"] },
      { name: "PowerShell", usedIn: [LB] },
      { name: "HTML and CSS", usedIn: [LB, DU, CA, SITE] },
    ],
  },
  {
    title: "Frameworks and testing",
    skills: [
      { name: "FastAPI and REST APIs", usedIn: [LB] },
      { name: "React", usedIn: [DU, CA, SITE] },
      { name: "Vite", usedIn: [DU, CA, SITE] },
      { name: "pytest", usedIn: [LB] },
      { name: "Vitest", usedIn: [DU, CA, SITE] },
      { name: "Playwright", usedIn: [DU, CA] },
    ],
  },
  {
    title: "Tools and platforms",
    skills: [
      { name: "Git and GitHub Actions", usedIn: [LB, DU, CA, SITE] },
      { name: "PostgreSQL and SQLite", usedIn: [LB] },
      { name: "Render", usedIn: [LB] },
      { name: "GitHub Pages", usedIn: [DU, SITE] },
      { name: "WebRTC", usedIn: [DU] },
      { name: "Ollama", usedIn: [LB] },
      { name: "Chrome extensions", usedIn: [CA] },
    ],
  },
  {
    title: "Concepts",
    skills: [
      { name: "Peer-to-peer networking", usedIn: [DU] },
      { name: "State machines", usedIn: [DU] },
      { name: "LLM inference", usedIn: [LB] },
      { name: "Performance benchmarking", usedIn: [LB] },
      { name: "Unit and end-to-end testing", usedIn: [LB, DU, CA] },
    ],
  },
];

export const education = {
  school: "George Mason University",
  place: "Fairfax, VA",
  degree: "B.S. in Computer Science",
  date: "May 2028",
  gpa: "3.3",
  coursework: ["Data Structures", "Object-Oriented Programming", "Discrete Mathematics", "Calculus I and II"],
  certifications: [
    { name: "Google Cybersecurity Professional Certificate", year: "2025" },
    { name: "IBM Cybersecurity Analyst Professional Certificate", year: "2025" },
  ],
};
