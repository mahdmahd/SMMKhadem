/**
 * Portfolio data — the single content model every section reads.
 *
 * Facts and dates come from the owner's academic CV; narrative wording is
 * drafted from the project prose in `docs/superpowers/specs/content-backup/`.
 * The copy is the owner's to edit — components never inline their own strings.
 *
 * Import contract (pinned in Task 2, kept here): `profile`, `channels`, `nav`.
 * Tasks 5–7 fill `featuredProjects`, `allProjects`, `publications` and
 * `teaching`, whose shapes are defined below.
 */

/* ------------------------------------------------------------------ profile */

export type Profile = {
  name: string
  title: string
  /** One-line arc: who he is, in a single breath. */
  tagline: string
  location: string
  email: string
  /** Public path of the downloadable CV, served from `public/`. */
  cvUrl: string
}

export const profile: Profile = {
  name: 'Mohammad Mahdi Khadem',
  title: 'M.D. · AI Researcher',
  tagline:
    'Physician-turned-researcher working at the intersection of clinical medicine and AI — from neuroimaging of dementia to surgical data science and clinical NLP.',
  location: 'Tehran, Iran',
  email: 'Smmehdikhadem@gmail.com',
  cvUrl: '/cv.pdf',
}

/* --------------------------------------------------------------------- nav */

export type NavItem = {
  label: string
  /**
   * Root-relative hash (`/#research`), not a bare `#research`: the header and
   * footer render these on subroutes too (`/about`, `/posts/<slug>`), where a
   * bare hash would resolve against the current path and land nowhere.
   */
  href: string
}

