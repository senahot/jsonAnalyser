/**
 * Query Engine Module
 * Handles JMESPath query execution and result management
 */

import { formatJSON, syntaxHighlight, showNotification } from './utils.js';

export class QueryEngine {
    constructor(jsonParser) {
        this.jsonParser = jsonParser;
        this.queryInput = document.getElementById('queryInput');
        this.queryError = document.getElementById('queryError');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.queryResults = null;
        this.currentQuery = '';

        // Example queries library
        this.exampleQueries = [
            {
                name: "Get all items",
                query: "@",
                description: "Returns the entire JSON data"
            },
            {
                name: "Select specific fields",
                query: "[*].{name: name, email: email}",
                description: "Get only name and email from array items"
            },
            {
                name: "Filter by condition",
                query: "[?age > `25`]",
                description: "Get items where age is greater than 25"
            },
            {
                name: "Filter by status",
                query: "[?status == 'active']",
                description: "Get only active items"
            },
            {
                name: "Count all items",
                query: "length(@)",
                description: "Count total number of items"
            },
            {
                name: "Count filtered items",
                query: "length([?status == 'active'])",
                description: "Count items matching a condition"
            },
            {
                name: "Sort by field",
                query: "sort_by(@, &age)",
                description: "Sort items by age (ascending)"
            },
            {
                name: "Sort descending",
                query: "reverse(sort_by(@, &age))",
                description: "Sort items by age (descending)"
            },
            {
                name: "Get first item",
                query: "[0]",
                description: "Get the first item from array"
            },
            {
                name: "Get last item",
                query: "[-1]",
                description: "Get the last item from array"
            },
            {
                name: "Nested field access",
                query: "[*].address.city",
                description: "Get nested field from all items"
            },
            {
                name: "Complex filter and select",
                query: "[?age > `25` && status == 'active'].{name: name, age: age}",
                description: "Combine filter and field selection"
            },
            {
                name: "Get unique values",
                query: "[*].role | sort(@) | unique(@)",
                description: "Get unique values from a field"
            },
            {
                name: "Array contains",
                query: "[?contains(skills, 'JavaScript')]",
                description: "Filter items where array contains value"
            },
            {
                name: "Max/Min value",
                query: "max_by(@, &age).age",
                description: "Get maximum age value"
            }
        ];
    }

    /**
     * Check if JMESPath library is loaded
     * @returns {boolean}
     */
    isJMESPathLoaded() {
        return typeof window.jmespath !== 'undefined';
    }

    /**
     * Execute JMESPath query
     * @param {string} query - JMESPath query string
     * @returns {boolean} Success status
     */
    executeQuery(query) {
        // Check if we have JSON data
        const jsonData = this.jsonParser.getCurrentJSON();
        if (!jsonData) {
            this.showQueryError('No JSON data loaded. Please enter JSON first.');
            this.displayResults(null);
            return false;
        }

        // Check if query is empty
        if (!query || query.trim() === '') {
            this.showQueryError('');
            this.displayResults(null);
            this.currentQuery = '';
            return false;
        }

        // Check if JMESPath is loaded
        if (!this.isJMESPathLoaded()) {
            this.showQueryError('JMESPath library not loaded. Please refresh the page.');
            return false;
        }

        try {
            // Execute the query
            this.currentQuery = query;
            const result = window.jmespath.search(jsonData, query);
            this.queryResults = result;
            this.showQueryError('');
            this.displayResults(result);

            // Enable copy button
            const copyBtn = document.getElementById('copyResultsBtn');
            if (copyBtn) {
                copyBtn.disabled = false;
            }

            return true;
        } catch (error) {
            this.showQueryError(error.message);
            this.displayResults(null);
            this.queryResults = null;

            // Disable copy button
            const copyBtn = document.getElementById('copyResultsBtn');
            if (copyBtn) {
                copyBtn.disabled = true;
            }

            return false;
        }
    }

    /**
     * Display query error
     * @param {string} error - Error message
     */
    showQueryError(error) {
        if (!this.queryError) return;

        if (!error) {
            this.queryError.classList.add('hidden');
            this.queryError.textContent = '';
            return;
        }

        this.queryError.classList.remove('hidden');
        this.queryError.textContent = error;
    }

