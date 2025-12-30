import { domToPng } from 'modern-screenshot';
import jsPDF from 'jspdf';
import { InfographicReport, InfographicSection } from '../../types';

/**
 * PDF Exporter for InfographicReport
 * Converts InfographicReport to multi-page PDF by capturing each section as an image
 */
export class PdfExporter {
  private readonly TARGET_WIDTH = 1920;
  private readonly TARGET_HEIGHT = 1080;
  private readonly BASE_SCALE = 2; // Base scale for retina clarity

  /**
   * Export report to PDF
   * @param report - The InfographicReport to export
   * @param getSectionElement - Function to get the DOM element for each section
   * @param filename - Optional filename (defaults to report title)
   * @param isDarkMode - Current dark mode state
   */
  async export(
    report: InfographicReport,
    getSectionElement: (type: 'title' | 'section' | 'sources', index?: number) => HTMLElement | null,
    filename?: string,
    isDarkMode?: boolean
  ): Promise<void> {
    const pdfData: { imageData: string; width: number; height: number }[] = [];

    // Capture title + summary page
    const titleElement = getSectionElement('title');
    if (titleElement) {
      const { imageData, width, height } = await this.captureElement(titleElement, isDarkMode);
      pdfData.push({ imageData, width, height });
    }

    // Capture each section
    for (let i = 0; i < report.sections.length; i++) {
      const sectionElement = getSectionElement('section', i);
      if (sectionElement) {
        const { imageData, width, height } = await this.captureElement(sectionElement, isDarkMode);
        pdfData.push({ imageData, width, height });
      }
    }

    // Capture sources page if available
    if (report.sources && report.sources.length > 0) {
      const sourcesElement = getSectionElement('sources');
      if (sourcesElement) {
        const { imageData, width, height } = await this.captureElement(sourcesElement, isDarkMode);
        pdfData.push({ imageData, width, height });
      }
    }

    // Create PDF from captured images with dynamic page sizes
    this.createPdfFromImages(pdfData, filename || `${report.title}.pdf`);
  }

  /**
   * Capture a DOM element as PNG image with optimal scale to fill the page
   */
  private async captureElement(element: HTMLElement, isDarkMode?: boolean): Promise<{
    imageData: string;
    width: number;
    height: number;
  }> {
    const backgroundColor = isDarkMode ? '#161618' : '#F9FAFB';

    // Get the actual rendered dimensions of the element content
    // Use scrollWidth/Height to get the full content size including overflow
    const contentWidth = element.scrollWidth;
    const contentHeight = element.scrollHeight;

    console.log(`[PdfExporter] Element natural size: ${contentWidth}x${contentHeight}`);

    // Calculate scale to fit content into target page size
    // Use the smaller ratio to ensure content fits without overflow
    const scaleX = this.TARGET_WIDTH / contentWidth;
    const scaleY = this.TARGET_HEIGHT / contentHeight;
    const scaleToFill = Math.min(scaleX, scaleY);

    // Use the smaller of scaleToFill and BASE_SCALE to avoid over-scaling
    // Allow scale < 1 to downscale content that is larger than target
    const finalScale = Math.min(scaleToFill, this.BASE_SCALE);

    console.log(`[PdfExporter] Target: ${this.TARGET_WIDTH}x${this.TARGET_HEIGHT}, Content: ${contentWidth}x${contentHeight}, Scale: ${finalScale.toFixed(2)}`);

    // Capture with the calculated scale - this gives us the exact size we need for the PDF
    const imageData = await domToPng(element, {
      scale: finalScale,
      backgroundColor,
      width: contentWidth,
      height: contentHeight,
    });

    // The actual image size is contentSize * finalScale
    const actualImageWidth = contentWidth * finalScale;
    const actualImageHeight = contentHeight * finalScale;

    return { imageData, width: actualImageWidth, height: actualImageHeight };
  }

  /**
   * Create a multi-page PDF from images with dynamic page sizes
   */
  private createPdfFromImages(
    pages: { imageData: string; width: number; height: number }[],
    filename: string
  ): void {
    // Use fixed target size for consistent PDF pages
    const pageWidth = this.TARGET_WIDTH;
    const pageHeight = this.TARGET_HEIGHT;

    console.log(`[PdfExporter] Creating PDF with fixed size: ${pageWidth}x${pageHeight}`);

    // Create PDF with fixed 16:9 landscape format
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [pageWidth, pageHeight],
      hotfixes: ['px_scaling']
    });

    // Add each image as a page
    pages.forEach((page, idx) => {
      if (idx > 0) {
        pdf.addPage([pageWidth, pageHeight]);
      }

      // Images are already captured at the correct scale to fit within the page
      // Just center them on the page
      const x = (pageWidth - page.width) / 2;
      const y = (pageHeight - page.height) / 2;

      console.log(`[PdfExporter] Page ${idx + 1}: image ${page.width}x${page.height} at (${x.toFixed(0)}, ${y.toFixed(0)})`);

      pdf.addImage(page.imageData, 'PNG', x, y, page.width, page.height);
    });

    // Save the PDF
    pdf.save(filename);
  }
}
