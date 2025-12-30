import PptxGenJS from 'pptxgenjs';
import { InfographicReport, InfographicSection } from '../../types';

/**
 * PPT Exporter for InfographicReport
 * Converts InfographicReport to PowerPoint (.pptx) format
 */
export class PptxExporter {
  private pptx: PptxGenJS;

  // Color scheme matching the project
  private readonly colors = {
    primary: '6366F1',      // indigo-500
    secondary: 'EC4899',    // pink-500
    title: '111827',        // gray-900
    text: '4B5563',         // gray-600
    background: 'FFFFFF',   // white
    success: '10B981',      // green-500
    danger: 'EF4444',       // red-500
    neutral: '6B7280',      // gray-500
    chartColors: ['6366F1', 'EC4899', '10B981', 'F59E0B', '8B5CF6'],
  };

  constructor() {
    this.pptx = new PptxGenJS();
    this.setupLayout();
  }

  private setupLayout() {
    this.pptx.layout = 'LAYOUT_16x9';
    this.pptx.author = 'InfoGraphix AI';
    this.pptx.company = 'InfoGraphix AI';
    this.pptx.subject = 'Infographic Report';
  }

  /**
   * Export the report to PPTX file
   */
  async export(report: InfographicReport, filename?: string): Promise<void> {
    // Slide 1: Title + Summary
    this.addTitleSlide(report.title, report.summary);

    // Slides for each section
    report.sections.forEach((section) => {
      this.addSectionSlide(section);
    });

    // Optional: Sources slide
    if (report.sources && report.sources.length > 0) {
      this.addSourcesSlide(report.sources);
    }

    await this.pptx.writeFile({ fileName: filename || `${report.title}.pptx` });
  }

