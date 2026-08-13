# About V3 — media plan for every page slot

Written after the first Flow run returned frames that were technically clean and communicatively empty. This document decides what each slot holds and why, before any more credits are spent.

---

## 1. What went wrong in run one

Three concept frames came back as: an empty room with a table, sheets taped to a wall, and a book on a table. None of them says anything.

The causes, in order of size:

**The prompts described feeling instead of mechanics.** "The feeling is: this room is not open to everyone, and you specifically were expected." A model cannot render that sentence. It renders the nouns — room, table, chair, paper — and the feeling never arrives.

**The frames were too wide.** I specified "wide, from standing height." At that distance the drawn-out chair and the placed page are four percent of the image. The meaning was in a detail I then made too small to see.

**Nothing was happening.** All three were still lifes. A still life can be beautiful, but it can only mean something if the viewer already knows what it stands for. Nobody arrives at this page knowing that.

**The text rendered as prose.** My "unresolvable scale" rule failed because the sheets were shot flat and close. The model filled them with paragraphs, so they read as a manuscript. Printed design work does not look like paragraphs — it looks like rules, blocks and column edges.

---

## 2. The rule everything below follows

**Every image on this page contains a person doing something you can name in three words.**

- "He's choosing a sheet."
- "She's crossing out a line."
- "A hand folds a corner."
- "Both look at one page."

If a frame cannot be named that way, it does not get generated. This single rule removes empty rooms, material collages, moodboards, symbolic objects and architecture — not by banning them one at a time, but by making them fail the test.

**Corollary on distance.** The named action must fill at least a third of the frame. If the action is small, move the camera closer. Never place a small meaningful gesture inside a wide room and hope it reads.

**Corollary on paper.** Printed sheets in this campaign show *interface layouts* — grey rectangles, horizontal rules, column blocks, generous margins — never paragraphs of prose. This reads as design work and stays unreadable at the same time, which the prose approach failed to do.

---

## 3. Slot by slot

### Hero — A03 (Rustam, left) and A04 (Marija, right)

**Named action:** "He listens across the table." / "She checks she was understood."

Keep the concept: he's lit from frame-left, she's from frame-right, both turning inward so the shadows meet in the middle of the page.

What changes: they must be *in the room, at the table*, not on a studio backdrop. Waist-up, the table edge in the bottom of the frame, the window visible as a bright edge at the outer side. The action is the direction of attention, so the face has to be large enough to read it — head occupying roughly a quarter of the frame height, not an eighth.

Safe area unchanged: right 35% empty on his, left 35% on hers.

**Risk:** low. Portraits with clear gaze direction are the most reliable thing these models do.

### Origins — A06-01, A06-02 (Rustam) and A07-01, A07-02 (Marija)

**Named actions:** "He lifts one sheet clear." / "Screen and page align." / "She crosses out a line." / "The mark that changed it."

These were already the strongest concepts in the set and they survive unchanged, because each one has a legible action at a readable distance. Nothing here needs rewriting except the paper rule from §2 — the three interaction states must be wireframe blocks, not prose.

One tightening on `A06-01`: the lifted sheet must be lifted *visibly*, several centimetres clear with daylight in the gap beneath it. A sheet lifted one centimetre reads as a sheet lying flat.

**Risk:** medium. Two hands doing different jobs is where anatomy fails. Budget the correction round.

### Conversation reel — A13

**Named action:** "Two hands reach one page."

Overhead, both working surfaces entering from opposite edges, meeting at one untouched sheet in the centre. Hands and forearms at the outer edges, no faces.

This one keeps working because the action is the whole composition rather than a detail inside it. Centre stays clear for the play control.

**Risk:** medium-high. Overhead two-hand frames are where extra fingers appear. Generate three, expect to correct one.

### How we read a brief — A14-01, A14-02, A14-03

**This is the section that failed and this is the replacement.**

Cut all three still lifes. Replace with three close hand-actions at three different distances. No faces, so identity risk stays at zero and these can still be generated first — but now something is happening in each one.

| Slot | Phrase | Named action | Frame |
|---|---|---|---|
| A14-01 | "Exclusive, but not cold." | "A page is offered." | A hand slides one warm cotton sheet across the dark table toward the empty chair opposite. The hand is still on the paper — mid-offer, not finished. Low, close, the empty chair soft in the background. Warmth is in the gesture of giving, not in the room. |
| A14-02 | "Modern, still established." | "Page held to screen." | A hand holds a printed sheet flat against the laptop screen, edges aligned, comparing the printed layout to the live one. Both layouts visible as grey blocks. Close, three-quarter, the screen's cool light against the window's warm light. |
| A14-03 | "Memorable, not loud." | "A corner is folded." | Very close on fingers pressing one corner of a sheet into a fold. Almost macro. Nothing else in frame but paper, fingers and the fold's small shadow. |

Why these work where the still lifes didn't: each has a verb, each is close enough to see, and the three sit at genuinely different distances — table-distance, arm-distance, hand-distance. The section shows three different readings, and now the images read differently too.

**Risk:** low-medium. Single-hand close actions are among the safest generations available.

### Deliberately unillustrated

The language-continuity module, the ownership table, the credibility ledger and the inquiry form stay code-native. The ledger in particular is about claims a visitor can verify, and decorating it with photography would weaken exactly the thing it is doing.

---

## 4. Generation order

1. **A14-01, A14-02, A14-03.** No identity, low risk, and they establish the room, light and grade for everything after. If these three don't come back with legible actions, the prompts are still wrong and nothing further should be generated.
2. **CAL-R.** Identity accuracy gate. Diagnostic only — a plain portrait on a neutral background is the correct output here and should not be judged as page media.
3. **A03**, then **A03-M**.
4. **A06-01**, then **A06-02**.
5. **V01**, **V04**.
6. Handoff, then the Marija session in the same order.
7. **A13** last, once both working surfaces exist.

---

## 5. Stop generating

- Empty rooms of any kind.
- Still lifes intended to symbolise an adjective.
- Anything shot from standing height in a wide room.
- Sheets showing paragraphs of prose.
- Portraits on a seamless studio backdrop, except the calibration diagnostics.
- Any frame that cannot be named in three words with a verb in it.

---

## 6. Running total

13 stills, 4 clips. Two of the thirteen contain no person and no hand — none, after this revision. Every remaining frame has a named action.

The previous version of this plan had five frames of objects on a table. That is what produced the run-one result.
