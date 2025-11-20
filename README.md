Real Estate Chatbot
A simple AI-powered web application that predicts property prices and answers real-estate questions through a chatbot interface.

Features
Chatbot for real-estate queries
Price prediction using ML model
React frontend
Django/FastAPI backend

API for predictions & chatbot responses

Project Structure
backend/      → API + ML model
frontend/     → React UI
README.md

How to Run
Backend
cd backend
pip install -r requirements.txt
python manage.py runserver

Frontend
cd frontend
npm install
npm run dev

API (Examples)
POST /api/predict → Get price prediction
POST /api/chat → Get chatbot response

Tech Stack
React, Vite
Django REST / FastAPI
Scikit-Learn, Pandas
