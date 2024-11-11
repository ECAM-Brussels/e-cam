---
title: Dynamic Programming
slideshow: true
lang: en
---

# Example: Fibonacci {.w-1--2}

::: {.definition title="Fibonacci sequence"}

$$
1 \quad 1 \quad 2 \quad 3 \quad 5 \quad 8 \quad \dots
\qquad
u_n =
\begin{cases}
u_{n - 1} + u_{n - 2} & \text{if} \ n > 2\\
1 & \text{if} \ n \in \{1, 2\}
\end{cases}
$$

:::

```python {.run}
def fibonacci(n: int) -> int:
    return n

[fibonacci(n) for n in range(1, 30)]
# --- fragment
def fibonacci(n: int) -> int:
    if n <= 2:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

[fibonacci(n) for n in range(1, 30)]
```

Try to change `30` to `40` in the above.

::: question
What is the time complexity of the algorithm above?
:::

# Fibonacci: caching {.w-1--2}

::: question
How could we speed up the function?
:::

```python {.run}
def fibonacci(n: int) -> int:
    return n
# --- fragment
cache = { 1: 1, 2: 1 }
def fibonacci(n: int) -> int:
    if n not in cache:
        cache[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return cache[n]

[fibonacci(n) for n in range(1, 40)]
```

::: question
What is the time complexity of the algorithm above?
:::

