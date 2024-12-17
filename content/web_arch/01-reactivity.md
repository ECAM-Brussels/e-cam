---
title: Signals and effects
slideshow: true
---

# The `effects` stack

``` js
const effects = {
  running: [],
  get current() {
    return this.running[this.running.length - 1]
  },
  run(effect) {
    const wrappedEffect = () =>
      this.running.push(wrappedEffect)
      effect()
      this.running.pop()
    }
    wrappedEffect()
  },
}
```

# `createEffect` {.grid .grid-cols-2}

``` js
function createEffect(callback) {
  effects.run(callback)
}
```

::::: col
### Explanations

- `effects` is a stack of running effects.
  Its aim is to determine whether an effect is being executed.

- `createEffect(callback)` wraps `callback`
  to ensure it pushes itself on and off the `effects` stack.
:::::

# `createSignal` {.grid .grid-cols-2}

``` js {.run}
const effects = {
  running: [],
  get current() {
    return this.running[this.running.length - 1]
  },
  run(effect) {
    const wrappedEffect = () => {
      this.running.push(wrappedEffect)
      effect()
      this.running.pop()
    }
    wrappedEffect()
  },
}
// --- start
function createSignal(value) {
  const subscribers = new Set()
  const read = () => {
    if (effects.running) {
      subscribers.add(effects.current)
    }
    return value
  }
  const write = (newValue) => {
    value = newValue
    subscribers.forEach(effect => effect())
  }
  return [read, write]
}
```

::::: col
### Explanations

We define a getter and a setter.
The role of the getter is to populate the list of effects (`subscribers`)
which needs to be rerun when the signal changes.
The setter, on the other hand,
is in charge of rerunning the dependent effects.

#### Example

``` js
const [read, write] = createSignal(0)
createEffect(function effect() {
  console.log("Signal's new value is", read())
})
```

In the above, we would like `effect` to subscribe to `read`,
because it needs to be rerun when `read()` changes.

1. Start running `effect`, which pushes itself onto the `effects` stack.
2. Calling `read`, which registers `effect` as a dependent effect
    before returning the signal value.
3. Change the signal value,
    and rerun all the dependent effects.
:::::

# Wrapping it up {.grid .grid-cols-2}

``` js
const effects = []

function createEffect(effect) {
  function wrappedEffect() {
    effects.push(wrappedEffect)
    effect()
    effects.pop()
  }
  wrappedEffect()
}

function createSignal(value) {
  const subscribers = new Set()
  const read = () => {
    if (effects) {
      subscribers.add(effects[effects.length - 1])
    }
    return value
  }
  const write = (newValue) => {
    value = newValue
    subscribers.forEach(effect => effect())
  }
  return [read, write]
}
```

``` js {.run}
const effects = []

function createEffect(effect) {
  function wrappedEffect() {
    effects.push(wrappedEffect)
    effect()
    effects.pop()
  }
  wrappedEffect()
}

function createSignal(value) {
  const subscribers = new Set()
  const read = () => {
    if (effects) {
      subscribers.add(effects[effects.length - 1])
    }
    return value
  }
  const write = (newValue) => {
    value = newValue
    subscribers.forEach(effect => effect())
  }
  return [read, write]
}
// --- start
const [signal, setSignal] = createSignal(0)

createEffect(() => {
  console.log('signal has been changed to', signal())
})

setSignal(1)
setSignal(2)
setSignal(3)
setSignal(4)
```