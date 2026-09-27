export interface SentenceSeedItem {
  lessonNumber: number;
  type: "transformation" | "translation";
  prompt: string;
  promptJapanese?: string;
  transformationType?: "negative" | "question" | "substitution" | null;
  acceptedAnswers: string[];
  keywordSlots: string[];
  skillTag: string;
  allowedVocabLessonMax: number;
  hint?: string;
  orderIndex: number;
}

export const SENTENCE_DATA: SentenceSeedItem[] = [
  // ==========================================
  // LESSON 1: Self-Introductions & Nationalities
  // ==========================================
  {
    lessonNumber: 1,
    type: "transformation",
    prompt: "Transform this affirmative sentence into its polite negative form:",
    promptJapanese: "私は学生です。",
    transformationType: "negative",
    acceptedAnswers: [
      "私は学生じゃありません。",
      "私は学生じゃありません",
      "わたしはがくせいじゃありません。",
      "わたしはがくせいじゃありません",
      "私は学生ではありません。",
      "私は学生ではありません",
      "わたしはがくせいではありません。",
      "わたしはがくせいではありません",
    ],
    keywordSlots: ["学生", "じゃありません"],
    skillTag: "negative_copula",
    allowedVocabLessonMax: 1,
    hint: "Replace です with じゃありません or ではありません.",
    orderIndex: 1,
  },
  {
    lessonNumber: 1,
    type: "transformation",
    prompt: "Turn this statement into a polite question asking Ken:",
    promptJapanese: "あなたは会社員です。",
    transformationType: "question",
    acceptedAnswers: [
      "あなたは会社員ですか。",
      "あなたは会社員ですか",
      "あなたはかいしゃいんですか。",
      "あなたはかいしゃいんですか",
    ],
    keywordSlots: ["会社員", "ですか"],
    skillTag: "particle_ka",
    allowedVocabLessonMax: 1,
    hint: "Add the question particle か at the end of the sentence.",
    orderIndex: 2,
  },
  {
    lessonNumber: 1,
    type: "transformation",
    prompt: "John is American. State that Maria is also American (using も):",
    promptJapanese: "ジョンさんはアメリカ人です。",
    transformationType: "substitution",
    acceptedAnswers: [
      "マリアさんもアメリカ人です。",
      "マリアさんもアメリカ人です",
      "まりあさんもあめりかじんです。",
      "まりあさんもあめりかじんです",
    ],
    keywordSlots: ["も", "アメリカ人", "です"],
    skillTag: "particle_mo",
    allowedVocabLessonMax: 1,
    hint: "Replace the topic particle は with the inclusive particle も.",
    orderIndex: 3,
  },
  {
    lessonNumber: 1,
    type: "translation",
    prompt: "Translate to Japanese: 'Teacher Tanaka is Japanese.'",
    transformationType: null,
    acceptedAnswers: [
      "田中先生は日本人です。",
      "田中先生は日本人です",
      "たなかせんせいはにほんじんです。",
      "たなかせんせいはにほんじんです",
      "田中さんは日本人です。",
      "田中さんは日本人です",
    ],
    keywordSlots: ["田中", "先生", "は", "日本人", "です"],
    skillTag: "copula_desu",
    allowedVocabLessonMax: 1,
    hint: "Topic: 田中先生 / Predicate: 日本人です.",
    orderIndex: 4,
  },
  {
    lessonNumber: 1,
    type: "translation",
    prompt: "Translate to Japanese: 'Who is that person?'",
    transformationType: null,
    acceptedAnswers: [
      "あの人は誰ですか。",
      "あの人は誰ですか",
      "あのひとはだれですか。",
      "あのひとはだれですか",
    ],
    keywordSlots: ["あの人", "は", "誰", "ですか"],
    skillTag: "particle_ka",
    allowedVocabLessonMax: 1,
    hint: "Use あの人 for 'that person' and 誰 for 'who'.",
    orderIndex: 5,
  },

  // ==========================================
  // LESSON 2: Demonstratives & Belongings
  // (strictly cumulative: vocab 1..2, grammar L2)
  // ==========================================
  {
    lessonNumber: 2,
    type: "transformation",
    prompt: "Rephrase 'これは辞書です。' to specify 'This dictionary is mine (私のです)':",
    promptJapanese: "これは辞書です。",
    transformationType: "substitution",
    acceptedAnswers: [
      "この辞書は私のです。",
      "この辞書は私のです",
      "このじしょはわたしのです。",
      "このじしょはわたしのです",
    ],
    keywordSlots: ["この", "辞書", "は", "私", "の", "です"],
    skillTag: "determiners_ko_so_a",
    allowedVocabLessonMax: 2,
    hint: "Change the pronoun これ to the determiner この followed by the noun 辞書.",
    orderIndex: 1,
  },
  {
    lessonNumber: 2,
    type: "translation",
    prompt: "Translate to Japanese: 'What is that (near you)?'",
    transformationType: null,
    acceptedAnswers: [
      "それは何ですか。",
      "それは何ですか",
      "それはなんですか。",
      "それはなんですか",
    ],
    keywordSlots: ["それ", "は", "何", "ですか"],
    skillTag: "demonstratives_ko_so_a",
    allowedVocabLessonMax: 2,
    hint: "Use それ for objects near the listener, and 何 (なん) for 'what'.",
    orderIndex: 2,
  },
  {
    lessonNumber: 2,
    type: "translation",
    prompt: "Translate to Japanese: 'That car over there is the teacher's car.'",
    transformationType: null,
    acceptedAnswers: [
      "あの車は先生の車です。",
      "あの車は先生の車です",
      "あのくるまはせんせいのくるまです。",
      "あのくるまはせんせいのくるまです",
      "あの車は先生のです。",
      "あのくるまはせんせいのです。",
    ],
    keywordSlots: ["あの", "車", "は", "先生", "の", "車", "です"],
    skillTag: "particle_no",
    allowedVocabLessonMax: 2,
    hint: "Distal determiner: あの / Possession: 先生の車.",
    orderIndex: 3,
  },
  {
    lessonNumber: 2,
    type: "transformation",
    prompt: "Make this sentence negative (A is not B):",
    promptJapanese: "これは本です。",
    transformationType: "negative",
    acceptedAnswers: [
      "これは本じゃありません。",
      "これは本じゃありません",
      "これはほんじゃありません。",
      "これはほんじゃありません",
      "これは本ではありません。",
      "これは本ではありません",
    ],
    keywordSlots: ["これ", "は", "本", "じゃありません"],
    skillTag: "negative_copula",
    allowedVocabLessonMax: 2,
    hint: "Change です to じゃありません.",
    orderIndex: 4,
  },
];
