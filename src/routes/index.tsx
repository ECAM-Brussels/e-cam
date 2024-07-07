import { createStore } from 'solid-js/store'
import ExerciseSequence, { type Exercise } from '~/components/ExerciseSequence'

export default function Home() {
  const [data, setData] = createStore<Exercise[]>([
    {
      type: 'Factor',
      state: {
        expr: 'x^2 - 5x + 6',
        attempt: '',
      },
    },
    {
      type: 'Factor',
      state: {
        expr: 'x^2 - 3x + 2',
        attempt: '',
      },
    },
  ])
  return <ExerciseSequence data={data} setter={setData} />
}
