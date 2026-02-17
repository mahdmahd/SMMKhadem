+++
authors = ["Mehdi Khadem"]
title = "TFCE (Threshold‑Free Cluster Enhancement) — Catching the Real Party in a Giant Hotel"
date = "2025-12-26"
description = "About TFCE"
math = true
tags = [
    "hugo",
    "site"
]
categories = [
    "instruction",
    "site"
]
series = ["Theme Demo"]
+++

{{< math.inline >}}
{{ if or .Page.Params.math .Site.Params.math }}
<!-- KaTeX -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" integrity="sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js" integrity="sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI" crossorigin="anonymous" onload="renderMathInElement(document.body);"></script>
{{ end }}
{{</ math.inline >}}

Imagine you live in a **huge multi‑story hotel**. Hundreds of rooms. Every room has people in it, and every room makes *some* noise: talking, TV, a door slam, someone laughing, someone dropping a suitcase.

Now here’s the problem: you step **outside the hotel** and you hear *party noise* leaking into the street. You want to answer one question:

**Which part of the hotel is actually hosting the real party?**

In neuroimaging/EEG terms, each “room” can be a **voxel**, an **electrode**, or a **time point**—and the “noise level” is your **test statistic** (often a *t‑value*). Your goal is to locate the true effect without getting fooled by random spikes.

---

## The naive plan: one threshold and a sound meter

You have a few options. The most obvious one is:

1) Take your **sound meter** into the hotel.  
2) Pick a cutoff, say **80 dB**.  
3) Go **floor by floor**, **room by room**, and mark anything louder than 80 dB as “party‑related.”

At first glance, that sounds clean: loud rooms = party rooms.

### The catch (and it’s a big one)

A hotel is noisy for many reasons that are *not* a party.

- You might find **a few “crazy loud” rooms** that are just noise: someone yelling on the phone, a baby screaming, a single person doing something dramatic for 2 seconds.
- Meanwhile, the **actual party** might be spread across a whole wing: many adjacent rooms with **steady music and chatter**—but each individual room might be **below 80 dB**.

So your “80 dB rule” can fail in both directions:
- If you set the threshold **high**, you miss a **broad, real party** that’s only moderately loud per room.
- If you set it **low**, you start labeling **random noise** as “the party.”

That’s the exact trap of **fixed-threshold cluster methods**: you’re forced to choose a cutoff that will inevitably be wrong for *some* true effects.

---

## A more concrete version: 200 rooms, one night guard, one mission

Now scale it up.

You’ve got **200 dorm rooms** (think: voxels / electrodes / time points). One night, the guard wants to figure out where the party really happened.

### The classic fixed-threshold cluster idea

The guard says:

> “Any room louder than **80 dB** is suspicious.”

Then the guard looks for **connected suspicious rooms** (rooms next to each other) and calls those “party clusters.”

Now watch what happens:

- **Room 31:** one person does a **2‑second explosive sneeze** → insanely loud → above 80 dB → flagged.  
  But it’s not a party. It’s a **sharp peak**: strong but tiny.

- **Rooms 50 to 60:** ten rooms in a row with **moderate but continuous music** → each room is *just under* 80 dB → not flagged.  
  But that area is clearly the party: **broad, consistent, real**.

So:
- Raise the threshold → you keep Room 31 (the sneeze) and lose Rooms 50–60 (the party).
- Lower the threshold → you catch the party but you also catch every random scream, slam, and weird noise.

This is why your “threshold + clustering” approach is fragile: the result depends heavily on an arbitrary cutoff.

---

## The better solution: TFCE

**TFCE = Threshold‑Free Cluster Enhancement.**

In hotel language, TFCE is the guard saying:

> “I’m not picking one magic noise cutoff.  
> I’ll try *many* cutoffs—quiet to very loud—and I’ll score each room based on two things:
> 1) how loud it is  
> 2) how much *support* it has from neighboring rooms.”

### TFCE rewards two ingredients

1) **Height (h)**  
   How loud is the room? (In stats: how large is the *t‑value* or evidence at that point?)

2) **Extent (e)**  
   How many neighboring rooms are involved at that noise level? (In stats: how big is the connected cluster at that threshold?)

So a room becomes “important” when it’s not only loud, but loud **as part of a connected social zone**.

### Why this beats the sneeze problem

- The sneeze room might be loud (high height), but it’s isolated (tiny extent). TFCE won’t overrate it.
- The real party wing might be only moderately loud (moderate height), but it stays connected across many thresholds (big extent repeatedly). TFCE boosts it.

That’s the intuition.

Now—after the story—let’s translate it into the math and the workflow.

---

# The math and the workflow (still using the hotel)

## The goal

Find where two conditions differ **across time (or space)** without running a separate independent test at every single sample.

Because if you do that, you get hammered by the **multiple comparison problem**.

### The multiple comparison problem (hotel version)

Suppose you have **10 floors × 10 rooms** = **100 rooms** and you test each room at α = 0.05, pretending they’re independent.

The probability of getting **at least one false alarm** is:

{{< math.inline >}}
P(\text{≥1 false positive} \mid H_0)=1-(1-\alpha)^{m}
{{</ math.inline >}}

With \( \alpha=0.05 \) and \( m=100 \):

$$
1-0.95^{100}\approx 0.994 \Rightarrow 99.4\%
$$
{{</ math.inline >}}

So even if there is **no real party**, your “suspicious room” list will almost surely contain something. That’s why we don’t trust uncorrected point‑by‑point testing.

