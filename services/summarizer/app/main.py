from fastapi import FastAPI, Request
from pydantic import BaseModel
from summarizer import summarize

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    print("summarize server running")

class SummarizeRequest(BaseModel):
    text: str
    tone: str = "default"


@app.get("/")
def hello():
    return{"status" : 400, "message" : "summarizer working"}

@app.post("/summarize")
async def get_summary(req: SummarizeRequest):
    summary = summarize(req.text, tone=req.tone)
    return {"summary": summary}
