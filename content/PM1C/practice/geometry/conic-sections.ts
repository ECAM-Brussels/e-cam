;({
  mode: 'dynamic',
  streak: 200,
  whiteboard: true,
  title: 'Classification de coniques',
  data: [
    {
      type: 'ConicSection',
      params: {
        Types: ['ellipse', 'parabola', 'hyperbola'],
        X0: [...Array.from({ length: 21 }, (_, i) => String(i - 10))],
        Y0: [...Array.from({ length: 21 }, (_, i) => String(i - 10))],
        A: [...Array.from({ length: 10 }, (_, i) => String(i + 1))],
        B: [...Array.from({ length: 10 }, (_, i) => String(i + 1))],
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
