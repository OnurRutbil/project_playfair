# Playfair Cipher AI Tutor

An interactive educational tool that visualizes and teaches the Playfair Cipher step-by-step. Features a dynamic 5×5 matrix, a guided tutor mode, bidirectional navigation through pair processing, and one-click cross-tab workflow.

## Features

### Core Cipher
- **Dynamic 5×5 Matrix** — Generates in real-time as you type the Master Keyword (always forced to uppercase). Duplicate letters and I/J merging are explained inline.
- **Encrypt & Decrypt tabs** — Separate panels each with their own matrix and state, switchable at any time.
- **Quick Examples** — Pre-loaded keyword + message pairs for instant demonstration.

### Step-by-Step Tutor Mode
- **Preparation step** — Shows how the plaintext is cleaned into digraphs, with X-wedge insertion explained for double letters and odd-length messages.
- **Process Next Pair →** — Advances through one digraph at a time, highlighting the active cells on the matrix and drawing arrows between input and output positions.
- **← Go Back** — Undoes the last processed pair. Keeps going back until the very beginning; pressing Go Back at step 0 reopens the tutorial modal.
- **Click any processed pair** — Clicking a greyed-out pair in the prepared-message display jumps back to that point, restoring the output to what it was before that pair was processed. Works the same way in both Encrypt and Decrypt tabs.

### Copy & Cross-Tab Workflow
- **Copy** — Copies the current result to the clipboard at any point during processing.
- **Copy & Open in Decrypt / Encrypt →** — Copies the result and instantly switches to the other tab with the same keyword and the result pre-filled, ready to start the next tutor session. Resets the target tab if a session was already running there.

### Quality-of-Life
- Master Keyword is always uppercase — typing is forced; no silent lowercase mismatches.
- Keyword is preserved across "Start New Message" resets so you can explore multiple messages with the same key without re-typing it.
- Toast notification confirms clipboard copy actions.
- Onboarding tour and help modal (reopenable via the **?** button) explain all controls including the new navigation features.

## How to Use

1. **Choose a Master Keyword** — default is `PLAYFAIR`. The 5×5 matrix updates live.
2. **Type or pick a message** — Use the Quick Examples dropdown or write your own.
3. **Click Start Encryption / Decryption Tutor** — Inputs lock and the prepared digraph list appears.
4. **Step through with Process Next Pair →** — Each click processes one letter pair and explains the rule used (Row, Column, or Rectangle).
5. **Navigate freely** — Use ← Go Back or click any processed pair to revisit earlier steps.
6. **Copy the result** — Use Copy for the clipboard, or Copy & Open in Decrypt to verify the round-trip automatically.
7. **Start New Message** — Resets the session but keeps your keyword.

## Technical Notes

- Pure vanilla JavaScript, HTML5, CSS3 — no dependencies or build step.
- Open `index.html` directly in any modern browser.
- I and J share a single cell in the matrix (standard Playfair convention).
- The decrypted output automatically removes X separators and trailing X padding added during encryption.

## AI Tools Used

This project was developed with assistance from the following AI tools:

- **Anthropic Claude** (claude.ai) — used for [e.g. generating the 
  step-by-step tutor logic, CSS styling, debugging the digraph 
  preparation].

- **Google Gemini** (gemini.google.com) — used for [e.g. initial 
  structure and matrix rendering logic].

The generated outputs were reviewed, tested, and adapted. 
