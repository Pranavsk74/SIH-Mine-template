# MINE SENSE — AI-Powered Mine Safety & Rescue Rover

MINE SENSE is an AI-powered mine safety and rescue rover web application designed for hazardous underground mining environments. It combines real-time environmental gas telemetry, multispectral computer vision (RGB, IR, FLIR Thermal LWIR), multimodal feature fusion risk analysis, subterranean worker localization, and autonomous mission command with automated report generation.

---

## Features

- **Environmental Sensor Monitoring**: Real-time sampling and SVG sparkline visualization for CH4 Methane, CO Toxic Gas, Temperature, Humidity, and Seismic Vibration.
- **Multispectral Perception Vision**: Optical daylight RGB, 850nm IR Night Vision, and FLIR Thermal LWIR body-heat perception with live YOLO object/worker bounding box detection.
- **Multimodal Feature Fusion**: Combines LSTM temporal gas embeddings and YOLO visual feature vectors into an MLP neural risk classifier.
- **Subterranean Worker Locator**: Dynamic underground mine schematic mapping trapped personnel and displaying calculated rescue routes.
- **First Responder Rover Specs**: Technical specifications grid for the explosion-proof tracked autonomous rover.
- **Mission Control Dashboard**: Command telemetry interface with live state management (`START MISSION`, `PAUSE`, `RETURN TO BASE`).
- **Incident Intelligence Report Generation**: Formal PDF report creation with server-side ReportLab document compilation and in-site preview.
- **Demo / Fallback Mode**: Works 100% offline using simulated demo telemetry if the backend server is disconnected or unavailable.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, CSS Modules / Vanilla CSS system
- **Icons**: Lucide React
- **Backend**: Python 3.10+, FastAPI, Uvicorn, ReportLab (PDF Engine)
- **AI Architecture Models**: LSTM (Temporal Sensor Net), YOLO v8 (Visual Perception), Feature Fusion, MLP (Risk Classifier)

---

## Project Structure

```
Mine SIH new/
├── frontend/
│   ├── src/
│   │   ├── assets/           # Extracted PPT mining assets (cart #1, truck, ore, rover)
│   │   ├── components/       # Navigation, Footer, ReportModal
│   │   ├── sections/         # Hero, Problem, System, Sensors, Vision, Intelligence, Locator, Rover, MissionControl
│   │   ├── services/         # API service layer with automatic fallback
│   │   ├── data/             # Demo dataset fallbackData.ts
│   │   ├── hooks/            # useIntersectionObserver
│   │   ├── styles/           # index.css stylesheet
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── vercel.json           # Frontend SPA rewrite configuration
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point & CORS
│   │   ├── routes/           # sensors, vision, workers, mission, risk, reports
│   │   └── data/             # Mock JSON telemetry datasets
│   └── requirements.txt
├── vercel.json               # Mono-repo top-level Vercel configuration
├── .env.example
├── .gitignore
└── README.md
```

---

## Local Development

### 1. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

### 2. Backend Development (Optional)

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

The REST API will be running at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

---

## Environment Variables

| Variable Name | Description | Default Value |
|---|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend server | `http://localhost:8000` |

Create a `.env` file in the `frontend/` directory (or set it in your Vercel Dashboard):

```env
VITE_API_URL=https://your-backend-api-url.onrender.com
```

*Note: If `VITE_API_URL` is omitted or disconnected, the frontend automatically activates **Demo Fallback Mode**.*

---

## Deploying to Vercel

1. Push your repository to **GitHub**.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend` (or leave as root; top-level `vercel.json` will build automatically).
5. In **Build and Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. (Optional) Add environment variable: `VITE_API_URL` pointing to your deployed backend.
7. Click **Deploy**.

---

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: MINE SENSE full-stack project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mine-sense.git
git push -u origin main
```

---

## Backend Deployment (FastAPI)

The Python FastAPI backend can be deployed independently to platforms like **Render**, **Railway**, or **Fly.io**:

1. Deploy the `backend/` directory with Python 3.10+.
2. Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Copy the live API URL (e.g. `https://mine-sense-backend.onrender.com`) and set it as `VITE_API_URL` in your Vercel project environment variables.

---

## Demo & Fallback Mode

If the backend server is offline or unreachable, MINE SENSE instantly switches to local simulated demo data in `frontend/src/data/fallbackData.ts`. All interactive features—including sensor switching, computer vision perception, deep learning risk simulation, worker location routes, mission state control, and in-site report previews—remain fully operational.

---

## Project Limitations & Disclaimer

This project is a high-fidelity hackathon demo prototype. Simulated telemetry and precomputed model inferences are used for browser visualization. Report generation disclaimers clearly label generated PDF reports as simulated data documents.
