from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analyze

# Create FastAPI app
app = FastAPI(
    title="InvoiceIQ Backend API",
    description="AI-powered invoice processing system (Stateless MVP)",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:5173",
    "https://invoice-iq-sd73.vercel.app",
    "https://invoice-iq-sd73-2rj8cjwiz-kishores-projects-6fd240ae.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# ROOT
# =========================================
@app.get("/")
async def root():
    return {
        "status": "Backend Running",
        "service": "InvoiceIQ Backend API",
        "version": "1.0.0",
        "mode": "Stateless"
    }

# =========================================
# HEALTH CHECK
# =========================================
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "disconnected_stateless_mode"
    }

# =========================================
# HISTORY API (MOCK)
# =========================================
@app.get("/api/history")
@app.get("/history")
async def get_history():
    """
    Mocked history endpoint.
    Since we removed the database to fix deployment crashes, 
    this simply returns an empty list to prevent the frontend from throwing errors.
    """
    return {
        "status": "success",
        "count": 0,
        "data": []
    }

# =========================================
# INCLUDE ROUTERS
# =========================================
app.include_router(analyze.router)


# =========================================
# RUN SERVER
# =========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )