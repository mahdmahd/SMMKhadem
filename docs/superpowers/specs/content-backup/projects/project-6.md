---
title: "PERSiMED: PERSian Intelligent MEDical Document Reader :A Smart NLP-based Framework for Persian Medical Documents"
date: 2025-10-12
year: 2025
summary: "A deep learning–based framework for intelligent extraction, semantic understanding, and structured digitization of Persian medical documents, designed to automate health insurance workflows and fraud detection."
image: "images/projects/persimed_flowchart_Page2.png"
draft : false
technologies: "Python, Deep Learning (CNNs),Vision-Language Models,Computer Vision,Natural Language Processing (NLP),HTML Parsing (BeautifulSoup),Structured Data Pipelines,Privacy-Preserving Data Architecture"
code_url: "https://github.com/mahdmahd/PERSiMED"
paper_url: "https://en.civilica.com/doc/2472372/"
---
<!--more-->
## Overview
A deep learning–based framework for intelligent extraction, semantic understanding, and structured digitization of Persian medical documents, designed to automate health insurance workflows and fraud detection.



## Project Details
Let’s be direct: manual processing of medical documents in Persian-speaking healthcare systems is slow, expensive, and error-prone. Mixed Persian–English scripts, right-to-left layouts, handwritten annotations, and non-standard formatting make traditional OCR pipelines unreliable. PERSiMED was built to deal with that reality, not an idealized dataset.

PERSiMED (PERSian Intelligent MEDical document reader) is an end-to-end AI framework that automates the entire medical document processing pipeline—from raw scanned images to structured, searchable, and privacy-preserving outputs. The system combines modern computer vision, deep learning–based segmentation, and Vision-Language (VL) models to move beyond simple character recognition toward real semantic understanding of medical content.

The core idea is straightforward but powerful: instead of treating OCR and NLP as separate, brittle steps, PERSiMED integrates document preprocessing, layout correction, multilingual text understanding, and semantic annotation into a unified pipeline. CNN-based segmentation models handle document boundary detection, orientation correction, and geometric rectification, while Vision-Language models perform simultaneous text recognition and contextual interpretation of Persian and English medical terminology.

The framework produces three synchronized outputs for every document: annotated images for visual validation, clean HTML that preserves logical and spatial layout, and structured JSON objects suitable for database ingestion and downstream analytics. This design makes PERSiMED practical for real insurance operations, not just academic benchmarks.

From an application standpoint, PERSiMED directly targets high-impact insurance use cases: claims processing automation, fraud detection (duplicate claims, upcoding, temporal anomalies), and longitudinal patient record construction. In evaluation on 2,000 real insurance documents, the system achieved over 96% successful end-to-end processing, with failures largely attributable to severely degraded input quality rather than model limitations.

Ultimately, PERSiMED is about replacing slow human bottlenecks with scalable, auditable AI—while respecting privacy constraints and the linguistic realities of Persian medical documentation.

