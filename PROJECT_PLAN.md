# JSON Analyser - Project Plan

## Project Overview
A frontend-only web application that allows users to input JSON data and query it using both a visual query builder and direct query language (JMESPath).

**Tech Stack:** Vanilla JavaScript, HTML5, CSS3, JMESPath library

---

## Development Phases

### ✅ Week 1: Foundation (COMPLETED)
**Status:** ✅ COMPLETED

**Goals:**
- Create basic HTML structure and layout
- Implement JSON input with validation
- Display parsed JSON in a formatted view
- Setup project file structure

**Tasks:**
- [x] Create basic HTML structure (index.html)
- [x] Setup CSS architecture (main.css, theme.css, components.css)
- [x] Create JavaScript module structure (app.js, jsonParser.js, utils.js)
- [x] Implement JSON input textarea with syntax highlighting
- [x] Add JSON validation with error display
- [x] Implement JSON pretty-print/format
- [x] Create responsive layout (input panel, output panel)
- [x] Add file upload for .json files
- [x] Display formatted JSON output with syntax highlighting
- [x] Test with various JSON inputs
- [x] Add drag and drop support
- [x] Add dark/light theme toggle
- [x] Add keyboard shortcuts
- [x] Add JSON statistics display
- [x] Create sample JSON file (users.json)

**Deliverables:**
- ✅ Functional JSON input with validation
- ✅ File upload and drag & drop capability
- ✅ Formatted JSON display with syntax highlighting
- ✅ Responsive basic layout
- ✅ Theme support (dark/light)
- ✅ Keyboard shortcuts (Ctrl+Enter, Ctrl+K, Ctrl+/)
- ✅ JSON statistics (size, type, properties, depth)

---

### 📋 Week 2: Query Engine (COMPLETED)
**Status:** ✅ COMPLETED

**Goals:**
- Integrate JMESPath library
- Implement direct query input
- Execute queries and display results
- Handle query errors gracefully

**Tasks:**
- [x] Download and integrate jmespath.js library (via CDN)
- [x] Create query engine module (queryEngine.js)
- [x] Add query input textarea with placeholder examples
- [x] Implement query execution with real-time updates
- [x] Add result display area with JSON/Table toggle
- [x] Implement error handling for invalid queries
- [x] Add example queries dropdown (15 examples)
- [x] Create results formatting (table view, JSON view)
- [x] Add copy results functionality
- [x] Test with various query patterns
- [x] Add keyboard shortcut (Shift+Enter)
- [x] Update app.js to integrate query engine

**Deliverables:**
- ✅ Working JMESPath query execution
- ✅ Direct query language input with auto-execution
- ✅ Results display with JSON and Table views
- ✅ Query examples library (15 examples)
- ✅ Error handling with helpful messages
- ✅ Copy results to clipboard
- ✅ Keyboard shortcuts

---

### 🎨 Week 3: Visual Query Builder (COMPLETED)
**Status:** ✅ COMPLETED

**Goals:**
- Build visual/GUI query builder
- Support common operations without writing code
- Auto-generate JMESPath queries from UI
- Sync between visual builder and direct input

**Tasks:**
- [x] Design query builder UI with mode toggle
- [x] Implement field selector (for projections)
- [x] Add filter builder (conditions)
- [x] Implement operators (equals, greater than, contains, starts_with, ends_with, etc.)
- [x] Add count/length operations
- [x] Implement sorting controls (field and direction)
- [x] Create JMESPath query generator from UI
- [x] Add "Switch to Code" / "Switch to Builder" toggle
- [x] Sync between builder and direct query input
- [x] Add query preview with live updates
- [x] Auto-detect fields from JSON data
- [x] Complex query mode (combine all operations)
- [x] Create queryBuilder.js module
- [x] Update HTML for builder interface
- [x] Add CSS for builder components
- [x] Integrate with app.js

**Deliverables:**
- ✅ Functional visual query builder
- ✅ Support for: select fields, filter, count, sort, complex queries
- ✅ Mode toggle between Code and Builder views
- ✅ Generated query preview with live updates
- ✅ Auto field detection from JSON data
- ✅ 9 filter operators
- ✅ Dynamic field/filter row management

---

### 🚀 Week 4: Polish & Advanced Features
**Status:** PENDING

**Goals:**
- Add export functionality
- Implement query save/load
- Apply styling and themes
- Add sample datasets
- Improve UX

**Tasks:**
- [ ] Implement export to JSON
- [ ] Implement export to CSV
- [ ] Add localStorage for saving queries
- [ ] Create query history feature
- [ ] Add sample datasets (users, products, orders)
- [ ] Implement dark/light theme toggle
- [ ] Improve responsive design
- [ ] Add keyboard shortcuts
- [ ] Create help/documentation section
- [ ] Add share query functionality (URL params)
- [ ] Performance optimization for large JSON
- [ ] Final testing and bug fixes

**Deliverables:**
- Export functionality (JSON, CSV)
- Query save/load with history
- Dark/light theme
- Sample datasets for demo
- Polished, responsive UI
- Help documentation

---

## File Structure

```
jsonAnalyser/
├── index.html              # Main HTML file
├── PROJECT_PLAN.md         # This file
├── README.md              # User documentation
├── css/
│   ├── main.css           # Main styles
│   ├── theme.css          # Theme variables (dark/light)
│   └── components.css     # Component-specific styles
├── js/
│   ├── app.js             # Main application controller
│   ├── jsonParser.js      # JSON validation/parsing
│   ├── queryEngine.js     # Query execution (JMESPath)
│   ├── queryBuilder.js    # Visual query builder logic
│   ├── results.js         # Results display/export
│   ├── storage.js         # localStorage management
│   └── utils.js           # Utility functions
├── lib/
│   └── jmespath.js        # JMESPath library (CDN or local)
└── examples/
    ├── users.json         # Sample user data
    ├── products.json      # Sample product data
    └── orders.json        # Sample orders data
```