  /**
   * Add title slide with report title and summary
   */
  private addTitleSlide(title: string, summary: string): void {
    const slide = this.pptx.addSlide();

    // Background gradient accent
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 4,
      fill: { color: this.colors.primary },
      line: { type: 'none' }
    });

    // Title
    slide.addText(title, {
      x: 0.5, y: 1.5, w: 9, h: 1.5,
      fontSize: 44,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    });

    // Summary in a white card
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 1, y: 3, w: 8, h: 3,
      fill: { color: 'FFFFFF' },
      line: { color: this.colors.primary, width: 2 },
      shadow: { type: 'outer', color: '00000033', blur: 10, offset: 4 }
    });

    slide.addText(summary, {
      x: 1.5, y: 3.5, w: 7, h: 2,
      fontSize: 16,
      color: this.colors.text,
      align: 'center',
      valign: 'middle'
    });
  }

  /**
   * Add a slide for a section
   */
  private addSectionSlide(section: InfographicSection): void {
    switch (section.type) {
      case 'text':
        this.addTextSection(section);
        break;
      case 'stat_highlight':
        this.addStatHighlight(section);
        break;
      case 'bar_chart':
        this.addBarChart(section);
        break;
      case 'pie_chart':
        this.addPieChart(section);
        break;
      case 'process_flow':
        this.addProcessFlow(section);
        break;
      case 'comparison':
        this.addComparison(section);
        break;
      default:
        // Fallback for unknown section types
        this.addFallbackSection(section);
    }
  }

  /**
   * Add text section slide
   */
  private addTextSection(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32,
        bold: true,
        color: this.colors.title
      });
      // Accent bar
      slide.addShape(this.pptx.ShapeType.rect, {
        x: 0.5, y: 1.2, w: 1, h: 0.05,
        fill: { color: this.colors.primary }
      });
    }

    // Content text
    if (section.content) {
      slide.addText(section.content, {
        x: 1, y: 1.5, w: 8, h: 5,
        fontSize: 18,
        color: this.colors.text,
        align: 'left',
        valign: 'top'
      });
    }
  }

  /**
   * Add stat highlight section slide
   */
  private addStatHighlight(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32,
        bold: true,
        color: this.colors.title
      });
    }

    // Large stat value
    const statColor = section.statTrend === 'up' ? this.colors.success :
                      section.statTrend === 'down' ? this.colors.danger :
                      this.colors.neutral;

    slide.addText(section.statValue || '', {
      x: 1, y: 2, w: 8, h: 1.5,
      fontSize: 72,
      bold: true,
      color: statColor,
      align: 'center'
    });

    // Stat label
    slide.addText((section.statLabel || '').toUpperCase(), {
      x: 1, y: 3.5, w: 8, h: 0.5,
      fontSize: 20,
      bold: true,
      color: this.colors.neutral,
      align: 'center'
    });

    // Trend indicator
    if (section.statTrend) {
      const trendSymbol = section.statTrend === 'up' ? '▲' :
                          section.statTrend === 'down' ? '▼' : '▬';
      slide.addText(trendSymbol, {
        x: 4.25, y: 4.2, w: 1.5, h: 0.5,
        fontSize: 32,
        bold: true,
        color: statColor,
        align: 'center'
      });
    }

    // Optional content description
    if (section.content) {
      slide.addText(section.content, {
        x: 1.5, y: 5, w: 7, h: 1.5,
        fontSize: 16,
        color: this.colors.text,
        align: 'center',
        italic: true
      });
    }
  }

  /**
   * Add bar chart section slide
   */
  private addBarChart(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28,
        bold: true,
        color: this.colors.title,
        align: 'center'
      });
    }

    // Chart data
    const data = section.data || [];
    const labels = data.map(d => d.name);
    const values = data.map(d => d.value);

    slide.addChart(this.pptx.ChartType.bar, [
      {
        name: section.title || 'Data',
        labels: labels,
        values: values
      }
    ], {
      x: 0.8, y: 1.2, w: 8.4, h: 4.5,
      chartColors: this.colors.chartColors.slice(0, data.length),
      barDir: 'col',
      barGrouping: 'clustered',
      showLegend: false,
      showPercent: false,
      dataLabelFormatCode: '#,##0',
      axisLineColor: 'CCCCCC',
      gridLineColor: 'EEEEEE',
      catAxisLabelColor: this.colors.text,
      valAxisLabelColor: this.colors.text,
      valAxisLabelFontSize: 12,
      catAxisLabelFontSize: 12,
    });

    // Optional content caption
    if (section.content) {
      slide.addText(section.content, {
        x: 0.8, y: 5.8, w: 8.4, h: 1,
        fontSize: 14,
        color: this.colors.text,
        align: 'center',
        italic: true
      });
    }
  }

  /**
   * Add pie chart section slide
   */
  private addPieChart(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28,
        bold: true,
        color: this.colors.title,
        align: 'center'
      });
    }

    // Chart data
    const data = section.data || [];
    const labels = data.map(d => d.name);
    const values = data.map(d => d.value);

    slide.addChart(this.pptx.ChartType.pie, [
      {
        name: section.title || 'Data',
        labels: labels,
        values: values
      }
    ], {
      x: 3, y: 1.5, w: 4, h: 3,
      chartColors: this.colors.chartColors.slice(0, data.length),
      showLegend: true,
      legendPos: 'r',
      dataLabelFormatCode: '#,##0',
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 12,
    });

    // Optional content caption
    if (section.content) {
      slide.addText(section.content, {
        x: 0.8, y: 5.2, w: 8.4, h: 1,
        fontSize: 14,
        color: this.colors.text,
        align: 'center',
        italic: true
      });
    }
  }

  /**
   * Add process flow section slide
   */
  private addProcessFlow(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28,
        bold: true,
        color: this.colors.title,
        align: 'center'
      });
    }

    const steps = section.steps || [];
    const cardWidth = 1.5;
    const cardHeight = 2.5;
    const gap = 0.3;
    const startX = (10 - (steps.length * cardWidth + (steps.length - 1) * gap)) / 2;

    steps.forEach((step, idx) => {
      const x = startX + idx * (cardWidth + gap);
      const y = 1.8;

      // Step card background
      slide.addShape(this.pptx.ShapeType.roundRect, {
        x: x, y: y, w: cardWidth, h: cardHeight,
        fill: { color: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
        line: { color: this.colors.primary, width: 2 },
        radius: 0.1
      });

      // Step number circle
      slide.addShape(this.pptx.ShapeType.ellipse, {
        x: x + cardWidth / 2 - 0.25, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: this.colors.primary }
      });

      slide.addText(step.step.toString(), {
        x: x + cardWidth / 2 - 0.25, y: y + 0.25, w: 0.5, h: 0.5,
        fontSize: 18,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      });

      // Step title
      slide.addText(step.title, {
        x: x + 0.1, y: y + 0.8, w: cardWidth - 0.2, h: 0.6,
        fontSize: 12,
        bold: true,
        color: this.colors.title,
        align: 'center',
        valign: 'middle'
      });

      // Step description (truncated)
      const desc = step.description.length > 50
        ? step.description.substring(0, 50) + '...'
        : step.description;

      slide.addText(desc, {
        x: x + 0.1, y: y + 1.5, w: cardWidth - 0.2, h: 0.9,
        fontSize: 10,
        color: this.colors.text,
        align: 'center',
        valign: 'top'
      });

      // Arrow to next step
      if (idx < steps.length - 1) {
        slide.addShape(this.pptx.ShapeType.rightArrow, {
          x: x + cardWidth + 0.05, y: y + cardHeight / 2 - 0.15,
          w: 0.2, h: 0.3,
          fill: { color: this.colors.neutral }
        });
      }
    });
  }

  /**
   * Add comparison section slide
   */
  private addComparison(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    // Section title
    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28,
        bold: true,
        color: this.colors.title,
        align: 'center'
      });
    }

    const items = section.comparisonItems || [];

    // Build table data with cell-specific options
    const tableData = [
      [
        { text: '指标', options: { color: 'FFFFFF', fill: { color: this.colors.primary }, bold: true, fontSize: 14 } },
        { text: '选项 A', options: { color: 'FFFFFF', fill: { color: this.colors.primary }, bold: true, fontSize: 14 } },
        { text: '选项 B', options: { color: 'FFFFFF', fill: { color: this.colors.primary }, bold: true, fontSize: 14 } }
      ],
      ...items.flatMap((item, idx) => {
        const isEven = idx % 2 === 0;
        const baseFill = isEven ? 'F9FAFB' : 'FFFFFF';

        return [
          { text: item.label, options: { fontSize: 13, fill: { color: baseFill }, color: this.colors.text } },
          { text: item.left, options: { fontSize: 13, fill: { color: baseFill }, color: this.colors.primary, bold: true } },
          { text: item.right, options: { fontSize: 13, fill: { color: baseFill }, color: this.colors.secondary, bold: true } }
        ];
      })
    ];

    slide.addTable(tableData, {
      x: 1.5, y: 1.2, w: 7, h: 4.5,
      border: { pt: 1, color: 'E5E7EB' },
      align: 'center',
      valign: 'middle',
      colW: [2.5, 2.25, 2.25],
      margin: 0.1,
      rowH: 0.5,
    });

    // Optional content caption
    if (section.content) {
      slide.addText(section.content, {
        x: 0.8, y: 5.8, w: 8.4, h: 0.8,
        fontSize: 14,
        color: this.colors.text,
        align: 'center',
        italic: true
      });
    }
  }

  /**
   * Add sources slide
   */
  private addSourcesSlide(sources: { title: string; uri: string }[]): void {
    const slide = this.pptx.addSlide();

    slide.addText('Sources & References', {
      x: 0.5, y: 0.5, w: 9, h: 0.6,
      fontSize: 32,
      bold: true,
      color: this.colors.title,
      align: 'center'
    });

    const tableData = sources.map((s, idx) => [
      `${idx + 1}.`,
      s.title,
      s.uri
    ]);

    slide.addTable(tableData, {
      x: 0.8, y: 1.5, w: 8.4, h: 5,
      border: { pt: 1, color: 'E5E7EB' },
      fontSize: 11,
      colW: [0.5, 5, 2.9],
      margin: 0.1,
      color: this.colors.text,
    });
  }

  /**
   * Fallback for unknown section types
   */
  private addFallbackSection(section: InfographicSection): void {
    const slide = this.pptx.addSlide();

    slide.addText(`Unknown Section Type: ${section.type}`, {
      x: 0.5, y: 0.5, w: 9, h: 0.6,
      fontSize: 24,
      bold: true,
      color: this.colors.danger
    });

    if (section.title) {
      slide.addText(section.title, {
        x: 0.5, y: 1.2, w: 9, h: 0.5,
        fontSize: 18,
        color: this.colors.title
      });
    }

    slide.addText(JSON.stringify(section, null, 2), {
      x: 0.5, y: 2, w: 9, h: 4,
      fontSize: 10,
      fontFace: 'Courier',
      color: this.colors.text
    });
  }
}
