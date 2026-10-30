import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI securely on server
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// MODULE 2: AI Lesson Plan Generator
app.post('/api/ai/lesson-plan', async (req: Request, res: Response) => {
  try {
    const {
      subject,
      grade,
      topic,
      textbook,
      duration,
      objectives,
      method,
      classTraits,
    } = req.body;

    const ai = getAIClient();
    if (!ai) {
      return res.status(200).json({
        success: true,
        isFallback: true,
        data: {
          title: `KẾ HOẠCH BÀI DẠY: ${topic || 'BÀI HỌC MỚI'}`,
          subject: subject || 'Toán học',
          grade: grade || '11',
          duration: duration || '45 phút',
          textbook: textbook || 'Kết nối tri thức với cuộc sống',
          sections: [
            {
              id: 'sec_1',
              title: 'I. MỤC TIÊU DẠY HỌC (Theo CT GDPT 2018)',
              content: `1. Về kiến thức: Nắm vững các khái niệm, quy tắc và định lý cốt lõi của bài học ${topic}.\n2. Về năng lực: Phát triển năng lực tư duy toán học/khoa học, năng lực giải quyết vấn đề và mô hình hóa thực tế.\n3. Về phẩm chất: Rèn luyện tính trung thực, chăm chỉ, trách nhiệm và tinh thần hợp tác nhóm.`,
            },
            {
              id: 'sec_2',
              title: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
              content: `- Giáo viên: Kế hoạch bài dạy, bài giảng điện tử PowerPoint/Canva, phiếu học tập số 1, 2, hệ thống câu hỏi tương tác.\n- Học sinh: Sách giáo khoa, vở ghi, đồ dùng học tập, thiết bị di động để tham gia trò chơi kiểm tra đánh giá.`,
            },
            {
              id: 'sec_3',
              title: 'III. TIẾN TRÌNH DẠY HỌC',
              content: `HOẠT ĐỘNG 1: KHỞI ĐỘNG (7 phút)\n- Mục tiêu: Tạo hứng thú và kích thích tò mò nhận thức cho học sinh.\n- Phương thức: Trò chơi nhanh kết hợp câu hỏi gợi mở từ tình huống thực tiễn.\n- Sản phẩm: Câu trả lời và dự đoán của các nhóm học sinh.\n\nHOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (20 phút)\n- Mục tiêu: Xây dựng và làm rõ các định nghĩa, tính chất trọng tâm.\n- Phương thức: Dạy học giải quyết vấn đề, thảo luận nhóm 4 người, hoàn thiện phiếu học tập.\n- Sản phẩm: Báo cáo kết quả thảo luận nhóm và kết luận chính xác được ghi vào vở.\n\nHOẠT ĐỘNG 3: LUYỆN TẬP (12 phút)\n- Mục tiêu: Khắc sâu và củng cố kiến thức qua các bài tập từ cơ bản đến nâng cao.\n- Phương thức: Thi đua nhóm qua trò chơi tương tác VY EDU AI.\n- Sản phẩm: Bảng kết quả làm bài tập của học sinh.\n\nHOẠT ĐỘNG 4: VẬN DỤNG VÀ MỞ RỘNG (6 phút)\n- Mục tiêu: Ứng dụng kiến thức giải quyết vấn đề thực tế tại địa phương.\n- Nhiệm vụ về nhà: Tìm hiểu ứng dụng trong đời sống và chuẩn bị bài học tiếp theo.`,
            },
            {
              id: 'sec_4',
              title: 'IV. ĐÁNH GIÁ VÀ HƯỚNG DẪN HỌC TẬP',
              content: `- Đánh giá thường xuyên: Quan sát thái độ tích cực, sản phẩm phiếu học tập và câu trả lời trong tiết học.\n- Hướng dẫn tự học: Hoàn thành bài tập tự luyện trên hệ thống VY EDU AI.`,
            },
          ],
        },
      });
    }

    const prompt = `Bạn là chuyên gia phương pháp giảng dạy THPT tại Việt Nam theo Chương trình Giáo dục Phổ thông 2018 (Công văn 5512/BGDĐT).
Hãy soạn kế hoạch bài dạy chi tiết, sâu sắc, chuẩn sư phạm cho giáo viên:
- Môn học: ${subject || 'Toán học'}
- Khối lớp: ${grade || '11'}
- Tên bài/Chủ đề: ${topic || 'Đạo hàm và ứng dụng'}
- Bộ sách giáo khoa: ${textbook || 'Kết nối tri thức'}
- Thời lượng: ${duration || '45 phút'}
- Yêu cầu cần đạt: ${objectives || 'Nắm vững khái niệm và vận dụng giải toán'}
- Phương pháp giảng dạy mong muốn: ${method || 'Dạy học tích cực, tích hợp chuyển đổi số'}
- Đặc điểm lớp học: ${classTraits || 'Học sinh năng động, tiếp thu tốt'}

Yêu cầu cấu trúc rõ ràng:
1. Mục tiêu (Kiến thức, Năng lực chung, Năng lực đặc thù, Phẩm chất)
2. Thiết bị dạy học và học liệu (Giáo viên, Học sinh)
3. Tiến trình dạy học (Gồm 4 hoạt động chuẩn 5512: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng). Mỗi hoạt động phải có: Mục tiêu, Nội dung/Nhiệm vụ, Sản phẩm học tập dự kiến, Cách thức tổ chức thực hiện (Giao nhiệm vụ, Thực hiện, Báo cáo/thảo luận, Kết luận/nhận định).
4. Hồ sơ dạy học & Hướng dẫn tự học.

Trả về định dạng JSON thuần túy (không bọc code block markdown ngoài JSON) theo cấu trúc:
{
  "title": "Tên kế hoạch bài dạy",
  "subject": "${subject}",
  "grade": "${grade}",
  "duration": "${duration}",
  "textbook": "${textbook}",
  "sections": [
    { "id": "sec_1", "title": "I. MỤC TIÊU DẠY HỌC", "content": "Nội dung chi tiết..." },
    { "id": "sec_2", "title": "II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", "content": "Nội dung chi tiết..." },
    { "id": "sec_3", "title": "III. TIẾN TRÌNH DẠY HỌC", "content": "Nội dung chi tiết 4 hoạt động..." },
    { "id": "sec_4", "title": "IV. ĐÁNH GIÁ VÀ HƯỚNG DẪN HỌC TẬP", "content": "Nội dung chi tiết..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, isFallback: false, data: parsed });
  } catch (error: any) {
    console.error('Lesson plan AI error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi khi tạo giáo án với AI',
    });
  }
});

// MODULE 3: AI Slides Outline Generator
app.post('/api/ai/slides', async (req: Request, res: Response) => {
  try {
    const { topic, grade, subject, slideCount, contentSummary } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        success: true,
        isFallback: true,
        data: {
          title: topic || 'BÀI GIẢNG ĐIỆN TỬ',
          slides: [
            {
              id: 's1',
              title: topic || 'Bài giảng điện tử tương tác',
              subtitle: `Môn: ${subject || 'Toán học'} · Lớp ${grade || '11'} · THPT số 1 Tuy Phước`,
              points: [
                'Giáo viên giảng dạy: Nguyễn Thị Minh Vy',
                'Năm học 2026 - 2027',
              ],
              layout: 'title',
              notes: 'Chào mừng các em học sinh đến với tiết học hôm nay!',
            },
            {
              id: 's2',
              title: 'Mục tiêu bài học',
              subtitle: 'Những điều em cần làm chủ sau tiết học',
              points: [
                'Hiểu rõ định nghĩa và bản chất vấn đề',
                'Áp dụng thành thạo các công thức và quy tắc',
                'Giải quyết bài toán thực tiễn gắn với đời sống',
                'Phát huy năng lực làm việc nhóm tích cực',
              ],
              layout: 'bullets',
              notes: 'Giáo viên nhấn mạnh mục tiêu để học sinh định hướng học tập.',
            },
            {
              id: 's3',
              title: 'Khởi động: Thử thách tư duy',
              subtitle: 'Quan sát tình huống thực tế và đưa ra nhận xét',
              points: [
                'Hình ảnh/Tình huống: Vận tốc tức thời của xe chuyển động',
                'Câu hỏi: Làm thế nào đo tốc độ tại một thời điểm chính xác?',
                'Học sinh thảo luận cặp đôi trong 2 phút',
              ],
              layout: 'challenge',
              notes: 'Gợi mở liên hệ thực tiễn để dẫn vào bài mới.',
            },
            {
              id: 's4',
              title: 'Kiến thức trọng tâm',
              subtitle: 'Khái niệm và định lý cốt lõi',
              points: [
                'Khái niệm cơ bản được thiết lập qua giới hạn tỉ số',
                'Ý nghĩa hình học: Hệ số góc tiếp tuyến của đồ thị hàm số',
                'Ý nghĩa vật lý: Vận tốc tức thời và gia tốc',
              ],
              layout: 'content',
              notes: 'Trình chiếu bảng công thức và hình minh họa trực quan.',
            },
            {
              id: 's5',
              title: 'Ví dụ minh họa & Giải pháp mẫu',
              subtitle: 'Các bước triển khai bài tập chuẩn xác',
              points: [
                'Bước 1: Xác định tập xác định và công thức phù hợp',
                'Bước 2: Thực hiện phép biến đổi đại số',
                'Bước 3: Kết luận và kiểm tra điều kiện',
              ],
              layout: 'steps',
              notes: 'Học sinh ghi chép các bước làm bài tiêu biểu.',
            },
            {
              id: 's6',
              title: 'Luyện tập tương tác & Tổng kết',
              subtitle: 'Củng cố kiến thức và ghi nhớ sâu',
              points: [
                'Tham gia trả lời 3 câu hỏi nhanh trên VY EDU AI',
                'Khắc sâu lỗi sai thường gặp khi giải bài',
                'Nhiệm vụ về nhà: Bài tập số 1, 2 trang SGK',
              ],
              layout: 'summary',
              notes: 'Khen ngợi tinh thần học tập và giao việc về nhà.',
            },
          ],
        },
      });
    }

    const count = parseInt(slideCount, 10) || 8;
    const prompt = `Bạn là chuyên gia thiết kế bài trình chiếu giảng dạy THPT hiện đại.
Hãy tạo dàn ý và nội dung trình chiếu PowerPoint gồm đúng ${count} slide cho:
- Môn: ${subject || 'Toán học'}
- Lớp: ${grade || '11'}
- Tên bài: ${topic}
- Nội dung lưu ý: ${contentSummary || 'Chuẩn kiến thức SGK 2018'}

Cấu trúc các slide cần gồm: Trang tiêu đề, Mục tiêu bài học, Tình huống khởi động, Kiến thức trọng tâm, Ví dụ minh họa, Câu hỏi tương tác, Bài tập luyện tập, Tổng kết bài học.
Trả về định dạng JSON thuần túy theo mẫu:
{
  "title": "${topic}",
  "slides": [
    {
      "id": "s1",
      "title": "Tiêu đề slide",
      "subtitle": "Phụ đề ngắn",
      "points": ["Ý chính 1", "Ý chính 2", "Ý chính 3"],
      "layout": "title | bullets | challenge | content | steps | summary",
      "notes": "Lời thoại giáo viên giảng dạy"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, isFallback: false, data: parsed });
  } catch (error: any) {
    console.error('Slides AI error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi khi tạo slide bằng AI',
    });
  }
});

