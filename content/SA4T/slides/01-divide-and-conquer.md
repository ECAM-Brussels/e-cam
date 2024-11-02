---
title: Divide and Conquer
slideshow: true
---

# Algorithm example: Insertion sort {.w-1--2}

::: question
Given a set of cards, how do you sort them in increasing order?
:::

~~~ python {.run hideUntil="2024-11-05 16:15"}
cards = [3, 7, 4, 1, 2, 7, 3]
# --- fragment
right_hand = [3, 7, 4, 1, 2, 7, 3]
left_hand = []

for card in right_hand:
    position = len([c for c in left_hand if c <= card])
    left_hand.insert(position, card)

left_hand
~~~

# Correctness and complexity {.w-1--2}

~~~ python {.run}
right_hand = [3, 7, 4, 1, 2, 7, 3]
left_hand = []

for card in right_hand:
    position = len([c for c in left_hand if c <= card])
    left_hand.insert(position, card)

left_hand
~~~

The algorithm above is called **insertion sort**.

For every algorithm, we'll ask the following questions.

- Does the algorithm terminate?

- Is it correct?

- Is it efficient?

# Divide and conquer {.columns-2}

::: {.break-inside-avoid .shadow .rounded-xl .border .p-4 .mx-12}

### Divide and conquer

#. Recursively break the problem until it is simple (divide)
#. Solve the simple problems
#. Combine the simple solutions to solve the harder problems
:::

![](/images/merge_sort.svg){.h-full}

# Divide and conquer example: merge sort {.w-1--2}

![](/images/merge-sort.gif)

::: example
Apply merge sort to $13, 5, 14, 3, 2, 7, 16$
:::

# Divide and conquer: implementation {.columns-2}

::: {.break-inside-avoid}
#. Define a function that will solve our problem.
#. Use a condition to check if the problem is simple.
If it is, solve it.
#. Otherwise, break it down into smaller problems
and recursively call your function onto the small subproblems.
#. From the solutions to the smaller problems,
construct the solution to the real problem.
:::

```python {.run .break-inside-avoid hideUntil="2024-11-05 16:15"}
def merge_sort(numbers: list[int | float]):
    # Simple cases
    # Divide
    # Conquer
    pass
# --- fragment
def merge_sort(numbers: list[int | float]):
    # Simple cases
    if len(numbers) < 2:
        return numbers
    # Divide
    n = len(numbers)
    A = merge_sort(numbers[:n // 2])
    B = merge_sort(numbers[n // 2:])
    # Conquer
    output = []
    while A and B:
        output += [A.pop(0) if A[0] < B[0] else B.pop(0)]
    return output + A + B

merge_sort([1, 4, 3, 2])
```

# Complexity analysis {.w-1--2}

#. Establish a recurrence relation
$$
    T(n)
    = \underbrace{\Large\square}_{\substack{\text{number of}\\ \text{subproblems}}}
    T\overbrace{\left(\Large\square\right)}^{\substack{\text{subproblem}\\ \text{size}}}
    + \underbrace{\Large\square}_{\text{conquering}}
    $$

#. Draw the recurrence tree

#. Find the height and the cost of each row

#. Sum

::: hint
The following formulae are useful

$$
\sum_{k = 0}^n q^n = O(1) \quad \text{if} \ 0 < q < 1\\
a^{\log_b n} = n^{\log_b a}
$$
:::