# FruitFreshTracker

FruitFreshTracker is a modern, full-stack web application for tracking, selling, and managing fresh organic produce. Built with TypeScript, React, Express, and PostgreSQL, it provides a beautiful, responsive, and feature-rich experience for both customers and administrators.

![Hero Screenshot](client/src/assets/hero-screenshot.png)

---

## 🚀 Features
- ✨ Beautiful hero section and modern UI
- 🥦 Product catalog with organic produce
- 🛒 Shopping cart and secure checkout
- 🧑‍💼 Admin dashboard for managing products, orders, and users
- 🔒 User authentication (register/login)
- ⭐ Customer testimonials and newsletter subscription
- 📱 Responsive design for all devices
- 🌱 Built with sustainability and local farmers in mind

---

## 📸 Screenshots
> Add your screenshots in `client/src/assets/` and update the image links below.

| Home Page | Product Details | Admin Dashboard |
|---|---|---|
| ![](client/src/assets/home.png) | ![](client/src/assets/product.png) | ![](client/src/assets/admin.png) |

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) database (e.g. [Neon](https://neon.tech/))

### Installation
```sh
# Clone the repository
git clone https://github.com/Sharazsony/FryitFreshWeb.git
cd FryitFreshWeb

# Install dependencies
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env` and fill in your database credentials:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
   ```
2. (Optional) Adjust other environment variables as needed.

### Database Migration
```sh
npm run db:push
```

### Running the App
```sh
npm run dev
```
- The backend runs on [http://localhost:5000](http://localhost:5000)
- The frontend runs on [http://localhost:5173](http://localhost:5173)

---

## 🧩 Project Structure
```
FruitFreshTracker/
├── client/           # Frontend React app
├── server/           # Express backend
├── shared/           # Shared types/schema
├── attached_assets/  # Static assets
├── drizzle.config.ts # Drizzle ORM config
├── README.md         # This file
└── ...
```

---

## 🧑‍💻 Contributing
We welcome contributions from the community! To get started:
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please open an issue first to discuss major changes.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact
For questions, suggestions, or support, contact:
**Sharaz Sony**  
[sharazsony@gmail.com](mailto:sharazsony@gmail.com)

---

> FruitFreshTracker — Bringing fresh, organic produce to your door, and empowering local farmers!
