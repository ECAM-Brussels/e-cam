;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  title: 'Factorisation (degré 3)',
  data: [
    {
      type: 'Factor',
      params: {
        A: [-1, 1],
        X1: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
        X2: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
        X3: [-4, -3, -2, -1, 1, 2, 3, 4],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
