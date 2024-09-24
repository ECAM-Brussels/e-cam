;({
  mode: 'dynamic',
  streak: 4,
  whiteboard: true,
  title: 'Trigonométrie: valeurs exactes',
  data: [
    {
      type: 'TrigonometricValues',
      params: {
        F: ['sin', 'cos'],
        Alpha: ['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'],
        Q: [4],
      },
    },
    {
      type: 'TrigonometricValues',
      params: {
        F: ['sin', 'cos', 'tan'],
        Alpha: ['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'],
        Q: [2, 4],
      },
    },
    {
      type: 'TrigonometricValues',
      params: {
        F: ['sin', 'cos', 'tan'],
        Alpha: ['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'],
        Q: [2, 3, 4],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
