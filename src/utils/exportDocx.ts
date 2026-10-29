import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { LessonPlan } from '../types';

export async function exportLessonPlanToDocx(plan: LessonPlan): Promise<void> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'SỞ GD&ĐT BÌNH ĐỊNH - TRƯỜNG THPT SỐ 1 TUY PHƯỚC',
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'GIÁO VIÊN: NGUYỄN THỊ MINH VY',
          italics: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: plan.title.toUpperCase(),
          bold: true,
          size: 30, // 15pt
          color: '1E3A8A',
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `Môn: ${plan.subject}  |  Lớp: ${plan.grade}  |  Thời lượng: ${plan.duration}`,
          bold: true,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `Bộ sách giáo khoa: ${plan.textbook}`,
          italics: true,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Phương pháp dạy học: ${plan.method}`,
          font: 'Times New Roman',
        }),
      ],
    }),
  ];

  // Append sections
  for (const section of plan.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: 26,
            color: '0F172A',
            font: 'Times New Roman',
          }),
        ],
      })
    );

    const lines = section.content.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: line,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.title.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
