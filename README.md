# 🗺️ VendorMap — Location-Based Offline Vendor Marketplace

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-GeoJSON-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-Academic-yellow?style=for-the-badge" />
</p>

> **VendorMap** bridges the gap between local offline vendors and nearby customers. Vendors list their physical shops and product catalogues digitally; customers discover them in real time based on GPS location — no online transactions, no delivery, just meaningful local connections.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Design](#-database-design)
- [Smart Radius Algorithm](#-smart-radius-expansion-algorithm)
- [Future Scope](#-future-scope)
- [Authors](#-authors)

---

## 🌟 Overview

VendorMap is a full-stack, location-aware web application designed to digitally empower small offline vendors in Tier 2 and Tier 3 Indian cities. The platform lets vendors create shop profiles and product catalogues while customers discover nearby shops using GPS-based proximity search.

**Key idea:** Unlike e-commerce platforms, VendorMap does **not** handle payments or delivery. It acts as a smart local directory — customers find shops and visit them physically.

---

## ✨ Features

### 👤 For Customers
- 📍 **GPS-based shop discovery** with automatic radius expansion (5 km → 20 km → 50 km → all)
- 🕐 **Open/Closed badges** with live status based on shop operating hours
- 🔍 **Real-time product search** across all nearby shops with 500ms debounce
- ❤️ **Favourite shops** with a dedicated Favourites page
- ⭐ **Ratings & reviews** (1–5 stars, one per user per shop)
- 📦 **Product detail modal** with full description, price, unit, and discount info
- 📞 **Click-to-call** and **WhatsApp** direct contact buttons

### 🏪 For Vendors
- 🏬 **Shop management** — create and update shop with banner image, description, phone, category
- 🕒 **Operating hours** — configure open/close times per day of the week
- 🔒 **Temporary closure toggle** — mark shop closed for the day without editing weekly hours
- 📦 **Product management** — add/edit/delete products with images, units, and pricing
- 💸 **Discount pricing** — set sale prices with auto-calculated % OFF badges
- ✅ **Availability toggle** — mark items as out of stock without deleting
- 🤖 **AI description generator** — one-click product descriptions via Mistral AI
- 📊 **Analytics dashboard** — total views, 7-day line chart, peak-hour bar chart (Recharts)

### 🔐 Security
- JWT stored in **HTTP-only cookies** (XSS-resistant)
- Role-based access control (Customer / Vendor)
- bcrypt password hashing
- Input validation with express-validator
- Vendor self-review prevention
- Shop-owner middleware on all mutating vendor routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, React Router DOM v6, Axios, Recharts |
| **Backend** | Node.js v18+, Express.js, Mongoose ODM |
| **Database** | MongoDB Atlas (GeoJSON + 2dsphere index) |
| **Auth** | JWT (HTTP-only cookies), bcrypt |
| **Media** | Cloudinary + multer-storage-cloudinary |
| **AI** | Mistral AI API (product description generation) |
| **Geocoding** | OpenStreetMap Nominatim (GPS fallback) |
| **State Management** | React Context API + Custom Hooks |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│         React (Vite) + Tailwind CSS + Recharts              │
│         Axios (withCredentials) + React Router DOM          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Requests (Axios)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│              Node.js + Express REST API                     │
│         JWT Auth Middleware · RBAC · Multer                 │
└─────┬──────────────┬──────────────┬───────────────────┬─────┘
      │              │              │                   │
      ▼              ▼              ▼                   ▼
┌──────────┐  ┌───────────┐  ┌──────────┐   ┌──────────────────┐
│ MongoDB  │  │ Cloudinary│  │ Mistral  │   │  OpenStreetMap   │
│  Atlas   │  │   (CDN)   │  │  AI API  │   │  Nominatim API   │
│ GeoJSON  │  │  Images   │  │  Desc.   │   │  (Geocoding)     │
└──────────┘  └───────────┘  └──────────┘   └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB v6+)
- Cloudinary account (free tier works)
- Mistral AI API key
- npm or yarn

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/vendormap.git
cd vendormap/backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in your values — see the Environment Variables section below

# 4. Start the server
node server.js

# or with hot reload (requires nodemon):
npm run dev
```

Backend runs at: `http://localhost:3000`

### Frontend Setup

```bash
cd vendormap/offline-vendor-frontend

# Install dependencies
npm install

# Make sure axiosInstance.js has the correct backend URL:
# baseURL: 'http://localhost:3000/api'

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

> ⚠️ Ensure MongoDB is running and accessible before starting the backend.

---

## 🔑 Environment Variables

Create a `.env` file inside the `/backend` directory:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/localVendorDB

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user, set JWT cookie |
| POST | `/api/auth/login` | Public | Login, set JWT cookie |
| GET | `/api/auth/get-me` | Public | Restore session from cookie |
| GET | `/api/auth/logout` | Public | Clear JWT cookie |

### Shops

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/shops` | Public | Get all shops |
| GET | `/api/shops/nearby` | Public | Geospatial proximity search |
| GET | `/api/shops/my-shop` | Vendor | Get own shop |
| GET | `/api/shops/:id` | Public | Get shop by ID (records ShopView) |
| POST | `/api/shops/create` | Vendor | Create shop with Cloudinary image |
| PUT | `/api/shops/update` | Vendor | Update shop image/description/phone |
| PUT | `/api/shops/hours` | Vendor | Update operating hours |
| PUT | `/api/shops/closure` | Vendor | Toggle temporary closure |
| GET | `/api/shops/:id/analytics` | Vendor | View analytics data |
| POST | `/api/shops/:id/favourites` | Customer | Toggle favourite |
| GET | `/api/shops/:id/reviews` | Public | Get shop reviews |
| POST | `/api/shops/:id/reviews` | Customer | Submit/update review |

### Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products/search` | Public | Full-text product search |
| GET | `/api/shops/:shopId/products` | Public | Get products by shop |
| POST | `/api/add/:shopId/products` | Vendor | Add product with Cloudinary image |
| PUT | `/api/products/:productId` | Vendor | Update product |
| DELETE | `/api/products/:productId` | Vendor | Delete product |
| POST | `/api/products/generate-description` | Vendor | AI description via Mistral AI |

---

## 🗄️ Database Design

The database (`localVendorDB`) contains five MongoDB collections:

```
users       →  name, email, password (bcrypt), role, location (GeoJSON), favourites[]
shops       →  shopName, owner (ref), location (GeoJSON + 2dsphere index), hours[], temporarilyClosed
products    →  name, price, discountPrice, unit, image (Cloudinary URL), shop (ref), available
reviews     →  rating (1–5), comment, shop (ref), user (ref)  [unique compound index on {shop, user}]
shopviews   →  viewedAt, hour (0–23), dayOfWeek (0–6), shop (ref)
```

> The `2dsphere` index on `shops.location` powers all geospatial proximity queries via MongoDB's `$nearSphere` operator.

---

## 📐 Smart Radius Expansion Algorithm

VendorMap uses a progressive fallback strategy so users always get relevant results:

```
User opens /shops
       │
       ▼
GPS permission granted?
   │              │
  YES             NO ──────────────────→ Show ALL shops
   │
   ▼
Search within 5 km ──→ Results found? ──→ Show results ✅
   │ No
   ▼
Search within 20 km ─→ Results found? ──→ Show results ✅
   │ No
   ▼
Search within 50 km ─→ Results found? ──→ Show results ✅
   │ No
   ▼
Show ALL shops (final fallback) ✅
```

Client-side distances are computed using the **Haversine formula**.

---

## 🔮 Future Scope

- **ML Trend Prediction** — Python FastAPI + Facebook Prophet for seasonal demand forecasting (e.g., stationery before exams, sweets before Diwali)
- **AI Shop Assistant Chatbot** — LLM-powered Q&A embedded on each shop's detail page
- **Multi-Language Support** — Hindi and regional languages via i18next
- **Progressive Web App (PWA)** — Offline browsing, push notifications, home screen install
- **Real-Time Inventory Alerts** — Notify customers when a favourited shop restocks an item
- **Interactive Map View** — Leaflet.js / Mapbox geographic map with shop pins

---

## 👩‍💻 Authors

| Name | Enrollment No. |
|------|----------------|
| Akshita Jain | EN23CS301109 |
| Soumya Yadav | EN23CS303023 |

B.Tech VI Semester — Computer Science & Engineering
Faculty of Engineering, **MediCaps University, Indore** · JAN–JUNE 2026

**Guided by:** Prof. Digendra Singh Rathore & Prof. Ashish Shrivastava

---

## 📄 License

This project was developed as a Minor Project for the Bachelor of Technology (CSE) degree at MediCaps University and is intended for academic purposes.

---

<p align="center">Made with ❤️ for local vendors across India</p>
