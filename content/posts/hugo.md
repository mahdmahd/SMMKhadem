+++
authors = ["Mehdi Khadem"]
title = "How to Build a Hugo Site"
date = "2025-01-17"
description = "An Instruction to Build a simple Hugo site"
math = true
tags = [
    "hugo",
    "site"
]
categories = [
    "instruction",
    "site"
]
series = ["Theme Demo"]
+++

This article offers a instruction that can be used in to build a Hugo Site.

## 1) Install Hugo with winget

On Windows PowerShell:

```powershell
winget install Hugo.Hugo.Extended
````

Hugo’s official Windows install docs explicitly list `winget install Hugo.Hugo.Extended` for the extended edition. ([gohugo.io][1])

Quick check:

```powershell
hugo version
```

---

## 2) Create a new site

```powershell
hugo new site site_name
```

That’s the official CLI command for creating a new Hugo site directory. ([gohugo.io][2])

---

## 3) `cd` into your site

```powershell
cd site_name
```

Now initialize git (you’ll need it for submodules and GitHub anyway):

```powershell
git init
```

> Hugo’s own docs note Git is commonly required if you install a theme as a submodule. ([gohugo.io][1])

---

## 4) Add a theme template using a git submodule

Inside your site folder:

```powershell
git submodule add https://github.com/<theme-author>/<theme-repo>.git themes/<theme-name>
```

This is the same pattern Hugo shows in its quick start (theme as a submodule). ([gohugo.io][3])

Then set the theme in config (example):

```toml
theme = "<theme-name>"
```

---

## 5) Config file: don’t do the “rename” step blindly

You said: “rename `hugo.toml` to `config.toml`”.

Here’s the tough truth: **that’s backwards for modern Hugo.** Current Hugo recommends `hugo.toml` / `hugo.yaml` / `hugo.json` as the config filename; the old `config.*` naming is legacy. ([gohugo.io][4])

### What you should do instead

* **Keep `hugo.toml`** (recommended).
* Only use `config.toml` if you have a specific reason (old tooling, old docs, or a theme/tutorial that hardcodes it).

### The one setting you can’t mess up: `baseURL`

If your `baseURL` is wrong, you’ll get the classic “theme loads locally but CSS breaks on Pages” behavior because URLs get generated differently.

Hugo’s config docs show `baseURL` as a core “new site” setting. ([gohugo.io][4])

Typical values:

* User/Org Pages repo (`username.github.io`):

  * `baseURL = "https://username.github.io/"`
* Project Pages repo (`username.github.io/repo-name/`):

  * `baseURL = "https://username.github.io/repo-name/"`

If you’re publishing into `SMMKhadem.github.io`, your `baseURL` should match that final public URL.

---

## 6) The `master/master.pub` deploy-key technique (source repo ➜ publish repo)

This is the technique from bzoltan’s guide you linked: generate an SSH keypair, store the **private key** in the **source repo secrets**, and add the **public key** as a **Deploy key** on the **publish repo**. ([Zoltán's Blog][5])

### Generate the keypair locally

From your machine:

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f master -N ""
```

This creates:

* `master` (private key)
* `master.pub` (public key) ([Zoltán's Blog][5])

### Put keys in the right places

**In the *source* repo** (the Hugo repo):

* Add `master` (private key contents) into a GitHub Actions secret named:

  * `ACTIONS_DEPLOY_KEY` ([Zoltán's Blog][5])

**In the *publish* repo** (e.g. `mahdmahd/SMMKhadem.github.io`):

* Add `master.pub` as a **Deploy key**
* You must allow write access, because the workflow will push generated files. ([GitHub Docs][6])

> Security note: deploy keys are scoped to a single repo, which is the whole point here. ([GitHub Docs][6])

---

## 7) Push your Hugo source repo

Create your GitHub repo (source), then:

```powershell
git add .
git commit -m "Initial Hugo site"
git branch -M main
git remote add origin git@github.com:<you>/<source-repo>.git
git push -u origin main
```

---

## 8) Add the GitHub Action workflow (`.github/workflows/pages.yaml`)

Create:

* `.github/workflows/pages.yaml`

Then paste your workflow (this is basically the modernized version of the approach in the bzoltan post, but using newer action versions). ([Zoltán's Blog][5])

```yaml
name: hugo publish

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "latest"
          extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          external_repository: mahdmahd/SMMKhadem.github.io
          publish_branch: main
          publish_dir: ./public
          allow_empty_commit: false
          commit_message: ${{ github.event.head_commit.message }}
```

### Two critical details people forget

1. **Submodules must be enabled** in checkout, or your theme won’t exist in CI and the build will fail or look unstyled. ([gohugo.io][3])
2. Your **publish repo Pages settings** must publish from the branch you push to (here: `main`, root). GitHub’s Pages docs describe configuring the publishing source under Settings → Pages. ([GitHub Docs][7])
