({
  mode: 'dynamic',
  whiteboard: true,
  data: [
    {
      type: 'TrigonometricValues',
      params: {
        F: ['sin', 'cos'],
        Alpha: ['\\frac{\\pi}{6}'],
        Q: [1],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
