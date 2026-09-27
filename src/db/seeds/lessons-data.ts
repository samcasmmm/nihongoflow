export interface LessonSeedItem {
  lessonNumber: number;
  title: string;
  japaneseTitle: string;
  summary: string;
  grammarTopic: string;
  jlptLevel: string;
}

export const LESSON_DATA: LessonSeedItem[] = [
  {
    lessonNumber: 1,
    title: "Identity & Introductions",
    japaneseTitle: "自己紹介と身元",
    summary: "Learn to introduce yourself, state your profession and nationality, and make polite affirmative and negative declarations.",
    grammarTopic: "Basic Copula (~は~です), Negative Form (~じゃありません), Question Marker (か), Also Particle (も)",
    jlptLevel: "N5",
  },
  {
    lessonNumber: 2,
    title: "Objects & Demonstratives",
    japaneseTitle: "物の名前と指示代名詞",
    summary: "Identify everyday items, clarify possession with the possessive particle 'の', and ask what unfamiliar objects are.",
    grammarTopic: "Demonstratives (これ / それ / あれ), Descriptive Demonstratives (この / その / あの), Possessive Particle (の)",
    jlptLevel: "N5",
  },
  {
    lessonNumber: 3,
    title: "Places & Spatial Inquiry",
    japaneseTitle: "場所と方向の表現",
    summary: "Inquire about rooms, facilities, departments, and polite directional references in offices, schools, and stores.",
    grammarTopic: "Location Demonstratives (ここ / そこ / あそこ / どこ), Polite Direction (こちら / そちら / あちら), Price Inquiry (いくら)",
    jlptLevel: "N5",
  },
  {
    lessonNumber: 4,
    title: "Time, Schedules & Verbs",
    japaneseTitle: "時間と日課の動詞",
    summary: "Read Japanese clocks, describe working hours, and conjugate regular verbs into polite present and past tenses.",
    grammarTopic: "Time & Minutes (~時~分), Time Range (~から~まで), Polite Verb Tenses (~ます / ~ません / ~ました)",
    jlptLevel: "N5",
  },
  {
    lessonNumber: 5,
    title: "Movement & Destinations",
    japaneseTitle: "移動と交通手段",
    summary: "Express travel to cities, offices, and home using destination particles, transportation means, and calendar dates.",
    grammarTopic: "Movement Verbs (行きます / 来ます / 帰ります), Destination Particle (へ), Means of Travel (で), Accompaniment (と)",
    jlptLevel: "N5",
  },
];
