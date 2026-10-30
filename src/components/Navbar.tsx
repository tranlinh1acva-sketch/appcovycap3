import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  UserCheck,
  GraduationCap,
  Shield,
  Menu,
  ChevronDown,
  Sparkles,
  Award,
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  user: UserProfile;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileSidebar: () => void;
  onOpenProfile: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onToggleMobileSidebar,
  onOpenProfile,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotiMenu, setShowNotiMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Học sinh nộp bài tập mới',
      desc: 'Trần Nguyễn Khánh An (11A1) vừa nộp Phiếu rèn luyện Đạo hàm',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Thông báo chuyên môn',
      desc: 'Tiết thao giảng chuyên đề Toán ứng dụng AI lúc 8h00 Thứ Sáu',
      time: '1 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Học sinh cần hỗ trợ',
      desc: 'Huỳnh Gia Hưng (11A1) hoàn thành bài tập với điểm 5.8, cần phụ đạo hàm hợp',
      time: '3 giờ trước',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="md" />

          {/* School badge */}
          <div className="hidden xl:flex items-center gap-2 pl-4 ml-4 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {user.school}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Năm học 2026 - 2027
            </span>
          </div>
        </div>

        {/* Center: Educational Slogan */}
        <div className="hidden 2xl:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 italic bg-rose-50/60 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-rose-100 dark:border-slate-700/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>"Cùng AI kiến tạo lớp học hạnh phúc – Cá nhân hóa tri thức, phát triển năng lực."</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Chuyển đổi vai trò trải nghiệm"
            >
              {currentRole === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
              {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-blue-600" />}
              {currentRole === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-600" />}
              <span>
                {currentRole === 'teacher'
                  ? 'Cô giáo'
                  : currentRole === 'student'
                  ? 'Học sinh'
                  : 'Quản trị viên'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chọn vai trò sử dụng
                </div>
                <button
                  onClick={() => {
                    onRoleChange('teacher');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    currentRole === 'teacher' ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Giáo viên (Cô Nguyễn Thị Minh Vy)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Đầy đủ 12 module quản lý & giảng dạy</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('student');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    currentRole === 'student' ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <div>
                    <div>Học sinh (Khối 10, 11, 12)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Luyện thi, Chat VY Mentor, Chơi game</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    currentRole === 'admin' ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  <div>
                    <div>Quản trị viên THPT số 1 Tuy Phước</div>
                    <div className="text-[10px] text-slate-400 font-normal">Bảo mật dữ liệu, phân quyền, nhật ký</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotiMenu(!showNotiMenu)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotiMenu && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50"
                onMouseLeave={() => setShowNotiMenu(false)}
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Thông báo nhà trường</span>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">2 tin mới</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                        n.unread ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={darkMode ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Teacher Profile quick pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700 text-left group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover object-[center_28%] ring-2 ring-rose-200 dark:ring-rose-900 group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Cô {user.name.split(' ').slice(-1)[0]}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                THPT số 1 Tuy Phước
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
