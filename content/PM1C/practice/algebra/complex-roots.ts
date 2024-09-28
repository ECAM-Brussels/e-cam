;({
  mode: 'dynamic',
  streak: 10,
  whiteboard: true,
  title: 'Racines n-ème de nombres complexes',
  data: [
    {
      type: 'Equation',
      params: {
        type: 'complexRoots',
        N: [2, 3, 4, 6],
        R: [1, 2, 3, 4],
        Theta: ['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'],
        raiseToNthPower: true,
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
