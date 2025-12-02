# 🤝 Contributing to QRSay-Admin-Restaurant-Management-Mobile-App

We welcome contributions to elevate the **QRSay Admin Mobile Application** into a fault-tolerant, high-performance operational system for restaurant management.

As per the **Apex Technical Authority** mandate, all contributions must align with **Zero-Defect, High-Velocity, Future-Proof** engineering principles.

## 1. Foundational Principles

Before writing any code, familiarize yourself with the project's core tenets, detailed in the root `AGENTS.md` file:

*   **SOLID Compliance:** Design decisions must demonstrate high cohesion and low coupling.
*   **DRY Enforcement:** Avoid redundancy at all costs.
*   **YAGNI Philosophy:** Implement only what is currently required, but engineer with extensibility in mind.
*   **Future-Proofing:** We are building for the **December 2025/2026** standard. Leverage modern features in React Native/Expo.

## 2. The Apex Toolchain (Contextualized for React Native/Expo)

This project is a TypeScript/JavaScript mobile application. All development must adhere to this standard toolchain:

| Component | Standard Tool | Goal |
| :--- | :--- | :--- |
| **Language** | TypeScript (Strict) | Type Safety, Reduced Runtime Errors |
| **Framework** | React Native (with Expo SDK) | Cross-Platform Native Performance |
| **Styling** | TailwindCSS/NativeWind | Utility-First Consistency |
| **Linter/Formatter** | Biome (Supersedes ESLint/Prettier) | Ultra-Fast Code Quality Enforcement |
| **Unit Testing** | Vitest | Rapid, Reliable Unit Verification |
| **E2E Testing** | Playwright | Robust Cross-Platform Workflow Validation |

## 3. Development Workflow

Follow these steps for a successful contribution merge:

### Step 1: Repository Setup

1.  **Fork** this repository: `https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App`
2.  **Clone** your fork locally:
    bash
    git clone https://github.com/YOUR_USERNAME/QRSay-Admin-Restaurant-Management-Mobile-App.git
    cd QRSay-Admin-Restaurant-Management-Mobile-App
    
3.  **Install Dependencies** (using npm/yarn as standard for RN/Expo):
    bash
    npm install # or yarn install
    
4.  **Create a Feature Branch:** Always branch off `main`.
    bash
    git checkout -b feature/short-descriptive-name
    

### Step 2: Coding and Verification

1.  **Implement Changes:** Write clean, well-documented code that adheres to the FSD (Feature-Sliced Design) where applicable.
2.  **Local Lint & Format Check (Biome):** Run the formatter before committing.
    bash
    npm run format
    
3.  **Run Tests:** Ensure all affected unit tests pass, and consider adding new tests for new functionality.
    bash
    npm run test:unit
    
4.  **Run Verification Checks:** Ensure CI passes locally as much as possible.
    bash
    npm run lint
    

### Step 3: Commit and Pull Request

1.  **Atomic Commits:** Ensure each commit is a logical, atomic unit of work.
2.  **Push:** Push your branch to your fork.
    bash
    git push origin feature/short-descriptive-name
    
3.  **Open a Pull Request (PR):** Navigate to the main repository and open a PR targeting the `main` branch. **You MUST use the provided Pull Request Template.**

## 4. Pull Request (PR) Requirements

Every PR will be automatically checked by GitHub Actions. Manual review requires:

*   **Clear Description:** Reference the related issue number (if applicable).
*   **Architectural Justification:** Briefly explain *why* the change was implemented the way it was, especially if deviating from established patterns.
*   **Testing Proof:** Confirmation that new functionality is covered by **Vitest** or **Playwright** tests.

## 5. Reporting Bugs and Requesting Features

Please utilize the official GitHub Issue Tracker. Use the appropriate templates:

*   **Bug Reports:** Use the `bug_report.md` template found in `.github/ISSUE_TEMPLATE/`.
*   **Feature Requests:** Detail the business value and technical feasibility required for the addition.

## 6. Security Disclosure

If you discover a security vulnerability, **DO NOT** open a public issue. Follow the procedure outlined in `.github/SECURITY.md` for responsible disclosure.