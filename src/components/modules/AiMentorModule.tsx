import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Award,
  Share2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface AiMentorModuleProps {
  onShowToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const AiMentorModule: React.FC<AiMentorModuleProps> = ({ onShowToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'model',
      text: `Xin chào em! Cô Vy và VY AI Mentor rất vui được đồng hành cùng em trong học tập.

Em muốn được hỗ trợ gì hôm nay?
1. 💡 Giải thích định nghĩa hoặc công thức khó hiểu?
2. 🔍 Gợi mở phương pháp tư duy bài tập?
3. 🎯 Luyện tập nhanh câu hỏi theo mức độ nhận thức?`,
      timestamp: '08:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'learn' | 'practice' | 'review'>('learn');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          mode,
          grade: '11',
          subject: 'Toán học',
          history: newHistory,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Lỗi nhận phản hồi AI');
      }
    } catch (err: any) {
      onShowToast('error', 'Lỗi kết nối VY AI Mentor', err.message);
      const fallbackMsg: ChatMessage = {
        id: 'ai_err_' + Date.now(),
        sender: 'model',
        text: 'Cô đang kiểm tra đường truyền, em hãy thử đặt câu hỏi lại hoặc đối chiếu bài học trong SGK nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm_init',
        sender: 'model',
        text: 'Cuộc trò chuyện đã được làm mới. Em hãy chọn chủ đề muốn khám phá cùng VY AI Mentor nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    onShowToast('info', 'Đã xóa lịch sử trò chuyện');
  };

  const handleForwardToTeacher = () => {
    onShowToast(
      'success',
      'Đã gửi câu hỏi phản hồi cho cô Vy!',
      'Cô giáo sẽ nhận được thông báo trên Dashboard để trực tiếp giải đáp thêm trên lớp.'
    );
  };

  const samplePrompts = [
    'Cô ơi, giải thích giúp em bản chất của số gia Δx và Δy là gì?',
    'Làm thế nào để nhớ nhanh công thức viết phương trình tiếp tuyến ạ?',
    'Cho em 1 bài tập ví dụ tương tự về bài toán vận tốc tức thời!',
    'Lỗi sai nào học sinh hay mắc khi tính đạo hàm của hàm hợp ạ?',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Mentor Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                VY AI Mentor
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                Sư phạm Socratic
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Trợ lý học tập thông minh · Đồng hành cùng học sinh THPT số 1 Tuy Phước
            </p>
          </div>
        </div>

        {/* 3 Learning Modes Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setMode('learn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'learn'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            1. Học cùng AI
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'practice'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2. Luyện tập cùng AI
          </button>
          <button
            onClick={() => setMode('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'review'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3. Ôn thi cùng AI
          </button>
        </div>
      </div>

      {/* Chat Area Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-indigo-900 text-amber-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white shadow-md rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-2 opacity-60 text-right ${
                    msg.sender === 'user' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-900 text-amber-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 rounded-tl-none flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                <span>VY AI Mentor đang suy nghĩ & gợi mở tư duy...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Pills */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Gợi ý hỏi:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Xóa lịch sử hội thoại"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhắn tin với VY AI Mentor (VD: Em chưa hiểu bài toán tiếp tuyến...)"
            className="flex-1 text-xs md:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition-all shadow-md shadow-rose-900/20"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={handleForwardToTeacher}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Gửi câu hỏi khó về cho cô Vy"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Hỏi cô Vy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
