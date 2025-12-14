---
title: "Predicting Hypoalbuminemia Risk After Gastric Bypass Surgery"
date: 2
summary: "A machine learning model and clinical scoring system that predicts which patients are at high risk of developing dangerously low albumin levels after One Anastomosis Gastric Bypass surgery."
---

A machine learning model and clinical scoring system that predicts which patients are at high risk of developing dangerously low albumin levels after One Anastomosis Gastric Bypass surgery.

<!--more-->

## Overview

A machine learning model and clinical scoring system that predicts which patients are at high risk of developing dangerously low albumin levels after One Anastomosis Gastric Bypass surgery.

## Project Details

One Anastomosis Gastric Bypass (OAGB) is an effective weight-loss surgery, but like any major procedure, it comes with risks. One complication that can sneak up on patients is hypoalbuminemia – when your blood albumin levels drop too low, leading to problems like fluid retention, poor wound healing, and weakened immunity. The tricky part? It often develops after surgery, and by then you're playing catch-up. What if we could predict who's at risk before they even go into the operating room?
That's exactly what I set out to build! I developed a machine learning model to predict hypoalbuminemia risk using data that's available before surgery – clinical information, demographics, and blood test results. I worked with a substantial cohort of roughly 3,000 OAGB patients who had postoperative follow-up data, giving the model plenty to learn from.
I led the entire pipeline: data preprocessing (cleaning up messy clinical data, handling missing values), feature selection (figuring out which variables actually matter), model training, and rigorous evaluation. I implemented and compared several approaches – random forest, logistic regression, and XGBoost – using L1/L2 regularization and systematic hyperparameter tuning to squeeze out the best performance. To make sure the model wasn't just a black box, I applied SHAP values to understand which features were driving predictions and why.
The final model achieved an AUROC of approximately 0.84, which is solid performance for this kind of clinical prediction task! But here's where it gets really practical: I used the AutoScore framework to convert the machine learning model into a simple, interpretable clinical scoring system. Think of it like an Apgar score but for hypoalbuminemia risk – something doctors can actually use at the bedside without needing a computer.
The goal is to improve postoperative monitoring and nutritional management by identifying high-risk patients upfront and tailoring their follow-up accordingly. Catch the problem before it happens, essentially! This work has been accepted for publication in Obesity Surgery (Springer Nature), so it'll soon be out there helping clinicians make better decisions.



## Technologies
Python, scikit-learn, matplotlib, SHAP, NumPy, pandas.

## Links
- Paper: ...
- Code: ...
