import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  Calendar,
  Layers,
} from 'lucide-react';
import { Student } from '../../types';

interface PersonalizedLearningProps {
  students: Student[];
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const PersonalizedLearningModule: React.FC<PersonalizedLearningProps> = ({
  students,
  onShowToast,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<{
    strongAreas: string[];
    focusAreas: string[];
    studyPlan: { day: string; task: string }[];
    teacherNote: string;
  } | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Group students dynamically based on actual scores
  const advancedGroup = students.filter((s) => s.recentScore >= 8.5);
  const coreGroup = students.filter((s) => s.recentScore >= 6.5 && s.recentScore < 8.5);
  const supportGroup = students.filter((s) => s.recentScore < 6.5);

  const handleGenerateAIPlan = async () => {
    if (!selectedStudent) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/personalize-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          subject: 'Toán học',
          grade: '11',
          testScores: [selectedStudent.recentScore, 7.0, 8.5],
          weakTopics: selectedStudent.weakTopics,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setAiPlan(data.recommendation);
        onShowToast(
          'success',
          `Đã tạo lộ trình cá nhân hóa cho học sinh ${selectedStudent.name}!`,
          'Không gắn nhãn cố định; hỗ trợ phát triển năng lực cá nhân.'
        );
      } else {
        throw new Error(data.error || 'Lỗi tạo lộ trình');
      }
    } catch (err: any) {
      onShowToast('error', 'Lỗi tạo lộ trình', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 9 · Cá Nhân Hóa Học Tập
            </span>
            <span className="text-xs text-slate-400">Phát triển phẩm chất & năng lực theo CT 2018</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Lộ Trình Học Tập Đích Đến Cá Nhân Hóa
          </h2>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 whitespace-nowrap">Chọn học sinh:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setAiPlan(null);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code} - {s.recentScore} đ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Student Support Groups Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              Nhóm Vận dụng cao / Nâng cao
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 font-bold">
              {advancedGroup.length} em
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
            Đã nắm vững kiến thức SGK, tập trung các bài toán mô hình hóa thực tiễn & tham số nâng cao.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
              Nhóm Củng cố vững vàng
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-900 font-bold">
              {coreGroup.length} em
            </span>
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
            Nắm tốt các dạng toán cơ bản, cần rèn luyện tính chính xác và tốc độ phản xạ làm bài.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
              Nhóm Cần cô Vy phụ đạo
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-bold">
              {supportGroup.length} em
            </span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
            Cần được kèm cặp thêm về định lý cơ bản và bài tập nhận biết - thông hiểu qua VY AI Mentor.
          </p>
        </div>
      </div>

      {/* Selected Student Personalized Card */}
      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 Cols: Student Diagnostic Profile */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-base">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedStudent.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedStudent.code} · {selectedStudent.group} · Lớp 11A1
                </div>
              </div>
            </div>

            {/* Score & Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Điểm đánh giá năng lực gần nhất</span>
                <span className="text-rose-600 font-black">{selectedStudent.recentScore} / 10 đ</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${selectedStudent.recentScore * 10}%` }}
                />
              </div>
            </div>

            {/* Bloom Mastery Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Mức độ làm chủ 4 cấp độ nhận thức:
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>1. Nhận biết (Khái niệm, công thức)</span>
                <span className="font-bold text-emerald-600">95% (Vững)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>2. Thông hiểu (Biến đổi toán học)</span>
                <span className="font-bold text-emerald-600">85% (Tốt)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>3. Vận dụng (Tiếp tuyến, cơ học)</span>
                <span className="font-bold text-amber-600">
                  {selectedStudent.recentScore >= 8 ? '80%' : '60%'} (Cần rèn)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>4. Vận dụng cao (Tham số m, tối ưu)</span>
                <span className="font-bold text-rose-600">
                  {selectedStudent.recentScore >= 9 ? '75%' : '40%'}
                </span>
              </div>
            </div>

            {/* Strong & Weak Areas */}
            <div className="space-y-3 pt-2">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chủ đề đã làm chủ tốt
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedStudent.strongTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Chủ đề cần luyện thêm
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedStudent.weakTopics.length > 0 ? (
                    selectedStudent.weakTopics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Đã làm chủ đầy đủ các chủ đề cơ bản.</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateAIPlan}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>AI đang phân tích lộ trình...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Khởi tạo lộ trình bồi dưỡng AI</span>
                </>
              )}
            </button>
          </div>

          {/* Right 7 Cols: Customized Action Roadmap */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Lộ trình tiến bộ sư phạm được thiết kế riêng
              </h3>
              <span className="text-[11px] text-slate-400">Có thể điều chỉnh linh hoạt</span>
            </div>

            {aiPlan ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  <strong>Lời khuyên của cô Vy:</strong> "{aiPlan.teacherNote}"
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Kế hoạch ôn tập từng chặng:
                  </span>
                  {aiPlan.studyPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3 text-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 dark:text-white">{step.day}</div>
                        <div className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                          {step.task}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Lộ trình cá nhân hóa giúp giáo viên THPT số 1 Tuy Phước đồng hành cùng từng học sinh:
                  chỉ ra điểm mạnh để khuyến khích, phát hiện lỗ hổng kiến thức để bù đắp kịp thời, không tạo áp lực tiêu cực cho học sinh.
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                    <span>Chặng 1: Ôn lại định lý và tính chất trong SGK</span>
                    <span className="text-emerald-600 font-bold">Hoàn thành</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                    <span>Chặng 2: Làm 5 bài tập có hướng dẫn từ VY AI Mentor</span>
                    <span className="text-blue-600 font-bold">Đang thực hiện</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                    <span>Chặng 3: Tham gia thử thách mini 15 phút trên lớp</span>
                    <span className="text-slate-400">Chờ hoàn thành chặng 2</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
