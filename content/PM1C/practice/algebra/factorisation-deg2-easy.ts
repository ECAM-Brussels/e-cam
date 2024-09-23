;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  data: [
    {
      type: 'Factor',
      params: {
        A: [-1, 1],
        X1: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
        X2: [0],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
