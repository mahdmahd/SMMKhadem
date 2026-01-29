+++
authors = ["Mehdi Khadem"]
title = "My Linear Model Thinks Getting Older Makes You Poorer (And Other Statistical Tragedies)"
date = "2025-10-26"
description = "About a Common pitfalls in the interpretation of coefficients of linear models"
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

So there I was, building a wage-prediction model like a responsible data scientist, when my Ridge regression dropped a truth bomb that shattered my worldview: **According to my coefficients, every birthday makes you $0.31 poorer per hour.**

I immediately canceled my upcoming birthday party and started reverse-aging exercises. Then I remembered: *I had fallen into the classic trap of misinterpreting linear model coefficients.* Again.

Let me save you from similar existential crises with a lighthearted tour of coefficient interpretation pitfalls—complete with the statistical equivalent of stepping on a Lego barefoot.

---

### 🧪 Pitfall #1: "But the Scatterplot LIED to Me!"

You plot wage vs. education and see a beautiful upward trend—more schooling, more cash! You high-five your screen. Then you fit a multivariate model and discover that *conditional on experience and age*, the education coefficient looks… suspiciously modest.

**What happened?** You just witnessed the difference between:
- **Marginal dependence** (the "party view"): *"People with more education tend to earn more"* (ignoring everything else)
- **Conditional dependence** (the "sober Monday view"): *"If we magically gave someone an extra year of education WHILE FREEZING THEIR AGE AND EXPERIENCE..."* (all else equal)

It's like noticing tall people earn more (marginal), then realizing it's actually because tall people tend to play basketball professionally—not because height itself prints money (conditional). Unless you're an NBA player. Then carry on.

> 💡 Why did the coefficient break up with the scatterplot?  
> *It said, "You only show me one side of the story—and you never control for my emotional baggage!"*

---

### ⚖️ Pitfall #2: The Great Coefficient Unit War

My model spat out these "insights":
- `UNION_member`: +$2.50/hour  
- `EDUCATION`: +$0.05/hour per year  
- `AGE`: -$0.03/hour per year  

*"Aha!"* I cried. *"Union membership matters 50x more than education!"* I drafted a memo urging everyone to join unions instead of college. My boss replied: *"Did you forget that AGE ranges over 40+ years while UNION is just 0 or 1?"*

**The horror**: Comparing raw coefficients across features with different scales is like comparing "apples per orchard" to "bananas per bunch" and declaring orchards irrelevant. Multiply coefficients by feature standard deviations (or just standardize features first), and suddenly `EDUCATION` and `EXPERIENCE` storm the importance charts while `UNION` quietly sips tea in the corner.

> 🤯 **Realization**: My model wasn't saying unions don't matter—it was saying *"being in a union has a bigger PER-UNIT impact than one extra year of school"*—which is actually… duh? One union membership vs. one year of school? Not exactly apples to apples.

---

### 👯 Pitfall #3: The Correlated Feature Tango of Doom

Then I noticed something spooky: `AGE` and `EXPERIENCE` were doing a statistical tango where:
- When `AGE` coefficient went **positive**, `EXPERIENCE` went **negative**
- When `EXPERIENCE` went **positive**, `AGE` went **negative**
- They never agreed. Ever.

Turns out they're ~90% correlated (shocking: older people tend to have more work experience). My model was having an identity crisis: *"Do I blame the gray hairs or the résumé length for this wage?"* It couldn't decide—so it flip-flopped wildly across cross-validation folds like a politician avoiding a tough question.

**Solution**: Drop one (sorry, `AGE`—you're redundant here) or use regularization to force them to "share the blame." Ridge regression made them hold hands and split the coefficient like civilized adults. Lasso just yeeted `AGE` out the window entirely. Brutal, but effective.

> 😂 Why did AGE and EXPERIENCE get kicked out of the model?  
> *They kept finishing each other's… coefficients. The multicollinearity was unbearable.*

---

### ⚡ Pitfall #4: Causality—The Siren Song That Sinks Ships

Here's where policymakers get dangerous ideas: *"Our model says +1 year of education → +$0.50/hour! Let's subsidize college for everyone!"*

But wait—what if "ability" (unobserved) causes BOTH more education AND higher wages? Your model's education coefficient isn't *just* the effect of schooling—it's schooling **plus** the hidden ability boost. You've measured correlation wearing a causation costume.

It's like noticing people who carry umbrellas get less wet—and concluding umbrellas *cause* dryness. (Spoiler: Rain is the confounder. Also, please don't run policy based on umbrella studies.)

> 🚨 **Critical reminder**: Machine learning measures *statistical association*. Causality requires experimental design, natural experiments, or accepting that you'll never truly know. As the stats gods whisper: *"Correlation doesn't imply causation… but it does waggle its eyebrows suggestively."*

---

### 🎭 The Grand Finale: My Model's Existential Crisis

After standardizing features, adding regularization, and surviving cross-validation, my final coefficients revealed:

✅ `EDUCATION`: Strong positive effect (phew)  
✅ `EXPERIENCE`: Strong positive effect (obviously)  
✅ `AGE`: Tiny effect (because we controlled for experience!)  
✅ `UNION`: Still meaningful—but no longer the "hero" it pretended to be  

And most importantly: **Getting older doesn't make you poorer**—it just *looks* that way when you forget that older people also have more experience (which *does* boost wages). My birthday party is back on. The cake will be regression-shaped.

---

### 📜 Lessons Learned (Without the Tears)

1. **Scale matters**: Always standardize before comparing coefficient magnitudes. Or prepare for interpretive chaos.
2. **Conditional ≠ marginal**: Your model describes "all else equal" worlds that may not exist in reality. Don't confuse statistical control with real-world feasibility.
3. **Correlation is a feature's clingy ex**: It makes coefficients unstable and dramatic. Regularization is the therapist they both need.
4. **Causality requires more than a p-value**: If you want to change the world, don't just fit a model—design an experiment. Or at least read a book by Judea Pearl while sobbing gently.
5. **Your model isn't truth—it's a mirror**: It reflects patterns in *your data*, not universal laws. Garbage in, gospel out is a dangerous religion.

So next time your coefficient suggests birthdays reduce wages, take a breath. Check for correlated features. Standardize something. And maybe—just maybe—celebrate that birthday anyway. Your model can't quantify cake.

*— Posted at 2 a.m. after debugging multicollinearity for the 7th time this week. Send coffee. And cake.* ☕🎂