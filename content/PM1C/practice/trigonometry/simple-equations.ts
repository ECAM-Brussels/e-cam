;({
  whiteboard: true,
  mode: 'dynamic',
  streak: 3,
  data: [
    {
      type: 'Equation',
      params: {
        type: 'trigonometric',
        F: ['sin', 'cos'],
        A: ['1'],
        B: ['0'],
        C: ['0', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{3}}{2}', '1'],
        Interval: [['0', '2 \\pi']],
      },
    },
    {
      type: 'Equation',
      params: {
        type: 'trigonometric',
        F: ['tan', 'cot'],
        A: ['1'],
        B: ['0'],
        C: ['\\frac{\\sqrt{3}}{3}', '-\\frac{\\sqrt{3}}{3}', '1', '-1', '\\sqrt{3}', '-\\sqrt{3}'],
        Interval: [['0', '2 \\pi']],
      },
    },
    {
      type: 'Equation',
      params: {
        type: 'trigonometric',
        F: ['sin', 'cos'],
        A: ['-1', '2', '-2', '3', '-3'],
        B: ['0'],
        C: [
          '0',
          '\\frac{1}{2}',
          '\\frac{\\sqrt{2}}{2}',
          '\\frac{\\sqrt{3}}{2}',
          '1',
          '-\\frac{1}{2}',
          '-\\frac{\\sqrt{2}}{2}',
          '-\\frac{\\sqrt{3}}{2}',
          '-1',
        ],
        Interval: [
          ['0', '2 \\pi'],
          ['-\\pi', '\\pi'],
        ],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
