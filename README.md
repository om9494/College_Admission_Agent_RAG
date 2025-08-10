# ARAMBH 99 Project

This repository contains four main components:

- **ARAMBH_99_FRONTEND**: Frontend web application (Vite + React)
- **ARAMBH_99_BACKEND**: Backend server (Node.js/Express)
- **ARAMBH_99_RAG_AI_MODEL**: Retrieval-Augmented Generation (RAG) AI Model (Python/FastAPI)
- **ARAMBH_99_WEB_SCRAPPER**: Web Scraper (Python)

---

## Project Structure

```
ARAMBH_99_FRONTEND/      # Frontend (React, Vite)
ARAMBH_99_BACKEND/       # Backend (Node.js, Express)
ARAMBH_99_RAG_AI_MODEL/  # RAG AI Model (Python, FastAPI)
ARAMBH_99_WEB_SCRAPPER/  # Web Scraper (Python)
```

---

## How to Run Each Component

### 1. Frontend

```sh
cd ARAMBH_99_FRONTEND
npm install
npm run dev
```

### 2. Backend

```sh
cd ARAMBH_99_BACKEND
npm install
npm start
```

### 3. RAG AI Model

#### Python Environment Setup
- Requires Python 3.11 or 3.10
- Create a virtual environment and install dependencies:

```sh
cd ARAMBH_99_RAG_AI_MODEL
python3.11 -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Linux/Mac
pip install -r requirements.txt
```

#### Run the RAG Model

```sh
uvicorn main:app --reload
```

### 4. Web Scraper

```sh
cd ARAMBH_99_WEB_SCRAPPER
python main.py
```

---

## Notes
- For the RAG AI Model, ensure you use Python 3.11 or 3.10.
- All components are independent; run each in a separate terminal.
- For any issues, check the respective README files or contact the project maintainers.

---

## Maintainers
- Kiran Nandi
- Om Panchal

---

## License
Specify your license here.
