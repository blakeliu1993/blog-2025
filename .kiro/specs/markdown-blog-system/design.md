# Design Document

## Overview

The markdown blog system will be a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. The system will dynamically load and render markdown files from a designated posts directory, providing a clean and responsive reading experience. The architecture follows a modular approach with clear separation of concerns between data management, UI rendering, and markdown processing.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   UI Controller │  │ Markdown Parser │  │ File Manager│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Static File Server                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   HTML/CSS/JS   │  │  Markdown Posts │                  │
│  │     Assets      │  │   Directory     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── index.html                 # Main entry point
├── components/
│   ├── styles.css            # Main stylesheet (existing)
│   ├── blog.css              # Blog-specific styles
│   └── markdown.css          # Markdown rendering styles
├── js/
│   ├── app.js                # Main application controller
│   ├── fileManager.js        # File system operations
│   ├── markdownParser.js     # Markdown to HTML conversion
│   ├── pagination.js         # Pagination logic
│   └── search.js             # Search and filter functionality
├── assets/
│   ├── fonts/                # Font files (existing)
│   └── icons/                # Icon assets (existing)
└── posts/                    # Markdown files directory
    ├── post1.md
    ├── post2.md
    └── ...
```

## Components and Interfaces

### 1. File Manager Component

**Purpose:** Handle file system operations and markdown file discovery

**Key Methods:**
- `loadPostsList()`: Scan posts directory and return file metadata
- `loadPostContent(filename)`: Load specific markdown file content
- `getPostMetadata(filename)`: Extract title, date, and excerpt from markdown

**Interface:**
```javascript
class FileManager {
  async loadPostsList(): Promise<PostMetadata[]>
  async loadPostContent(filename: string): Promise<string>
  getPostMetadata(content: string): PostMetadata
}

interface PostMetadata {
  filename: string
  title: string
  date: Date
  excerpt: string
  wordCount: number
}
```

### 2. Markdown Parser Component

**Purpose:** Convert markdown content to HTML with syntax highlighting

**Key Methods:**
- `parseMarkdown(content)`: Convert markdown to HTML
- `extractTitle(content)`: Get title from markdown
- `extractExcerpt(content)`: Generate excerpt from content
- `highlightCode(html)`: Apply syntax highlighting to code blocks

**Interface:**
```javascript
class MarkdownParser {
  parseMarkdown(content: string): string
  extractTitle(content: string): string
  extractExcerpt(content: string, maxLength: number): string
  highlightCode(html: string): string
}
```

### 3. UI Controller Component

**Purpose:** Manage application state and coordinate between components

**Key Methods:**
- `init()`: Initialize the application
- `showPostList()`: Display paginated post list
- `showPost(filename)`: Display individual post
- `toggleMarkdownView()`: Switch between rendered and raw markdown
- `handleNavigation()`: Manage routing and browser history

**Interface:**
```javascript
class UIController {
  init(): void
  showPostList(page: number): void
  showPost(filename: string): void
  toggleMarkdownView(): void
  handleNavigation(route: string): void
}
```

### 4. Search and Pagination Components

**Purpose:** Handle filtering, searching, and pagination logic

**Key Methods:**
- `filterPosts(query, posts)`: Filter posts by search criteria
- `paginatePosts(posts, page, perPage)`: Handle pagination logic
- `updatePagination(totalPages, currentPage)`: Update pagination UI

## Data Models

### Post Metadata Model
```javascript
{
  filename: "example-post.md",
  title: "Example Blog Post",
  date: "2025-01-15T10:30:00Z",
  excerpt: "This is a brief excerpt of the blog post content...",
  wordCount: 1250,
  tags: ["javascript", "web-development"] // Optional for future use
}
```

### Application State Model
```javascript
{
  currentView: "list" | "post",
  currentPost: string | null,
  currentPage: number,
  searchQuery: string,
  posts: PostMetadata[],
  filteredPosts: PostMetadata[],
  isRawMarkdown: boolean,
  loading: boolean
}
```

## Error Handling

### File Loading Errors
- **Network Errors:** Display user-friendly message with retry option
- **File Not Found:** Show 404-style message with navigation back to list
- **Parse Errors:** Display raw content with error notification

### Search and Filter Errors
- **No Results:** Show empty state with clear search action
- **Invalid Query:** Gracefully handle special characters and long queries

### Browser Compatibility
- **File API Support:** Fallback messaging for unsupported browsers
- **JavaScript Disabled:** Basic HTML fallback with server-side rendering note

## Testing Strategy

### Unit Testing Approach
- **Markdown Parser:** Test various markdown syntax combinations
- **File Manager:** Mock file system operations for consistent testing
- **Search Logic:** Test edge cases like empty queries and special characters
- **Pagination:** Verify correct page calculations and boundary conditions

### Integration Testing
- **End-to-End Workflows:** Test complete user journeys from list to post viewing
- **Cross-Browser Testing:** Ensure compatibility across modern browsers
- **Mobile Responsiveness:** Test touch interactions and responsive layouts

### Performance Testing
- **Large File Handling:** Test with markdown files of various sizes
- **Many Files:** Verify performance with 100+ markdown files
- **Memory Usage:** Monitor for memory leaks during navigation

## Design System Implementation

### Typography Scale
```css
/* Heading Styles */
.h1 { font-size: 36px; line-height: 44px; font-weight: 700; }
.h2 { font-size: 28px; line-height: 36px; font-weight: 600; }
.h3 { font-size: 22px; line-height: 30px; font-weight: 500; }

