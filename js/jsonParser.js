/**
 * JSON Parser Module
 * Handles JSON validation, parsing, formatting, and display
 */

import { validateJSON, formatJSON, syntaxHighlight, analyzeJSON, formatBytes } from './utils.js';

export class JSONParser {
    constructor() {
        this.currentJSON = null;
        this.jsonInput = document.getElementById('jsonInput');
        this.errorDisplay = document.getElementById('jsonError');
        this.statsDisplay = document.getElementById('jsonStats');
    }

    /**
     * Parse and validate JSON input
     * @param {string} input - JSON string to parse
     * @returns {boolean} Success status
     */
    parse(input) {
        if (!input || input.trim() === '') {
            this.showError('');
            this.currentJSON = null;
            this.updateStats(null);
            return false;
        }

        const result = validateJSON(input);

        if (result.valid) {
            this.currentJSON = result.data;
            this.showError('');
            this.updateStats(input);
            return true;
        } else {
            this.currentJSON = null;
            this.showError(result.error);
            this.updateStats(null);
            return false;
        }
    }

    /**
     * Display error message
     * @param {string} error - Error message
     */
    showError(error) {
        // Skip if errorDisplay doesn't exist
        if (!this.errorDisplay) {
            console.error('Error display element not found:', error);
            return;
        }

        if (!error) {
            this.errorDisplay.classList.add('hidden');
            this.errorDisplay.textContent = '';
            return;
        }

        this.errorDisplay.classList.remove('hidden');
        this.errorDisplay.textContent = error;
    }

    /**
     * Update statistics display
     * @param {string} input - Raw JSON string
     */
    updateStats(input) {
        // Skip if statsDisplay doesn't exist
        if (!this.statsDisplay) {
            return;
        }

        if (!input || !this.currentJSON) {
            this.statsDisplay.textContent = '';
            return;
        }

        const size = new Blob([input]).size;
        const stats = analyzeJSON(this.currentJSON);

        const parts = [
            `Size: ${formatBytes(size)}`,
            `Type: ${stats.type}`,
            `Properties: ${stats.properties}`,
            `Depth: ${stats.depth}`
        ];

        if (stats.type === 'array') {
            parts.push(`Items: ${stats.arrayLength}`);
        }

        this.statsDisplay.textContent = parts.join(' • ');
    }

    /**
     * Format the current input
     * @returns {boolean} Success status
     */
    formatInput() {
        const input = this.jsonInput.value;
        const result = validateJSON(input);

        if (result.valid) {
            const formatted = formatJSON(result.data, 2);
            this.jsonInput.value = formatted;
            this.parse(formatted);
            return true;
        }

        return false;
    }

    /**
     * Clear all input and output
     */
    clear() {
        this.jsonInput.value = '';
        this.currentJSON = null;
        this.showError('');
        this.updateStats(null);
    }

    /**
     * Load JSON from file
     * @param {File} file - File object
     * @returns {Promise<boolean>} Success status
     */
    async loadFromFile(file) {
        if (!file) return false;

        // Check file type
        if (!file.name.endsWith('.json')) {
            this.showError('Please select a valid .json file');
            return false;
        }

        // Check file size (limit to 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('File too large. Maximum size is 10MB');
            return false;
        }

        try {
            const text = await file.text();
            this.jsonInput.value = text;
            const success = this.parse(text);

            if (success) {
                // Format it for better readability
                this.formatInput();
            }

            return success;
        } catch (error) {
            this.showError(`Error reading file: ${error.message}`);
            return false;
        }
    }

    /**
     * Get the current parsed JSON
     * @returns {*} Current JSON data
     */
    getCurrentJSON() {
        return this.currentJSON;
    }
}
