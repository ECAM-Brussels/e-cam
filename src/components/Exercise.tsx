import ExerciseSequence, { type Exercise as ExerciseProps } from '~/components/ExerciseSequence'

export default function Exercise(props: ExerciseProps) {
  return <ExerciseSequence data={[props]} />
}
