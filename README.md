# Investment Portfolio Dashboard

A **Investment Portfolio Management System** built with **Vue 3, Vuex, Vue Router, TailwindCSS**, and **Vitest**.  
This project allows users to view portfolios, check detailed metrics and holdings, and edit portfolio data dynamically.  

---

## **Features**
- List portfolios and view details.
- Show portfolio metrics: **Current Value, Initial Investment, Total Return, Last Updated**.
- Dynamic holdings table with quantity, price, value, allocation, and day change.
- Back and Edit buttons with Vue Router navigation.
- Vuex store for managing editable portfolio data.
- Responsive UI with **TailwindCSS**.
- Fully tested using **Vitest**.


---
## **Project Structure**

```
src/
├── 📁 assets/
│   ├── 🖼️ banner.png
│   └── 🖼️ pattern.png
├── 📁 components/
│   ├── 📁 __tests__/
│   ├── 🔧 Badge.vue
│   ├── 🔧 Card.vue
│   ├── 🔧 CardContent.vue
│   ├── 🔧 GradientButton.vue
│   ├── 🔧 Navbar.vue
│   └── 🔧 PortfolioTabs.vue
├── 📁 data/
│   ├── 📄 mockHoldings.js
│   ├── 📄 PortfolioData.js
│   └── 📄 UserData.js
├── 📁 router/
│   └── 📄 index.js
├── 📁 store/
│   ├── 📁 modules/
│   └── 📄 index.js
├── 📁 views/
│   ├── 📁 Portfolio/
│   │   ├── 🔧 PortfolioDetail.vue
│   │   ├── 🔧 PortfolioForm.vue
│   │   └── 🔧 PortfolioList.vue
│   ├── 📁 users/
│   │   ├── 🔧 UserForm.vue
│   │   └── 🔧 UserList.vue
│   ├── 🔧 Dashboard.vue
│   └── 🔧 App.vue
```

---

## **Getting Started**

### **Clone the Repository**
```bash
git clone https://github.com/sarthakkurothe/mini_project_vue.js.git
cd mini_project_vue.js-main
```

### **Install Dependencies**
```bash
npm install
```

### **Running the Project Locally**
```bash
npm run dev
```
Open your browser at http://localhost:5173/ to view the dashboard.

---

## **Testing**

Run all tests with:
```bash
npm run test
```

Watch mode for development:
```bash
npm run test:watch
```

UI mode for test visualization:
```bash
npm run test:ui
```

### **Test Coverage**
Test coverage includes:
- Rendering "Portfolio Not Found" page
- Rendering portfolio details and holdings
- Navigation with Back button
- Commit to Vuex store and navigation on Edit button click

---

## **Usage**

1. Navigate to `/portfolios` to see the list of portfolios
2. Click a portfolio to view detailed metrics and holdings
3. Use the **Back** button to return to the portfolio list
4. Use the **Edit Portfolio** button to commit data to Vuex store and navigate to the edit page

---

## **Features**

- 📊 Portfolio overview and detailed metrics
- 💼 Holdings management and tracking
- 🔄 State management with Vuex
- 🧪 Comprehensive test suite
- 📱 Responsive design with TailwindCSS
- 🎨 Modern UI with Lucide Icons
