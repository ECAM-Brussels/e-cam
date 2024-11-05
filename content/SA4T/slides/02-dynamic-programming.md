---
title: Dynamic Programming
slideshow: true
lang: en
---

# Dynamic programming

# Example: Fibonacci {.w-1--2}

~~~ python {.run}
def fibonacci(n: int) -> int:
    if n <= 2:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

[fibonacci(n) for n in range(1, 30)]
~~~

Try to change `30` to `40` in the above.

::: question
What is the time complexity of the algorithm above?
:::

# Fibonacci: caching {.w-1--2}

~~~ python {.run}
cache = { 1: 1, 2: 1 }
def fibonacci(n: int) -> int:
    if n not in cache:
        cache[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return cache[n]

[fibonacci(n) for n in range(1, 40)]
~~~

# Fibonacci: decorator {.w-1--2}

Or just use `functools.cache`

~~~ python {.run}
import functools
@functools.cache
def fibonacci(n: int) -> int:
    if n <= 2:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

[fibonacci(n) for n in range(1, 30)]
~~~

# Rod cutting {.w-1--2}

::: exercise

You have a piece of rod, and you would like to cut in to sell the pieces.
What is the maximum revenue you can get?

| Length (m) |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |
| ---------: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
|      Price |  1  |  5  |  8  |  9  | 10  | 17  | 17  | 20  | 24  |

:::

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Rod cutting: implementation {.w-1--2}

~~~ python {.run}
import functools

p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24 ]

@functools.cache
def cut_rod(n: max):
    if n == 0:
        return 0
    revenue = 0
    for i in range(1, n + 1):
        if revenue < p[i] + cut_rod(n - i):
            revenue = p[i] + cut_rod(n - i)
    return revenue

cut_rod(5)
~~~

# Rod cutting: parent pointers {.w-1--2}

~~~ python {.run}
import functools

p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24]
value = lambda cuts: sum([p[c] for c in cuts])

@functools.cache
def cut_rod(n: int):
    if n == 0:
        return []
    cuts = []
    for i in range(1, n + 1):
        if value(cuts) < p[i] + value(cut_rod(n - i)):
            cuts = cut_rod(n - i) + [i]
    return cuts

cut_rod(5)
~~~

# Longest common subsequence {.w-1--2}

::: exercise
Given two strings,
find the length of the longest common substring.
:::

E.g. HYPERLINKING, DOLPHINSPEAK: PINK

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Longest common subsequence {.w-1--2}

~~~ python {.run}
import functools

@functools.cache
def LCS(A, B):
    if len(A) == 0 or len(B) == 0:
        return 0
    if A[-1] == B[-1]:
        return 1 + LCS(A[:-1], B[:-1])
    return max(LCS(A, B[:-1]), LCS(A[:-1], B))

LCS("HYPERLINKING", "DOLPHINSPEAK")
~~~

# Longest common subsequence {.w-1--2}

~~~ python {.run}
import functools

@functools.cache
def LCS(A, B):
    if len(A) == 0 or len(B) == 0:
        return ""
    if A[-1] == B[-1]:
        return LCS(A[:-1], B[:-1]) + A[-1]
    guesses = [LCS(A, B[:-1]), LCS(A[:-1], B)]
    return max(guesses, key=lambda s: len(s))

LCS("HYPERLINKING", "DOLPHINSPEAK")
~~~

# Knapsack {.w-1--2}

::: exercise
In a knapsack,
we'd like to place a subset of the following items:

| item  |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| value | 10  | 40  | 30  | 50  |
| size  |  5  |  4  |  6  |  3  |

How do we maximize the total value with the constraint that the sum of the sizes cannot exceed $10$ ?
:::

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Knapsack: implementation {.w-1--2}

~~~ python {.run}
import functools

v = [10, 40, 30, 50]
s = [5, 4, 6, 3]

@functools.cache
def knapsack(i: int, capacity: int):
    if i == 0 or capacity == 0:
        return 0
    if s[i] > capacity:
        return knapsack(i - 1, capacity)
    return max(
        knapsack(i - 1, capacity),
        knapsack(i - 1, capacity - s[i]) + v[i]
    )

knapsack(3, 10)
~~~

# Knapsack: finding items {.w-1--2}

~~~ python {.run}
import functools

v = [10, 40, 30, 50]
s = [5, 4, 6, 3]

value = lambda items: sum([v[i] for i in items])

@functools.cache
def knapsack(i: int, capacity: int):
    if i == 0 or capacity == 0:
        return []
    if s[i] > capacity:
        return knapsack(i - 1, capacity)

    guesses = [
        knapsack(i - 1, capacity),
        knapsack(i - 1, capacity - s[i]) + [i]
    ]
    return max(guesses, key=lambda g: value(g))

knapsack(3, 10)
~~~