    /**
     * Display query results
     * @param {*} results - Query results
     */
    displayResults(results) {
        if (!this.resultsContainer) return;

        if (results === null || results === undefined) {
            this.resultsContainer.innerHTML = `
                <div class="placeholder-message">
                    <p>💡 Enter a JMESPath query above to see results</p>
                </div>
            `;
            return;
        }

        const resultType = Array.isArray(results) ? 'array' : typeof results;
        const resultCount = Array.isArray(results) ? results.length : null;

        // Create result info badge
        let badge = '';
        if (resultCount !== null) {
            badge = `<div class="badge badge-success mb-2">✓ ${resultCount} result${resultCount !== 1 ? 's' : ''}</div>`;
        } else if (results !== null && results !== undefined) {
            badge = `<div class="badge badge-success mb-2">✓ Result: ${resultType}</div>`;
        }

        // Format the results
        const formatted = formatJSON(results, 2);
        const highlighted = syntaxHighlight(formatted);

        this.resultsContainer.innerHTML = `
            ${badge}
            <div class="result-view-tabs mb-2">
                <button class="tab active" data-view="json">JSON</button>
                ${Array.isArray(results) && results.length > 0 ? '<button class="tab" data-view="table">Table</button>' : ''}
            </div>
            <div id="jsonView" class="result-view">
                <pre class="json-formatted">${highlighted}</pre>
            </div>
            ${Array.isArray(results) && results.length > 0 ? `
                <div id="tableView" class="result-view hidden">
                    ${this.generateTableView(results)}
                </div>
            ` : ''}
        `;

        // Setup view switching
        this.setupViewSwitching();
    }

    /**
     * Generate table view for array results
     * @param {Array} data - Array data
     * @returns {string} HTML table
     */
    generateTableView(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '<p class="info-text">No data to display in table view</p>';
        }

        // Get all unique keys from all objects
        const keys = new Set();
        data.forEach(item => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                Object.keys(item).forEach(key => keys.add(key));
            }
        });

        if (keys.size === 0) {
            return '<p class="info-text">Data cannot be displayed in table format</p>';
        }

        const keysArray = Array.from(keys);

        let html = '<div class="table-container"><table class="results-table">';

        // Header
        html += '<thead><tr>';
        keysArray.forEach(key => {
            html += `<th>${key}</th>`;
        });
        html += '</tr></thead>';

        // Body
        html += '<tbody>';
        data.forEach(item => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                html += '<tr>';
                keysArray.forEach(key => {
                    const value = item[key];
                    let displayValue = '';

                    if (value === null || value === undefined) {
                        displayValue = '<span class="null-value">null</span>';
                    } else if (typeof value === 'object') {
                        displayValue = `<span class="object-value">${JSON.stringify(value)}</span>`;
                    } else {
                        displayValue = String(value);
                    }

                    html += `<td>${displayValue}</td>`;
                });
                html += '</tr>';
            }
        });
        html += '</tbody>';

        html += '</table></div>';
        return html;
    }

    /**
     * Setup view switching between JSON and Table
     */
    setupViewSwitching() {
        const tabs = document.querySelectorAll('.result-view-tabs .tab');
        const jsonView = document.getElementById('jsonView');
        const tableView = document.getElementById('tableView');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show/hide views
                if (view === 'json') {
                    jsonView?.classList.remove('hidden');
                    tableView?.classList.add('hidden');
                } else if (view === 'table') {
                    jsonView?.classList.add('hidden');
                    tableView?.classList.remove('hidden');
                }
            });
        });
    }

    /**
     * Get example queries
     * @returns {Array} Example queries
     */
    getExampleQueries() {
        return this.exampleQueries;
    }

    /**
     * Load an example query
     * @param {number} index - Index of example query
     */
    loadExampleQuery(index) {
        const example = this.exampleQueries[index];
        if (!example) return;

        if (this.queryInput) {
            this.queryInput.value = example.query;
            this.executeQuery(example.query);
            showNotification(`Loaded: ${example.name}`, 'info');
        }
    }

    /**
     * Get current query results
     * @returns {*} Current results
     */
    getCurrentResults() {
        return this.queryResults;
    }

    /**
     * Get formatted results text
     * @returns {string} Formatted JSON string
     */
    getResultsText() {
        if (!this.queryResults) return '';
        return formatJSON(this.queryResults, 2);
    }

    /**
     * Clear query and results
     */
    clear() {
        if (this.queryInput) {
            this.queryInput.value = '';
        }
        this.currentQuery = '';
        this.queryResults = null;
        this.showQueryError('');
        this.displayResults(null);

        const copyBtn = document.getElementById('copyResultsBtn');
        if (copyBtn) {
            copyBtn.disabled = true;
        }
    }
}
