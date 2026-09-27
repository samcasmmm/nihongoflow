export interface GrammarSeedItem {
  lessonNumber: number;
  patternKey: string;
  title: string;
  japaneseTitle: string;
  formula: string;
  explanation: string;
  skillTag: string;
  examples: Array<{
    japanese: string;
    reading: string;
    romaji: string;
    english: string;
  }>;
  commonMistakes: string;
  orderIndex: number;
}

export const GRAMMAR_DATA: GrammarSeedItem[] = [
  // ==========================================
  // LESSON 1: Self-Introductions & Nationalities
  // ==========================================
  {
    lessonNumber: 1,
    patternKey: 'l1_n1_wa_n2_desu',
    title: '[Noun 1] は [Noun 2] です (A is B)',
    japaneseTitle: '〜は〜です',
    formula: 'N1 は N2 です',
    explanation:
      "The particle は (pronounced 'wa') marks N1 as the topic of the sentence. です (pronounced 'desu') serves as the polite copula asserting that N1 is N2.",
    skillTag: 'copula_desu',
    examples: [
      {
        japanese: '私は学生です。',
        reading: 'わたしはがくせいです。',
        romaji: 'Watashi wa gakusei desu.',
        english: 'I am a student.',
      },
      {
        japanese: '田中先生は日本人です。',
        reading: 'たなかせんせいはにほんじんです。',
        romaji: 'Tanaka-sensei wa nihonjin desu.',
        english: 'Teacher Tanaka is Japanese.',
      },
      {
        japanese: 'マリアさんは会社員です。',
        reading: 'まりあさんはかいしゃいんです。',
        romaji: 'Maria-san wa kaishain desu.',
        english: 'Maria is a company employee.',
      },
    ],
    commonMistakes:
      "Do not write 'わ' for the particle; topic marker 'wa' is always written with the hiragana 'は'. Also, do not pronounce the 'u' in 'desu' strongly; it is typically devoiced as 'dess'.",
    orderIndex: 1,
  },
  {
    lessonNumber: 1,
    patternKey: 'l1_n1_wa_n2_ja_arimasen',
    title: '[Noun 1] は [Noun 2] じゃありません / ではありません (A is not B)',
    japaneseTitle: '〜は〜じゃありません',
    formula: 'N1 は N2 じゃありません / ではありません',
    explanation:
      'じゃありません is the polite negative form of です used in spoken conversation. ではありません is the formal written equivalent.',
    skillTag: 'negative_copula',
    examples: [
      {
        japanese: '私は医者じゃありません。',
        reading: 'わたしはいしゃじゃありません。',
        romaji: 'Watashi wa isha ja arimasen.',
        english: 'I am not a medical doctor.',
      },
      {
        japanese: 'ジョンさんは日本人ではありません。',
        reading: 'じょんさんはにほんじんではありません。',
        romaji: 'John-san wa nihonjin dewa arimasen.',
        english: 'John is not Japanese.',
      },
    ],
    commonMistakes:
      "Avoid mixing plain 'ない' into polite sentences before mastering the standard polite forms. In 'ではありません', the 'は' is also pronounced 'wa'.",
    orderIndex: 2,
  },
  {
    lessonNumber: 1,
    patternKey: 'l1_ka_question',
    title: '[Sentence] か (Polite Question Marker)',
    japaneseTitle: '〜か（疑問文）',
    formula: 'Sentence + か？',
    explanation:
      'The sentence-ending particle か turns any statement into a polite yes/no or information question with rising intonation. Word order does not invert like in English.',
    skillTag: 'particle_ka',
    examples: [
      {
        japanese: 'あなたは学生ですか。',
        reading: 'あなたはがくせいですか。',
        romaji: 'Anata wa gakusei desu ka.',
        english: 'Are you a student?',
      },
      {
        japanese: 'あの人は先生ですか。',
        reading: 'あのひとはせんせいですか。',
        romaji: 'Ano hito wa sensei desu ka.',
        english: 'Is that person a teacher?',
      },
    ],
    commonMistakes:
      "Japanese traditionally does not require a question mark '?' because 'か' already serves that exact function, though '?' is common in modern casual media.",
    orderIndex: 3,
  },
  {
    lessonNumber: 1,
    patternKey: 'l1_mo_particle',
    title: '[Noun] も (Also / Too)',
    japaneseTitle: '〜も（同類）',
    formula: 'N も N2 です',
    explanation:
      'The particle も replaces は to indicate that what was stated about a previous topic also applies to this noun.',
    skillTag: 'particle_mo',
    examples: [
      {
        japanese: '私も学生です。',
        reading: 'わたしもがくせいです。',
        romaji: 'Watashi mo gakusei desu.',
        english: 'I am also a student.',
      },
      {
        japanese: 'アンさんもアメリカ人です。',
        reading: 'あんさんもあめりかじんです。',
        romaji: 'Ann-san mo amerikajin desu.',
        english: 'Ann is also American.',
      },
    ],
    commonMistakes:
      "Never put 'は' and 'も' together ('*はも' or '*もは'); the particle 'も' completely replaces the topic particle 'は'.",
    orderIndex: 4,
  },
  {
    lessonNumber: 1,
    patternKey: 'l1_no_particle',
    title: '[Noun 1] の [Noun 2] (Affiliation / Possession)',
    japaneseTitle: '〜の〜（修飾・所属）',
    formula: 'N1 の N2',
    explanation:
      'The particle の links two nouns together, where N1 modifies, specifies, or possesses N2 (e.g. affiliation, origin, or category).',
    skillTag: 'particle_no',
    examples: [
      {
        japanese: '田中さんは東京大学の学生です。',
        reading: 'たなかさんはとうきょうだいがくのがくせいです。',
        romaji: 'Tanaka-san wa Toukyou daigaku no gakusei desu.',
        english: 'Tanaka is a student of Tokyo University.',
      },
      {
        japanese: 'ケンさんは日本語の先生です。',
        reading: 'けんさんはにほんごのせんせいです。',
        romaji: 'Ken-san wa nihongo no sensei desu.',
        english: 'Ken is a Japanese language teacher.',
      },
    ],
    commonMistakes:
      "Remember that modifier order in Japanese is strictly 'Qualifier の Main Noun', the opposite of 'Student of Tokyo University'.",
    orderIndex: 5,
  },

  // ==========================================
  // LESSON 2: Demonstratives & Things
  // ==========================================
  {
    lessonNumber: 2,
    patternKey: 'l2_kore_sore_are',
    title: 'これ / それ / あれ (Thing Demonstratives)',
    japaneseTitle: 'これ・それ・あれ',
    formula: 'これ / それ / あれ は N です',
    explanation:
      'Demonstrative pronouns pointing to objects. これ = near speaker, それ = near listener, あれ = distant from both.',
    skillTag: 'demonstratives_ko_so_a',
    examples: [
      {
        japanese: 'これは辞書です。',
        reading: 'これはじしょです。',
        romaji: 'Kore wa jisho desu.',
        english: 'This is a dictionary.',
      },
      {
        japanese: 'それは何ですか。',
        reading: 'それはなんですか。',
        romaji: 'Sore wa nan desu ka.',
        english: 'What is that?',
      },
      {
        japanese: 'あれは私の傘です。',
        reading: 'あれはわたしのかさです。',
        romaji: 'Are wa watashi no kasa desu.',
        english: 'That over there is my umbrella.',
      },
    ],
    commonMistakes:
      'これ/それ/あれ stand on their own as nouns and cannot directly precede another noun (use この/その/あの for that).',
    orderIndex: 1,
  },
  {
    lessonNumber: 2,
    patternKey: 'l2_kono_sono_ano',
    title: 'この / その / あの [Noun] (Demonstrative Determiners)',
    japaneseTitle: 'この・その・あの＋名詞',
    formula: 'この / その / あの + N は 〜 です',
    explanation:
      'Determiners that directly modify a following noun. この本 = this book, その傘 = that umbrella, あの人 = that person over there.',
    skillTag: 'determiners_ko_so_a',
    examples: [
      {
        japanese: 'この本はいくらですか。',
        reading: 'このほんはいくらですか。',
        romaji: 'Kono hon wa ikura desu ka.',
        english: 'How much is this book?',
      },
      {
        japanese: 'あの車は先生の車です。',
        reading: 'あのくるまはせんせいのくるまです。',
        romaji: 'Ano kuruma wa sensei no kuruma desu.',
        english: "That car over there is the teacher's car.",
      },
    ],
    commonMistakes: "Never use 'この' without an attached noun; saying '*このは本です' is grammatically invalid.",
    orderIndex: 2,
  },

  // ==========================================
  // LESSON 3: Locations & Facilities
  // ==========================================
  {
    lessonNumber: 3,
    patternKey: 'l3_koko_soko_asoko',
    title: 'ここ / そこ / あそこ / どこ (Place Demonstratives)',
    japaneseTitle: 'ここ・そこ・あそこ・どこ',
    formula: 'N は [Place] です',
    explanation:
      'Demonstratives for locations. ここ = here (near speaker), そこ = there (near listener), あそこ = over there (distant from both), どこ = where.',
    skillTag: 'place_demonstratives',
    examples: [
      {
        japanese: '教室はあそこです。',
        reading: 'きょうしつはあそこです。',
        romaji: 'Kyoushitsu wa asoko desu.',
        english: 'The classroom is over there.',
      },
      {
        japanese: '駅はどこですか。',
        reading: 'えきはどこですか。',
        romaji: 'Eki wa doko desu ka.',
        english: 'Where is the train station?',
      },
    ],
    commonMistakes: "Do not confuse 'ここ' (place: here) with 'これ' (thing: this item).",
    orderIndex: 1,
  },

  // ==========================================
  // LESSON 4: Time & Polite Verbs
  // ==========================================
  {
    lessonNumber: 4,
    patternKey: 'l4_masu_forms',
    title: '〜ます / 〜ません / 〜ました / 〜ませんでした (Polite Verb Tenses)',
    japaneseTitle: '動詞の丁寧語（ます形）',
    formula: 'Verb-stem + ます / ません / ました / ませんでした',
    explanation:
      'Polite verb conjugations: 〜ます (non-past affirmative), 〜ません (non-past negative), 〜ました (past affirmative), 〜ませんでした (past negative).',
    skillTag: 'masu_verb_conjugation',
    examples: [
      {
        japanese: '毎朝6時に起きます。',
        reading: 'まいあさろくじにおきます。',
        romaji: 'Maiasa roku-ji ni okimasu.',
        english: 'I wake up at 6:00 every morning.',
      },
      {
        japanese: '昨日は勉強しませんでした。',
        reading: 'きのうはべんきょうしませんでした。',
        romaji: 'Kinou wa benkyou shimasen deshita.',
        english: 'I did not study yesterday.',
      },
    ],
    commonMistakes: "Past negative requires 'ませんでした', not '*ませんでしたでした' or other duplicate past markers.",
    orderIndex: 1,
  },

  // ==========================================
  // LESSON 5: Transit & Motion Verbs
  // ==========================================
  {
    lessonNumber: 5,
    patternKey: 'l5_motion_e',
    title: '[Place] へ 行きます / 来ます / 帰ります (Direction Particle へ)',
    japaneseTitle: '〜へ 行きます・来ます・帰ります',
    formula: '[Place] へ [Motion Verb]',
    explanation:
      "The particle へ (pronounced 'e') marks the destination or direction toward which a motion verb moves.",
    skillTag: 'particle_e_direction',
    examples: [
      {
        japanese: '明日東京へ行きます。',
        reading: 'あしたとうきょうへいきます。',
        romaji: 'Ashita Toukyou e ikimasu.',
        english: 'I will go to Tokyo tomorrow.',
      },
      {
        japanese: '7時にうちへ帰ります。',
        reading: 'しちじにうちへかえります。',
        romaji: 'Shichi-ji ni uchi e kaerimasu.',
        english: 'I will return home at 7:00.',
      },
    ],
    commonMistakes: "Write 'へ' for the direction particle, but pronounce it 'e' (never 'he').",
    orderIndex: 1,
  },
];