// MODULE 4: AI Question Bank Generator
app.post('/api/ai/quiz-bank', async (req: Request, res: Response) => {
  try {
    const { subject, grade, topic, questionCount, cognitiveLevel, questionType } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // High quality fallback bank
      const sampleQuestions = [
        {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          question: `Cho hàm số y = f(x) liên tục trên R. Đạo hàm f'(x) tại điểm x0 là gì?`,
          type: 'multiple_choice',
          level: 'Nhận biết',
          options: [
            'A. Giới hạn tỉ số [f(x) - f(x0)] / (x - x0) khi x dần tới x0',
            'B. Tỉ số giữa f(x) và x0 tại mọi điểm',
            'C. Tiếp tuyến của đồ thị hàm số tại gốc tọa độ',
            'D. Giá trị lớn nhất của hàm số trên đoạn đã cho',
          ],
          correctAnswer: 'A',
          explanation: 'Theo định nghĩa trong SGK CT GDPT 2018, đạo hàm của f(x) tại x0 là giới hạn (nếu có) của tỉ số [f(x) - f(x0)] / (x - x0) khi x -> x0.',
        },
        {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          question: `Hệ số góc của tiếp tuyến của đồ thị hàm số y = x^2 tại điểm có hoành độ x = 2 bằng bao nhiêu?`,
          type: 'multiple_choice',
          level: 'Thông hiểu',
          options: ['A. 2', 'B. 4', 'C. 6', 'D. 8'],
          correctAnswer: 'B',
          explanation: 'Ta có y\' = 2x. Với x = 2 thì k = y\'(2) = 2 * 2 = 4.',
        },
        {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          question: `Một vật rơi tự do theo phương trình s(t) = 5t^2 (mét). Vận tốc tức thời của vật tại thời điểm t = 3 giây là bao nhiêu?`,
          type: 'multiple_choice',
          level: 'Vận dụng',
          options: ['A. 15 m/s', 'B. 30 m/s', 'C. 45 m/s', 'D. 90 m/s'],
          correctAnswer: 'B',
          explanation: 'Vận tốc tức thời v(t) = s\'(t) = 10t. Tại t = 3s: v(3) = 10 * 3 = 30 (m/s).',
        },
      ];
      return res.json({ success: true, isFallback: true, questions: sampleQuestions });
    }

    const count = parseInt(questionCount, 10) || 5;
    const prompt = `Bạn là chuyên gia khảo thí THPT Việt Nam theo Chương trình GDPT 2018.
Hãy tạo ${count} câu hỏi chất lượng cao:
- Môn học: ${subject || 'Toán học'}
- Khối lớp: ${grade || '11'}
- Chủ đề: ${topic || 'Đạo hàm'}
- Mức độ nhận thức: ${cognitiveLevel || 'Tất cả mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)'}
- Loại câu hỏi: ${questionType || 'Trắc nghiệm nhiều lựa chọn (multiple_choice), đúng/sai (true_false), trả lời ngắn (short_answer), tự luận (essay), tình huống (case_study)'}

Yêu cầu mỗi câu hỏi có lời giải thích sư phạm chi tiết và đáp án rõ ràng.
Trả về định dạng JSON thuần túy theo mẫu mảng câu hỏi:
{
  "questions": [
    {
      "id": "q1",
      "question": "Nội dung câu hỏi chi tiết, chuẩn tiếng Việt có dấu...",
      "type": "multiple_choice | true_false | short_answer | essay | case_study",
      "level": "Nhận biết | Thông hiểu | Vận dụng | Vận dụng cao",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "Giải thích chi tiết các bước tính toán hoặc căn cứ SGK"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, isFallback: false, questions: parsed.questions || [] });
  } catch (error: any) {
    console.error('Quiz AI error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi khi tạo câu hỏi với AI',
    });
  }
});

// MODULE 6: Student AI Mentor "VY AI Mentor"
app.post('/api/ai/mentor-chat', async (req: Request, res: Response) => {
  try {
    const { message, mode, grade, subject, history } = req.body;
    const ai = getAIClient();

    const modeLabels: Record<string, string> = {
      learn: 'Học cùng AI (Giải thích khái niệm bằng ngôn ngữ trong sáng, trực quan, ví dụ gần gũi)',
      practice: 'Luyện tập cùng AI (Hướng dẫn từng bước, gợi mở bằng câu hỏi Socratic, không làm hộ học sinh)',
      review: 'Ôn thi cùng AI (Tóm tắt sơ đồ tư duy, phân tích bẫy đề thi và chỉ ra lỗi sai học sinh hay mắc)',
    };

    const chosenMode = modeLabels[mode] || modeLabels.learn;

    if (!ai) {
      // Warm, pedagogical mentor fallback
      return res.json({
        success: true,
        isFallback: true,
        reply: `Chào em! Cô Vy và VY AI Mentor rất vui được đồng hành cùng em trong môn ${subject || 'Toán học'} lớp ${grade || '11'}.

Về câu hỏi: "${message}"

1. **Gợi ý tư duy bước 1:** Trước hết em hãy nhớ lại công thức và định nghĩa cốt lõi đã học trong SGK.
2. **Câu hỏi gợi mở:** Em thấy bài toán này cho những đại lượng nào đã biết và đang tìm đại lượng nào?
3. **Thử sức nhé:** Em hãy thử biến đổi bước đầu tiên xem được kết quả ra sao, sau đó gửi lại cho cô để cùng thảo luận tiếp nhé!`,
      });
    }

    const systemInstruction = `Bạn là "VY AI Mentor" – Trợ lý học tập thông minh thuộc ứng dụng VY EDU AI của cô Nguyễn Thị Minh Vy (Trường THPT số 1 Tuy Phước, Bình Định).
Chế độ hiện tại: ${chosenMode}.
Môn học: ${subject || 'Toán học'}. Khối lớp: ${grade || '11'}.

Nguyên tắc sư phạm vàng:
1. Luôn dùng giọng điệu ấm áp, khích lệ, thân thiện như một người thầy tâm huyết.
2. KHÔNG BAO GIỜ giải bài ngay lập tức nếu học sinh hỏi bài tập. Hãy dùng phương pháp gợi mở Socratic: phân tích yêu cầu bài toán, gợi ý định hướng suy nghĩ, đặt câu hỏi dẫn dắt để học sinh tự tìm ra đáp án.
3. Nếu học sinh yêu cầu giải thích lý thuyết, hãy giải thích sinh động, ví dụ gắn liền thực tiễn học đường Việt Nam.
4. Nhấn mạnh lỗi sai phổ biến học sinh hay mắc phải.
5. Nếu không chắc chắn về một chi tiết thực tế ngoài kiến thức chuẩn GDPT 2018, hãy nói rõ giới hạn và khuyên học sinh đối chiếu SGK hoặc hỏi cô giáo.`;

    const chatContents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        chatContents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      isFallback: false,
      reply: response.text || 'Cô chưa nghe rõ câu hỏi, em hãy nhắn lại nhé!',
    });
  } catch (error: any) {
    console.error('Mentor chat error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi khi kết nối VY AI Mentor',
    });
  }
});

// MODULE 9: AI Personalized Learning Path Suggestion
app.post('/api/ai/personalize-plan', async (req: Request, res: Response) => {
  try {
    const { studentName, subject, grade, testScores, weakTopics } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        recommendation: {
          strongAreas: ['Nắm chắc định nghĩa lý thuyết', 'Kỹ năng tính toán cơ bản'],
          focusAreas: weakTopics && weakTopics.length > 0 ? weakTopics : ['Bài toán tham số nâng cao', 'Vận dụng vào đồ thị'],
          studyPlan: [
            { day: 'Ngày 1 - 2', task: 'Xem lại phần định lý và làm 5 bài tập nhận biết - thông hiểu' },
            { day: 'Ngày 3 - 4', task: 'Thực hành bài tập vận dụng có hướng dẫn gợi ý từ VY AI Mentor' },
            { day: 'Ngày 5', task: 'Làm bài kiểm tra mini 15 phút đánh giá lại mức độ tiến bộ' },
          ],
          teacherNote: `Học sinh ${studentName || 'em'} có khả năng tiếp thu tốt, cần rèn thêm tính cẩn thận khi biến đổi đại số. Giáo viên sẽ theo dõi sát sao.`,
        },
      });
    }

    const prompt = `Bạn là cố vấn sư phạm AI của trường THPT số 1 Tuy Phước.
Dựa trên kết quả học tập thực tế:
- Học sinh: ${studentName}
- Môn: ${subject}, Khối: ${grade}
- Điểm kiểm tra gần đây: ${JSON.stringify(testScores || [7.5, 6.0, 8.0])}
- Các chủ đề còn yếu hoặc hay sai: ${JSON.stringify(weakTopics || ['Bất phương trình', 'Tiếp tuyến'])}

Hãy xây dựng lộ trình ôn tập cá nhân hóa 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).
KHÔNG gắn nhãn cố định năng lực học sinh, mang tính khích lệ và phát triển.
Trả về JSON thuần:
{
  "strongAreas": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "focusAreas": ["Chủ đề cần luyện thêm 1", "Chủ đề 2"],
  "studyPlan": [
    { "day": "Chặng 1 (3 ngày)", "task": "Nhiệm vụ cụ thể..." },
    { "day": "Chặng 2 (3 ngày)", "task": "Nhiệm vụ cụ thể..." },
    { "day": "Chặng 3 (Đánh giá)", "task": "Bài kiểm tra củng cố..." }
  ],
  "teacherNote": "Lời khuyên sư phạm của giáo viên dành riêng cho học sinh"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, isFallback: false, recommendation: parsed });
  } catch (error: any) {
    console.error('Personalize AI error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi khi phân tích lộ trình học tập',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VY EDU AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
