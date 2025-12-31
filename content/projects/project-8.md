---
title: "Unveiling Predictors of Hypoalbuminemia Following One Anastomosis Gastric Bypass (OAGB): A Retrospective Analysis"
date: 2025-10-12
year: 2025
summary: "A machine learning-based clinical scoring system designed to predict hypoalbuminemia risk following One-Anastomosis Gastric Bypass (OAGB) surgery, enabling early intervention and personalized patient care."
image: "images/projects/1.png"
draft : false
technologies: "Machine Learning (XGBoost, Random Forest), Explainable AI (SHAP values), AutoScore Framework, AutoScore, Python (Scikit-learn, XGBoost), Scoring System"
paper_url: "https://link.springer.com/article/10.1007/s11695-025-08348-9"
code_url: "https://github.com/mahdmahd/SnapExplain"

---
<!--more-->
## Overview
A machine learning-based clinical scoring system designed to predict hypoalbuminemia risk following One-Anastomosis Gastric Bypass (OAGB) surgery, enabling early intervention and personalized patient care.



## Project Details
Let's be honest, managing post-bariatric surgery complications like hypoalbuminemia can be challenging, especially when trying to identify at-risk patients before symptoms manifest. After analyzing data from over 3,200 patients who underwent OAGB procedures between 2018-2023, our research team developed a practical scoring system that transforms complex clinical predictors into an actionable risk assessment tool – as straightforward as checking a patient's vital signs.

The core innovation is a transparent, clinically interpretable scoring algorithm derived from advanced machine learning models. We identified key predictors that independently increase hypoalbuminemia risk: age ≥ 41 years, lower ferritin and hemoglobin levels, severe obesity (BMI 40-59.9 kg/m² or higher), shorter height, and a higher biliopancreatic-limb-to-height ratio. Using the AutoScore framework, we converted these complex relationships into an easy-to-use integer scoring system with remarkable accuracy (AUROC 0.80).

What makes this tool truly valuable in clinical practice is its simplicity – with a cutoff score of 55, healthcare providers can quickly stratify patients into low-risk (<55) and high-risk (≥55) categories. Those scoring high should receive intensified nutritional monitoring during the vulnerable early recovery period, particularly within the first 6 months when hypoalbuminemia most commonly develops. While this single-center retrospective study awaits external validation, this scoring system represents our commitment to precision medicine in bariatric care.

This research represents years of collaborative work across multiple specialties, and I'm particularly grateful to my colleagues at the Minimally Invasive Surgery Research Center for their invaluable insights and dedication to improving patient outcomes after metabolic surgery.