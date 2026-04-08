"""
FastAPI Backend for TradeIndia Technical Analysis and ML Models
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json

from technical_analysis import TechnicalAnalyzer
from ml_models import SimpleLSTMPredictor, RLSignalGenerator
from sentiment_analyzer import SentimentAnalyzer

app = FastAPI(
    title="TradeIndia Python Backend",
    description="Technical Analysis, ML Models, and Sentiment Analysis for Indian Markets",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
tech_analyzer = TechnicalAnalyzer()
lstm_predictor = SimpleLSTMPredictor()
rl_signal_gen = RLSignalGenerator()
sentiment_analyzer = SentimentAnalyzer()


# Request/Response Models
class OHLCVData(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class TechnicalAnalysisRequest(BaseModel):
    symbol: str
    data: List[OHLCVData]


class PredictionRequest(BaseModel):
    symbol: str
    data: List[OHLCVData]
    horizon: int = 5  # Days to predict


class RLSignalRequest(BaseModel):
    symbol: str
    data: List[OHLCVData]
    portfolio_value: Optional[float] = 100000.0


class SentimentRequest(BaseModel):
    symbol: str
    headlines: List[str]


# Technical Analysis Endpoint
@app.post("/api/technical-analysis")
async def technical_analysis(request: TechnicalAnalysisRequest):
    """Compute comprehensive technical indicators."""
    try:
        if len(request.data) < 30:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data. Need at least 30 data points."
            )

        ohlcv_list = [
            {
                "date": d.date,
                "open": d.open,
                "high": d.high,
                "low": d.low,
                "close": d.close,
                "volume": d.volume,
            }
            for d in request.data
        ]

        result = tech_analyzer.analyze(ohlcv_list)
        return {
            "symbol": request.symbol,
            "indicators": result,
            "dataPoints": len(request.data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# LSTM Prediction Endpoint
@app.post("/api/predict")
async def predict(request: PredictionRequest):
    """Generate price predictions using simplified LSTM model."""
    try:
        if len(request.data) < 60:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data. Need at least 60 data points."
            )

        closes = [d.close for d in request.data]
        predictions = lstm_predictor.predict(closes, request.horizon)

        return {
            "symbol": request.symbol,
            "currentPrice": closes[-1],
            "predictions": predictions,
            "horizon": request.horizon,
            "confidence": lstm_predictor.get_confidence(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# RL Signal Endpoint
@app.post("/api/rl-signal")
async def rl_signal(request: RLSignalRequest):
    """Generate trading signal using RL-based model."""
    try:
        if len(request.data) < 30:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data. Need at least 30 data points."
            )

        ohlcv_list = [
            {
                "close": d.close,
                "high": d.high,
                "low": d.low,
                "volume": d.volume,
            }
            for d in request.data
        ]

        signal = rl_signal_gen.generate_signal(ohlcv_list, request.portfolio_value or 100000.0)

        return {
            "symbol": request.symbol,
            "signal": signal["action"],
            "confidence": signal["confidence"],
            "reasoning": signal["reasoning"],
            "portfolioValue": request.portfolio_value,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Sentiment Analysis Endpoint
@app.post("/api/sentiment")
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment from news headlines."""
    try:
        result = sentiment_analyzer.analyze(request.headlines)
        return {
            "symbol": request.symbol,
            "sentiment": result["sentiment"],
            "score": result["score"],
            "keyPhrases": result["key_phrases"],
            "breakdown": result["breakdown"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Health Check
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "TradeIndia Python Backend"}


# Market Hours Check
@app.get("/api/market-status")
async def market_status():
    """Check if NSE/BSE markets are open."""
    from datetime import datetime, timezone
    import pytz

    ist = pytz.timezone("Asia/Kolkata")
    now_ist = datetime.now(ist)

    is_weekday = now_ist.weekday() < 5
    market_open = 9 * 60 + 15  # 9:15 AM in minutes
    market_close = 15 * 60 + 30  # 3:30 PM in minutes
    current_minutes = now_ist.hour * 60 + now_ist.minute

    is_market_hours = market_open <= current_minutes <= market_close
    is_open = is_weekday and is_market_hours

    return {
        "isOpen": is_open,
        "currentTime": now_ist.strftime("%H:%M IST"),
        "marketOpen": "09:15 IST",
        "marketClose": "15:30 IST",
        "exchange": "NSE/BSE",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
