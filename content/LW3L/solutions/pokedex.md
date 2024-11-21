---
title: Pokedex
---

# Pokedex

``` html {.run}
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>

<div id="app"></div>

<script type="text/babel" data-presets="react" data-type="module">
  import React from 'https://esm.sh/react'
  import ReactDOM from 'https://esm.sh/react-dom'

  function Info({ label, value }) {
    return (
      <div class="columns-2">
        <dt class="font-bold">{label}</dt>
        <dd>{value}</dd>
      </div>
    )
  }

  function Pokemon({ name }) {
    const [data, setData] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
        const data = await res.json()
        setData({
          audio: data.cries.latest,
          name: data.name,
          id: data.id,
          image: data.sprites.other['official-artwork'].front_default,
          type: data.types.map((t) => t.type.name).join(','),
          height: parseInt(data.height) * 10 + 'cm',
          weight: parseInt(data.weight) / 10 + 'cm',
        })
      } catch {
        setData(null)
      }
      setLoading(false)
    }

    React.useEffect(() => {
      fetchData()
    }, [name])

    if (loading) {
      return <p>Loading...</p>
    } else if (data === null) {
      return <p>This pokemon doesn't exist</p>
    }

    return (
      <div class="flex">
        <img src={data.image} class="max-w-64" />
        <dl>
          <Info label="Id" value={data.id} />
          <Info label="Name" value={data.name} />
          <Info label="Type" value={data.type} />
          <Info label="Weight" value={data.weight} />
          <Info label="Height" value={data.height} />
          <audio controls ref={audio}>
            <source src={data.audio} type="audio/ogg" />
          </audio>
        </dl>
      </div>
    )
  }

  function App() {
    const [name, setName] = React.useState('pikachu')

    return (
      <div class="max-w-4xl mx-auto bg-slate-50 p-8 border rounded-xl my-4">
        <input
          class="border rounded-xl p-4 w-full m-4"
          value={name}
          onInput={(e) => setName(e.target.value)}
        />
        <Pokemon name={name} />
      </div>
    )
  }

  const appContainer = document.getElementById('app')
  ReactDOM.createRoot(appContainer).render(<App />)
</script>
```