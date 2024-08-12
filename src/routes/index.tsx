import { type RouteDefinition } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import ExerciseSequence, { loadAssignment, type Exercise as ExerciseSchema } from '~/components/ExerciseSequence'
import Page from '~/components/Page'

export default function Home() {
  return (
    <Page>
      <section>
        <h2>Une plateforme d'apprentissage</h2>
      </section>
    </Page>
  )
}
