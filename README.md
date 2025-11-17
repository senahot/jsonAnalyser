# JSON Analyser

A powerful, frontend-only web application for analyzing and querying JSON data directly in your browser. No backend, no database, no API - everything runs client-side.

## Features

### Week 1: Foundation (Completed ✅)
- ✅ JSON input with real-time validation
- ✅ File upload support (.json files, up to 10MB)
- ✅ Drag and drop support for JSON files
- ✅ JSON syntax highlighting
- ✅ Pretty-print/format JSON
- ✅ JSON statistics (size, type, properties, depth, items)
- ✅ Error display with helpful messages
- ✅ Copy to clipboard
- ✅ Dark/light theme toggle
- ✅ Responsive design
- ✅ Keyboard shortcuts

### Week 2: Query Engine (Completed ✅)
- ✅ JMESPath query language integration
- ✅ Direct query input with real-time execution
- ✅ 15+ example queries (filter, select, count, sort, etc.)
- ✅ Query error handling with helpful messages
- ✅ Results display with JSON and Table views
- ✅ Copy query results to clipboard
- ✅ Query keyboard shortcut (Shift+Enter)
- ✅ Interactive query examples dropdown

### Week 3: Visual Query Builder (Completed ✅)
- ✅ Mode toggle between Code and Builder views
- ✅ Visual query builder with drag-free interface
- ✅ Select fields operation (projection)
- ✅ Filter builder with multiple conditions
- ✅ 9 operators (equals, not equals, greater/less than, contains, starts/ends with)
- ✅ Count operation with optional filters
- ✅ Sort controls (field selection + direction)
- ✅ Complex queries (combine select, filter, and sort)
- ✅ Live query preview showing generated JMESPath
- ✅ Auto-detects available fields from JSON data
- ✅ Apply query button to execute from builder

### Coming Soon
- 🚀 Week 4: Export (CSV/JSON), Save/Load queries, Query history, More sample datasets

## Getting Started

### Quick Start
1. Clone this repository
2. Open `index.html` in your web browser
3. Start entering or uploading JSON data!

No installation, no build process, no dependencies to install. It just works!

### Usage

#### Input JSON
There are three ways to input JSON:
1. **Type/Paste**: Directly type or paste JSON into the left textarea
2. **Upload File**: Click the "📁 Upload File" button and select a .json file
3. **Drag & Drop**: Drag a .json file directly onto the input area

#### Format JSON
Click the "✨ Format" button to auto-format and prettify your JSON with proper indentation.

#### Clear Input
Click the "🗑️ Clear" button to clear all input and output.

#### Copy Output
Click the "📋 Copy" button to copy the formatted JSON to your clipboard.

#### Theme Toggle
Click the theme button (🌙/☀️) in the header to switch between dark and light themes.

#### Query JSON Data (Week 2)
1. **Enter JSON**: First, add your JSON data on the left panel
2. **Write Query**: Enter a JMESPath query in the query input area
3. **Run Query**: Click "▶️ Run" or press `Shift+Enter` to execute
4. **View Results**: See results in JSON or Table format
5. **Example Queries**: Select from the dropdown to try pre-built queries

##### Example JMESPath Queries
- `@` - Get all data
- `[*].name` - Extract all names from array
- `[?age > \`25\`]` - Filter items where age > 25
- `[?status == 'active']` - Filter by status
- `length(@)` - Count total items
- `sort_by(@, &age)` - Sort by age
- `[0]` - Get first item
- `[*].address.city` - Get nested field from all items

#### Visual Query Builder (Week 3)
1. **Switch to Builder**: Click the "🔧 Builder" button to enter visual mode
2. **Select Operation**: Choose from Select, Filter, Count, Sort, or Complex
3. **Configure Query**:
   - **Select Fields**: Click "➕ Add Field" to choose fields to include
   - **Filter Data**: Click "➕ Add Filter" to add conditions
   - **Count Items**: Optionally add filters before counting
   - **Sort Data**: Choose field and direction (ascending/descending)
   - **Complex**: Combine all operations in one query
4. **Preview Query**: See the generated JMESPath in real-time
5. **Apply Query**: Click "✨ Apply Query" to execute

The builder automatically detects available fields from your JSON data!

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Format JSON (in JSON input) |
| `Shift + Enter` | Execute Query (in query input) |
| `Ctrl/Cmd + K` | Clear input |
| `Ctrl/Cmd + /` | Toggle theme |

## Technical Details

### Tech Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6 modules, modern APIs
- **JMESPath**: Query language for JSON
- **No frameworks**: Lightweight and fast

### File Structure
```
jsonAnalyser/
├── index.html              # Main HTML file
├── PROJECT_PLAN.md         # Development roadmap
├── README.md              # This file
├── css/
│   ├── main.css           # Main styles and layout
│   ├── theme.css          # Theme variables (dark/light)
│   └── components.css     # Component-specific styles
├── js/
│   ├── app.js             # Main application controller
│   ├── jsonParser.js      # JSON validation/parsing/display
│   ├── queryEngine.js     # JMESPath query execution
│   ├── queryBuilder.js    # Visual query builder logic
│   └── utils.js           # Utility functions
├── lib/                   # Third-party libraries (CDN)
└── examples/
    └── users.json         # Sample user dataset
```

### Browser Support
- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- IE11: ❌ Not supported

Modern browsers with ES6 module support required.

## Development

### Current Status
- **Week 1: Foundation** - ✅ Completed (2025-11-17)
- **Week 2: Query Engine** - ✅ Completed (2025-11-17)
- **Week 3: Visual Query Builder** - ✅ Completed (2025-11-17)

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed development roadmap and progress.

### Next Steps
Week 4 will add export functionality (CSV/JSON), query save/load with history, and final polish with more sample datasets.

## Examples

### JSON Input Example
```json
[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "status": "active",
    "skills": ["JavaScript", "Python"]
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "status": "inactive",
    "skills": ["Design", "UX"]
  }
]
```

### Query Examples

#### Get all names
**Query:** `[*].name`
**Result:** `["John Doe", "Jane Smith"]`

#### Filter active users
**Query:** `[?status == 'active']`
**Result:** Array of active users only

#### Get names of users over 25
**Query:** `[?age > \`25\`].name`
**Result:** `["John Doe"]`

#### Count total users
**Query:** `length(@)`
**Result:** `2`

#### Select specific fields
**Query:** `[*].{name: name, email: email}`
**Result:** Array of objects with only name and email

### Statistics Displayed
- **Size**: File size in bytes/KB/MB
- **Type**: object, array, string, etc.
- **Properties**: Total number of properties
- **Depth**: Nesting level of the JSON
- **Items**: Number of items (for arrays)

## Privacy & Security
All processing happens in your browser. Your JSON data:
- ✅ Never leaves your computer
- ✅ Not sent to any server
- ✅ Not stored anywhere (except optional localStorage for preferences)
- ✅ Completely private and secure

## Contributing
This is a learning project. Contributions, issues, and feature requests are welcome!

## License
MIT License - Feel free to use this project for learning or production.

## Roadmap
- [x] Week 1: Foundation (JSON input, validation, formatting)
- [x] Week 2: Query Engine (JMESPath integration, direct queries)
- [x] Week 3: Visual Query Builder (GUI for building queries)
- [ ] Week 4: Export (CSV/JSON), Save/Load queries, Query history, Polish
- [ ] Future: Advanced features (aggregations, schema validation, etc.)

---

**Built with ❤️ using Vanilla JavaScript**
