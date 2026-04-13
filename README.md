# Cinema Kata — "Show the Agent, Let It Automate"

## Overview

A group of friends near the Hungary-Romania border want to go to the cinema. You have a process file, their email threads, and three cinema websites. Ask an agent to follow the process — then figure out what went wrong and fix it with automation.

## Prerequisites

- A coding agent (Claude Code, Cursor, etc.)
- Node.js installed
- Start the cinema server:
  ```bash
  cd server && npm install && node index.js
  ```
  This runs three cinema websites on http://localhost:3000.

## The Exercise

1. **Understand.** Read `process.md` and understand the task.
2. **Run it naively.** Ask your agent to follow `process.md` using `data/email-thread-0.txt`. No hints.
3. **Check the output.** Open `output/plan.md`. Are the screening times real? Did it get who's coming right? Check against the cinema websites yourself.
4. **Discuss.** What did it get right vs fabricate? Why? What's the risk?
5. **Automate.** Ask the agent which steps could be replaced with scripts. Discuss, then let it build them in `scripts/`. Ask the agent to modify the process to use the scripts. 
6. **Run it again** with a harder email thread. Did the scripts help?


## What to look for

- Does the agent check screening times or make them up?
- How does it handle people in different timezones?
- Does it resolve "next Monday" by checking email dates?
- Does it present wrong data with full confidence?

