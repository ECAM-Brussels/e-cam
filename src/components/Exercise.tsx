import { createStore } from 'solid-js/store'
import ExerciseSequence, { type Exercise as ExerciseProps } from '~/components/ExerciseSequence'

export default function Exercise(props: ExerciseProps) {
  const [data, setData] = createStore<ExerciseProps[]>([props])
  return <ExerciseSequence data={data} setter={setData} />
}
