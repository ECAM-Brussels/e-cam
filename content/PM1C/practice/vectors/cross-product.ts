({
  whiteboard: true,
  mode: 'dynamic',
  data: [
    {
      type: 'CrossProduct',
      params: {
        numbers: ['0', '1', '2', '3', '4'],
      },
    },
    {
      type: 'CrossProduct',
      params: {
        numbers: Array.from({ length: 20 }, (_, i) => String(i - 10)),
      },
    },
    {
      type: 'CrossProduct',
      params: {
        numbers: Array.from({ length: 20 }, (_, i) => String(i - 10)).concat('a', 'b', 'c', 'x', 'y')
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
