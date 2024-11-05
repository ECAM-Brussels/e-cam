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

p = { 1: 1, 2: 5, 3: 8, 4: 9, 5: 10, 6: 17, 7: 17, 8: 20, 9: 24 }

@functools.cache
def cut_rod(n: max):
    if n == 0:
        return { "revenue": 0, "cuts": []}
    revenue, cuts = 0, []
    for i in range(1, n + 1):
        if revenue < p[i] + cut_rod(n - i)["revenue"]:
            revenue = p[i] + cut_rod(n - i)["revenue"]
            cuts = cut_rod(n - i)["cuts"] + [i]
    return { "revenue": revenue, "cuts": cuts }

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

A, B = "HYPERLINKING", "DOLPHINSPEAK"

@functools.cache
def C(i, j):
    if i == 0 or j == 0:
        return 0
    if A[i] == B[j]:
        return 1 + C(i - 1, j - 1)
    return max(C(i, j - 1), C(i - 1, j))

C(len(A) - 1, len(B) - 1)
~~~

# Longest common subsequence {.w-1--2}

~~~ python {.run}
import functools

A, B = "HYPERLINKING", "DOLPHINSPEAK"

@functools.cache
def C(i, j):
    if i == 0 or j == 0:
        return (0, '', 0, 0)
    if A[i] == B[j]:
        return (1 + C(i - 1, j - 1)[0], A[i], i - 1, j - 1)
    if C(i, j - 1)[0] > C(i - 1, j)[0]:
        return C(i, j - 1)
    else:
        return C(i - 1, j)

result, i, j = [], len(A) - 1, len(B) - 1
while i * j > 0:
    _, letter, i, j = C(i, j)
    result.append(letter)
''.join(reversed(result))
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

@functools.cache
def knapsack(i: int, capacity: int):
    if i == 0 or capacity == 0:
        return (0, [])
    if s[i] > capacity:
        return knapsack(i - 1, capacity)

    without_i = knapsack(i - 1, capacity)
    with_i = knapsack(i - 1, capacity - s[i])
    with_i = (with_i[0] + v[i], with_i[1] + [i])
    if with_i[0] > without_i[0]:
        return with_i
    else:
        return without_i

knapsack(3, 10)
~~~