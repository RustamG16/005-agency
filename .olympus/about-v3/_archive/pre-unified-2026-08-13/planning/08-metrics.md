# Design measurement plan

## Hypothesis

Because `/about-v3` replaces abstract studio decoration with a two-founder explanation of interpretation, responsibility and real founder evidence for premium decision-makers, we expect the proportion of About visitors who begin and successfully submit a project inquiry to move upward from an unknown baseline during the first 8–12 weeks after launch, without increasing submission errors, poor-quality inquiries, mobile exits or page-performance regressions.

## Baseline

- **Source/date range:** none supplied; no analytics provider or prior About conversion baseline is available.
- **Primary metric:** successful project inquiry submissions attributed to `/about-v3` divided by eligible `/about-v3` page sessions, interpreted together with manual inquiry quality.
- **Leading indicators:** inquiry starts; intentional showreel plays.
- **Guardrails:** provider submission error rate, duplicate submissions, mobile/desktop disparity, Core Web Vitals/page weight, accessibility defects and the percentage of inquiries that are obviously irrelevant/spam.
- **Data limitations:** launch traffic may be low and non-random; there is no clean A/B control, consent status is unknown, attribution may be incomplete and qualified-inquiry judgment is manual. Do not claim statistical certainty from a small sample.

## Event contract

Use the site's existing analytics taxonomy if one is installed later. The names below are a provider-neutral fallback. Do not instrument decorative seam/scroll animations.

| Event | Exact trigger | Required properties | Duplicate prevention | Purpose | Privacy/consent note |
|---|---|---|---|---|---|
| `about_v3_view` | Once when `/about-v3` is loaded and visible | `page: "about-v3"`, `viewport: mobile/tablet/desktop`, `referrer_group` | Once per page navigation/session history entry | Denominator and device/referrer diagnosis | Anonymous only; emit only under the site's approved analytics consent policy. Do not store full referrer URLs containing personal data. |
| `about_v3_showreel_play` | First intentional user play of the full showreel, not muted preview autoplay | `page`, `viewport`, `media_id: "about-v3-showreel"` | Once per page navigation | Tests whether early sensory proof is used | No identity; consent policy applies. |
| `inquiry_start` | First focus/input within the About compact inquiry | `page`, `variant: "about-compact"`, `viewport` | Once per form instance/page navigation | Leading indicator for conversion friction | Never send typed values, name, email, company or message. |
| `inquiry_submit_result` | After the server returns a confirmed delivery result | `page`, `variant`, `result: success/validation_error/provider_error/rate_limited`, optional `error_code` from a fixed non-sensitive enum | One event per submit attempt ID; client retries create a new attempt ID | Primary outcome and failure diagnosis | Never send raw payload, field contents or provider response bodies. The delivery system—not client optimism—defines success. |
| `about_v3_outbound_proof` | Intentional open of Rustam portfolio/CV or a selected independent-work link | `page`, `destination_type: portfolio/cv/independent_work`, `link_id` from a fixed list | Once per link click | Diagnoses which proof helps evaluation | No destination query strings or personal data. |

## Inquiry quality

The event stream cannot decide whether an inquiry is qualified. Maintain a simple private manual review field outside analytics:

- `fit`: strong / possible / not-fit / spam
- `sector`: broad non-sensitive category
- `estimated_scope`: small / medium / large, only if voluntarily provided
- `source`: About V3 / Contact / referral / unknown

Do not put message text, names, email addresses or negotiation notes into analytics.

## Readout

- **Comparison method:** phased launch with pre/post comparison only if the existing About route is measured before redirecting; otherwise use a single-page launch baseline plus moderated qualitative review of the first serious prospect conversations. Keep seasonality and source-mix caveats explicit.
- **Segments:** mobile vs desktop and broad referrer group only when sample size is large enough to change a design decision.
- **Minimum observation window:** 8–12 weeks; extend rather than over-interpret if traffic or inquiry count is sparse.
- **Decision rule:** keep the direction if it produces technically successful submissions and the founders judge the resulting conversations as better informed about direct access, interpretation and premium digital capability. Investigate rather than redesign if showreel play is low but inquiry quality is strong. Repair immediately if provider errors, mobile form abandonment or performance regressions are evidenced.
- **Owner:** Rustam for instrumentation and technical readout; Rustam and Marija jointly for manual inquiry-quality review.

## Implementation permission

No analytics provider is installed or authorized by this planning task. The implementation window may add this contract only after the user approves a provider, consent behavior and external state changes. Until then, keep the event calls behind a local typed adapter/no-op boundary rather than installing tracking speculatively.
