# guidongnan.github.io

Personal site of Dongnan Gui (桂栋南), a Ph.D. student in the USTC–MSRA joint program, working on
video generation, autoregressive video and world models.

Live at **<https://guidongnan.github.io/>**

## Contents

| Path | What it holds |
| --- | --- |
| `index.html`, `index.zh.html` | Homepage, English and Chinese |
| `notes/` | Tutorial site: 13 long-form Chinese tutorials, 13 English companions, and 1,100+ notes on individual papers |
| `blog/` | Short essays on video generation and world models, each written in both languages |
| `waypoints/` | Personal travel atlas, password protected |
| `figs/` | Figures used on the homepage |

## This repository stores build output, not sources

Nothing here is compiled by GitHub. Every file is generated elsewhere and committed exactly as it
will be served:

* The homepage is hand-written HTML, one file per language.
* `notes/` is built with [VitePress](https://vitepress.dev/) and committed as the rendered site.
  Its asset paths are absolute under `/notes/`, which is why this has to be the user-pages
  repository and not a project repository.
* `waypoints/` ships as AES-256-GCM ciphertext with a PBKDF2-SHA256 derived key. Place names,
  dates and cover photos are decrypted in the browser after the password is entered, so none of
  that is readable from this repository. The map is a read-only display; the weather shown for
  each visit day is baked into the payload at build time, so viewing a place sends nothing to any
  third party.

Pages is configured as **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**, and
`.nojekyll` turns off Jekyll processing. There is deliberately no Actions workflow: the sources
that produce `notes/` do not live in this repository, so a build workflow would only ever fail.

## License

Text and figures are © Dongnan Gui. The paper notes summarise third-party research and link to the
original publications, which remain the property of their authors.
