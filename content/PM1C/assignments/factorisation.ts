({
  mode: 'dynamic',
  data: [
    {
      type: 'Factor',
      params: {
        A: [1],
        X1: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
        X2: [0],
      },
    },
    {
      type: 'Factor',
      params: {
        A: [-1],
        X1: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
        X2: [0],
      },
    },
    {
      type: 'Factor',
      params: {
        A: [1],
        X1: [1],
        X2: [1, 2, 3],
      },
    },
    {
      type: 'Factor',
      params: {
        A: [1],
        X1: [1, 2, 3],
        X2: [1, 2, 3],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
