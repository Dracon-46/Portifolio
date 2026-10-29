/**
 * Everything the page says lives here, so updating the portfolio is an edit
 * to data, not to components. Product facts come from each repository's README.
 */

export const person = {
  name: 'Arthur Gaspare Camzano',
  email: 'arthurgaspare@gmail.com',
  phone: '(15) 99151-3832',
  phoneHref: 'tel:+5515991513832',
  socials: [
    { label: 'GitHub', handle: 'Dracon-46', href: 'https://github.com/Dracon-46' },
    { label: 'LinkedIn', handle: 'arthur-gaspare-camzano', href: 'https://www.linkedin.com/in/arthur-gaspare-camzano-60b513248/' },
    { label: 'Instagram', handle: '@gaspare_camzano', href: 'https://www.instagram.com/gaspare_camzano/' },
    { label: 'YouTube', handle: '@Dracon-46', href: 'https://www.youtube.com/@Dracon-46' },
  ],
};

export const nav = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'falkyria', label: 'Falkyria' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'metodo', label: 'Método' },
  { id: 'contato', label: 'Contato' },
];

export const about = {
  manifesto:
    'Sou desenvolvedor full stack e gosto de problemas que pedem o sistema inteiro: a regra de negócio, o banco, a interface, o deploy e a documentação que explica por que cada decisão foi tomada.',
  paragraphs: [
    'Já passei por web, mobile, IoT e dados: de um simulador de impacto de asteroides com dados da NASA a jogos clássicos refeitos em várias linguagens. Aprendo do jeito que mais funciona para mim: construindo.',
    'Hoje divido o tempo entre a FATEC e a Falkyria, onde transformo ideias em produtos completos. Sou apaixonado por inteligência artificial, por jogos e por software que respeita quem usa.',
  ],
  facts: [
    { label: 'Foco', value: 'Full stack, do banco ao pixel' },
    { label: 'Interesses', value: 'IA, jogos e dados públicos' },
    { label: 'Linguagens', value: 'TypeScript, Python, PHP, C#, C++, Java' },
    { label: 'Marca', value: 'Falkyria' },
  ],
  quote: {
    text: 'Aquele que não prevê o futuro distante expõe-se a desgraças próximas.',
    author: 'Sun Tzu',
  },
};

export const falkyria = {
  intro:
    'Falkyria é a marca sob a qual eu crio meus produtos: software independente, feito no Brasil, com testes, documentação de verdade e cada decisão de arquitetura registrada.',
  principles: [
    { title: 'Privacidade por padrão', text: 'Quando dá para rodar no seu computador, roda no seu computador.' },
    { title: 'Regras explícitas', text: 'Motores puros e testados, decisões em ADRs, nada escondido em mágica.' },
    { title: 'Prova antes da conclusão', text: 'Todo número aponta para a fonte; o sistema mostra evidências, não acusações.' },
  ],
};

export type Product = {
  id: string;
  name: string;
  kicker: string;
  tagline: string;
  description: string;
  highlights: { title: string; text: string }[];
  stack: string[];
  status: string;
  links: { label: string; href: string }[];
  /** CSS color for the chapter accent; the scene uses the same hue. */
  accent: string;
};

