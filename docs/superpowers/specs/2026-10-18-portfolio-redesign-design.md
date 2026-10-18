# Portfolio Redesign — Design Document

**Date:** 2026-10-18
**Status:** approved by owner 2026-10-18 (decisions in §7; nothing gets built until the plan is made — next step is `superpowers:writing-plans`)
**Sources:** current site (`SMMKhadem` Hugo repo), `portfolio-crawl/extraction/rebuild-plan.md` + `site-inventory.json`, career documents (`backup2/ai-job-search/documents/`)

---

## 1. Intent and the why

Mohammad Mahdi Khadem's site at mahdikhadem.com must become an **academic home page** whose single job is to make a busy professor, PhD committee member, or collaborator trust his research taste in about two minutes.

The narrative arc: M.D. thesis on frontotemporal-dementia neuroimaging using messy routine clinical MRI → bariatric-surgery AI at the Minimally Invasive Research Center → Persian clinical NLP (PERSiMED) at Saman Insurance. Evidence on the page: 4 published Q1 papers, 4 ongoing manuscripts, grants, peer-review service, teaching. Technical range: Python and neuroimaging pipelines (FreeSurfer, SPM) and statistics through to LangChain, RAG, and clinical NLP.

It is **not** trying to win freelance clients. It fails if it still reads like a commercial developer template or if publications are buried under blog styling.

## 2. Goals, non-goals, anti-goals

**Goals**

- A visitor grasps who he is, his research arc, and his evidence (papers, grants, code) within ~2 minutes of scrolling.
- Every existing content item survives: 11 project pages, 4 blog posts, about narrative, contact channels — prose preserved, re-authored into the new stack (§3).
- New first-class sections for what the current site underserves: Publications (8 items with venue/impact/DOI links) and Teaching & Service (teaching, reviewer work, grants, memberships).
- Fix known rot: LinkedIn placeholder (`/in/johndoe/`), broken Telegram URL, RSS pointing at `myhugosite.com`, mislabeled Instagram/Twitter link.

**Non-goals**

- No CMS; content lives in a typed data file + MDX, edited by hand.
- No backend, no contact-form service change (keep Formspree), no analytics added.
- No multilingual version (EN only, LTR).

**Anti-goals** (success criteria that must NOT happen)

- Must not copy the crawled template's code, copy, or images — rebuild its *layout grammar and interaction patterns* only, with his own text, colors, type, and photos.
- Must not break existing public URLs/slugs (`/posts/...`, `/projects/...`, `/about/`, `/contact/`) — external links and citations point at them. The SPA router must serve these paths (builder picks mechanics, e.g. 404.html fallback).
- Must not reframe him as a freelance app developer; no "hire me" marketplace language.

## 3. Constraints

- **Stack: React + Vite + TypeScript + Tailwind rebuild (OWNER DECISION 2026-10-18, §7).** Built in place in the `SMMKhadem` repo (replacing the Hugo source; history kept). Follows the crawl's `rebuild-plan.md` build order: data-driven (`src/data/portfolio.ts`), tokens + shell, then sections. *(Designer call on in-place rebuild.)*
- **Deploy:** the GitHub Actions pipeline is rewritten — `npm run build` → `dist/` pushed to `mahdmahd/SMMKhadem.github.io` `main` with `cname: mahdikhadem.com` preserved. Custom domain and served URLs stay identical.
- **Routes preserve slugs:** `/posts/<slug>/`, `/projects/<slug>/`, `/about/`, `/contact/` keep working as paths. Posts re-authored as MDX (bodies byte-identical except approved rot fixes); project details as routes fed by the data file (full prose carried over).
- **Performance/a11y:** hero image converted to WebP/AVIF ≤ 300 KB; semantic landmarks; focus-visible styles; `prefers-reduced-motion` disables marquee/reveal/tilt; target Lighthouse 95+ on the homepage.
- **License hygiene:** no asset from `portfolio-crawl/portfolio/assets` or `photos/` is copied into the site (those belong to a sold template). Only the owner's own images from `static/images/` may be used.

## 4. Design: page structure (single-page home + preserved sections)

The homepage is a single scrolling page of 9 blocks, adapted from the crawl's section choreography. Display typography is oversized, uppercase, tight-tracked with a metallic gradient (white → gray, `background-clip: text`); eyebrows/nav/meta are monospace, uppercase, wide-tracked. Dark stage near-black warmed by bone-white accent pills.

