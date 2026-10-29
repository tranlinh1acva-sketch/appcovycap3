import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Filter,
  Search,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import { Question, CognitiveLevel, QuestionType } from '../../types';

interface QuestionBankModuleProps {
  questions: Question[];
  onSaveQuestions: (questions: Question[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const QuestionBankModule: React.FC<QuestionBankModuleProps> = ({
  questions,
  onSaveQuestions,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // AI Generator Form
  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('11');
  const [topic, setTopic] = useState('Đạo hàm và tiếp tuyến');
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('Vận dụng');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [questionCount, setQuestionCount] = useState('3');

  // Manual Add/Edit Modal
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      onShowToast('warning', 'Thiếu chủ đề', 'Vui lòng nhập chủ đề kiểm tra!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/quiz-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          cognitiveLevel,
          questionType,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        const generatedList: Question[] = data.questions.map((q: any) => ({
          id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          question: q.question,
          type: q.type || questionType,
          level: q.level || cognitiveLevel,
          subject,
          grade,
          topic,
          options: q.options || [],
          correctAnswer: q.correctAnswer || 'A',
          explanation: q.explanation || 'Căn cứ SGK 2018.',
          createdAt: new Date().toISOString(),
        }));

        const updated = [...generatedList, ...questions];
        onSaveQuestions(updated);
        onShowToast(
          'success',
          `AI đã tạo ${generatedList.length} câu hỏi thành công!`,
          'Các câu hỏi đã được bổ sung vào ngân hàng dùng chung của cô.'
        );
      } else {
        throw new Error(data.error || 'Lỗi khi tạo câu hỏi');
      }
    } catch (err: any) {
      onShowToast('error', 'Lỗi tạo câu hỏi AI', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    onSaveQuestions(updated);
    onShowToast('info', 'Đã xóa câu hỏi khỏi ngân hàng');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const exists = questions.some((q) => q.id === editingQuestion.id);
    let updated: Question[];
    if (exists) {
      updated = questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q));
    } else {
      updated = [editingQuestion, ...questions];
    }
    onSaveQuestions(updated);
    setEditingQuestion(null);
    onShowToast('success', 'Đã cập nhật câu hỏi thành công!');
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'all' || q.level === levelFilter;
    const matchType = typeFilter === 'all' || q.type === typeFilter;
    return matchSearch && matchLevel && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 4 · Ngân Hàng Câu Hỏi AI
            </span>
            <span className="text-xs text-slate-400">4 Mức độ nhận thức Bloom</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Ngân Hàng Đề Thi & Đánh Giá Năng Lực
          </h2>
        </div>

        <button
          onClick={() =>
            setEditingQuestion({
              id: 'q_' + Date.now(),
              question: '',
              type: 'multiple_choice',
              level: 'Nhận biết',
              subject: 'Toán học',
              grade: '11',
              topic: '',
              options: ['A. ', 'B. ', 'C. ', 'D. '],
              correctAnswer: 'A',
              explanation: '',
              createdAt: new Date().toISOString(),
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow hover:bg-slate-800 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm câu hỏi thủ công</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: AI Generator form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-rose-500" />
            Sinh câu hỏi thông minh bằng AI
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="Toán học">Toán học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Tin học">Tin học</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chủ đề kiến thức
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Đạo hàm hàm số lượng giác..."
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mức độ nhận thức
              </label>
              <select
                value={cognitiveLevel}
                onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="Nhận biết">Nhận biết</option>
                <option value="Thông hiểu">Thông hiểu</option>
                <option value="Vận dụng">Vận dụng</option>
                <option value="Vận dụng cao">Vận dụng cao</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Loại câu hỏi
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                <option value="true_false">Đúng / Sai</option>
                <option value="short_answer">Trả lời ngắn</option>
                <option value="essay">Tự luận sư phạm</option>
                <option value="case_study">Bài tập tình huống</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Số lượng câu hỏi cần tạo
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="3">3 câu</option>
              <option value="5">5 câu</option>
              <option value="10">10 câu</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>AI đang phân tích kiến thức...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tạo câu hỏi ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Right Col: Question Bank List & Filters */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm câu hỏi, từ khóa hoặc chủ đề..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="Nhận biết">Nhận biết</option>
                <option value="Thông hiểu">Thông hiểu</option>
                <option value="Vận dụng">Vận dụng</option>
                <option value="Vận dụng cao">Vận dụng cao</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả loại câu</option>
                <option value="multiple_choice">Trắc nghiệm</option>
                <option value="true_false">Đúng / Sai</option>
                <option value="short_answer">Trả lời ngắn</option>
                <option value="essay">Tự luận</option>
                <option value="case_study">Tình huống</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Đang hiển thị {filteredQuestions.length} câu hỏi</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Toán 11 · THPT số 1 Tuy Phước
              </span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        Câu {idx + 1}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          q.level === 'Nhận biết'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : q.level === 'Thông hiểu'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : q.level === 'Vận dụng'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {q.level}
                      </span>
                      <span className="text-[11px] text-slate-400">· {q.topic}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect =
                          opt.startsWith(q.correctAnswer) ||
                          (q.type === 'true_false' && opt === q.correctAnswer);
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg text-xs border transition-all ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                      <span className="font-bold">Lời giải sư phạm: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Manual Edit / Add Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Chỉnh sửa câu hỏi
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows={3}
                  required
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mức độ nhận thức</label>
                  <select
                    value={editingQuestion.level}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        level: e.target.value as CognitiveLevel,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Đáp án đúng</label>
                  <input
                    type="text"
                    required
                    value={editingQuestion.correctAnswer}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                    }
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lời giải thích chi tiết</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Lưu vào ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
