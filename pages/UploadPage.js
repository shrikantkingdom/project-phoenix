/**
 * UploadPage - File upload page object
 * Handles file upload interactions and verification
 */

const BasePage = require('./BasePage');
const Logger = require('../utils/Logger');
const path = require('path');

class UploadPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = 'File Upload';
    this.pageUrl = '/upload';
  }

  /**
   * Get selectors for upload page
   */
  getSelectors() {
    return {
      fileInput: [
        'input[id="file-upload"]',
        'input[type="file"]',
        'input[name="file"]',
      ],
      uploadButton: [
        'button:has-text("Upload")',
        'button[id="file-submit"]',
        'button.upload-btn',
        'input[type="submit"]',
      ],
      uploadedFileName: [
        'div#uploaded-file',
        'div.uploaded-file',
        'span.file-name',
      ],
      successMessage: [
        'div.success-message',
        'div[class*="success" i]',
        'span.alert-success',
      ],
      errorMessage: [
        'div.error-message',
        'div[class*="error" i]',
        'span.alert-danger',
      ],
    };
  }

  /**
   * Navigate to upload page
   */
  async navigateToUploadPage() {
    try {
      Logger.info('[UploadPage] Navigating to upload page');
      await this.goto(this.pageUrl);
      await this.verifyPageLoaded();
      Logger.info('[UploadPage] Upload page loaded successfully');
    } catch (error) {
      Logger.error('[UploadPage] Failed to navigate to upload page', error);
      throw error;
    }
  }

  /**
   * Verify upload page loaded
   */
  async verifyPageLoaded() {
    try {
      Logger.step(1, 'Verify upload page is loaded');
      const selectors = this.getSelectors();
      const fileInputSelector = await this.getSelectorByStrategy(selectors.fileInput);
      await this.waitUtils.waitForElementVisible(this.page, fileInputSelector);
      Logger.info('[UploadPage] Page loaded successfully');
    } catch (error) {
      Logger.error('[UploadPage] Page load verification failed', error);
      throw error;
    }
  }

  /**
   * Self-healing selector strategy
   */
  async getSelectorByStrategy(strategies) {
    for (const selector of strategies) {
      try {
        if (await this.isElementPresent(selector)) {
          Logger.debug(`[UploadPage] Found element with selector: ${selector}`);
          return selector;
        }
      } catch (error) {
        Logger.debug(`[UploadPage] Strategy failed - trying next: ${selector}`);
      }
    }
    throw new Error(`[UploadPage] All selector strategies failed: ${strategies.join(', ')}`);
  }

  /**
   * Upload file
   */
  async uploadFile(filePath) {
    try {
      Logger.step(2, `Upload file: ${filePath}`);

      // Verify file exists
      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        const fullPath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(fullPath)) {
          throw new Error(`File not found: ${filePath}`);
        }
      }

      const selectors = this.getSelectors();
      const fileInputSelector = await this.getSelectorByStrategy(selectors.fileInput);

      Logger.info(`[UploadPage] Setting file input: ${filePath}`);
      await this.page.setInputFiles(fileInputSelector, filePath);

      const uploadButtonSelector = await this.getSelectorByStrategy(selectors.uploadButton);
      Logger.info('[UploadPage] Clicking upload button');
      await this.click(uploadButtonSelector);

      // Wait for upload to complete
      await this.waitUtils.waitForNavigation(this.page);
      Logger.info('[UploadPage] File upload completed');
    } catch (error) {
      Logger.error('[UploadPage] File upload failed', error);
      throw error;
    }
  }

  /**
   * Verify file was uploaded successfully
   */
  async verifyUploadSuccess() {
    try {
      Logger.step(3, 'Verify successful upload');

      const selectors = this.getSelectors();

      // Check for success message
      try {
        const successSelector = await this.getSelectorByStrategy(selectors.successMessage);
        const isVisible = await this.isElementVisible(successSelector);
        if (isVisible) {
          const successText = await this.getText(successSelector);
          Logger.info(`[UploadPage] Upload successful - success message: ${successText}`);
          return true;
        }
      } catch (e) {
        Logger.debug('[UploadPage] No success message found');
      }

      // Check if uploaded file name is displayed
      try {
        const fileNameSelector = await this.getSelectorByStrategy(selectors.uploadedFileName);
        const isVisible = await this.isElementVisible(fileNameSelector);
        if (isVisible) {
          const fileName = await this.getText(fileNameSelector);
          Logger.info(`[UploadPage] Upload successful - file displayed: ${fileName}`);
          return true;
        }
      } catch (e) {
        Logger.debug('[UploadPage] No file name display found');
      }

      Logger.warn('[UploadPage] Upload verification unclear');
      return false;
    } catch (error) {
      Logger.error('[UploadPage] Upload success check failed', error);
      throw error;
    }
  }

  /**
   * Verify upload failed
   */
  async verifyUploadFailed() {
    try {
      Logger.step(3, 'Verify failed upload');

      const selectors = this.getSelectors();
      const errorSelector = await this.getSelectorByStrategy(selectors.errorMessage);
      const isVisible = await this.isElementVisible(errorSelector);

      if (isVisible) {
        const errorText = await this.getText(errorSelector);
        Logger.info(`[UploadPage] Upload failed - error visible: ${errorText}`);
        return true;
      }

      Logger.warn('[UploadPage] Expected error message not found');
      return false;
    } catch (error) {
      Logger.error('[UploadPage] Upload failure check failed', error);
      throw error;
    }
  }

  /**
   * Get uploaded file name
   */
  async getUploadedFileName() {
    try {
      const selectors = this.getSelectors();
      const fileNameSelector = await this.getSelectorByStrategy(selectors.uploadedFileName);
      return await this.getText(fileNameSelector);
    } catch (error) {
      Logger.warn('[UploadPage] Could not get uploaded file name', { error: error.message });
      return '';
    }
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    try {
      const selectors = this.getSelectors();
      const errorSelector = await this.getSelectorByStrategy(selectors.errorMessage);
      return await this.getText(errorSelector);
    } catch (error) {
      Logger.warn('[UploadPage] Could not get error message', { error: error.message });
      return '';
    }
  }

  /**
   * Verify page title
   */
  async verifyPageTitle() {
    try {
      const title = await this.getTitle();
      Logger.debug(`[UploadPage] Page title: ${title}`);
      this.assertUtils.assertStringContains(title, this.pageTitle, 'Page title validation', true);
      return true;
    } catch (error) {
      Logger.warn('[UploadPage] Page title verification failed', { error: error.message });
      return false;
    }
  }

  /**
   * Upload with drag and drop (advanced)
   */
  async uploadFileViaDragDrop(filePath) {
    try {
      Logger.info('[UploadPage] Uploading file via drag and drop');

      const dataTransfer = await this.page.evaluateHandle(
        async (filePath) => {
          const fs = require('fs');
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const dataTransfer = new DataTransfer();
          const file = new File([fileContent], filePath, { type: 'text/plain' });
          dataTransfer.items.add(file);
          return dataTransfer;
        },
        filePath
      );

      const selectors = this.getSelectors();
      const fileInputSelector = await this.getSelectorByStrategy(selectors.fileInput);

      await this.page.dispatchEvent(fileInputSelector, 'drop', { dataTransfer });

      await this.waitUtils.waitForNavigation(this.page);
      Logger.info('[UploadPage] Drag and drop upload completed');
    } catch (error) {
      Logger.warn('[UploadPage] Drag and drop upload not supported', { error: error.message });
      // Fall back to regular upload
      await this.uploadFile(filePath);
    }
  }
}

module.exports = UploadPage;