export const products: Product[] = [
  {
    id: 'nicx',
    name: 'Nicx',
    kicker: 'Inteligência artificial',
    tagline: 'A IA da Falkyria, morando no seu computador.',
    description:
      'Um assistente que conversa em português, por texto e por voz, e roda inteiro na sua máquina. Privado, sem custo por uso e sem nuvem.',
    highlights: [
      { title: 'Fala e escuta', text: 'Reconhecimento de fala e voz brasileira locais; no modo conversa, é só falar.' },
      { title: 'Memória', text: 'Guarda fatos sobre você e os documentos que você indexar, e usa tudo como contexto.' },
      { title: 'Agentes', text: 'Briefing diário, pesquisa a fundo com fontes e monitoramento que avisa quando algo muda.' },
    ],
    stack: ['App Windows', 'CLI', 'IA local', 'React 19', 'Vite', 'Tailwind 4'],
    status: 'Instalador para Windows em breve',
    links: [{ label: 'Conhecer o Nicx', href: 'https://dracon-46.github.io/nicx/' }],
    accent: '#46e3f5',
  },
  {
    id: 'ascend',
    name: 'Ascend',
    kicker: 'Gamificação',
    tagline: 'O RPG da sua vida real.',
    description:
      'Rotina, estudos, trabalho, treinos e hábitos viram progressão de longo prazo: níveis com dificuldade crescente, atributos, missões, moedas, loja, conquistas e temporadas.',
    highlights: [
      { title: 'Motor próprio', text: 'Curva de XP, recompensas, penalidades e economia num pacote puro e testado.' },
      { title: 'Cinco temas', text: 'Medieval, Vampiros, Anjos, Sistema e Personalizado.' },
      { title: 'Web e Android', text: 'PWA e APK via Capacitor; 151 testes automatizados e 7 de ponta a ponta.' },
    ],
    stack: ['React 19', 'TypeScript', 'Fastify 5', 'Drizzle', 'PostgreSQL 16', 'Capacitor', 'Playwright'],
    status: 'Em produção',
    links: [
      { label: 'Site do Ascend', href: 'https://dracon-46.github.io/Ascend/' },
    ],
    accent: '#f5b733',
  },
  {
    id: 'aethertable',
    name: 'AetherTable',
    kicker: 'Mesa virtual',
    tagline: 'Uma mesa sandbox multiformato para Magic: The Gathering.',
    description:
      'Não existe motor de regras, de propósito: o sistema move peças, sincroniza estado e esconde informação. Quem aplica as regras é a mesa, como numa partida de verdade.',
    highlights: [
      { title: 'Estado em tempo real', text: 'Cada partida vive em memória no Colyseus; o cliente só envia intenções validadas.' },
      { title: 'Acesso seguro', text: 'Entrada na mesa por um token assinado, de uso único e vinculado à sala.' },
      { title: 'Sorte auditável', text: 'Aleatoriedade centralizada num único serviço; o embaralhamento não é previsível.' },
    ],
    stack: ['Next.js', 'Konva', 'NestJS', 'Prisma', 'PostgreSQL', 'Colyseus', 'Turborepo'],
    status: 'Em desenvolvimento',
    links: [{ label: 'Jogar no AetherTable', href: 'https://aether-table-frontend.vercel.app/' }],
    accent: '#b79cff',
  },
  {
    id: 'lumen',
    name: 'Lumen',
    kicker: 'Dados públicos',
    tagline: 'Luz sobre contratações e despesas públicas do Brasil.',
    description:
      'Coleta, normaliza e analisa dados de entes federativos para sinalizar o que merece atenção de órgãos de controle, imprensa e sociedade. Publica indícios, nunca conclusões.',
    highlights: [
      { title: 'Fontes oficiais', text: 'PNCP, IBGE e SICONFI, com painéis de contratações e de conformidade com a LRF.' },
      { title: 'Eleições', text: 'Resultados oficiais do TSE de 1933 até hoje, inclusive ao vivo na apuração.' },
      { title: 'Prova de cada número', text: 'Cada dado carrega o SHA-256 da cópia baixada da fonte.' },
    ],
    stack: ['Python', 'Next.js', 'GitHub Actions', 'Supabase', 'Vercel'],
    status: 'Em desenvolvimento',
    links: [
      { label: 'Código', href: 'https://github.com/Dracon-46/FalkyriaLumen' },
      { label: 'Documentação', href: 'https://dracon-46.github.io/FalkyriaLumen/' },
    ],
    accent: '#7ee0a1',
  },
];

export const projects = [
  {
    name: 'Meteor Madness',
    year: '2025',
    description:
      'Rastreamento de asteroides próximos da Terra e simulação de impacto: energia em megatons, zonas de destruição, estimativa de vítimas com dados populacionais e opções de mitigação.',
    tags: ['JavaScript', 'NASA NeoWs', 'WorldPop', 'OpenStreetMap'],
    href: 'https://github.com/Dracon-46/MedJed_MeteorMadness',
  },
  {
    name: 'Games',
    year: '2025',
    description: 'Snake e Tetris recriados em Java, Python e JavaScript para treinar lógica e explorar linguagens.',
    tags: ['Java', 'Python', 'Pygame', 'JavaScript'],
    href: 'https://github.com/Dracon-46/Games',
  },
];

export const arsenal = [
  { group: 'Linguagens', items: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'C#', 'C++', 'Java', 'Dart', 'GDScript', 'SQL'] },
  { group: 'Front-end', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Flutter', 'React Native', 'Konva'] },
  { group: 'Back-end', items: ['Node.js', 'Fastify', 'NestJS', 'Express', 'Prisma', 'Drizzle', 'Colyseus'] },
  { group: 'Dados', items: ['PostgreSQL', 'SQL Server', 'MySQL', 'Supabase', 'Firebase'] },
  { group: 'IoT', items: ['ESP32', 'PlatformIO', 'MQTT', 'Node-RED', 'Wokwi'] },
  { group: 'Qualidade e DevOps', items: ['Vitest', 'Playwright', 'GitHub Actions', 'Docker', 'Git Flow', 'ADRs'] },
];

/** How the work gets done, as practised across the Falkyria repositories. */
export const method = [
  {
    title: 'Documentar antes de codar',
    text: 'Visão, requisitos, casos de uso e modelo de dados escritos primeiro. Decisões de arquitetura viram ADRs, com o motivo registrado.',
    evidence: 'Lumen: 13 documentos e ADRs · AetherTable: PRD, SAD e especificações',
  },
  {
    title: 'Regra de negócio isolada e testada',
    text: 'O núcleo não conhece banco nem interface. Motor puro, testes de unidade, integração com banco real e ponta a ponta no navegador.',
    evidence: 'Ascend: motor @rpg/engine, 151 testes + 7 E2E com Playwright',
  },
  {
    title: 'CI que não deixa passar',
    text: 'Lint com tipos e zero aviso, typecheck, testes, build, E2E e imagens Docker. Git Flow, Conventional Commits e versões com tag.',
    evidence: 'AetherTable: CI + CodeQL · Ascend: deploy automático a cada release',
  },
  {
    title: 'Custo zero para rodar',
    text: 'Arquitetura pensada para camadas gratuitas: GitHub Actions como servidor de carga, armazenamento de objetos e hospedagem estática.',
    evidence: 'Lumen: carga retomável no Actions, feeds no Supabase, portal na Vercel',
  },
];
