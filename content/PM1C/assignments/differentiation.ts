({
  whiteboard: false,
  data: [
    {
      type: 'Python',
      state: {
        question: `
          Écris une fonction appelée \`test\`
          qui ajoute $5$ à un nombre donné.
        `,
        answer: `
          def test(x):
              return x + 5
        `,
        tests: [
          'test(0)',
          'test(1)',
          'test(2)',
          'test(3)',
        ]
      },
    },
    {
      type: 'Differentiate',
      state: {
        expr: `\\sin(x)`,
      },
    },
    {
      type: 'Differentiate',
      state: {
        expr: `x^2`,
      },
    },
    {
      type: 'Differentiate',
      state: {
        expr: `\\cos(x)`,
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
