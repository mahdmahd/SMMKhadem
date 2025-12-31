---
title: "SnapExplain"
date: 2025-10-12
year: 2025
summary: "SnapExplain is an Android utility that brings large language model (LLM) explanations directly into your reading workflow.It integrates with Android’s native text-selection menu, allowing users to highlight any sentence in a PDF, ebook, or article and receive an instant, contextual explanation — without leaving the app they’re reading in."
image: "images/projects/Screenshot2.jpg"
draft : false
technologies: "Kotlin, Android SDK, HTTP/REST APIs (OpenAI-compatible), Large Language Models (LLMs), Android Text Selection API, Gradle"
demo_url: "https://github.com/mahdmahd/SnapExplain/releases/tag/V0.1"
code_url: "https://github.com/mahdmahd/SnapExplain"

---
<!--more-->
## Overview
SnapExplain is an Android utility that brings large language model (LLM) explanations directly into your reading workflow.
It integrates with Android’s native text-selection menu, allowing users to highlight any sentence in a PDF, ebook, or article and receive an instant, contextual explanation — without leaving the app they’re reading in.
No app switching. No prompt rewriting. No broken focus.



## Project Details
reading dense academic or technical text on mobile is inefficient.
You hit a sentence that needs interpretation, nuance, or translation — and the workflow collapses:

Copy.
Switch apps.
Paste.
Re-explain context.
Read.
Switch back.

That friction kills comprehension and momentum.

I built SnapExplain to remove that friction entirely.

SnapExplain hooks into Android’s text-selection action menu. When you highlight text, an Explain action appears. One tap sends the highlighted text — along with your own predefined system prompt — to an LLM of your choice. The response appears instantly in a lightweight popup, letting you continue reading without disruption.

You stay inside your book.
The explanation comes to you.

The system is intentionally model-agnostic. You can use OpenAI-compatible APIs, AvalAI, self-hosted endpoints, or local servers. You control the prompt, model, temperature, and output limits — not the app.

A core design principle of SnapExplain is minimizing cognitive and interface overhead. The popup interface is deliberately constrained, with an optional word limit to keep explanations readable and non-intrusive. The user’s custom prompt defines the explanation style (e.g., simplified language, comparative analysis, translation with nuance), eliminating the need to restate instructions repeatedly.

SnapExplain works with most Android reader applications, including Moon+ Reader and Librera, and requires no special integration from those apps beyond standard text selection. API keys are stored locally on the device, and highlighted text is transmitted only to the endpoint explicitly configured by the user. The application performs no data collection, logging, or analytics.

The project is aimed at readers of academic, technical, or linguistically complex material who need rapid, contextual understanding without interrupting their reading flow. The long-term roadmap focuses on features that further reduce friction—such as offline LLM support, explanation history, and prompt presets—while avoiding unnecessary complexity.
