import { domToPng } from 'modern-screenshot';
import { InfographicReport, BilingualText, getBilingualText, isBilingualText } from '../../types';

/**
 * Image Exporter for InfographicReport
 * Exports each page as a high-resolution PNG image
 */
export class ImageExporter {
  private readonly SCALE = 3; // High resolution for better quality

  /**
   * Find the actual content bounds by traversing children
   * Returns the tightest bounding box containing all visible content
   */
  private getContentBounds(element: HTMLElement): { left: number; top: number; right: number; bottom: number; width: number; height: number } {
    const children = Array.from(element.children);
    if (children.length === 0) {
      return { left: 0, top: 0, right: element.scrollWidth, bottom: element.scrollHeight, width: element.scrollWidth, height: element.scrollHeight };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const child of children) {
      const rect = child.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      // Calculate position relative to the element
      const relativeX = rect.left - elementRect.left + element.scrollLeft;
      const relativeY = rect.top - elementRect.top + element.scrollTop;

      if (rect.width > 0 && rect.height > 0) {
        minX = Math.min(minX, relativeX);
        minY = Math.min(minY, relativeY);
        maxX = Math.max(maxX, relativeX + rect.width);
        maxY = Math.max(maxY, relativeY + rect.height);
      }
    }

    // Fallback if no visible content found
    if (minX === Infinity) {
      return { left: 0, top: 0, right: element.scrollWidth, bottom: element.scrollHeight, width: element.scrollWidth, height: element.scrollHeight };
    }

    // Add padding (10px on each side)
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(element.scrollWidth, maxX + padding);
    maxY = Math.min(element.scrollHeight, maxY + padding);

    return {
      left: minX,
      top: minY,
      right: maxX,
      bottom: maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Export a single page element as PNG
   * @param element - The DOM element to capture
   * @param filename - The filename for exported image
   * @param backgroundColor - Background color for image
   */
  async exportPageAsPng(
    element: HTMLElement,
    filename: string,
    backgroundColor: string = '#ffffff'
  ): Promise<void> {
    // Get actual content bounds to crop empty whitespace
    const bounds = this.getContentBounds(element);

    console.log('[ImageExporter] Content bounds:', {
      elementScroll: { width: element.scrollWidth, height: element.scrollHeight },
      contentBounds: bounds,
      cropped: bounds.width !== element.scrollWidth || bounds.height !== element.scrollHeight
    });

    if (bounds.width === 0 || bounds.height === 0) {
      console.error('[ImageExporter] Element has zero dimensions!', bounds);
      throw new Error('Element has zero dimensions - cannot capture');
    }

    // Find the capture container and temporarily make it visible
    const captureContainer = element.closest('[style*="visibility: hidden"]') as HTMLElement;
    const originalVisibility = captureContainer?.style.visibility;

    try {
      // Temporarily make visible for capture
      if (captureContainer) {
        captureContainer.style.visibility = 'visible';
        // Small delay to ensure browser has rendered the visible state
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create a wrapper to crop the content
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.style.backgroundColor = backgroundColor;
      wrapper.style.width = `${bounds.width}px`;
      wrapper.style.height = `${bounds.height}px`;

      // Clone the element and position it to show only the content bounds
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = `${-bounds.left}px`;
      clone.style.top = `${-bounds.top}px`;
      clone.style.width = `${element.scrollWidth}px`;
      clone.style.height = `${element.scrollHeight}px`;
      clone.style.margin = '0';

      wrapper.appendChild(clone);
      captureContainer?.appendChild(wrapper);

      // Small delay to ensure the clone is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture as PNG with high scale for better quality
      const pngDataUrl = await domToPng(wrapper, {
        scale: this.SCALE,
        backgroundColor,
        width: bounds.width,
        height: bounds.height,
      });

      console.log('[ImageExporter] Capture successful, data URL length:', pngDataUrl.length);

      // Clean up the wrapper
      wrapper.remove();

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
   * @param mode - Export mode: 'separate' for individual files, 'combined' for single long image
   */
  async exportAllPages(
    report: InfographicReport,
    getSectionElement: (type: 'title' | 'section' | 'sources', index?: number) => HTMLElement | null,
    basename?: string,
    isDarkMode?: boolean,
    mode: 'separate' | 'combined' = 'separate'
  ): Promise<void> {
    const sanitizedBasename = (basename || report.title)
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50);

    const backgroundColor = isDarkMode ? '#161618' : '#ffffff';

    const pages: { element: HTMLElement; filename: string }[] = [];

    // Collect title + summary page
    const titleElement = getSectionElement('title');
    if (titleElement) {
      pages.push({
        element: titleElement,
        filename: `${sanitizedBasename}_cover.png`
      });
    }

    // Collect each section
    for (let i = 0; i < report.sections.length; i++) {
      const sectionElement = getSectionElement('section', i);
      if (sectionElement) {
        pages.push({
          element: sectionElement,
          filename: `${sanitizedBasename}_page_${i + 1}.png`
        });
      }
    }

    // Collect sources page if available
    if (report.sources && report.sources.length > 0) {
      const sourcesElement = getSectionElement('sources');
      if (sourcesElement) {
        pages.push({
          element: sourcesElement,
          filename: `${sanitizedBasename}_sources.png`
        });
      }
    }

    if (mode === 'combined') {
      // Export as single combined long image
      await this.exportCombinedPages(pages, sanitizedBasename, backgroundColor);
    } else {
      // Export as separate files
      for (const page of pages) {
        await this.exportPageAsPng(page.element, page.filename, backgroundColor);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }

  /**
   * Export all pages combined into a single long PNG image
   * Fixed width, height grows dynamically
   */
  private async exportCombinedPages(
    pages: { element: HTMLElement; filename: string }[],
    basename: string,
    backgroundColor: string
  ): Promise<void> {
    const captureContainer = pages[0]?.element.closest('[style*="visibility: hidden"]') as HTMLElement;
    const originalVisibility = captureContainer?.style.visibility;

    try {
      // Temporarily make visible for capture
      if (captureContainer) {
        captureContainer.style.visibility = 'visible';
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Calculate bounds for all pages
      type ContentBounds = { left: number; top: number; right: number; bottom: number; width: number; height: number };
      const pageBounds: Array<{ bounds: ContentBounds; original: HTMLElement }> = [];
      let maxWidth = 0;
      let totalHeight = 0;

      for (const page of pages) {
        const bounds = this.getContentBounds(page.element);
        pageBounds.push({ bounds, original: page.element });
        maxWidth = Math.max(maxWidth, bounds.width);
        totalHeight += bounds.height;
      }

      console.log('[ImageExporter] Combined export:', {
        pageCount: pages.length,
        maxWidth,
        totalHeight,
        pageBounds: pageBounds.map(b => ({ width: b.bounds.width, height: b.bounds.height }))
      });

      // Create a combined wrapper
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.style.backgroundColor = backgroundColor;
      wrapper.style.width = `${maxWidth}px`;
      wrapper.style.height = `${totalHeight}px`;

      // Add each page clone to the wrapper
      let currentY = 0;
      for (let i = 0; i < pageBounds.length; i++) {
        const { bounds, original } = pageBounds[i];
        const clone = original.cloneNode(true) as HTMLElement;

        clone.style.position = 'absolute';
        clone.style.left = `${-bounds.left + (maxWidth - bounds.width) / 2}px`; // Center horizontally
        clone.style.top = `${-bounds.top + currentY}px`;
        clone.style.width = `${original.scrollWidth}px`;
        clone.style.height = `${original.scrollHeight}px`;
        clone.style.margin = '0';

        wrapper.appendChild(clone);
        currentY += bounds.height;
      }

      captureContainer?.appendChild(wrapper);

      // Small delay to ensure wrapper is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture as PNG
      const pngDataUrl = await domToPng(wrapper, {
        scale: this.SCALE,
        backgroundColor,
        width: maxWidth,
        height: totalHeight,
      });

      console.log('[ImageExporter] Combined capture successful, data URL length:', pngDataUrl.length);

      // Clean up wrapper
      wrapper.remove();

      // Download combined PNG
      this.downloadDataUrl(pngDataUrl, `${basename}_combined.png`);
    } catch (error) {
      console.error('Combined PNG export error:', error);
      throw new Error(`Failed to export combined PNG: ${error}`);
    } finally {
      // Restore original visibility
      if (captureContainer && originalVisibility !== undefined) {
        captureContainer.style.visibility = originalVisibility;
      }
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
      // Pages 1 to sections.length are sections
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
   * Check if a report is bilingual (contains bilingual text)
   */
  private isBilingualReport(report: InfographicReport): boolean {
    return isBilingualText(report.title);
  }

  /**
   * Export bilingual pages - separate files for English and Chinese
   * @param report - The InfographicReport to export
   * @param getSectionElement - Function to get the DOM element for each section
   * @param basename - Base name for the files (defaults to report title)
   * @param isDarkMode - Current dark mode state
   */
  async exportBilingualPages(
    report: InfographicReport,
    getSectionElement: (type: 'title' | 'section' | 'sources', index?: number, lang?: 'en' | 'zh') => HTMLElement | null,
    basename?: string,
    isDarkMode?: boolean
  ): Promise<void> {
    const sanitizedBasename = (basename || getBilingualText(report.title, 'en'))
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50);

    const backgroundColor = isDarkMode ? '#161618' : '#ffffff';

    const languages: Array<{ code: 'en' | 'zh'; suffix: string }> = [
      { code: 'en', suffix: 'en' },
      { code: 'zh', suffix: 'zh' }
    ];

    for (const lang of languages) {
      const langBasename = `${sanitizedBasename}_${lang.suffix}`;

      // Collect title + summary page
      const titleElement = getSectionElement('title', undefined, lang.code);
      if (titleElement) {
        await this.exportPageAsPng(titleElement, `${langBasename}_cover.png`, backgroundColor);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Collect each section
      for (let i = 0; i < report.sections.length; i++) {
        const sectionElement = getSectionElement('section', i, lang.code);
        if (sectionElement) {
          await this.exportPageAsPng(sectionElement, `${langBasename}_page_${i + 1}.png`, backgroundColor);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Collect sources page if available
      if (report.sources && report.sources.length > 0) {
        const sourcesElement = getSectionElement('sources', undefined, lang.code);
        if (sourcesElement) {
          await this.exportPageAsPng(sourcesElement, `${langBasename}_sources.png`, backgroundColor);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
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
