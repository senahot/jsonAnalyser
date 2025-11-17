/**
 * Query Builder Module
 * Visual interface for building JMESPath queries without writing code
 */

import { showNotification } from './utils.js';

export class QueryBuilder {
    constructor(queryEngine, jsonParser) {
        this.queryEngine = queryEngine;
        this.jsonParser = jsonParser;

        // Query configuration
        this.config = {
            operation: 'select', // select, filter, count, sort
            selectedFields: [],
            filters: [],
            sortField: '',
            sortDirection: 'asc'
        };

        // Available operators for filters
        this.operators = [
            { value: '==', label: 'equals', type: 'all' },
            { value: '!=', label: 'not equals', type: 'all' },
            { value: '>', label: 'greater than', type: 'number' },
            { value: '>=', label: 'greater or equal', type: 'number' },
            { value: '<', label: 'less than', type: 'number' },
            { value: '<=', label: 'less or equal', type: 'number' },
            { value: 'contains', label: 'contains', type: 'string' },
            { value: 'starts_with', label: 'starts with', type: 'string' },
            { value: 'ends_with', label: 'ends with', type: 'string' }
        ];
    }

    /**
     * Initialize the query builder
     */
    init() {
        this.setupOperationSelector();
        this.setupFieldSelector();
        this.setupFilterBuilder();
        this.setupSortControls();
        this.setupBuildButton();
    }

    /**
     * Setup operation selector (Select, Filter, Count, Sort)
     */
    setupOperationSelector() {
        const operationSelect = document.getElementById('builderOperation');
        if (!operationSelect) return;

        operationSelect.addEventListener('change', (e) => {
            this.config.operation = e.target.value;
            this.updateBuilderUI();
            this.generateQuery();
        });
    }

    /**
     * Setup field selector for projections
     */
    setupFieldSelector() {
        const addFieldBtn = document.getElementById('addFieldBtn');
        if (!addFieldBtn) return;

        addFieldBtn.addEventListener('click', () => this.addFieldSelector());
    }

    /**
     * Add a field selector row
     */
    addFieldSelector() {
        const container = document.getElementById('fieldsContainer');
        if (!container) return;

        const fieldRow = document.createElement('div');
        fieldRow.className = 'field-row';

        const fields = this.getAvailableFields();

        fieldRow.innerHTML = `
            <select class="form-select field-select">
                <option value="">Select field...</option>
                ${fields.map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
            <input type="text" class="form-input field-alias" placeholder="Alias (optional)" />
            <button class="btn btn-secondary remove-field-btn" title="Remove field">✕</button>
        `;

        // Add event listeners
        const selectElement = fieldRow.querySelector('.field-select');
        const aliasElement = fieldRow.querySelector('.field-alias');
        const removeBtn = fieldRow.querySelector('.remove-field-btn');

        selectElement.addEventListener('change', () => this.updateFieldSelection());
        aliasElement.addEventListener('input', () => this.updateFieldSelection());
        removeBtn.addEventListener('click', () => {
            fieldRow.remove();
            this.updateFieldSelection();
        });

        container.appendChild(fieldRow);
    }

    /**
     * Update field selection and generate query
     */
    updateFieldSelection() {
        const fieldRows = document.querySelectorAll('.field-row');
        this.config.selectedFields = [];

        fieldRows.forEach(row => {
            const field = row.querySelector('.field-select').value;
            const alias = row.querySelector('.field-alias').value;

            if (field) {
                this.config.selectedFields.push({
                    field,
                    alias: alias || field
                });
            }
        });

        this.generateQuery();
    }

    /**
     * Setup filter builder
     */
    setupFilterBuilder() {
        const addFilterBtn = document.getElementById('addFilterBtn');
        if (!addFilterBtn) return;

        addFilterBtn.addEventListener('click', () => this.addFilterRow());
    }

    /**
     * Add a filter row
     */
    addFilterRow() {
        const container = document.getElementById('filtersContainer');
        if (!container) return;

        const filterRow = document.createElement('div');
        filterRow.className = 'filter-row';

        const fields = this.getAvailableFields();

        filterRow.innerHTML = `
            <select class="form-select filter-field">
                <option value="">Select field...</option>
                ${fields.map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
            <select class="form-select filter-operator">
                ${this.operators.map(op =>
                    `<option value="${op.value}">${op.label}</option>`
                ).join('')}
            </select>
            <input type="text" class="form-input filter-value" placeholder="Value" />
            <button class="btn btn-secondary remove-filter-btn" title="Remove filter">✕</button>
        `;

        // Add event listeners
        const fieldSelect = filterRow.querySelector('.filter-field');
        const operatorSelect = filterRow.querySelector('.filter-operator');
        const valueInput = filterRow.querySelector('.filter-value');
        const removeBtn = filterRow.querySelector('.remove-filter-btn');

        fieldSelect.addEventListener('change', () => this.updateFilters());
        operatorSelect.addEventListener('change', () => this.updateFilters());
        valueInput.addEventListener('input', () => this.updateFilters());
        removeBtn.addEventListener('click', () => {
            filterRow.remove();
            this.updateFilters();
        });

        container.appendChild(filterRow);
    }

