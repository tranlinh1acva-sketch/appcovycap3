import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Timer,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Play,
  CheckCircle2,
  XCircle,
  Award,
  Volume2,
  Users,
  Grid,
  Zap,
  ArrowRight,
  Shuffle,
  Eye,
} from 'lucide-react';
import { Student } from '../../types';

interface InteractiveGamesModuleProps {
  students: Student[];
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

type GameType = 'olympia' | 'millionaire' | 'wheel' | 'matching' | 'crossword' | 'arena';

export const InteractiveGamesModule: React.FC<InteractiveGamesModuleProps> = ({
  students,
  onShowToast,
}) => {
  const [activeGame, setActiveGame] = useState<GameType>('olympia');

  // Trigger confetti burst
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback safe
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Game Navigation Hub */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                Module 5 · Trò Chơi Tương Tác
              </span>
              <span className="text-xs text-slate-400">Tối thiểu 6 trò chơi hoạt động thực tế</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Đấu Trường Học Tập & Gamification Sư Phạm
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Có đầy đủ hướng dẫn · Bắt đầu · Chơi trực tiếp · Bảng điểm
          </div>
        </div>

        {/* 6 Game Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setActiveGame('olympia')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'olympia'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-center">1. Đỉnh tri thức</span>
          </button>

          <button
            onClick={() => setActiveGame('millionaire')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'millionaire'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-center">2. Triệu phú học đường</span>
          </button>

          <button
            onClick={() => setActiveGame('wheel')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'wheel'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <Shuffle className="w-5 h-5" />
            <span className="text-center">3. Vòng quay may mắn</span>
          </button>

          <button
            onClick={() => setActiveGame('matching')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'matching'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-center">4. Ghép đôi tri thức</span>
          </button>

          <button
            onClick={() => setActiveGame('crossword')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'crossword'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-center">5. Ô chữ bí mật</span>
          </button>

          <button
            onClick={() => setActiveGame('arena')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
              activeGame === 'arena'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/30'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-center">6. Đấu trường trí tuệ</span>
          </button>
        </div>
      </div>

      {/* Render selected active game */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[500px]">
        {activeGame === 'olympia' && <OlympiaGame onWin={triggerConfetti} />}
        {activeGame === 'millionaire' && <MillionaireGame onWin={triggerConfetti} />}
        {activeGame === 'wheel' && <LuckyWheelGame students={students} onWin={triggerConfetti} />}
        {activeGame === 'matching' && <MatchingGame onWin={triggerConfetti} />}
        {activeGame === 'crossword' && <CrosswordGame onWin={triggerConfetti} />}
        {activeGame === 'arena' && <ArenaLiveGame onWin={triggerConfetti} />}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: ĐƯỜNG LÊN ĐỈNH TRI THỨC
   ========================================================================= */
const OlympiaGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [stage, setStage] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentRound, setCurrentRound] = useState(0); // 0: Khởi động, 1: VCNV, 2: Tăng tốc, 3: Về đích
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const rounds = [
    {
      name: 'Chặng 1: Khởi động',
      timePerQ: 15,
      point: 10,
      questions: [
        {
          q: 'Đạo hàm của hàm số y = C (hằng số) bằng bao nhiêu?',
          options: ['A. 0', 'B. 1', 'C. C', 'D. x'],
          ans: 0,
          exp: 'Đạo hàm của hằng số luôn bằng 0.',
        },
        {
          q: 'Công thức đạo hàm của y = xⁿ (n ∈ ℕ*) là gì?',
          options: ['A. n·xⁿ', 'B. n·xⁿ⁻¹', 'C. xⁿ⁻¹', 'D. (n-1)·xⁿ'],
          ans: 1,
          exp: '(xⁿ)\' = n·xⁿ⁻¹.',
        },
      ],
    },
    {
      name: 'Chặng 2: Vượt chướng ngại vật',
      timePerQ: 20,
      point: 20,
      questions: [
        {
          q: 'Hệ số góc k của tiếp tuyến đồ thị hàm số y = f(x) tại điểm x₀ là gì?',
          options: ['A. f(x₀)', 'B. f\'(x₀)', 'C. f\'\'(x₀)', 'D. 1/f\'(x₀)'],
          ans: 1,
          exp: 'Theo ý nghĩa hình học, hệ số góc tiếp tuyến là f\'(x₀).',
        },
      ],
    },
    {
      name: 'Chặng 3: Tăng tốc',
      timePerQ: 25,
      point: 30,
      questions: [
        {
          q: 'Một vật chuyển động có s(t) = 4t² + 2t. Vận tốc tức thời v(2) bằng bao nhiêu?',
          options: ['A. 16 m/s', 'B. 18 m/s', 'C. 20 m/s', 'D. 10 m/s'],
          ans: 1,
          exp: 'v(t) = s\'(t) = 8t + 2. Với t = 2: v(2) = 8*2 + 2 = 18 m/s.',
        },
      ],
    },
    {
      name: 'Chặng 4: Về đích',
      timePerQ: 30,
      point: 40,
      questions: [
        {
          q: 'Phương trình tiếp tuyến của y = x³ tại điểm M(1; 1) là gì?',
          options: ['A. y = 3x - 2', 'B. y = 3x + 2', 'C. y = x', 'D. y = 2x - 1'],
          ans: 0,
          exp: 'y\' = 3x², y\'(1) = 3. Pttt: y - 1 = 3(x - 1) <=> y = 3x - 2.',
        },
      ],
    },
  ];

  const currentRoundData = rounds[currentRound];
  const currentQ = currentRoundData?.questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (stage !== 'playing' || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft, isAnswered]);

