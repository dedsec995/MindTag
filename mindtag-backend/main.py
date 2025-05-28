from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection
from routers import books, notes # Changed 'pages' to 'notes' to match file name

app = FastAPI(
    title="MindTag API",
    description="API for the MindTag note-taking application.",
    version="0.1.0",
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app runs on 3000 by default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

app.include_router(books.router)
app.include_router(notes.router) # Changed 'pages' to 'notes'

@app.get("/")
async def root():
    return {"message": "Welcome to MindTag API!"}