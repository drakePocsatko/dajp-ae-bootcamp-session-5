# Copilot Instructions for TODO Application

## Project Context

This is a full-stack TODO application with a React frontend and Express backend. The project follows an iterative, feedback-driven development approach.

**Current Phase**: Backend stabilization and frontend feature completion

**Technology Stack**:
- Frontend: React with React Testing Library for component tests
- Backend: Express with Jest and Supertest for API tests
- UI Testing: Playwright for end-to-end automation
- Monorepo structure with separate frontend and backend packages

## Documentation References

Refer to these documents to understand the project structure and standards:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and project structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

1. **Test-Driven Development**: Follow the Red-Green-Refactor cycle
   - Write tests first (RED)
   - Implement minimal code to pass (GREEN)
   - Refactor for quality (REFACTOR)

2. **Incremental Changes**: Make small, testable modifications rather than large changes

3. **Systematic Debugging**: Use test failures as guides to identify and fix issues

4. **Validation Before Commit**: Ensure all tests pass and no lint errors exist before committing

## Testing Scope

This project uses multiple testing layers for comprehensive quality assurance:

### Test Types

- **Backend**: Jest + Supertest for API endpoint testing
- **Frontend Unit/Integration**: React Testing Library for component behavior and interactions
- **UI End-to-End**: Playwright for critical user journey automation
- **Manual Browser Testing**: For exploratory validation and visual checks

### Testing Strategy by Context

**Backend API Changes**:
- Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- Use Supertest to validate HTTP endpoints, status codes, and response data
- Test both success cases and error scenarios

**Frontend Component Features**:
- Write React Testing Library tests FIRST for component behavior (RED-GREEN-REFACTOR)
- Test user interactions, state changes, and rendered output
- Follow with manual browser testing for full UI flows and visual validation

**UI Critical Journeys**:
- Create Playwright tests for end-to-end user workflows
- Focus on critical paths: todo creation, completion, deletion
- Validate full integration between frontend and backend

**Rationale**: Combine fast feedback loops (unit/integration tests) with end-to-end quality confidence (UI tests)

## Workflow Patterns

### 1. TDD Workflow (Red-Green-Refactor)

1. Write or fix tests to describe expected behavior
2. Run tests and verify they fail (RED)
3. Implement minimal code to make tests pass
4. Run tests again and verify they pass (GREEN)
5. Refactor code for quality while keeping tests green (REFACTOR)
6. Validate all tests pass before committing

### 2. Code Quality Workflow

1. Run linter: `npm run lint` or `npm run lint:fix`
2. Categorize issues by severity and type
3. Fix issues systematically (prefer auto-fix when safe)
4. Re-validate with lint and test suites
5. Commit changes with descriptive message

### 3. Integration Workflow

1. Identify integration issue (e.g., frontend/backend mismatch)
2. Debug using browser DevTools, network tab, and server logs
3. Write or update tests to cover the integration scenario
4. Fix the issue following TDD principles
5. Verify end-to-end functionality
6. Validate all test suites pass

### 4. UI Testing Workflow

1. Define critical user journeys to automate
2. Create Playwright test specifications
3. Run UI tests: `npm run test:ui` (in frontend package)
4. Debug failures using Playwright trace viewer and screenshots
5. Validate test coverage and stability
6. Integrate into CI/CD pipeline

## Agent Usage

Use specialized agents for different aspects of development:

### tdd-developer
- **Use for**: Implementation and unit/integration TDD cycles
- **Scope**: Backend API development, frontend component features
- **Approach**: Write tests first, implement to pass, refactor
- **Restriction**: Do NOT create or run Playwright UI tests in this mode

### code-reviewer
- **Use for**: Addressing lint errors and code quality improvements
- **Scope**: ESLint fixes, code style, best practices
- **Approach**: Systematic review and fixes with validation

### test-engineer
- **Use for**: Playwright UI test authoring, execution, and debugging
- **Scope**: End-to-end UI test automation and failure triage
- **Approach**: Create stable, maintainable UI tests with isolation checks
- **Ownership**: All Playwright-related testing activities

## Memory System

The project uses a two-tiered memory system to track development discoveries and maintain context:

### Persistent Memory
- **Location**: This file (`.github/copilot-instructions.md`)
- **Purpose**: Foundational principles, workflows, and project-wide standards
- **Scope**: Rarely changes; committed to git

### Working Memory
- **Location**: `.github/memory/` directory
- **Purpose**: Development discoveries, patterns, and session notes
- **Structure**:
  - `session-notes.md` - Historical session summaries (committed)
  - `patterns-discovered.md` - Accumulated code patterns (committed)
  - `scratch/working-notes.md` - Active session notes (NOT committed)

### Usage Guidelines

**During Active Development**:
- Take notes in `.github/memory/scratch/working-notes.md` as you work
- Document findings, decisions, and blockers in real-time
- This file is ephemeral and not committed to git

**At End of Session**:
- Summarize key findings into `.github/memory/session-notes.md`
- Move recurring patterns to `.github/memory/patterns-discovered.md`
- Clear or archive `scratch/working-notes.md`
- Commit updated session-notes and patterns-discovered files

**When Providing Suggestions**:
- AI references these memory files for context-aware guidance
- Patterns in `patterns-discovered.md` inform code suggestions
- Session notes provide historical context for related work
- Working notes track current session state

See [.github/memory/README.md](memory/README.md) for detailed usage instructions.

## Workflow Utilities

### GitHub CLI Commands

Use GitHub CLI for workflow automation (available in all agent modes):

**List Open Issues**:
```bash
gh issue list --state open
```

**Get Issue Details**:
```bash
gh issue view <issue-number>
```

**Get Issue with Comments**:
```bash
gh issue view <issue-number> --comments
```

**Workflow Notes**:
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked
- Parse issue details to understand context and requirements

## Git Workflow

### Conventional Commits

Use conventional commit format for clear, semantic version history:

- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `test:` - Test additions or fixes
- `refactor:` - Code refactoring without behavior change
- `style:` - Code formatting changes

**Example**:
```bash
git commit -m "feat: add todo completion endpoint"
git commit -m "fix: correct todo deletion validation"
git commit -m "test: add integration tests for todo API"
```

### Branch Strategy

- **Main branch**: `main` - Stable, production-ready code
- **Feature branches**: `feature/<descriptive-name>` - New features and improvements
- **Bugfix branches**: `fix/<descriptive-name>` - Bug fixes

### Commit Workflow

1. Stage all changes: `git add .`
2. Commit with conventional format: `git commit -m "type: description"`
3. Push to correct branch: `git push origin <branch-name>`
4. Ensure all tests pass before pushing

### Best Practices

- Keep commits atomic and focused
- Write descriptive commit messages
- Reference issue numbers in commits when applicable
- Always validate tests before pushing
- Use feature branches for all development work
