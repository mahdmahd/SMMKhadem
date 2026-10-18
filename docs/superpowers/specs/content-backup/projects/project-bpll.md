---
title: "Computer Vision–Based Intraoperative Measurement of Biliopancreatic Limb Length"
date: 2025-10-12
year: 2025
summary: "A pilot study evaluating whether computer vision can replace subjective visual estimation of biliopancreatic limb (BPL) length during gastric bypass surgery with objective, calibrated intraoperative measurements."
image: "images/projects/frame_001159.jpg"
draft : false
technologies: "YOLOv11 (Pose Estimation) , Computer Vision , Roboflow , PyTorch , Statistical Agreement Analysis"
---
<!--more-->
## Overview
A data-driven project that models long-term postoperative weight trajectories after bariatric surgery and translates these patterns into clinically interpretable, patient-level predictions.



## Project Details
In gastric bypass surgery, biliopancreatic limb length is a key technical variable that influences metabolic outcomes and nutrition-related complications. Despite this, limb length is commonly estimated visually, a subjective practice that varies widely between surgeons. This project addressed whether a measurement-oriented computer vision system could provide accurate and reproducible intraoperative length estimates.

I developed and evaluated a YOLOv11-based pose estimation pipeline that detects laparoscopic instruments, estimates their spatial pose, and computes calibrated inter-instrument distances using an in-scene reference segment on the grasper tip. The system converts pixel distances into real-world centimeters without requiring external tracking hardware.

Two model variants (YOLOv11M and YOLOv11L) were trained and benchmarked on annotated laparoscopic video frames adapted from a public dataset. Performance was assessed using COCO detection and pose metrics, with additional agreement analyses comparing computer vision–derived measurements to surgeon estimates and to ruler-based ground truth.

The results showed strong detection and pose performance, with YOLOv11M achieving higher precision and fewer false positives, making it more suitable for safety-critical intraoperative workflows. Surgeon visual estimates demonstrated a consistent bias and wide limits of agreement relative to the computer vision measurements, highlighting the limitations of fixed visual estimation. External validation using a sterile ruler confirmed that the system could recover real-world distances with minimal error.

This study demonstrates the feasibility of objective, calibrated intraoperative limb-length measurement using computer vision and outlines the technical requirements for real-time deployment in bariatric surgery. A manuscript describing this work is currently under review.

A manuscript describing this work is currently under review.