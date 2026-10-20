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

/* ------------------------------------------------------------ contact form */

/**
 * Formspree endpoint for the contact form, verified by hand once (Task 7):
 * `POST https://formspree.io/f/xkonleag` answers `200 {"ok":true}`. When a
 * future verification returns 4xx the value becomes `null` and both contact
 * surfaces fall back to a `mailto:` call to action instead of a form that
 * silently swallows submissions — the spec's rule is "no new backend", not
 * "keep a dead form".
 */
export const formAction: string | null = 'https://formspree.io/f/xkonleag'

/* ------------------------------------------------------------------- about */

/**
 * Homepage bio, one string per paragraph, condensed to ~150 words from the
 * owner's about page (narrative voice) and the CV (facts and dates). The
 * `**…**` spans render as `<mark>` highlights in `src/sections/About.tsx` —
 * eight of them, the load-bearing phrases of the arc.
 */
export const about: string[] = [
  'I came to data science through medicine. My M.D. thesis at Iran University of Medical Sciences asked how regional structural change on **routine clinical MRI** tracks cognitive decline in **frontotemporal dementia** — and answering it meant learning **neuroimaging** properly: slice-to-volume reconstruction, FreeSurfer and SPM pipelines, and the statistics to defend the result.',
  'Then came the years I value most: full-time general practice at Foolad Clinic, where research questions arrive as people rather than as datasets — and where I found that I genuinely enjoy mathematics and statistics once they meet a real clinical problem.',
  'At the Minimally Invasive Research Center I moved to **bariatric surgery**: predictive models and **explainable AI** that clinicians can inspect, bedside scores instead of black boxes, and **RAG** clinical question answering grounded in the bariatric surgery textbook. Now, at Saman Insurance, I work on **clinical NLP** — **Persian medical documents**, and LLM workflows for claims, fraud detection and patient records.',
]

export type TimelineEntry = {
  role: string
  organisation: string
  /** Human-readable period, e.g. `2024 – present`. */
  period: string
}

/** Education and appointments for the homepage mini-timeline, CV order. */
export const timeline: TimelineEntry[] = [
  {
    role: 'M.D., Medicine',
    organisation: 'Iran University of Medical Sciences',
    period: '2015 – 2022',
  },
  {
    role: 'General Practitioner',
    organisation: 'Foolad Clinic',
    period: '2022 – 2024',
  },
  {
    role: 'AI Researcher & Developer',
    organisation: 'Minimally Invasive Research Center',
    period: '2024 – present',
  },
  {
    role: 'Medical Insurance Consultant (AI & Analytics)',
    organisation: 'Saman Insurance',
    period: '2025 – present',
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
      'Interpretability methods (attribution scores, rule-based scores), so the drivers behind every model stay inspectable by the clinicians who act on it.',
      'AutoScore-style conversion of model coefficients into integer bedside scores, rather than opaque probabilities.',
      'Translating models into point-of-care tools — risk strata, cutoffs and monitoring windows a ward can actually use.',
      'Honest validation reporting: discrimination, calibration, and the limits of single-centre retrospective data.',
    ],
  },
]

/* --------------------------------------------------------------- projects */

export type ProjectFields = {
  slug: string
  /** Display number, zero-padded: `01`, `02`, … */
  index: string
  title: string
  summary: string
  /** Publication year, from the same content-backup frontmatter. */
  year?: number
  /** Technology list, verbatim from the frontmatter, for the detail meta line. */
  technologies?: string[]
  /** Rendered as a Paper button only when present and verified. */
  paperUrl?: string
  /** Rendered as a Code button only when present and verified. */
  codeUrl?: string
  /** Rendered as a Demo button only when present and verified. */
  demoUrl?: string
  /**
   * Full prose, carried from `docs/superpowers/specs/content-backup/projects/`
   * with the Hugo frontmatter and the `<!--more-->` marker stripped: the
   * Overview paragraph, then the Project Details paragraphs. Details blocks are
   * split on blank lines and keep any inner newline (some backups separate
   * paragraphs with a single one), so the detail route can reprint them as-is.
   */
  overview?: string
  details?: string[]
}

/**
 * A project either ships a figure — and then it also ships the sentence that
 * figure needs — or it ships neither.
 *
 * The union is the point: these are charts and screenshots whose numbers the
 * prose does not restate (the study-design flow chart, the PRISMA diagram), so
 * `alt=""` on one of them drops real content from a screen reader. Spelled this
 * way, `{ image: '/foo.webp' }` with no `imageAlt` does not typecheck, and a
 * consumer that has narrowed on `image` reads `imageAlt` as a plain `string` —
 * no `?? ''` fallback to hide a figure that lost its description.
 */
export type Project = ProjectFields &
  ({ image: string; imageAlt: string } | { image?: never; imageAlt?: never })

/**
 * Featured case studies, in the owner's order: PERSiMED, the bariatric RAG
 * question-answering system, the OAGB hypoalbuminemia score, then the ApoE
 * hippocampal-shape study. `index` is the number the card prints.
 */
