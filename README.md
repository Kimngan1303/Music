# 🎵 Aura Music - Fullstack Music Streaming Web App (React + Express + MongoDB)

Ứng dụng nghe nhạc hiện đại chuẩn **Fullstack** được cấu trúc đầy đủ thành 2 phần **Frontend (`client/`)** và **Backend (`server/`)**.

---

## ⚡ Hướng Dẫn Khởi Chạy Nhanh (NPM Commands)

### 1. Cài đặt toàn bộ thư viện (NPM Install):
Tại thư mục gốc `c:\Users\Admin\Music\Web\Music`:
```bash
npm run install:all
```
Hoặc cài thủ công từng thư mục:
```bash
cd server && npm install
cd ../client && npm install
```

---

### 2. Khởi chạy toàn bộ ứng dụng (NPM Run Dev):
Chạy song song cả Backend Server (Express + MongoDB) và Frontend Server (React + Vite):
```bash
npm run dev
```
- **Client (React + Vite + Tailwind)**: `http://localhost:3000`
- **Server (Express + MongoDB)**: `http://localhost:5000`

---

## 🍃 Cấu hình MongoDB

Thư mục `server/.env` đã được cài đặt mặc định:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/auramusic
JWT_SECRET=aura_music_secret_jwt_key_2026
```

1. **Nếu bạn có MongoDB cài ở máy**:
   Chạy MongoDB service tại địa chỉ `mongodb://127.0.0.1:27017`. Backend sẽ tự động kết nối DB `auramusic`.

2. **Nếu bạn dùng MongoDB Atlas (Cloud)**:
   Thay đổi chuỗi `MONGODB_URI` trong file `server/.env` bằng connection string của bạn:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auramusic
   ```

---

## 🛠️ Cấu trúc Thư mục Dự án

```
c:\Users\Admin\Music\Web\Music\
├── package.json               # Monorepo Scripts (npm run dev, npm run install:all)
├── client/                    # FRONT-END (React + Vite + Tailwind CSS + Lucide Icons)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # Main React UI Component
│       └── index.css          # Tailwind CSS + Dynamic Variables
└── server/                    # BACK-END (Node.js + Express + MongoDB Mongoose)
    ├── package.json
    ├── server.js              # Express Entrypoint
    ├── .env                   # MongoDB URI & JWT Secret
    ├── config/
    │   └── db.js              # MongoDB Mongoose Connection
    ├── middleware/
    │   └── authMiddleware.js  # JWT Auth Guard
    ├── models/                # MongoDB Models
    │   ├── User.js
    │   ├── Music.js
    │   ├── Playlist.js
    │   ├── Favorite.js
    │   └── RecentlyPlayed.js
    ├── controllers/
    │   ├── authController.js
    │   └── musicController.js
    └── routes/
        ├── authRoutes.js
        └── musicRoutes.js
```
