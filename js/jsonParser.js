/**
 * JSON Parser Module
 * Handles JSON validation, parsing, formatting, and display
 */

import { validateJSON, formatJSON, syntaxHighlight, analyzeJSON, formatBytes } from './utils.js';

export class JSONParser {
    constructor() {
        this.currentJSON = null;
        this.jsonInput = document.getElementById('jsonInput');
        this.outputContainer = document.getElementById('outputContainer');
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
            this.displayOutput(null);
            this.updateStats(null);
            return false;
        }

        const result = validateJSON(input);

        if (result.valid) {
            this.currentJSON = result.data;
            this.showError('');
            this.displayOutput(this.currentJSON);
            this.updateStats(input);
            return true;
        } else {
            this.currentJSON = null;
            this.showError(result.error);
            this.displayOutput(null);
            this.updateStats(null);
            return false;
        }
    }

    /**
     * Display error message
     * @param {string} error - Error message
     */
    showError(error) {
        if (!error) {
            this.errorDisplay.classList.add('hidden');
            this.errorDisplay.textContent = '';
            return;
        }

        this.errorDisplay.classList.remove('hidden');
        this.errorDisplay.textContent = error;
    }

    /**
     * Display formatted JSON output
     * @param {*} data - JSON data to display
     */
    displayOutput(data) {
        if (!data) {
            this.outputContainer.innerHTML = `
                <div class="placeholder-message">
                    <p>👈 Enter JSON data on the left to get started</p>
                </div>
            `;
            return;
        }

        const formatted = formatJSON(data, 2);
        const highlighted = syntaxHighlight(formatted);

        this.outputContainer.innerHTML = `
            <div class="badge badge-success mb-2">✓ Valid JSON</div>
            <pre class="json-formatted">${highlighted}</pre>
        `;

        // Enable copy button
        const copyBtn = document.getElementById('copyOutputBtn');
        if (copyBtn) {
            copyBtn.disabled = false;
        }
    }

    /**
     * Update statistics display
     * @param {string} input - Raw JSON string
     */
    updateStats(input) {
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
        this.displayOutput(null);
        this.updateStats(null);

        const copyBtn = document.getElementById('copyOutputBtn');
        if (copyBtn) {
            copyBtn.disabled = true;
        }
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

    /**
     * Get formatted output text
     * @returns {string} Formatted JSON string
     */
    getOutputText() {
        if (!this.currentJSON) return '';
        return formatJSON(this.currentJSON, 2);
    }
}