$$
T(n) = O(\# \text{subproblems}) \times O(\text{time per subproblem})
$$

# Fibonacci: decorator {.w-1--2}

In Python, memoization can be done via `functools.cache`.

```python {.run}
import functools

@functools.cache
def fibonacci(n: int) -> int:
    if n <= 2:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

[fibonacci(n) for n in range(1, 50)]
```

# Fibonacci: bottom-up {.w-1--2}

Instead of using a recursion (top-down),
we can solve the problems from easiest to hardest (bottom-up).

```python {.run}
def fibonacci(n: int) -> int:
    fib = []
    for i in range(n):
        fib.append(fib[i - 1] + fib[i - 2] if i > 1 else 1)
    return fib[-1]

[fibonacci(n) for n in range(1, 50)]
```

# Dynamic programming {.w-1--2}

- Break down into **smaller overlapping subproblems**

- **Memoisation** to avoid recalculating the solution to the smaller problems.

- Two ways of solving: top-down (recursion, geneally easier) vs bottom-up

- **Complexity**: $O(\# \text{subproblems}) \times O(\text{time per subproblem})$

- Helpful questions when solving DP problems:

  - What are the **subproblems**?
  - What are the **base cases**?
  - What are we **guessing**?
  - What is the **recurrence relation**?

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

```python {.run}
p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24 ]

def cut_rod(n: int):
    pass
# --- fragment
import functools

p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24 ]

@functools.cache
def cut_rod(n: int):
    if n == 0:
        return 0
    return max([
        p[i] + cut_rod(n - i)
        for i in range(1, n + 1)
    ])

cut_rod(5)
```

# Rod cutting: bottom-up {.w-1--2}

::: exercise
Write the algorithm in a bottom-up way.
:::

```python {.run}
p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24 ]

def cut_rod(n: int):
    pass
# --- fragment
def cut_rod(n: int):
    cache = {0: 0}
    for l in range(1, n + 1):
        cache[l] = max([
            p[i] + cache[l - i]
            for i in range(1, l + 1)
        ])
    return cache[l]

cut_rod(5)
```

# Rod cutting: parent pointers {.w-1--2}

::: exercise
Adapt your code to know how to cut the rod to maximize revenue.
:::

```python {.run}
p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24]

def cut_rod(n: int):
    pass
# --- fragment
import functools

p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24]
value = lambda cuts: sum([p[c] for c in cuts])

@functools.cache
def cut_rod(n: int):
    if n == 0:
        return []
    return max(
        [cut_rod(n - i) + [i] for i in range(1, n + 1)],
        key=value
    )

cut_rod(5)
```

# Longest common subsequence {.w-1--2}

::: exercise
Given two strings,
find the length of the longest common substring.
What is the complexity of your algorithm?
:::

::: remark
Algorithm used for `diffing` (e.g. in version control).
:::

E.g. HYPERLINKING, DOLPHINSPEAK: PINK, 4

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Longest common subsequence {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
def LCS(A: str, B: str):
    """
    Returns the length of the longest common subsequence of A and B.
    """
    return 0

LCS("HYPERLINKING", "DOLPHINSPEAK")
# --- fragment
import functools

@functools.cache
def LCS(A, B):
    if len(A) == 0 or len(B) == 0:
        return 0
    if A[-1] == B[-1]:
        return 1 + LCS(A[:-1], B[:-1])
    return max(LCS(A, B[:-1]), LCS(A[:-1], B))

LCS("HYPERLINKING", "DOLPHINSPEAK")
```

# Longest common subsequence {.w-1--2}

::: exercise
Adapt your code to find the subsequence itself.
:::

```python {.run hideUntil="2024-11-12 12:00"}
def LCS(A: str, B: str) -> str:
    return ""

LCS("HYPERLINKING", "DOLPHINSPEAK")
# --- fragment
import functools

@functools.cache
def LCS(A, B):
    if len(A) == 0 or len(B) == 0:
        return ""
    if A[-1] == B[-1]:
        return LCS(A[:-1], B[:-1]) + A[-1]
    guesses = [LCS(A, B[:-1]), LCS(A[:-1], B)]
    return max(guesses, key=len)

LCS("HYPERLINKING", "DOLPHINSPEAK")
```

# Knapsack {.w-1--2}

::: exercise
In a knapsack,
we'd like to place a subset of the following items:

| item  |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| value | 10  | 40  | 30  | 50  |
| size  |  5  |  4  |  6  |  3  |

How do we maximize the total value with the constraint that the sum of the sizes cannot exceed $10$ ?
What is the complexity of your algorithm?
:::

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Knapsack: implementation {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
v = [10, 40, 30, 50]
s = [5, 4, 6, 3]

def KS(i: int, C: int):
    """
    Returns the total value that is possible
    for a knapsack of capacity C
    and only by using items 1, 2, ..., i
    """
    pass
# --- fragment
import functools

v = [10, 40, 30, 50]
s = [5, 4, 6, 3]

@functools.cache
def KS(i: int, C: int):
    if i == 0 or C == 0:
        return 0
    if s[i] > C:
        return KS(i - 1, C)
    return max(KS(i - 1, C), KS(i - 1, C - s[i]) + v[i])

KS(3, 10)
```

# Knapsack: finding items {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
v = [10, 40, 30, 50]
s = [5, 4, 6, 3]

def KS(i: int, C: int):
    pass
# --- fragment
import functools

v = [10, 40, 30, 50]
s = [5, 4, 6, 3]
val = lambda items: sum([v[i] for i in items])

@functools.cache
def KS(i: int, C: int):
    if i == 0 or C == 0:
        return []
    if s[i] > C:
        return KS(i - 1, C)
    guesses = [KS(i - 1, C), KS(i - 1, C - s[i]) + [i]]
    return max(guesses, key=val)

KS(3, 10)
```

# Coin problem {.w-1--2}

::: exercise
Given a list of coin values and a target value `sum`,
find the minimum of coins needed to reach the target value.

What is the complexity?
You may assume a solution always exists.
:::

::: remark
The **greedy** algorithm doesn't necessarily work.
For example, if `coins = [1, 3, 4, 5, 10, 25]`,
then `7` can be achieved with two coins,
but you cannot pick `5`.
:::

- Subproblems:

- Base cases:

- Guess:

- Recurrence:

# Coin problem: implementation {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
coins = [1, 3, 4, 5, 10, 25]
def min_coins(value: int):
    pass

min_coins(65)
# --- fragment
import functools

coins = [1, 3, 4, 5, 10, 25]

@functools.cache
def min_coins(value: int):
    if value == 0:
        return 0
    return min([
        1 + min_coins(value - c)
        for c in coins if c <= value
    ])

min_coins(65)
```

# Coin problem: parent pointers {.w-1--2}

::: question
What if we want to find the coins themselves?
:::

```python {.run hideUntil="2024-11-12 12:00"}
coins = [1, 3, 4, 5, 10, 25]
def min_coins(value: int):
    pass

min_coins(65)
# --- fragment
import functools

coins = [1, 3, 4, 5, 10, 25]

@functools.cache
def min_coins(value: int) -> list[int]:
    if value == 0:
        return []
    return min([
        min_coins(value - c) + [c]
        for c in coins
        if c <= value
    ], key=len)

min_coins(65)
```

# Minimum jumps {.w-1--2}

::: exercise
Given an array where each elements represents the max number of steps forward,
find the quickest way to jump to the end of the array starting at index $0$.
What is the complexity?
:::

- Input: `[1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]`
- Output: 3 jumps, `1 -> 3 -> 9 -> 9` or `[1, 3, 10]`

# Minimum jumps {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
allowed = [1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]

def jumps(start: int, dest: int):
    pass

jumps(0, len(allowed) - 1)
# --- fragment
import functools

allowed = [1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]

@functools.cache
def jumps(start: int, dest: int):
    if dest == start:
        return []
    return min([
       [i] + jumps(i, dest)
       for i in range(start + 1, min(start + allowed[start], dest) + 1)
    ], key=len)

jumps(0, len(allowed) - 1)
```

# Edit distance {.w-1--2}

::: exercise
The _Edit Distance_ measures the similarity between two strings by calculating the minimum number of operations required to transform one series into another. The allowed operations are:

::::: text-sm
Insertion
: Add a character to the string.

Deletion
: Remove a character from the line.

Substitution
: Replace one character with another
:::::
:::

::: example
For example, to transform the word "kitten" into "sitting," we need 3 operations.
:::

::: remark
Algorithm used for spellchecking.
:::

# Edit distance {.w-1--2}

```python {.run hideUntil="2024-11-12 12:00"}
def dist(A: str, B: str) -> int:
    return 0

dist("kitten", "sitting")
# --- fragment
import functools

@functools.cache
def dist(A: str, B: str) -> int:
    if not A or not B:
        return len(A) + len(B)
    if A[-1] == B[-1]:
        return dist(A[:-1], B[:-1])
    return 1 + min(dist(A[:-1], B), dist(A, B[:-1]), dist(A[:-1], B[:-1]))

dist("kitten", "sitting")
```
