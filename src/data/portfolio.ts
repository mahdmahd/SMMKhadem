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
  title: 'M.D. · Medical AI Researcher',
  tagline:
    'A medical doctor and AI developer at the intersection of medicine and machine learning. I build clinical AI that is interpretable, validated and actually usable, from routine brain MRI to bariatric surgery and Persian medical documents.',
  location: 'Tehran, Iran',
  email: 'Smmehdikhadem@gmail.com',
  cvUrl: '/cv.pdf',
}

/* ----------------------------------------------------------------- opening */

export type OpeningStage = {
  /** Label in the stage list on the right of the opening. */
  label: string
  eyebrow: string
  line: string
}

export type OpeningCopy = {
  /** The intro writes the first word in dots, then letter-swaps to the second. */
  words: [string, string]
  /** Where the second word splits once it settles (`Mehdi` | ` Khadem`). */
  splitAt: number
  role: { bold: string; light: string }
  /** Threshold-traced portrait: the face is in the unfilled white. */
  avatarUrl: string
  /** Shaded brain on a flat blue backdrop; the blue is keyed out. */
  brainUrl: string
  /** One per stage: starfield + name, avatar, brain. */
  stages: [OpeningStage, OpeningStage, OpeningStage]
}

export const opening: OpeningCopy = {
  words: ['Mehdi', 'Mehdi Khadem'],
  splitAt: 5,
  role: { bold: 'Medical AI', light: 'Researcher' },
  avatarUrl: '/images/opening/avatar.svg',
  brainUrl: '/images/opening/brain.png',
  stages: [
    { label: 'Name', eyebrow: '', line: '' },
    {
      label: 'Face',
      eyebrow: 'This is me',
      line: 'A medical doctor who builds AI that clinicians can trust and actually use.',
    },
    {
      label: 'Mind',
      eyebrow: 'How I think',
      line: 'Real clinical data is noisy and imperfect. That is exactly where I like to work.',
    },
  ],
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
  'I came to data science through medicine. My M.D. thesis asked whether **routine clinical MRI** could explain cognitive decline in **frontotemporal dementia**, and answering it meant learning **neuroimaging** properly: reconstruction, FreeSurfer and SPM pipelines, and the statistics to defend the result.',
  'General practice taught me that research questions arrive as people, not datasets, and that I enjoy mathematics most when it meets a real clinical problem.',
  'At the Minimally Invasive Surgery Research Center I moved to **bariatric surgery**: **explainable AI** that clinicians can inspect, bedside scores instead of black boxes, and **RAG** grounded in the textbook surgeons trust. At Saman Insurance I build **clinical NLP** for **Persian medical documents**, with humans in the loop.',
  'Now, as Principal Medical AI Product and Innovation Lead at AIMedic, I take clinical imaging AI from prototype to pilot: vision language models, mammography and brain CT, structured radiology reporting. I do not want to be a clinician who uses AI. I want to understand it deeply enough to make it trustworthy.',
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
    organisation: 'Minimally Invasive Surgery Research Center',
    period: '2024 – present',
  },
  {
    role: 'Medical Insurance Consultant (AI & Analytics)',
    organisation: 'Saman Insurance',
    period: '2025 – present',
  },
  {
    role: 'Principal Medical AI Product & Innovation Lead',
    organisation: 'AIMedic',
    period: '2026 – present',
  },
]

/* ----------------------------------------------------------------- toolkit */