  const startGame = () => {
    setCurrentRound(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(rounds[0].timePerQ);
    setSelectedOption(null);
    setIsAnswered(false);
    setStage('playing');
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(idx);

    if (idx === currentQ.ans) {
      setScore((prev) => prev + currentRoundData.point);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex + 1 < currentRoundData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(currentRoundData.timePerQ);
    } else if (currentRound + 1 < rounds.length) {
      setCurrentRound((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setTimeLeft(rounds[currentRound + 1].timePerQ);
    } else {
      setStage('result');
      onWin();
    }
  };

  if (stage === 'intro') {
    return (
      <div className="text-center py-8 max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Đường Lên Đỉnh Tri Thức
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Học sinh trải qua 4 chặng thi đua khốc liệt: <strong>Khởi động</strong>, <strong>Vượt chướng ngại vật</strong>, <strong>Tăng tốc</strong> và <strong>Về đích</strong>. Mỗi câu hỏi có đồng hồ đếm ngược, vượt qua để giành vòng nguyệt quế tri thức!
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5">
          <div className="font-bold text-slate-800 dark:text-slate-200">Luật chơi:</div>
          <div>· Khởi động: 10 điểm / câu (15 giây)</div>
          <div>· Vượt chướng ngại vật: 20 điểm / câu (20 giây)</div>
          <div>· Tăng tốc: 30 điểm / câu (25 giây)</div>
          <div>· Về đích: 40 điểm / câu (30 giây)</div>
        </div>
        <button
          onClick={startGame}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 mx-auto transition-transform hover:scale-105"
        >
          <Play className="w-4 h-4 fill-white" />
          Bắt đầu chinh phục đỉnh tri thức
        </button>
      </div>
    );
  }

  if (stage === 'result') {
    return (
      <div className="text-center py-10 max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto border-2 border-amber-500/40">
          <Award className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Chúc Mừng Hoàn Thành!
        </h3>
        <div className="text-4xl font-extrabold text-rose-600 dark:text-rose-400">
          {score} <span className="text-base text-slate-400 font-normal">điểm</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {score >= 80
            ? 'Tuyệt vời! Em đã xuất sắc chạm tay vào vòng nguyệt quế tri thức!'
            : 'Em đã nỗ lực rất tốt! Hãy tiếp tục ôn tập để đạt điểm tuyệt đối nhé.'}
        </p>
        <button
          onClick={startGame}
          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> Chơi lại lần nữa
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Round & Timer Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
            {currentRoundData.name}
          </span>
          <div className="text-xs text-slate-500">
            Điểm tích lũy: <strong className="text-slate-900 dark:text-white">{score}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-mono font-bold text-sm">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="text-xs text-amber-400 uppercase font-semibold">
          Câu hỏi giá trị {currentRoundData.point} điểm
        </div>
        <h4 className="text-base md:text-lg font-bold leading-relaxed">{currentQ.q}</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            let style = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
            if (isAnswered) {
              if (idx === currentQ.ans) {
                style = 'bg-emerald-600 text-white border-emerald-500 font-bold';
              } else if (idx === selectedOption) {
                style = 'bg-rose-600 text-white border-rose-500';
              } else {
                style = 'bg-slate-800/40 text-slate-500 border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`p-3.5 rounded-xl border text-xs text-left transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              {selectedOption === currentQ.ans ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Chính xác! (+{currentRoundData.point} điểm)
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Chưa chính xác! {currentQ.exp}
                </span>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              Câu tiếp theo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: AI LÀ TRIỆU PHÚ HỌC ĐƯỜNG
   ========================================================================= */
const MillionaireGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [level, setLevel] = useState(0); // 0 to 14
  const [stage, setStage] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [used5050, setUsed5050] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // 15 progressive difficulty questions
  const quizList = [
    { q: 'Câu 1: Hàm số y = 5 có đạo hàm bằng bao nhiêu?', options: ['A. 5', 'B. 0', 'C. 1', 'D. x'], ans: 1, exp: 'Đạo hàm hằng số = 0.' },
    { q: 'Câu 2: Đạo hàm của hàm số y = 3x là gì?', options: ['A. 3', 'B. 3x', 'C. x', 'D. 0'], ans: 0, exp: '(kx)\' = k.' },
    { q: 'Câu 3: Đạo hàm của y = x² tại x = 3 là bao nhiêu?', options: ['A. 3', 'B. 6', 'C. 9', 'D. 12'], ans: 1, exp: 'y\' = 2x => y\'(3) = 6.' },
    { q: 'Câu 4: Vận tốc tức thời v(t) của chuyển động s(t) được định nghĩa là gì?', options: ['A. s(t)/t', 'B. s\'(t)', 'C. s\'\'(t)', 'D. (s(t))²'], ans: 1, exp: 'v(t) = s\'(t).' },
    { q: 'Câu 5: (Mốc 1) Điểm M(x₀; y₀) thuộc đồ thị y = f(x). Tiếp tuyến tại M có hệ số góc bằng gì?', options: ['A. f(x₀)', 'B. f\'(x₀)', 'C. y₀/x₀', 'D. 0'], ans: 1, exp: 'k = f\'(x₀).' },
    { q: 'Câu 6: Đạo hàm của hàm số y = sin(x) là gì?', options: ['A. -cos(x)', 'B. cos(x)', 'C. -sin(x)', 'D. tan(x)'], ans: 1, exp: '(sin x)\' = cos x.' },
    { q: 'Câu 7: Đạo hàm của hàm số y = cos(x) là gì?', options: ['A. -sin(x)', 'B. sin(x)', 'C. cos(x)', 'D. -cos(x)'], ans: 0, exp: '(cos x)\' = -sin x.' },
    { q: 'Câu 8: Quy tắc tính đạo hàm của tích (u·v)\' là gì?', options: ['A. u\'·v\'', 'B. u\'v + uv\'', 'C. u\'v - uv\'', 'D. uv + u\'v\''], ans: 1, exp: '(uv)\' = u\'v + uv\'.' },
    { q: 'Câu 9: Phương trình tiếp tuyến tại M(x₀; y₀) là gì?', options: ['A. y = k(x - x₀) + y₀', 'B. y = k(x + x₀) + y₀', 'C. y = kx + y₀', 'D. y - y₀ = k(x + x₀)'], ans: 0, exp: 'y - y₀ = k(x - x₀).' },
    { q: 'Câu 10: (Mốc 2) Đạo hàm cấp hai s\'\'(t) của quãng đường biểu thị đại lượng vật lý nào?', options: ['A. Vận tốc', 'B. Gia tốc tức thời', 'C. Động lượng', 'D. Công cơ học'], ans: 1, exp: 'a(t) = v\'(t) = s\'\'(t).' },
    { q: 'Câu 11: Đạo hàm của hàm hợp y = f(u(x)) tính theo công thức nào?', options: ['A. f\'(u)', 'B. f\'(u) · u\'(x)', 'C. f\'(x)', 'D. u\'(x) / f(u)'], ans: 1, exp: 'y\'_x = y\'_u · u\'_x.' },
    { q: 'Câu 12: Đạo hàm của hàm số y = 1/x là gì?', options: ['A. -1/x²', 'B. 1/x²', 'C. ln(x)', 'D. -1/x'], ans: 0, exp: '(1/x)\' = -1/x².' },
    { q: 'Câu 13: Đạo hàm của hàm số y = √x với x > 0 là gì?', options: ['A. 1/(2√x)', 'B. 2√x', 'C. 1/√x', 'D. 1/(4x)'], ans: 0, exp: '(√x)\' = 1/(2√x).' },
    { q: 'Câu 14: Tiếp tuyến của y = x³ - 3x tại x = 0 tạo với trục hoành một góc bằng bao nhiêu?', options: ['A. 45°', 'B. 120°', 'C. 135°', 'D. 60°'], ans: 1, exp: 'k = y\'(0) = -3 => tan α = -3.' },
    { q: 'Câu 15: (Đỉnh cao 100 Triệu) Ý nghĩa kinh tế của đạo hàm là khái niệm nào?', options: ['A. Chi phí cận biên & Doanh thu cận biên', 'B. Lợi nhuận trung bình', 'C. Tổng chi phí cố định', 'D. Tỉ suất chiết khấu ngân hàng'], ans: 0, exp: 'Trong kinh tế học, đạo hàm của hàm chi phí C(x) là Marginal Cost (Chi phí cận biên).' },
  ];

  const prizeLevels = [
    '200.000', '400.000', '600.000', '1.000.000', '2.000.000 (Mốc 1)',
    '3.000.000', '6.000.000', '10.000.000', '14.000.000', '22.000.000 (Mốc 2)',
    '30.000.000', '40.000.000', '60.000.000', '85.000.000', '150.000.000 (Đỉnh cao)',
  ];

  const currentQ = quizList[level];

  const handleStart = () => {
    setLevel(0);
    setUsed5050(false);
    setUsedHint(false);
    setHintText(null);
    setHiddenOptions([]);
    setSelectedIdx(null);
    setStage('playing');
  };

  const handleUse5050 = () => {
    if (used5050 || stage !== 'playing') return;
    setUsed5050(true);
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.ans);
    // Hide 2 wrong options
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleUseHint = () => {
    if (usedHint || stage !== 'playing') return;
    setUsedHint(true);
    setHintText(`Gợi ý sư phạm từ cô Vy: ${currentQ.exp}`);
  };

  const handleSelectAnswer = (idx: number) => {
    setSelectedIdx(idx);
    if (idx === currentQ.ans) {
      if (level + 1 === quizList.length) {
        setStage('victory');
        onWin();
      } else {
        setTimeout(() => {
          setLevel((prev) => prev + 1);
          setSelectedIdx(null);
          setHiddenOptions([]);
          setHintText(null);
        }, 1200);
      }
    } else {
      setTimeout(() => {
        setStage('gameover');
      }, 1200);
    }
  };

  if (stage === 'intro') {
    return (
      <div className="text-center py-8 max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center mx-auto shadow-xl border border-indigo-800">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Ai Là Triệu Phú Học Đường
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          15 câu hỏi toán học với độ khó tăng dần từ Nhận biết đến Vận dụng cao. 2 quyền trợ giúp sư phạm: <strong>50:50</strong> và <strong>Gợi ý từ cô Vy</strong>. Vượt qua 15 câu để trở thành Triệu phú tri thức!
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-900 to-blue-900 hover:from-indigo-800 hover:to-blue-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <Play className="w-4 h-4 fill-white" />
          Bắt đầu thử thách 15 câu hỏi
        </button>
      </div>
    );
  }

  if (stage === 'gameover' || stage === 'victory') {
    return (
      <div className="text-center py-10 max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-500">
          <Trophy className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {stage === 'victory' ? 'CHÚC MỪNG BẬC THẦY TRI THỨC!' : 'KẾT THÚC THỬ THÁCH'}
        </h3>
        <div className="text-xl font-bold text-rose-600">
          Thang điểm đạt được: {prizeLevels[Math.max(0, level - 1)] || '0'} điểm thưởng
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {stage === 'victory'
            ? 'Em đã vượt qua toàn bộ 15 câu hỏi của cô giáo!'
            : `Đáp án đúng câu vừa rồi là: ${currentQ.options[currentQ.ans]} (${currentQ.exp})`}
        </p>
        <button
          onClick={handleStart}
          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> Thử sức lại
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Question Canvas */}
      <div className="lg:col-span-8 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl">
        {/* Lifelines */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-amber-400">
            Câu số {level + 1} / 15
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUse5050}
              disabled={used5050}
              className="px-3 py-1 rounded-lg text-xs font-bold border border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              50:50
            </button>
            <button
              onClick={handleUseHint}
              disabled={usedHint}
              className="px-3 py-1 rounded-lg text-xs font-bold border border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Gợi ý cô Vy
            </button>
          </div>
        </div>

        {hintText && (
          <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-xs text-blue-200">
            {hintText}
          </div>
        )}

        {/* Question */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-sm md:text-base font-bold text-white shadow-inner">
          {currentQ.q}
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, i) => {
            const isHidden = hiddenOptions.includes(i);
            const isChosen = selectedIdx === i;

            return (
              <button
                key={i}
                disabled={isHidden || selectedIdx !== null}
                onClick={() => handleSelectAnswer(i)}
                className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all ${
                  isHidden
                    ? 'opacity-0 pointer-events-none'
                    : isChosen
                    ? i === currentQ.ans
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prize Ladder */}
      <div className="lg:col-span-4 bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 space-y-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
          Thang giải thưởng tri thức
        </div>
        <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
          {prizeLevels.map((p, idx) => {
            const revIdx = 14 - idx;
            const isCurrent = revIdx === level;
            const isMilestone = revIdx === 4 || revIdx === 9 || revIdx === 14;

            return (
              <div
                key={revIdx}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : isMilestone
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <span>Câu {revIdx + 1}</span>
                <span>{p}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: VÒNG QUAY MAY MẮN
   ========================================================================= */
const LuckyWheelGame: React.FC<{ students: Student[]; onWin: () => void }> = ({
  students,
  onWin,
}) => {
  const [items, setItems] = useState<string[]>(
    students.length > 0
      ? students.map((s) => s.name)
      : [
          'Trần Nguyễn Khánh An',
          'Lê Minh Quân',
          'Huỳnh Gia Hưng',
          'Phan Thị Diễm My',
          'Nguyễn Đăng Khoa',
          'Võ Tuyết Nhi',
          'Đặng Quốc Bảo',
          'Bùi Phương Linh',
        ]
  );
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);
    setSelectedWinner(null);

    const randomDeg = 1800 + Math.floor(Math.random() * 360);
    const newRotation = rotation + randomDeg;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newRotation % 360;
      const sliceSize = 360 / items.length;
      // pointer is at top (270 or 90 depending on canvas)
      const winningIndex = Math.floor(((360 - (actualDeg % 360)) % 360) / sliceSize);
      const winner = items[winningIndex % items.length];
      setSelectedWinner(winner);
      onWin();
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 space-y-6">
        {/* Wheel container with pointer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Top Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-rose-600 drop-shadow-md" />

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl relative overflow-hidden transition-all duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {items.map((item, idx) => {
              const deg = (360 / items.length) * idx;
              const colors = ['#0F172A', '#E11D48', '#2563EB', '#D97706', '#059669', '#7C3AED'];
              const bg = colors[idx % colors.length];

              return (
                <div
                  key={idx}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `rotate(${deg}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <div
                    className="w-full h-1/2 flex items-start justify-center pt-3 text-white text-[11px] font-bold"
                    style={{
                      background: `conic-gradient(from -${180 / items.length}deg, ${bg} 0deg, ${bg} ${
                        360 / items.length
                      }deg, transparent 0deg)`,
                    }}
                  >
                    <span className="transform rotate-90 origin-center truncate max-w-[90px]">
                      {item.split(' ').slice(-1)[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 border-4 border-amber-400 text-amber-400 flex items-center justify-center font-black text-xs shadow-lg">
            VY
          </div>
        </div>

        {/* Spin action */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-rose-900/30 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Shuffle className="w-4 h-4" />
          {isSpinning ? 'Đang quay may mắn...' : 'Quay chọn ngẫu nhiên'}
        </button>

        {selectedWinner && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center animate-bounce">
            <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Chúc mừng bạn được gọi tên lên bảng!
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              🎉 {selectedWinner} 🎉
            </div>
          </div>
        )}
      </div>

      {/* Right List Editor */}
      <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Danh sách vòng quay ({items.length})
          </h4>
          <button
            onClick={() =>
              setItems([
                'Câu hỏi số 1: Tiếp tuyến',
                'Câu hỏi số 2: Vận tốc tức thời',
                'Câu hỏi số 3: Đạo hàm hàm hợp',
                'Câu hỏi số 4: Bài toán cực trị',
              ])
            }
            className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline"
          >
            Đổi sang bộ câu hỏi
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Cô Vy có thể sửa nhanh danh sách học sinh hoặc chủ đề hỏi bài ngẫu nhiên trong tiết dạy.
        </p>

        <textarea
          rows={6}
          value={items.join('\n')}
          onChange={(e) =>
            setItems(
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          className="w-full text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 4: GHÉP ĐÔI KIẾN THỨC
   ========================================================================= */
const MatchingGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const initialPairs = [
    { id: 'p1', term: 'Đạo hàm f\'(x₀)', def: 'Hệ số góc của tiếp tuyến tại điểm x₀' },
    { id: 'p2', term: 'Vận tốc tức thời v(t)', def: 'Đạo hàm của quãng đường s\'(t)' },
    { id: 'p3', term: 'Gia tốc tức thời a(t)', def: 'Đạo hàm của vận tốc v\'(t)' },
    { id: 'p4', term: 'Số gia hàm số Δy', def: 'f(x₀ + Δx) - f(x₀)' },
  ];

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const t = setInterval(() => setTimerSeconds((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isFinished]);

  // Check matching
  useEffect(() => {
    if (selectedTerm && selectedDef) {
      if (selectedTerm === selectedDef) {
        const next = [...matchedIds, selectedTerm];
        setMatchedIds(next);
        setSelectedTerm(null);
        setSelectedDef(null);

        if (next.length === initialPairs.length) {
          setIsFinished(true);
          onWin();
        }
      } else {
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDef(null);
        }, 600);
      }
    }
  }, [selectedTerm, selectedDef]);

  const handleRestart = () => {
    setMatchedIds([]);
    setSelectedTerm(null);
    setSelectedDef(null);
    setTimerSeconds(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Ghép Đôi Thuật Ngữ & Định Nghĩa
          </h4>
          <span className="text-xs text-slate-500">
            Đã ghép đúng: {matchedIds.length} / {initialPairs.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          <Timer className="w-4 h-4 text-rose-500" />
          <span>{timerSeconds} giây</span>
        </div>
      </div>

      {isFinished ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            Tuyệt vời! Hoàn thành trong {timerSeconds} giây!
          </h4>
          <p className="text-xs text-slate-500">Em đã làm chủ trọn vẹn các định nghĩa cốt lõi.</p>
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
          >
            Thực hành lại
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Terms Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">Thuật ngữ</div>
            {initialPairs.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedTerm === p.id;
              return (
                <button
                  key={p.id}
                  disabled={isMatched}
                  onClick={() => setSelectedTerm(p.id)}
                  className={`w-full p-4 rounded-xl border text-xs text-left font-bold transition-all ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 opacity-60'
                      : isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-white dark:bg-slate-800 hover:border-rose-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {p.term}
                </button>
              );
            })}
          </div>

          {/* Definitions Column (Randomly arranged) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">Ý nghĩa / Bản chất</div>
            {[...initialPairs].reverse().map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedDef === p.id;
              return (
                <button
                  key={p.id}
                  disabled={isMatched}
                  onClick={() => setSelectedDef(p.id)}
                  className={`w-full p-4 rounded-xl border text-xs text-left font-medium transition-all ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 opacity-60'
                      : isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-white dark:bg-slate-800 hover:border-rose-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {p.def}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 5: Ô CHỮ BÍ MẬT
   ========================================================================= */
const CrosswordGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  // Key word: "DAO HAM" (ĐẠO HÀM)
  const rows = [
    { row: 1, hint: 'Hàng 1: Đại lượng s\'(t) biểu thị vận tốc tức thời, đơn vị thường là mét trên ... ?', word: 'GIAY', keyChar: 'G' },
    { row: 2, hint: 'Hàng 2: Tiếp tuyến của đồ thị hàm số có hệ số góc k bằng f\'(x₀), tiếp xúc tại tiếp ... ?', word: 'DIEM', keyChar: 'D' },
    { row: 3, hint: 'Hàng 3: Khái niệm toán học nền tảng để định nghĩa đạo hàm là giới ... ?', word: 'HAN', keyChar: 'A' },
    { row: 4, hint: 'Hàng 4: Trong chuyển động biến đổi, đạo hàm cấp hai s\'\'(t) chính là gia ... ?', word: 'TOC', keyChar: 'O' },
  ];

  const [revealedRows, setRevealedRows] = useState<number[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [activeRow, setActiveRow] = useState<number>(1);
  const [solvedKey, setSolvedKey] = useState(false);

  const handleRevealRow = (rNum: number) => {
    if (!revealedRows.includes(rNum)) {
      setRevealedRows([...revealedRows, rNum]);
      if (revealedRows.length + 1 === rows.length) {
        setSolvedKey(true);
        onWin();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Ô Chữ Bí Mật: Khám Phá Từ Khóa Chủ Đề
        </h4>
        <p className="text-xs text-slate-500">
          Mở từng hàng ngang gợi ý để tìm ra từ khóa bí mật gồm 6 chữ cái: <strong>ĐẠO HÀM</strong>.
        </p>
      </div>

      {/* Crossword visual board */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
        {rows.map((r) => {
          const isRevealed = revealedRows.includes(r.row);
          return (
            <div key={r.row} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-rose-400">{r.hint}</span>
                {!isRevealed && (
                  <button
                    onClick={() => handleRevealRow(r.row)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300"
                  >
                    Mở hàng {r.row}
                  </button>
                )}
              </div>

              {/* Character blocks */}
              <div className="flex items-center gap-1.5">
                {r.word.split('').map((char, cIdx) => (
                  <div
                    key={cIdx}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm border ${
                      isRevealed
                        ? char === r.keyChar
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-white border-slate-700'
                        : 'bg-slate-950 border-slate-800 text-transparent'
                    }`}
                  >
                    {isRevealed ? char : '?'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Master keyword reveal */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase">
            Từ khóa chủ đề bí mật:
          </span>
          <div className="text-lg font-black tracking-widest text-white px-4 py-1.5 rounded-lg bg-rose-600">
            {solvedKey ? 'ĐẠO HÀM' : '*** ***'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 6: ĐẤU TRƯỜNG TRÍ TUỆ (ROOM PIN & LIVE LEADERBOARD)
   ========================================================================= */
const ArenaLiveGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [pin, setPin] = useState('VYEDU2026');
  const [stage, setStage] = useState<'lobby' | 'live' | 'leaderboard'>('lobby');
  const [participants, setParticipants] = useState([
    { name: 'Trần Nguyễn Khánh An', score: 380 },
    { name: 'Nguyễn Đăng Khoa', score: 350 },
    { name: 'Bùi Phương Linh', score: 320 },
    { name: 'Phan Thị Diễm My', score: 290 },
    { name: 'Lê Minh Quân', score: 260 },
  ]);

  const [qIndex, setQIndex] = useState(0);
  const questions = [
    {
      q: 'Đạo hàm của hàm số y = 2x³ - 5x tại điểm x = 1 bằng bao nhiêu?',
      opts: ['A. 1', 'B. 6', 'C. -1', 'D. 2'],
      ans: 0,
    },
    {
      q: 'Tiếp tuyến của hàm số y = f(x) tại điểm x₀ song song với trục hoành khi nào?',
      opts: ['A. f\'(x₀) = 0', 'B. f\'(x₀) = 1', 'C. f(x₀) = 0', 'D. f\'\'(x₀) = 0'],
      ans: 0,
    },
  ];

  const handleStartArena = () => {
    setStage('live');
  };

  const handlePlayerAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setParticipants((prev) =>
        prev.map((p, i) => (i === 0 ? { ...p, score: p.score + 100 } : p))
      );
    }
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1);
    } else {
      setStage('leaderboard');
      onWin();
    }
  };

  if (stage === 'lobby') {
    return (
      <div className="text-center py-8 max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Đấu Trường Trí Tuệ Trực Tuyến
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Học sinh trên lớp truy cập bằng mã phòng (PIN) trên điện thoại hoặc máy tính để thi đấu trực tiếp.
        </p>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Mã phòng thi đấu</span>
          <div className="text-3xl font-black tracking-widest text-rose-600">{pin}</div>
        </div>

        <div className="text-xs text-slate-500">
          Hiện đã có <strong>{participants.length} bạn</strong> kết nối vào phòng thi đấu.
        </div>

        <button
          onClick={handleStartArena}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <Play className="w-4 h-4 fill-white" /> Bắt đầu trận đấu
        </button>
      </div>
    );
  }

  if (stage === 'leaderboard') {
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    return (
      <div className="max-w-md mx-auto py-6 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          Bảng Vàng Đấu Trường
        </h3>

        <div className="space-y-2 text-left">
          {sorted.map((p, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3.5 rounded-xl border ${
                idx === 0
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 font-bold text-amber-900 dark:text-amber-200'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{p.name}</span>
              </div>
              <span className="font-extrabold text-rose-600">{p.score} điểm</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStage('lobby')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
        >
          Tạo phòng đấu mới
        </button>
      </div>
    );
  }

  const cur = questions[qIndex];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Đấu trường trực tuyến · Mã phòng: {pin}</span>
        <span className="font-bold text-rose-600">Câu {qIndex + 1} / {questions.length}</span>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
        <h4 className="text-base font-bold text-center leading-relaxed">{cur.q}</h4>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {cur.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => handlePlayerAnswer(i === cur.ans)}
              className="p-4 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white border border-slate-700 text-xs font-bold transition-all text-left"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
