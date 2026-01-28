---
title: "Post-Bariatric Weight Trajectory Modelling and Clinical Prediction"
date: 2025-10-12
year: 2025
summary: "A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions."
draft : false
technologies: "Python,Mplus,scikit-learn,matplotlib,SHAP,LIME,Structural Equation Modeling (SEM),latent class analysis"
paper_url: "https://pubmed.ncbi.nlm.nih.gov/41201758/"
code_url: "https://github.com/mahdmahd/SnapExplain"

---
<!--more-->
## Overview
A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions.



## Project Details
long-term outcomes after bariatric surgery are highly variable, and clinicians often lack tools to anticipate which patients are likely to maintain weight loss and which may struggle over time. This project was my attempt to make those trajectories explicit, measurable, and clinically usable.

I first analysed long-term postoperative weight change using structural equation modelling and latent class approaches to identify distinct weight-trajectory patterns, such as early weight loss with partial regain, late weight loss, steady loss, and rapid loss followed by regain. These latent classes captured clinically meaningful heterogeneity that is usually hidden when outcomes are summarised with averages.

Once these trajectories were established, I examined their associations with key clinical factors, including physical activity, eating behaviours, and obesity-related comorbidities. This step was critical: without linking trajectories to modifiable and non-modifiable factors, the classifications would remain descriptive rather than actionable.

To move from explanation to prediction, I developed machine-learning models to assign patients to weight-trajectory classes using baseline demographic, clinical, and biochemical variables. I applied explainable AI techniques (SHAP and LIME) to ensure that predictions were transparent and could be interpreted at the individual patient level, rather than functioning as a black box.

During external validation, I extended the framework by modelling additional longitudinal trajectories—such as exercise behaviour, fasting blood glucose, and HbA1c—and examining how these interacted with weight trajectories. This substantially improved the clinical interpretability of the results and helped contextualise weight change within broader metabolic health.

Finally, I implemented a prototype web-based service that predicts the most probable postoperative weight-trajectory class for a new patient based on their baseline profile. The tool allows clinicians to explore different postoperative scenarios and serves as a proof of concept for integrating trajectory-based predictions into clinical decision support.

A manuscript describing this work is currently under review.