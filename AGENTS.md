## Software Engineering Standards & Readable Code

Follow professional software engineering principles. The codebase must be clean, readable, maintainable, scalable, modular, and easy for another developer to understand and extend.

### 1. Readable and Maintainable Code

- Write code that a professional software engineer can easily read, understand, debug, and maintain.
- Prefer clear, meaningful, descriptive names for variables, functions, components, hooks, types, and files.
- Keep functions and components focused on a single responsibility.
- Avoid unnecessary complexity, deeply nested conditions, duplicated logic, and overly complicated expressions.
- Use reusable components, custom hooks, utilities, and shared functions wherever appropriate.
- Keep business logic separate from UI components.
- Use strict TypeScript typing. Avoid `any`; define proper interfaces and types.
- Use early returns and clear conditional logic where appropriate.
- Avoid unnecessary abstractions, premature optimization, and over-engineering.
- Do not write code solely to reduce the number of files. Prioritize maintainability and logical separation.
- Do not add unnecessary code comments. Write self-explanatory code; add comments only when the logic genuinely needs clarification.

### 2. Strict File Length Limit

**A single source-code file must not exceed 500 lines.**

- Keep every source file within a maximum of 500 lines.
- Aim for approximately 150–300 lines per file whenever practical.
- If a file approaches 400 lines, review it and identify opportunities to split it into smaller modules.
- If a file exceeds 500 lines, refactor it before considering the task complete.
- Split large components into smaller reusable components.
- Move reusable business logic into hooks, services, or utility files.
- Move interfaces and types into appropriate type-definition files.
- Separate constants, configuration, validation schemas, and data transformations into dedicated modules.
- Avoid creating artificial files just to satisfy the line limit. Each file must have a clear responsibility.
- The 500-line limit applies to source code, not generated files, lockfiles, or automatically generated build artifacts.

### 3. Next.js Version-Specific Documentation — Mandatory

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Additional instructions:

- Before implementing any Next.js feature, inspect the installed Next.js version in the project.
- Read the relevant documentation from the installed package's `node_modules/next/dist/docs/` directory.
- Do not assume APIs, routing conventions, configuration options, or file structures from older Next.js versions.
- Follow current installed-version recommendations and deprecation notices.
- Do not upgrade or downgrade Next.js without explicit approval.
- Preserve the existing project structure unless a change is required and justified.

### 4. Architecture and Code Organization

- Follow a clear and consistent folder structure.
- Separate UI, application logic, data, validation, types, configuration, and utilities.
- Use Server Components by default and Client Components only when interactivity or browser-side functionality requires them.
- Keep client-side JavaScript minimal.
- Avoid unnecessary global state. Use local component state where sufficient.
- Keep shared components generic and reusable without making them unnecessarily complicated.
- Follow consistent import ordering and avoid circular dependencies.
- Use the existing project conventions instead of introducing competing patterns.

### 5. Error Handling and Data Validation

- Validate external and JSON data using appropriate TypeScript types and Zod schemas.
- Handle missing, invalid, or unexpected data gracefully.
- Provide meaningful error and empty states.
- Avoid silently swallowing errors.
- Use appropriate error handling for asynchronous operations.
- Never expose secrets, private environment variables, or sensitive information in client-side code.
- Do not hardcode credentials, API keys, or environment-specific URLs.

### 6. Performance and Accessibility

- Optimize images and use appropriate Next.js image-handling features.
- Avoid unnecessary client-side rendering and JavaScript.
- Use dynamic imports only when they provide a meaningful benefit.
- Avoid unnecessary dependencies and large animation libraries when lighter alternatives are sufficient.
- Follow semantic HTML and accessible component patterns.
- Ensure keyboard navigation, visible focus states, meaningful labels, and appropriate contrast.
- Respect `prefers-reduced-motion`.
- Optimize Core Web Vitals and Lighthouse performance without compromising functionality.

### 7. Code Quality and Testing

- Run ESLint and Prettier checks.
- Run TypeScript checks and resolve type errors.
- Write unit tests for important utilities, hooks, and business logic.
- Add component tests for important interactive UI elements.
- Use Playwright for critical end-to-end user journeys.
- Check for unused dependencies, imports, variables, and files.
- Run production builds to identify build-time errors.
- Do not ignore lint, TypeScript, test, or build errors to make a task appear complete.

### 8. Safe Refactoring Rules

- Understand existing code before modifying it.
- Do not rewrite working components unnecessarily.
- Preserve existing functionality, content, routes, and behavior.
- Do not delete existing files, components, dependencies, or configurations without verifying they are unused and obtaining approval when deletion is significant.
- Avoid changing unrelated files.
- Make changes incrementally and verify them after each meaningful implementation step.
- Do not replace established project patterns without a clear technical reason.

### 9. Documentation and Developer Experience

- Maintain a useful README with setup, installation, development, testing, and build instructions.
- Document complex architecture decisions and non-obvious business logic.
- Keep configuration and environment variable examples up to date.
- Use consistent formatting and naming conventions.
- Make sure another developer can clone the repository, understand the structure, and start development without unnecessary confusion.

### 10. Mandatory Code Review Before Completing Each Phase

Before marking any implementation phase as complete:

1. Review all newly created and modified files.
2. Check that no source-code file exceeds 500 lines.
3. Check readability, naming, modularity, and separation of concerns.
4. Identify duplicated or unnecessarily complex code.
5. Verify TypeScript, ESLint, and Prettier.
6. Run relevant tests and the production build.
7. Check for broken imports, unused files, and unnecessary dependencies.
8. Confirm that existing functionality has not been unintentionally changed.
9. Fix identified issues before reporting completion.

**Final principle:** Write code as if another experienced software engineer will take ownership of this project tomorrow. Prioritize clarity, correctness, maintainability, performance, and long-term scalability over writing code quickly or minimizing the number of lines.
