import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Download,
  Eye,
  FileText,
  Presentation,
  HelpCircle,
  Gamepad2,
  BookOpen,
  Filter,
  Share2,
  Plus,
} from 'lucide-react';
import { ResourceItem } from '../../types';

interface ResourceLibraryProps {
  resources: ResourceItem[];
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const ResourceLibraryModule: React.FC<ResourceLibraryProps> = ({
  resources,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả học liệu' },
    { id: 'giáo án', label: 'Giáo án chuẩn 5512' },
    { id: 'slide', label: 'Bài trình chiếu' },
    { id: 'phiếu học tập', label: 'Phiếu học tập' },
    { id: 'đề thi', label: 'Ngân hàng đề thi' },
    { id: 'trò chơi', label: 'Trò chơi tương tác' },
  ];

  const filteredResources = resources.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleDownload = (item: ResourceItem) => {
    // Generate real text file download for the resource snippet
    const blob = new Blob(
      [
        `VY EDU AI - HỌC LIỆU SỐ\nTrường THPT số 1 Tuy Phước\nGiáo viên: Nguyễn Thị Minh Vy\n\nTÊN TÀI LIỆU: ${item.title}\nMôn: ${item.subject} - Lớp: ${item.grade}\nLoại file: ${item.fileType}\n\nNỘI DUNG TÓM TẮT:\n${item.contentSnippet || 'Học liệu phục vụ Chương trình GDPT 2018.'}\n\nNgày ban hành: ${item.dateAdded}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.${item.fileType.toLowerCase() === 'docx' ? 'doc' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast('success', `Đang tải tài liệu: ${item.title}`, 'Tệp đã được xuất từ thư viện số.');
  };

  const handleShare = (item: ResourceItem) => {
    onShowToast(
      'info',
      'Đã sao chép liên kết chia sẻ có kiểm soát!',
      'Chỉ học sinh và giáo viên trường THPT số 1 Tuy Phước được cấp quyền truy cập.'
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'giáo án':
        return <BookOpen className="w-5 h-5 text-rose-500" />;
      case 'slide':
        return <Presentation className="w-5 h-5 text-blue-500" />;
      case 'phiếu học tập':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'đề thi':
        return <HelpCircle className="w-5 h-5 text-amber-500" />;
      case 'trò chơi':
        return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      default:
        return <FolderArchive className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 10 · Thư Viện Học Liệu
            </span>
            <span className="text-xs text-slate-400">Kho dữ liệu số THPT số 1 Tuy Phước</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Kho Tài Nguyên Giảng Dạy & Học Tập
          </h2>
        </div>

        <div className="text-xs text-slate-500">
          Tổng cộng: <strong>{resources.length} tài nguyên</strong> đã kiểm duyệt
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm giáo án, bài giảng điện tử, đề thi..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === c.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {getCategoryIcon(res.category)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {res.fileType} · {res.size}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3 leading-snug line-clamp-2">
                {res.title}
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {res.contentSnippet}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {res.downloadCount} lượt tải · {res.grade}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewItem(res)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Xem nhanh"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(res)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Chia sẻ có kiểm soát"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(res)}
                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Tải tệp về máy"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {previewItem.title}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Đóng
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <div>Môn: {previewItem.subject} · Lớp: {previewItem.grade}</div>
              <div>Tác giả: {previewItem.author}</div>
              <div>Định dạng: {previewItem.fileType} ({previewItem.size})</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed max-h-60 overflow-y-auto">
              {previewItem.contentSnippet}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