export const featuredProjects: Project[] = [
  {
    slug: 'project-6',
    index: '01',
    title: 'PERSiMED: PERSian Intelligent MEDical Document Reader: A Smart NLP-based Framework for Persian Medical Documents',
    summary: 'A deep learning–based framework for intelligent extraction, semantic understanding, and structured digitization of Persian medical documents, designed to automate health insurance workflows and fraud detection.',
    year: 2025,
    technologies: [
      'Python',
      'Deep Learning (CNNs)',
      'Vision-Language Models',
      'Computer Vision',
      'Natural Language Processing (NLP)',
      'HTML Parsing (BeautifulSoup)',
      'Structured Data Pipelines',
      'Privacy-Preserving Data Architecture',
    ],
    image: '/images/projects/persimed-flowchart.webp',
    imageAlt:
      'Three panels of the PERSiMED pipeline on one Persian sonography report: the scanned page, the extracted text with its bounding boxes and confidence scores as JSON, and the same page with the detected regions outlined.',
    paperUrl: 'https://en.civilica.com/doc/2472372/',
    codeUrl: 'https://github.com/mahdmahd/PERSiMED',
    overview: 'A deep learning–based framework for intelligent extraction, semantic understanding, and structured digitization of Persian medical documents, designed to automate health insurance workflows and fraud detection.',
    details: [
      'Let’s be direct: manual processing of medical documents in Persian-speaking healthcare systems is slow, expensive, and error-prone. Mixed Persian–English scripts, right-to-left layouts, handwritten annotations, and non-standard formatting make traditional OCR pipelines unreliable. PERSiMED was built to deal with that reality, not an idealized dataset.',
      'PERSiMED (PERSian Intelligent MEDical document reader) is an end-to-end AI framework that automates the entire medical document processing pipeline—from raw scanned images to structured, searchable, and privacy-preserving outputs. The system combines modern computer vision, deep learning–based segmentation, and Vision-Language (VL) models to move beyond simple character recognition toward real semantic understanding of medical content.',
      'The core idea is straightforward but powerful: instead of treating OCR and NLP as separate, brittle steps, PERSiMED integrates document preprocessing, layout correction, multilingual text understanding, and semantic annotation into a unified pipeline. CNN-based segmentation models handle document boundary detection, orientation correction, and geometric rectification, while Vision-Language models perform simultaneous text recognition and contextual interpretation of Persian and English medical terminology.',
      'The framework produces three synchronized outputs for every document: annotated images for visual validation, clean HTML that preserves logical and spatial layout, and structured JSON objects suitable for database ingestion and downstream analytics. This design makes PERSiMED practical for real insurance operations, not just academic benchmarks.',
      'From an application standpoint, PERSiMED directly targets high-impact insurance use cases: claims processing automation, fraud detection (duplicate claims, upcoding, temporal anomalies), and longitudinal patient record construction. In evaluation on 2,000 real insurance documents, the system achieved over 96% successful end-to-end processing, with failures largely attributable to severely degraded input quality rather than model limitations.',
      'Ultimately, PERSiMED is about replacing slow human bottlenecks with scalable, auditable AI—while respecting privacy constraints and the linguistic realities of Persian medical documentation.',
    ],
  },
  {
    slug: 'project-5',
    index: '02',
    title: 'Retrieval-Augmented Clinical Question Answering for Bariatric Surgery',
    summary: 'A retrieval-augmented generation (RAG) system that uses the ASMBS bariatric surgery textbook as a knowledge base to answer medical questions with higher accuracy and fewer hallucinations than general-purpose AI models.',
    year: 2025,
    technologies: [
      'retrieval-augmented generation (RAG)',
      'LangChain',
      'ChromaDB',
    ],
    overview: 'A retrieval-augmented generation (RAG) system that uses the ASMBS bariatric surgery textbook as a knowledge base to answer medical questions with higher accuracy and fewer hallucinations than general-purpose AI models.',
    details: [
      "Large language models like ChatGPT are impressive, but they have a glaring problem when it comes to specialized medical knowledge: they hallucinate. They'll confidently make up answers that sound plausible but are actually wrong – not exactly what you want when studying for board exams or making clinical decisions! We came across a study showing that ChatGPT correctly answered about 82% of ASMBS (American Society for Metabolic and Bariatric Surgery) end-chapter questions. That's decent, but our key question was: could we push that accuracy higher while cutting down on the made-up nonsense?\nTurns out, we could! I designed a retrieval-augmented generation (RAG) system that grounds the AI's answers in a specific, authoritative source: the ASMBS bariatric surgery textbook. Instead of letting the model rely solely on whatever it memorized during training (and risk hallucinating), the system actually looks up relevant information from the textbook before answering.\nHere's how it works: when you ask a question, the system first rewrites and expands your query to capture different phrasings and related concepts. Then it searches through a vector database (built using ChromaDB) containing the entire ASMBS textbook, finding semantically similar and relevant passages. These passages get filtered for quality and relevance, and only then are they fed to the LLM (along with your original question) so it can generate an answer that's actually grounded in the textbook content.\nWe tested this rigorously, evaluating accuracy with and without RAG across different models – GPT-4, GPT-4o-mini, and some newer models. The results were pretty awesome! We achieved about 94% accuracy on those end-chapter questions (up from 82%), and the hallucinations dropped dramatically. When the model doesn't know something, it's much more likely to say so rather than making stuff up, because it's constrained by what's actually in the textbook.\nI built a restricted-access demo that's available at medrag.liararun.ir (credentials provided on request – we have to keep it locked down due to textbook copyright constraints). It's a functional web service where you can ask bariatric surgery questions and get textbook-grounded answers in real-time.\nThis project shows how RAG can make AI genuinely useful for medical education and clinical decision support by keeping it honest and accurate. A manuscript describing this work is currently under review, so hopefully we'll be able to share the full details soon!\nSoftware used: Python, LangChain, ChromaDB, OpenAI API, Flask (for the web-service demo).",
    ],
  },
  {
    slug: 'project-8',
    index: '03',
    title: 'Unveiling Predictors of Hypoalbuminemia Following One Anastomosis Gastric Bypass (OAGB): A Retrospective Analysis',
    summary: 'A machine learning-based clinical scoring system designed to predict hypoalbuminemia risk following One-Anastomosis Gastric Bypass (OAGB) surgery, enabling early intervention and personalized patient care.',
    year: 2025,
    technologies: [
      'Machine Learning',
      'XGBoost',
      'Random Forest Explainable AI (SHAP values)',
      'AutoScore Framework',
      'AutoScore',
      'Python',
      'Scikit-learn',
      'Scoring System',
    ],
    image: '/images/projects/oagb-study-design.webp',
    imageAlt:
      'Study-design flow chart: the 3,242-patient OAGB cohort split by year into a 2,536-patient training set and a 706-patient 2023 hold-out, then the machine-learning models, hyperparameter tuning, AutoScore conversion and SHAP feature ranking.',
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41201758/',
    overview: 'A machine learning-based clinical scoring system designed to predict hypoalbuminemia risk following One-Anastomosis Gastric Bypass (OAGB) surgery, enabling early intervention and personalized patient care.',
    details: [
      "Let's be honest, managing post-bariatric surgery complications like hypoalbuminemia can be challenging, especially when trying to identify at-risk patients before symptoms manifest. After analyzing data from over 3,200 patients who underwent OAGB procedures between 2018-2023, our research team developed a practical scoring system that transforms complex clinical predictors into an actionable risk assessment tool – as straightforward as checking a patient's vital signs.",
      'The core innovation is a transparent, clinically interpretable scoring algorithm derived from advanced machine learning models. We identified key predictors that independently increase hypoalbuminemia risk: age ≥ 41 years, lower ferritin and hemoglobin levels, severe obesity (BMI 40-59.9 kg/m² or higher), shorter height, and a higher biliopancreatic-limb-to-height ratio. Using the AutoScore framework, we converted these complex relationships into an easy-to-use integer scoring system with remarkable accuracy (AUROC 0.80).',
      'What makes this tool truly valuable in clinical practice is its simplicity – with a cutoff score of 55, healthcare providers can quickly stratify patients into low-risk (<55) and high-risk (≥55) categories. Those scoring high should receive intensified nutritional monitoring during the vulnerable early recovery period, particularly within the first 6 months when hypoalbuminemia most commonly develops. While this single-center retrospective study awaits external validation, this scoring system represents our commitment to precision medicine in bariatric care.',
      "This research represents years of collaborative work across multiple specialties, and I'm particularly grateful to my colleagues at the Minimally Invasive Surgery Research Center for their invaluable insights and dedication to improving patient outcomes after metabolic surgery.",
    ],
  },
  {
    slug: 'project-3',
    index: '04',
    title: 'ApoE Genotype–Specific Hippocampal Shape Alterations in Alzheimer’s Disease',
    summary: 'A neuroimaging study investigating how hippocampal subfield structure and shape differ across ApoE genotypes, using high-resolution MRI and computational geometry–based morphometric analysis.',
    year: 2025,
    technologies: [
      'FreeSurfer',
      'HIPSTA',
      'Computational Geometry',
      'High-Resolution MRI',
      'ADNI Dataset',
    ],
    overview: 'A neuroimaging study investigating how hippocampal subfield structure and shape differ across ApoE genotypes, using high-resolution MRI and computational geometry–based morphometric analysis.',
    details: [
      'Apolipoprotein E (ApoE) genotype—particularly the ε4 allele—is the strongest common genetic risk factor for Alzheimer’s disease, yet the structural brain mechanisms through which ApoE4 confers risk remain incompletely understood. In this project, I tested the hypothesis that hippocampal morphology differs systematically across ApoE genotype groups even in the absence of overt dementia.',
      'Using high-resolution hippocampal MRI data from the Alzheimer’s Disease Neuroimaging Initiative (ADNI), I stratified cognitively healthy individuals by ApoE genotype (ε4/ε4, ε3/ε4, and ε3/ε3). I performed hippocampal subfield segmentation using FreeSurfer and applied the HIPSTA framework, which uses tetrahedral mesh modeling and computational geometry, to quantify hippocampal thickness and shape beyond conventional volumetric measures.',
      'Rather than focusing solely on global hippocampal volume, the analysis targeted localized shape and thickness differences that may reflect early vulnerability of specific hippocampal subfields. This approach allowed for spatially resolved comparisons across genotype groups and provided a more sensitive structural phenotype linked to genetic risk.',
      'The project is currently in its final stages, with analyses complete and manuscript preparation underway. The results support the view that ApoE4-related neurodegenerative processes may manifest as subtle, regionally specific hippocampal shape alterations before measurable global atrophy occurs.',
    ],
  },
]

