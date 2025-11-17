/**
 * Main Application Module
 * Initializes and coordinates all app functionality
 */

import { JSONParser } from './jsonParser.js';
import { debounce, copyToClipboard, showNotification } from './utils.js';

class App {
    constructor() {
        this.jsonParser = new JSONParser();
        this.isDarkTheme = false;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 JSON Analyser initializing...');

        // Load saved theme preference
        this.loadThemePreference();

        // Setup event listeners
        this.setupEventListeners();

        // Check for initial JSON in input
        this.handleJSONInput();

        console.log('✅ JSON Analyser ready!');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // JSON Input - debounced for performance
        const jsonInput = document.getElementById('jsonInput');
        if (jsonInput) {
            jsonInput.addEventListener('input', debounce(() => {
                this.handleJSONInput();
            }, 500));
        }

        // Format Button
        const formatBtn = document.getElementById('formatBtn');
        if (formatBtn) {
            formatBtn.addEventListener('click', () => this.handleFormat());
        }

        // Clear Button
        const clearInputBtn = document.getElementById('clearInputBtn');
        if (clearInputBtn) {
            clearInputBtn.addEventListener('click', () => this.handleClear());
        }

        // Upload Button
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Copy Output Button
        const copyOutputBtn = document.getElementById('copyOutputBtn');
        if (copyOutputBtn) {
            copyOutputBtn.addEventListener('click', () => this.handleCopyOutput());
        }

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Drag and drop support
        this.setupDragAndDrop();
    }

    /**
     * Handle JSON input change
     */
    handleJSONInput() {
        const input = document.getElementById('jsonInput').value;
        this.jsonParser.parse(input);
    }

    /**
     * Handle format button click
     */
    handleFormat() {
        const success = this.jsonParser.formatInput();
        if (success) {
            showNotification('JSON formatted successfully', 'success');
        } else {
            showNotification('Cannot format invalid JSON', 'error');
        }
    }

    /**
     * Handle clear button click
     */
    handleClear() {
        if (confirm('Clear all input and output?')) {
            this.jsonParser.clear();
            showNotification('Cleared', 'info');
        }
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const success = await this.jsonParser.loadFromFile(file);

        if (success) {
            showNotification(`Loaded ${file.name}`, 'success');
        } else {
            showNotification('Failed to load file', 'error');
        }

        // Reset file input
        event.target.value = '';
    }

    /**
     * Handle copy output button click
     */
    async handleCopyOutput() {
        const text = this.jsonParser.getOutputText();
        if (!text) return;

        const success = await copyToClipboard(text);
        const copyBtn = document.getElementById('copyOutputBtn');

        if (success) {
            showNotification('Copied to clipboard', 'success');
            // Visual feedback
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓ Copied';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } else {
            showNotification('Failed to copy', 'error');
        }
    }

    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = this.isDarkTheme ? '☀️' : '🌙';
        }

        // Save preference
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
        showNotification(`${this.isDarkTheme ? 'Dark' : 'Light'} theme enabled`, 'info');
    }

    /**
     * Load theme preference from localStorage
     */
    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
            document.body.classList.add('dark-theme');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
            }
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + Enter: Format JSON
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            this.handleFormat();
        }

        // Ctrl/Cmd + K: Clear
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.handleClear();
        }

        // Ctrl/Cmd + /: Toggle theme
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            this.toggleTheme();
        }
    }

    /**
     * Setup drag and drop for JSON files
     */
    setupDragAndDrop() {
        const jsonInput = document.getElementById('jsonInput');
        if (!jsonInput) return;

        const container = jsonInput.closest('.panel-body');
        if (!container) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, () => {
                container.style.backgroundColor = 'var(--accent-light)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, () => {
                container.style.backgroundColor = '';
            }, false);
        });

        container.addEventListener('drop', async (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                const success = await this.jsonParser.loadFromFile(file);

                if (success) {
                    showNotification(`Loaded ${file.name}`, 'success');
                } else {
                    showNotification('Failed to load file', 'error');
                }
            }
        }, false);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}
