import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Timer,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  Sparkles,
  Shuffle,
  BarChart2,
} from 'lucide-react';
import { Exam, Question, ExamSubmission, Student } from '../../types';
import { exportExamResultsToExcel } from '../../utils/exportXlsx';

interface AssessmentModuleProps {
  exams: Exam[];
  questions: Question[];
  students: Student[];
  submissions: ExamSubmission[];
  onSaveExams: (exams: Exam[]) => void;
  onSaveSubmissions: (subs: ExamSubmission[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({
  exams,
  questions,
  students,
  submissions,
  onSaveExams,
  onSaveSubmissions,
  onShowToast,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [examResult, setExamResult] = useState<{
    score: number;
    total: number;
    correctCount: number;
    wrongQuestions: Question[];
  } | null>(null);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Timer countdown while taking exam
  useEffect(() => {
    if (!isTakingExam || examTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setExamTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTakingExam, examTimeLeft]);

  const handleStartExam = () => {
    if (!currentExam || currentExam.questions.length === 0) {
      onShowToast('warning', 'Đề thi trống', 'Đề thi chưa có câu hỏi nào!');
      return;
    }
    setStudentAnswers({});
    setExamResult(null);
    setExamTimeLeft(currentExam.durationMinutes * 60);
    setIsTakingExam(true);
  };

  const handleSelectAnswer = (qId: string, answerLetter: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qId]: answerLetter,
    }));
  };

  const handleSubmitExam = () => {
    setIsTakingExam(false);
    if (!currentExam) return;

    let correctCount = 0;
    const wrongList: Question[] = [];

    currentExam.questions.forEach((q) => {
      const selected = studentAnswers[q.id];
      if (selected && selected === q.correctAnswer) {
        correctCount++;
      } else {
        wrongList.push(q);
      }
    });

    const calculatedScore = Number(
      ((correctCount / currentExam.questions.length) * 10).toFixed(1)
    );

    setExamResult({
      score: calculatedScore,
      total: currentExam.questions.length,
      correctCount,
      wrongQuestions: wrongList,
    });

    // Record submission
    const newSub: ExamSubmission = {
      id: 'sub_' + Date.now(),
      examId: currentExam.id,
      studentId: 'st_curr',
      studentName: 'Trần Nguyễn Khánh An',
      className: '11A1',
      score: calculatedScore,
      maxScore: 10,
      submittedAt: new Date().toISOString(),
      answers: studentAnswers,
      feedback:
        calculatedScore >= 8.0
          ? 'Nắm rất vững kiến thức đạo hàm và tiếp tuyến!'
          : 'Cần xem lại công thức và rèn luyện thêm bài toán thực tế.',
    };

    onSaveSubmissions([newSub, ...submissions]);
    onShowToast('success', 'Đã nộp bài kiểm tra thành công!', `Điểm đạt được: ${calculatedScore} / 10.`);
  };

  const handleExportExcel = () => {
    try {
      const examSubs = submissions.filter((s) => s.examId === currentExam.id);
      exportExamResultsToExcel(
        examSubs.length > 0
          ? examSubs
          : [
              {
                id: 's1',
                examId: currentExam.id,
                studentId: '1',
                studentName: 'Trần Nguyễn Khánh An',
                className: '11A1',
                score: 9.0,
                maxScore: 10,
                submittedAt: new Date().toISOString(),
                answers: {},
                feedback: 'Bài làm xuất sắc',
              },
              {
                id: 's2',
                examId: currentExam.id,
                studentId: '2',
                studentName: 'Lê Minh Quân',
                className: '11A1',
                score: 8.5,
                maxScore: 10,
                submittedAt: new Date().toISOString(),
                answers: {},
                feedback: 'Đạt chuẩn kiến thức',
              },
            ],
        currentExam.title
      );
      onShowToast('success', 'Đã xuất kết quả kiểm tra ra Excel!', 'Tệp bảng điểm đã được tải xuống.');
    } catch (err: any) {
      onShowToast('error', 'Lỗi xuất Excel', err.message);
    }
  };

  // Error analytics simulation based on question bank
  const errorAnalytics = [
    {
      topic: 'Ý nghĩa hình học tiếp tuyến',
      wrongRate: 42,
      note: 'Học sinh nhầm lẫn giữa tiếp tuyến tại một điểm và tiếp tuyến đi qua một điểm.',
    },
    {
      topic: 'Đạo hàm hàm hợp căn thức',
      wrongRate: 36,
      note: 'Thường quên nhân u\'(x) khi tính đạo hàm của √(u).',
    },
    {
      topic: 'Bài toán vận tốc tức thời thực tiễn',
      wrongRate: 28,
      note: 'Một số học sinh chưa quen chuyển đổi đơn vị km/h sang m/s.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 8 · Kiểm Tra & Đánh Giá
            </span>
            <span className="text-xs text-slate-400">Chấm điểm tự động & Phân tích lỗi sai</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentExam?.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất bảng điểm Excel</span>
          </button>
        </div>
      </div>

      {!isTakingExam && !examResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Exam Info & Live Testing Launchpad */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-rose-500" />
                Thông số bài kiểm tra
              </h3>
              <span className="text-xs text-slate-500">Môn: {currentExam?.subject} · Khối {currentExam?.grade}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500">Thời gian</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {currentExam?.durationMinutes} phút
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500">Số câu hỏi</span>
                <div className="text-lg font-black text-rose-600 mt-0.5">
                  {currentExam?.questions.length} câu
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500">Hình thức</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Trộn đề AI
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">Hướng dẫn học sinh làm bài:</div>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                1. Bài kiểm tra gồm các câu hỏi trắc nghiệm khách quan được trộn ngẫu nhiên.<br />
                2. Đồng hồ đếm ngược sẽ tự động nộp bài khi hết thời gian.<br />
                3. Hệ thống VY EDU AI sẽ tự động chấm điểm và chỉ ra những câu sai để học sinh rút kinh nghiệm.
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu làm bài kiểm tra ngay</span>
            </button>
          </div>

          {/* Right 5 Cols: Error Analytics & Common Pitfalls */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              Phân tích câu hỏi hay bị sai
            </h3>

            <div className="space-y-3">
              {errorAnalytics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{item.topic}</span>
                    <span className="text-rose-600 font-black">{item.wrongRate}% sai</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${item.wrongRate}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Taking Exam View */}
      {isTakingExam && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Sticky Countdown Header */}
          <div className="sticky top-20 z-20 flex items-center justify-between p-4 rounded-xl bg-slate-950 text-white shadow-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-amber-400">{currentExam.title}</div>
              <div className="text-[11px] text-slate-400">
                Đã trả lời: {Object.keys(studentAnswers).length} / {currentExam.questions.length} câu
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono font-bold text-sm">
              <Timer className="w-4 h-4" />
              <span>
                {Math.floor(examTimeLeft / 60)}:
                {(examTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {currentExam.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                    Câu {idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-400">({q.level})</span>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-2 pt-1">
                  {q.options?.map((opt, oIdx) => {
                    const letter = opt.substring(0, 1);
                    const isSelected = studentAnswers[q.id] === letter;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, letter)}
                        className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-bold'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="text-center pt-4">
            <button
              onClick={handleSubmitExam}
              className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/30"
            >
              Nộp bài và xem điểm số ngay
            </button>
          </div>
        </div>
      )}

      {/* Exam Result Screen */}
      {examResult && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Kết Quả Kiểm Tra
            </h3>
            <div className="mt-2 text-4xl font-extrabold text-rose-600">
              {examResult.score} <span className="text-base text-slate-400 font-normal">/ 10 điểm</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đúng {examResult.correctCount} / {examResult.total} câu
            </p>
          </div>

          {/* Pedagogical feedback */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              Nhận xét sư phạm của cô Vy:
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {examResult.score >= 8.0
                ? 'Em nắm kiến thức nền tảng rất tốt và vận dụng nhanh nhẹn. Hãy tiếp tục phát huy ở các bài tập nâng cao.'
                : 'Em đã hoàn thành bài thi với tinh thần tự giác cao. Cần chú ý rèn thêm các câu hỏi về tiếp tuyến và đạo hàm hàm hợp cùng VY AI Mentor.'}
            </p>
          </div>

          {/* Wrong questions review */}
          {examResult.wrongQuestions.length > 0 && (
            <div className="text-left space-y-3 pt-2">
              <h4 className="text-xs font-bold text-rose-600 uppercase">
                Các câu cần xem lại lời giải chi tiết:
              </h4>
              {examResult.wrongQuestions.map((wq, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">{wq.question}</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                    Đáp án đúng: {wq.correctAnswer}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                    Giải thích: {wq.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setExamResult(null);
              setIsTakingExam(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
          >
            Quay lại trang đề thi
          </button>
        </div>
      )}
    </div>
  );
};
