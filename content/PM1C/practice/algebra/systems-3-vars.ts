;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  title: 'Systèmes à trois équations et trois inconnues',
  data: [
    {
      type: 'System',
      params: {
        variables: ['x', 'y', 'z'],
        L: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        U: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        X: [...Array.from({ length: 21 }, (_, i) => String(i - 10))],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