/**
 * The archive: everything else, newest framing first. Same shape, so the grid
 * and the detail routes read from one model.
 */
export const allProjects: Project[] = [
  {
    slug: 'project-1',
    index: '01',
    title: 'M.D. Thesis: Neuroimaging–Cognition Relationships in Frontotemporal Dementia Using Routine Clinical MRI',
    summary: 'An M.D. thesis project investigating structural neuroimaging correlates of cognitive impairment in frontotemporal dementia (FTD), with a focus on extracting meaningful information from low-resolution routine clinical MRI data.',
    year: 2025,
    technologies: [
      'SVRTK (Slice-to-Volume Reconstruction Toolkit)',
      'FreeSurfer',
      'SPM (Statistical Parametric Mapping)',
      'SynthSeg',
      'Clinical MRI',
      'Slice-to-Volume Reconstruction',
    ],
    image: '/images/projects/cortical-surface.webp',
    imageAlt:
      'Three-dimensional cortical surface model in a colour-coded viewer, shown with superior, posterior and anterior orientation labels.',
    overview: 'An M.D. thesis project investigating structural neuroimaging correlates of cognitive impairment in frontotemporal dementia (FTD), with a focus on extracting meaningful information from low-resolution routine clinical MRI data.',
    details: [
      'Frontotemporal dementia is a clinically and biologically heterogeneous neurodegenerative disorder in which cognitive and behavioral deficits are often poorly captured by routine imaging reports. As part of my M.D. thesis, I studied whether structural patterns observable in standard hospital MRI scans could be meaningfully linked to neuropsychological performance in patients with FTD.',
      'I analyzed 1.5T, low-resolution 2D clinical MRI scans obtained from Firoozgar and Rasoul Akram Hospitals and related regional brain findings to neuropsychological test scores, including MMSE, MoCA, and their subdomains. Because the available imaging data were not optimized for research use, I applied slice-to-volume reconstruction using the Slice-to-Volume Reconstruction Toolkit (SVRTK) to generate higher-quality volumetric representations suitable for downstream analysis.',
      'I independently learned, implemented, and optimized neuroimaging pipelines using FreeSurfer and SPM, including segmentation, cortical and subcortical analysis, and statistical modeling. As the project progressed, I refined the original hypotheses based on data quality and preliminary results and proposed additional analyses to strengthen interpretability and robustness.',
      'A key component of the work was integrating imaging findings with cognitive data. I routinely reviewed primary neurodegeneration and neuroanatomy literature to interpret associations between regional brain changes and specific MMSE and MoCA sub-scores, rather than relying solely on global cognitive scores.',
      'I presented and defended this work in my thesis, “Evaluation of Neuroimaging Findings and Neuropsychological Test Data in Frontotemporal Dementia Patients in Firoozgar and Rasoul-Akram Hospitals”, receiving a final grade of 90%.',
      'Following the thesis defense, I extended the project by improving slice-to-volume reconstruction and segmentation of 2D clinical MRIs using SynthSeg, a generative AI–based framework capable of handling heterogeneous contrasts and resolutions. This continuation reflects my broader research position: understanding neurodegenerative disease mechanisms should not rely exclusively on high-resolution research scans, but must also leverage the vast and underused body of routine hospital imaging data.',
    ],
  },
  {
    slug: 'project-2',
    index: '02',
    title: 'Post-Thesis: Advanced Neuroimaging Analysis Using GenAI',
    summary: 'An ongoing research effort to improve brain MRI reconstruction techniques, enabling large-scale neurodegeneration studies using routine clinical imaging data rather than relying solely on high-resolution research scans.',
    year: 2023,
    technologies: [
      'FreeSurfer',
      'SynthSeg',
      'Clinical MRI',
      'Slice-to-Volume Reconstruction',
    ],
    overview: 'An ongoing research effort to improve brain MRI reconstruction techniques, enabling large-scale neurodegeneration studies using routine clinical imaging data rather than relying solely on high-resolution research scans.',
    details: [
      "Here's the thing about neurodegenerative disease research: we have access to tons of clinical MRI scans from hospitals – images taken during routine patient care – but they're often lower resolution and less standardized than the fancy research-grade scans. Most studies ignore this treasure trove of data and stick with high-resolution research MRIs. But what if we could unlock the potential of all that clinical data? That's exactly what I set out to do!\nAfter successfully defending my M.D. thesis, I wasn't quite done with the neuroimaging world. I kept pushing forward with this work, focusing on improving the slice-to-volume reconstruction techniques I'd been using. The key innovation? Incorporating SynthSeg, a really clever generative AI-based framework that can segment MRIs regardless of their contrast or resolution. Unlike traditional segmentation tools that are picky about image quality, SynthSeg is remarkably robust.\nMy working hypothesis drives this whole effort: if we want to truly understand neurodegenerative disease mechanisms, we shouldn't limit ourselves to the relatively small number of high-resolution research MRIs out there. Instead, we should be exploiting the massive volumes of routine hospital imaging data that already exist. These clinical scans represent real-world patient populations, diverse scanning protocols, and longitudinal follow-up data that you just can't get easily in traditional research settings.\nBy combining improved slice-to-volume reconstruction with SynthSeg's flexible segmentation capabilities, I'm working to make these lower-quality clinical scans analyzable at scale. This could potentially transform how we study neurodegeneration – moving from small, highly controlled studies to large-scale analyses that better represent the full spectrum of disease. It's ongoing work, but the goal is to bridge the gap between clinical reality and research potential!",
    ],
  },
  {
    slug: 'project-7',
    index: '03',
    title: 'SnapExplain',
    summary: 'SnapExplain is an Android utility that brings large language model (LLM) explanations directly into your reading workflow.It integrates with Android’s native text-selection menu, allowing users to highlight any sentence in a PDF, ebook, or article and receive an instant, contextual explanation — without leaving the app they’re reading in.',
    year: 2025,
    technologies: [
      'Kotlin',
      'Android SDK',
      'HTTP/REST APIs (OpenAI-compatible)',
      'Large Language Models (LLMs)',
      'Android Text Selection API',
      'Gradle',
    ],
    image: '/images/projects/snapexplain.webp',
    imageAlt:
      'SnapExplain on Android: a paper open in a PDF reader with the text-selection menu showing the “Explain (≤100 words)” action.',
    codeUrl: 'https://github.com/mahdmahd/SnapExplain',
    demoUrl: 'https://github.com/mahdmahd/SnapExplain/releases/tag/V0.1',
    overview: 'SnapExplain is an Android utility that brings large language model (LLM) explanations directly into your reading workflow.\nIt integrates with Android’s native text-selection menu, allowing users to highlight any sentence in a PDF, ebook, or article and receive an instant, contextual explanation — without leaving the app they’re reading in.\nNo app switching. No prompt rewriting. No broken focus.',
    details: [
      'reading dense academic or technical text on mobile is inefficient.\nYou hit a sentence that needs interpretation, nuance, or translation — and the workflow collapses:',
      'Copy.\nSwitch apps.\nPaste.\nRe-explain context.\nRead.\nSwitch back.',
      'That friction kills comprehension and momentum.',
      'I built SnapExplain to remove that friction entirely.',
      'SnapExplain hooks into Android’s text-selection action menu. When you highlight text, an Explain action appears. One tap sends the highlighted text — along with your own predefined system prompt — to an LLM of your choice. The response appears instantly in a lightweight popup, letting you continue reading without disruption.',
      'You stay inside your book.\nThe explanation comes to you.',
      'The system is intentionally model-agnostic. You can use OpenAI-compatible APIs, AvalAI, self-hosted endpoints, or local servers. You control the prompt, model, temperature, and output limits — not the app.',
      'A core design principle of SnapExplain is minimizing cognitive and interface overhead. The popup interface is deliberately constrained, with an optional word limit to keep explanations readable and non-intrusive. The user’s custom prompt defines the explanation style (e.g., simplified language, comparative analysis, translation with nuance), eliminating the need to restate instructions repeatedly.',
      'SnapExplain works with most Android reader applications, including Moon+ Reader and Librera, and requires no special integration from those apps beyond standard text selection. API keys are stored locally on the device, and highlighted text is transmitted only to the endpoint explicitly configured by the user. The application performs no data collection, logging, or analytics.',
      'The project is aimed at readers of academic, technical, or linguistically complex material who need rapid, contextual understanding without interrupting their reading flow. The long-term roadmap focuses on features that further reduce friction—such as offline LLM support, explanation history, and prompt presets—while avoiding unnecessary complexity.',
    ],
  },
  {
    slug: 'project-bpll',
    index: '04',
    title: 'Computer Vision–Based Intraoperative Measurement of Biliopancreatic Limb Length',
    summary: 'A pilot study evaluating whether computer vision can replace subjective visual estimation of biliopancreatic limb (BPL) length during gastric bypass surgery with objective, calibrated intraoperative measurements.',
    year: 2025,
    technologies: [
      'YOLOv11 (Pose Estimation)',
      'Computer Vision',
      'Roboflow',
      'PyTorch',
      'Statistical Agreement Analysis',
    ],
    image: '/images/projects/bpll-measurement.webp',
    imageAlt:
      'Laparoscopic video frame from the biliopancreatic limb measurement: two instrument tips detected and labelled with 0.92 and 0.86 confidence, with a 4.77 cm segment measured between them.',
    overview: 'A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions.',
    details: [
      'In gastric bypass surgery, biliopancreatic limb length is a key technical variable that influences metabolic outcomes and nutrition-related complications. Despite this, limb length is commonly estimated visually, a subjective practice that varies widely between surgeons. This project addressed whether a measurement-oriented computer vision system could provide accurate and reproducible intraoperative length estimates.',
      'I developed and evaluated a YOLOv11-based pose estimation pipeline that detects laparoscopic instruments, estimates their spatial pose, and computes calibrated inter-instrument distances using an in-scene reference segment on the grasper tip. The system converts pixel distances into real-world centimeters without requiring external tracking hardware.',
      'Two model variants (YOLOv11M and YOLOv11L) were trained and benchmarked on annotated laparoscopic video frames adapted from a public dataset. Performance was assessed using COCO detection and pose metrics, with additional agreement analyses comparing computer vision–derived measurements to surgeon estimates and to ruler-based ground truth.',
      'The results showed strong detection and pose performance, with YOLOv11M achieving higher precision and fewer false positives, making it more suitable for safety-critical intraoperative workflows. Surgeon visual estimates demonstrated a consistent bias and wide limits of agreement relative to the computer vision measurements, highlighting the limitations of fixed visual estimation. External validation using a sterile ruler confirmed that the system could recover real-world distances with minimal error.',
      'This study demonstrates the feasibility of objective, calibrated intraoperative limb-length measurement using computer vision and outlines the technical requirements for real-time deployment in bariatric surgery. A manuscript describing this work is currently under review.',
      'A manuscript describing this work is currently under review.',
    ],
  },
  {
    slug: 'project-pemphigus',
    index: '05',
    title: 'Diagnostic Delay and Clinical Course of Pemphigus Vulgaris: An Iranian Cohort Study',
    summary: 'A cross-sectional clinical study examining presentation patterns, diagnostic delays, and treatment outcomes in patients with pemphigus vulgaris, highlighting systemic barriers to early diagnosis.',
    year: 2025,
    technologies: [
      'SPSS',
      'Cross-Sectional Study Design',
      'Clinical Data Collection',
      'Statistical Association Analysis',
    ],
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41640030/',
    overview: 'A cross-sectional clinical study examining presentation patterns, diagnostic delays, and treatment outcomes in patients with pemphigus vulgaris, highlighting systemic barriers to early diagnosis.',
    details: [
      'Pemphigus vulgaris (PV) is a rare autoimmune blistering disease in which delayed diagnosis can substantially worsen disease severity, recurrence risk, and treatment burden. Despite this, real-world data on diagnostic pathways and delays—particularly in Middle Eastern populations—remain limited.',
      'In this study, I analyzed clinical and epidemiological data from 63 patients with biopsy-confirmed PV treated at tertiary referral centers in Iran. Data were collected via structured telephone interviews and medical record review, focusing on initial symptoms, time to diagnosis, prior consultations, misdiagnoses, treatment patterns, recurrence, and disease control.',
      'Most patients initially presented with mucosal lesions and consulted non-dermatology specialists before receiving a definitive diagnosis. Diagnostic delay was substantial, often exceeding one year, and was significantly associated with higher relapse frequency, greater relapse severity, delayed disease control, and longer time to taper systemic corticosteroids.',
      'The study also characterized real-world treatment patterns, showing widespread use of systemic corticosteroids and rituximab, frequent polypharmacy, and high recurrence rates despite treatment. Earlier diagnosis was consistently associated with fewer relapses and improved clinical trajectories.',
      'This work provides population-specific evidence that diagnostic delay—rather than disease severity alone—is a key driver of poor outcomes in pemphigus vulgaris. The findings support targeted education for non-dermatology clinicians and earlier referral pathways for persistent mucosal lesions. The manuscript has been accepted in Immunity, Inflammation and Disease',
    ],
  },
  {
    slug: 'project-uricacid',
    index: '06',
    title: 'Effects of Metabolic and Bariatric Surgery on Serum Uric Acid, Renal Function, and Visceral Adiposity',
    summary: 'A comprehensive systematic review and meta-analysis examining how metabolic and bariatric surgery (MBS) affects serum uric acid over time, and how these changes relate to renal function and visceral adiposity.',
    year: 2025,
    technologies: [
      'R (meta, metafor)',
      'PRISMA Guidelines',
      'Random-Effects Meta-Analysis',
      'Meta-Regression',
      'Sensitivity and Bias Analysis',
    ],
    image: '/images/projects/uricacid-prisma.webp',
    imageAlt:
      'PRISMA flow diagram for the systematic review: records identified from databases and from other methods, screened, assessed for eligibility, and the reports included.',
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41840314/',
    overview: 'A comprehensive systematic review and meta-analysis examining how metabolic and bariatric surgery (MBS) affects serum uric acid over time, and how these changes relate to renal function and visceral adiposity.',
    details: [
      'Hyperuricemia is common in obesity and is closely linked to insulin resistance, visceral fat accumulation, and impaired renal urate excretion. While metabolic and bariatric surgery is known to improve multiple metabolic outcomes, its longitudinal effects on serum uric acid—and the mechanisms underlying these changes—had not been comprehensively synthesized.',
      'In this project, I conducted a PRISMA-compliant systematic review and meta-analysis of 42 studies encompassing 9,468 patients to quantify temporal changes in serum uric acid following bariatric surgery and to examine their associations with renal function markers (creatinine, blood urea nitrogen) and visceral adiposity (waist circumference).',
      'Using random-effects models and meta-regression, I showed that serum uric acid exhibits a brief, non-significant rise in the immediate postoperative period, followed by a sustained and clinically meaningful reduction lasting up to four years, with the greatest decline occurring at 12 months. Subgroup analyses demonstrated that Roux-en-Y gastric bypass produced larger urate reductions than sleeve gastrectomy.',
      'Meta-regression analyses revealed that postoperative serum uric acid levels were positively associated with creatinine, waist circumference, and body mass index, but not with blood urea nitrogen. These findings suggest that urate reduction after surgery is driven primarily by improvements in renal handling of uric acid and reductions in visceral adiposity rather than nonspecific changes in nitrogen metabolism.',
      'Sensitivity analyses, publication bias assessment, and multiple robustness checks confirmed the stability of the results. This work clarifies the metabolic and renal pathways through which bariatric surgery improves hyperuricemia and supports the consideration of uric acid and kidney-related outcomes when selecting surgical strategies for high-risk patients. A full manuscript is currently under review.\nA manuscript describing this work is currently under review.',
    ],
  },
  {
    slug: 'project-weightlosstrajectory',
    index: '07',
    title: 'Post-Bariatric Weight Trajectory Modelling and Clinical Prediction',
    summary: 'A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions.',
    year: 2025,
    technologies: [
      'Python',
      'Mplus',
      'scikit-learn',
      'matplotlib',
      'SHAP',
      'LIME',
      'Structural Equation Modeling (SEM)',
      'latent class analysis',
    ],
    overview: 'A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions.',
    details: [
      'long-term outcomes after bariatric surgery are highly variable, and clinicians often lack tools to anticipate which patients are likely to maintain weight loss and which may struggle over time. This project was my attempt to make those trajectories explicit, measurable, and clinically usable.',
      'I first analysed long-term postoperative weight change using structural equation modelling and latent class approaches to identify distinct weight-trajectory patterns, such as early weight loss with partial regain, late weight loss, steady loss, and rapid loss followed by regain. These latent classes captured clinically meaningful heterogeneity that is usually hidden when outcomes are summarised with averages.',
      'Once these trajectories were established, I examined their associations with key clinical factors, including physical activity, eating behaviours, and obesity-related comorbidities. This step was critical: without linking trajectories to modifiable and non-modifiable factors, the classifications would remain descriptive rather than actionable.',
      'To move from explanation to prediction, I developed machine-learning models to assign patients to weight-trajectory classes using baseline demographic, clinical, and biochemical variables. I applied explainable AI techniques (SHAP and LIME) to ensure that predictions were transparent and could be interpreted at the individual patient level, rather than functioning as a black box.',
      'During external validation, I extended the framework by modelling additional longitudinal trajectories—such as exercise behaviour, fasting blood glucose, and HbA1c—and examining how these interacted with weight trajectories. This substantially improved the clinical interpretability of the results and helped contextualise weight change within broader metabolic health.',
      'Finally, I implemented a prototype web-based service that predicts the most probable postoperative weight-trajectory class for a new patient based on their baseline profile. The tool allows clinicians to explore different postoperative scenarios and serves as a proof of concept for integrating trajectory-based predictions into clinical decision support.',
      'A manuscript describing this work is currently under review.',
    ],
  },
]