---

## Key Features Checklist

### Core Functionality
- [x] JSON input via textarea
- [x] JSON file upload
- [x] JSON validation with error messages
- [x] JSON pretty-print/format
- [x] Direct JMESPath query input
- [x] Visual query builder
- [x] Query execution
- [x] Results display (JSON and Table views)

### Query Operations
- [x] Select specific fields (projection)
- [x] Filter by conditions
- [x] Count/length operations
- [x] Sort results
- [x] Nested object traversal
- [x] Array operations
- [x] Multiple conditions (AND/OR)
- [x] Max/min operations
- [x] Array contains operations
- [x] Unique values

### User Experience
- [ ] Export to JSON (Week 4)
- [ ] Export to CSV (Week 4)
- [ ] Save queries to localStorage (Week 4)
- [ ] Query history (Week 4)
- [x] Sample datasets (users.json created)
- [x] Dark/light theme
- [x] Responsive design
- [x] Keyboard shortcuts
- [ ] Help documentation (Week 4)
- [ ] Share queries via URL (Week 4)

---

## Technical Decisions

### Query Language: JMESPath
**Why JMESPath?**
- Simple, readable syntax
- Powerful filtering and projection
- Built-in functions
- Well-documented
- Lightweight library

**Alternative considered:** JSONPath (less powerful for complex queries)

### No Build Process
- Direct browser compatibility
- ES6 modules via `<script type="module">`
- No transpilation needed
- Faster development cycle

### Storage Strategy
- Use localStorage for:
  - Saved queries
  - Query history
  - User preferences (theme, layout)
  - Recent JSON inputs (optional)
- 5MB limit consideration

---

## Example Queries Reference

### Select Fields
```javascript
// Get only name and email
data[*].{name: name, email: email}
```

### Filter
```javascript
// Get users older than 25
data[?age > `25`]
```

### Count
```javascript
// Count total items
length(data)

// Count filtered items
length(data[?status == 'active'])
```

### Sort
```javascript
// Sort by age
sort_by(data, &age)

// Sort descending
reverse(sort_by(data, &age))
```

### Complex
```javascript
// Get names of active users over 25, sorted
sort_by(data[?age > `25` && status == 'active'].name, &@)
```

---

## Progress Tracking

### Week 1: Foundation
- **Start Date:** 2025-11-17
- **End Date:** 2025-11-17
- **Status:** ✅ Completed
- **Completion:** 100%

### Week 2: Query Engine
- **Start Date:** 2025-11-17
- **End Date:** 2025-11-17
- **Status:** ✅ Completed
- **Completion:** 100%

### Week 3: Query Builder
- **Start Date:** 2025-11-17
- **End Date:** 2025-11-17
- **Status:** ✅ Completed
- **Completion:** 100%

### Week 4: Polish
- **Start Date:** TBD
- **Status:** Not Started
- **Completion:** 0%

---

## Notes & Decisions Log

### 2025-11-17 - Week 3 Completion
- ✅ Week 3: Visual Query Builder completed successfully
- Created queryBuilder.js module with complete visual query building logic
- Implemented mode toggle between Code and Builder views
- Added 5 operation types: Select, Filter, Count, Sort, Complex
- Implemented dynamic field/filter row management
- Auto-detects available fields from JSON data (up to 2 levels deep)
- 9 filter operators: equals, not equals, greater/less than, contains, starts/ends with
- Live query preview showing generated JMESPath
- Integrated seamlessly with existing query engine
- Updated HTML with builder interface
- Added comprehensive CSS for builder components
- Refreshes automatically when JSON data changes
- All deliverables met and tested

### 2025-11-17 - Week 2 Completion
- ✅ Week 2: Query Engine completed successfully
- Integrated JMESPath via CDN (jmespath@0.16.0)
- Created queryEngine.js module with full query execution
- Added 15 example queries covering common use cases
- Implemented dual view: JSON and Table for results
- Real-time query execution (debounced for performance)
- Added keyboard shortcut: Shift+Enter to run queries
- Error handling for invalid queries with helpful messages
- Updated HTML, CSS, and app.js for query functionality
- All deliverables met and tested

### 2025-11-17 - Week 1 Completion
- ✅ Week 1: Foundation completed successfully
- Implemented all core features: HTML structure, CSS theming, JavaScript modules
- Added bonus features: drag & drop, theme toggle, keyboard shortcuts, statistics
- Project structure fully established and ready for Week 2
- All deliverables met and tested
- Sample data file created (users.json)

### 2025-11-17 - Project Initiation
- Project initiated
- Decided on Vanilla JS approach (no frameworks)
- Using JMESPath for query language
- Including both visual builder AND direct query input
- Starting with Week 1: Foundation

---

## Future Enhancements (Post-MVP)

- [ ] Advanced aggregations (sum, avg, min, max, group by)
- [ ] Export to Excel
- [ ] JSON schema validation
- [ ] Multi-file JSON comparison
- [ ] Query performance metrics
- [ ] Undo/redo for queries
- [ ] Query templates library
- [ ] Collaborative query sharing
- [ ] PWA support for offline use
- [ ] Import from URL/API endpoint (with CORS proxy)
