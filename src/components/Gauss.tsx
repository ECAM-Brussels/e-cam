import { action, useSubmission } from '@solidjs/router'
import { createEffect, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import Button from '~/components/Button'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

const checkRowEquivalence = action(async (form: FormData) => {
  'use server'
  const A = JSON.parse(form.get('A') as string) as string[][]
  const B = JSON.parse(form.get('B') as string) as string[][]
  const { matrix } = await request(
    graphql(`
      query CheckRowEquivalence($A: [[Math!]!]!, $B: [[Math!]!]!) {
        matrix(entries: $A) {
          isRowEquivalent(entries: $B)
        }
      }
    `),
    { A, B },
  )
  return {
    equivalent: matrix.isRowEquivalent,
  }
})

export default function Gauss() {
  const submission = useSubmission(checkRowEquivalence)
  return (
    <>
      <form class="my-4" method="post" action={checkRowEquivalence}>
        <div class="columns columns-2">
          <div>
            <h3 class="font-bold text-2xl">Énoncé</h3>
            <Matrix name="A" />
          </div>
          <div>
            <h3 class="font-bold text-2xl">Votre matrice</h3>
            <Matrix name="B" />
          </div>
        </div>
        <Button color="green">Vérifier</Button>
      </form>
      <Show when={submission.result?.equivalent}>
        <p class="rounded-xl text-green-900 bg-green-100 py-4 px-4">
          Les deux matrices sont équivalentes, vous n'avez pas fait d'erreurs.
        </p>
      </Show>
      <Show when={submission.result?.equivalent === false}>
        <p class="rounded-xl text-red-900 bg-red-100 py-4 px-4">
          Les deux matrices ne sont pas équivalentes, vérifiez vos calculs.
        </p>
      </Show>
    </>
  )
}

function Matrix(props: { data?: string[][]; name?: string }) {
  const [data, setData] = createStore<string[][]>(
    props.data ?? [
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
    ],
  )
  createEffect(() => {
    if (props.data) setData(props.data)
  })
  return (
    <>
      <Math
        class="bg-transparent"
        onBlur={(e) => {
          setData([
            [
              e.target.getPromptValue('0'),
              e.target.getPromptValue('1'),
              e.target.getPromptValue('2'),
              e.target.getPromptValue('3'),
            ],
            [
              e.target.getPromptValue('4'),
              e.target.getPromptValue('5'),
              e.target.getPromptValue('6'),
              e.target.getPromptValue('7'),
            ],
            [
              e.target.getPromptValue('8'),
              e.target.getPromptValue('9'),
              e.target.getPromptValue('10'),
              e.target.getPromptValue('11'),
            ],
          ])
        }}
        value={`
        \\left[
        \\begin{array}{rrr|r}
          \\placeholder[0]{${data[0][0]}} &
          \\placeholder[1]{${data[0][1]}} &
          \\placeholder[2]{${data[0][2]}} &
          \\placeholder[3]{${data[0][3]}}\\\\
          \\placeholder[4]{${data[1][0]}} &
          \\placeholder[5]{${data[1][1]}} &
          \\placeholder[6]{${data[1][2]}} &
          \\placeholder[7]{${data[1][3]}}\\\\
          \\placeholder[8]{${data[2][0]}} &
          \\placeholder[9]{${data[2][1]}} &
          \\placeholder[10]{${data[2][2]}} &
          \\placeholder[11]{${data[2][3]}}
        \\end{array}
        \\right]
      `}
        editable
        displayMode
      />
      <input type="hidden" name={props.name} value={JSON.stringify(data)} />
    </>
  )
}
