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

### Coming Soon
- 📋 Week 2: Query Engine (JMESPath integration, direct query input)
- 🎨 Week 3: Visual Query Builder
- 🚀 Week 4: Export, Save/Load queries, Sample datasets

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

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Format JSON |
| `Ctrl/Cmd + K` | Clear input |
| `Ctrl/Cmd + /` | Toggle theme |

## Technical Details

### Tech Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6 modules, modern APIs
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
│   └── utils.js           # Utility functions
├── lib/                   # Third-party libraries (Week 2+)
└── examples/              # Sample datasets (Week 4)
```

### Browser Support
- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- IE11: ❌ Not supported

Modern browsers with ES6 module support required.

## Development

### Current Status
**Week 1: Foundation** - ✅ Completed (2025-11-17)

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed development roadmap and progress.

### Next Steps
Week 2 will add the query engine with JMESPath support, allowing users to filter and transform JSON data using powerful query syntax.

## Examples

### Valid JSON Input
```json
[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "status": "active"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "status": "inactive"
  }
]
```

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
- [ ] Week 2: Query Engine (JMESPath integration)
- [ ] Week 3: Visual Query Builder
- [ ] Week 4: Export, Save/Load, Polish
- [ ] Future: Advanced features (aggregations, schema validation, etc.)

---

**Built with ❤️ using Vanilla JavaScript**