/* Body Text */
.body-text { font-size: 18px; line-height: 28px; font-weight: 400; }
.secondary-text { font-size: 16px; line-height: 24px; font-weight: 400; }
.small-text { font-size: 14px; line-height: 20px; font-weight: 500; }
```

### Color System
```css
:root {
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray: #777777;
  --color-yellow: #C9A26D;
  
  /* Semantic Colors */
  --color-primary: var(--color-yellow);
  --color-text: var(--color-black);
  --color-text-secondary: var(--color-gray);
  --color-background: var(--color-white);
  --color-border: #E5E5E5;
}
```

### Component Styling Approach
- **BEM Methodology:** Use Block-Element-Modifier naming convention
- **CSS Custom Properties:** Leverage CSS variables for theming
- **Mobile-First:** Design responsive layouts starting from mobile
- **Progressive Enhancement:** Ensure basic functionality without JavaScript

### Animation and Transitions
- **Page Transitions:** Smooth fade-in/out between views (300ms)
- **Loading States:** Subtle skeleton screens and spinners
- **Hover Effects:** Gentle color transitions on interactive elements
- **Scroll Animations:** Smooth scrolling behavior for navigation

## Browser Compatibility and Performance

### Target Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers:** iOS Safari 14+, Chrome Mobile 90+
- **Graceful Degradation:** Basic functionality for older browsers

### Performance Optimizations
- **Lazy Loading:** Load markdown content only when needed
- **Caching Strategy:** Cache parsed markdown in memory during session
- **Image Optimization:** Responsive images with proper sizing
- **Code Splitting:** Separate markdown parser for conditional loading

### Accessibility Features
- **Keyboard Navigation:** Full keyboard accessibility for all interactions
- **Screen Reader Support:** Proper ARIA labels and semantic HTML
- **Color Contrast:** Ensure WCAG AA compliance for all text
- **Focus Management:** Clear focus indicators and logical tab order

## Security Considerations

### Content Security
- **Markdown Sanitization:** Prevent XSS through markdown content
- **File Path Validation:** Restrict access to posts directory only
- **Content Type Validation:** Only allow .md files to be processed

### Client-Side Security
- **Input Sanitization:** Clean search queries and user inputs
- **URL Validation:** Prevent directory traversal in file requests
- **Error Information:** Avoid exposing sensitive system information