# Copy-ready prompt for a new Codex chat

Continue the Convenium `/about-v3` media-planning task. Do not edit the page or implement the redesign yet.

Project root:

`C:\Users\Rustam Gurbanov\Desktop\DigitalAgency_Saas\lab\005-agency`

Start by reading these files completely:

1. `C:\Users\Rustam Gurbanov\Desktop\DigitalAgency_Saas\lab\005-agency\.olympus\about-v3\media\MEDIA-PLANNING-HANDOFF.md`
2. `C:\Users\Rustam Gurbanov\Documents\Codex\2026-08-12\realtime-voice-chat-2\outputs\about-page-redesign-brief.md`
3. `D:\Analyst_Designer\skills\emil-design-eng\SKILL.md`

Use the Emil design-engineering skill instead of the Awwwards design skill. Follow the Apollo/Olympus approval gates, but do not restart the completed intake discussion or create three new concepts: the user-selected direction is already documented in the media handoff. Inspect existing project evidence only as needed.

The approved visual master is:

`C:\Users\Rustam Gurbanov\Downloads\hero-composition-reference_202608131312.jpeg`

Important locked decisions:

- Every section must feel like the same ivory/black/burgundy editorial website shown by the visual master.
- Hero stays independent and faceless: Rustam left, Marija right.
- The founder reveal is the next, separate section—not a hero morph.
- Founder reveal uses a separate black/red studio, never the Convenium office.
- It is one silent ~10-second 16:9 video: Rustam left and Marija right walk toward the camera as silhouettes; faces reveal only at portrait distance.
- The video keeps playing normally if the user scrolls. It must not scrub or reverse.
- The section may softly pin during playback. A second strong scroll/swipe must allow a skip to the completed state so users are not trapped.
- Once the founders stop, code splits the same video into two portrait crops/cards, then crossfades to matched high-resolution stills. Seedance creates the walk only; CSS/GSAP creates the split.
- Scrolling upward shows the completed card state instead of reversing or replaying the walk.
- Rustam media first. Marija-only and joint media remain labeled placeholders until her identity sources are supplied.
- Use original real Rustam photos for every identity-sensitive generation; never use generated derivatives as the sole identity authority.
- Office and reveal studio are two different locations and must never be combined.
- Use Sonnwerk and Meridian only for the About proof section. These are proposed redesigns/negotiation-stage work, not launched results; do not invent metrics or claims.
- Apollo may be shown publicly only as a safe system surface, without exposing prompts or enough internal logic to reproduce it.
- Maximum expressive capability is welcome, but motion must be smooth, purposeful, non-repetitive, and accessible.

Work with me section-by-section. Start with Section 02, the founder reveal, because its interaction and required media need to be fully locked before we proceed. First restate the proposed Section 02 sequence in a compact form and ask only the remaining questions that materially affect its framing, wardrobe, lighting, portrait-card endpoint, skip behavior, or asset requirements. Do not generate media until I approve the section. After approval, create only the smallest useful visual batch: a wide starting frame, a wide near-camera/final-video frame, and the final split-card state. Keep the hero out of those Section 02 frames.

Do not delete existing files yet. The `media\flow` batch and the earlier transition mockups are rejected/superseded but must remain until I confirm the cleanup scope.

After every section is approved, update `MEDIA-PLANNING-HANDOFF.md` and the asset manifest. Only when all sections are locked should you prepare the implementation plan and production documents for my approval. Do not edit `/about-v3` before that approval.

