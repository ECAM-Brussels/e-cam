import { MetaProvider, Title } from '@solidjs/meta'
import { createContext, createEffect, createSignal, useContext, type JSXElement } from 'solid-js'

type Meta = {
  lang: 'fr' | 'en'
  title: string
}

const MetaContext = createContext<Meta>()

export type MetaProviderProps = {
  lang?: 'en' | 'fr'
  title: string
  children: JSXElement
}

export default function (props: MetaProviderProps) {
  const [lang, setLang] = createSignal(props.lang || 'fr')
  createEffect(() => {
    setLang(props.lang || 'fr')
  })

  const [title, setTitle] = createSignal('')
  createEffect(() => {
    setTitle(props.title)
  })

  return (
    <MetaContext.Provider
      value={{
        get lang() {
          return lang()
        },
        get title() {
          return title()
        },
      }}
    >
      <MetaProvider>
        <Title>learning.ecam.be: {title()}</Title>
        {props.children}
      </MetaProvider>
    </MetaContext.Provider>
  )
}

export function useMeta() {
  return useContext(MetaContext)!
}
