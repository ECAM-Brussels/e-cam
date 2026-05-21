// import { chempyToLatex } from './Balance'// not important ftm unless we ad a question to find the element with his molar mass
// import z from 'zod'
// import Math from '~/components/Math'
// import { graphql } from '~/gql'
// import { createExerciseType } from '~/lib/exercises/base'
// import { request } from '~/lib/graphql'
// import { Show } from 'solid-js'

// const math = z.string().nonempty().or(z.number().transform(String)).optional()
// // Mapping units not really necessary but in my case idk how to define units yet .
// const units: Record<string, string> = {
//   mass: 'Kg',
//   rho: 'kg/dm^3',
//   volume: 'm^3'
// }

// const quantity = z.tuple({
//   z.string().nonempty().or(z.number().transform(String)), z.string()
  
// })

// const { Component, schema } = createExerciseType({
//   name: 'MassDensity',
//   Component: (props) => (
//     <>
//       <p>
//         Déterminez la valeur de <Math value={props.question.unknown} />
//         {/* we show the qs with the answer to find and its unit */}
//         <Show when={['mass', 'rho', 'volume'].includes(props.question.unknown)}>
//           {' '}
//           en {units[props.question.unknown]}
//         </Show>
//       </p>

//       <div>
//         <Math value={`\\rho = ${props.question.unknown === 'rho' ? '?' : props.question.rho} \\,(${units['rho']})`} />
//         <Math value={`m = ${props.question.unknown === 'mass' ? '?' : props.question.mass} \\,(${units['mass']})`} />
//         <Math value={`V = ${props.question.unknown === 'volume' ? '?' : props.question.volume} \\,(${units['volume']})`} />
//       </div>
//       {/* printing known values and putting ? in front of the unknown value   */}

//       <div class="flex justify-center items-center gap-2">
//         <p>Réponse:</p>
//         <Math name="attempt" value={props.attempt} editable displayMode />
//       </div>
//     </>
//   ),

//   question:  z.object({
//     unknown: z.literal('mass'),
//     rho: math,
//     volume: math,
//     unit: z.object({
//       rho: z.literal(units.rho),
//       volume: z.literal(units.volume),
//       mass: z.literal(units.mass),
//     }),
//   }),

//   attempt: z.string().nonempty(),

//   mark: async (question, attempt) => {
    
//   },
// })
