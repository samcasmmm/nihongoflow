"use client";

import React, { useState, useTransition, useMemo } from "react";
import { Lesson, VocabItem, KanaChar, GrammarPattern, SentenceItem } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Layers,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Code2,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialLessons: Lesson[];
  initialVocab: VocabItem[];
  initialKana: KanaChar[];
  initialGrammar: GrammarPattern[];
  initialSentences: SentenceItem[];
}

type TabType = "lessons" | "vocab" | "kana" | "grammar" | "sentences";

interface StudioItemData {
  id?: string;
  lessonNumber?: number;
  orderIndex?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  word?: string;
  reading?: string;
  romaji?: string;
  meaning?: string;
  partOfSpeech?: string;
  imageUrl?: string | null;
  exampleSentence?: string | null;
  exampleReading?: string | null;
  exampleMeaning?: string | null;
  character?: string;
  script?: string;
  category?: string;
  rowGroup?: string;
  mnemonic?: string | null;
  exampleWord?: string | null;
  japaneseTitle?: string;
  formula?: string;
  structureNotes?: string | null;
  patternKey?: string;
  explanation?: string;
  commonMistakes?: string;
  jlptLevel?: string;
  grammarTopic?: string;
  summary?: string;
  examples?: Array<{ japanese: string; reading: string; romaji?: string; english: string }> | null;
  skillTag?: string;
  type?: string;
  prompt?: string;
  promptJapanese?: string | null;
  transformationType?: string | null;
  acceptedAnswers?: string[];
  keywordSlots?: string[];
  allowedVocabLessonMax?: number;
  hint?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export function ContentStudio({
  initialLessons,
  initialVocab,
  initialKana,
  initialGrammar,
  initialSentences,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("vocab");
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [vocab, setVocab] = useState<VocabItem[]>(initialVocab);
  const [kana, setKana] = useState<KanaChar[]>(initialKana);
  const [grammar, setGrammar] = useState<GrammarPattern[]>(initialGrammar);
  const [sentences, setSentences] = useState<SentenceItem[]>(initialSentences);

  const [selectedLessonFilter, setSelectedLessonFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modal / Editing state
  const [editingItem, setEditingItem] = useState<{
    type: TabType;
    isNew: boolean;
    data: StudioItemData;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered Vocab
  const filteredVocab = useMemo(() => {
    return vocab.filter((v) => {
      if (selectedLessonFilter !== "all" && v.lessonNumber !== selectedLessonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.word.includes(q) ||
          v.reading.includes(q) ||
          v.meaning.toLowerCase().includes(q) ||
          v.romaji.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vocab, selectedLessonFilter, searchQuery]);

  // Filtered Kana
  const filteredKana = useMemo(() => {
    return kana.filter((k) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          k.character.includes(q) ||
          k.romaji.toLowerCase().includes(q) ||
          (k.mnemonic && k.mnemonic.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [kana, searchQuery]);

  // Filtered Grammar
  const filteredGrammar = useMemo(() => {
    return grammar.filter((g) => {
      if (selectedLessonFilter !== "all" && g.lessonNumber !== selectedLessonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.title.toLowerCase().includes(q) ||
          g.japaneseTitle.includes(q) ||
          g.formula.toLowerCase().includes(q) ||
          g.skillTag.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [grammar, selectedLessonFilter, searchQuery]);

  // Filtered Sentences
  const filteredSentences = useMemo(() => {
    return sentences.filter((s) => {
      if (selectedLessonFilter !== "all" && s.lessonNumber !== selectedLessonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.prompt.toLowerCase().includes(q) ||
          (s.promptJapanese && s.promptJapanese.includes(q)) ||
          s.skillTag.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sentences, selectedLessonFilter, searchQuery]);

  // Save Item (POST or PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { type, isNew, data } = editingItem;
    const endpoint = `/api/admin/${type}`;
    const method = isNew ? "POST" : "PUT";

    startTransition(async () => {
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Failed to save item");
          return;
        }

        const resData = await res.json();

        // Update local state
        if (type === "lessons") {
          const saved = resData.data.lesson;
          setLessons((prev) =>
            isNew ? [...prev, saved] : prev.map((l) => (l.id === saved.id ? saved : l))
          );
        } else if (type === "vocab") {
          const saved = resData.data.vocab;
          setVocab((prev) =>
            isNew ? [...prev, saved] : prev.map((v) => (v.id === saved.id ? saved : v))
          );
        } else if (type === "kana") {
          const saved = resData.data.kana;
          setKana((prev) =>
            isNew ? [...prev, saved] : prev.map((k) => (k.id === saved.id ? saved : k))
          );
        } else if (type === "grammar") {
          const saved = resData.data.grammar;
          setGrammar((prev) =>
            isNew ? [...prev, saved] : prev.map((g) => (g.id === saved.id ? saved : g))
          );
        } else if (type === "sentences") {
          const saved = resData.data.sentence;
          setSentences((prev) =>
            isNew ? [...prev, saved] : prev.map((s) => (s.id === saved.id ? saved : s))
          );
        }

        showToast(`${isNew ? "Created" : "Updated"} item in database! 🚀`);
        setEditingItem(null);
      } catch (err) {
        console.error("Save error:", err);
      }
    });
  };

  // Delete Item
  const handleDelete = async (type: TabType, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/${type}?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          alert("Failed to delete item");
          return;
        }

        if (type === "lessons") setLessons((prev) => prev.filter((l) => l.id !== id));
        else if (type === "vocab") setVocab((prev) => prev.filter((v) => v.id !== id));
        else if (type === "kana") setKana((prev) => prev.filter((k) => k.id !== id));
        else if (type === "grammar") setGrammar((prev) => prev.filter((g) => g.id !== id));
        else if (type === "sentences") setSentences((prev) => prev.filter((s) => s.id !== id));

        showToast("Item deleted from database 🗑️");
      } catch (err) {
        console.error("Delete error:", err);
      }
    });
  };

  // Reseed Curriculum
  const handleReseed = async () => {
    if (!confirm("Reset database curriculum to starter seed data? Custom edits might be replaced.")) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/reseed", { method: "POST" });
        if (res.ok) {
          showToast("Curriculum successfully restored to defaults! ✨");
          window.location.reload();
        }
      } catch (err) {
        console.error("Reseed error:", err);
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce bg-[#1a1d26] border border-[#58cc02]/40 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-[#58cc02]/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#58cc02]" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Content Management Studio</span>
              <span className="text-xs font-mono font-normal chip text-[#ff9600] border-[#ff9600]/30 bg-[#ff9600]/10">
                Live Postgres CMS
              </span>
            </h1>
          </div>
          <p className="text-xs text-[#9a9aa8]">
            Full website CMS: edit vocabulary, grammar formulas, lessons, kana, and sentence drills in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="chunkyOutline"
            size="sm"
            onClick={handleReseed}
            className="text-xs border-white/15"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#ff9600]" />
            Restore Seeds
          </Button>
        </div>
      </div>

      {/* Workspaces Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("vocab")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "vocab"
                ? "bg-[#1cb0f6] text-white shadow-lg shadow-[#1cb0f6]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Vocabulary ({vocab.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("grammar")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "grammar"
                ? "bg-[#ce82ff] text-white shadow-lg shadow-[#ce82ff]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Grammar ({grammar.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sentences")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "sentences"
                ? "bg-[#58cc02] text-white shadow-lg shadow-[#58cc02]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Sentence Bank ({sentences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("kana")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "kana"
                ? "bg-[#ff9600] text-white shadow-lg shadow-[#ff9600]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kana Syllabary ({kana.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "lessons"
                ? "bg-white text-[#13151b] shadow-lg"
                : "text-[#9a9aa8] hover:text-white bg-white/5"
            }`}
          >
            <span>Lessons ({lessons.length})</span>
          </button>
        </div>

        {/* Add New Item Button */}
        <Button
          variant="chunky"
          size="sm"
          onClick={() => {
            if (activeTab === "vocab") {
              setEditingItem({
                type: "vocab",
                isNew: true,
                data: {
                  lessonNumber: selectedLessonFilter === "all" ? 1 : selectedLessonFilter,
                  word: "",
                  reading: "",
                  romaji: "",
                  meaning: "",
                  partOfSpeech: "noun",
                  imageUrl: "📖",
                  exampleSentence: "",
                  exampleReading: "",
                  exampleMeaning: "",
                  orderIndex: vocab.length + 1,
                },
              });
            } else if (activeTab === "grammar") {
              setEditingItem({
                type: "grammar",
                isNew: true,
                data: {
                  lessonNumber: selectedLessonFilter === "all" ? 1 : selectedLessonFilter,
                  patternKey: `l${selectedLessonFilter}_pattern_${grammar.length + 1}`,
                  title: "",
                  japaneseTitle: "",
                  formula: "",
                  explanation: "",
                  skillTag: "grammar_topic",
                  examples: [
                    { japanese: "", reading: "", romaji: "", english: "" },
                    { japanese: "", reading: "", romaji: "", english: "" },
                  ],
                  commonMistakes: "",
                  orderIndex: grammar.length + 1,
                },
              });
            } else if (activeTab === "sentences") {
              setEditingItem({
                type: "sentences",
                isNew: true,
                data: {
                  lessonNumber: selectedLessonFilter === "all" ? 1 : selectedLessonFilter,
                  type: "transformation",
                  prompt: "",
                  promptJapanese: "",
                  transformationType: "negative",
                  acceptedAnswers: [""],
                  keywordSlots: [""],
                  skillTag: "grammar_topic",
                  allowedVocabLessonMax: selectedLessonFilter === "all" ? 1 : selectedLessonFilter,
                  hint: "",
                  orderIndex: sentences.length + 1,
                },
              });
            } else if (activeTab === "lessons") {
              setEditingItem({
                type: "lessons",
                isNew: true,
                data: {
                  lessonNumber: lessons.length + 1,
                  title: "",
                  japaneseTitle: "",
                  summary: "",
                  grammarTopic: "",
                  jlptLevel: "N5",
                },
              });
            }
          }}
          className="bg-[#58cc02] hover:bg-[#46a302] border-[#388202]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add New {activeTab === "vocab" ? "Word" : activeTab === "grammar" ? "Pattern" : activeTab === "sentences" ? "Drill" : "Item"}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181a24] p-3 rounded-2xl border border-white/5">
        {activeTab !== "kana" && activeTab !== "lessons" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#9a9aa8] mr-1 font-mono">Filter Lesson:</span>
            <button
              onClick={() => setSelectedLessonFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                selectedLessonFilter === "all"
                  ? "bg-white text-[#13151b]"
                  : "text-[#9a9aa8] hover:text-white bg-white/5"
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((lNum) => (
              <button
                key={lNum}
                onClick={() => setSelectedLessonFilter(lNum)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  selectedLessonFilter === lNum
                    ? "bg-[#1cb0f6] text-white"
                    : "text-[#9a9aa8] hover:text-white bg-white/5"
                }`}
              >
                L{lNum}
              </button>
            ))}
          </div>
        )}

        <div className="relative w-full sm:w-64 ml-auto">
          <Search className="w-4 h-4 text-[#9a9aa8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11131a] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#9a9aa8]/60 focus:outline-none focus:border-[#1cb0f6]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VOCABULARY WORKSPACE                                                   */}
      {/* ========================================================================= */}
      {activeTab === "vocab" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((item) => (
              <div
                key={item.id}
                className="bento p-5 space-y-3 flex flex-col justify-between group hover:border-[#1cb0f6]/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 text-[11px] font-mono">
                      Lesson {item.lessonNumber} • {item.partOfSpeech}
                    </span>
                    <span className="text-xl">{item.imageUrl || "📖"}</span>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-white font-sans flex items-baseline gap-2">
                      <span>{item.word}</span>
                      <span className="text-xs text-[#9a9aa8] font-mono">
                        ({item.reading})
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#1cb0f6]">
                      /{item.romaji}/
                    </div>
                    <div className="text-sm font-semibold text-[#58cc02] mt-1">
                      {item.meaning}
                    </div>
                  </div>

                  <div className="bg-[#11131a] p-2.5 rounded-xl border border-white/5 space-y-0.5 text-xs">
                    <div className="text-[#e4e4e9] font-medium">{item.exampleSentence}</div>
                    <div className="text-[11px] text-[#9a9aa8] italic">{item.exampleMeaning}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() =>
                      setEditingItem({
                        type: "vocab",
                        isNew: false,
                        data: { ...item },
                      })
                    }
                    className="h-8 px-2.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-[#1cb0f6]" />
                    Edit
                  </Button>
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() => handleDelete("vocab", item.id)}
                    className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GRAMMAR PATTERNS WORKSPACE                                             */}
      {/* ========================================================================= */}
      {activeTab === "grammar" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGrammar.map((pattern) => (
              <div
                key={pattern.id}
                className="bento p-5 space-y-3 flex flex-col justify-between group hover:border-[#ce82ff]/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10 text-[11px] font-mono font-bold">
                      Lesson {pattern.lessonNumber} • #{pattern.skillTag}
                    </span>
                    <span className="text-xs font-mono text-[#9a9aa8]">
                      {pattern.patternKey}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{pattern.title}</h3>
                    <div className="text-xs font-mono text-[#ce82ff] mt-0.5">
                      {pattern.japaneseTitle}
                    </div>
                  </div>

                  <div className="bg-[#11131a] p-2.5 rounded-xl border border-white/5 font-mono text-xs text-white">
                    <span className="text-[#9a9aa8]">Formula:</span> {pattern.formula}
                  </div>

                  <p className="text-xs text-[#9a9aa8] line-clamp-2">
                    {pattern.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() =>
                      setEditingItem({
                        type: "grammar",
                        isNew: false,
                        data: { ...pattern },
                      })
                    }
                    className="h-8 px-2.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-[#ce82ff]" />
                    Edit
                  </Button>
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() => handleDelete("grammar", pattern.id)}
                    className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PRACTICE SENTENCE BANK WORKSPACE                                       */}
      {/* ========================================================================= */}
      {activeTab === "sentences" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSentences.map((sentence) => (
              <div
                key={sentence.id}
                className="bento p-5 space-y-3 flex flex-col justify-between group hover:border-[#58cc02]/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 text-[11px] font-mono font-bold">
                      Lesson {sentence.lessonNumber} • {sentence.type}
                    </span>
                    <span className="text-xs font-mono text-[#9a9aa8]">
                      #{sentence.skillTag}
                    </span>
                  </div>

                  <div className="text-xs text-[#9a9aa8]">{sentence.prompt}</div>

                  {sentence.promptJapanese && (
                    <div className="text-lg font-bold text-white font-sans bg-[#11131a] p-2.5 rounded-xl border border-white/5">
                      {sentence.promptJapanese}
                    </div>
                  )}

                  <div className="text-xs text-[#58cc02] font-mono">
                    Answers ({sentence.acceptedAnswers.length}): &ldquo;{sentence.acceptedAnswers[0]}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() =>
                      setEditingItem({
                        type: "sentences",
                        isNew: false,
                        data: { ...sentence },
                      })
                    }
                    className="h-8 px-2.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-[#58cc02]" />
                    Edit
                  </Button>
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() => handleDelete("sentences", sentence.id)}
                    className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. KANA CHARACTERS WORKSPACE                                              */}
      {/* ========================================================================= */}
      {activeTab === "kana" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {filteredKana.map((item) => (
              <div
                key={item.id}
                className="bento p-3 text-center space-y-1.5 flex flex-col justify-between group hover:border-[#ff9600]/40 transition-all"
              >
                <div className="text-3xl font-bold text-white font-display">
                  {item.character}
                </div>
                <div className="text-xs font-mono text-[#ff9600]">
                  /{item.romaji}/
                </div>
                <div className="text-[10px] text-[#9a9aa8] truncate" title={item.mnemonic || ""}>
                  {item.mnemonic || item.category}
                </div>

                <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-white/5">
                  <button
                    onClick={() =>
                      setEditingItem({
                        type: "kana",
                        isNew: false,
                        data: { ...item },
                      })
                    }
                    className="p-1 rounded text-[#9a9aa8] hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete("kana", item.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LESSONS WORKSPACE                                                      */}
      {/* ========================================================================= */}
      {activeTab === "lessons" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bento p-6 space-y-4 flex flex-col justify-between group hover:border-white/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="chip text-white border-white/20 bg-white/5 text-xs font-mono font-bold">
                      Lesson {lesson.lessonNumber}
                    </span>
                    <span className="text-xs font-mono text-[#58cc02]">{lesson.jlptLevel}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {lesson.title}{" "}
                    <span className="text-sm text-[#9a9aa8] font-normal">
                      ({lesson.japaneseTitle})
                    </span>
                  </h3>

                  <div className="text-xs text-[#1cb0f6] font-mono">
                    Grammar: {lesson.grammarTopic}
                  </div>

                  <p className="text-xs text-[#9a9aa8] leading-relaxed">
                    {lesson.summary}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() =>
                      setEditingItem({
                        type: "lessons",
                        isNew: false,
                        data: { ...lesson },
                      })
                    }
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit Lesson
                  </Button>
                  <Button
                    variant="chunkyOutline"
                    size="sm"
                    onClick={() => handleDelete("lessons", lesson.id)}
                    className="text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL / DRAWER FORM FOR EDITING / ADDING ITEMS                            */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14161f] border-2 border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{editingItem.isNew ? "Add New" : "Edit"}</span>
                <span className="uppercase text-xs font-mono chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10">
                  {editingItem.type}
                </span>
              </h2>

              <button
                onClick={() => setEditingItem(null)}
                className="text-[#9a9aa8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* VOCAB EDIT FORM */}
              {editingItem.type === "vocab" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Lesson #</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={editingItem.data.lessonNumber || 1}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, lessonNumber: parseInt(e.target.value, 10) },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Part of Speech</label>
                      <select
                        value={editingItem.data.partOfSpeech || "noun"}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, partOfSpeech: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="noun">Noun</option>
                        <option value="pronoun">Pronoun</option>
                        <option value="verb">Verb</option>
                        <option value="adjective">Adjective</option>
                        <option value="particle">Particle</option>
                        <option value="expression">Expression</option>
                        <option value="suffix">Suffix</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Word (Kanji / Kana)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.word || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, word: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Kana Reading</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.reading || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, reading: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Rōmaji</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.romaji || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, romaji: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">English Meaning</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.meaning || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, meaning: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Picture Icon / Emoji</label>
                    <input
                      type="text"
                      value={editingItem.data.imageUrl || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, imageUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      placeholder="Emoji e.g. 🚗, 📖, 🧑‍🏫"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Example Sentence (Japanese)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.exampleSentence || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, exampleSentence: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Sentence Reading</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.exampleReading || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, exampleReading: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Sentence Translation</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.exampleMeaning || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, exampleMeaning: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* GRAMMAR EDIT FORM */}
              {editingItem.type === "grammar" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Lesson #</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={editingItem.data.lessonNumber || 1}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, lessonNumber: parseInt(e.target.value, 10) },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Skill Tag (e.g. copula_desu)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.skillTag || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, skillTag: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Pattern Key (Unique ID)</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.patternKey || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, patternKey: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Title (English description)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.title || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, title: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Japanese Title</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.japaneseTitle || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, japaneseTitle: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Formula Blueprint</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.formula || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, formula: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Pedagogical Explanation</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.data.explanation || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, explanation: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl p-3 text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Common Pitfalls & Avoidances</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.commonMistakes || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, commonMistakes: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl p-3 text-white"
                    />
                  </div>
                </>
              )}

              {/* SENTENCE DRILL EDIT FORM */}
              {editingItem.type === "sentences" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Lesson #</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={editingItem.data.lessonNumber || 1}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, lessonNumber: parseInt(e.target.value, 10) },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Drill Type</label>
                      <select
                        value={editingItem.data.type || "transformation"}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, type: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="transformation">Transformation</option>
                        <option value="translation">Translation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Prompt Instruction</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.prompt || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, prompt: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Base Japanese (For Transformations)</label>
                    <input
                      type="text"
                      value={editingItem.data.promptJapanese || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, promptJapanese: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">
                      Accepted Answers (comma-separated variants)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={
                        Array.isArray(editingItem.data.acceptedAnswers)
                          ? editingItem.data.acceptedAnswers.join(", ")
                          : editingItem.data.acceptedAnswers || ""
                      }
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            acceptedAnswers: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Skill Tag</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.skillTag || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, skillTag: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Hint</label>
                      <input
                        type="text"
                        value={editingItem.data.hint || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, hint: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* KANA EDIT FORM */}
              {editingItem.type === "kana" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Character Glyph</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.character || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, character: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white text-xl text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Rōmaji</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.romaji || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, romaji: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Visual Mnemonic Tip</label>
                    <input
                      type="text"
                      value={editingItem.data.mnemonic || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, mnemonic: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Example Word</label>
                      <input
                        type="text"
                        value={editingItem.data.exampleWord || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, exampleWord: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Example Meaning</label>
                      <input
                        type="text"
                        value={editingItem.data.exampleMeaning || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, exampleMeaning: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LESSONS EDIT FORM */}
              {editingItem.type === "lessons" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Lesson #</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        required
                        value={editingItem.data.lessonNumber || 1}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, lessonNumber: parseInt(e.target.value, 10) },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">JLPT Level</label>
                      <input
                        type="text"
                        value={editingItem.data.jlptLevel || "N5"}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, jlptLevel: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">English Title</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.title || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, title: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#9a9aa8] mb-1 block">Japanese Title</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.japaneseTitle || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, japaneseTitle: e.target.value },
                          })
                        }
                        className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Grammar Topic Focus</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.grammarTopic || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, grammarTopic: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#9a9aa8] mb-1 block">Syllabus Summary</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.data.summary || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, summary: e.target.value },
                        })
                      }
                      className="w-full bg-[#1e2029] border border-white/10 rounded-xl p-3 text-white leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="chunkyOutline"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="chunky"
                  size="sm"
                  disabled={isPending}
                  className="bg-[#58cc02] hover:bg-[#46a302] border-[#388202]"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {isPending ? "Saving..." : "Save to Database"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
