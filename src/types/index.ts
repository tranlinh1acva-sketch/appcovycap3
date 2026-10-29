export type UserRole = 'teacher' | 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  school: string;
  subject?: string;
  classes?: string[];
  bio?: string;
  motto?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  textbook: string;
  duration: string;
  objectives: string;
  method: string;
  classTraits?: string;
  sections: LessonSection[];
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  points: string[];
  layout: 'title' | 'bullets' | 'challenge' | 'content' | 'steps' | 'summary';
  notes?: string;
}

export interface SlideDeck {
  id: string;
  title: string;
  subject: string;
  grade: string;
  themeColor: string;
  slides: SlideItem[];
  createdAt: string;
}

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'case_study';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  level: CognitiveLevel;
  subject: string;
  grade: string;
  topic: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  createdAt: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // 0-based index or string
  explanation?: string;
  category?: string;
  timeLimit?: number; // seconds
}

export interface CrosswordRow {
  rowNumber: number;
  hint: string;
  answer: string;
  keyIndex: number; // index of key letter in answer
}

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

export interface Student {
  id: string;
  code: string; // e.g. HS-1101
  name: string;
  gender: 'Nam' | 'Nữ';
  classId: string;
  group: string; // Tổ 1, 2, 3, 4
  recentScore: number;
  weakTopics: string[];
  strongTopics: string[];
  status: 'active' | 'needs_help' | 'excellent';
  notes?: string;
}

export interface Classroom {
  id: string;
  name: string; // e.g. "11A1"
  grade: '10' | '11' | '12';
  schoolYear: string;
  studentCount: number;
  classCode: string; // e.g. "VY11A1"
  homeroomTeacher: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  dueDate: string;
  totalSubmissions: number;
  totalStudents: number;
  type: 'quiz' | 'essay' | 'exercise';
  status: 'active' | 'closed';
  description?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
  classId?: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  className: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  answers: Record<string, string>;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'giáo án' | 'slide' | 'phiếu học tập' | 'đề thi' | 'trò chơi' | 'tài liệu';
  subject: string;
  grade: string;
  fileType: string;
  size: string;
  author: string;
  downloadCount: number;
  contentSnippet?: string;
  dateAdded: string;
}

export interface EvidenceRecord {
  id: string;
  title: string;
  date: string;
  category: 'Kế hoạch GD' | 'Sản phẩm bài giảng' | 'Khảo sát học sinh' | 'Kết quả đối sánh' | 'Ý kiến chuyên môn';
  description: string;
  metrics?: {
    beforePercent: number;
    afterPercent: number;
    unit: string;
    sampleSize: number;
  };
  verifier: string;
  verified: boolean;
}
