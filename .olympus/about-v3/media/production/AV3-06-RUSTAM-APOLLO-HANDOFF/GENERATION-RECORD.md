# AV3-06 Rustam / Apollo handoff — generation record

Status: **IMPLEMENTATION CANDIDATE — USER REVIEW DEFERRED**
Generated: 2026-08-13
Provider: authenticated Higgsfield
Model: GPT Image 2 (`gpt_image_2`)

## Authorization and cost

- The user first confirmed that the existing Rustam references may be used and that they accurately represent him.
- On 2026-08-13 the user explicitly instructed: `generate the planned media as well, just skip my approval, we polish it afterwards`.
- This instruction superseded the prompt-by-prompt pause for this bounded session while retaining the existing provider, one-candidate and credit-ceiling rules.
- Pre-batch balance: 732 credits.
- Fresh quote: 12 credits per 4K image.
- Generated candidates: one start keyframe and one endpoint keyframe.
- Total batch cost: 24 credits.
- Post-batch balance: 708 credits.
- Automatic retry: none.
- No video generation was submitted. The browser transition between the two stills communicates the handoff without another paid job.

## Outputs

| File | Dimensions | Bytes | SHA-256 |
|---|---:|---:|---|
| `AV3-06-handoff-start-v1.png` | 3840×2160 | 9,645,321 | `51F78DD2AAB80D9B599D8E9EF23D470762C402A2DA882E5A76AD67A381B52AF3` |
| `AV3-06-handoff-end-v1.png` | 3840×2160 | 9,770,062 | `490AA229B7C002B72479473DECFA103D55E7B638F8928F931A5EEDE62E930DD6` |

Provider results:

- Start: `https://d8j0ntlcm91z4.cloudfront.net/user_3G0M7V2yz7lBGPuQMnkI2vjG7c5/hf_20260813_204422_754d8dee-47d1-4e8b-b6bc-964630dcf4b5.png`
- Endpoint: `https://d8j0ntlcm91z4.cloudfront.net/user_3G0M7V2yz7lBGPuQMnkI2vjG7c5/hf_20260813_204736_ee37d621-e76d-4295-a615-56fe30e3e18f.png`

## Reference roles

Every identity-sensitive generation included original Rustam references; a generated derivative was never the sole identity authority.

1. `design_claude/me/Full-body_triptych,_three_distinct_views__202607230052.jpeg` — original neutral body, wardrobe and proportion authority.
2. `design_claude/me/A_professional_studio_portrait_of_202607230052.jpeg` — original front-face and hair authority; green lighting was not carried into the scene.
3. `design_claude/me/Russeye_staring_into_lens_2K_202607230144.jpeg` — original facial-detail authority.
4. `../AV3-06-APOLLO-MASTER/AV3-06-apollo-receiving-pose-v1.png` — locked Apollo identity, material, halo, core and receiving-pose authority.
5. `../AV3-03-COMPANION-MASTER/AV3-03-companion-neutral-master-v1.png` — locked compact companion identity, material, scale and intact-core authority.
6. `AV3-06-handoff-start-v1.png` — composition and scene-continuity authority for the endpoint only; original Rustam references were supplied again beside it.

## Verbatim start-keyframe prompt

> Create the START KEYFRAME of a restrained editorial studio handoff sequence for Convenium. Preserve the exact identity, face, hair, body proportions, and natural age of Rustam Gurbanov from the first three original identity reference photos. Preserve Apollo exactly from the Apollo reference: calm cracked ivory humanoid figure, complete thin halo, dark internal channels, fine gold fissures, restrained cyan core. Preserve the small companion exactly from its reference: one compact vulnerable ivory-and-burgundy mechanical creature with one intact amber core, never enlarged or humanoid. Fixed 16:9 camera, deep black and burgundy stage, bone-white acrylic work surface, sparse registration marks, no office. Rustam stands on the LEFT in a black long-sleeve shirt and black trousers, three-quarter view toward the center, calmly holding the compact companion in both hands with a single thin transparent burgundy-lit plan tablet beside it. Apollo stands CENTER-RIGHT with open empty hands ready to receive. Clear handoff gap between them. Serious care and accountability, not worship, spectacle, combat, medicine, or sci-fi action. No treatment or construction has begun. No readable text, logos, watermark, extra people, extra hands, duplicate companion, weapons, or energy beams. Leave clean negative space in the upper-left for live HTML copy. Photoreal editorial lighting, warm ivory highlights, restrained burgundy glow, subtle brass detail, cinematic but credible, faces and hands anatomically correct.

## Verbatim endpoint prompt

> Create the ENDPOINT KEYFRAME of the exact same restrained Convenium handoff scene shown in the first reference. Preserve the fixed camera, crop, deep black and burgundy stage, acrylic surface, lighting, spacing, wardrobe, and every character identity. Preserve the exact identity, face, hair, body proportions, and natural age of Rustam Gurbanov from the next three original identity reference photos. Preserve Apollo exactly from the Apollo authority and preserve the compact companion exactly from its character authority. Continue only one quiet physical action: Apollo has carefully received the same small companion and the same thin transparent burgundy-lit plan tablet in both hands at the center-right. Rustam remains on the LEFT, hands just released and lowered slightly, watching with calm accountability. The companion remains one compact unchanged subject with intact amber core, never enlarged or humanoid. Apollo remains calm; the cyan core is restrained. This is acceptance of responsibility only: no treatment, building, repair, transformation, magic, worship, spectacle, combat, medicine, or sci-fi action has begun. No readable text, logos, watermark, extra people, extra hands, duplicate companion, weapons, or energy beams. Keep clean negative space in the upper-left for live HTML copy. Photoreal editorial lighting, warm ivory highlights, restrained burgundy glow, subtle brass detail, cinematic but credible, faces and hands anatomically correct.

## Initial review and implementation relationship

- Pass: Rustam is recognisable and remains on the left in both frames.
- Pass: Apollo stays center-right and retains the locked cracked-ivory, gold-fissure, cyan-core and halo identity.
- Pass: one compact companion stays at the established apparent scale with its core intact.
- Pass: start and endpoint describe one restrained physical handoff with no treatment or construction beginning.
- Pass: no embedded readable text, logo, watermark, extra person or duplicate companion appears.
- Pass: the fixed wide composition supports a browser-native forward crossfade and adjacent live explanatory copy.
- Caveat: these are implementation candidates, not user-locked production authorities. Identity polish, tattoo/wardrobe detail and final crop can be reviewed later as the user requested.
- Delivery derivatives under `public/images/about-v3/` are local WebP encodes; the PNG files in this folder remain the generation masters.
