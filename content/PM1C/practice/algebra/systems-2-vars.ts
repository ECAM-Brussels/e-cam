;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  data: [
    {
      type: 'System',
      params: {
        variables: ['x', 'y'],
        L: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        U: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        X: [...Array.from({ length: 21 }, (_, i) => String(i - 10))],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
