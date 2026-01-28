---
title: "Retrieval-Augmented Clinical Question Answering for Bariatric Surgery"
date: 2025-10-12
year: 2025
summary: "A retrieval-augmented generation (RAG) system that uses the ASMBS bariatric surgery textbook as a knowledge base to answer medical questions with higher accuracy and fewer hallucinations than general-purpose AI models."
draft : false
technologies: "retrieval-augmented generation (RAG) , LangChain , ChromaDB  "
---

A retrieval-augmented generation (RAG) system that uses the ASMBS bariatric surgery textbook as a knowledge base to answer medical questions with higher accuracy and fewer hallucinations than general-purpose AI models.

<!--more-->

## Overview

A retrieval-augmented generation (RAG) system that uses the ASMBS bariatric surgery textbook as a knowledge base to answer medical questions with higher accuracy and fewer hallucinations than general-purpose AI models.

## Project Details

Large language models like ChatGPT are impressive, but they have a glaring problem when it comes to specialized medical knowledge: they hallucinate. They'll confidently make up answers that sound plausible but are actually wrong – not exactly what you want when studying for board exams or making clinical decisions! We came across a study showing that ChatGPT correctly answered about 82% of ASMBS (American Society for Metabolic and Bariatric Surgery) end-chapter questions. That's decent, but our key question was: could we push that accuracy higher while cutting down on the made-up nonsense?
Turns out, we could! I designed a retrieval-augmented generation (RAG) system that grounds the AI's answers in a specific, authoritative source: the ASMBS bariatric surgery textbook. Instead of letting the model rely solely on whatever it memorized during training (and risk hallucinating), the system actually looks up relevant information from the textbook before answering.
Here's how it works: when you ask a question, the system first rewrites and expands your query to capture different phrasings and related concepts. Then it searches through a vector database (built using ChromaDB) containing the entire ASMBS textbook, finding semantically similar and relevant passages. These passages get filtered for quality and relevance, and only then are they fed to the LLM (along with your original question) so it can generate an answer that's actually grounded in the textbook content.
We tested this rigorously, evaluating accuracy with and without RAG across different models – GPT-4, GPT-4o-mini, and some newer models. The results were pretty awesome! We achieved about 94% accuracy on those end-chapter questions (up from 82%), and the hallucinations dropped dramatically. When the model doesn't know something, it's much more likely to say so rather than making stuff up, because it's constrained by what's actually in the textbook.
I built a restricted-access demo that's available at medrag.liararun.ir (credentials provided on request – we have to keep it locked down due to textbook copyright constraints). It's a functional web service where you can ask bariatric surgery questions and get textbook-grounded answers in real-time.
This project shows how RAG can make AI genuinely useful for medical education and clinical decision support by keeping it honest and accurate. A manuscript describing this work is currently under review, so hopefully we'll be able to share the full details soon!
Software used: Python, LangChain, ChromaDB, OpenAI API, Flask (for the web-service demo).


## Technologies
Python, scikit-learn, matplotlib, SHAP, NumPy, pandas.

## Links
- Paper: ...
- Code: ...
