;({
  mode: 'dynamic',
  whiteboard: true,
  title: 'Théorème de Pythagore',
  data: [
    {
      type: 'Pythagoras',
      params: {
        type: 'integers',
        N: 5,
        K: 3,
        X: ['x'],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
