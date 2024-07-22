import { createStore } from 'solid-js/store'
import Exercise from '~/components/Exercise'
import ExerciseSequence, { type Exercise as ExerciseSchema } from '~/components/ExerciseSequence'
import Page from '~/components/Page'

export default function Home() {
  const [data, setData] = createStore<ExerciseSchema[]>([
    {
      type: 'CompleteSquare',
      params: {
        A: [1],
        Alpha: [-3, 2, 1, 1, 2, 3],
        Beta: [-3, 2, 1, 1, 2, 3],
      },
    },
    {
      type: 'CompleteSquare',
      state: {
        expr: 'x^2 - 6x + 11',
        attempt: '',
      },
    },
    {
      type: 'Equation',
      state: {
        equation: 'x^2 - 5x + 6',
        attempt: [''],
      },
    },
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
    {
      type: 'Factor',
      params: {
        A: [1],
        X1: [-3, 2, 1, 1, 2, 3],
        X2: [-3, 2, 1, 1, 2, 3],
      },
    },
  ])
  return (
    <Page>
      <ExerciseSequence data={data} setter={setData} />
      <Exercise type="Factor" state={{ expr: 'x^2-5x+6', attempt: '' }} />
    </Page>
  )
}
