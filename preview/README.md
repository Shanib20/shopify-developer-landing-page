# Static preview harness

This folder is a QA aid, not part of the Shopify theme deliverable (that's `theme/`).

`index.html` mirrors the compiled output of the theme's sections, using plain
HTML/CSS/JS and sample data instead of Liquid, so the page can be opened
directly in any browser (just double-click `index.html`) with no Shopify CLI,
no store login, and no build step — useful since this environment has no
Shopify CLI installed and no way to authenticate to a live store.

It is updated once per checkpoint, in step with `theme/`. If you have the
Shopify CLI and a dev store, you can ignore this folder entirely and run
`shopify theme dev` from inside `theme/` against the real Liquid sections —
`preview/` and `theme/` are independent, both built from the same
`design.md` tokens.
