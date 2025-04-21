import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync, revalidate } from '@solidjs/router'
import { Component, For, Show, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  type getAssignment,
  extendSubmission,
  getSubmission,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchemaWithDefault } from '~/lib/exercises/schemas'
import useStorage from '~/lib/storage'

type AssignmentProps = {
  url: string
  userEmail?: string
  index: number
  data: Awaited<ReturnType<typeof getAssignment>>
  onIndexChange?: (newIndex: number) => void
}

export default function Assignment(props: AssignmentProps) {
  const [storage, setStorage] = useStorage<Exercise[]>(() => `assignment.${props.url}`, [])
  const body = createAsync(
    async () => {
      if (!props.userEmail) {
        setStorage(extendSubmission(storage(), props.data.body, props.data.options))
        return storage()
      }
      return await getSubmission(props.url, props.userEmail)
    },
    { initialValue: [] },
  )
  const classes = () =>
    body()?.map((exercise) => {
      const correct = exercise.attempts.at(-1)?.correct
      return { true: 'bg-green-100', false: 'bg-red-100' }[String(correct)] ?? 'bg-white'
    })
  return (
    <ErrorBoundary class="lg:flex gap-8">
      <div class="grow">
        <Show when={props.data.title}>
          <h1 class="text-4xl my-4">{props.data.title}</h1>
        </Show>
        <Pagination
          current={props.index}
          onChange={props.onIndexChange}
          max={body().length || 0}
          classes={classes()}
        />
        <For each={body()}>
          {function <N, S, P, F>(exercise: Exercise, index: () => number) {
            return (
              <div classList={{ hidden: index() !== props.index }}>
                <ErrorBoundary>
                  <Suspense fallback={<p>Loading exercise...</p>}>
                    <Dynamic
                      component={exercises[exercise.type] as Component<ExerciseProps<N, S, P, F>>}
                      {...(exercise as ExerciseProps<N, S, P, F>)}
                      options={optionsSchemaWithDefault.parse({
                        ...props.data.options,
                        ...exercise.options,
                      })}
                      onChange={async (event) => {
                        if (props.userEmail) {
                          await saveExercise(
                            location.pathname,
                            props.userEmail,
                            index(),
                            event as Exercise,
                          )
                          revalidate(getSubmission.keyFor(props.url, props.userEmail))
                        } else {
                          setStorage(
                            storage().map((ex, i) => (i === index() ? (event as Exercise) : ex)),
                          )
                        }
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )
          }}
        </For>
      </div>
      <Info {...props.data} />
    </ErrorBoundary>
  )
}

const Info = (props: Awaited<ReturnType<typeof getAssignment>>) => (
  <div class="py-6 px-6">
    <h2 class="text-2xl my-4">Informations</h2>
    <Show when={props.prerequisites.length}>
      <h3 class="text-xl mb-4">Prérequis</h3>
      <For each={props.prerequisites}>
        {(prerequisite) => (
          <li>
            <a class="text-blue-600" href={prerequisite.url}>
              {prerequisite.title || prerequisite.url}
            </a>
          </li>
        )}
      </For>
    </Show>
    <Show when={props.requiredBy.length}>
      <h3 class="text-xl mb-4">Compétence nécéssaire pour</h3>
      <For each={props.requiredBy}>
        {(skill) => (
          <li>
            <a class="text-blue-600" href={skill.url}>
              {skill.title || skill.url}
            </a>
          </li>
        )}
      </For>
    </Show>
    <Show when={props.courses.length}>
      <h3 class="text-xl mb-4">Cours</h3>
      <For each={props.courses}>
        {(course) => (
          <li>
            <a class="text-blue-600" href={course.url}>
              {course.title || course.code}
            </a>
          </li>
        )}
      </For>
    </Show>
  </div>
)
