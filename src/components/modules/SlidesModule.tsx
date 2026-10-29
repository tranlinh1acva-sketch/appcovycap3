import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Palette,
  Edit2,
  RotateCcw,
  Check,
} from 'lucide-react';
import { SlideDeck, SlideItem } from '../../types';
import { exportSlideDeckToPptx } from '../../utils/exportPptx';

interface SlidesModuleProps {
  decks: SlideDeck[];
  onSaveDeck: (deck: SlideDeck) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const SlidesModule: React.FC<SlidesModuleProps> = ({
  decks,
  onSaveDeck,
  onShowToast,
}) => {
  const [currentDeck, setCurrentDeck] = useState<SlideDeck>(decks[0]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generator form
  const [topic, setTopic] = useState('Đạo hàm và Ý nghĩa Hình học');
  const [grade, setGrade] = useState('11');
  const [subject, setSubject] = useState('Toán học');
  const [slideCount, setSlideCount] = useState('8');
  const [contentSummary, setContentSummary] = useState(
    'Bài giảng chuyên đề Toán 11 THPT số 1 Tuy Phước, định nghĩa số gia, tiếp tuyến và ứng dụng thực tiễn.'
  );

  const currentSlide = currentDeck.slides[activeSlideIndex] || currentDeck.slides[0];

  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      onShowToast('warning', 'Thiếu chủ đề', 'Vui lòng nhập chủ đề bài giảng!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          grade,
          subject,
          slideCount,
          contentSummary,
        }),
      });

      const data = await res.json();
      if (data.success && data.data && data.data.slides) {
        const newDeck: SlideDeck = {
          id: 'deck_' + Date.now(),
          title: data.data.title || topic,
          subject,
          grade,
          themeColor: '#0F172A',
          slides: data.data.slides,
          createdAt: new Date().toISOString(),
        };

        setCurrentDeck(newDeck);
        onSaveDeck(newDeck);
        setActiveSlideIndex(0);
        onShowToast('success', 'AI đã tạo bộ slide thành công!', `Gồm ${newDeck.slides.length} slide bài giảng hiện đại.`);
      } else {
        throw new Error(data.error || 'Lỗi khi tạo slide');
      }
    } catch (err: any) {
      onShowToast('error', 'Lỗi khi tạo slide', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPptx = async () => {
    try {
      await exportSlideDeckToPptx(currentDeck);
      onShowToast('success', 'Đã xuất file PowerPoint (.pptx) thật!', 'Tệp trình chiếu đang được tải xuống.');
    } catch (err: any) {
      onShowToast('error', 'Lỗi xuất PowerPoint', err.message);
    }
  };

  const handleUpdateCurrentSlide = (field: keyof SlideItem, value: any) => {
    const updatedSlides = [...currentDeck.slides];
    updatedSlides[activeSlideIndex] = {
      ...updatedSlides[activeSlideIndex],
      [field]: value,
    };
    const updatedDeck = { ...currentDeck, slides: updatedSlides };
    setCurrentDeck(updatedDeck);
    onSaveDeck(updatedDeck);
  };

  const handleAddPoint = () => {
    const points = [...(currentSlide.points || []), 'Ý kiến thức trọng tâm mới'];
    handleUpdateCurrentSlide('points', points);
  };

  const handleUpdatePoint = (idx: number, val: string) => {
    const points = [...currentSlide.points];
    points[idx] = val;
    handleUpdateCurrentSlide('points', points);
  };

  const handleDeletePoint = (idx: number) => {
    const points = currentSlide.points.filter((_, i) => i !== idx);
    handleUpdateCurrentSlide('points', points);
  };

  const handleAddNewSlide = () => {
    const newSlide: SlideItem = {
      id: 'sl_' + Date.now(),
      title: 'Tiêu đề trang trình chiếu mới',
      subtitle: 'Môn: ' + currentDeck.subject + ' · Khối ' + currentDeck.grade,
      points: ['Nội dung trọng tâm 1', 'Nội dung minh họa 2', 'Câu hỏi thảo luận nhanh'],
      layout: 'content',
      notes: 'Lời dẫn của cô giáo',
    };
    const updatedDeck = { ...currentDeck, slides: [...currentDeck.slides, newSlide] };
    setCurrentDeck(updatedDeck);
    onSaveDeck(updatedDeck);
    setActiveSlideIndex(currentDeck.slides.length);
    onShowToast('info', 'Đã thêm slide mới', 'Slide mới đã được chèn vào cuối bộ trình chiếu.');
  };

  const handleDeleteCurrentSlide = () => {
    if (currentDeck.slides.length <= 1) {
      onShowToast('warning', 'Không thể xóa', 'Bộ slide phải có ít nhất 1 trang trình chiếu.');
      return;
    }
    const updated = currentDeck.slides.filter((_, idx) => idx !== activeSlideIndex);
    const updatedDeck = { ...currentDeck, slides: updated };
    setCurrentDeck(updatedDeck);
    onSaveDeck(updatedDeck);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 3 · AI Tạo Bài Trình Chiếu
            </span>
            <span className="text-xs text-slate-400">Xuất file PowerPoint thực tế (.pptx)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentDeck.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPresenting(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow hover:bg-slate-800 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Trình chiếu (F5)</span>
          </button>

          <button
            onClick={handleExportPptx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất PowerPoint (.pptx)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: AI Generator form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-rose-500" />
            AI Soạn slide tự động
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chủ đề bài giảng
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn & Khối
              </label>
              <input
                type="text"
                value={`${subject} - Khối ${grade}`}
                disabled
                className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số lượng slide
              </label>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="6">6 slide (Ngắn gọn)</option>
                <option value="8">8 slide (Chuẩn 1 tiết)</option>
                <option value="12">12 slide (Chuyên đề sâu)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú nội dung trọng tâm
            </label>
            <textarea
              rows={3}
              value={contentSummary}
              onChange={(e) => setContentSummary(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>AI đang tạo slide...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tạo dàn ý slide bằng AI</span>
              </>
            )}
          </button>

          {/* Slide list thumbnails */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Danh sách slide ({currentDeck.slides.length})
              </span>
              <button
                onClick={handleAddNewSlide}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm slide
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {currentDeck.slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition-all ${
                    activeSlideIndex === idx
                      ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="truncate flex-1">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Slide Canvas & Live Editor */}
        <div className="lg:col-span-8 space-y-4">
          {/* Slide Canvas Preview */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-12 shadow-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400/90 font-bold uppercase tracking-wider mb-2">
                <span>VY EDU AI · THPT SỐ 1 TUY PHƯỚC</span>
                <span>
                  Trang {activeSlideIndex + 1} / {currentDeck.slides.length}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>
              {currentSlide.subtitle && (
                <p className="text-sm md:text-base text-slate-300 mt-1 italic">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Body Points */}
            <div className="my-auto py-4 space-y-3">
              {currentSlide.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                    {pt}
                  </span>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <span>Giáo viên: Nguyễn Thị Minh Vy</span>
              <span>Lớp học hạnh phúc · GDPT 2018</span>
            </div>
          </div>

          {/* Slide Controls & Editor */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                  disabled={activeSlideIndex === 0}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
                  Slide {activeSlideIndex + 1} / {currentDeck.slides.length}
                </span>
                <button
                  onClick={() =>
                    setActiveSlideIndex(Math.min(currentDeck.slides.length - 1, activeSlideIndex + 1))
                  }
                  disabled={activeSlideIndex === currentDeck.slides.length - 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteCurrentSlide}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Xóa slide này
                </button>
              </div>
            </div>

            {/* In-place slide text editor */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề slide
                </label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phụ đề / Diễn giải
                </label>
                <input
                  type="text"
                  value={currentSlide.subtitle || ''}
                  onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Các ý chính (Bullet points)
                  </label>
                  <button
                    onClick={handleAddPoint}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm ý
                  </button>
                </div>

                <div className="space-y-2">
                  {currentSlide.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => handleUpdatePoint(i, e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <button
                        onClick={() => handleDeletePoint(i)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Presentation Modal */}
      {isPresenting && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 md:p-12 text-white">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                TRÌNH CHIẾU
              </span>
              <span className="text-sm font-bold text-slate-200">{currentDeck.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">
                Slide {activeSlideIndex + 1} / {currentDeck.slides.length}
              </span>
              <button
                onClick={() => setIsPresenting(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Presentation Slide Content */}
          <div className="max-w-4xl mx-auto w-full my-auto py-8">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-lg md:text-xl text-rose-300 mt-2 font-medium">
                {currentSlide.subtitle}
              </p>
            )}

            <div className="mt-8 space-y-4">
              {currentSlide.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="w-3 h-3 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <p className="text-base md:text-xl text-slate-100 font-medium leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Giáo viên: Nguyễn Thị Minh Vy · THPT số 1 Tuy Phước
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold disabled:opacity-30"
              >
                ← Slide trước
              </button>
              <button
                onClick={() =>
                  setActiveSlideIndex(Math.min(currentDeck.slides.length - 1, activeSlideIndex + 1))
                }
                disabled={activeSlideIndex === currentDeck.slides.length - 1}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold disabled:opacity-30"
              >
                Slide tiếp theo →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