| # | Block | Content (owner's data) | Interaction pattern from crawl |
|---|-------|------------------------|-------------------------------|
| 1 | Fixed header | Name mark + mono links: Research, Projects, Publications, Blog, Contact + CV download button; blur background on scroll | same as original |
| 2 | Hero | Giant split-line title (name + "M.D. · AI RESEARCHER"), portrait (`avatar.jpg`), one-line arc statement, scroll cue + "Get in touch" pill | scroll-reveal hero, portrait treatment |
| 3 | About ("Intro") | Bio arc condensed from `about.md` + CV (~150 words, ~8 highlighted key phrases); appointments + education mini-timeline (M.D. IUMS 2015–22; Foolad Clinic GP 2022–24; MIRC 2024–; Saman 2025–) | bio card with keyword emphasis |
| 4 | Methods marquee ("THE TOOLKIT") | ~30 chips in 3–4 rows from CV skills: Python, R, MATLAB, Git, Linux, Docker, SQL / SPM, FreeSurfer, ITK-SNAP, SVRTK, SynthSeg / SPSS, Stata, Mplus, meta-analysis, SEM / LangChain, Ollama, ChromaDB, RAG | CSS marquee, duplicated tracks, edge fade |
| 5 | Research areas accordion | 5 numbered rows: 01 Neuroimaging & Neurodegeneration; 02 Surgical Data Science & Bariatric AI; 03 Clinical NLP & Medical Documents; 04 Evidence Synthesis & Meta-Analysis; 05 Explainable ML & Clinical Prediction — each opening to 3–5 bullets | numbered accordion with billboard heading behind |
| 6 | Featured projects | 4 alternating case-study cards (number + mixed-case title, image, summary, Paper/Code/Demo buttons). **Owner-confirmed:** PERSiMED, RAG bariatric QA, OAGB hypoalbuminemia score, ApoE hippocampal shape. Remaining 7 projects live in an "All projects" archive grid below, linking to their detail routes | alternating case studies |
| 7 | Publications | 4 published (Obesity Surgery ×2, Immunity Inflammation & Disease, insurance-conference PERSiMED) with venue, IF, PubMed/civilica links; then "Under review / in preparation" (ApoE, LLM-ASMBS, BPL pilot, weight trajectories). Corresponding-author asterisks preserved | new block, same card grammar as projects |
| 8 | Teaching & Service strip | Compact: 4 teaching entries, reviewer roles (AJCR, Med Sci Monitor), 5 grants/awards, memberships (IRIMC, AI×MS). CV download button (`cv.pdf`, §7) | simple cards, no template equivalent |
| 9 | Contact + footer | Availability chip, gradient "Get in touch", email + LinkedIn + GitHub + ORCID buttons, details card (Tehran, Iran), Formspree form kept; footer with quick links + © line | CTA + details card pattern |

**Preserved sections (separate routes, same header/footer chrome):** `/posts/` (all 4 posts, prose unchanged, as MDX); `/projects/<slug>/` (all 11, full prose carried into detail routes); `/about/` (full long-form story stays; homepage shows the condensed version); `/contact/` (form + channels). Homepage "Latest writing" teaser links the 3 newest posts.

## 5. Content mapping (nothing lost)

Content model: `src/data/portfolio.ts` (profile, chips, research areas, projects, publications, channels) per the crawl rebuild plan; posts as MDX; project detail prose carried over from the current Markdown files.

| Existing file | Goes to |
|---|---|
| `content/about.md` (story, interests, experience, education) | condensed into blocks 3 (+timeline); full text stays at `/about/` |
| `content/posts/hugo.md`, `Mem1.md`, `pitfall.md`, `Voiceless.md` | MDX at same `/posts/` slugs; 3 newest teased on homepage |
| `content/projects/project-1.md` (FTD thesis) | archive grid + detail route; page content stays |
| `project-2.md` (post-thesis GenAI neuroimaging) | archive grid + detail route |
| `project-3.md` (ApoE hippocampus) | block 6 featured; detail route stays |
| `project-5.md` (RAG bariatric QA) | block 6 featured; detail route stays |
| `project-6.md` (PERSiMED) | block 6 featured; detail route stays |
| `project-7.md` (SnapExplain) | archive grid + detail route |
| `project-8.md` (OAGB hypoalbuminemia) | block 6 featured; detail route stays |
| `project-bpll.md`, `project-pemphigus.md`, `project-uricacid.md`, `project-weightlosstrajectory.md` | archive grid + detail routes (bpll/weight-trajectory also feed Publications "ongoing") |
| `content/contact.md` | block 9 + `/contact/` stays |
| CV (`Academisch_CV_Mehdi_EN.md` + PDF) | feeds blocks 3, 4, 7, 8; `cv.pdf` downloadable via header + block 8 |
| `documents/publications/` (6 files) | link targets for block 7 where they match a listed paper |
| `documents/applications/` (SOPs, narratives) | NOT published; may inform research-area wording only |
| `static/images/*` (avatar, project figures, org logos) | only imagery used; template crawl assets forbidden (§3) |

## 6. What's left to the builder

