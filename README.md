# E-Commerce AI-Powered Product Search & Analysis Platform

A modern, AI-enhanced e-commerce platform backend and frontend designed to provide advanced product search, AI generated product description generating, voice-based search, sentiment analysis, semantic search, and AI-driven query refinement. Built with FastAPI, React, and Vite, leveraging state-of-the-art AI models and tools including Hugging Face, Google Speech-to-Text, and Gemini for a seamless, intelligent shopping experience.

---

# Testing
- Deployed to AWS, live at https://kumulala.xyz
- Login at https://kumulala.xyz/login with admin account given below so you can access all endpoints
- e-mail: 1@example.com
- password: 1 

# Top 3 Endpoints
## /text_search
- Understands and refines user queries using Gemini 2.5 Pro for searching products and does semantic search using word embeddings.
## /voice_search
- Uses Google's Speech-To-Text model to write the audio transcript then sends it to /text_search
## /products/{product_id}/ai_analysis
- Analyzes specific product's comments using sentiment analysis, summarizes good and bad aspects of the product according to commments.
- Recommend https://kumulala.xyz/products/2/ai_analysis since it has dummy comments.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Setup & Installation](#setup--installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [AI Components](#ai-components)  
- [Security & Authentication](#security--authentication)  
- [Database & Migrations](#database--migrations)  
- [Deployment with Docker](#deployment-with-docker)  
- [Future Improvements](#future-improvements)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Project Overview

This project provides an AI-powered e-commerce product search platform combining traditional product catalog management with next-generation AI capabilities:

- **AI sentiment analysis** on product comments to gauge customer opinions.
- **Voice search** powered by Google Speech-to-Text for hands-free product queries.
- **Semantic product search** using embeddings for highly relevant results.
- **Query refinement** with Google Gemini to enhance user search input.
- Robust backend API built with **FastAPI** and a reactive frontend with **React** + **Vite** and **TypeScript**.
- Full authentication system with **OAuth2** and **JWT**.
- Managed database with **SQLAlchemy**, **PostgreSQL**, and version-controlled migrations via **Alembic**.
- Containerized deployment using **Docker** for easy scalability.

---

## Features

- **Product Catalog:** Browse and search products with rich metadata including category, price, ratings, and more.
- **Comments & Reviews:** Users can leave comments on products; comments undergo AI sentiment analysis.
- **Voice-Based Search:** Use microphone input for searching products via speech.
- **Semantic Search:** Leveraging vector embeddings to find products semantically close to the user query.
- **Query Refinement:** AI-enhanced search queries refined via Google Gemini for better accuracy.
- **User Authentication:** Secure login/signup using OAuth2 and JWT tokens.
- **Database Migrations:** Schema changes managed cleanly with Alembic.
- **Dockerized:** Full environment containerized for development and production ease.

---

## Tech Stack

| Layer                | Technology                      |
|----------------------|--------------------------------|
| Backend Framework    | FastAPI                        |
| Frontend Framework   | React, Vite, TypeScript        |
| AI Models & APIs     | Hugging Face Transformers (sentiment analysis), Google Speech-to-Text, Google Gemini (query refinement, comment summarizing) |
| Search & Embeddings  | Vector embeddings (e.g., Hugging Face, pgvector/PostgreSQL) |
| Authentication       | OAuth2, JWT                    |
| ORM & DB             | SQLAlchemy, PostgreSQL          |
| Database Migrations  | Alembic                       |
| Containerization     | Docker                        |
| Deployment           | AWS EC2, AWS RDS, Docker Compose |

---

## Architecture

Frontend (React + Vite) <---> Backend (FastAPI + AI Services) <---> PostgreSQL + Vector DB
| |
Voice Search (Google STT) AI Analysis & Query Refinement (Hugging Face, Gemini)


- Frontend communicates with backend via RESTful APIs.
- Backend processes voice input, converts it using Google Speech-to-Text.
- AI modules perform sentiment analysis on comments and semantic search on products.
- PostgreSQL stores product, user, and comment data; supports vector search for semantic queries.
- JWT-secured endpoints handle authentication and authorization.

---

## Setup & Installation

### Prerequisites

- Docker & Docker Compose  
- Python 3.10+  
- Node.js & npm/yarn  
- PostgreSQL (if running locally)  

### Backend Setup

- git clone <repo-url>
- cd backend
- python -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt

# Add .env to add your secrets, Google credentials, DB connection, JWT secret, etc.
- SECRET_API_KEY=
- ALGORITHM=
- ACCESS_TOKEN_EXPIRE_MINUTES=
- DATABASE_URL=
- GEMINI_API_KEY=
- GOOGLE_APPLICATION_CREDENTIALS=
- POSTGRES_DB=
- POSTGRES_USER=
- POSTGRES_PASSWORD=
- POSTGRES_HOST=
- POSTGRES_PORT=

# Run Alembic migrations
- alembic upgrade head

# Start backend server
- uvicorn app.main:app --reload
- or
- fastapi dev app/main.py

- http://localhost:8000/docs for Swagger UI Document

# Frontend Setup
- cd frontend
- npm install
- npm run dev

***

## API Endpoints

### Authentication
- `POST /login/` - Authenticates a user and returns an access token.

### Account
- `GET /me/` - Retrieves the profile information of the currently authenticated user.
- `PUT /me/` - Updates the profile information of the currently authenticated user.
- `DELETE /me/` - Deletes the account of the currently authenticated user.

### Users
- `POST /users/` - Creates a new user account.
- `GET /users/` - Retrieves a paginated list of all users. Supports search and filtering by role.
- `GET /users/{user_id}` - Retrieves the details of a specific user by their ID.
- `PUT /users/{user_id}` - Updates the details of a specific user.
- `DELETE /users/{user_id}` - Deletes a specific user account.

### Products
- `GET /products/` - Retrieves a paginated list of all products. Supports search.
- `POST /products/` - Creates a new product. Optional 'description' if empty it will be AI generated.
- `POST /products/text_search` - Performs a text-based search for products.
- `POST /products/voice_search` - Performs a voice-based search for products using an audio file.
- `GET /products/{product_id}` - Retrieves a specific product by its ID.
- `PUT /products/{product_id}` - Updates a specific product's details.
- `DELETE /products/{product_id}` - Deletes a specific product.
- `GET /products/{product_id}/ai_analysis` - Gets an AI-powered analysis and summary of a product's comments.

### Product Comments
- `GET /products/{product_id}/comments` - Retrieves all comments for a specific product.
- `POST /products/{product_id}/comments` - Adds a new comment to a specific product.
- `GET /products/{product_id}/comments/{comment_id}` - Retrieves a single comment by its ID.
- `PUT /products/{product_id}/comments/{comment_id}` - Updates a specific comment.
- `DELETE /products/{product_id}/comments/{comment_id}` - Deletes a specific comment.

### Categories
- `GET /categories/` - Retrieves a paginated list of all categories. Supports search.
- `POST /categories/` - Creates a new product category.
- `GET /categories/{category_id}` - Retrieves a specific category by its ID.
- `PUT /categories/{category_id}` - Updates a specific category.
- `DELETE /categories/{category_id}` - Deletes a specific category.

### Carts
- `GET /carts/` - Retrieves a paginated list of carts.
- `POST /carts/` - Creates a new shopping cart.
- `GET /carts/{cart_id}` - Retrieves a specific cart by its ID.
- `PUT /carts/{cart_id}` - Updates the items within a specific cart.
- `DELETE /carts/{cart_id}` - Deletes a specific cart.

# AI Components
- Sentiment Analysis
- Uses Hugging Face pretrained transformers to analyze the sentiment of product comments and provide positive/negative/neutral tags.

# Voice Search
- Accepts audio in webm format from the frontend, converts to WAV using FFmpeg, then transcribes using Google Speech-to-Text API.

# Semantic Search
- Transforms user queries into embeddings via Hugging Face models and searches product vectors in PostgreSQL using the pgvector extension.

# Query Refinement
- Uses Google Gemini API to reformulate and clarify user search queries for better search relevance.

# Security & Authentication
- OAuth2 password flow combined with JWT tokens secures API endpoints.

- Passwords hashed securely with bcrypt.

- Token expiration and refresh mechanisms implemented.

- CORS configured for frontend-backend communication.

# Database & Migrations
- PostgreSQL used for relational data storage.

- SQLAlchemy ORM maps models for users, products, comments, etc.

- Alembic manages schema migrations.

- Vector data stored and indexed for fast semantic search.

# Deployment with Docker
- Backend and frontend both containerized using Docker.
- Compose file (optional) orchestrates multi-container setup.
- Environment variables injected via .env files.

- Instructions to build and run containers:

- docker-compose build
- docker-compose up -d

# Future Improvements
- Add advanced caching with Redis to improve response times.

- Implement real-time notifications and chat support.

- Integrate more AI models for recommendations and personalization.

- Add support for multiple languages in voice and text processing.

- Automate CI/CD pipelines.

# License
- This project is licensed under the MIT License. See the LICENSE file for details.

# Contact
- Created and maintained by Enis Furkan Kırmızı
- Email: enisfurkankirmizi@gmail.com
- GitHub: github.com/efkirmizi
