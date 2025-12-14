---
title: "ApoE4 and Alzheimer's Disease Mechanisms Project"
date: 2
summary: "A computational neuroimaging study investigating how Alzheimer's risk gene variants (ApoE genotypes) affect hippocampal shape and structure in healthy individuals, using advanced 3D mesh analysis techniques."
---

A computational neuroimaging study investigating how Alzheimer's risk gene variants (ApoE genotypes) affect hippocampal shape and structure in healthy individuals, using advanced 3D mesh analysis techniques.

<!--more-->

## Overview

A computational neuroimaging study investigating how Alzheimer's risk gene variants (ApoE genotypes) affect hippocampal shape and structure in healthy individuals, using advanced 3D mesh analysis techniques.

## Project Details

ApoE4 is the biggest genetic risk factor for Alzheimer's disease – having one copy increases your risk, and having two copies cranks it up even more. But here's the fascinating question: even before any symptoms appear, are there already subtle differences in brain structure between people with different ApoE variants? Specifically, does the hippocampus (the brain's memory center, and one of the first regions hit by Alzheimer's) look different depending on your genetic makeup?
That's what I set out to explore in this project. My hypothesis was straightforward: hippocampal shape and subfield structure should differ among healthy individuals with different ApoE genotypes (ε4/ε4, ε3/ε4, ε3/ε3). If we could detect these differences, it might help us understand how ApoE4 primes the brain for eventual disease.
I worked with high-resolution hippocampal MRIs from the ADNI (Alzheimer's Disease Neuroimaging Initiative) dataset – beautiful, research-quality data that's perfect for this kind of detailed analysis. First, I used FreeSurfer to perform hippocampal subfield segmentation, carefully parceling out the different subregions of the hippocampus. Then came the really cool part: I applied the HIPSTA framework, which uses tetrahedral meshes and computational geometry to analyze hippocampal thickness and shape in 3D. This isn't just measuring volume – it's looking at the actual morphology and local thickness patterns across the entire hippocampal surface.
I compared these detailed shape metrics across the different genotype groups, looking for subtle patterns that might distinguish ε4 carriers from non-carriers. The analysis pipeline required careful quality control and statistical modeling to account for confounding factors, but the approach allows for much more sensitive detection of structural differences than traditional volumetric methods.
This project is in its final stages now and nearly ready for submission – just putting the finishing touches on the manuscript and making sure all the analyses are airtight. It's been a deep dive into the intersection of genetics, neuroimaging, and computational anatomy, and I'm excited to see how it contributes to our understanding of pre-symptomatic Alzheimer's mechanisms!

## Technologies


## Links
- Paper: ...
- Code: ...