But data points are not independent anyway: rooms next to each other tend to share sound (and time points tend to be correlated). Cluster methods exploit that structure.

---

## Step-by-step: Cluster permutation test (the classic guard strategy)

Think of a **time series** as a long hallway of rooms:
- Room \(t\) has neighbors \(t-1\) and \(t+1\).
- Nearby rooms tend to behave similarly (sound travels; signals are smooth).

### 1) Extract one “noise trace” over time (e.g., ICA component)

You start from EEG data (time × sensors), and project it through a mixing matrix to get a **single 1D activation trace over time**—like compressing many hallway microphones into one “party meter” for the hotel wing you care about.

### 2) Repeat over subjects and compute within-subject differences

For each subject, compute the difference between condition A and B at every time point:
- You now have one difference trace per subject (a “how much louder was this corridor in A vs B?” trace).

### 3) Convert differences into a test statistic: the t-value

Instead of using just the mean difference, you use the *t‑statistic* because it penalizes high variance across subjects.

For a one-sample test on differences:
{{< math.inline >}}
t = \dfrac{\bar{x}}{s/\sqrt{n}}
{{</ math.inline >}}

- \(\bar{x}\): mean difference across subjects  
- \(s\): standard deviation of differences  
- \(n\): number of subjects  

Big mean difference → bigger \(t\).  
More subjects → bigger \(t\) (if effect is consistent).  
Less variance → bigger \(t\).

Colloquially: a scale‑free measure of “how sure we are” the hallway is truly louder.

### 4) Form clusters using a fixed threshold

Pick an arbitrary threshold (often corresponding to p = 0.05), convert that to a t-cutoff, then mark all time points above it.

Now group adjacent above-threshold points into clusters.

Pick a cluster statistic:
- cluster size (extent),
- sum of t-values,
- or **cluster mass** (commonly: sum of t-values within the cluster).

### 5) Permute the data to build a null distribution

If there were no true difference between A and B, labels should not matter.

So you:
- shuffle labels (between-subject) **or**
- flip signs of each subject’s difference trace (within-subject)

Each permutation night:
- recompute clusters,
- compute cluster mass,
- keep the **largest** cluster mass (max statistic controls multiple comparisons).

This gives you an empirical \(H_0\) distribution.

### 6) Check the tail

If your observed cluster mass is larger than 95% of the null distribution, you call it significant (p < 0.05 corrected).

That’s the standard cluster-permutation logic.

---

# Why TFCE instead of fixed-threshold clusters?

Because that fixed threshold is the weak link.

A fixed threshold tends to:
- overvalue “sneeze peaks” (strong but tiny),
- undervalue broad moderate effects (the real party wing).

TFCE replaces “pick one cutoff” with “use **all** cutoffs.”

---

# TFCE mathematically

TFCE assigns a score to each room (sample/voxel/time point) by integrating over thresholds:

{{< math.inline >}}
TFCE(v) = \int e(h)^E \, h^H \, dh
{{</ math.inline >}}

- \(h\): threshold level (noise cutoff)
- \(e(h)\): extent (size of the cluster containing that point at threshold \(h\))
- \(E\): extent weight
- \(H\): height weight

Common defaults used in practice: **E = 0.5**, **H = 2**.

In real implementations the integral is approximated by a discrete sum over many thresholds.

### Important detail: TFCE outputs a value per sample

Unlike classic cluster tests where each cluster gets one p-value, TFCE produces a TFCE score **at every sample**, then you can get corrected p-values per sample using permutation with a max-statistic strategy.

---

# TFCE is not smoothing (hotel translation)

Smoothing would be like:
> “Let’s blur sound between rooms.”

That can move the apparent peak location, because you’re literally spreading values.

TFCE does *not* smear sound across rooms.
It keeps peaks where they are, but boosts rooms that have **cluster-like support** underneath them across thresholds.

---

# How TFCE becomes significant: permutation + max TFCE

Same trick as cluster permutation:

- permute labels / flip signs,
- compute TFCE map each time,
- take the **maximum TFCE score** over the whole hotel each time,
- compare your observed TFCE values to that max distribution.

That’s how you control family-wise error across the building.

---

# The interpretation warning (this is where many reports get weak)

If TFCE shows a significant point at **100 ms**, it does *not* mean:

> “The effect at exactly 100 ms is independently significant.”

It means something closer to:

> “At some threshold level, this point belongs to a significant cluster-like region.”

A sample can get pushed over the line because it sits next to a truly strong region. That’s why you should talk about the *most compatible extent* of the effect, not pretend you’ve nailed the precise onset/latency from a corrected map.

So don’t write:
- “Conditions differed significantly at 125 ms.”

Write:
- “We found a significant difference between conditions; this difference was most compatible with an effect spanning approximately X–Y ms.”

It’s less flashy, but it’s actually correct.

---

# References

Maris E, Oostenveld R. 2007. Nonparametric statistical testing of EEG- and MEG-data. *Journal of Neuroscience Methods* 164:177–190.

Sassenhagen J, Draschkow D. 2019. Cluster-based permutation tests of MEG/EEG data do not establish significance of effect latency or location. *Psychophysiology* 56:e13335.

Smith SM, Nichols TE. 2009. Threshold-free cluster enhancement: Addressing problems of smoothing, threshold dependence and localisation in cluster inference. *NeuroImage* 44:83–98.
