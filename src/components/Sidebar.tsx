import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Presentation,
  HelpCircle,
  Gamepad2,
  Bot,
  Users,
  ClipboardCheck,
  TrendingUp,
  FolderArchive,
  FileCheck2,
  UserCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'lesson-plan'
  | 'slides'
  | 'question-bank'
  | 'games'
  | 'ai-mentor'
  | 'classroom'
  | 'assessment'
  | 'personalized'
  | 'library'
  | 'evidence'
  | 'teacher-profile'
  | 'admin-settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  role,
}) => {
  const teacherNavItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Bảng điều khiển',
      module: 'Module 1',
      icon: LayoutDashboard,
    },
    {
      id: 'lesson-plan' as ActiveTab,
      label: 'AI Thiết kế bài giảng',
      module: 'Module 2',
      icon: BookOpen,
      highlight: true,
    },
    {
      id: 'slides' as ActiveTab,
      label: 'AI Tạo bài trình chiếu',
      module: 'Module 3',
      icon: Presentation,
      highlight: true,
    },
    {
      id: 'question-bank' as ActiveTab,
      label: 'Ngân hàng câu hỏi AI',
      module: 'Module 4',
      icon: HelpCircle,
    },
    {
      id: 'games' as ActiveTab,
      label: 'Trò chơi tương tác (6 game)',
      module: 'Module 5',
      icon: Gamepad2,
      badge: 'Hot',
    },
    {
      id: 'ai-mentor' as ActiveTab,
      label: 'VY AI Mentor',
      module: 'Module 6',
      icon: Bot,
      highlight: true,
    },
    {
      id: 'classroom' as ActiveTab,
      label: 'Quản lý lớp học',
      module: 'Module 7',
      icon: Users,
    },
    {
      id: 'assessment' as ActiveTab,
      label: 'Kiểm tra & Đánh giá',
      module: 'Module 8',
      icon: ClipboardCheck,
    },
    {
      id: 'personalized' as ActiveTab,
      label: 'Cá nhân hóa học tập',
      module: 'Module 9',
      icon: TrendingUp,
    },
    {
      id: 'library' as ActiveTab,
      label: 'Thư viện học liệu',
      module: 'Module 10',
      icon: FolderArchive,
    },
    {
      id: 'evidence' as ActiveTab,
      label: 'Hồ sơ minh chứng & Báo cáo',
      module: 'Module 11',
      icon: FileCheck2,
    },
    {
      id: 'teacher-profile' as ActiveTab,
      label: 'Hồ sơ giáo viên',
      module: 'Module 12',
      icon: UserCircle2,
    },
  ];

  const studentNavItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Góc học tập của em',
      module: 'Học sinh',
      icon: LayoutDashboard,
    },
    {
      id: 'ai-mentor' as ActiveTab,
      label: 'Hỏi đáp VY AI Mentor',
      module: 'Trợ lý học sinh',
      icon: Bot,
      highlight: true,
    },
    {
      id: 'games' as ActiveTab,
      label: 'Đấu trường trò chơi (6 game)',
      module: 'Học mà chơi',
      icon: Gamepad2,
      badge: '6 Games',
    },
    {
      id: 'assessment' as ActiveTab,
      label: 'Làm bài kiểm tra',
      module: 'Thi trực tuyến',
      icon: ClipboardCheck,
    },
    {
      id: 'personalized' as ActiveTab,
      label: 'Lộ trình ôn tập cá nhân',
      module: 'Cá nhân hóa',
      icon: TrendingUp,
    },
    {
      id: 'library' as ActiveTab,
      label: 'Tài liệu học tập',
      module: 'Kho học liệu',
      icon: FolderArchive,
    },
  ];

  const navItems = role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Danh mục chức năng
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'teacher' ? '12 Module Giảng Dạy & AI' : 'Cổng Học Tập Học Sinh'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-rose-600/90 text-white shadow-md shadow-rose-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="truncate text-left">
                    <span className="block truncate">{item.label}</span>
                    <span className="text-[10px] opacity-60 block">{item.module}</span>
                  </div>
                </div>

                {item.badge && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Teacher / School Footer Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-white truncate">Cô Nguyễn Thị Minh Vy</div>
              <div className="text-[10px] text-slate-400 truncate">THPT số 1 Tuy Phước</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
