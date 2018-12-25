---
layout:         post
title:          Algorithm design
date:           2018-12-25 23:28:00 +1
image:          noun_algorithm_311718.png
image-alt:      algorithm by Sergey Novosyolov from the Noun Project
use_math:       true
tags:           [algorithm]
categories:     [notes]
---

Reading notes from "The Algorithm Design manual" book written by Steven S. Skiena.

<!-- more -->

1. TOC
{:toc}

## Definitions

Proper mathematical proof:
1. Clear & precise statement of what you are trying to prove
2. Set of assumptions which are taken to be true
3. Chain of reasonning takes you from the assumptions to the statement you are trying to prove
4. QED

Algorithmic notations: 
- English
- Pseudo code
- Real programming language

Heart of an algorithm is an idea. This idea must be clearly revealed when the algorithm is expressed.

Problem specification: 
- Set of allowed  input instances
- Required properties of the algorithm's output

Counter-examples to demonstrate incorrectness

Develop counter-examples hunting skill:
- Think small
- Think exhaustively
- Hunt for the weakness
- Go for a tie
- Seek extremes

Correctness: induction & recursion
- Induction: 
  + Prove a formula, for example $$\sum_{i=1}^n = \frac{ n(n+1) }{2}$$ work for basis cases (like 1 or 2)
  + Assume it was true up to $$n-1$$
  + Prove is was true to general $$n$$ using the assumption
- Recursion is induction
  + General & boundary conditions, with the general condition breaking the problem into smaller and smaller pieces

Have to be suspicious about induction.
- Boundary errors
- Wrong extension claims (for example, adding an item that completely changes the solution of a problem)

e.g. Prove that $$\sum_{i=1}^n i * i! = (n=1)!-1$$ by induction






