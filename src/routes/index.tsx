import { createStore } from 'solid-js/store'
import ExerciseSequence, { type Exercise } from '~/components/ExerciseSequence'

export default function Home() {
  const [data, setData] = createStore<Exercise[]>([
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
  return <ExerciseSequence data={data} setter={setData} />
}
