import pptxgen from 'pptxgenjs';
import { SlideDeck } from '../types';

export async function exportSlideDeckToPptx(deck: SlideDeck): Promise<void> {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = deck.title;
  pres.author = 'Cô Nguyễn Thị Minh Vy - THPT số 1 Tuy Phước';

  // Define brand colors
  const NAVY = '0F172A';
  const GOLD = 'D97706';
  const LIGHT_BG = 'F8FAFC';
  const WHITE = 'FFFFFF';

  deck.slides.forEach((slideData, idx) => {
    const slide = pres.addSlide();

    if (slideData.layout === 'title' || idx === 0) {
      // Dark Navy Title Slide
      slide.background = { color: NAVY };

      // Header Tag
      slide.addText('VY EDU AI · TRỢ LÝ GIẢNG DẠY THÔNG MINH', {
        x: 1.0,
        y: 1.0,
        w: 11.3,
        h: 0.5,
        fontSize: 14,
        color: GOLD,
        bold: true,
        fontFace: 'Arial',
      });

      // Main Title
      slide.addText(slideData.title, {
        x: 1.0,
        y: 1.8,
        w: 11.3,
        h: 2.2,
        fontSize: 32,
        color: WHITE,
        bold: true,
        fontFace: 'Arial',
        valign: 'middle',
      });

      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 1.0,
          y: 4.2,
          w: 11.3,
          h: 0.8,
          fontSize: 18,
          color: '94A3B8',
          fontFace: 'Arial',
        });
      }

      // Teacher Attribution
      slide.addText('Giáo viên: Nguyễn Thị Minh Vy · THPT số 1 Tuy Phước, Bình Định', {
        x: 1.0,
        y: 5.8,
        w: 11.3,
        h: 0.6,
        fontSize: 14,
        color: 'E2E8F0',
        italic: true,
        fontFace: 'Arial',
      });
    } else {
      // Content Slide with clean header & cards
      slide.background = { color: LIGHT_BG };

      // Top bar
      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 1.1,
        fill: { color: NAVY },
      });

      slide.addText(slideData.title, {
        x: 0.8,
        y: 0.15,
        w: 10.0,
        h: 0.8,
        fontSize: 22,
        color: WHITE,
        bold: true,
        fontFace: 'Arial',
      });

      slide.addText(`Slide ${idx + 1} / ${deck.slides.length}`, {
        x: 11.0,
        y: 0.25,
        w: 1.5,
        h: 0.6,
        fontSize: 12,
        color: GOLD,
        bold: true,
        align: 'right',
        fontFace: 'Arial',
      });

      // Subtitle if available
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0.8,
          y: 1.4,
          w: 11.7,
          h: 0.5,
          fontSize: 15,
          color: '475569',
          italic: true,
          fontFace: 'Arial',
        });
      }

      // Content Box
      const bulletItems = slideData.points.map((p) => ({
        text: p,
        options: {
          fontSize: 16,
          color: '1E293B',
          bullet: true,
          breakLine: true,
          paraSpaceAfter: 12,
        },
      }));

      slide.addText(bulletItems, {
        x: 0.8,
        y: slideData.subtitle ? 2.0 : 1.6,
        w: 11.7,
        h: 4.8,
        valign: 'top',
        fontFace: 'Arial',
      });
    }
  });

  const filename = `${deck.title.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.pptx`;
  await pres.writeFile({ fileName: filename });
}
