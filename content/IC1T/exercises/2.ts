;({
  whiteboard: false,
  allowReattempts: true,
  data: [
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande un entier
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
        tests: [0, 1, 2, 3, 4, 5, 6, 7].map((n) => `main(["${n}"])`),
      },
    },
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande un entier et affiche sa valeur absolue.
        `,
        answer: `
          number = int(input("Entrez un nombre: "))
          if number < 0:
              print(-number)
          else:
              print(number)
        `,
        wrap: true,
        tests: [0, -1, 2, -3, 4, -5, 6, -7].map((n) => `main(["${n}"])`),
      },
    },
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande une année en paramètre et qui affiche si elle est bissextile ou non.

          Une année est bissextile si:
          - elle est divisible par 4 et non divisible par 100, ou
          - si elle est divisible par 400.

          Le programme affichera:
          - \`bissextile\` si l'année est bissextile
          - \`non bissextile\` si l'année ne l'est pas
        `,
        answer: `
          year = int(input("Entrez une année: "))
          if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
              print("bissextile")
          else:
              print("non bissextile")
        `,
        wrap: true,
        tests: [1982, 2000, 1800, 2024, 2400, 2100, 24000, 216].map((n) => `main(["${n}"])`),
      },
    },
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande un entier et qui affiche sa factorielle.

          La factorielle de $n$ se note $n!$ et se calcule comme suit: $$n! = 1 \\times 2 \\times 3 \\times 4 \\times \\dots \\times n$$

          *il est interdit d’importer le module \`math\`*
        `,
        answer: `
          n = int(input("entier ? "))
          res = 1
          while(n > 1):
            res *= n
            n -= 1
          print(res)
        `,
        wrap: true,
        constraints: [
          ['from\\s+math', false],
          ['import\\s+math', false],
        ],
        tests: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `main(["${n}"])`),
      },
    },
    {
      type: 'Python',
      state: {
        question: `
          Écrire un programme qui demande un entier et qui affiche s’il est premier ou non.

          Un nombre premier est un nombre entier positif qui a exactement 2 diviseurs (1 et lui-même).

          Exemple :

          - 5 est premier car il n’est divisible que par 1 et 5.
          - 1 n’est pas premier car il n’a qu’un diviseur.
          
          Le programme affichera:
          - \`premier\` si le nombre est premier
          - \`non premier\` s'il ne l'est pas
        `,
        answer: `
          n = int(input("entier ? "))
          count = 0
          div = 1
          while div <= n:
            if n % div == 0:
              count += 1
            div += 1
          if count == 2:
            print('premier')
          else:
            print('non premier')
        `,
        wrap: true,
        tests: [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17].map((n) => `main(["${n}"])`),
      },
    },
  ],
}) satisfies import('~/components/ExerciseSequence').ExerciseProps
