# NeoCalc • Modern Precision React Calculator

NeoCalc is a sleek, responsive, and feature-rich Calculator web application built with **React**, **Vite**, and pure **CSS** tokens. It features dynamic font auto-scaling, chained operation evaluations, full keyboard navigation, calculation history with memory recall, and light/dark theme support.

---

## ✨ Features

- **Core Operations**: Addition (`+`), subtraction (`−`), multiplication (`×`), division (`÷`).
- **Chained Calculations**: Supports immediate execution chains such as `5 + 3 × 2 = 16`.
- **Precision Floating Point Arithmetic**: Prevents common binary floating-point glitches (e.g. `0.1 + 0.2 = 0.3`).
- **Edge Case Protection**: Safe division by zero detection (`Cannot divide by 0`), multiple decimal blocking, and leading zero handling.
- **Copy to Clipboard**: Quick copy button in the display with animated feedback badge.
- **Calculation History**: Collapsible side drawer with timestamped calculations and one-click recall into the active calculation.
- **Themes**: Seamless light and dark mode with persistent user preference in `localStorage`.
- **Keyboard Navigation**:
  - `0` – `9` & `.`: Digits and Decimal point
  - `+`, `-`, `*`, `/`: Arithmetic operators
  - `Enter` or `=`: Equals
  - `Backspace`: Delete last digit
  - `Escape`: Clear (`C`) / All Clear (`AC`)
  - `%`: Percentage

---

## 🛠️ Project Structure

```text
src/
├── components/
│   ├── Calculator.jsx    # Main state container & keyboard listener
│   ├── Display.jsx       # Expression preview & auto-scaling result display
│   ├── ButtonPanel.jsx   # 4x5 button grid layout
│   ├── Button.jsx        # Tactile reusable button component
│   ├── HistoryPanel.jsx  # Calculation history drawer
│   └── ThemeToggle.jsx   # Dark / Light theme switcher
├── utils/
│   └── calculator.js     # Arithmetic calculations, precision, and number formatting
├── App.jsx               # Application root
├── App.css               # Calculator design system & animations
├── index.css             # Theme variables & CSS reset
└── main.jsx              # React DOM entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. Clone or open the repository:
   ```bash
   cd Calculater
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
