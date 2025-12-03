# 🤝 Contributing to QRSay-Admin-Restaurant-Management-Mobile-App

Thank you for considering contributing to `QRSay-Admin-Restaurant-Management-Mobile-App`! We aim to maintain the highest standards of quality, performance, and maintainability, reflecting FAANG-level development practices.

## 1. Our Guiding Principles

We adhere to the core principles established by the Apex Technical Authority:

*   **Zero-Defect, High-Velocity, Future-Proof:** Every contribution should strive for excellence and be built to last.
*   **Professional Archival Standard:** Even contributions to older or retired components must be professional and well-documented.
*   **Context-Aware Apex Tech Stack:** We leverage the latest stable technologies, ensuring optimal performance and developer experience.
*   **Apex Naming Convention:** All new features, components, or modules should follow the established naming patterns.
*   **Readability and Maintainability:** Code must be clear, concise, and easy for others to understand and modify.

## 2. Development Environment Setup

Before you begin, please ensure your development environment is set up according to the project's requirements. Refer to the main `README.md` for detailed setup instructions.

Key technologies include:

*   **Language:** TypeScript 6.x (Strict Mode is MANDATORY)
*   **Framework:** React Native (Expo)
*   **Build Tool:** Vite 7 (Rolldown)
*   **Styling:** TailwindCSS v4
*   **Native Integration:** Tauri v2.x
*   **State Management:** Zustand
*   **Linting/Formatting:** Biome
*   **Testing:** Vitest (Unit), Playwright (E2E)

bash
# Clone the repository
git clone https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App.git
cd QRSay-Admin-Restaurant-Management-Mobile-App

# Install dependencies (example using npm/yarn/pnpm)
npm install
# or
yarn install
# or
pnpm install

# Ensure your environment variables are set up as per .env.example
cp .env.example .env


## 3. Contribution Workflow

1.  **Fork the Repository:** Create your own fork of `chirag127/QRSay-Admin-Restaurant-Management-Mobile-App`.
2.  **Create a Branch:** Make your changes in a descriptive feature branch (e.g., `feature/add-new-order-status`, `fix/menu-item-validation`). Use the prefix `feature/`, `fix/`, `chore/`, or `docs/`.
3.  **Commit Changes:** Write clear, concise commit messages following the Conventional Commits specification.
    *   Example: `feat(menu): add endpoint to fetch all categories`
4.  **Test Your Changes:** Ensure all tests pass. Write new tests for any new features or bug fixes.
    *   Run unit tests: `npm run test:unit` (or equivalent for your package manager)
    *   Run E2E tests: `npm run test:e2e` (or equivalent)
5.  **Lint and Format:** Ensure your code adheres to the project's standards.
    *   Run linter: `npm run lint` (or equivalent)
    *   Run formatter: `npm run format` (or equivalent)
6.  **Submit a Pull Request:** Open a Pull Request from your feature branch to the `main` branch of the `chirag127/QRSay-Admin-Restaurant-Management-Mobile-App` repository.
    *   Clearly describe your changes, the problem they solve, and how to test them.
    *   Ensure your PR template is filled out completely.

## 4. Code Style and Standards

*   **TypeScript:** Use TypeScript 6.x with strict type checking enabled (`strict: true` in `tsconfig.json`).
*   **Linting & Formatting:** All code must pass Biome checks. Use `npm run format` to auto-format your code before committing.
*   **Architecture:** Adhere to principles like SOLID, DRY, and YAGNI. For React Native, consider patterns like Feature-Sliced Design (FSD) or similar modular approaches where appropriate.
*   **State Management:** Utilize Zustand for predictable and efficient state management.
*   **Error Handling:** Implement robust error handling, especially for API calls and asynchronous operations. Define clear error states and user feedback mechanisms.

## 5. Testing Policy

*   **Unit Tests:** All new business logic, utility functions, and components should have comprehensive unit tests written using Vitest.
*   **Integration Tests:** For interactions between multiple components or services, integration tests are encouraged.
*   **End-to-End (E2E) Tests:** Critical user flows should be covered by E2E tests using Playwright.
*   **Test Coverage:** Aim for high test coverage. Automated checks will be performed via CI.

## 6. AI AGENT DIRECTIVES (For Developers)

This project integrates with AI agents. Developers are expected to understand and adhere to these directives:

<details>
<summary>Apex AI Agent Directives (Late 2025 Standards)</summary>

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** Senior Principal Software Architect & Master Technical Copywriter.
**Context:** December 2025, building for 2026 standards.
**Output Standard:** EXECUTION-ONLY.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

## 2. INPUT PROCESSING & COGNITION
*   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. Infer technical intent based on project context.
*   **Logic Anchor:** `README.md` is the SSOT.
*   **Mandatory Instrumentation:** No hallucinating APIs. Research with `linkup`/`brave`. Validate with `docfork`.

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
*   **TARGET REPO:** `QRSay-Admin-Restaurant-Management-Mobile-App` (React Native Expo, TypeScript)
*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)
    *   **Stack:** TypeScript 6.x (Strict), Vite 7 (Rolldown), Tauri v2.x (Native), WXT (Extensions).
    *   **State:** Signals (Standardized).
    *   **Lint/Test:** Biome (Speed) + Vitest (Unit) + Playwright (E2E).
    *   **Architecture:** Feature-Sliced Design (FSD) is preferred.

## 4. DEVELOPMENT STANDARDS
*   **Setup:** `git clone` -> `npm install` (or equivalent).
*   **Scripts:** Table defined in `README.md`.
*   **Principles:** SOLID, DRY, YAGNI.

## 5. CONTRIBUTION & CODE REVIEW
*   **PRs:** Target `main` branch. Descriptive messages.
*   **Code Review:** Focus on adherence to Apex standards, security, performance, and maintainability.

## 6. TESTING & VERIFICATION
*   **Unit Tests:** Vitest.
*   **E2E Tests:** Playwright.
*   **Linting:** Biome.

## 7. ARCHIVAL PROTOCOL
*   Retire components gracefully. Maintain documentation. Do not delete historical code without strong justification.

</details>

## 7. Reporting Security Vulnerabilities

We take security very seriously. If you discover any security issues, please follow the guidelines in our `SECURITY.md` file.

## 8. Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. Please read the full text in the `CODE_OF_CONDUCT.md` file to understand what behaviors are expected and unacceptable.

## 9. Getting Help

If you have questions or need clarification on any of these guidelines, please open an issue or reach out on the project's communication channels (if established).

We look forward to your contributions!
