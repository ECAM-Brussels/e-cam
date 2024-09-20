;({
  mode: 'dynamic',
  streak: 3,
  whiteboard: true,
  data: [
    {
      type: 'Factor',
      params: {
        A: [1],
        X1: [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
        X2: ['x1', '-x1'],
      },
    },
    {
      type: 'Factor',
      params: {
        A: [-1, 1],
        X1: [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
        X2: ['x1', '-x1'],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
