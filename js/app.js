/**
 * Main Application Module
 * Initializes and coordinates all app functionality
 */

import { JSONParser } from './jsonParser.js';
import { QueryEngine } from './queryEngine.js';
import { QueryBuilder } from './queryBuilder.js';
import { ResultsExporter } from './results.js';
import { StorageManager } from './storage.js';
import { debounce, copyToClipboard, showNotification } from './utils.js';

class App {
    constructor() {
        this.jsonParser = new JSONParser();
        this.queryEngine = null; // Will be initialized after DOM is ready
        this.queryBuilder = null; // Week 3: Visual query builder
        this.resultsExporter = new ResultsExporter(); // Week 4: Export functionality
        this.storageManager = new StorageManager(); // Week 4: localStorage management
        this.isDarkTheme = false;
        this.queryMode = 'code'; // 'code' or 'builder'
        this.currentResults = null; // Store current query results for export

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 JSON Analyser initializing...');

        // Initialize query engine (Week 2)
        this.queryEngine = new QueryEngine(this.jsonParser);

        // Initialize query builder (Week 3)
        this.queryBuilder = new QueryBuilder(this.queryEngine, this.jsonParser);
        this.queryBuilder.init();

        // Load saved theme preference
        this.loadThemePreference();

        // Setup event listeners
        this.setupEventListeners();

        // Setup query features
        this.setupQueryFeatures();

        // Check for initial JSON in input
        this.handleJSONInput();

        // Week 4: Load query from URL if present
        this.loadQueryFromURL();

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

        // Query Engine (Week 2)
        const queryInput = document.getElementById('queryInput');
        if (queryInput) {
            queryInput.addEventListener('input', debounce(() => {
                this.handleQueryInput();
            }, 500));
        }

        const executeQueryBtn = document.getElementById('executeQueryBtn');
        if (executeQueryBtn) {
            executeQueryBtn.addEventListener('click', () => this.handleExecuteQuery());
        }

        const clearQueryBtn = document.getElementById('clearQueryBtn');
        if (clearQueryBtn) {
            clearQueryBtn.addEventListener('click', () => this.handleClearQuery());
        }

        const exampleQuerySelect = document.getElementById('exampleQuerySelect');
        if (exampleQuerySelect) {
            exampleQuerySelect.addEventListener('change', (e) => this.handleExampleQuery(e));
        }

        const copyResultsBtn = document.getElementById('copyResultsBtn');
        if (copyResultsBtn) {
            copyResultsBtn.addEventListener('click', () => this.handleCopyResults());
        }

        // Mode Toggle (Week 3)
        const codeModeBtn = document.getElementById('codeMode');
        const builderModeBtn = document.getElementById('builderMode');

        if (codeModeBtn) {
            codeModeBtn.addEventListener('click', () => this.switchMode('code'));
        }

        if (builderModeBtn) {
            builderModeBtn.addEventListener('click', () => this.switchMode('builder'));
        }

        // Week 4: Export buttons
        const exportJSONBtn = document.getElementById('exportJSONBtn');
        if (exportJSONBtn) {
            exportJSONBtn.addEventListener('click', () => this.handleExportJSON());
        }

        const exportCSVBtn = document.getElementById('exportCSVBtn');
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.handleExportCSV());
        }

        // Week 4: Save/Load Query buttons
        const saveQueryBtn = document.getElementById('saveQueryBtn');
        if (saveQueryBtn) {
            saveQueryBtn.addEventListener('click', () => this.openSaveQueryModal());
        }

        const savedQueriesBtn = document.getElementById('savedQueriesBtn');
        if (savedQueriesBtn) {
            savedQueriesBtn.addEventListener('click', () => this.openSavedQueriesModal());
        }

        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.openHistoryModal());
        }

        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.openHelpModal());
        }

        // Week 4: Modal controls
        const confirmSaveQuery = document.getElementById('confirmSaveQuery');
        if (confirmSaveQuery) {
            confirmSaveQuery.addEventListener('click', () => this.handleSaveQuery());
        }

        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.handleClearHistory());
        }

        // Modal close buttons (all modals)
        document.querySelectorAll('.modal-close, .modal [data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal') ||
                               e.target.closest('.modal-close')?.parentElement.parentElement.parentElement.id;
                if (modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Drag and drop support
        this.setupDragAndDrop();
    }

    /**
     * Setup query features (Week 2)
     */
    setupQueryFeatures() {
        // Populate example queries dropdown
        const exampleQuerySelect = document.getElementById('exampleQuerySelect');
        if (!exampleQuerySelect || !this.queryEngine) return;

        const examples = this.queryEngine.getExampleQueries();
        examples.forEach((example, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = example.name;
            exampleQuerySelect.appendChild(option);
        });
    }

    /**
     * Handle JSON input change
     */
    handleJSONInput() {
        const input = document.getElementById('jsonInput').value;
        this.jsonParser.parse(input);

        // Refresh query builder when JSON changes (Week 3)
        if (this.queryBuilder) {
            this.queryBuilder.refresh();
        }
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
     * Handle query input change (Week 2)
     */
    handleQueryInput() {
        const query = document.getElementById('queryInput').value;
        if (this.queryEngine) {
            this.queryEngine.executeQuery(query);
        }
    }

    /**
     * Handle execute query button click (Week 2)
     */
    handleExecuteQuery() {
        const query = document.getElementById('queryInput').value;
        if (this.queryEngine) {
            const success = this.queryEngine.executeQuery(query);
            if (success) {
                // Week 4: Store results for export
                this.currentResults = this.queryEngine.queryResults;
                this.updateExportButtons();

                // Week 4: Add to history
                if (query.trim()) {
                    this.storageManager.addToHistory(query);
                }

                showNotification('Query executed successfully', 'success');
            }
        }
    }

    /**
     * Handle clear query button click (Week 2)
     */
    handleClearQuery() {
        if (this.queryEngine) {
            this.queryEngine.clear();
        }

        // Also clear the builder (Week 3)
        if (this.queryBuilder) {
            this.queryBuilder.reset();
        }

        showNotification('Query cleared', 'info');
    }

    /**
     * Handle example query selection (Week 2)
     */
    handleExampleQuery(event) {
        const index = parseInt(event.target.value);
        if (!isNaN(index) && this.queryEngine) {
            this.queryEngine.loadExampleQuery(index);
        }
        // Reset dropdown
        event.target.value = '';
    }

    /**
     * Handle copy results button click (Week 2)
     */
    async handleCopyResults() {
        if (!this.queryEngine) return;

        const text = this.queryEngine.getResultsText();
        if (!text) return;

        const success = await copyToClipboard(text);
        const copyBtn = document.getElementById('copyResultsBtn');

        if (success) {
            showNotification('Results copied to clipboard', 'success');
            // Visual feedback
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓ Copied';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } else {
            showNotification('Failed to copy results', 'error');
        }
    }

    /**
     * Switch between Code and Builder modes (Week 3)
     */
    switchMode(mode) {
        this.queryMode = mode;

        const codeView = document.getElementById('codeView');
        const builderView = document.getElementById('builderView');
        const codeModeBtn = document.getElementById('codeMode');
        const builderModeBtn = document.getElementById('builderMode');

        if (mode === 'code') {
            // Show code view
            codeView?.classList.remove('hidden');
            builderView?.classList.add('hidden');
            codeModeBtn?.classList.add('active');
            builderModeBtn?.classList.remove('active');
        } else {
            // Show builder view
            codeView?.classList.add('hidden');
            builderView?.classList.remove('hidden');
            codeModeBtn?.classList.remove('active');
            builderModeBtn?.classList.add('active');

            // Refresh builder when switching to it
            if (this.queryBuilder) {
                this.queryBuilder.refresh();
            }
        }

        showNotification(`Switched to ${mode} mode`, 'info');
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
        // Ctrl/Cmd + Enter: Format JSON (in JSON input)
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id === 'jsonInput') {
                event.preventDefault();
                this.handleFormat();
            }
        }

        // Shift + Enter: Execute Query (in query input)
        if (event.shiftKey && event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id === 'queryInput') {
                event.preventDefault();
                this.handleExecuteQuery();
            }
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

    // ========== Week 4: Export & Storage Features ==========

    /**
     * Handle export to JSON
     */
    handleExportJSON() {
        if (!this.currentResults) {
            showNotification('No results to export', 'error');
            return;
        }

        try {
            this.resultsExporter.exportToJSON(this.currentResults);
            showNotification('Exported to JSON successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Failed to export JSON', 'error');
        }
    }

    /**
     * Handle export to CSV
     */
    handleExportCSV() {
        if (!this.currentResults) {
            showNotification('No results to export', 'error');
            return;
        }

        try {
            this.resultsExporter.exportToCSV(this.currentResults);
            showNotification('Exported to CSV successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Failed to export CSV', 'error');
        }
    }

    /**
     * Update export button states
     */
    updateExportButtons() {
        const hasResults = this.currentResults !== null;
        const exportJSONBtn = document.getElementById('exportJSONBtn');
        const exportCSVBtn = document.getElementById('exportCSVBtn');
        const copyResultsBtn = document.getElementById('copyResultsBtn');

        if (exportJSONBtn) exportJSONBtn.disabled = !hasResults;
        if (exportCSVBtn) exportCSVBtn.disabled = !hasResults;
        if (copyResultsBtn) copyResultsBtn.disabled = !hasResults;
    }

    /**
     * Open save query modal
     */
    openSaveQueryModal() {
        const query = document.getElementById('queryInput').value.trim();
        if (!query) {
            showNotification('Enter a query to save', 'error');
            return;
        }

        // Populate modal with current query
        const queryToSave = document.getElementById('queryToSave');
        if (queryToSave) {
            queryToSave.textContent = query;
        }

        // Clear previous input
        const queryName = document.getElementById('queryName');
        const queryDescription = document.getElementById('queryDescription');
        if (queryName) queryName.value = '';
        if (queryDescription) queryDescription.value = '';

        this.openModal('saveQueryModal');
    }

    /**
     * Handle save query form submission
     */
    handleSaveQuery() {
        const nameInput = document.getElementById('queryName');
        const descInput = document.getElementById('queryDescription');
        const queryDisplay = document.getElementById('queryToSave');

        if (!nameInput || !queryDisplay) return;

        const name = nameInput.value.trim();
        const description = descInput?.value.trim() || '';
        const query = queryDisplay.textContent.trim();

        if (!name) {
            showNotification('Please enter a query name', 'error');
            return;
        }

        try {
            this.storageManager.saveQuery(name, query, description);
            showNotification(`Query "${name}" saved successfully`, 'success');
            this.closeModal('saveQueryModal');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save query', 'error');
        }
    }

    /**
     * Open saved queries modal
     */
    openSavedQueriesModal() {
        this.renderSavedQueries();
        this.openModal('savedQueriesModal');
    }

    /**
     * Render saved queries list
     */
    renderSavedQueries() {
        const container = document.getElementById('savedQueriesList');
        if (!container) return;

        const savedQueries = this.storageManager.getSavedQueries();

        if (savedQueries.length === 0) {
            container.innerHTML = '<p class="info-text">No saved queries yet</p>';
            return;
        }

        container.innerHTML = savedQueries.map(item => `
            <div class="saved-query-item">
                <div class="saved-query-header">
                    <h4>${this.escapeHtml(item.name)}</h4>
                    <span class="saved-query-date">${new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                ${item.description ? `<p class="saved-query-description">${this.escapeHtml(item.description)}</p>` : ''}
                <code class="saved-query-code">${this.escapeHtml(item.query)}</code>
                <div class="saved-query-actions">
                    <button class="btn btn-sm btn-primary" onclick="app.loadSavedQuery('${this.escapeHtml(item.name)}')">
                        📂 Load
                    </button>
                    <button class="btn btn-sm btn-error" onclick="app.deleteSavedQuery('${this.escapeHtml(item.name)}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load a saved query
     */
    loadSavedQuery(name) {
        const savedQueries = this.storageManager.getSavedQueries();
        const query = savedQueries.find(q => q.name === name);

        if (query) {
            const queryInput = document.getElementById('queryInput');
            if (queryInput) {
                queryInput.value = query.query;
                this.handleExecuteQuery();
                this.closeModal('savedQueriesModal');
                showNotification(`Loaded query "${name}"`, 'success');
            }
        }
    }

    /**
     * Delete a saved query
     */
    deleteSavedQuery(name) {
        if (confirm(`Delete query "${name}"?`)) {
            this.storageManager.deleteSavedQuery(name);
            showNotification(`Query "${name}" deleted`, 'success');
            this.renderSavedQueries();
        }
    }

    /**
     * Open history modal
     */
    openHistoryModal() {
        this.renderHistory();
        this.openModal('historyModal');
    }

    /**
     * Render query history list
     */
    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;

        const history = this.storageManager.getQueryHistory();

        if (history.length === 0) {
            container.innerHTML = '<p class="info-text">No query history yet</p>';
            return;
        }

        container.innerHTML = history.map((item, index) => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <code class="history-query">${this.escapeHtml(item.query)}</code>
                <div class="history-actions">
                    <button class="btn btn-sm btn-primary" onclick="app.loadHistoryQuery(${index})">
                        📂 Load
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load a query from history
     */
    loadHistoryQuery(index) {
        const history = this.storageManager.getQueryHistory();
        if (index >= 0 && index < history.length) {
            const queryInput = document.getElementById('queryInput');
            if (queryInput) {
                queryInput.value = history[index].query;
                this.handleExecuteQuery();
                this.closeModal('historyModal');
                showNotification('Query loaded from history', 'success');
            }
        }
    }

    /**
     * Handle clear history
     */
    handleClearHistory() {
        if (confirm('Clear all query history?')) {
            this.storageManager.clearHistory();
            showNotification('History cleared', 'success');
            this.renderHistory();
        }
    }

    /**
     * Open help modal
     */
    openHelpModal() {
        this.openModal('helpModal');
    }

    /**
     * Open a modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Close a modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Load query from URL parameters
     */
    loadQueryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            const queryInput = document.getElementById('queryInput');
            if (queryInput) {
                queryInput.value = decodeURIComponent(query);
                // Auto-execute after a short delay to ensure everything is loaded
                setTimeout(() => {
                    this.handleExecuteQuery();
                    showNotification('Query loaded from URL', 'info');
                }, 500);
            }
        }
    }

    /**
     * Share query via URL
     */
    shareQueryViaURL() {
        const query = document.getElementById('queryInput')?.value.trim();
        if (!query) {
            showNotification('Enter a query to share', 'error');
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('q', encodeURIComponent(query));

        copyToClipboard(url.toString()).then(success => {
            if (success) {
                showNotification('Share URL copied to clipboard', 'success');
            } else {
                showNotification('Failed to copy URL', 'error');
            }
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global app instance for onclick handlers
let app;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
    });
} else {
    app = new App();
}
