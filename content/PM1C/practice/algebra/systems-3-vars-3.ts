;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  title: 'Systèmes à trois équations et trois inconnues (solubles, impossibles ou indéterminés)',
  description: `
    Attention!
    Les systèmes indéterminés ont potentiellement des solutions fractionnaires.
  `,
  data: [
    {
      type: 'System',
      params: {
        variables: ['x', 'y', 'z'],
        L: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        U: [...Array.from({ length: 11 }, (_, i) => String(i - 5))],
        X: [...Array.from({ length: 21 }, (_, i) => String(i - 10))],
        Impossible: [false, false, false, true],
        NullRows: [0, 0, 0, 0, 1, 1, 1, 2],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
