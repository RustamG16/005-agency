# Measurement note

Analytics access and an implementation request were not supplied, so no tracking code, experiment, or fabricated baseline was added.

The page's intended business signal is qualified progression from `/about-v2` to `/contact`. If analytics enters scope later, the minimal useful contract is:

- `about_v2_view` — route load; properties: viewport class and motion preference.
- `about_v2_founders_view` — founder chapter reaches 50% visibility; properties: viewport class.
- `about_v2_contact_click` — body CTA activation; properties: placement=`closing_chapter` and viewport class.

Primary comparison: qualified contact-click rate from `/about-v2` versus the current `/about`, guarded by page-load performance, WebGL failure rate, and mobile abandonment before the founder chapter. These are proposed measures, not observed data.
