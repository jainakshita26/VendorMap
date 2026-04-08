npm create vite@latest offline-vendor-frontend -- --template react
cd offline-vendor-frontend
npm install
npm install axios react-router-dom
```

---

### 1.2 — Create the full folder structure

After scaffolding, **delete** the default `src/` contents (keep `main.jsx` and `App.jsx` as empty shells), then create this exact structure:
```
src/
├── core/
│   ├── axios/
│   │   └── axiosInstance.js        ← Step 2
│   └── components/
│       └── ProtectedRoute.jsx      ← Step 4
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── auth.api.js
│   │   └── context/
│   │       └── AuthContext.jsx
│   │
│   ├── shop/
│   │   ├── pages/
│   │   │   ├── ShopListPage.jsx
│   │   │   └── ShopDetailPage.jsx
│   │   ├── components/
│   │   │   ├── ShopCard.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── hooks/
│   │   │   └── useShops.js
│   │   ├── services/
│   │   │   └── shop.api.js
│   │   └── context/
│   │       └── ShopContext.jsx
│   │
│   ├── product/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── product.api.js
│   │   └── context/
│   │
│   └── vendor/
│       ├── pages/
│       │   └── VendorDashboard.jsx
│       ├── components/
│       ├── hooks/
│       └── services/
│
└── routes/
    └── AppRoutes.jsx