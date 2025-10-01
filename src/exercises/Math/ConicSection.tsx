import { sample } from 'lodash-es'
import { createEffect, createSignal, Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { expand, simplify } from '~/queries/algebra'

const conicSectionType = z.union([
  z.literal('parabola'),
  z.literal('circle'),
  z.literal('ellipse'),
  z.literal('hyperbola'),
])
const conicSectionExerciseType = z.union([z.literal('conic'), conicSectionType])
type ConicSectionType = z.infer<typeof conicSectionType>
type ConicSectionExerciseType = z.infer<typeof conicSectionExerciseType>

const finiteSet = z
  .string()
  .nonempty()
  .array()
  .nonempty()
  .or(z.string().transform((el) => [el]))
  .transform((elements) => ['FiniteSet', ...elements])

const { Component, schema } = createExerciseType({
  name: 'ConicSection',
  Component: (props) => {
    const obj = () =>
      ({
        conic: 'la conique',
        circle: 'le cercle',
        ellipse: "l'ellipse",
        hyperbola: "l'hyperbole",
        parabola: 'la parabole',
      })[props.question.type]
    const [conicSectionType, setConicSectionType] = createSignal<ConicSectionExerciseType>(
      props.attempt?.type ?? props.question.type,
    )
    createEffect(() => setConicSectionType(props.attempt?.type ?? props.question.type))
    const foci = () =>
      props.attempt && 'foci' in props.attempt ? props.attempt.foci.slice(1) : ['', '']
    const radius = () => (props.attempt && 'radius' in props.attempt ? props.attempt.radius : '')
    const vertices = () =>
      props.attempt && 'vertices' in props.attempt ? props.attempt.vertices.slice(1) : ['', '']
    const asymptotes = () =>
      props.attempt && 'asymptotes' in props.attempt ? props.attempt.asymptotes.slice(1) : ['', '']
    const directrix = () =>
      props.attempt && 'directrix' in props.attempt ? props.attempt.directrix : ''
    return (
      <>
        <p>Caractérisez {obj()} dont l'équation est donnée par</p>
        <Math value={props.question.equation} displayMode />
        <input type="hidden" name="attempt.type" value={conicSectionType()} />
        <Show when={props.question.type === 'conic'}>
          <label>
            Type de conique:{' '}
            <select
              class="border bg-white py-2 px-2"
              value={conicSectionType()}
              onChange={(e) => setConicSectionType(e.target.value as ConicSectionType)}
            >
              <option value="circle">Cercle</option>
              <option value="ellipse">Ellipse</option>
              <option value="parabola">Parabole</option>
              <option value="hyperbola">Hyperbole</option>
            </select>
          </label>
        </Show>
        <Show when={props.question.type === 'ellipse'}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setConicSectionType(e.target.checked ? 'circle' : 'ellipse')}
              checked={props.attempt?.type === 'circle'}
            />{' '}
            Ceci est un cercle
          </label>
        </Show>
        <ul>
          <Show when={['ellipse', 'circle', 'hyperbola'].includes(conicSectionType())}>
            <li>
              Centre:{' '}
              <Math
                name="attempt.center"
                value={
                  props.attempt?.type === 'circle' ||
                  props.attempt?.type === 'ellipse' ||
                  props.attempt?.type === 'hyperbola'
                    ? props.attempt.center
                    : ''
                }
                editable
              />
            </li>
          </Show>
          <Show when={conicSectionType() === 'circle'}>
            <li>
              Rayon: <Math name="attempt.radius" value={radius()} editable />
            </li>
          </Show>
          <Show when={['ellipse', 'hyperbola', 'parabola'].includes(conicSectionType())}>
            <li>
              Foyer{conicSectionType() !== 'parabola' && 's'}:{' '}
              <Math name="attempt.foci" value={foci()[0]} editable />
              <Show when={conicSectionType() !== 'parabola'}>
                {' '}
                et <Math name="attempt.foci" value={foci()[1]} editable />
              </Show>
            </li>
            <li>
              Sommet{conicSectionType() !== 'parabola' && 's'}:{' '}
              <Math name="attempt.vertices" value={vertices()[0]} editable />
              <Show when={conicSectionType() !== 'parabola'}>
                {' '}
                et <Math name="attempt.vertices" value={vertices()[1]} editable />
              </Show>
            </li>
          </Show>
          <Show when={conicSectionType() === 'hyperbola'}>
            <li>
              Asymptotes: <Math name="attempt.asymptotes" value={asymptotes()[0]} editable /> et{' '}
              <Math name="attempt.asymptotes" value={asymptotes()[0]} editable />
            </li>
          </Show>
          <Show when={conicSectionType() === 'parabola'}>
            <li>
              Directrice: <Math name="attempt.directrix" value={directrix()} editable />
            </li>
          </Show>
        </ul>
      </>
    )
  },
  question: z.object({
    type: conicSectionExerciseType,
    equation: z.string().nonempty(),
  }),
  attempt: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('circle'),
      center: z.string().nonempty(),
      radius: z.string().nonempty(),
    }),
    z.object({
      type: z.literal('ellipse'),
      center: z.string().nonempty(),
      vertices: finiteSet,
      foci: finiteSet,
    }),
    z.object({
      type: z.literal('parabola'),
      foci: finiteSet,
      vertices: finiteSet,
      directrix: z.string().nonempty(),
    }),
    z.object({
      type: z.literal('hyperbola'),
      center: z.string().nonempty(),
      asymptotes: finiteSet,
      vertices: finiteSet,
      foci: finiteSet,
    }),
  ]),
  mark: async (question, attempt) => {
    'use server'
    if (attempt.type === 'circle') {
      const { conicSection } = await request(
        graphql(`
          query CheckCircle($equation: Math!, $center: Math!, $radius: Math!) {
            conicSection(equation: $equation) {
              type
              center {
                isEqual(expr: $center)
              }
              radius {
                isEqual(expr: $radius)
              }
            }
          }
        `),
        { ...question, ...attempt },
      )
      return (
        conicSection.type === 'circle' && conicSection.center.isEqual && conicSection.radius.isEqual
      )
    } else if (attempt.type === 'ellipse') {
      const { conicSection } = await request(
        graphql(`
          query CheckEllipse(
            $equation: Math!
            $center: Math!
            $foci: MathSet!
            $vertices: MathSet!
          ) {
            conicSection(equation: $equation) {
              type
              center {
                isEqual(expr: $center)
              }
              vertices {
                isSetEqual(S: $vertices)
              }
              foci {
                isSetEqual(S: $foci)
              }
            }
          }
        `),
        { ...question, ...attempt },
      )
      return (
        conicSection.type === 'ellipse' &&
        conicSection.center.isEqual &&
        conicSection.foci.isSetEqual
      )
    } else if (attempt.type === 'parabola') {
      const { conicSection } = await request(
        graphql(`
          query CheckParabola(
            $equation: Math!
            $directrix: Math!
            $foci: MathSet!
            $vertices: MathSet!
          ) {
            conicSection(equation: $equation) {
              type
              directrix {
                isEqual(expr: $directrix)
              }
              foci {
                isSetEqual(S: $foci)
              }
              vertices {
                isSetEqual(S: $vertices)
              }
            }
          }
        `),
        { ...question, ...attempt },
      )
      return (
        conicSection.type === 'parabola' &&
        conicSection.directrix.isEqual &&
        conicSection.foci.isSetEqual &&
        conicSection.vertices.isSetEqual
      )
    } else if (attempt.type === 'hyperbola') {
      const { conicSection } = await request(
        graphql(`
          query CheckHyperbola(
            $equation: Math!
            $center: Math!
            $foci: MathSet!
            $vertices: MathSet!
            $asymptote: Math!
            $asymptote2: Math!
          ) {
            conicSection(equation: $equation) {
              type
              center {
                isEqual(expr: $center)
              }
              vertices {
                isSetEqual(S: $vertices)
              }
              foci {
                isSetEqual(S: $foci)
              }
              asymptotes {
                one: isEqual(expr: $asymptote)
                two: isEqual(expr: $asymptote2)
              }
            }
          }
        `),
        {
          ...question,
          ...attempt,
          asymptote: attempt.asymptotes[1],
          asymptote2: attempt.asymptotes[2],
        },
      )
      const asymptotes = new Set(conicSection.asymptotes.map((a) => (a.one ? 1 : a.two ? 2 : 0)))
      return (
        conicSection.type === 'hyperbola' &&
        conicSection.foci.isSetEqual &&
        conicSection.vertices.isSetEqual &&
        conicSection.center.isEqual &&
        asymptotes.size == 2 &&
        asymptotes.has(1) &&
        asymptotes.has(2)
      )
    }
    return false
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      const { conicSection } = await request(
        graphql(`
          query GetConicSectionInfo($equation: Math!) {
            conicSection(equation: $equation) {
              type
              isCircle
              asymptotes {
                expr
              }
              center {
                expr
              }
              vertices {
                list {
                  expr
                }
                expr
              }
              foci {
                expr
              }
              directrix {
                expr
              }
              radius {
                expr
              }
            }
          }
        `),
        question,
      )
      return {
        remaining,
        ...question,
        ...conicSection,
        type: (conicSection.isCircle ? 'circle' : conicSection.type) as ConicSectionType,
      }
    },
    (props) => (
      <ul>
        <li>Type de conique: {props.type}</li>
        <Show
          when={props.type !== 'parabola'}
          fallback={
            <li>
              Directrice: <Math value={props.directrix.expr} />
            </li>
          }
        >
          <li>
            Centre: <Math value={props.center.expr} />
          </li>
        </Show>
        <Show
          when={props.type !== 'circle'}
          fallback={
            <li>
              Rayon: <Math value={props.radius.expr} />
            </li>
          }
        >
          <li>
            Foyers: <Math value={props.foci.expr} />
          </li>
        </Show>
        <Show when={props.asymptotes.length}>
          <li>
            Asymptotes: <Math value={props.asymptotes[0].expr} />,{' '}
            <Math value={props.asymptotes[1].expr} />
          </li>
        </Show>
        <Show when={props.vertices.list.length}>
          <li>
            Sommets:
            <Math value={props.vertices.expr} />
          </li>
        </Show>
      </ul>
    ),
  ],
  generator: {
    params: z.object({
      Types: conicSectionType
        .array()
        .nonempty()
        .default(['parabola', 'ellipse', 'parabola', 'hyperbola']),
      X0: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      Y0: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      A: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      B: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      classify: z.boolean().default(true),
      expand: z
        .boolean()
        .transform((b) => [b])
        .or(z.boolean().array().nonempty())
        .default([true]),
    }),
    generate: async (params) => {
      'use server'
      const conicSection = sample(params.Types)
      const exp = sample(params.expand)
      const [x0, y0] = [sample(params.X0), sample(params.Y0)]
      const [a, b] = [sample(params.A), sample(params.B)]
      const s = sample([-1, 1])
      const equation = {
        circle: `(x - ${x0})^2 + (y - ${y0})^2 - (${a})^2`,
        ellipse: `(${b})^2 (x - ${x0})^2 + (${a})^2 (y - ${y0})^2 - (${a})^2 (${b})^2`,
        hyperbola: `${s} ( (${b})^2 (x - ${x0})^2 - (${a})^2 (y - ${y0})^2) - (${a})^2 (${b})^2`,
        parabola:
          s == 1 ? `(x - ${x0})^2 - 4 (${a}) (y - ${y0})` : `(y - ${y0})^2 - 4 (${a}) (x - ${x0})`,
      }[conicSection]
      return {
        equation: `${exp ? await expand(equation, true) : await simplify(equation)} = 0`,
        type: params.classify ? (`conic` as const) : conicSection,
      }
    },
  },
})

export { Component as default, schema }
