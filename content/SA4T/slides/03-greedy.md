---
title: Greedy algorithms
lang: en
slideshow: true
---

# Greedy algorithms {.w-1--2}

::: definition
A **greedy** algorithm repeatedly makes the locally best decision.
:::

::: example
I'd like to eat one cookie per day,
but I want to make sure that after 10 days,
I'll have eaten as much cookie as possible.

The **greedy appoach** is to eat the largest remaining cookie.
:::

::: remark
The greedy approach doesn't necessarily give the correct solution,
nor does it give the unique one.
You need to justify your approach.
:::

# Example: coin change problem {.w-1--2}

::: exercise
Using a family of coins `coins = [1, 2, 5, 10, 20, 50, 100, 200]`,
find an efficient way to reach an arbitrary integer `value`.
Justify why a greedy algorithm works for this particular denomination.
:::

::: remark
We previously solved this problem using **dynamic programming**.
:::

# Coin change problem: implementation {.w-1--2}

```python {.run}
coins = [1, 2, 5, 10, 20, 50, 100, 200]
def change(value: int) -> list[int]:
    pass

change(83)
# --- fragment
coins = [1, 2, 5, 10, 20, 50, 100, 200]

# O(len(coins))
def change(value: int) -> list[int]:
    result = []
    for coin in reversed(coins):
        if value // coin:
            result += (value // coin) * [coin]
            value %= coin
    return result

change(83)
```

# Proof of correctness {.w-1--2}

::: proposition
An optimal way to reach `value`
can always contain the largest coin which is smaller than or equal to `value`
:::

::: proof
By exchanging coins, we can always assume that the optimal solution contains:

- at most 1 coin of `1`
- at most 2 coins of `2`
- at most 1 coin of `5`
- at most 1 coin of `10`
- at most 2 coins of `20`
- at most 1 coin of `50`
- at most 1 coin of `100`
:::

# Largest number {.w-1--2}

::: exercise
Given a list of nonnegative integers, arrange them such that they form the largest number and return it.

Since the result may be very large, you need to return a string instead of an integer.
:::

- `largest([10, 2])` returns $210$.
- `largest([3,30,34,5,9])` returns $9534330$.

# Largest number: implementation {.w-1--2}

```python {.run hideUntil="2024-11-19 16:15"}
def largest(numbers: list[int]) -> str:
    return ""

largest([3,30,34,5,9])
# --- fragment
import functools

@functools.cmp_to_key
def compare(x: int, y: int):
    X, Y = str(x) + str(y), str(y) + str(x)
    if X > Y:
        return -1
    elif Y < X:
        return 1
    return 0

# Running time: O(n log n), n = len(numbers)
def largest(numbers: list[int]) -> str:
    numbers.sort(key=compare)
    return "".join(map(str, numbers))

largest([3,30,34,5,9])
```

# Fractional knapsack {.w-1--2}

::: exercise
Given the weights and prices of $n$ items,
put these items in a knapsack of capacity $C$ to get the maximum total value in the knapsack.
You are allowed to take a fraction of that item.

Justify why a greedy approach works.
:::

# Fractional knapsack: implementation {.w-1--2}

```python {.run hideUntil="2024-11-19 16:15"}
item = tuple[int, int, int] # (id, value, weight)

def FKS(items: list[item], capacity: int) -> list[item]:
    return []

FKS([(0, 60, 10), (1, 100, 20), (2, 120, 30)], 50)
# --- fragment
item = tuple[int, int, int] # (id, value, weight)

# Running time: O(n log(n)), with n = len(items)
def FKS(items: list[item], capacity: int) -> list[item]:
    items.sort(key=lambda x: x[1] / x[2], reverse=True)
    sel = []
    for i, value, weight in items:
        if capacity <= 0:
            break
        ratio = min(capacity / weight, 1)
        capacity -= ratio * weight
        sel.append([i, ratio*value, ratio*weight])
    return sel

FKS([(0, 60, 10), (1, 100, 20), (2, 120, 30)], 50)
```

# Activity selection problem {.w-1--2}

::: exercise
You are given $n$ activities with their start and finish times.
Select the maximum number of activities that can be performed by a single person,
assuming that a person can only work on a single activity at a time.

Justify why you can use a greedy strategy.
What is the time complexity?
:::

