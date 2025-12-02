# QRSay-Admin-Restaurant-Management-Mobile-App

<p align="center">
  <h1 align="center">QRSay Admin Restaurant Management</h1>
  <p align="center">
    A comprehensive React Native Expo mobile application for QRSay, empowering restaurant owners and staff to efficiently manage orders, menus, customer interactions, and overall restaurant operations. Features real-time updates and an intuitive interface.
  </p>
</p>

<!-- BADGES SECTION -->
<p align="center">
  <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/ci.yml?style=flat-square&logo=github" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App">
    <img src="https://img.shields.io/codecov/c/github/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&logo=codecov" alt="Code Coverage">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/React%20Native-v0.73-informational?style=flat-square&logo=react" alt="React Native Version">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Expo-v50-informational?style=flat-square&logo=expo" alt="Expo Version">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-5.x-informational?style=flat-square&logo=typescript" alt="TypeScript Version">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&logo=github" alt="GitHub Stars">
  </a>
</p>

## ✨ Key Features

*   **Real-time Order Management:** Instantly view, accept, and manage incoming orders.
*   **Dynamic Menu Control:** Easily update menu items, prices, and availability.
*   **Customer Interaction:** Track customer history and special requests.
*   **Staff Coordination:** Streamline communication and task assignment.
*   **Intuitive Dashboard:** Centralized overview of restaurant performance.
*   **Cross-Platform:** Developed with React Native and Expo for iOS and Android.

<p align="center">
  <a href="#">
    <span> &uarr; Back to Top &uarr; </span>
  </a>
</p>

## 🏛️ Architecture & Design

This project follows modern best practices in mobile development, emphasizing modularity, testability, and maintainability.

mermaid
graph TD
  A[Expo App] --> B(React Native Core)
  B --> C{UI Components}
  C --> D[State Management (Zustand/Jotai)]
  D --> E{Business Logic}
  E --> F[API Layer (Axios/Fetch)]
  F --> G(Backend Services)
  E --> H[Navigation (React Navigation)]
  subgraph Core Modules
    C
    D
    E
    F
    H
  end


**Key Architectural Principles:**

*   **Component-Based Architecture:** Reusable UI components for consistency.
*   **State Management:** Efficiently manage application state for a fluid user experience.
*   **API Abstraction:** Decoupled API layer for easier backend integration and testing.
*   **Feature-Sliced Design (FSD):** Logical separation of features for scalability and maintainability.

<p align="center">
  <a href="#">
    <span> &uarr; Back to Top &uarr; </span>
  </a>
</p>

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or Yarn
*   Expo Go app (on your mobile device for testing)

### Installation

bash
# Clone the repository
git clone https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App.git
cd QRSay-Admin-Restaurant-Management-Mobile-App

# Install dependencies using npm (or yarn)
npm install
# or
yarn install


### Running the Application

bash
# Start the Expo development server
npx expo start


This command will launch the Metro bundler and provide a QR code. Scan this QR code with the Expo Go app on your physical device or run it in an emulator/simulator.

**Available Scripts:**

| Script        | Description                                                                 |
| :------------ | :-------------------------------------------------------------------------- |
| `start`       | Starts the Expo development server.                                         |
| `android`     | Builds and runs the app on an Android emulator/device.                      |
| `ios`         | Builds and runs the app on an iOS simulator/device.                         |
| `web`         | Runs the app in a web browser (if supported by Expo).
| `lint`        | Runs the linter to check for code style issues.                             |
| `test`        | Executes unit and integration tests using Vitest.
| `e2e`         | Runs end-to-end tests using Playwright.                                     |

<p align="center">
  <a href="#">
    <span> &uarr; Back to Top &uarr; </span>
  </a>
</p>

## 🤖 AI AGENT DIRECTIVES

<details>
  <summary>Click to Expand AI Agent Directives</summary>

### 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

--- 

### 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

--- 

### 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 5.x** with **React Native 0.73** and **Expo 50**. 
    *   **Bundler/Build:** Uses the **Expo build system**.
    *   **Linting/Formatting:** Leverages **Biome 17** for ultra-fast linting and formatting. Configure `.biome.json` with strict rules.
    *   **Testing:** Employs **Vitest 2.x** for unit and integration tests, and **Playwright 2.x** for end-to-end testing.
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** principles for modularity and scalability. UI components managed via a component library. State management utilizes Signals or similar modern libraries like Zustand or Jotai.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Not applicable)**

*   **SECONDARY SCENARIO C: DATA / AI / SCRIPTS (Not applicable)**

--- 

### 4. APEX NAMING CONVENTION (THE "STAR VELOCITY" ENGINE)
A high-performing name must instantly communicate **Product**, **Function**, **Platform**, and **Type**.