/* ----------------------------------------------------------- publications */

export type PublicationStatus = 'published' | 'under-review' | 'in-preparation'

export type Publication = {
  title: string
  /**
   * Author list, verbatim from the CV, corresponding-author `*` included. The
   * CV abbreviates long lists with a dot run (`.....`); that marker is kept so
   * the page never claims an author order the source does not state.
   */
  authors: string[]
  venue: string
  year: number
  /** Journal impact factor or equivalent metric, when known. */
  impact?: string
  /** PubMed / civilica / DOI link, only when verified. */
  url?: string
  status: PublicationStatus
  /** Optional footnote, e.g. a preprint's review status. */
  note?: string
}

/**
 * The CV's Publications section, canonical and verbatim: four published
 * manuscripts (two in Obesity Surgery), then the four ongoing ones. The
 * `*` on `SMM Khadem*` marks corresponding authorship; the section prints the
 * legend. The CV's own dot-run placeholder for omitted co-authors is preserved.
 */
export const publications: Publication[] = [
  {
    title:
      'Unveiling Predictors of Hypoalbuminemia Following One Anastomosis Gastric Bypass (OAGB): A Retrospective Analysis',
    authors: [
      'Arshad Ali',
      'Shahab Shahabi',
      'Delaram Moosavi',
      'SMM Khadem*',
      '.....',
      'Mohammad Kermansaravi',
    ],
    venue: 'Obesity Surgery (Springer)',
    year: 2025,
    impact: 'IF 3.1 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41201758/',
    status: 'published',
  },
  {
    title: 'Navigating the Complexities of Pemphigus Vulgaris: A Comprehensive Iranian Study',
    authors: ['Delaram Moosavi', 'SMM Khadem*', '.....', 'Azadeh Goodarzi'],
    venue: 'Immunity, Inflammation and Disease (Wiley)',
    year: 2025,
    impact: 'IF 2.7 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41640030/',
    status: 'published',
  },
  {
    title:
      'Effects of Metabolic and Bariatric Surgery on Serum Uric Acid and its relation with Renal Function, and Visceral Adiposity: A Systematic Review and Meta-Analysis',
    authors: ['Delaram Moosavi', 'SMM Khadem*', '.....', 'Seyed Arash Javadmoosavi'],
    venue: 'Obesity Surgery (Springer)',
    year: 2025,
    impact: 'IF 3.1 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41840314/',
    status: 'published',
  },
  {
    title:
      'PERSiMED: PERSian Intelligent MEDical Document Reader: A Smart NLP-based Framework for Persian Medical Documents',
    authors: ['SMM Khadem*', 'Jamil Seydi Moradi'],
    venue:
      'The 32nd National and 13th International Conference on Insurance and Development ("Reimagining Supervision in Insurance")',
    year: 2025,
    url: 'https://en.civilica.com/doc/2472372/',
    status: 'published',
  },
  {
    title:
      'ApoE Genotype Related Differences in Hippocampal Shape and Subfield Structure in Cognitively Normal Adults',
    authors: ['SMM Khadem*', 'AmirHussein Abdolalizadeh'],
    venue: 'Manuscript in preparation',
    year: 2026,
    status: 'in-preparation',
  },
  {
    title:
      'Retrieval-Augmented Clinical Question-Answering System for Bariatric Surgery Built on the ASMBS Textbook: From Good to Great',
    authors: [
      'SMM Khadem*',
      'Delaram Moosavi',
      'Mohammad Qasim Sorush',
      'Mohammad Kermansaravi',
      'Shahab Shahabi',
    ],
    venue: 'Research Square',
    year: 2026,
    status: 'under-review',
    note: 'Under review at Obesity Surgery',
  },
  {
    title: 'Biliopancreatic Limb Length: From Estimation to Measurement: A Pilot Study',
    authors: ['SMM Khadem*', '.....', 'Mohammad Kermansaravi'],
    venue: 'Manuscript in preparation',
    year: 2025,
    status: 'in-preparation',
  },
  {
    title:
      'Modeling Long-Term Weight Trajectories After Bariatric Surgery Using Latent Class Analysis and Explainable Machine Learning',
    authors: ['SMM Khadem*', '.....', 'Mohammad Kermansaravi'],
    venue: 'Manuscript in preparation',
    year: 2025,
    status: 'in-preparation',
  },
]

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