/** Chip rows for the methods marquee: one row per method family, CV order. */
export const toolkit: string[][] = [
  ['Python', 'R', 'MATLAB', 'SQL', 'Git', 'Linux', 'Docker', 'JavaScript', 'HTML/CSS'],
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
      'Slice to volume reconstruction (SVRTK) that lifts 1.5T, low resolution 2D hospital scans back to analysable volumes.',
      'SynthSeg segmentation that survives heterogeneous contrast and resolution, so routine hospital imaging stays usable at scale.',
      'Hippocampal subfield shape and thickness across ApoE genotypes in ADNI, using tetrahedral mesh geometry beyond global volume.',
    ],
  },
  {
    id: 'surgical-data-science',
    index: '02',
    title: 'Surgical Data Science & Bariatric AI',
    bullets: [
      'Building and harmonising multimodal clinical datasets from bariatric surgery cohorts of several thousand patients.',
      'A bedside score for hypoalbuminemia after one anastomosis gastric bypass (AUROC 0.80 at cutoff 55), validated on a later year of patients.',
      'Computer vision measurement of biliopancreatic limb length from laparoscopic video, calibrated from pixels to centimetres.',
      'Weight-trajectory modelling with latent class analysis and structural equation modelling, paired with explainable ML for patient-level prediction.',
    ],
  },
  {
    id: 'clinical-nlp',
    index: '03',
    title: 'Clinical NLP & Medical Documents',
    bullets: [
      'PERSiMED: a Persian medical document reader that pairs CNN segmentation with vision language models, processing over 96% of 2,000 real insurance documents.',
      'Retrieval augmented question answering grounded in the ASMBS textbook: GPT-5 reached 94% on 200 board style questions, eleven points above the earlier benchmark.',
      'LLM workflows for insurance medicine: claims automation, duplicate claim and upcoding detection, and longitudinal patient records.',
      'At AIMedic: vision language models for structured radiology reporting, and mammography and brain CT analysis taken from prototype to pilot.',
      'Privacy aware outputs (annotated image, layout preserving HTML and structured JSON) instead of raw OCR text.',
    ],
  },
  {
    id: 'evidence-synthesis',
    index: '04',
    title: 'Evidence Synthesis & Meta-Analysis',
    bullets: [
      'PRISMA compliant systematic reviews with prespecified search, screening, extraction and risk of bias protocols.',
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
      'Interpretability methods (attribution scores, rule-based scores), so the clinicians who act on a model can see what drives it.',
      'AutoScore conversion of models into integer bedside scores, rather than opaque probabilities.',
      'Temporal validation: train on earlier years, test on a later one, so the model is honest about the future.',
      'Honest reporting of discrimination, calibration and the limits of single centre retrospective data.',
    ],
  },
]

/* --------------------------------------------------------------- projects */