- Exact display typeface stack (system sans vs. a chosen display font), spacing scale, and responsive breakpoints — follow crawl tokens (`--bg #050505`, `--accent #e8e4dc`, container 72rem, section pad 96–128px) unless there's reason to deviate.
- SPA-on-Pages routing mechanics for slug preservation (404.html fallback, route map, link audit of every Paper/Code/Demo/DOI URL).
- Posts as MDX vs. a single archive page — builder picks whichever is cleaner; prose unchanged either way.
- Whether the old Hugo source is removed in the rebuild commit or kept on a branch.
- Marquee/reveal implementation details (vanilla CSS + IntersectionObserver preferred; GSAP allowed if it stays under budget).
- Image pipeline specifics (Vite image processing vs. pre-converted files).
- `project-bpll.md` Overview mismatch + `project-weightlosstrajectory.md` wrong `code_url`/`paper_url` (flagged 2026-10-18): carry over as-is into detail routes and flag visibly, or fix with owner sign-off — builder proposes, owner disposes.

## 7. Owner decisions (recorded 2026-10-18)

1. **Stack** — React+Vite rebuild per the crawl plan (not Hugo custom layouts).
2. **Featured 4** — PERSiMED, RAG bariatric QA, OAGB hypoalbuminemia score, ApoE hippocampal shape.
3. **Portrait** — LOCKED 2026-10-18: `static/images/avatar.jpg` is 266×266
   (~11 KB), unusable at hero scale. Hero uses the abstract/duotone fallback;
   avatar.jpg appears only at natural size (e.g. contact details card).
4. **CV PDF** — `documents/cv/Academisch_CV_Mehdi_EN updated/cv.pdf`, copied into the site bundle and linked from header + block 8.
5. **Contact channels** — core set only: email, LinkedIn (`/in/mohammad-mehdi-khadem-09bb8910b/`), GitHub (`mahdmahd`), ORCID (`0009-0005-4294-7934`) + Formspree form. Telegram and Twitter/Instagram links dropped.

## 8. Builder-check resolutions (2026-10-18)

A builder reviewed this document; their questions are resolved here.

**Publications source of truth.** The 8 items in the CV's Publications section
(`documents/cv/old cv/Academisch_CV_Mehdi_EN.md`) are canonical — reproduced
verbatim, corresponding-author asterisks included. The 6 files under
`documents/publications/` are link targets only, not the list:

- Published: (1) Hypoalbuminemia after OAGB — Obesity Surgery 2025;
  (2) Pemphigus vulgaris Iranian cohort — Immunity, Inflammation and Disease 2025;
  (3) MBS & serum uric acid meta-analysis — Obesity Surgery 2025;
  (4) PERSiMED — 32nd National / 13th International Conference on Insurance and Development 2025.
- Ongoing: ApoE hippocampal shape; LLM-ASMBS RAG QA; BPL-length pilot; weight-trajectory modeling.

Link priority per paper: PubMed URL from project frontmatter → civilica
(PERSiMED) → title-only with no link. Builder link-audits every URL; a dead
link is dropped, never guessed. Known data defect: `project-weightlosstrajectory.md`
reuses project-8's PMID as its `paper_url` — treat as unverified, drop if wrong.
*(Designer call; CV list is canonical unless the owner corrects it.)*

**Bio source of truth.** On facts and dates the CV prevails; on narrative voice
`content/about.md` prevails. The timeline includes the Foolad Clinic GP role
2022–24 (fills the 2022–24 gap). Teaching (4 entries), grants/awards (5 rows),
memberships (IRIMC, AI×MS), reviewer roles (AJCR, Med Sci Monitor) all come
from the CV. *(Designer call.)*

**Known-good contact URLs** (from `content/contact.md`, builder re-verifies):
LinkedIn `/in/mohammad-mehdi-khadem-09bb8910b/`, GitHub `mahdmahd`,
ORCID `0009-0005-4294-7934`, email `Smmehdikhadem@gmail.com`.
Formspree action `xkonleag`: builder verifies at build time; if dead, the form
is replaced with a mailto CTA — no new backend. *(Designer call.)*

**"Survives" semantics.** Post/project prose stays byte-identical except rot
fixes the owner approves; only the format changes (MDX / data + routes). All
slugs/URLs frozen and served by the SPA router. No duplicate routes: the homepage
"All projects" element is a teaser grid linking to the detail routes.
*(Designer call.)*

**Cards with missing buttons.** Paper/Code/Demo buttons render conditionally —
a project without a verified URL shows fewer buttons. No placeholder links.
*(Designer call.)*

**Hero fallback.** If `avatar.jpg` is too low-resolution for the giant hero
treatment, the builder uses an abstract/duotone treatment (no new photo, no
template imagery) and flags it in the build plan. *(Designer call.)*
