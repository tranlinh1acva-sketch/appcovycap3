import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Save,
  CheckCircle,
  Edit3,
  FileText,
  Clock,
  BookOpen,
  Layers,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { LessonPlan, LessonSection } from '../../types';
import { exportLessonPlanToDocx } from '../../utils/exportDocx';

interface LessonPlanModuleProps {
  plans: LessonPlan[];
  onSavePlan: (plan: LessonPlan) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const LessonPlanModule: React.FC<LessonPlanModuleProps> = ({
  plans,
  onSavePlan,
  onShowToast,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [loading, setLoading] = useState(false);

  // Form input state
  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('11');
  const [topic, setTopic] = useState('Đạo hàm và ý nghĩa hình học');
  const [textbook, setTextbook] = useState('Kết nối tri thức với cuộc sống');
  const [duration, setDuration] = useState('45 phút');
  const [objectives, setObjectives] = useState('Nhận biết định nghĩa đạo hàm tại một điểm, hệ số góc tiếp tuyến, viết phương trình tiếp tuyến');
  const [method, setMethod] = useState('Dạy học giải quyết vấn đề, ứng dụng chuyển đổi số với VY EDU AI');
  const [classTraits, setClassTraits] = useState('Học sinh lớp 11A1 năng động, tiếp thu nhanh, cần chú trọng bài toán thực tiễn');

  // Currently viewing/editing plan
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const [editableSections, setEditableSections] = useState<LessonSection[]>(currentPlan ? currentPlan.sections : []);
  const [isApproved, setIsApproved] = useState<boolean>(currentPlan ? currentPlan.isApproved : false);

  // Sync when selectedPlanId changes
  React.useEffect(() => {
    if (currentPlan) {
      setEditableSections(currentPlan.sections);
      setIsApproved(currentPlan.isApproved);
    }
  }, [selectedPlanId]);

  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      onShowToast('warning', 'Thiếu thông tin', 'Vui lòng nhập tên bài học hoặc chủ đề!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          textbook,
          duration,
          objectives,
          method,
          classTraits,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newPlan: LessonPlan = {
          id: 'lp_' + Date.now(),
          title: data.data.title || `KẾ HOẠCH BÀI DẠY: ${topic.toUpperCase()}`,
          subject,
          grade,
          textbook,
          duration,
          objectives,
          method,
          classTraits,
          sections: data.data.sections || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isApproved: false, // Must be approved by teacher!
        };

        onSavePlan(newPlan);
        setSelectedPlanId(newPlan.id);
        setEditableSections(newPlan.sections);
        setIsApproved(false);

        onShowToast(
          'success',
          'AI đã tạo kế hoạch bài dạy thành công!',
          'Vui lòng xem lại từng hoạt động và bấm "Phê duyệt giáo án" trước khi sử dụng.'
        );
      } else {
        throw new Error(data.error || 'Không thể tạo giáo án.');
      }
    } catch (err: any) {
      onShowToast('error', 'Lỗi khi tạo giáo án AI', err.message || 'Vui lòng thử lại sau giây lát.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSectionContent = (id: string, newContent: string) => {
    setEditableSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: newContent } : s))
    );
  };

  const handleSaveCurrentPlan = () => {
    if (!currentPlan) return;
    const updated: LessonPlan = {
      ...currentPlan,
      sections: editableSections,
      isApproved,
      updatedAt: new Date().toISOString(),
    };
    onSavePlan(updated);
    onShowToast('success', 'Đã lưu giáo án thành công!', 'Các chỉnh sửa của cô đã được lưu trữ bền vững.');
  };

  const handleExportDocx = async () => {
    if (!currentPlan) return;
    try {
      const planToExport = {
        ...currentPlan,
        sections: editableSections,
      };
      await exportLessonPlanToDocx(planToExport);
      onShowToast('success', 'Đã xuất file Word (.docx) chuẩn 5512!', 'Tệp tài liệu đang được tải về máy của cô.');
    } catch (err: any) {
      onShowToast('error', 'Lỗi khi xuất DOCX', err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 2 · AI Thiết Kế Bài Giảng
            </span>
            <span className="text-xs text-slate-400">Chuẩn Công văn 5512/BGDĐT</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Xây Dựng Kế Hoạch Bài Dạy Thông Minh
          </h2>
        </div>

        {/* Existing plans selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 whitespace-nowrap">Giáo án đã lưu:</label>
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Input parameters for AI */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Thông số thiết kế sư phạm
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
              >
                <option value="Toán học">Toán học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Tin học">Tin học</option>
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Địa lý">Địa lý</option>
                <option value="GD Kinh tế & Pháp luật">GD Kinh tế & Pháp luật</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
              >
                <option value="10">Lớp 10 (THPT)</option>
                <option value="11">Lớp 11 (THPT)</option>
                <option value="12">Lớp 12 (THPT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên bài học hoặc Chủ đề
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Định nghĩa và ý nghĩa của Đạo hàm..."
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bộ sách giáo khoa
              </label>
              <select
                value={textbook}
                onChange={(e) => setTextbook(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức</option>
                <option value="Cánh Diều">Cánh Diều</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thời lượng
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="45 phút (1 tiết)">45 phút (1 tiết)</option>
                <option value="90 phút (2 tiết)">90 phút (2 tiết)</option>
                <option value="Chuyên đề 3 tiết">Chuyên đề 3 tiết</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Yêu cầu cần đạt cốt lõi
            </label>
            <textarea
              rows={2}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phương pháp giảng dạy mong muốn
            </label>
            <input
              type="text"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Đặc điểm lớp học THPT số 1 Tuy Phước
            </label>
            <input
              type="text"
              value={classTraits}
              onChange={(e) => setClassTraits(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>AI đang phân tích & thiết kế giáo án...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Khởi tạo bản nháp với AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview & Editor: Full Section Editor */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* Action buttons header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentPlan ? currentPlan.title : 'Kế hoạch bài dạy'}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>{currentPlan?.subject}</span>
                <span>·</span>
                <span>Lớp {currentPlan?.grade}</span>
                <span>·</span>
                <span>{currentPlan?.textbook}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApproved(!isApproved)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isApproved
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
                }`}
                title="Quy định: Nội dung AI phải được giáo viên duyệt trước khi sử dụng"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isApproved ? 'Đã phê duyệt' : 'Chờ cô Vy duyệt'}</span>
              </button>

              <button
                onClick={handleSaveCurrentPlan}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-blue-500" />
                <span>Lưu phiên bản</span>
              </button>

              <button
                onClick={handleExportDocx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Word (.docx)</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="In giáo án / Lưu PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Approval Banner */}
          {!isApproved && (
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Bản nháp do AI đề xuất. Cô Vy có thể chỉnh sửa trực tiếp nội dung từng mục bên dưới trước khi bấm duyệt và sử dụng.
                </span>
              </div>
              <button
                onClick={() => setIsApproved(true)}
                className="shrink-0 ml-3 px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
              >
                Duyệt ngay
              </button>
            </div>
          )}

          {/* Section editors */}
          <div className="space-y-5">
            {editableSections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {sec.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">Có thể chỉnh sửa</span>
                </div>

                <textarea
                  rows={Math.max(4, sec.content.split('\n').length + 1)}
                  value={sec.content}
                  onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
