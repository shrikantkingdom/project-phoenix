# Project Phoenix - Test Automation Framework

A production-ready Playwright automation framework with API & UI testing, self-healing selectors, and CI/CD integration.

---

## ⚡ Quick Setup (3 Minutes)

### One Command
```bash
git clone https://github.com/shrikantkingdom/project-phoenix.git && cd project-phoenix && npm install && npx playwright install && npm test
```

---

## 🚀 Step-by-Step Setup

### Step 1: Verify & Install Node.js (18+)

**Check if installed:**

| macOS/Linux | Windows |
|-------------|---------|
| `node --version && npm --version` | `node --version; npm --version` |

**If not installed:**

| macOS | Windows |
|-------|---------|
| `brew install node` | Download: https://nodejs.org |
| | Or: `choco install nodejs` |
| | Or: `winget install OpenJS.NodeJS` |

---

### Step 2: Clone Repository

```bash
git clone https://github.com/shrikantkingdom/project-phoenix.git
cd project-phoenix
```

---

### Step 3: Install Dependencies

```bash
npm install
npx playwright install
```

✅ Expected: ChromiumFirefox + WebKit installed

---

### Step 4: Run Tests

```bash
npm test
```

✅ **Result:** 33 tests pass (15 API + 18 UI) in ~5 minutes

---

## 🧪 Test Commands

| Command | What it does | Time |
|---------|-------------|------|
| `npm test` | All tests (API + UI) | 5 min |
| `npm run test:api` | API tests only | 2 min |
| `npm run test:ui` | UI tests only | 3 min |
| `npm run test:ui-headed` | Watch tests in browser | 3 min |
| `npm run test:debug` | Debug mode (Inspector) | - |
| `npm run report` | View HTML test report | - |

---

## 📊 View Test Results

```bash
# HTML report with screenshots
npm run report

# View logs (macOS/Linux)
cat logs/combined.log

# View logs (Windows)
type logs\combined.log
```

---

## ⚙️ Configuration

Edit `.env` file:

```env
BASE_URL=https://the-internet.herokuapp.com
TEST_USERNAME=tomsmith
TEST_PASSWORD=SuperSecretPassword!
DEFAULT_TIMEOUT=5000
NAVIGATION_TIMEOUT=30000
LOG_LEVEL=info
```

---

## 🏗️ Project Structure

```
├── config/          # Browser lifecycle & setup
├── constants/       # URLs, timeouts, credentials
├── errors/          # Custom error classes
├── pages/           # Page Object Model
├── utils/           # Logger, helpers, API client
├── tests/           # API & UI test files
├── logs/            # Generated logs
├── reports/         # Generated test reports
└── .env             # Environment variables
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | `npm cache clean --force && npm install` |
| Playwright fails | `npx playwright install --with-deps` |
| Tests timeout | Increase `DEFAULT_TIMEOUT=10000` in `.env` |
| Selector errors | Add fallback selectors in `pages/LoginPage.js` |
| Port in use (Windows) | `netstat -ano \| findstr :3000` = find PID, then `taskkill /PID <PID> /F` |

---

## ✨ Key Features

✅ Page Object Model  
✅ **Self-Healing Selectors** (see [SELF_HEALING_DEMO.md](SELF_HEALING_DEMO.md))  
✅ Shift-Left Testing (API first)  
✅ Multi-Browser (Chrome, Firefox, Safari)  
✅ Comprehensive Logging  
✅ GitHub Actions CI/CD  
✅ Custom Error Handling  
✅ Performance Tracking

---

## 📞 Quick Help

```bash
# Step-by-step debugging
npm run test:debug

# View visual test report
npm run report

# Check detailed logs
cat logs/combined.log
```

**Docs:** https://playwright.dev  
**License:** MIT


