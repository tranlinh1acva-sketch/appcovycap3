import React, { useState, useEffect } from 'react';
import { Storage } from './utils/storage';
import {
  UserProfile,
  UserRole,
  Classroom,
  Student,
  LessonPlan,
  SlideDeck,
  Question,
  ResourceItem,
  EvidenceRecord,
  Assignment,
  Exam,
  ExamSubmission,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ToastContainer, ToastMessage } from './components/Toast';

// Module components
import { DashboardModule } from './components/modules/DashboardModule';
import { LessonPlanModule } from './components/modules/LessonPlanModule';
import { SlidesModule } from './components/modules/SlidesModule';
import { QuestionBankModule } from './components/modules/QuestionBankModule';
import { InteractiveGamesModule } from './components/modules/InteractiveGamesModule';
import { AiMentorModule } from './components/modules/AiMentorModule';
import { ClassroomModule } from './components/modules/ClassroomModule';
import { AssessmentModule } from './components/modules/AssessmentModule';
import { PersonalizedLearningModule } from './components/modules/PersonalizedLearningModule';
import { ResourceLibraryModule } from './components/modules/ResourceLibraryModule';
import { EvidenceReportModule } from './components/modules/EvidenceReportModule';
import { TeacherProfileModule } from './components/modules/TeacherProfileModule';
import { AdminSettingsModule } from './components/modules/AdminSettingsModule';
import { StudentPortal } from './components/modules/StudentPortal';

