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

export const FINAL_TEST_QUESTIONS = [
  {
    icon: '🤖', category: 'Fundamentos', difficulty: 'Médio' as const,
    text: 'Qual a principal diferença entre IA simbólica e IA conexionista?',
    options: ['Velocidade de processamento', 'Regras explícitas vs. aprendizado por padrões', 'Linguagem de programação usada', 'Custo de hardware'],
    correctIndex: 1,
    explanation: 'IA simbólica usa regras lógicas explícitas, enquanto IA conexionista (redes neurais) aprende padrões a partir de dados.',
  },
  {
    icon: '🧠', category: 'Machine Learning', difficulty: 'Médio' as const,
    text: 'Qual tipo de aprendizado é usado quando não temos dados rotulados?',
    options: ['Supervisionado', 'Não supervisionado', 'Por reforço', 'Transfer Learning'],
    correctIndex: 1,
    explanation: 'O aprendizado não supervisionado encontra padrões em dados sem rótulos, como agrupamentos e associações.',
  },
  {
    icon: '📊', category: 'Dados', difficulty: 'Fácil' as const,
    text: 'O que é "overfitting" em Machine Learning?',
    options: ['Modelo muito simples', 'Modelo que memoriza os dados de treino sem generalizar', 'Excesso de dados de treino', 'Modelo com poucos parâmetros'],
    correctIndex: 1,
    explanation: 'Overfitting ocorre quando o modelo aprende demais os detalhes dos dados de treino e falha em dados novos.',
  },
  {
    icon: '🔗', category: 'Deep Learning', difficulty: 'Difícil' as const,
    text: 'O que é uma função de ativação em redes neurais?',
    options: ['Função que liga o computador', 'Função que introduz não-linearidade nas camadas', 'Algoritmo de otimização', 'Método de coleta de dados'],
    correctIndex: 1,
    explanation: 'Funções de ativação como ReLU e Sigmoid permitem que redes neurais aprendam relações complexas e não-lineares.',
  },
  {
    icon: '💬', category: 'NLP', difficulty: 'Médio' as const,
    text: 'O que significa "tokenização" em Processamento de Linguagem Natural?',
    options: ['Criptografar texto', 'Dividir texto em unidades menores (tokens)', 'Traduzir entre idiomas', 'Comprimir arquivos de texto'],
    correctIndex: 1,
    explanation: 'Tokenização divide texto em pedaços (palavras, subpalavras ou caracteres) para que modelos de IA possam processá-los.',
  },
  {
    icon: '🎯', category: 'Modelos', difficulty: 'Difícil' as const,
    text: 'O que é o mecanismo de "Attention" em Transformers?',
    options: ['Filtro de spam', 'Mecanismo que permite o modelo focar em partes relevantes da entrada', 'Sistema de cache de memória', 'Técnica de compressão'],
    correctIndex: 1,
    explanation: 'O mecanismo de Attention permite que o modelo pondere a importância de cada parte da entrada, revolucionando o NLP.',
  },
  {
    icon: '⚡', category: 'Prática', difficulty: 'Fácil' as const,
    text: 'Qual dessas é uma aplicação real de IA generativa?',
    options: ['Calculadora simples', 'Geração de imagens a partir de texto', 'Planilha de Excel', 'Envio de e-mails automáticos'],
    correctIndex: 1,
    explanation: 'IA generativa como DALL-E e Midjourney criam imagens originais a partir de descrições em texto.',
  },
  {
    icon: '⚖️', category: 'Ética', difficulty: 'Médio' as const,
    text: 'O que é "explicabilidade" (XAI) em IA?',
    options: ['Manual de instrução do software', 'Capacidade de entender e justificar decisões do modelo', 'Velocidade de resposta', 'Interface do usuário'],
    correctIndex: 1,
    explanation: 'XAI busca tornar as decisões de modelos de IA transparentes e compreensíveis para humanos.',
  },
  {
    icon: '🔄', category: 'MLOps', difficulty: 'Difícil' as const,
    text: 'O que é "model drift" em produção?',
    options: ['Bug no código', 'Degradação do modelo quando dados reais mudam ao longo do tempo', 'Modelo que roda devagar', 'Erro de deploy'],
    correctIndex: 1,
    explanation: 'Model drift acontece quando a distribuição dos dados muda com o tempo, fazendo o modelo perder performance.',
  },
  {
    icon: '🚀', category: 'Futuro', difficulty: 'Médio' as const,
    text: 'O que é AGI (Artificial General Intelligence)?',
    options: ['IA específica para jogos', 'IA com capacidade cognitiva geral equivalente à humana', 'Um tipo de GPU', 'Framework de Machine Learning'],
    correctIndex: 1,
    explanation: 'AGI seria uma IA capaz de realizar qualquer tarefa intelectual humana. Ainda é um objetivo teórico e não foi alcançado.',
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
