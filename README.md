<div align="center">

```
 ██████╗  ██████╗  ██████╗    ███████╗ ██████╗  ██████╗
██╔════╝ ██╔═══██╗██╔════╝    ██╔════╝██╔═══██╗██╔════╝
███████╗ ██║   ██║██║         ███████╗██║   ██║██║
╚════██║ ██║   ██║██║         ╚════██║██║   ██║██║
███████║ ╚██████╔╝╚██████╗    ███████║╚██████╔╝╚██████╗
╚══════╝  ╚═════╝  ╚═════╝    ╚══════╝ ╚═════╝  ╚═════╝
```

# Autonomous SOC · Mobile Frontend

AI-Driven Security Operations — Anywhere. Anytime.

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-55-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-7C3AED?style=for-the-badge)](CONTRIBUTING.md)

<br/>

> A mobile-first Security Operations Center that puts AI-driven threat intelligence in your pocket.  
> No desktop required. No delays. Just answers.**

<br/>

[🌐 Live Web App](#) · [📱 Download APK](#) · [🔗 Backend Repo](#) · [📖 Docs](#)

</div>

---

<br/>

## ⚠️ Two-Part Architecture

> This repository is the frontend client only.  
> The autonomous AI agent, LangGraph routing engine, and FastAPI server live in the [Backend Repository →](#)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SYSTEM ARCHITECTURE                            │
│                                                                     │
│   ┌──────────────────────┐         ┌───────────────────────────┐   │
│   │   THIS REPOSITORY    │         │    BACKEND REPOSITORY     │   │
│   │                      │         │                           │   │
│   │  📱 Mobile Client    │  HTTPS  │  🤖 AI Orchestration      │   │
│   │  React Native +      │ ◄─────► │  LangGraph + LangChain    │   │
│   │  Expo SDK 55         │  REST   │                           │   │
│   │                      │         │  ⚡ FastAPI Server         │   │
│   │  🌐 Web Client       │         │  Python 3.11+             │   │
│   │  Vercel CDN          │         │                           │   │
│   │                      │         │  🧠 Claude / GPT-4        │   │
│   │  📦 Android APK      │         │  Threat Intelligence      │   │
│   │  EAS Build           │         │  LLM Backbone             │   │
│   └──────────────────────┘         └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🚀 Live Deployments

| Platform | Status | Link |
|---|---|---|
| 🌐 Web Application | ![Live](https://img.shields.io/badge/status-live-22C55E?style=flat-square) | [Insert Vercel URL →](#) |
| 📱 Android APK | ![Available](https://img.shields.io/badge/status-available-3B82F6?style=flat-square) | [Download via EAS →](#) |
| 🍎 iOS | ![TestFlight](https://img.shields.io/badge/status-TestFlight-F59E0B?style=flat-square) | [TestFlight Beta →](#) |

<br/>

---

## ✨ Feature Overview

```
╔══════════════════════════════════════════════════════════════════════╗
║                         KEY CAPABILITIES                            ║
╠══════════════╦═══════════════════════════════╦═════════════════════╣
║  PLATFORM    ║  INTELLIGENCE                 ║  UX / DELIVERY      ║
╠══════════════╬═══════════════════════════════╬═════════════════════╣
║              ║                               ║                     ║
║  ✓ iOS       ║  ✓ Real-time AI threat scan   ║  ✓ Markdown render  ║
║  ✓ Android   ║  ✓ LangGraph agent routing    ║  ✓ Local caching    ║
║  ✓ Web       ║  ✓ Multi-source correlation   ║  ✓ Native sharing   ║
║              ║  ✓ CVSS scoring display       ║  ✓ Offline history  ║
║              ║  ✓ IOC extraction             ║  ✓ Push alerts      ║
║              ║                               ║                     ║
╚══════════════╩═══════════════════════════════╩═════════════════════╝
```

### 🔷 True Cross-Platform
Write once. Run everywhere. Built with Expo SDK 55, the app delivers a native experience on iOS, Android, and modern browsers from a single codebase — no compromises.

### 📄 Markdown Threat Reports
AI-generated intelligence reports are rendered natively as rich Markdown — tables, headers, code blocks, and severity highlights displayed exactly as the backend intended.

### 💾 Persistent Local Caching
Previous scan results are cached on-device using AsyncStorage. Analysts get instant access to historical intelligence without re-triggering expensive AI pipelines.

### 📤 Native OS Share Sheets
Distribute threat reports in one tap. The native share integration surfaces Slack, email, Teams, and every other app the analyst already uses.

<br/>

---

## 🗺️ Application Flow

```
                        ANALYST OPENS APP
                               │
                               ▼
                    ┌──────────────────────┐
                    │   🏠 Home Screen      │
                    │   Scan History Feed   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ 🔍 New Scan  │  │ 📋 History   │  │ ⚙️ Settings  │
    │  Enter IOC   │  │  Cached      │  │  API Config  │
    │  or Domain   │  │  Results     │  │  Alerts      │
    └──────┬───────┘  └──────────────┘  └──────────────┘
           │
           ▼
    ┌──────────────┐
    │  POST /scan  │ ──────────────────────────────────►
    │  FastAPI     │                          BACKEND
    └──────┬───────┘ ◄──────────────────────────────────
           │                    AI Report (JSON/MD)
           ▼
    ┌──────────────────────────────┐
    │  📊 Results Screen           │
    │                              │
    │  ┌────────────────────────┐  │
    │  │ SEVERITY: HIGH 🔴      │  │
    │  │ CVSS: 9.1              │  │
    │  │ ─────────────────────  │  │
    │  │ ## Threat Summary      │  │
    │  │ The IP 192.168.x.x...  │  │
    │  │ **IOCs Detected:** ... │  │
    │  └────────────────────────┘  │
    │                              │
    │  [💾 Save]  [📤 Share]       │
    └──────────────────────────────┘
```

<br/>

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               APPLICATION LAYER                     │   │
│  │   React Native 0.74  ·  TypeScript  ·  Expo SDK 55  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────────────────┐  │
│  │   NAVIGATION     │    │         UI / STYLING         │  │
│  │  Expo Router     │    │  RN StyleSheet · react-      │  │
│  │  File-based      │    │  native-markdown-display     │  │
│  │  routing         │    │  Expo Vector Icons           │  │
│  └──────────────────┘    └──────────────────────────────┘  │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────────────────┐  │
│  │   PERSISTENCE    │    │          NATIVE APIs         │  │
│  │  AsyncStorage    │    │  Share API · Notifications   │  │
│  │  Local caching   │    │  Haptics · Clipboard         │  │
│  └──────────────────┘    └──────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  DEPLOYMENT                         │   │
│  │    Vercel (Web CDN)    ·    EAS Build (APK/IPA)     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Version |
|---|---|---|
| Runtime | React Native | 0.74 |
| Framework | Expo | SDK 55 |
| Language | TypeScript | 5.x |
| Routing | Expo Router | 3.x |
| Styling | RN StyleSheet | Native |
| Markdown | react-native-markdown-display | Latest |
| Storage | AsyncStorage | Latest |
| Web Deploy | Vercel | — |
| Native Build | EAS Build | — |

<br/>

---

## 📁 Project Structure

```
autonomous-soc-frontend/
│
├── 📱 app/                        # Expo Router file-based routes
│   ├── (tabs)/
│   │   ├── index.tsx              # Home / Scan history
│   │   ├── scan.tsx               # New scan input screen
│   │   └── settings.tsx           # Configuration screen
│   ├── results/
│   │   └── [id].tsx               # Dynamic results view
│   └── _layout.tsx                # Root layout & navigation
│
├── 🧩 components/
│   ├── ThreatReport.tsx           # AI report renderer
│   ├── SeverityBadge.tsx          # CVSS severity indicator
│   ├── ScanHistoryCard.tsx        # History list item
│   └── LoadingPulse.tsx           # Animated scan indicator
│
├── 🔗 services/
│   ├── api.ts                     # FastAPI client
│   └── cache.ts                   # AsyncStorage manager
│
├── 🎨 constants/
│   ├── Colors.ts                  # Design tokens
│   └── Threats.ts                 # Severity config
│
├── 📦 assets/                     # Fonts, icons, images
├── app.json                       # Expo configuration
└── package.json
```

<br/>

---

## 💻 Local Development

### Prerequisites

```
Node.js  ≥ 18.0    ──  Runtime
npm      ≥ 9.0     ──  Package manager
Expo CLI ≥ 7.0     ──  Development tooling
```

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/badyalavi/autonomous-soc-frontend.git
cd autonomous-soc-frontend
```

2. Install dependencies
```bash
# --legacy-peer-deps required for Markdown display engine compatibility
npm install --legacy-peer-deps
```

3. Configure environment
```bash
cp .env.example .env.local
# Set EXPO_PUBLIC_API_URL to your backend URL
```

4. Start the development server
```bash
npx expo start -c
```

5. Open on your device
```
Press  w  → Open in web browser
Press  a  → Open on Android emulator
Press  i  → Open on iOS simulator
Scan QR   → Open in Expo Go app
```

<br/>

---

## 📦 Build & Deploy

### Web (Vercel)
```bash
# Build for web
npx expo export -p web

# Deploy to Vercel
vercel --prod
```

### Android APK (EAS)
```bash
# Configure EAS
eas build:configure

# Build APK
eas build -p android --profile preview
```

### iOS (EAS)
```bash
eas build -p ios --profile preview
```

<br/>

---

## 🔌 Backend API Reference

The frontend communicates with the FastAPI backend via REST.

```
Base URL: https://your-backend.railway.app

POST  /scan          →  Trigger AI threat analysis
GET   /scan/{id}     →  Retrieve scan results
GET   /health        →  Backend health check
```

Scan Request
```json
{
  "target": "192.168.1.100",
  "scan_type": "ip" | "domain" | "hash",
  "deep_scan": true
}
```

Scan Response
```json
{
  "id": "scan_abc123",
  "severity": "HIGH",
  "cvss_score": 9.1,
  "report_markdown": "## Threat Analysis\n...",
  "iocs": ["192.168.1.100", "malware.exe"],
  "timestamp": "2025-05-31T12:00:00Z"
}
```

<br/>

---

## 🤝 Contributing

Contributions are welcome and appreciated.

```
1.  Fork the repository
2.  git checkout -b feature/your-feature-name
3.  Make your changes with clear, atomic commits
4.  git push origin feature/your-feature-name
5.  Open a Pull Request with a clear description
```

Please follow the existing code style and ensure all screens remain responsive across platforms before submitting.

<br/>

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

<br/>

---

<div align="center">

Built for the security analysts who don't have time to wait.

[![GitHub Stars](https://img.shields.io/github/stars/badyalavi/autonomous-soc-frontend?style=for-the-badge&color=F59E0B)](https://github.com/badyalavi/autonomous-soc-frontend/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/badyalavi/autonomous-soc-frontend?style=for-the-badge&color=3B82F6)](https://github.com/badyalavi/autonomous-soc-frontend/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/badyalavi/autonomous-soc-frontend?style=for-the-badge&color=EF4444)](https://github.com/badyalavi/autonomous-soc-frontend/issues)

<br/>

Autonomous SOC Frontend · MIT License · Made with ⚡

</div>