export default function App() {
  // Persistent state backed by safe Storage wrapper
  const [user, setUser] = useState<UserProfile>(Storage.getTeacherProfile);
  const [currentRole, setCurrentRole] = useState<UserRole>(Storage.getCurrentRole);
  const [classes, setClasses] = useState<Classroom[]>(Storage.getClasses);
  const [students, setStudents] = useState<Student[]>(Storage.getStudents);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(Storage.getLessonPlans);
  const [slideDecks, setSlideDecks] = useState<SlideDeck[]>(Storage.getSlideDecks);
  const [questions, setQuestions] = useState<Question[]>(Storage.getQuestions);
  const [resources, setResources] = useState<ResourceItem[]>(Storage.getResources);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(Storage.getEvidence);
  const [assignments, setAssignments] = useState<Assignment[]>(Storage.getAssignments);
  const [exams, setExams] = useState<Exam[]>(Storage.getExams);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(Storage.getSubmissions);

  // App UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(Storage.getDarkMode);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.setDarkMode(darkMode);
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    Storage.setCurrentRole(role);
    addToast('info', `Đã chuyển sang vai trò: ${role === 'teacher' ? 'Giáo viên (Cô Nguyễn Thị Minh Vy)' : role === 'student' ? 'Học sinh' : 'Quản trị viên'}`);
  };

  const addToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string
  ) => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State persistence updaters
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    Storage.saveTeacherProfile(updatedProfile);
  };

  const handleSavePlan = (plan: LessonPlan) => {
    const exists = lessonPlans.some((p) => p.id === plan.id);
    const updated = exists
      ? lessonPlans.map((p) => (p.id === plan.id ? plan : p))
      : [plan, ...lessonPlans];
    setLessonPlans(updated);
    Storage.saveLessonPlans(updated);
  };

  const handleSaveDeck = (deck: SlideDeck) => {
    const exists = slideDecks.some((d) => d.id === deck.id);
    const updated = exists
      ? slideDecks.map((d) => (d.id === deck.id ? deck : d))
      : [deck, ...slideDecks];
    setSlideDecks(updated);
    Storage.saveSlideDecks(updated);
  };

  const handleSaveQuestions = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
    Storage.saveQuestions(updatedQuestions);
  };

  const handleSaveClasses = (updatedClasses: Classroom[]) => {
    setClasses(updatedClasses);
    Storage.saveClasses(updatedClasses);
  };

  const handleSaveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    Storage.saveStudents(updatedStudents);
  };

  const handleSaveAssignments = (updatedAssignments: Assignment[]) => {
    setAssignments(updatedAssignments);
    Storage.saveAssignments(updatedAssignments);
  };

  const handleSaveExams = (updatedExams: Exam[]) => {
    setExams(updatedExams);
    Storage.saveExams(updatedExams);
  };

  const handleSaveSubmissions = (updatedSubmissions: ExamSubmission[]) => {
    setSubmissions(updatedSubmissions);
    Storage.saveSubmissions(updatedSubmissions);
  };

  const handleSaveEvidence = (updatedEvidence: EvidenceRecord[]) => {
    setEvidenceList(updatedEvidence);
    Storage.saveEvidence(updatedEvidence);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-['Be_Vietnam_Pro'] antialiased">
      {/* Top Navbar */}
      <Navbar
        user={user}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        onOpenProfile={() => setActiveTab('teacher-profile')}
      />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          role={currentRole}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-64 w-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-y-auto">
          {/* Role Banner if not teacher */}
          {currentRole === 'student' && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
              <span>
                🎓 <strong>Đang ở giao diện học sinh:</strong> Học sinh khối 10, 11, 12 Trường THPT số 1 Tuy Phước.
              </span>
              <button
                onClick={() => handleRoleChange('teacher')}
                className="underline font-bold hover:text-blue-700"
              >
                Trở lại góc nhìn cô Vy
              </button>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <span>
                🛡️ <strong>Đang ở giao diện Quản trị viên:</strong> Giám sát an toàn hệ thống và bảo mật dữ liệu.
              </span>
              <button
                onClick={() => handleRoleChange('teacher')}
                className="underline font-bold hover:text-amber-700"
              >
                Trở lại góc nhìn cô Vy
              </button>
            </div>
          )}

          {/* View rendering based on activeTab and currentRole */}
          {currentRole === 'student' && activeTab === 'dashboard' ? (
            <StudentPortal
              onNavigate={setActiveTab}
              assignments={assignments}
              exams={exams}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardModule
              user={user}
              classes={classes}
              students={students}
              lessons={lessonPlans}
              exams={exams}
              onNavigate={setActiveTab}
            />
          ) : activeTab === 'lesson-plan' ? (
            <LessonPlanModule
              plans={lessonPlans}
              onSavePlan={handleSavePlan}
              onShowToast={addToast}
            />
          ) : activeTab === 'slides' ? (
            <SlidesModule
              decks={slideDecks}
              onSaveDeck={handleSaveDeck}
              onShowToast={addToast}
            />
          ) : activeTab === 'question-bank' ? (
            <QuestionBankModule
              questions={questions}
              onSaveQuestions={handleSaveQuestions}
              onShowToast={addToast}
            />
          ) : activeTab === 'games' ? (
            <InteractiveGamesModule
              students={students}
              onShowToast={addToast}
            />
          ) : activeTab === 'ai-mentor' ? (
            <AiMentorModule onShowToast={addToast} />
          ) : activeTab === 'classroom' ? (
            <ClassroomModule
              classes={classes}
              students={students}
              assignments={assignments}
              onSaveClasses={handleSaveClasses}
              onSaveStudents={handleSaveStudents}
              onSaveAssignments={handleSaveAssignments}
              onShowToast={addToast}
            />
          ) : activeTab === 'assessment' ? (
            <AssessmentModule
              exams={exams}
              questions={questions}
              students={students}
              submissions={submissions}
              onSaveExams={handleSaveExams}
              onSaveSubmissions={handleSaveSubmissions}
              onShowToast={addToast}
            />
          ) : activeTab === 'personalized' ? (
            <PersonalizedLearningModule
              students={students}
              onShowToast={addToast}
            />
          ) : activeTab === 'library' ? (
            <ResourceLibraryModule
              resources={resources}
              onShowToast={addToast}
            />
          ) : activeTab === 'evidence' ? (
            <EvidenceReportModule
              evidenceList={evidenceList}
              onSaveEvidence={handleSaveEvidence}
              onShowToast={addToast}
            />
          ) : activeTab === 'teacher-profile' ? (
            <TeacherProfileModule
              user={user}
              onSaveProfile={handleSaveProfile}
              onShowToast={addToast}
            />
          ) : activeTab === 'admin-settings' ? (
            <AdminSettingsModule
              onResetData={handleResetData}
              onShowToast={addToast}
            />
          ) : (
            <DashboardModule
              user={user}
              classes={classes}
              students={students}
              lessons={lessonPlans}
              exams={exams}
              onNavigate={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