/**
 * Teaching and service, verbatim from the CV: four teaching activities, two
 * reviewer journals, five grants/awards and two memberships. `role` carries the
 * activity title, `organisation` the institution; the capacity he served in
 * (Lecturer, Lead Organizer) opens each `detail`.
 */
export const teaching: TeachingService = {
  teaching: [
    {
      role: 'Meta-Analysis Methods for Neuroimaging Studies',
      organisation: 'National Brain Center, Tehran',
      period: '2023',
      detail:
        'Lecturer. A hands-on workshop focused on conducting meta-analyses in neuroimaging studies, covering study selection, effect size extraction, and quantitative synthesis to draw robust, reproducible conclusions from brain imaging data.',
    },
    {
      role: '1st National Health Hackathon',
      organisation: 'IUMS',
      period: '2018',
      detail:
        'Lead organizer. Designed a solution, guided by MIT Health Hackathon frameworks, to bridge collaboration between clinicians and engineers in addressing real-world clinical and healthcare challenges.',
    },
    {
      role: 'Advanced Python Programming for Medical Students',
      organisation: 'IUMS',
      period: '2017',
      detail:
        'Lecturer. An advanced course that trains medical students to use Python libraries such as scikit-learn and statsmodels for statistical analysis, modeling, and data-driven medical research.',
    },
    {
      role: 'Basic Python Programming for Medical Students',
      organisation: 'IUMS',
      period: '2017',
      detail:
        'Lecturer. An introductory programming course designed to equip medical students with foundational Python skills for data handling and analysis.',
    },
  ],
  reviewing: [
    { journal: 'The American Journal of Case Reports', role: 'Peer reviewer' },
    { journal: 'Medical Science Monitor', role: 'Peer reviewer' },
  ],
  grants: [
    {
      title: 'PERSiMED — Persian Intelligent Medical Document Reader',
      funder: 'Saman Insurance Company',
      year: '2025',
      amount: '€1,000',
    },
    {
      title: 'Biliopancreatic Limb Length — From Estimation to Measurement (Pilot Study)',
      funder: 'Minimally Invasive Research Center',
      year: '2024',
      amount: '€800',
    },
    {
      title: 'Effects of Metabolic and Bariatric Surgery on Serum Uric Acid',
      funder: 'IUMS (IR.IUMS.REC.1403.882)',
      year: '2024',
      amount: '€300',
    },
    {
      title: 'Gastric Botulinum Toxin Injection and Weight Loss',
      funder: 'IUMS (IR.IUMS.REC.1403.884)',
      year: '2023',
      amount: '€300',
    },
    {
      title: 'Top 1% Rank Nationwide, Iranian University Entrance Examination (Konkur)',
      year: '2015',
    },
  ],
  memberships: [
    {
      name: 'Iran Medical Council (IRIMC)',
      role: 'Professional membership',
      since: '2022 – present',
    },
    {
      name: 'iAIMS — AI x MS community',
      role: 'Board candidate, Coding Lead',
      since: '2025 – present',
    },
  ],
}

