;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  title: 'Nombres complexes: forme polaire',
  data: [
    {
      type: 'ComplexPolar',
      params: {
        R: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        Theta: [
          '\\frac{\\pi}{6}',
          '\\frac{\\pi}{4}',
          '\\frac{\\pi}{3}',
          '\\frac{\\pi}{2}',
          '\\pi - \\frac{\\pi}{6}',
          '\\pi - \\frac{\\pi}{4}',
          '\\pi - \\frac{\\pi}{3}',
          '\\pi - \\frac{\\pi}{2}',
          '\\frac{\\pi}{6} + \\pi',
          '\\frac{\\pi}{4} + \\pi',
          '\\frac{\\pi}{3} + \\pi',
          '\\frac{\\pi}{2} + \\pi',
          '-\\frac{\\pi}{6}',
          '-\\frac{\\pi}{4}',
          '-\\frac{\\pi}{3}',
          '-\\frac{\\pi}{2}',
        ],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
