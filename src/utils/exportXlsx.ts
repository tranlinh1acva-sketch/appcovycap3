import * as XLSX from 'xlsx';
import { Student, ExamSubmission } from '../types';

export function exportStudentsToExcel(students: Student[], className: string): void {
  const rows = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã học sinh': s.code,
    'Họ và tên': s.name,
    'Giới tính': s.gender,
    'Tổ': s.group,
    'Điểm kiểm tra gần nhất': s.recentScore,
    'Thế mạnh': s.strongTopics.join(', '),
    'Cần bổ trợ': s.weakTopics.join(', '),
    'Trạng thái': s.status === 'excellent' ? 'Xuất sắc' : s.status === 'needs_help' ? 'Cần hỗ trợ' : 'Đạt yêu cầu',
    'Ghi chú của giáo viên': s.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Danh sách ${className}`);

  const filename = `Bang_Diem_Hoc_Sinh_${className}_THPT1TuyPhuoc.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportExamResultsToExcel(
  submissions: ExamSubmission[],
  examTitle: string
): void {
  const rows = submissions.map((sub, idx) => ({
    'STT': idx + 1,
    'Họ và tên học sinh': sub.studentName,
    'Lớp': sub.className,
    'Điểm số': sub.score,
    'Thang điểm': sub.maxScore,
    'Thời gian nộp bài': new Date(sub.submittedAt).toLocaleString('vi-VN'),
    'Nhận xét sư phạm': sub.feedback || 'Đạt yêu cầu chuẩn kiến thức kỹ năng',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kết quả kiểm tra');

  const filename = `Ket_Qua_${examTitle.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
