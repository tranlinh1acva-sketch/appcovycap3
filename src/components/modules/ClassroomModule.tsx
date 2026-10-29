import React, { useState } from 'react';
import {
  Users,
  Plus,
  Upload,
  Download,
  Search,
  Edit2,
  Trash2,
  Send,
  BookOpen,
  CheckCircle2,
  Clock,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { Classroom, Student, Assignment } from '../../types';
import { exportStudentsToExcel } from '../../utils/exportXlsx';

interface ClassroomModuleProps {
  classes: Classroom[];
  students: Student[];
  assignments: Assignment[];
  onSaveClasses: (classes: Classroom[]) => void;
  onSaveStudents: (students: Student[]) => void;
  onSaveAssignments: (assignments: Assignment[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const ClassroomModule: React.FC<ClassroomModuleProps> = ({
  classes,
  students,
  assignments,
  onSaveClasses,
  onSaveStudents,
  onSaveAssignments,
  onShowToast,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [showClassNoticeModal, setShowClassNoticeModal] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');

  // New Student state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newStudentGroup, setNewStudentGroup] = useState('Tổ 1');

  // New Assignment state
  const [assignTitle, setAssignTitle] = useState('');
  const [assignType, setAssignType] = useState<'quiz' | 'essay' | 'exercise'>('quiz');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignDesc, setAssignDesc] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const filteredStudents = classStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    return matchSearch && matchGroup;
  });

  const classAssignments = assignments.filter((a) => a.classId === selectedClassId);

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: 'st_' + Date.now(),
      code: `HS-${currentClass.name}-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudentName.trim(),
      gender: newStudentGender,
      classId: selectedClassId,
      group: newStudentGroup,
      recentScore: 8.0,
      strongTopics: ['Lý thuyết cơ bản'],
      weakTopics: [],
      status: 'active',
      notes: 'Học sinh mới thêm vào lớp.',
    };

    const updated = [...students, newStudent];
    onSaveStudents(updated);
    setNewStudentName('');
    setShowAddStudentModal(false);
    onShowToast('success', 'Đã thêm học sinh thành công!', `Học sinh ${newStudent.name} đã được xếp vào ${newStudent.group}.`);
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    onSaveStudents(updated);
    onShowToast('info', 'Đã xóa học sinh khỏi danh sách lớp.');
  };

  // Add assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const newAssignment: Assignment = {
      id: 'as_' + Date.now(),
      title: assignTitle.trim(),
      classId: selectedClassId,
      dueDate: assignDueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      totalSubmissions: 0,
      totalStudents: classStudents.length,
      type: assignType,
      status: 'active',
      description: assignDesc,
    };

    onSaveAssignments([newAssignment, ...assignments]);
    setAssignTitle('');
    setAssignDesc('');
    setShowNewAssignmentModal(false);
    onShowToast('success', 'Đã giao bài tập mới cho lớp!', `Hạn nộp: ${new Date(newAssignment.dueDate).toLocaleDateString('vi-VN')}`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      exportStudentsToExcel(classStudents, currentClass.name);
      onShowToast('success', 'Đã xuất bảng điểm Excel thành công!', 'File Excel đang được tải về máy của cô.');
    } catch (err: any) {
      onShowToast('error', 'Lỗi xuất Excel', err.message);
    }
  };

  // CSV Import simulation
  const handleCSVImport = () => {
    const sampleImportNames = [
      { name: 'Nguyễn Văn Thái', gender: 'Nam' as const, group: 'Tổ 1' },
      { name: 'Lê Thuỳ Dung', gender: 'Nữ' as const, group: 'Tổ 2' },
      { name: 'Phạm Đức Huy', gender: 'Nam' as const, group: 'Tổ 3' },
    ];

    const newBatch: Student[] = sampleImportNames.map((s, idx) => ({
      id: 'st_imp_' + Date.now() + '_' + idx,
      code: `HS-${currentClass.name}-${Math.floor(100 + Math.random() * 900)}`,
      name: s.name,
      gender: s.gender,
      classId: selectedClassId,
      group: s.group,
      recentScore: 7.5,
      strongTopics: ['Kiến thức SGK'],
      weakTopics: [],
      status: 'active',
    }));

    onSaveStudents([...students, ...newBatch]);
    onShowToast('success', `Đã nhập thành công ${newBatch.length} học sinh từ file CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Module 7 · Quản Lý Lớp Học
            </span>
            <span className="text-xs text-slate-400">Trường THPT số 1 Tuy Phước</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Không Gian Quản Lý Lớp {currentClass?.name}
          </h2>
        </div>

        {/* Class Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedClassId === c.id
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Lớp {c.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
            title="Xuất danh sách học sinh và điểm số ra tệp Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-500">Sĩ số lớp</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {classStudents.length} học sinh
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-500">Mã lớp tham gia</span>
          <div className="text-xl font-black text-rose-600 mt-1 font-mono">
            {currentClass?.classCode}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-500">Bài tập đang giao</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {classAssignments.length} bài
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-500">Học sinh cần hỗ trợ</span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {classStudents.filter((s) => s.status === 'needs_help').length} em
          </div>
        </div>
      </div>

      {/* Main Grid: Student List & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Student Roster & Group Division */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên học sinh, mã HS..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Tổ Filter */}
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả các tổ</option>
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCSVImport}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                title="Nhập danh sách học sinh từ file CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập CSV</span>
              </button>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm học sinh</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Mã HS</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Tổ</th>
                  <th className="py-2.5 px-3">Điểm gần nhất</th>
                  <th className="py-2.5 px-3">Đánh giá tiến độ</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">{st.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {st.name}
                      <span className="text-[10px] font-normal text-slate-400 ml-1.5">
                        ({st.gender})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {st.group}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-black ${
                          st.recentScore >= 8.5
                            ? 'text-emerald-600'
                            : st.recentScore >= 6.5
                            ? 'text-blue-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {st.recentScore} đ
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {st.status === 'excellent' ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Xuất sắc
                        </span>
                      ) : st.status === 'needs_help' ? (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                          Cần cô Vy phụ đạo
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Đạt yêu cầu</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteStudent(st.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Assignments & Class Notices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assignment Management */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-500" />
                Giao bài tập cho lớp
              </h3>
              <button
                onClick={() => setShowNewAssignmentModal(true)}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                + Giao bài mới
              </button>
            </div>

            <div className="space-y-2.5">
              {classAssignments.map((as) => (
                <div
                  key={as.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200">{as.title}</div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Hạn nộp: {new Date(as.dueDate).toLocaleDateString('vi-VN')}</span>
                    <span className="font-semibold text-emerald-600">
                      Đã nộp: {as.totalSubmissions}/{as.totalStudents}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice to Class */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Send className="w-4 h-4 text-blue-500" />
              Gửi thông báo đến lớp {currentClass?.name}
            </h3>
            <textarea
              rows={3}
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở học sinh (VD: Các em nhớ ôn tập lý thuyết đạo hàm trước tiết học ngày mai)..."
              className="w-full text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
            <button
              onClick={() => {
                if (!noticeContent.trim()) return;
                onShowToast('success', `Đã gửi thông báo đến học sinh lớp ${currentClass.name}!`);
                setNoticeContent('');
              }}
              className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Phát thông báo cho lớp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Thêm học sinh vào lớp {currentClass.name}
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="VD: Nguyễn Bảo Long..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Giới tính</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tổ sinh hoạt</label>
                  <select
                    value={newStudentGroup}
                    onChange={(e) => setNewStudentGroup(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Tổ 1">Tổ 1</option>
                    <option value="Tổ 2">Tổ 2</option>
                    <option value="Tổ 3">Tổ 3</option>
                    <option value="Tổ 4">Tổ 4</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Giao bài tập mới cho lớp {currentClass.name}
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tiêu đề bài tập</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="VD: Phiếu rèn luyện Đạo hàm số 2..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hình thức</label>
                  <select
                    value={assignType}
                    onChange={(e) => setAssignType(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="quiz">Trắc nghiệm trực tuyến</option>
                    <option value="essay">Tự luận / Tình huống</option>
                    <option value="exercise">Bài tập tự luyện SGK</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hạn nộp bài</label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả nhiệm vụ & Hướng dẫn</label>
                <textarea
                  rows={3}
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  placeholder="Hướng dẫn học sinh các bước làm bài và tài liệu tham khảo..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
