({
  whiteboard: false,
  data: [
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande un nombre
          et qui affiche
          
          - \`pair\` si ce nombre est pair
          - \`impair\` si ce nombre est impair
        `,
        answer: `
          number = int(input("Entrez un nombre: "))
          if number % 2:
              print("impair")
          else:
              print("pair")
        `,
        wrap: true,
        tests: [0, 1, 2, 3, 4, 5, 6, 7].map(n => `main(["${n}"])`),
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
