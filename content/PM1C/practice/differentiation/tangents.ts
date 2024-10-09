;({
  mode: 'dynamic',
  whiteboard: true,
  title: 'Tangentes et normales à un graphe',
  data: [
    {
      type: 'Tangent',
      params: {
        Data: [
          {
            Expr: [
              '\\sin(x)',
              '\\cos(x)',
              '\\sin(x + \\frac{\\pi}{2})',
              '\\cos(x + \\frac{\\pi}{2})',
              '\\sin(-x)',
              '\\cos(-x)',
              '\\sin(2x)',
              '\\cos(2x)',
              '\\sin(2x + \\pi)',
              '\\cos(2x + \\pi)',
            ],
            X0: [
              '0',
              '\\pi',
              '\\frac{\\pi}{6}',
              '\\frac{\\pi}{4}',
              '\\frac{\\pi}{3}',
              '\\frac{\\pi}{2}',
            ],
          },
          {
            Expr: ['e^{x}', 'e^{-x}', 'e^{2x}', 'e^{-2x}', 'e^{x - 1}', 'e^{2x}'],
            X0: ['0', '1', '-1', '2', '-2'],
          },
          {
            Expr: [
              'x^2',
              'x^3',
              '-x^2',
              '-x^3',
              'x^2 + 2x - 3',
              '(x - 2)^2',
              '(2x - 1)^3',
              '(x + 3)^4',
              '(3x + 1)^2',
              '(4 - x)^2',
            ],
            X0: ['0', '1', '2', '3', '4', '5', '-1', '-2', '-3', '-4', '-5'],
          },
        ],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
