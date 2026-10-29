import React from 'react';
import {
  Sparkles,
  BookOpen,
  Gamepad2,
  Bot,
  ClipboardCheck,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from '../Sidebar';
import { Assignment, Exam } from '../../types';

interface StudentPortalProps {
  onNavigate: (tab: ActiveTab) => void;
  assignments: Assignment[];
  exams: Exam[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onNavigate,
  assignments,
  exams,
}) => {
  return (
    <div className="space-y-6">
      {/* Student Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                Góc Học Tập Học Sinh
              </span>
              <span className="text-xs text-slate-300">Lớp 11A1 · THPT số 1 Tuy Phước</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Xin chào bạn Trần Nguyễn Khánh An! 🎓
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              "Cùng AI kiến tạo lớp học hạnh phúc – Tự tin làm chủ tri thức môn Toán."
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('ai-mentor')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Hỏi VY AI Mentor</span>
            </button>
            <button
              onClick={() => onNavigate('games')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Vào Đấu trường 6 Game</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500">Điểm đánh giá gần nhất</span>
          <div className="text-2xl font-black text-rose-600 mt-1">9.2 / 10</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Xếp loại: Xuất sắc</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500">Bài tập đang chờ</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            1 bài
          </div>
          <span className="text-[11px] text-slate-500">Hạn nộp: Thứ Sáu</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500">Tiến độ chuyên đề Đạo hàm</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">88%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Đã hoàn thành</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500">Danh hiệu học tập</span>
          <div className="text-base font-black text-amber-500 mt-2 flex items-center gap-1">
            <Award className="w-4 h-4" /> Bậc Thầy Tiếp Tuyến
          </div>
          <span className="text-[11px] text-slate-500">Top 1 Đấu trường trí tuệ</span>
        </div>
      </div>

      {/* Quick Launch Cards for Student */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('assessment')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-rose-400 cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Làm bài kiểm tra trực tuyến
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tham gia bài kiểm tra 15 phút chuyên đề Đạo hàm, nhận kết quả và phân tích chi tiết câu sai ngay lập tức.
          </p>
          <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
            Vào làm bài thi <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('games')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-400 cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Đấu trường 6 trò chơi học tập
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Chinh phục đỉnh tri thức, Ai là triệu phú, ghép đôi thuật ngữ và thi đấu bảng vàng với các bạn cùng lớp.
          </p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            Chơi ngay <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('personalized')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-400 cursor-pointer transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Lộ trình ôn tập cá nhân hóa
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Xem những chủ đề em đã nắm vững, gợi ý bài tập nâng cao và lời dặn dò sư phạm của cô Vy.
          </p>
          <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
            Xem lộ trình <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
