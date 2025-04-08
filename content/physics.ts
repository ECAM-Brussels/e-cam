;({
  whiteboard: true,
  title: 'Devoir de Physique',
  data: [
    {
      type: 'Simple',
      state: {
        question: `
          Donne la formule du facteur de Lorentz

          $$\\gamma = \\dots$$
        `,
        answer: '\\frac{1}{\\sqrt{1-\\frac{v^2}{c^2}}}',
      },
    },
    {
      type: 'Simple',
      state: {
        question: `
          Quel vaut le rapport entre la circonférence du cercle et son diamètre?

          Nous tolérerons une réponse au centième près.
        `,
        error: 0.01,
        answer: '\\pi',
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
