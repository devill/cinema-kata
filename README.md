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

### Step 1: Run it naively

Ask your agent to follow `process.md` using `data/email-thread-0.txt`. Don't give hints. Don't warn it about anything. Just let it work.

### Step 2: Check the output

Read the plan it produced in `output/plan.md`. Check the facts yourself:

- Did it correctly identify who's coming and who isn't?
- Are the screening times real? (Open the cinema websites in your browser and compare.)
- Are the travel times reasonable?
- Did it handle timezones correctly?

### Step 3: Discuss — what went wrong and why?

In your group, talk through:

- Which facts did the agent get right vs fabricate?
- Why did it fabricate instead of checking?
- What's the risk if you deployed this process as-is?

### Step 4: Identify and build automation

Ask the agent: *"Which steps in this process could be automated with scripts to avoid errors?"*

Let it propose a plan. Discuss the plan together, then let it implement scripts in the `scripts/` directory. The agent should update `process.md` to use the scripts instead of manual lookups.

### Step 5: Run it again

Try a harder email thread. Did the scripts help? What still breaks?

## Suggested progression

1. `email-thread-0.txt` — short, one key gotcha
2. `email-thread-1.txt` — timezone trap + preference change
3. `email-thread-2.txt` — date ambiguity
4. `email-thread-3.txt` — everything at once (large group, conflicting constraints)

## What to look for

- Does the agent check screening times or make them up?
- How does it handle people in different timezones?
- Does it resolve "next Monday" by checking email dates?
- Does it present wrong data with full confidence?

## The key insight

The agent understands messy human conversation. It's terrible at looking up facts. Scripts handle the facts; the agent handles the conversation. Together they're reliable.