**Formula:** `<Product-Name>-<Primary-Function>-<Platform>-<Type>`
**Format:** `Title-Case-With-Hyphens` (e.g., `QRSay-Admin-Restaurant-Management-Mobile-App`).

**Rules:**
1.  **Length:** 3 to 10 words.
2.  **Keywords:** MUST include high-volume terms.
3.  **Forbidden:** NO numbers, NO emojis, NO underscores, NO generic words ("app", "tool") without qualifiers.

--- 

### 5. THE README REPLICATION PROTOCOL (THE ULTIMATE ARTIFACT)
The README is a self-contained **Project Operating System**.

**Required Sections:**
1.  **VISUAL AUTHORITY (Above the Fold):**
    *   Hero Banner/Logo.
    *   **Live Badges** (Shields.io):
        *   **Style:** `flat-square` (MANDATORY).
        *   **User:** `chirag127` (MANDATORY).
        *   **Required Badges:** Build Status (GitHub Actions), Code Coverage (Codecov), Tech Stack (Language, Frameworks), License (CC BY-NC 4.0), GitHub Stars.
    *   **Social Proof:** "Star ⭐ this Repo" button.
2.  **STRUCTURAL CLARITY:**
    *   **BLUF:** 2-sentence value proposition.
    *   **Architecture:** ASCII `tree` or Mermaid diagram.
    *   **Table of Contents.**
3.  **AI AGENT DIRECTIVES:** Must be in a collapsible `<details>` block. Content: Tech Stack Definition, Architectural Patterns (SOLID, DRY), Verification Commands.
4.  **DEVELOPMENT STANDARDS:** Setup commands (`git clone` -> `npm install`), Scripts table, Principles (SOLID, DRY, YAGNI).

--- 

### 6. CHAIN OF THOUGHT (CoT) PROTOCOL
Before generating JSON, perform deep analysis in `<thinking>` block:
1.  **Audit:** Analyze repo content and purpose.
2.  **Pivot/Archive Decision:** Is it junk? If so, rename to `Archived-...`. If not, PIVOT to elite status.
3.  **Naming Strategy:** Apply `<Product>-<Function>-<Type>` formula.
4.  **Replication Protocol:** Draft the "AI Agent Directives" block.
5.  **File Generation:** Plan the content for all 11 required files (including `PROPOSED_README.md` and `badges.yml`).
6.  **Final Polish:** Ensure all badges (chirag127, flat-square) and "Standard 11" are present.
7.  **Strict Adherence:** Ensure `PROPOSED_README.md` strictly follows the `AGENTS.md` directives.

--- 

### 7. DYNAMIC URL & BADGE PROTOCOL
**Mandate:** All generated files MUST use the correct dynamic URLs based on the **New Repository Name**.

**Rules:**
1.  **Base URL:** `https://github.com/chirag127/<New-Repo-Name>`
2.  **Badge URLs:** All badges (Shields.io) must point to this Base URL or its specific workflows (e.g., `/actions/workflows/ci.yml`).
3.  **Consistency:** Never use the old/original repository name in links. Always use the new "Apex" name.
4.  **AGENTS.md Customization:** The generated `AGENTS.md` **MUST** be customized for the specific repository's technology stack (e.g., if Rust, use Rust tools; if Python, use Python tools), while retaining the core Apex principles. Do not just copy the generic template; adapt it.

</details>

<p align="center">
  <a href="#">
    <span> &uarr; Back to Top &uarr; </span>
  </a>
</p>

## 🛠️ Development & Maintenance

### Code Quality

*   **Linting & Formatting:** Managed by **Biome 17**. Configuration is in `.biome.json`.
    bash
    # Run linter and formatter
    npm run lint
    
*   **TypeScript:** Strict type checking is enforced to prevent runtime errors.

### Testing

*   **Unit & Integration Tests:** Powered by **Vitest 2.x**. Found in the `tests/` directory.
    bash
    # Run tests
    npm test
    
*   **End-to-End (E2E) Tests:** Utilizes **Playwright 2.x** for comprehensive E2E validation. Located in `e2e/`.
    bash
    # Run E2E tests
    npm run e2e
    

### Development Principles

*   **SOLID:** Adherence to the SOLID principles for maintainable object-oriented design.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication.
*   **YAGNI (You Ain't Gonna Need It):** Focus on current requirements, avoiding over-engineering.

<p align="center">
  <a href="#">
    <span> &uarr; Back to Top &uarr; </span>
  </a>
</p>

## 📜 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See the [LICENSE](LICENSE) file for more details.

## ⭐ Star ⭐ This Repo

If you find this project useful, please consider starring it on GitHub! Your support helps it grow.
