import React, { useState, useRef } from 'react';
import {
  UserCircle2,
  Camera,
  Award,
  BookOpen,
  School,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface TeacherProfileProps {
  user: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const TeacherProfileModule: React.FC<TeacherProfileProps> = ({
  user,
  onSaveProfile,
  onShowToast,
}) => {
  const [name, setName] = useState(user.name);
  const [school, setSchool] = useState(user.school);
  const [subject, setSubject] = useState(user.subject || 'Toán học & Ứng dụng số');
  const [bio, setBio] = useState(user.bio || '');
  const [motto, setMotto] = useState(user.motto || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated graceful pedagogical avatars
  const presetAvatars = [
    {
      label: 'Ảnh cô Nguyễn Thị Minh Vy (Lễ tổng kết năm học 2025-2026)',
      url: '/assets/aistudio/image_07a86345.png',
    },
    {
      label: 'Ảnh chân dung hiện đại 1',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    },
    {
      label: 'Ảnh chân dung sư phạm 2',
      url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=400&auto=format&fit=crop',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('warning', 'Tệp quá lớn', 'Vui lòng chọn ảnh dung lượng dưới 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          onShowToast('success', 'Đã tải ảnh chân dung mới lên thành công!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      school,
      subject,
      bio,
      motto,
      avatar,
    };
    onSaveProfile(updated);
    onShowToast('success', 'Đã lưu hồ sơ giáo viên thành công!', 'Dữ liệu đã được cập nhật toàn hệ thống.');
  };

  const achievements = [
    { title: 'Giáo viên dạy giỏi cấp trường', year: 'Năm học 2024 - 2025' },
    { title: 'Sáng kiến ứng dụng chuyển đổi số và AI trong môn Toán THPT', year: 'Năm 2025' },
    { title: 'Bồi dưỡng học sinh đạt giải Học sinh giỏi môn Toán cấp Tỉnh', year: 'Năm 2024' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 12 · Hồ Sơ Giáo Viên
            </span>
            <span className="text-xs text-slate-400">Trường THPT số 1 Tuy Phước, Bình Định</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Thông Tin Nhà Giáo & Thành Tích Sư Phạm
          </h2>
        </div>
      </div>

      {/* Main Profile Form & Card */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Avatar & Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <img
              src={avatar}
              alt={name}
              className="w-36 h-36 rounded-2xl object-cover object-[center_28%] ring-4 ring-rose-200 dark:ring-rose-950 shadow-xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span>Đổi ảnh chân dung</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{name}</h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{subject}</p>
            <p className="text-xs text-slate-500 mt-0.5">{school}</p>
          </div>

          {/* Quick preset avatar selector */}
          <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hoặc chọn ảnh mẫu:</span>
            <div className="flex justify-center gap-2">
              {presetAvatars.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(p.url)}
                  className="w-9 h-9 rounded-lg overflow-hidden border-2 hover:border-rose-500 transition-all"
                  title={p.label}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-500 leading-relaxed text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Bảo mật thông tin:</strong> Hệ thống không hiển thị công khai CCCD, số điện thoại cá nhân, ngày sinh hay địa chỉ nhà.
            </span>
          </div>

          {/* Commemorative School Ceremony Photo Card */}
          <div className="w-full p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Ảnh lưu niệm sư phạm
              </span>
              <span className="text-[10px] text-slate-400">2025 - 2026</span>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow border border-rose-200 dark:border-rose-900/40 aspect-[3/4] bg-slate-950">
              <img
                src="/assets/aistudio/image_07a86345.png"
                alt="Cô Nguyễn Thị Minh Vy tại Lễ tổng kết năm học"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic text-center">
              Cô Nguyễn Thị Minh Vy tại Lễ Tổng kết năm học 2025 - 2026, Trường THPT số 1 Tuy Phước
            </p>
          </div>
        </div>

        {/* Right 8 Cols: Editable Fields & Verified Achievements */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Thông tin chi tiết giáo viên
            </h3>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thông tin</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Họ và tên giáo viên</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Bộ môn phụ trách</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Đơn vị công tác</label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Các lớp giảng dạy</label>
              <input
                type="text"
                disabled
                value="11A1, 10A3, 12A2 (Khối 10, 11, 12)"
                className="w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold mb-1">Phương châm giáo dục</label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium italic"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold mb-1">Giới thiệu kinh nghiệm giảng dạy & Nghiên cứu</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed"
            />
          </div>

          {/* Verified Achievements */}
          <div className="pt-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Thành tích sư phạm đã được xác minh
            </h4>
            <div className="space-y-2">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
