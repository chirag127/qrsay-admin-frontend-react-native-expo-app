# QRSay-Admin-Restaurant-Management-Mobile-App

A React Native Expo mobile platform for restaurant owners to manage real-time orders, menus, and staff operations.

--- 

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/ci.yml?style=flat-square&label=Build&logo=githubactions)](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&label=Coverage&logo=codecov)](https://codecov.io/gh/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App)
[![Tech Stack](https://img.shields.io/badge/TypeScript-React%20Native-Expo-131519?style=flat-square&label=Stack&logo=typescript)](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App)
[![License](https://img.shields.io/github/license/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&label=License)](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&logo=github)](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App)

**Star ⭐ this Repo!**

--- 

## 🚀 Overview

**QRSay-Admin-Restaurant-Management-Mobile-App** is the official React Native Expo mobile platform designed for restaurant owners. It provides real-time order management, menu customization, and staff operational oversight, all from a convenient, cross-platform mobile interface.

--- 

## 🌳 Architecture

ascii
. (Root)
├── src/
│   ├── assets/
│   ├── components/ (Reusable UI elements)
│   ├── constants/
│   ├── features/ (Domain-specific modules, e.g., Orders, Menu, Staff)
│   │   ├── orders/
│   │   ├── menu/
│   │   └── staff/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── store/ (State management with Zustand)
│   ├── types/
│   └── utils/
├── .env
├── App.tsx
├── babel.config.js
├── index.js
├── package.json
└── tsconfig.json


--- 

## 🗂️ Table of Contents

*   [🚀 Overview](#-overview)
*   [🌳 Architecture](#-architecture)
*   [🗂️ Table of Contents](#🗂️-table-of-contents)
*   [🤖 AI AGENT DIRECTIVES](#🤖-ai-agent-directives)
*   [🛠️ Development Standards](#️-development-standards)
    *   [Prerequisites](#prerequisites)
    *   [Setup](#setup)
    *   [Scripts](#scripts)
    *   [Core Principles](#core-principles)
*   [📜 License](#-license)
*   [🛡️ Security](#-security)
*   [🤝 Contributing](#-contributing)

--- 

## 🤖 AI AGENT DIRECTIVES

<details>
<summary>Click to expand AI Agent Directives</summary>

### SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (LATE 2025 EDITION)

*   **Role:** Senior Principal Software Architect, Master Technical Copywriter, DevOps Strategist with 40+ years of elite industry experience. Operating with absolute precision, enforcing FAANG-level standards.
*   **Context:** December 2025. Building for the 2026 standard.
*   **Output Standard:** EXECUTION-ONLY. No plans, only executed code and applied fixes.
*   **Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

### INPUT PROCESSING & COGNITION

*   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. Infer technical intent based on project context.
*   **Logic Anchor:** `README.md` is the **Single Source of Truth (SSOT)**.
*   **Mandatory MCP Instrumentation:** No hallucinated APIs. Use `linkup`/`brave` for December 2025 industry standards, security threats, and 2026 UI trends. Use `docfork` to verify external API signatures. Engage `clear-thought-two` for complex flows before coding.

### CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript) - APPLICABLE FOR THIS PROJECT**
    *   **Stack:** **TypeScript 6.x (Strict)**, **Vite 7 (Rolldown)** for build tooling, **Tauri v2.x (Native)** for desktop shell (if applicable, though this project is mobile-focused), **WXT (Web Extension Toolkit)** for browser extensions (if applicable). For this mobile app, the core is **React Native with Expo 51+**.
    *   **Lint/Format:** **Biome** (Speed) + **Prettier** (Consistency).
    *   **State Management:** **Zustand** (Minimalistic and scalable).
    *   **Testing:** **Vitest** (Unit/Integration) + **Playwright** (E2E for potential web views or simulation).
    *   **Architecture:** **Feature-Sliced Design (FSD)**, promoting modularity and scalability.
    *   **UI:** **TailwindCSS v4** (Utility-first CSS) for rapid styling. Ensure accessibility best practices.

### APEX NAMING CONVENTION (STAR VELOCITY ENGINE)

*   **Formula:** `<Product-Name>-<Primary-Function>-<Platform>-<Type>`
*   **Format:** `Title-Case-With-Hyphens`.
*   **Rules:** 3-10 words, high-volume keywords, NO numbers, NO emojis, NO underscores, NO generic words without qualifiers.

### APEX REPOSITORY METADATA STANDARDS

*   **Name:** Must be descriptive, following the `Star Velocity` Engine.
*   **Description:** Concise, high-impact, clearly stating the purpose and core technologies.
*   **Topics:** Comprehensive list of relevant keywords for discoverability.

### THE README REPLICATION PROTOCOL (ULTIMATE ARTIFACT)

*   **Sections:** Hero Banner/Logo, Live Badges (Shields.io: `flat-square` style, `chirag127` user), Social Proof, BLUF, Architecture Diagram, Table of Contents, **AI AGENT DIRECTIVES** (collapsible), Development Standards (Setup, Scripts, Principles), License, Security, Contributing.

### DYNAMIC URL & BADGE PROTOCOL

*   **Base URL:** `https://github.com/chirag127/<New-Repo-Name>`
*   **Consistency:** Use the new repository name for all links and badge references.

</details>

--- 

## 🛠️ Development Standards

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or Yarn package manager
*   Expo Go app installed on your physical device or simulator/emulator
*   TypeScript (globally installed is recommended)

### Setup

bash
# 1. Clone the repository
git clone https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App.git
cd QRSay-Admin-Restaurant-Management-Mobile-App

# 2. Install dependencies using npm
npm install

# OR using Yarn
# yarn install

# 3. Set up environment variables (if any)
# cp .env.example .env
# Fill in your specific configurations in .env


### Scripts

| Script        | Description                                                                 |
| :------------ | :-------------------------------------------------------------------------- |
| `npm start`   | Starts the Expo development server.                                         |
| `npm run ios` | Runs the app on an iOS simulator.                                           |
| `npm run android` | Runs the app on an Android emulator or connected device.                  |
| `npm run web` | Runs the app in a web browser (Expo for Web).                               |
| `npm run lint`| Runs Biome linter to check code quality.                                    |
| `npm run format`| Formats code using Biome to ensure consistency.                             |
| `npm test`    | Runs unit and integration tests with Vitest.                                |

### Core Principles

*   **SOLID:** Applying the Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles to ensure maintainable and scalable code.
*   **DRY (Don't Repeat Yourself):** Minimizing code duplication by abstracting common logic into reusable components, hooks, or utility functions.
*   **YAGNI (You Ain't Gonna Need It):** Implementing only the features that are currently required, avoiding over-engineering for hypothetical future needs.
*   **Modularity:** Adhering to Feature-Sliced Design principles for clear separation of concerns and maintainable code structure.

--- 

## 📜 License

This project is licensed under the CC BY-NC 4.0 License - see the [LICENSE](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/blob/main/LICENSE) file for details.

--- 

## 🛡️ Security

Security is paramount. This project adheres to best practices for mobile application security, including secure handling of sensitive data, input validation, and protection against common mobile vulnerabilities. For detailed guidelines and reporting procedures, please refer to the [SECURITY.md](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/blob/main/.github/SECURITY.md) file.

--- 

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/blob/main/.github/CONTRIBUTING.md) for details on how to submit pull requests, report bugs, and suggest enhancements.
