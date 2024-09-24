({
  whiteboard: true,
  mode: 'dynamic',
  data: [
    {
      type: 'VectorAngle',
      params: {
        Coordinates: Array.from({ length: 21 }, (_, i) => String(i - 10)),
        error: 0.01,
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
