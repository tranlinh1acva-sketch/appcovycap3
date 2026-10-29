import React, { useState } from 'react';
import {
  Shield,
  Key,
  Database,
  Lock,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileText,
} from 'lucide-react';

interface AdminSettingsProps {
  onResetData: () => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const AdminSettingsModule: React.FC<AdminSettingsProps> = ({
  onResetData,
  onShowToast,
}) => {
  const [auditLogs] = useState([
    { time: '29/10/2026 08:15', user: 'Cô Nguyễn Thị Minh Vy', action: 'Tạo kế hoạch bài dạy chuẩn 5512 Đạo hàm Toán 11', ip: '192.168.1.45' },
    { time: '29/10/2026 08:02', user: 'Học sinh Trần Nguyễn Khánh An', action: 'Hoàn thành bài kiểm tra 15 phút (Điểm 9.0)', ip: '113.161.72.18' },
    { time: '28/10/2026 16:30', user: 'Quản trị viên THPT số 1 Tuy Phước', action: 'Sao lưu cơ sở dữ liệu định kỳ tuần 4', ip: '192.168.1.1' },
    { time: '28/10/2026 14:10', user: 'Cô Nguyễn Thị Minh Vy', action: 'Xuất danh sách điểm lớp 11A1 ra tệp Excel', ip: '192.168.1.45' },
  ]);

  const handleBackup = () => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vy_edu_')) {
          allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        }
      }
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sao_Luu_VY_EDU_AI_THPT1TuyPhuoc_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('success', 'Đã tải tệp sao lưu hệ thống JSON về máy an toàn!');
    } catch (e: any) {
      onShowToast('error', 'Lỗi sao lưu', e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
              Quản Trị Hệ Thống
            </span>
            <span className="text-xs text-slate-400">Bảo mật thông tin & Nhật ký hoạt động</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Trung Tâm Điều Hành & An Ninh Dữ Liệu
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & API Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Server className="w-4 h-4 text-emerald-500" />
            Cấu hình bảo mật & Kết nối máy chủ
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Kiến trúc AI Server-Side Proxy
                </div>
                <div className="text-[11px] text-slate-400">
                  Khóa API bảo vệ trên Node/Express server, không lộ trình duyệt.
                </div>
              </div>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn an toàn
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Bảo vệ dữ liệu cá nhân học sinh
                </div>
                <div className="text-[11px] text-slate-400">
                  Không lưu CCCD, số điện thoại, địa chỉ nhà công khai.
                </div>
              </div>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuân thủ
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Phân quyền 3 vai trò
                </div>
                <div className="text-[11px] text-slate-400">
                  Giáo viên, Học sinh, Quản trị viên trường THPT số 1 Tuy Phước.
                </div>
              </div>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-4 h-4 text-blue-500" />
            Sao lưu & Khôi phục dữ liệu
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Cho phép tải xuống bản sao lưu toàn bộ dữ liệu gồm kế hoạch bài dạy, ngân hàng đề thi, danh sách học sinh và kết quả kiểm tra.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tải file sao lưu hệ thống (.json)</span>
            </button>

            <button
              onClick={onResetData}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi phục dữ liệu minh họa chuẩn</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FileText className="w-4 h-4 text-slate-500" />
          Nhật ký hoạt động hệ thống (Audit Log)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Người dùng</th>
                <th className="py-2.5 px-3">Hành động ghi nhận</th>
                <th className="py-2.5 px-3">Địa chỉ mạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.time}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{log.user}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.action}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
