---
title: Google'sPageRank
slideshow: true
lang: en
---

# Assignment {.w-1--2}

![](/images/pagerank.png){.w-2--3 .m-auto}

::: exercise
You will implement a simplified version of Google's original PageRank algorithm
on a [Wikipedia snapshot](https://urbain.vaes.uk/static/wikidata.tar).
Your aim is to rank all the pages by order of importance
and implement a basic search function.
:::

# Random browsing {.w-1--2}

![](/images/random_browsing.webp){.w-2--3 .m-auto}

We shall make the following assumptions.

- Each page has the same probability of being the start page

- There is **at most** one link from one page to another

- On each page, each link has the same probability of being clicked.

- If there are no links,
  the next page can be any page with equal probability.

# Main ideas {.w-1--2}

The main idea is to **rank pages** by the *probability* of landing on them.

What does this mean?
Imagine you're browsing the web
and click on a random link to go from one page to the next.

Denote by $X^{(k)}$ be our position after $k$ clicks.

$$
\substack{{\displaystyle X^{(0)}} \\ \text{initial page}}
\xrightarrow[\text{random link}]{\text{click}}
X^{(1)}
\xrightarrow[\text{random link}]{\text{click}}
X^{(2)}
\xrightarrow[\text{random link}]{\text{click}}
\dots
$$

### Observations

- For small $k$,
  the position will heavily depend on the initial page $X^{(0)}$.

- The effect will subside as $k$ grows larger.

- The **page rank** of a page will thus be defined via

$$
\text{PageRank}(\text{page})
= \lim_{k \to +\infty} \mathbb P(X_k = \text{page})
$$

# Probability vector {.w-1--2}

$$
X^{(k)} = \text{position after } k \text{ clicks}
$$

::: definition
$$
\vec p^{(k)} = \begin{pmatrix}
  P(X^{(k)} = 1)\\
  P(X^{(k)} = 2)\\
  \vdots\\
  P(X^{(k)} = n)\\
\end{pmatrix}
$$
:::

::: {.definition title="PageRank vector"}
$$
\vec p^{(\infty)} = \lim_{k \to +\infty} \vec p^{(k)}
$$
:::

# Stochastic matrix {.w-1--2}

::: {.definition title="Probability transition matrix"}
$$
\begin{align*}
T_{ij} 
&= \text{probability of going to}\ i\ \text{from}\ j\\
&= P(X^{(k + 1)} = i \,|\, X^{(k)} = j)
\end{align*}
$$
:::

::: proposition
$$
\vec p^{(k + 1)}
=
T
\vec p^{(k)}
$$
:::

$$
\begin{align*}
(T \vec p^k)_i
&= \sum_{j = 1}^n
\underbrace{P(X^{(k + 1)} = i \, | \, X^{(k)} = j)}_{T_{ij}}
\underbrace{P(X^{(k)} = j)}_{\vec p^{(k)}_j}\\
&= P(X^{(k + 1)} = i)\\
&= \vec p^{(k + 1)}_i
\end{align*}
$$

# Stopping criterion {.w-1--2}

Our aim is to calculate $\displaystyle \vec p^{(\infty)} = \lim_{k \to +\infty} \vec p^{(k)}$
via the iteration

$$
\vec p^{(k + 1)}
=
T
\vec p^{(k)}
$$

In other words, we'll approximate $\vec p^{(\infty)} \approx \vec p^{(k)}$ for some large $k$.

::: question
How do we choose $k$?
:::

Note that taking the limit on both sides, we get
$$
\vec p^{(\infty)}
=
T
\vec p^{(\infty)}
\quad \Longleftrightarrow \quad
T
\vec p^{(\infty)} - \vec p^{(\infty)} = 0.
$$

A good stopping criterion is thus
$$
\frac {\|T \vec p^{(k)} - \vec p^{(k)}\|_1} {\|\vec p^{(k)}\|_1}
\leq \epsilon
$$
where $\displaystyle \|v\|_1 = \sum_{i = 1}^n |v_i|$.

# PageRank: summary {.w-1--2}

#. Read the graph from the CSV files

#. Construct the transition matrix $T$.
   The dataset is huge, have a look at *sparse* matrices.

#. Calculate $\vec p^{(k)}$ for $k$ sufficiently large via the iteration
   $$\vec p^{(k + 1)} = T p^{(k)}$$

#. Deduce an approximation of the PageRank vector
   $$\vec p^{(\infty)} \approx \vec p^{(k)}$$
   for $k$ sufficiently large.
