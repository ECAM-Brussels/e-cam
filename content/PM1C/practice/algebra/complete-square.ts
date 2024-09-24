;({
  mode: 'dynamic',
  streak: 3,
  whiteboard: true,
  title: 'Carrés parfaits',
  data: [
    {
      type: 'CompleteSquare',
      params: {
        A: [1],
        Alpha: [-1, -2, -3, -4, -5],
        Beta: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
      },
    },
    {
      type: 'CompleteSquare',
      params: {
        A: [1],
        Alpha: [1, 2, 3, 4, 5],
        Beta: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
      },
    },
    {
      type: 'CompleteSquare',
      params: {
        A: [2,3,4],
        Alpha: [-1, -2, -3, -4, 1, 2, 3, 4],
        Beta: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
      },
    },
    {
      type: 'CompleteSquare',
      params: {
        A: [-2,-3,-4,-5],
        Alpha: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
        Beta: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
      },
    },
    {
      type: 'CompleteSquare',
      params: {
        A: [-2,-3,-4,-5,2,3,4,5],
        Alpha: [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5],
        Beta: [-1, -2, -3, -4, -5, -6, -7, -8, 1, 2, 3, 4, 5, 6, 7, 8],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
