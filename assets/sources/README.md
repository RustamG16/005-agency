# assets/sources

Raw, unprocessed material for the Selected Works previews: client logo kits, hero films,
and the browser screenshots the Education4Students covers were cut from.

**This directory is deliberately outside `public/`.** It lived at `public/media/works/` and
was 63 MB — a 38 MB `Hero_video.mp4`, unprocessed WhatsApp JPEGs, 20 MB of PNG screenshots —
all of it publicly served and shipped in every deploy while nothing in the app referenced a
single file. Anything in `public/` is a URL whether you link it or not.

What ships is the encoded output in `public/works/<slug>/`, produced from these sources by
`scripts/capture-preview.mjs` and `scripts/encode-preview.mjs`. See
`PROJECT-PREVIEW-GUIDE.md`.

Keep new raw material here. If a file needs to be reachable by the browser, encode it into
`public/works/` rather than moving the source.
