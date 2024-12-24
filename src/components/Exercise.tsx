import ExerciseSequence from '~/components/ExerciseSequence'

type ExerciseProps = {
  id?: string
  data: string
}

export default function Exercise(props: ExerciseProps) {
  const data = () => JSON.parse(props.data)
  return <ExerciseSequence id={props.id} data={[data()]} />
}
