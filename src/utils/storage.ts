import {
  UserProfile,
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
} from '../types';
import {
  INITIAL_TEACHER,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_LESSON_PLANS,
  INITIAL_SLIDES,
  INITIAL_QUESTIONS,
  INITIAL_RESOURCES,
  INITIAL_EVIDENCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
} from '../data/initialData';

const KEYS = {
  TEACHER: 'vy_edu_teacher_profile',
  CLASSES: 'vy_edu_classes',
  STUDENTS: 'vy_edu_students',
  LESSONS: 'vy_edu_lesson_plans',
  SLIDES: 'vy_edu_slides',
  QUESTIONS: 'vy_edu_questions',
  RESOURCES: 'vy_edu_resources',
  EVIDENCE: 'vy_edu_evidence',
  ASSIGNMENTS: 'vy_edu_assignments',
  EXAMS: 'vy_edu_exams',
  SUBMISSIONS: 'vy_edu_submissions',
  DARK_MODE: 'vy_edu_dark_mode',
  CURRENT_ROLE: 'vy_edu_current_role',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

export const Storage = {
  getTeacherProfile: (): UserProfile => {
    const profile = getItem(KEYS.TEACHER, INITIAL_TEACHER);
    if (!profile.avatar || profile.avatar.includes('unsplash.com')) {
      profile.avatar = '/assets/aistudio/image_07a86345.png';
      setItem(KEYS.TEACHER, profile);
    }
    return profile;
  },
  saveTeacherProfile: (profile: UserProfile): void => setItem(KEYS.TEACHER, profile),

  getClasses: (): Classroom[] => getItem(KEYS.CLASSES, INITIAL_CLASSES),
  saveClasses: (classes: Classroom[]): void => setItem(KEYS.CLASSES, classes),

  getStudents: (): Student[] => getItem(KEYS.STUDENTS, INITIAL_STUDENTS),
  saveStudents: (students: Student[]): void => setItem(KEYS.STUDENTS, students),

  getLessonPlans: (): LessonPlan[] => getItem(KEYS.LESSONS, INITIAL_LESSON_PLANS),
  saveLessonPlans: (plans: LessonPlan[]): void => setItem(KEYS.LESSONS, plans),

  getSlideDecks: (): SlideDeck[] => getItem(KEYS.SLIDES, [INITIAL_SLIDES]),
  saveSlideDecks: (decks: SlideDeck[]): void => setItem(KEYS.SLIDES, decks),

  getQuestions: (): Question[] => getItem(KEYS.QUESTIONS, INITIAL_QUESTIONS),
  saveQuestions: (questions: Question[]): void => setItem(KEYS.QUESTIONS, questions),

  getResources: (): ResourceItem[] => getItem(KEYS.RESOURCES, INITIAL_RESOURCES),
  saveResources: (resources: ResourceItem[]): void => setItem(KEYS.RESOURCES, resources),

  getEvidence: (): EvidenceRecord[] => getItem(KEYS.EVIDENCE, INITIAL_EVIDENCE),
  saveEvidence: (evidence: EvidenceRecord[]): void => setItem(KEYS.EVIDENCE, evidence),

  getAssignments: (): Assignment[] => getItem(KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
  saveAssignments: (assignments: Assignment[]): void => setItem(KEYS.ASSIGNMENTS, assignments),

  getExams: (): Exam[] => getItem(KEYS.EXAMS, INITIAL_EXAMS),
  saveExams: (exams: Exam[]): void => setItem(KEYS.EXAMS, exams),

  getSubmissions: (): ExamSubmission[] => getItem(KEYS.SUBMISSIONS, []),
  saveSubmissions: (submissions: ExamSubmission[]): void => setItem(KEYS.SUBMISSIONS, submissions),

  getDarkMode: (): boolean => {
    try {
      const val = localStorage.getItem(KEYS.DARK_MODE);
      return val === 'true';
    } catch {
      return false;
    }
  },
  setDarkMode: (enabled: boolean): void => {
    try {
      localStorage.setItem(KEYS.DARK_MODE, enabled ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  },

  getCurrentRole: (): 'teacher' | 'student' | 'admin' => {
    try {
      const r = localStorage.getItem(KEYS.CURRENT_ROLE);
      if (r === 'teacher' || r === 'student' || r === 'admin') return r;
      return 'teacher';
    } catch {
      return 'teacher';
    }
  },
  setCurrentRole: (role: 'teacher' | 'student' | 'admin'): void => {
    try {
      localStorage.setItem(KEYS.CURRENT_ROLE, role);
    } catch (e) {
      console.warn(e);
    }
  },
};