    /**
     * Update filters and generate query
     */
    updateFilters() {
        const filterRows = document.querySelectorAll('.filter-row');
        this.config.filters = [];

        filterRows.forEach(row => {
            const field = row.querySelector('.filter-field').value;
            const operator = row.querySelector('.filter-operator').value;
            const value = row.querySelector('.filter-value').value;

            if (field && value) {
                this.config.filters.push({ field, operator, value });
            }
        });

        this.generateQuery();
    }

    /**
     * Setup sort controls
     */
    setupSortControls() {
        const sortField = document.getElementById('sortField');
        const sortDirection = document.getElementById('sortDirection');

        if (sortField) {
            sortField.addEventListener('change', (e) => {
                this.config.sortField = e.target.value;
                this.generateQuery();
            });
        }

        if (sortDirection) {
            sortDirection.addEventListener('change', (e) => {
                this.config.sortDirection = e.target.value;
                this.generateQuery();
            });
        }
    }

    /**
     * Setup build query button
     */
    setupBuildButton() {
        const buildBtn = document.getElementById('buildQueryBtn');
        if (!buildBtn) return;

        buildBtn.addEventListener('click', () => {
            const query = this.generateQuery();
            if (query) {
                this.applyQueryToEngine(query);
                showNotification('Query applied from builder', 'success');
            }
        });
    }

    /**
     * Get available fields from current JSON data
     * @returns {Array} Available field names
     */
    getAvailableFields() {
        const jsonData = this.jsonParser.getCurrentJSON();
        if (!jsonData) return [];

        const fields = new Set();

        function extractFields(obj, prefix = '') {
            if (Array.isArray(obj) && obj.length > 0) {
                extractFields(obj[0], prefix);
            } else if (obj && typeof obj === 'object') {
                Object.keys(obj).forEach(key => {
                    const fieldPath = prefix ? `${prefix}.${key}` : key;
                    fields.add(fieldPath);

                    // Don't go too deep, limit to 2 levels
                    if (!prefix.includes('.')) {
                        extractFields(obj[key], fieldPath);
                    }
                });
            }
        }

        extractFields(jsonData);
        return Array.from(fields).sort();
    }

    /**
     * Update builder UI based on selected operation
     */
    updateBuilderUI() {
        const fieldsSection = document.getElementById('fieldsSection');
        const filtersSection = document.getElementById('filtersSection');
        const sortSection = document.getElementById('sortSection');

        if (!fieldsSection || !filtersSection || !sortSection) return;

        // Hide all sections first
        fieldsSection.classList.add('hidden');
        filtersSection.classList.add('hidden');
        sortSection.classList.add('hidden');

        // Show relevant sections based on operation
        switch (this.config.operation) {
            case 'select':
                fieldsSection.classList.remove('hidden');
                break;
            case 'filter':
                filtersSection.classList.remove('hidden');
                break;
            case 'count':
                filtersSection.classList.remove('hidden');
                break;
            case 'sort':
                sortSection.classList.remove('hidden');
                break;
            case 'complex':
                fieldsSection.classList.remove('hidden');
                filtersSection.classList.remove('hidden');
                sortSection.classList.remove('hidden');
                break;
        }
    }

    /**
     * Generate JMESPath query from builder configuration
     * @returns {string} Generated JMESPath query
     */
    generateQuery() {
        let query = '@';

        switch (this.config.operation) {
            case 'select':
                query = this.generateSelectQuery();
                break;
            case 'filter':
                query = this.generateFilterQuery();
                break;
            case 'count':
                query = this.generateCountQuery();
                break;
            case 'sort':
                query = this.generateSortQuery();
                break;
            case 'complex':
                query = this.generateComplexQuery();
                break;
        }

        // Update preview
        this.updateQueryPreview(query);
        return query;
    }