export const nav: NavItem[] = [
  { label: 'Research', href: '/#research' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Publications', href: '/#publications' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
]

/* ---------------------------------------------------------------- channels */

/**
 * Icon key for a channel. `public/images/icons/<icon>.svg` exists for
 * `linkedin`, `github` and `orcid`; `mail` has no asset and is rendered as a
 * glyph. Telegram, Twitter and Instagram were dropped by owner decision.
 */
export type ChannelIcon = 'mail' | 'linkedin' | 'github' | 'orcid'

export type Channel = {
  name: string
  url: string
  icon: ChannelIcon
}

export const channels: Channel[] = [
  {
    name: 'Email',
    url: 'mailto:Smmehdikhadem@gmail.com',
    icon: 'mail',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mohammad-mehdi-khadem-09bb8910b/',
    icon: 'linkedin',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/mahdmahd',
    icon: 'github',
  },
  {
    name: 'ORCID',
    url: 'https://orcid.org/0009-0005-4294-7934',
    icon: 'orcid',
  },
]

/* ----------------------------------------------------------------- toolkit */

/** Chip rows for the methods marquee: one row per method family, CV order. */
export const toolkit: string[][] = [
  ['Python', 'R', 'MATLAB', 'SQL', 'Git', 'Linux', 'Docker'],
  ['FreeSurfer', 'SPM', 'ITK-SNAP', 'SVRTK', 'SynthSeg'],
  ['Meta-analysis', 'SEM', 'Mplus', 'Stata', 'SPSS', 'Study Design'],
  ['LangChain', 'RAG Pipelines', 'ChromaDB', 'Ollama', 'Scikit-learn', 'SHAP'],
]

/* ---------------------------------------------------------- research areas */

export type ResearchArea = {
  /** Stable anchor/route id, derived from the title. */
  id: string
  /** Display number, zero-padded: `01` … `05`. */
  index: string
  title: string
  bullets: string[]
}

export const researchAreas: ResearchArea[] = [
  {
    id: 'neuroimaging',
    index: '01',
    title: 'Neuroimaging & Neurodegeneration',
    bullets: [
      'Linking regional structural findings on routine clinical MRI to MMSE and MoCA sub-domain performance in frontotemporal dementia.',
      'Slice-to-volume reconstruction (SVRTK) that lifts 1.5T, low-resolution 2D hospital scans back to analysable volumes.',
      'SynthSeg-based segmentation robust to heterogeneous contrast and resolution, so routine hospital imaging stays usable at scale.',
      'Hippocampal subfield shape and thickness across ApoE genotypes in ADNI, using tetrahedral mesh geometry beyond global volume.',
    ],
  },
  {
    id: 'surgical-data-science',
    index: '02',
    title: 'Surgical Data Science & Bariatric AI',
    bullets: [
      'Building and harmonising multimodal clinical datasets from bariatric surgery cohorts of several thousand patients.',
      'A predictive scoring system for hypoalbuminemia after one-anastomosis gastric bypass (AUROC 0.80, cutoff score 55) built on the AutoScore framework.',
      'Computer-vision measurement of biliopancreatic limb length from laparoscopic video, calibrated from pixels to real-world centimetres.',
      'Weight-trajectory modelling with latent class analysis and structural equation modelling, paired with explainable ML for patient-level prediction.',
    ],
  },
  {
    id: 'clinical-nlp',
    index: '03',
    title: 'Clinical NLP & Medical Documents',
    bullets: [
      'PERSiMED: a Persian medical document reader combining CNN segmentation with vision-language models, above 96% end-to-end processing on 2,000 real insurance documents.',
      'Retrieval-augmented clinical question answering grounded in the ASMBS bariatric surgery textbook — 82% to 94% accuracy with far fewer hallucinations.',
      'LLM workflows for insurance medicine: claims automation, duplicate-claim and upcoding detection, and longitudinal patient-record construction.',
      'Privacy-preserving outputs — annotated image, layout-preserving HTML and ingestible JSON — instead of raw OCR text.',
    ],
  },
  {
    id: 'evidence-synthesis',
    index: '04',
    title: 'Evidence Synthesis & Meta-Analysis',
    bullets: [
      'PRISMA-compliant systematic reviews with pre-specified search, screening, extraction and risk-of-bias protocols.',
      'Random-effects meta-analysis and meta-regression in R (meta, metafor), with sensitivity analysis and publication-bias assessment.',
      'A 42-study, 9,468-patient synthesis of serum uric acid after metabolic and bariatric surgery, tracing the reduction to renal urate handling and visceral adiposity.',
      'Subgroup and robustness checks that separate durable effects from transient postoperative noise.',
    ],
  },
  {
    id: 'explainable-ml',
    index: '05',
    title: 'Explainable ML & Clinical Prediction',
    bullets: [
      'SHAP and LIME interpretability, so the drivers behind every model stay inspectable by the clinicians who act on it.',
      'AutoScore-style conversion of model coefficients into integer bedside scores, rather than opaque probabilities.',
      'Translating models into point-of-care tools — risk strata, cutoffs and monitoring windows a ward can actually use.',
      'Honest validation reporting: discrimination, calibration, and the limits of single-centre retrospective data.',
    ],
  },
]

/* --------------------------------------------------------------- projects */

export type Project = {
  slug: string
  /** Display number, zero-padded: `01`, `02`, … */
  index: string
  title: string
  summary: string
  /** Public image path. Omitted when the project has no verified figure. */
  image?: string
  /** Rendered as a Paper button only when present and verified. */
  paperUrl?: string
  /** Rendered as a Code button only when present and verified. */
  codeUrl?: string
  /** Rendered as a Demo button only when present and verified. */
  demoUrl?: string
}

/** Task 5 fills these. No placeholder links: a card shows only verified URLs. */
export const featuredProjects: Project[] = []

export const allProjects: Project[] = []

/* ----------------------------------------------------------- publications */

export type PublicationStatus = 'published' | 'under-review' | 'in-preparation'

export type Publication = {
  title: string
  /** Author list, verbatim from the CV, corresponding-author `*` included. */
  authors: string[]
  venue: string
  year: number
  /** Journal impact factor or equivalent metric, when known. */
  impact?: string
  /** PubMed / civilica / DOI link, only when verified. */
  url?: string
  status: PublicationStatus
}

/** Task 6 fills these from the CV (4 published, 4 ongoing). */
export const publications: Publication[] = []

/* ------------------------------------------------------ teaching & service */

export type TeachingEntry = {
  role: string
  organisation: string
  /** Human-readable period, e.g. `2024 – present`. */
  period: string
  detail?: string
}

export type ReviewingEntry = {
  journal: string
  role: string
  period?: string
}

export type GrantEntry = {
  title: string
  funder?: string
  year: string
  amount?: string
  detail?: string
}

export type MembershipEntry = {
  name: string
  role?: string
  since?: string
}

export type TeachingService = {
  teaching: TeachingEntry[]
  reviewing: ReviewingEntry[]
  grants: GrantEntry[]
  memberships: MembershipEntry[]
}

/** Task 6 fills these from the CV (4 teaching, 2 journals, 5 grants, 2 memberships). */
export const teaching: TeachingService = {
  teaching: [],
  reviewing: [],
  grants: [],
  memberships: [],
}
