;({
  mode: 'dynamic',
  whiteboard: true,
  title: 'Théorème de Pythagore',
  data: [
    {
      type: 'Pythagoras',
      params: {
        type: 'general',
        S: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        X: ['a', 'b', 'c', 'x', 'y', 'z']
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
