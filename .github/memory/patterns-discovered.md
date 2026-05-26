# Discovered Code Patterns

This file documents recurring code patterns and best practices discovered during development. These patterns help maintain consistency and guide future implementation decisions.

## Purpose

- Document solutions to recurring problems
- Establish project-specific conventions
- Guide AI suggestions with learned patterns
- Prevent anti-patterns from spreading

## Pattern Template

```markdown
### Pattern Name

**Context**: When does this pattern apply?

**Problem**: What problem does this pattern solve?

**Solution**: How should it be implemented?

**Example**:
```javascript
// Code example showing the pattern
```

**Related Files**:
- path/to/file1.js
- path/to/file2.js

**Notes**: Additional considerations or gotchas
```

---

## Backend Patterns

### Service Initialization with Empty Collections

**Context**: When initializing a service or module that manages a collection of items (todos, users, etc.)

**Problem**: How should empty collections be initialized - as `null`, `undefined`, or empty array `[]`?

**Solution**: Always initialize collections as empty arrays `[]` rather than `null` or `undefined`. This prevents null checks throughout the codebase and ensures consistent behavior.

**Example**:
```javascript
// ✅ GOOD: Initialize with empty array
class TodoService {
  constructor() {
    this.todos = [];  // Empty array ready for operations
  }
  
  getTodos() {
    return this.todos;  // Always returns an array
  }
}

// ❌ BAD: Initialize with null
class TodoService {
  constructor() {
    this.todos = null;  // Requires null checks everywhere
  }
  
  getTodos() {
    return this.todos || [];  // Defensive code needed
  }
}
```

**Related Files**:
- `packages/backend/src/app.js` - Todo service initialization

**Notes**: 
- Frontend can always call `.map()`, `.filter()`, etc. without null checks
- Reduces defensive programming overhead
- Makes API responses more consistent
- Follows principle of "make invalid states unrepresentable"

---

## Frontend Patterns

_Patterns will be documented here as they emerge during frontend development_

---

## Testing Patterns

_Testing patterns will be documented here as they emerge_

---

## Integration Patterns

_Integration patterns will be documented here as they emerge_

---

## Instructions

When adding new patterns:
1. Use clear, descriptive pattern names
2. Explain the context where pattern applies
3. Show both good and bad examples
4. Link to actual files using the pattern
5. Include any gotchas or edge cases
6. Update patterns as they evolve
7. Remove patterns that become obsolete
8. Group patterns by domain (Backend, Frontend, Testing, etc.)

## Pattern Evolution

Patterns should be:
- **Living**: Updated as better approaches are discovered
- **Specific**: Concrete enough to guide implementation
- **Justified**: Explain why, not just how
- **Tested**: Validated through actual use in the project