/* ------------------------------------------------------------------- posts */

export type Post = {
  /** Route slug under `/posts/`, derived from the title, kebab-cased. */
  slug: string
  title: string
  /** ISO `YYYY-MM-DD`, verbatim from the Hugo frontmatter. */
  date: string
  /** One-line summary, verbatim from the Hugo frontmatter `description`. */
  description: string
}

/**
 * The four preserved posts, newest first — the order the index and the
 * homepage teaser both read. The bodies live as MDX in `src/content/posts/`,
 * byte-identical to `docs/superpowers/specs/content-backup/posts/` after the
 * `+++` frontmatter is stripped (asserted in `src/data/portfolio.test.ts`);
 * only this metadata moved into the data model.
 */
export const posts: Post[] = [
  {
    slug: 'a-greeting-from-the-depths-of-the-voiceless',
    title: 'A greeting from the depths of the voiceless',
    date: '2026-04-12',
    description: 'A greeting from the depths of the voiceless',
  },
  {
    slug: 'a-tragedy-part-1',
    title: 'A tragedy - part 1',
    date: '2026-02-16',
    description: '.....',
  },
  {
    slug: 'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies',
    title: 'My Linear Model Thinks Getting Older Makes You Poorer (And Other Statistical Tragedies)',
    date: '2025-10-26',
    description: 'About a Common pitfalls in the interpretation of coefficients of linear models',
  },
  {
    slug: 'how-to-build-a-hugo-site',
    title: 'How to Build a Hugo Site',
    date: '2025-01-17',
    description: 'An Instruction to Build a simple Hugo site',
  },
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * `2026-04-12` → `12 April 2026`. Hand-rolled rather than `Intl.DateTimeFormat`
 * so the rendered date cannot drift with the host locale or ICU build — the
 * pages print it in mono meta lines and the tests pin the exact string.
 */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split('-')

  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ''} ${year}`
}