    /**
     * Generate SELECT query (field projection)
     */
    generateSelectQuery() {
        if (this.config.selectedFields.length === 0) {
            return '@';
        }

        const projection = this.config.selectedFields.map(f => {
            return `${f.alias}: ${f.field}`;
        }).join(', ');

        return `[*].{${projection}}`;
    }

    /**
     * Generate FILTER query
     */
    generateFilterQuery() {
        if (this.config.filters.length === 0) {
            return '@';
        }

        const conditions = this.config.filters.map(f => {
            return this.formatFilterCondition(f);
        }).join(' && ');

        return `[?${conditions}]`;
    }

    /**
     * Generate COUNT query
     */
    generateCountQuery() {
        if (this.config.filters.length === 0) {
            return 'length(@)';
        }

        const filterQuery = this.generateFilterQuery();
        return `length(${filterQuery})`;
    }

    /**
     * Generate SORT query
     */
    generateSortQuery() {
        if (!this.config.sortField) {
            return '@';
        }

        const sortQuery = `sort_by(@, &${this.config.sortField})`;
        return this.config.sortDirection === 'desc' ? `reverse(${sortQuery})` : sortQuery;
    }

    /**
     * Generate COMPLEX query (combination)
     */
    generateComplexQuery() {
        let query = '@';

        // Start with filter if any
        if (this.config.filters.length > 0) {
            const conditions = this.config.filters.map(f =>
                this.formatFilterCondition(f)
            ).join(' && ');
            query = `[?${conditions}]`;
        } else {
            query = '[*]';
        }

        // Add projection if any
        if (this.config.selectedFields.length > 0) {
            const projection = this.config.selectedFields.map(f =>
                `${f.alias}: ${f.field}`
            ).join(', ');
            query = `${query}.{${projection}}`;
        }

        // Wrap with sort if needed
        if (this.config.sortField) {
            query = `sort_by(${query}, &${this.config.sortField})`;
            if (this.config.sortDirection === 'desc') {
                query = `reverse(${query})`;
            }
        }

        return query;
    }

    /**
     * Format a filter condition for JMESPath
     */
    formatFilterCondition(filter) {
        const { field, operator, value } = filter;

        // Handle string vs number values
        const isNumber = !isNaN(value);
        let formattedValue = isNumber ? `\`${value}\`` : `'${value}'`;

        // Special operators
        if (operator === 'contains') {
            return `contains(${field}, ${formattedValue})`;
        } else if (operator === 'starts_with') {
            return `starts_with(${field}, ${formattedValue})`;
        } else if (operator === 'ends_with') {
            return `ends_with(${field}, ${formattedValue})`;
        }

        // Standard operators
        return `${field} ${operator} ${formattedValue}`;
    }

    /**
     * Update query preview
     */
    updateQueryPreview(query) {
        const preview = document.getElementById('queryPreview');
        if (preview) {
            preview.textContent = query;
        }
    }

    /**
     * Apply generated query to the query engine
     */
    applyQueryToEngine(query) {
        const queryInput = document.getElementById('queryInput');
        if (queryInput) {
            queryInput.value = query;
        }

        if (this.queryEngine) {
            this.queryEngine.executeQuery(query);
        }
    }

    /**
     * Reset builder to default state
     */
    reset() {
        this.config = {
            operation: 'select',
            selectedFields: [],
            filters: [],
            sortField: '',
            sortDirection: 'asc'
        };

        // Clear containers
        const fieldsContainer = document.getElementById('fieldsContainer');
        const filtersContainer = document.getElementById('filtersContainer');

        if (fieldsContainer) fieldsContainer.innerHTML = '';
        if (filtersContainer) filtersContainer.innerHTML = '';

        // Reset selects
        const operationSelect = document.getElementById('builderOperation');
        const sortField = document.getElementById('sortField');
        const sortDirection = document.getElementById('sortDirection');

        if (operationSelect) operationSelect.value = 'select';
        if (sortField) sortField.value = '';
        if (sortDirection) sortDirection.value = 'asc';

        this.updateBuilderUI();
        this.updateQueryPreview('@');
    }

    /**
     * Populate sort field options
     */
    populateSortFields() {
        const sortField = document.getElementById('sortField');
        if (!sortField) return;

        const fields = this.getAvailableFields();

        sortField.innerHTML = '<option value="">Select field...</option>' +
            fields.map(f => `<option value="${f}">${f}</option>`).join('');
    }

    /**
     * Refresh builder (called when JSON data changes)
     */
    refresh() {
        this.populateSortFields();
        this.generateQuery();
    }
}
