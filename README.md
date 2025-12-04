# QRSay Admin: Restaurant Management Mobile App

<p align="center">
  <img src="https://raw.githubusercontent.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/main/.github/assets/hero-banner.png" alt="QRSay Admin Hero Banner">
</p>

<p align="center">
    <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/actions/workflows/ci.yml"><img src="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/actions/workflows/ci.yml/badge.svg?style=flat-square" alt="Build Status"></a>
    <a href="https://codecov.io/gh/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App"><img src="https://img.shields.io/codecov/c/github/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&token=CODECOV_TOKEN" alt="Code Coverage"></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="#"><img src="https://img.shields.io/badge/React%20Native-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Native"></a>
    <a href="#"><img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo"></a>
    <a href="#"><img src="https://img.shields.io/badge/State-Zustand%20🐻-blue?style=flat-square" alt="Zustand"></a>
    <a href="#"><img src="https://img.shields.io/badge/Lint%20&%20Format-Biome-blueviolet?style=flat-square&logo=biome&logoColor=white" alt="Biome Linter"></a>
    <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg?style=flat-square" alt="License"></a>
    <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/stargazers"><img src="https://img.shields.io/github/stars/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App?style=flat-square&logo=github" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App/stargazers"><strong>Star ⭐ this Repo</strong></a> to support its development!
</p>

---

## 🚀 BLUF: Bottom Line Up Front

QRSay Admin is an enterprise-grade React Native Expo mobile platform for restaurant owners to manage real-time orders, dynamic menus, and staff operations. It provides a centralized, cross-platform (iOS & Android) command center to optimize restaurant efficiency and service quality.


## ✨ Core Features

- **Real-Time Order Management:** Instantly view, accept, or decline incoming customer orders with push notifications.
- **Dynamic Menu Control:** Update menu items, prices, and availability on the fly. Toggle items out of stock with a single tap.
- **Staff Operations Dashboard:** Monitor staff activity and manage operational roles directly from the app.
- **Cross-Platform Performance:** Built with TypeScript and Expo for a consistent, high-performance experience on both iOS and Android from a single codebase.
- **Secure Authentication:** Robust and secure login for authorized restaurant personnel.
- **Lightweight State Management:** Efficient state handling with Zustand for a fast and responsive user interface.


## 🏛️ Architecture: Feature-Sliced Design (FSD)

This project adheres to a strict Feature-Sliced Design (FSD) architecture for maximum scalability, maintainability, and developer velocity. This modular approach ensures a clear separation of concerns and a well-defined dependency graph.

sh
src/
├── app/                # App-wide setup (routing, providers, styles)
│   ├── providers/      # (React-Query, Router, Theme)
│   └── styles/         # (Global styles, theme variables)
├── pages/              # Composition of features & widgets into full screens
│   ├── OrderDashboard/
│   ├── MenuManager/
│   └── StaffControl/
├── widgets/            # Composition of features & entities (e.g., OrderList)
│   ├── OrderList/
│   ├── MenuEditor/
│   └── AnalyticsChart/
├── features/           # Business logic actions (e.g., AcceptDeclineOrder)
│   ├── AcceptDeclineOrder/
│   ├── ToggleMenuItemAvailability/
│   └── AssignStaffToTable/
├── entities/           # Business domain entities (e.g., Order, MenuItem)
│   ├── Order/
│   ├── MenuItem/
│   └── Staff/
└── shared/             # Reusable, framework-agnostic code
    ├── api/            # (Axios instances, API definitions)
    ├── ui/             # (Buttons, Inputs, Modals)
    ├── lib/            # (Hooks, helpers, utils)
    └── config/         # (Environment variables, constants)


---

## 📋 Table of Contents

- [🚀 BLUF: Bottom Line Up Front](#-bluf-bottom-line-up-front)
- [✨ Core Features](#-core-features)
- [🏛️ Architecture: Feature-Sliced Design (FSD)](#️-architecture-feature-sliced-design-fsd)
- [🤖 AI Agent Directives](#-ai-agent-directives)
- [🛠️ Getting Started](#️-getting-started)
- [⚙️ Available Scripts](#️-available-scripts)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🛡️ Security Policy](#️-security-policy)

---

## 🤖 AI Agent Directives

<details>
<summary><strong>System Prompt for Project `QRSay-Admin-Restaurant-Management-Mobile-App`</strong></summary>


# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** This repository, `QRSay-Admin-Restaurant-Management-Mobile-App`, is a TypeScript-based mobile application. Apply the corresponding **Apex Toolchain**.

*   **PRIMARY SCENARIO: MOBILE / APP (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 5.x+**, **React Native**, and **Expo SDK 50+** for cross-platform mobile development. All new code must adhere to strict TypeScript standards.
    *   **State Management:** Employs **Zustand** for centralized, lightweight, and scalable global state. Avoid introducing other state management libraries like Redux or MobX.
    *   **Architecture:** Strictly follows **Feature-Sliced Design (FSD)**. All components, logic, and APIs must be placed in their correct slice (`shared`, `entities`, `features`, `widgets`, `pages`, `app`) to maintain architectural integrity. Review the architecture diagram in the README before adding new modules.
    *   **Lint/Test/Format:** Utilizes **Biome** for ultra-fast, unified linting and formatting. All code must pass Biome checks before merging. Unit and integration tests are written with **Vitest**, and end-to-end tests are implemented using **Maestro** for robust mobile testing flows.

*   **CORE PRINCIPLES (MANDATORY):**
    *   **SOLID:** Ensure all components and hooks adhere to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
    *   **DRY (Don't Repeat Yourself):** Abstract reusable logic into the `shared/lib` (hooks) or `shared/ui` (components) layers.
    *   **YAGNI (You Ain't Gonna Need It):** Do not add features or abstractions that are not required by the current scope.

*   **VERIFICATION & EXECUTION COMMANDS:**
    *   Install dependencies: `npm install`
    *   Run lint & format checks: `npm run lint`
    *   Run unit tests: `npm run test`
    *   Start the development server: `npm start`

</details>

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo Go app on your mobile device or an emulator setup.

### Installation & Setup

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/QRSay-Admin-Restaurant-Management-Mobile-App.git
    cd QRSay-Admin-Restaurant-Management-Mobile-App
    

2.  **Install dependencies:**
    bash
    npm install
    

3.  **Start the development server:**
    bash
    npm start
    

4.  **Launch the app:**
    - Scan the QR code with the Expo Go app on your iOS or Android device.
    - Or, press `a` to run on an Android emulator or `i` to run on an iOS simulator.

## ⚙️ Available Scripts

| Script          | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Starts the Metro bundler (development server).    |
| `npm run android` | Deploys the app to a connected Android device/emulator. |
| `npm run ios`     | Deploys the app to an iOS simulator.              |
| `npm run web`     | Runs the app in a web browser.                    |
| `npm run lint`      | Lints and formats the entire codebase using Biome. |
| `npm run test`      | Runs unit and integration tests with Vitest.      |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see our [**Contributing Guidelines**](.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**. See the [LICENSE](LICENSE) file for more details.

## 🛡️ Security Policy

The security of this project is taken seriously. If you discover a security vulnerability, please follow our [**Security Policy**](.github/SECURITY.md) to report it.
