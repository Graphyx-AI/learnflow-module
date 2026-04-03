import { Section } from './types';

export const SECTIONS: Section[] = [
  {
    id: 'section-1',
    label: 'Seção 1 · Unidade 1',
    title: 'Fundamentos de IA',
    unlocked: true,
    lessons: [
      {
        icon: '⭐',
        title: 'O que é Inteligência Artificial?',
        description: 'Explore a história e os fundamentos da IA moderna.',
        topics: [
          'História da IA desde 1950',
          'Diferença entre IA, ML e DL',
          'Tipos de aprendizado',
          'Aplicações reais no dia a dia',
        ],
        questions: [
          {
            icon: '🤖', category: 'Conceitos', difficulty: 'Fácil',
            text: 'Qual é a definição mais precisa de Inteligência Artificial?',
            options: ['Robôs físicos que pensam', 'Sistemas que simulam capacidades cognitivas humanas', 'Qualquer software computacional', 'Programas de videogame'],
            correctIndex: 1,
            explanation: 'IA é o campo da ciência da computação que busca criar sistemas capazes de simular capacidades intelectuais humanas como aprender, raciocinar e resolver problemas.',
          },
          {
            icon: '📅', category: 'Conceitos', difficulty: 'Fácil',
            text: 'Quem é considerado o "pai" da Inteligência Artificial?',
            options: ['Alan Turing', 'John McCarthy', 'Elon Musk', 'Marvin Minsky'],
            correctIndex: 1,
            explanation: 'John McCarthy cunhou o termo "Inteligência Artificial" em 1956, durante a famosa Conferência de Dartmouth.',
          },
          {
            icon: '🧠', category: 'Conceitos', difficulty: 'Médio',
            text: 'O que diferencia Machine Learning de IA clássica (regras)?',
            options: ['ML é mais rápido', 'ML aprende padrões com dados sem regras explícitas', 'ML só funciona com imagens', 'ML precisa de mais código'],
            correctIndex: 1,
            explanation: 'IA clássica usa regras criadas manualmente por humanos. Machine Learning permite que o sistema aprenda os próprios padrões a partir de dados.',
          },
          {
            icon: '🔢', category: 'Conceitos', difficulty: 'Médio',
            text: 'O que são "dados de treinamento" em Machine Learning?',
            options: ['Documentação do sistema', 'Exemplos históricos usados para o modelo aprender', 'Logs de erro do servidor', 'Hiperparâmetros do modelo'],
            correctIndex: 1,
            explanation: 'Dados de treinamento são os exemplos que o modelo usa para aprender padrões. Quanto mais dados de qualidade, melhor o aprendizado.',
          },
          {
            icon: '🔍', category: 'Conceitos', difficulty: 'Fácil',
            text: 'O que é "Deep Learning"?',
            options: ['Aprendizado muito lento', 'Subárea de ML com redes neurais de múltiplas camadas', 'Treinamento feito por humanos', 'Uma linguagem de programação'],
            correctIndex: 1,
            explanation: 'Deep Learning usa redes neurais artificiais com muitas camadas. É a tecnologia por trás de reconhecimento de voz, imagens e LLMs como o ChatGPT.',
          },
          {
            icon: '🎯', category: 'Conceitos', difficulty: 'Médio',
            text: 'O que é aprendizado supervisionado?',
            options: ['IA que aprende sem professor', 'IA treinada com pares de entrada e saída rotulados', 'IA que aprende por tentativa e erro', 'IA que usa apenas texto'],
            correctIndex: 1,
            explanation: 'No aprendizado supervisionado, o modelo recebe exemplos rotulados. Ele aprende a mapear entradas em saídas corretas.',
          },
          {
            icon: '💡', category: 'Conceitos', difficulty: 'Difícil',
            text: 'O que é "Transfer Learning"?',
            options: ['Transferir dados entre servidores', 'Usar conhecimento de um modelo pré-treinado em nova tarefa', 'Copiar pesos entre projetos', 'Migrar entre cloud providers'],
            correctIndex: 1,
            explanation: 'Transfer Learning reutiliza um modelo treinado em uma tarefa e o adapta para outra. Economiza tempo e dados enormemente.',
          },
          {
            icon: '⚖️', category: 'Ética', difficulty: 'Médio',
            text: 'O que é "viés algorítmico" em IA?',
            options: ['IA que prefere Python a JavaScript', 'Discriminação sistemática resultante de dados tendenciosos', 'Bug de cálculo matemático', 'Alta taxa de erro aleatório'],
            correctIndex: 1,
            explanation: 'Viés algorítmico ocorre quando o modelo replica preconceitos presentes nos dados de treinamento.',
          },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    label: 'Seção 2 · Unidade 2',
    title: 'Prompting Avançado',
    unlocked: false,
    lessons: [],
  },
];

export const INITIAL_PLAYER = {
  xp: 2800,
  streak: 3,
  level: 29,
  levelTitle: 'Data Analyst',
  currentXp: 2800,
  nextLevelXp: 4500,
  completedLessons: [] as number[],
};
