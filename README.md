# 🍽️ Food Recipe App

A full-stack web application that helps users explore recipes from different cuisines, discover cooking instructions, save favorite dishes, and submit their own recipes.

## ✨ Features

- **60+ Recipes:** Explore a variety of dishes from different cuisines.
- **Multiple Cuisines:** South Indian, North Indian, and Chinese recipes.
- **Search Recipes:** Find dishes by name.
- **Category Filtering:** Browse recipes by cuisine and category.
- **Recipe Details:** View ingredients, cooking instructions, preparation time, and ratings.
- **Favorites:** Save favorite recipes for quick access.
- **User Authentication:** Register and log in to an account.
- **Recipe Submission:** Users can submit recipes for review.
- **Admin Dashboard:** Manage recipes and review user submissions.

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

## 📁 Project Structure

```text
foodrecipeapp/
├── backend/
│   ├── auth/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── createAdmin.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 How to Run the Project

### Prerequisites
- Node.js and npm
- MongoDB Community Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mohitreddy018/foodrecipeapp_2500069007.git
cd foodrecipeapp_2500069007
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure your local MongoDB connection, port, JWT secret, and admin credentials.

Example MongoDB connection:

```env
MONGO_URI=mongodb://127.0.0.1:27017/food_recipe_app
PORT=5000
JWT_SECRET=your_random_secret
```

Add your own admin configuration if required by the project.

### 3. Start the Backend

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 4. Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## 🔐 Security

- Environment variables and passwords should not be committed to GitHub.
- Keep `.env` files private.
- Use strong secrets for authentication.

## 🎯 Project Objective

The objective of this project is to develop a user-friendly recipe platform using full-stack web development technologies, allowing users to discover dishes, view cooking instructions, save favorites, and contribute recipes.

## 👨‍💻 Developed By

**Food Recipe App Project Team**

## 📄 License

This project was developed for educational purposes.
