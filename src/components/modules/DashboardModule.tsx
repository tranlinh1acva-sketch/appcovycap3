import React from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Bot,
  Users,
  Award,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, Classroom, Student, LessonPlan, Exam } from '../../types';
import { ActiveTab } from '../Sidebar';

interface DashboardProps {
  user: UserProfile;
  classes: Classroom[];
  students: Student[];
  lessons: LessonPlan[];
  exams: Exam[];
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardModule: React.FC<DashboardProps> = ({
  user,
  classes,
  students,
  lessons,
  exams,
  onNavigate,
}) => {
  const totalStudents = students.length > 0 ? students.length : 0;
  const totalClasses = classes.length > 0 ? classes.length : 0;
  const totalLessons = lessons.length > 0 ? lessons.length : 0;
  const totalExams = exams.length > 0 ? exams.length : 0;

  // Filter students who need support based on real score < 6.5
  const studentsNeedingHelp = students.filter((s) => s.status === 'needs_help' || s.recentScore < 6.5);

  const teachingSchedule = [
    { day: 'Thứ 2', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: '11A1', topic: 'Đạo hàm và ứng dụng', room: 'Phòng 204' },
    { day: 'Thứ 3', time: 'Tiết 3 - 4 (08:55 - 10:30)', class: '10A3', topic: 'Bất phương trình bậc hai', room: 'Phòng 102' },
    { day: 'Thứ 4', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: '12A2', topic: 'Nguyên hàm & Tích phân', room: 'Phòng 301' },
    { day: 'Thứ 6', time: 'Tiết 2 - 3 (07:50 - 09:40)', class: '11A1', topic: 'Thao giảng chuyên đề AI trong dạy học', room: 'Hội trường 1' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card for Cô Nguyễn Thị Minh Vy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover object-[center_28%] ring-4 ring-rose-400/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-lg shadow font-bold text-[10px]">
                <Award className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/40">
                  {user.school}
                </span>
                <span className="text-xs text-slate-400">Năm học 2026 - 2027</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Xin chào cô {user.name}! 👋
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl italic">
                "{user.motto}"
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('lesson-plan')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tạo bài giảng AI</span>
            </button>
            <button
              onClick={() => onNavigate('games')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Tạo trò chơi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Lớp phụ trách</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalClasses > 0 ? `${totalClasses} lớp` : 'Chưa có dữ liệu'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {classes.map((c) => c.name).join(', ') || 'Chưa có dữ liệu'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Học sinh theo dõi</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalStudents > 0 ? `${totalStudents} em` : 'Chưa có dữ liệu'}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% có hồ sơ học tập số
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Kế hoạch bài dạy</span>
            <BookOpen className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalLessons > 0 ? `${totalLessons} giáo án` : 'Chưa có dữ liệu'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Chuẩn CV 5512 BGD&ĐT
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Đề kiểm tra & Đánh giá</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalExams > 0 ? `${totalExams} bài thi` : 'Chưa có dữ liệu'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Tự động chấm & phân tích sai
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Action Hub & Progress Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Buttons */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Truy cập nhanh công cụ giảng dạy
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">4 công cụ AI cốt lõi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('lesson-plan')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50/30 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tạo bài giảng AI
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Chuẩn 4 hoạt động
                </div>
              </button>

              <button
                onClick={() => onNavigate('question-bank')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tạo đề kiểm tra
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  4 mức độ nhận thức
                </div>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tạo trò chơi
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  6 game chơi ngay
                </div>
              </button>

              <button
                onClick={() => onNavigate('ai-mentor')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-purple-50/30 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  Trò chuyện AI
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  VY AI Mentor
                </div>
              </button>
            </div>
          </div>

          {/* Real Learning Progress by Class */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Tiến độ học tập và chất lượng theo lớp
              </h3>
              <button
                onClick={() => onNavigate('classroom')}
                className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
              >
                Chi tiết lớp học <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {classes.map((cls) => {
                const classStudents = students.filter((s) => s.classId === cls.id);
                const avgScore = classStudents.length
                  ? (classStudents.reduce((acc, curr) => acc + curr.recentScore, 0) / classStudents.length).toFixed(1)
                  : 'Chưa có dữ liệu';

                return (
                  <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                          Lớp {cls.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {cls.studentCount} học sinh · Khối {cls.grade}
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-200">
                        Điểm TB: <span className="text-rose-600 dark:text-rose-400 font-bold">{avgScore}</span> / 10
                      </div>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: typeof avgScore === 'string' && avgScore !== 'Chưa có dữ liệu'
                            ? `${parseFloat(avgScore) * 10}%`
                            : '80%',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Schedule & Students needing help */}
        <div className="space-y-6">
          {/* Teaching Schedule */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Lịch giảng dạy & Nhiệm vụ tuần này
            </h3>

            <div className="space-y-3">
              {teachingSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 font-medium">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.day}</span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    Lớp {item.class} · {item.topic}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.room} · THPT số 1 Tuy Phước
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Students Needing Support */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Học sinh cần cô Vy hỗ trợ
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                {studentsNeedingHelp.length} em
              </span>
            </div>

            <div className="space-y-2.5">
              {studentsNeedingHelp.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{student.name}</span>
                    <span className="text-rose-600 font-bold">{student.recentScore} đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Chủ đề yếu: <span className="text-slate-700 dark:text-slate-300">{student.weakTopics.join(', ') || 'Cần bổ trợ'}</span>
                  </div>
                  {student.notes && (
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 italic mt-1 bg-white/60 dark:bg-slate-900/60 p-1.5 rounded">
                      Ghi chú: {student.notes}
                    </div>
                  )}
                  <button
                    onClick={() => onNavigate('personalized')}
                    className="mt-2 w-full text-center py-1 rounded bg-amber-200/60 dark:bg-amber-900/50 hover:bg-amber-300/60 text-[11px] font-semibold text-amber-900 dark:text-amber-200 transition-colors"
                  >
                    Xem lộ trình cá nhân hóa →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
