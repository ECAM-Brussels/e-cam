---
title: Weighted graphs
slideshow: true
---

# Weighted graphs {.w-1--2}

![](/images/weighted_graph.svg){.w-full}

``` python
adj = {
    "A": {"B": 4, "C": 4},
    "B": {"A": 4, "C": 2, "E": 1},
    # ...
}
```

# Shortest path problem {.columns-2}

<Iframe src="https://honzaap.github.io/Pathfinding/" class="w-full h-full" />

::::: break-inside-avoid
Single Source Shortest Path problem
: Given a starting node `s`,
  calculate the length of the shortest path from `s` to all the other nodes.

All Pairs Shortest Path
: Find the lengths of the shortest paths
  between any two nodes.
:::::

# Dijkstra's algorithm {.w-1--2}

::: exercise
a. Given a (positively) weighted graph $V$ and a start node `s`,
   find the (length of the) shortest path between `s` and all the other nodes.

b. What is the time complexity?

c. Change your algorithm to output the actual paths as well.
:::

::: hint
This algorithm is simply BFS with a priority queue to consider the next vertex to explore.
It is **greedy** and based on the fact that the closest estimated distance
will always be the length of the shortest path.
:::

[Watch a video on Dijkstra](https://www.youtube.com/watch?v=EFg3u_E6eHU)

# Dijkstra's algorithm {.w-1--2}

``` python {.run hideUntil="2024-12-04 12:00"}
def dijkstra(adj, s):
    pass

dijkstra({
    'A': {'B': 4, 'C': 1},
    'B': {},
    'C': {'B': 2}
}, 'A')
# --- fragment
import heapq

# O((V + E) log V)
def dijkstra(adj, s):
    dist = {u: 0 if s == u else float('inf') for u in adj}
    queue = [(0, s)]
    while queue:
        d, u = heapq.heappop(queue)
        for v in adj[u]:
            distance = d + adj[u][v]
            if distance < dist[v]:
                dist[v] = distance
                heapq.heappush(queue, (distance, v))
    return dist

dijkstra({
    'A': {'B': 4, 'C': 1},
    'B': {},
    'C': {'B': 2}
}, 'A')
```

# Bellman-Ford: introduction {.w-1--2}

Dijkstra is greedy and doesn't work on graphs with negative weights.
Let's use dynamic programming instead:

- Subproblems: find `BF(v, k)`, the length of the shortest path between `s` and `v`
  using at most $k$ edges.

- Base cases:

- Guess:

- Recurrence:

- Complexity

::: exercise
Implement Bellman-Ford and give the time complexity.
How would you get the paths themselves?
:::

# Bellman-Ford: implementation {.w-3--5}

``` python {.run hideUntil="2024-12-04 12:00"}
import functools

def bellman_ford(adj, s):
    @functools.cache
    def BF(v, k: int):
        pass

bellman_ford({
    'A': {'B': 2, 'C': 4},
    'B': {'C': -2},
    'C': {}
}, 'A')
# --- fragment
import functools

def bellman_ford(adj, s):
    @functools.cache
    def BF(v, k: int):
        if k == 0:
            return 0 if v == s else float('inf')
        return min([
            BF(v, k - 1),
            *[BF(u, k - 1) + adj[u][v] for u in adj if v in adj[u]]
        ])
    return { u: BF(u, len(adj) - 1) for u in adj }

bellman_ford({
    'A': {'B': 2, 'C': 4},
    'B': {'C': -2},
    'C': {}
}, 'A')
```

# Floyd-Warshall {.w-1--2}

::: question
What if we are interested in finding the shortest paths between any two nodes?
If we apply Dijkstra/Bellman-Ford for each node as starting point, what would the complexity be?
:::

To be quicker, use dynamic programming.

- Subproblems: find `FW(u, v, k)`, the length of the shortest path between `u` and `v`
  only using the first `k` nodes as intermediate nodes.

- Base cases:

- Guess:

- Recurrence:

# Floyd-Warshall: implementation {.w-3--5}

``` python {.run hideUntil="2024-12-04 12:00"}
import functools

def floyd_warshall(adj):
    @functools.cache
    def FW(u, v, k):
        pass

floyd_warshall({
    'A': {'B': 2, 'C': 4},
    'B': {'C': -2},
    'C': {}
})
# --- fragment
import functools

# Complexity: O(V^3)
def floyd_warshall(adj):
    V = list(adj.keys())
    @functools.cache
    def FW(u, v, k):
        if u == v:
            return 0
        if k == 0:
            return adj[u][v] if v in adj[u] else float('inf')
        return min(
            FW(u, v, k - 1),
            FW(u, V[k - 1], k - 1) + FW(V[k - 1], v, k - 1)
        )
    
    return {(u, v): FW(u, v, len(V)) for u in V for v in V}

floyd_warshall({
    'A': {'B': 2, 'C': 4},
    'B': {'C': -2},
    'C': {}
})
```

# Prim's algorithm {.w-1--2}

![](/images/minimum_spanning_tree.svg){.mx-auto .w-96}

::: exercise
Given an undirected, connected weighted graph,
find a spanning tree with smallest total weight.
:::

::: hint
Grow a tree to reach all vertices,
use a priority queue to favour lighter edges.
:::

# Prim's algorithm: implementation {.w-3--5}

``` python {.run hideUntil="2024-12-04 12:00"}
def prim(adj, s):
    pass

prim({
    0: {1: 1, 2: 4},
    1: {0: 1, 2: 2, 3: 6},
    2: {0: 4, 1: 2, 3: 3},
    3: {1: 6, 2: 3},
}, 0)
# --- fragment
import heapq

def prim(adj, s):
    tree = []
    visited = set()
    queue = [(0, s, s)]
    while queue:
        _, u, v = heapq.heappop(queue)
        if v in visited:
            continue
        visited.add(v)
        if u != v:
            tree.append((u, v))
        for neighbour, w in adj[v].items():
            if neighbour not in visited:
                heapq.heappush(queue, (w, v, neighbour))
    return tree

prim({
    0: {1: 1, 2: 4},
    1: {0: 1, 2: 2, 3: 6},
    2: {0: 4, 1: 2, 3: 3},
    3: {1: 6, 2: 3},
}, 0)
```