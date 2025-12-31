import { domToPng } from 'modern-screenshot';
import { InfographicReport } from '../../types';

/**
 * Image Exporter for InfographicReport
 * Exports each page as a high-resolution PNG image
 */
export class ImageExporter {
  private readonly SCALE = 3; // High resolution for better quality

  /**
   * Export a single page element as PNG
   * @param element - The DOM element to capture
   * @param filename - The filename for the exported image
   * @param backgroundColor - Background color for the image
   */
  async exportPageAsPng(
    element: HTMLElement,
    filename: string,
    backgroundColor: string = '#ffffff'
  ): Promise<void> {
    // Get the actual rendered dimensions of the element content
    const contentWidth = element.scrollWidth;
    const contentHeight = element.scrollHeight;

    console.log('[ImageExporter] Capturing element:', {
      scrollWidth: contentWidth,
      scrollHeight: contentHeight,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
    });

    if (contentWidth === 0 || contentHeight === 0) {
      console.error('[ImageExporter] Element has zero dimensions!', { contentWidth, contentHeight });
      throw new Error('Element has zero dimensions - cannot capture');
    }

    // Find the capture container and temporarily make it visible
    const captureContainer = element.closest('[style*="visibility: hidden"]') as HTMLElement;
    const originalVisibility = captureContainer?.style.visibility;

    try {
      // Temporarily make visible for capture
      if (captureContainer) {
        captureContainer.style.visibility = 'visible';
        // Small delay to ensure the browser has rendered the visible state
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Capture as PNG with high scale for better quality
      const pngDataUrl = await domToPng(element, {
        scale: this.SCALE,
        backgroundColor,
        width: contentWidth,
        height: contentHeight,
      });

      console.log('[ImageExporter] Capture successful, data URL length:', pngDataUrl.length);

      // Download the PNG
      this.downloadDataUrl(pngDataUrl, filename);
    } catch (error) {
      console.error('PNG export error:', error);
      throw new Error(`Failed to export PNG: ${error}`);
    } finally {
      // Restore original visibility
      if (captureContainer && originalVisibility !== undefined) {
        captureContainer.style.visibility = originalVisibility;
      }
    }
  }

  /**
   * Export all pages of a report as individual PNG files
   * @param report - The InfographicReport to export
   * @param getSectionElement - Function to get the DOM element for each section
   * @param basename - Base name for the files (defaults to report title)
   * @param isDarkMode - Current dark mode state
   */
  async exportAllPages(
    report: InfographicReport,
    getSectionElement: (type: 'title' | 'section' | 'sources', index?: number) => HTMLElement | null,
    basename?: string,
    isDarkMode?: boolean
  ): Promise<void> {
    const sanitizedBasename = (basename || report.title)
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50);

    const backgroundColor = isDarkMode ? '#161618' : '#ffffff';

    const pages: { element: HTMLElement; filename: string }[] = [];

    // Capture title + summary page
    const titleElement = getSectionElement('title');
    if (titleElement) {
      pages.push({
        element: titleElement,
        filename: `${sanitizedBasename}_cover.png`
      });
    }

    // Capture each section
    for (let i = 0; i < report.sections.length; i++) {
      const sectionElement = getSectionElement('section', i);
      if (sectionElement) {
        pages.push({
          element: sectionElement,
          filename: `${sanitizedBasename}_page_${i + 1}.png`
        });
      }
    }

    // Capture sources page if available
    if (report.sources && report.sources.length > 0) {
      const sourcesElement = getSectionElement('sources');
      if (sourcesElement) {
        pages.push({
          element: sourcesElement,
          filename: `${sanitizedBasename}_sources.png`
        });
      }
    }

    // Export all pages with a small delay between each to avoid overwhelming the browser
    for (const page of pages) {
      await this.exportPageAsPng(page.element, page.filename, backgroundColor);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  /**
   * Export a single page by its index
   * @param report - The InfographicReport
   * @param pageIndex - Page index (0 = cover, 1-N = sections, N+1 = sources)
   * @param getSectionElement - Function to get the DOM element
   * @param basename - Base name for the file
   * @param isDarkMode - Current dark mode state
   */
  async exportSinglePage(
    report: InfographicReport,
    pageIndex: number,
    getSectionElement: (type: 'title' | 'section' | 'sources', index?: number) => HTMLElement | null,
    basename?: string,
    isDarkMode?: boolean
  ): Promise<void> {
    const sanitizedBasename = (basename || report.title)
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50);

    const backgroundColor = isDarkMode ? '#161618' : '#ffffff';

    let element: HTMLElement | null = null;
    let filename = '';

    // Page 0 is always the title/cover
    if (pageIndex === 0) {
      element = getSectionElement('title');
      filename = `${sanitizedBasename}_cover.png`;
    } else if (pageIndex <= report.sections.length) {
      // Pages 1 to sections.length are the sections
      element = getSectionElement('section', pageIndex - 1);
      filename = `${sanitizedBasename}_page_${pageIndex}.png`;
    } else if (pageIndex === report.sections.length + 1 && report.sources && report.sources.length > 0) {
      // Last page is sources
      element = getSectionElement('sources');
      filename = `${sanitizedBasename}_sources.png`;
    }

    if (element) {
      await this.exportPageAsPng(element, filename, backgroundColor);
    } else {
      throw new Error(`Page ${pageIndex} not found`);
    }
  }

  /**
   * Trigger download of a data URL
   */
  private downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}