# Activity selection problem: implementation {.w-1--2}

```python {.run hideUntil="2024-11-19 16:15"}
activity = tuple[int, int] # (start_time, end_time)

def activity_selection(activities: list[activity]) -> list[activity]:
    return []

activity_selection([(0, 3), (1, 4), (5, 7)])
# --- fragment
activity = tuple[int, int] # (start_time, end_time)

# Running time: O(n log n), n = len(activities)
def activity_selection(activities: list[activity]) -> list[activity]:
    activities.sort(key=lambda x: x[1])
    sel = []
    last_end = lambda: sel[-1][1] if sel else 0
    for start, end in activities:
        if start >= last_end():
            sel.append((start, end))
    return sel

activity_selection([(0, 3), (1, 4), (5, 7)])
```

# Job sequencing {.w-1--2}

::: exercise
We are given a list of jobs,
which all have a deadline and an associated profit
if the job is performed before the deadline.
All jobs take a single unit of time.

Maximize the total profit if only one job can be scheduled at a time.

Justify why a greedy algorithm can be used,
and find the time complexity.
:::

# Job sequencing {.w-1--2}

```python {.run hideUntil="2024-11-19 16:15"}
job = tuple[int, int, int] # (id, deadline, profit)

def job_sequencing(jobs: list[job]) -> list[int | None]:
    return []

job_sequencing([(0, 4, 20), (1, 1, 10), (2, 1, 40), (3, 1, 30)])
# --- fragment
job = tuple[int, int, int] # (id, deadline, profit)

# Complexity: O(n^2), n = len(jobs)
def job_sequencing(jobs: list[job]) -> list[int | None]:
    jobs.sort(key=lambda j: j[2], reverse=True)
    schedule = len(jobs) * [None]
    for i, deadline, profit in jobs:
        for slot in range(deadline - 1, -1, -1):
            if schedule[slot] is None:
                schedule[slot] = i
                break
    return schedule

job_sequencing([(0, 4, 20), (1, 1, 10), (2, 1, 40), (3, 1, 30)])
```

# Data structure: Heaps and Min Heaps {.w-1--2}

::: definition
- A **heap** is an array visualized as a nearly complete binary tree.
- A **min-heap** is a heap with the additional property
  that a parent is always less than or equal to its children.
:::

# Heap queues {.w-1--2}

The librairy `heapq` has a few useful methods:

- `heapq.heapify(l)`: transform a list `l` into a heap in-place ($O(n)$).

- `heapq.pop(heap)`: remove and return the smallest item from the heap,
  maintaining the heap invariant.

- `heapq.push(heap, item)`: push the item onto the heap,
  maintaining the heap invariant.

# Huffman encoding: introduction {.w-1--2}

![](https://upload.wikimedia.org/wikipedia/commons/d/d8/HuffmanCodeAlg.png){.h-full}

# Huffman {.w-1--2}

```python {.run hideUntil="2024-11-19 16:15"}
from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    freq: int
    char: Optional[str] = None
    left: Optional['Node'] = None
    right: Optional['Node'] = None
    def __lt__(self, other):
        return self.freq < other.freq

def huffman(text: str):
    # Step 1: Calculate the frequencies of each letter in text
    # Step 2: Heapify
    # Step 3: Take the least two frequent letters y, z
    #         and replace them by w, which has y, z as children
    # Step 4: Construct the codebook
    pass
# --- fragment
from heapq import heapify, heappop, heappush
from collections import Counter
from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    freq: int
    char: Optional[str] = None
    left: Optional['Node'] = None
    right: Optional['Node'] = None
    def __lt__(self, other):
        return self.freq < other.freq

def huffman(text: str):
    heap = [Node(char=c, freq=f) for c, f in Counter(text).items()]
    heapify(heap)
    while len(heap) > 1:
        y, z = heappop(heap), heappop(heap)
        w = Node(freq=y.freq + z.freq, left=y, right=z)
        heappush(heap, w)

    codebook = {}
    def build_code(letter: Node, prefix: str = ""):
        if letter.char is not None:
            codebook[letter.char] = prefix
        if letter.left:
            build_code(letter.left, prefix + "0")
        if letter.right:
            build_code(letter.right, prefix + "1")
    build_code(heap[0])

    return codebook

huffman('helllo')
```
