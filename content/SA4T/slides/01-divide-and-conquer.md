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

# Exercise: maximum difference {.columns-2}

::::: break-inside-avoid
::: exercise
Find an $O(n)$ divide-and-conquer algorithm that,
given an array $A$ of $n$ numbers,
returns the largest possible difference between any two elements.
Show that your algorithm has that complexity.

You may not use `max` and `min` for more than two elements.
:::

::: hint
We just need to find the `max` and the `min`.
:::
:::::

~~~ python {.run .break-inside-avoid hideUntil="2024-11-05 16:15"}
def min_max(A: list[float]) -> tuple[float, float]:
    pass

min_max([1, 3, 2, 7, 4, 9, 8, 3])
# --- fragment
def min_max(A: list[float]) -> tuple[float, float]:
    if len(A) <= 2:
        return min(A), max(A)
    else:
        n = len(A) // 2
        m1, M1 = min_max(A[:n])
        m2, M2 = min_max(A[n:])
        return min(m1, m2), max(M1, M2)

min_max([1, 3, 2, 7, 4, 9, 8, 3])
~~~

# Exercise: quicksort {.columns-2}

::::: break-inside-avoid
Quicksort is a sorting algorithm which
selects a 'pivot' element from the array
and subequently partitions the other elements into two sub-arrays:
the elements that are smaller than the pivot,
and the elements that are larger than the pivot.

::: exercise
Implement quicksort in Python.
What is the average time complexity?
What about the worst case complexity?

Challenge: can you implement it in place,
i.e. without creating copies of the array?
:::
:::::

~~~ python {.run .break-inside-avoid hideUntil="2024-11-05 16:15"}
def quicksort(A):
    pass
quicksort([1, 2, 6, 5, 3, 7, 4])
# --- fragment
# Worst case complexity: O(n^2)
# Average complexity: O(n log n)
def quicksort(A):
    if len(A) < 2:
        return A
    pivots = [x for x in A if x == A[0]]
    low = quicksort([x for x in A if x < A[0]])
    high = quicksort([x for x in A if x > A[0]])
    return low + pivots + high
quicksort([1, 2, 6, 5, 3, 7, 4])
~~~

# Exercise: Peak search {.columns-2}

::::: break-inside-avoid
::: exercise
Given an array of numbers `A`,
find any peak (local maximum),
i.e. `A[i]` such that
$$
A[i] \geq A[i + 1],
\quad
A[i] \geq A[i - 1],
$$

1. If we brute-force, what is the time complexity?
2. Implement a divide-and-conquer approach of this algorithm in Python,
   and give the complexity.
:::

~~~ yaml {.plot}
xAxis:
  domain: [-3, 9]
yAxis:
  domain: [0, 7.5]
data:
  - fnType: points
    graphType: polyline
    points:
      - [0, 1]
      - [1, 2]
      - [2, 6]
      - [3, 5]
      - [4, 3]
      - [5, 7]
      - [6, 4]
~~~
:::::

::::: break-inside-avoid
~~~ python {.run hideUntil="2024-11-05 16:15"}
A = [1, 2, 6, 5, 3, 7, 4]

def peak_find(start: int = 0, end: int = len(A)):
    i = (start + end) // 2
    # TODO: your code goes here
    return (i, A[i])

peak_find()
# --- fragment
A = [1, 2, 6, 5, 3, 7, 4]

def peak_find(start: int = 0, end: int = len(A)):
    i = (start + end) // 2
    if A[i - 1] <= A[i] and A[i] >= A[i + 1]:
        return (i, A[i])
    if A[i - 1] > A[i]:
        return peak_find(start, i)
    if A[i] < A[i + 1]:
        return peak_find(i + 1, end)

# Complexity O(log n)
peak_find()
~~~
:::::

# Karatsuba's trick for multiplication {.w-1--2}

$$
\begin{array}{r r r}
& a & b \\
\times & c & d \\
\hline
& ad & bd \\
ac & bc & \\
\hline
\textcolor{darkred}{ac} & \textcolor{darkblue}{ad + bc} & \textcolor{darkgreen}{bd}
\end{array}
$$

This requires $4$ multiplications: $ac$, $ad$, $bc$, $bd$.

::: {.hint title="Karatsuba's trick"}
$$
\underbrace{\textcolor{darkorange}{(a + b)(c + d)}}_{\text{calculate this}} =
\textcolor{darkred}{ac} + \underbrace{\textcolor{darkblue}{ad + bc}}_{\text{instead of this}} + \textcolor{darkgreen}{bd}
$$

Therefore, we could have the results with three multiplications instead of four:

- $\textcolor{darkgreen}{bd}$: last digit
- $\textcolor{darkred}{ac}$: first digit
- $\textcolor{darkblue}{ad + bc} = \textcolor{darkorange}{(a + b)(c + d)} - \textcolor{darkred}{ac} - \textcolor{darkgreen}{bd}$
:::

::: exercise
On paper, calculate $14 \times 37$ using Karatsuba's trick.
:::

# Karatsuba's trick: implementation {.w-1--2}

::: exercise
Using divide and conquer,
recursively use Karatsuba's trick to multiply two numbers.
What is its time complexity?
:::

~~~ python {.run hideUntil="2024-11-05 16:15"}
def karatsuba(x, y):
    return x * y

karatsuba(34, 13)
# --- fragment
# Complexity: O(n^(log_2 3))
def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y

    x_str, y_str = str(x), str(y)
    m = max(len(x_str), len(y_str)) // 2
    x_high, x_low = int(x_str[:-m]), int(x_str[-m:])
    y_high, y_low = int(y_str[:-m]), int(y_str[-m:])

    a = karatsuba(x_high, y_high)
    b = karatsuba(x_low, y_low)
    c = karatsuba(x_high + x_low, y_high + y_low) - a - b
    return a * 10 ** (2 * m) + c * 10 ** m + b

karatsuba(34, 13)
~~~