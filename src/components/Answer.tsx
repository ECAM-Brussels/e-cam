import Button from './Button'
import Markdown from './Markdown'
import { action, useSubmission } from '@solidjs/router'
import { createSignal, Show } from 'solid-js'
import z from 'zod'
import Math from '~/components/Math'
import Spinner from '~/components/Spinner'
import Tick from '~/components/Tick'
import { createComponent } from '~/lib/helpers'
import { checkEqual } from '~/queries/algebra'

const schema = z.object({
  showAnswer: z.boolean().default(true),
  value: z.string(),
  unit: z.string().default(''),
})

const checkSolution = action((form: FormData) => {
  return checkEqual(String(form.get('answer')), String(form.get('value')))
}, 'checkSolution')

export default createComponent(schema, (props) => {
  const [open, setOpen] = createSignal(false)
  const submission = useSubmission(checkSolution)
  return (
    <details
      class="border-l-4 border-slate-300 p-2 m-2 text-sm"
      open={open()}
      onToggle={() => setOpen(!open())}
    >
      <summary class="text-slate-500">{open() ? 'Cacher' : 'Montrer'} la réponse</summary>
      <form action={checkSolution} method="post" class="flex gap-4 items-center">
        <Show when={props.showAnswer}>
          Réponse: <Math value={props.value} />
          <Markdown value={props.unit} />
        </Show>
        <label class="flex gap-4 items-center">
          Vérifiez votre réponse:
          <Math
            class="border rounded"
            value={String(submission.input?.[0].get('answer') ?? '')}
            editable
            name="answer"
          />
          <input type="hidden" value={props.value} name="value" />
        </label>
        <Show when={submission.pending}>
          <Spinner /> Vérification en cours
        </Show>
        <Tick value={submission.result} />
        <Button color="green">Soumettre</Button>
      </form>
    </details>
  )
})