/** One headline number on a project: `94%` over `GPT-5 with retrieval`. */
export type Highlight = {
  value: string
  label: string
}

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
  /** Where it appeared (or its status), printed as the card's eyebrow. */
  venue?: string
  /** His part in it, from the paper's author contributions. */
  role?: string
  /** Two or three headline numbers, printed as a stat row. */
  highlights?: Highlight[]
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
    title: 'PERSiMED: Reading Persian Medical Documents with Vision Language Models',
    summary:
      'Insurance staff in Iran still read thousands of scanned medical documents by hand. PERSiMED turns those scans into structured, searchable data: a CNN cleans and straightens each page, then a vision language model reads Persian and English together.',
    year: 2025,
    venue: 'Conference on Insurance and Development · 2025',
    role: 'First author · Designed and built the pipeline',
    highlights: [
      { value: '2,000', label: 'real insurance documents' },
      { value: '96%', label: 'processed end to end' },
      { value: '3', label: 'outputs per page: image, HTML, JSON' },
    ],
    technologies: [
      'Python',
      'CNN segmentation',
      'Vision language models',
      'Computer vision',
      'BeautifulSoup',
      'Structured data pipelines',
    ],
    image: '/images/projects/persimed-flowchart.webp',
    imageAlt:
      'Three panels of the PERSiMED pipeline on one Persian sonography report: the scanned page, the extracted text with its bounding boxes and confidence scores as JSON, and the same page with the detected regions outlined.',
    paperUrl: 'https://en.civilica.com/doc/2472372/',
    codeUrl: 'https://github.com/mahdmahd/PERSiMED',
    overview:
      'A complete pipeline that reads scanned Persian medical documents and returns structured, privacy aware outputs that an insurance company can actually use.',
    details: [
      'In Persian speaking healthcare, medical documents are still processed by hand. The pages mix Persian and English, run right to left, carry handwritten notes and follow no standard format. Classic OCR breaks on exactly these pages, so the work stays slow, expensive and error prone.',
      'I asked a simple question: why treat reading and understanding as two separate steps? PERSiMED joins them. A CNN finds the document boundary, fixes the orientation and straightens the page. A vision language model then reads the text and interprets the medical terms in context, in both languages at once.',
      'Every page comes out in three synchronized forms: an annotated image for visual checking, clean HTML that keeps the layout, and structured JSON ready for a database. I also benchmarked several models on mixed Persian and English documents and ran a cost analysis, so the choice of model is an affordable one and not only an accurate one.',
      'On 2,000 real insurance documents, more than 96% were processed successfully from scan to structured output. Most failures came from badly degraded scans, not from the models. The targets are concrete: faster claims, detection of duplicate claims and upcoding, and longitudinal patient records built from documents that already exist.',
      'The project was funded by Saman Insurance and presented at the 32nd National and 13th International Conference on Insurance and Development.',
    ],
  },
  {
    slug: 'project-5',
    index: '02',
    title: 'RAG for Bariatric Surgery: From Good to Great',
    summary:
      'Large language models answer surgical questions with confidence, even when they are wrong. I built a retrieval augmented system that answers only from the ASMBS Textbook of Bariatric Surgery. On 200 board style questions, GPT-5 with retrieval reached 94% accuracy.',
    year: 2026,
    venue: 'Research Square preprint · 2026 · under review',
    role: 'First author · Designed the method, built the system and the web app',
    highlights: [
      { value: '94%', label: 'GPT-5 with retrieval' },
      { value: '+14', label: 'points for GPT-4o-mini' },
      { value: '200', label: 'questions across 56 chapters' },
    ],
    technologies: ['Python', 'LangChain', 'ChromaDB', 'OpenAI API', 'Flask', 'LLM evaluation'],
    image: '/images/projects/rag-pipeline.webp',
    imageAlt:
      'Flow chart of the retrieval pipeline: the user query passes through query augmentation, the textbook retriever over a ChromaDB index built from chunked textbook text, a two stage relevance and usefulness filter, and the LLM reader, to the final answer.',
    paperUrl: 'https://doi.org/10.21203/rs.3.rs-9979413/v1',
    overview:
      'A clinical question answering system grounded in the ASMBS Textbook of Bariatric Surgery, so the answer comes from the source surgeons trust and not from what the model happens to remember.',
    details: [
      'A published benchmark showed ChatGPT answering about 83% of the ASMBS end of chapter questions correctly. Good, but not good enough for a field where a confident wrong answer can reach a patient. So the question was clear: can we move from good to great, and stop the hallucinations at the same time?',
      'The system follows the LLM AMT design. First it rewrites each question into precise medical terms and expands it. Then it searches a ChromaDB index of the whole textbook, built with text-embedding-3-large, and takes the ten most relevant passages. An LLM filters those passages twice, first for relevance and then for usefulness, and only the survivors reach the model that writes the answer.',
      'I tested it on 200 end of chapter questions covering all 56 chapters, with and without retrieval, and reported accuracy with Wilson 95% confidence intervals. GPT-5 rose from 87.0% to 94.0% (188 of 200). GPT-4 rose from 81.0% to 89.5%, and GPT-4o-mini from 70.5% to 84.5%. The best result is eleven points above the earlier ChatGPT benchmark. The weakest domains were operative technique and complications, at 88.9% each.',
      'There is a working web application on top of it. Access is restricted because the textbook is copyrighted, and the full question set cannot be published for the same reason.',
    ],
  },
  {
    slug: 'project-8',
    index: '03',
    title: 'Predicting Hypoalbuminemia After One Anastomosis Gastric Bypass',
    summary:
      'Which patients will lose albumin after gastric bypass, and can we know before surgery? From 3,242 patients in the national obesity surgery database, I built an interpretable model and turned it into a points score a surgeon can add up at the bedside.',
    year: 2025,
    venue: 'Obesity Surgery · 2025',
    role: 'Coauthor · Data analysis, modelling and interpretation',
    highlights: [
      { value: '0.80', label: 'AUROC of the bedside score' },
      { value: '3,242', label: 'patients, 2018 to 2023' },
      { value: '83%', label: 'sensitivity at cutoff 55' },
    ],
    technologies: ['Python', 'Scikit-learn', 'XGBoost', 'Random Forest', 'SHAP', 'AutoScore', 'KNN imputation'],
    image: '/images/projects/oagb-shap-summary.webp',
    imageAlt:
      'SHAP summary plot ranking the predictors of hypoalbuminemia: age first, then biliopancreatic limb length adjusted for height, ferritin, BMI, height and haemoglobin, each dot one patient coloured by feature value.',
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41201758/',
    overview:
      'An interpretable prediction model for hypoalbuminemia within a year of one anastomosis gastric bypass, converted into an integer score for use before and after surgery.',
    details: [
      'My colleagues first wanted to compare two groups of patients. I asked a different question: what if we could predict who will develop hypoalbuminemia, and give the surgeon a simple score to act on?',
      'We used 3,242 OAGB patients from the Iranian National Obesity Surgery Database, 74 of whom developed serum albumin below 3.5 g/dL within a year. Missing values were filled with KNN imputation. Random Forest, XGBoost and logistic regression were tuned with leave one year out cross validation, then tested on a separate 2023 cohort of 706 patients. Splitting by time, not at random, is what keeps the model honest about the future.',
      'The models reached AUROCs of 0.81, 0.83 and 0.78. SHAP showed what drives the risk: age, biliopancreatic limb length adjusted for height, ferritin, BMI, height and haemoglobin. AutoScore converted these into integer points. The final score reached an AUROC of 0.80, with 83.3% sensitivity and 67% specificity at a cutoff of 55, and stayed between 0.82 and 0.88 across surgery years.',
      'Most cases appeared early, about two thirds within the first six months. So a high score means one practical thing: closer nutritional follow up in that window. A model is only worth something if the clinician can read it and use it.',
    ],
  },
  {
    slug: 'project-3',
    index: '04',
    title: 'ApoE and the Shape of the Hippocampus',
    summary:
      'ApoE ε4 is the strongest common genetic risk factor for Alzheimer’s disease. Using high resolution ADNI scans of cognitively normal adults, I asked whether the hippocampus already differs in shape across ApoE genotypes, before any global atrophy shows.',
    year: 2026,
    venue: 'Manuscript in preparation',
    role: 'First author · Analysis and writing',
    highlights: [
      { value: '3', label: 'genotype groups: ε4/ε4, ε3/ε4, ε3/ε3' },
      { value: 'ADNI', label: 'high resolution hippocampal MRI' },
    ],
    technologies: ['FreeSurfer', 'HIPSTA', 'Computational geometry', 'High resolution MRI', 'ADNI'],
    overview:
      'A morphometric study of hippocampal subfields across ApoE genotypes, looking at local shape and thickness instead of global volume.',
    details: [
      'We know ApoE ε4 raises the risk of Alzheimer’s disease. We know much less about where in the brain that risk first becomes visible. My hypothesis was that hippocampal shape differs across genotypes even in people with no cognitive complaint.',
      'I stratified cognitively healthy ADNI participants into ε4/ε4, ε3/ε4 and ε3/ε3 groups. Hippocampal subfields were segmented with FreeSurfer, and HIPSTA built a tetrahedral mesh of each hippocampus to measure thickness and shape point by point.',
      'Volume is a single number for the whole structure. Shape is a map. Looking at local thickness lets us see which subfields change first, and that is a more sensitive marker of genetic vulnerability than global atrophy.',
      'The analysis is complete and the manuscript is in preparation. The results support the idea that ApoE ε4 shows up first as subtle, regional changes in hippocampal shape.',
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
    title: 'M.D. Thesis: Frontotemporal Dementia on Routine Clinical MRI',
    summary:
      'Can the ordinary MRI scans of a hospital tell us something real about cognition in frontotemporal dementia? I reconstructed low resolution clinical scans into analysable volumes and linked regional brain changes to MMSE and MoCA subdomains.',
    year: 2022,
    venue: 'M.D. thesis · Iran University of Medical Sciences · 2022',
    role: 'Sole investigator · Thesis graded 90%',
    technologies: ['SVRTK', 'FreeSurfer', 'SPM', 'SynthSeg', 'Clinical MRI'],
    image: '/images/projects/cortical-surface.webp',
    imageAlt:
      'Three dimensional cortical surface model in a colour coded viewer, shown with superior, posterior and anterior orientation labels.',
    overview:
      'An M.D. thesis on structural correlates of cognitive impairment in frontotemporal dementia, using the routine 1.5T scans that hospitals already have.',
    details: [
      'Frontotemporal dementia is heterogeneous, and routine imaging reports rarely capture what the patient is actually losing. For my M.D. thesis I asked whether standard hospital MRI could be linked to neuropsychological performance in a meaningful way.',
      'The data were 1.5T, low resolution 2D scans from Firoozgar and Rasoul Akram hospitals, never meant for research. I used slice to volume reconstruction (SVRTK) to rebuild them into volumes, then learned and tuned FreeSurfer and SPM pipelines for segmentation, cortical and subcortical analysis, and statistics.',
      'Instead of relying on global scores, I related regional findings to MMSE and MoCA subdomains, and read the neuroanatomy literature closely to interpret each association. As the data revealed their limits, I refined the hypotheses and added analyses to make the results robust.',
      'The thesis, “Evaluation of Neuroimaging Findings and Neuropsychological Test Data in Frontotemporal Dementia Patients in Firoozgar and Rasoul Akram Hospitals”, received a final grade of 90%. The lesson stayed with me: imperfect, heterogeneous clinical data can still answer real questions if you treat it carefully.',
    ],
  },
  {
    slug: 'project-2',
    index: '02',
    title: 'After the Thesis: Generative AI for Clinical Brain MRI',
    summary:
      'Hospitals hold far more brain MRI than any research study, but most of it is low resolution and ignored. This ongoing work combines slice to volume reconstruction with SynthSeg so routine scans can be analysed at scale.',
    year: 2023,
    venue: 'Ongoing research',
    technologies: ['FreeSurfer', 'SynthSeg', 'Slice to volume reconstruction', 'Clinical MRI'],
    overview:
      'Ongoing work to make routine clinical brain MRI usable for large neurodegeneration studies, not only the small set of research grade scans.',
    details: [
      'Most neurodegeneration studies use high resolution research scans and ignore the routine MRI that hospitals produce every day. That routine data is noisier, but it covers real patients, real protocols and years of follow up.',
      'After my thesis I kept improving the reconstruction pipeline and added SynthSeg, a generative AI segmentation model that works across contrasts and resolutions. Where classic tools reject a scan for its quality, SynthSeg still produces a usable segmentation.',
      'The aim is to move from small, highly controlled cohorts to large analyses that represent the full spectrum of disease, using data that already exists.',
    ],
  },
  {
    slug: 'project-7',
    index: '03',
    title: 'SnapExplain: An LLM in the Android Text Selection Menu',
    summary:
      'Reading a dense paper on a phone breaks every time you need an explanation. SnapExplain adds an Explain action to Android’s text selection menu: highlight a sentence, get a short answer from the model of your choice, and keep reading.',
    year: 2025,
    venue: 'Open source Android app · 2025',
    role: 'Author',
    technologies: ['Kotlin', 'Android SDK', 'OpenAI compatible APIs', 'LLMs', 'Android text selection API', 'Gradle'],
    image: '/images/projects/snapexplain.webp',
    imageAlt:
      'SnapExplain on Android: a paper open in a PDF reader with the text selection menu showing the “Explain (≤100 words)” action.',
    codeUrl: 'https://github.com/mahdmahd/SnapExplain',
    demoUrl: 'https://github.com/mahdmahd/SnapExplain/releases/tag/V0.1',
    overview:
      'An Android utility that brings LLM explanations into the reading app you are already using. No app switching, no prompt rewriting, no broken focus.',
    details: [
      'Reading academic text on a phone has a familiar failure. You hit a sentence that needs interpretation or translation, and the workflow collapses: copy, switch apps, paste, explain the context again, read, switch back. That friction kills comprehension.',
      'SnapExplain hooks into the text selection menu. Highlight text and an Explain action appears. One tap sends the selection, with your own predefined prompt, to the model you chose, and the answer opens in a small popup over the page.',
      'It is model agnostic: OpenAI compatible APIs, AvalAI, self hosted or local servers. You control the prompt, the model, the temperature and an optional word limit. It works with readers such as Moon+ Reader and Librera without any special integration.',
      'API keys stay on the device, and the selected text goes only to the endpoint you configured. There is no data collection, logging or analytics. Next on the roadmap are offline models, an explanation history and prompt presets.',
    ],
  },
  {
    slug: 'project-bpll',
    index: '04',
    title: 'Measuring Biliopancreatic Limb Length with Computer Vision',
    summary:
      'In gastric bypass, surgeons still estimate bowel length by eye. This pilot asks whether computer vision can move us from estimation to measurement, using the grasper tip already in the frame as a ruler.',
    year: 2026,
    venue: 'Manuscript in preparation · pilot study',
    role: 'Lead · Pipeline, annotation review and analysis',
    highlights: [
      { value: '−0.02 cm', label: 'mean error against a sterile ruler' },
      { value: '56.8%', label: 'of surgeon estimates within 1 cm' },
      { value: '98.6%', label: 'precision, YOLOv11M' },
    ],
    technologies: ['YOLOv11 pose estimation', 'ByteTrack', 'PyTorch', 'Roboflow', 'Bland Altman analysis'],
    image: '/images/projects/bpll-measurement.webp',
    imageAlt:
      'Laparoscopic video frame from the limb measurement pipeline: two graspers detected with keypoints on their tips, a line drawn between them and a 4.92 cm distance readout, with the pixel to centimetre rate shown.',
    overview:
      'A computer vision pipeline that measures the distance between two laparoscopic instruments in centimetres, to replace visual estimation of biliopancreatic limb length.',
    details: [
      'Biliopancreatic limb length shapes metabolic results and nutritional complications after gastric bypass, yet it is usually measured by eye. Visual estimation varies between surgeons, and nobody can audit it afterwards.',
      'I built GB LimbCalc around YOLOv11 pose estimation. Each grasper gets two keypoints, ByteTrack follows the instruments across frames, and the visible 2.5 cm grasper tip becomes the scale that converts pixels into centimetres. No extra tracking hardware is needed.',
      'The medium and large models were fine tuned on 1,632 frames from 29 public laparoscopic videos (3,948 after augmentation). The medium model won on precision, 98.62% against 96.01%, with pose mAP of 92.8% for both. In the safety critical setting of an operation, fewer false positives matter more than a slightly higher recall.',
      'Across 74 measurements in 9 patients, the system read a mean of 5.42 cm where surgeons intended 5 cm. Bland Altman bias was −0.42 cm with wide limits of agreement, and only 56.8% of surgeon estimates fell within 1 cm. Against a sterile ruler the mean error was −0.022 cm. Yes, measurement is feasible.',
    ],
  },
  {
    slug: 'project-pemphigus',
    index: '05',
    title: 'Diagnostic Delay in Pemphigus Vulgaris: An Iranian Cohort',
    summary:
      'Patients with pemphigus vulgaris waited a mean of 16.7 months for a diagnosis, and most saw other specialists first. Longer delay meant more relapses and slower control of the disease.',
    year: 2026,
    venue: 'Immunity, Inflammation and Disease · 2026',
    role: 'Second author · Study design, analysis and interpretation',
    highlights: [
      { value: '16.7 mo', label: 'mean time to diagnosis' },
      { value: '87%', label: 'first saw a non dermatologist' },
      { value: '63', label: 'biopsy confirmed patients' },
    ],
    technologies: ['SPSS', 'Nonparametric statistics', 'Retrospective cohort design', 'Clinical data collection'],
    image: '/images/projects/pemphigus-symptom-interval.webp',
    imageAlt:
      'Dot plot of the interval between the first and second symptom of pemphigus vulgaris: most patients cluster near zero months, with a long tail reaching almost 100 months.',
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41640030/',
    overview:
      'A retrospective study of how patients with pemphigus vulgaris reach their diagnosis, and what the delay costs them.',
    details: [
      'Pemphigus vulgaris is a rare autoimmune blistering disease, and a late diagnosis makes everything harder. Real world data on how patients reach that diagnosis in the Middle East is scarce.',
      'We studied 63 patients confirmed by biopsy, direct immunofluorescence and ELISA at two Tehran laboratories between 2011 and 2021, and interviewed them by phone with a structured questionnaire. The analysis used Mann Whitney U, Kruskal Wallis and Spearman correlation.',
      'Seventy percent first presented with mucosal lesions. The mean time to diagnosis was 16.7 months, 87.3% first consulted clinicians outside dermatology, and aphthous ulcer was the most common misdiagnosis (31.7%). Treatment was mostly prednisolone (84.7%) and rituximab (57.6%), and 49.2% relapsed.',
      'Longer delay was associated with more relapses (p = 0.031), slower disease control (p = 0.029) and a longer time to taper prednisolone to 7.5 mg (p < 0.0001). The message is practical: persistent mucosal lesions deserve early referral.',
    ],
  },
  {
    slug: 'project-uricacid',
    index: '06',
    title: 'Uric Acid After Metabolic and Bariatric Surgery: A Meta-Analysis',
    summary:
      'Across 42 studies and 9,468 patients, serum uric acid rose briefly after surgery, then fell for up to four years. The largest drop came at 12 months, and it tracked kidney function and visceral fat.',
    year: 2026,
    venue: 'Obesity Surgery · 2026',
    role: 'Second author · Supervision, data validation and methods',
    highlights: [
      { value: '42', label: 'studies, 9,468 patients' },
      { value: '−1.43', label: 'mg/dL at 12 months' },
      { value: 'RYGB', label: 'larger drop than sleeve gastrectomy' },
    ],
    technologies: ['R (meta, metafor)', 'PRISMA', 'Multilevel random effects', 'Meta regression', 'Sensitivity analysis'],
    image: '/images/projects/uricacid-trajectory.webp',
    imageAlt:
      'Trajectory of uric acid change over time after bariatric surgery: a pooled mean difference with 95% confidence intervals, above zero at 7 days and below zero from 3 months to 48 months, with patient counts at each time point.',
    paperUrl: 'https://pubmed.ncbi.nlm.nih.gov/41840314/',
    overview:
      'A systematic review and meta-analysis of serum uric acid over time after metabolic and bariatric surgery, and of what drives the change.',
    details: [
      'Obesity raises serum uric acid through insulin resistance, visceral fat and poorer renal excretion. Surgery improves many metabolic outcomes, but its effect on uric acid over time had not been pooled properly.',
      'We searched PubMed, Embase, Scopus and Web of Science and included 42 studies with 9,468 patients, rated with the Newcastle Ottawa Scale. The analysis used random effects and multilevel models by time point in R (meta, metafor), subgroups by procedure, meta regression with Knapp Hartung adjustment, Egger’s test and leave one out sensitivity analysis.',
      'Uric acid rose slightly and not significantly at 7 days (+1.51 mg/dL), then fell, with the largest reduction at 12 months (mean difference −1.43 mg/dL, 95% CI −1.80 to −1.07). The drop was larger after Roux en Y gastric bypass than after sleeve gastrectomy (−1.30 against −0.72).',
      'After surgery, uric acid tracked creatinine, waist circumference and BMI, but not blood urea nitrogen. So the reduction most likely comes from better renal handling of urate and less visceral fat, which matters when choosing a procedure for a patient at high risk.',
    ],
  },
  {
    slug: 'project-weightlosstrajectory',
    index: '07',
    title: 'Weight Trajectories After Bariatric Surgery',
    summary:
      'Averages hide the patients who regain. I modelled long term weight change as distinct trajectories, linked them to behaviour and comorbidity, and trained explainable models to predict a new patient’s likely trajectory.',
    year: 2025,
    venue: 'Manuscript in preparation',
    role: 'First author · Modelling and prediction',
    technologies: ['Python', 'Mplus', 'Scikit-learn', 'SHAP', 'LIME', 'Structural equation modelling', 'Latent class analysis'],
    overview:
      'Trajectory modelling of long term weight change after bariatric surgery, turned into explainable predictions for individual patients.',
    details: [
      'Outcomes after bariatric surgery vary widely, and clinicians have few tools to see who will keep the weight off and who will struggle. This project makes those trajectories explicit.',
      'With structural equation modelling and latent class analysis I identified distinct patterns: early loss with partial regain, late loss, steady loss, and rapid loss followed by regain. Then I linked each pattern to physical activity, eating behaviour and comorbidities, so the classes become actionable and not only descriptive.',
      'Machine learning models then assign a new patient to a trajectory from baseline data, and SHAP and LIME explain each prediction at the level of the individual patient. During external validation I added trajectories for exercise, fasting glucose and HbA1c to place weight change inside broader metabolic health.',
      'A prototype web service predicts the most likely trajectory for a new patient and lets clinicians explore scenarios. The manuscript is in preparation.',
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
 * Publications, checked against the papers themselves (2026-10-20): full
 * author lists, volumes and years as printed. `*` marks the corresponding
 * author where the paper names one; the section prints the legend. Four
 * published, then the preprint under review, then manuscripts in preparation.
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
      'Farid Ahmad Qaderi',
      'Fahimeh Yarigholi',
      'Abdolreza Pazouki',
      'Mohammad Kermansaravi',
    ],
    venue: 'Obesity Surgery (Springer) 35:5275–5287',
    year: 2025,
    impact: 'IF 3.1 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41201758/',
    status: 'published',
  },
  {
    title:
      'Effects of Metabolic and Bariatric Surgery on Serum Uric Acid and its Association with Renal Function, and Visceral Adiposity: A Systematic Review and Meta-Analysis',
    authors: [
      'Delaram Moosavi',
      'SMM Khadem*',
      'Nogol Motamed-Gorji',
      'Seyed Arash Javadmoosavi',
      'Shahab Shahabi',
    ],
    venue: 'Obesity Surgery (Springer) 36:1975–1987',
    year: 2026,
    impact: 'IF 3.1 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41840314/',
    status: 'published',
  },
  {
    title: 'Navigating the Complexities of Pemphigus Vulgaris: A Comprehensive Iranian Study',
    authors: [
      'Delaram Moosavi',
      'SMM Khadem',
      'Afsaneh Sadeghzadeh Bazargan*',
      'Kambiz Kamyab Hesari',
      'Mehrnaz Azh',
      'Hamed Zarei Sharif',
      'Nasrin Shayanfar',
      'Azadeh Goodarzi',
    ],
    venue: 'Immunity, Inflammation and Disease (Wiley) 14:e70317',
    year: 2026,
    impact: 'IF 2.7 · Q1 (2024)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41640030/',
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
      'Retrieval-Augmented Clinical Question-Answering System for Bariatric Surgery Built on the ASMBS Textbook: From Good to Great',
    authors: [
      'SMM Khadem*',
      'Delaram Moosavi',
      'Mohammad Qasim Sorush',
      'Mohammad Kermansaravi',
      'Shahab Shahabi',
    ],
    venue: 'Research Square (preprint)',
    year: 2026,
    url: 'https://doi.org/10.21203/rs.3.rs-9979413/v1',
    status: 'under-review',
    note: 'Under review at Obesity Surgery',
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
      'From Visual Estimation to Computer Vision–Based Intraoperative Distance Measurement for Biliopancreatic Limb Assessment: A Pilot Study',
    authors: ['SMM Khadem*', '.....', 'Mohammad Kermansaravi'],
    venue: 'Manuscript in preparation',
    year: 2026,
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
      title: 'PERSiMED: Persian Intelligent Medical Document Reader',
      funder: 'Saman Insurance Company',
      year: '2025',
      amount: '€1,000',
    },
    {
      title: 'Biliopancreatic Limb Length: From Estimation to Measurement (Pilot Study)',
      funder: 'Minimally Invasive Surgery Research Center',
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
      name: 'iAIMS: AI x MS community',
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
