({
  whiteboard: true,
  data: [
    {
      type: 'Differentiate',
      state: {
        expr: `\\sin(x)`,
      },
    },
    {
      type: 'Differentiate',
      state: {
        expr: `x^2`,
      },
    },
    {
      type: 'Differentiate',
      state: {
        expr: `\\cos(x)`,
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
