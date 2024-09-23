;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  data: [
    {
      type: 'Factor',
      params: {
        A: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
        X1: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
        X2: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
