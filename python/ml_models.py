"""
Simplified ML Models for Price Prediction and RL-based Signal Generation
"""

import numpy as np
from typing import List, Dict, Any, Optional


class SimpleLSTMPredictor:
    """
    Simplified LSTM-like price predictor using exponential smoothing.
    In production, replace with actual LSTM using TensorFlow/PyTorch.
    """

    def __init__(self):
        self.alpha = 0.3  # Smoothing factor
        self._confidence = 0.65

    def _exponential_smoothing(self, data: List[float], alpha: float) -> List[float]:
        """Apply exponential smoothing to time series."""
        if not data:
            return []

        result = [data[0]]
        for i in range(1, len(data)):
            result.append(alpha * data[i] + (1 - alpha) * result[-1])

        return result

    def _calculate_volatility(self, data: List[float]) -> float:
        """Calculate price volatility (annualized)."""
        if len(data) < 2:
            return 0.02

        returns = [(data[i] - data[i - 1]) / data[i - 1] for i in range(1, len(data))]
        std = np.std(returns)
        return float(std * np.sqrt(252))  # Annualized

    def _detect_trend_slope(self, data: List[float], period: int = 20) -> float:
        """Calculate trend slope using linear regression."""
        recent = data[-period:]
        if len(recent) < 2:
            return 0.0

        x = np.arange(len(recent))
        y = np.array(recent)

        # Linear regression: y = mx + b
        n = len(x)
        m = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (
            n * np.sum(x**2) - np.sum(x) ** 2
        )

        # Normalize slope as daily return
        return float(m / recent[0])

    def predict(self, closes: List[float], horizon: int = 5) -> List[Dict[str, float]]:
        """
        Predict future prices.

        Args:
            closes: Historical closing prices
            horizon: Number of days to predict

        Returns:
            List of predictions with date offsets and confidence intervals
        """
        if len(closes) < 20:
            raise ValueError("Need at least 20 data points")

        # Smooth the data
        smoothed = self._exponential_smoothing(closes, self.alpha)

        # Calculate trend
        trend_slope = self._detect_trend_slope(smoothed, min(20, len(smoothed)))
        volatility = self._calculate_volatility(closes[-30:])

        current_price = closes[-1]
        predictions = []

        for day in range(1, horizon + 1):
            # Predicted price with trend and mean reversion
            trend_component = current_price * (1 + trend_slope) ** day
            noise_component = current_price * volatility * np.random.normal(0, 0.1) * np.sqrt(day)

            predicted = trend_component + noise_component
            predicted = max(current_price * 0.8, min(current_price * 1.2, predicted))

            # Confidence interval
            ci_width = current_price * volatility * np.sqrt(day) * 0.5
            lower = predicted - ci_width
            upper = predicted + ci_width

            predictions.append({
                "day": day,
                "predicted": round(float(predicted), 2),
                "lower": round(float(lower), 2),
                "upper": round(float(upper), 2),
                "change": round(((predicted - current_price) / current_price) * 100, 2),
            })

        # Confidence decreases with horizon
        self._confidence = max(0.4, 0.85 - (horizon * 0.05))

        return predictions

    def get_confidence(self) -> float:
        return self._confidence


class RLSignalGenerator:
    """
    Simplified Reinforcement Learning-inspired signal generator.
    Uses rule-based policy that simulates RL decision-making.
    In production, use actual RL with gym environments.
    """

    def __init__(self):
        self.state_dim = 7  # Number of state features
        self.gamma = 0.95  # Discount factor

    def _extract_features(self, data: List[Dict[str, float]]) -> np.ndarray:
        """Extract state features from OHLCV data."""
        closes = [d["close"] for d in data]
        highs = [d["high"] for d in data]
        lows = [d["low"] for d in data]
        volumes = [d["volume"] for d in data]

        current_price = closes[-1]

        # Feature 1: RSI (simplified)
        if len(closes) > 14:
            deltas = np.diff(closes[-15:])
            gains = np.mean([d for d in deltas if d > 0] or [0])
            losses = np.mean([-d for d in deltas if d < 0] or [0])
            rs = gains / (losses + 1e-9)
            rsi = 100 - (100 / (1 + rs))
        else:
            rsi = 50.0

        # Feature 2: Price vs 20 SMA
        sma20 = np.mean(closes[-20:]) if len(closes) >= 20 else current_price
        price_sma_ratio = current_price / sma20

        # Feature 3: Volume ratio
        vol_avg = np.mean(volumes[-20:]) if len(volumes) >= 20 else volumes[-1]
        vol_ratio = volumes[-1] / (vol_avg + 1)

        # Feature 4: High-Low range
        hl_range = (highs[-1] - lows[-1]) / current_price

        # Feature 5: Price momentum (5-day)
        momentum = (closes[-1] - closes[-6]) / closes[-6] if len(closes) > 5 else 0

        # Feature 6: 20-day returns
        returns_20d = (closes[-1] - closes[-21]) / closes[-21] if len(closes) > 20 else 0

        # Feature 7: Volatility
        volatility = float(np.std(np.diff(closes[-20:])) / current_price) if len(closes) >= 20 else 0.01

        return np.array([rsi / 100, price_sma_ratio, vol_ratio, hl_range,
                          momentum, returns_20d, volatility])

    def _policy(self, state: np.ndarray) -> Dict[str, Any]:
        """
        Simplified policy function.
        Returns action based on state features.
        """
        rsi = state[0] * 100
        price_sma_ratio = state[1]
        momentum = state[4]
        returns_20d = state[5]

        # Q-values (simulated)
        q_buy = 0.0
        q_sell = 0.0
        q_hold = 0.5

        # RSI-based rules
        if rsi < 35:
            q_buy += 0.4
        elif rsi > 65:
            q_sell += 0.4

        # Trend rules
        if price_sma_ratio > 1.02:
            q_buy += 0.3
        elif price_sma_ratio < 0.98:
            q_sell += 0.3

        # Momentum rules
        if momentum > 0.02:
            q_buy += 0.2
        elif momentum < -0.02:
            q_sell += 0.2

        # Returns rules
        if returns_20d > 0.05:
            q_sell += 0.1  # Mean reversion
        elif returns_20d < -0.1:
            q_buy += 0.2  # Oversold

        q_values = {"BUY": q_buy, "SELL": q_sell, "HOLD": q_hold}
        action = max(q_values, key=lambda k: q_values[k])

        max_q = max(q_values.values())
        total_q = sum(q_values.values())
        confidence = int(60 + (max_q / (total_q + 1e-9)) * 35)

        return {
            "action": action,
            "q_values": q_values,
            "confidence": min(95, max(40, confidence)),
        }

    def generate_signal(
        self, data: List[Dict[str, float]], portfolio_value: float = 100000.0
    ) -> Dict[str, Any]:
        """
        Generate trading signal using RL policy.

        Args:
            data: Recent OHLCV data
            portfolio_value: Current portfolio value in INR

        Returns:
            Signal with action, confidence, and reasoning
        """
        state = self._extract_features(data)
        policy_result = self._policy(state)

        action = policy_result["action"]
        confidence = policy_result["confidence"]
        q_values = policy_result["q_values"]

        # Generate reasoning
        rsi = state[0] * 100
        momentum = state[4]
        price_sma = state[1]

        reasons = []
        if rsi < 35:
            reasons.append(f"RSI at {rsi:.1f} - oversold territory")
        elif rsi > 65:
            reasons.append(f"RSI at {rsi:.1f} - overbought territory")

        if price_sma > 1.02:
            reasons.append("Price trading above 20 SMA - positive trend")
        elif price_sma < 0.98:
            reasons.append("Price trading below 20 SMA - negative trend")

        if momentum > 0.02:
            reasons.append(f"5-day momentum: +{momentum*100:.1f}% - bullish")
        elif momentum < -0.02:
            reasons.append(f"5-day momentum: {momentum*100:.1f}% - bearish")

        reasoning = ". ".join(reasons) if reasons else "Neutral market conditions based on RL policy"

        return {
            "action": action,
            "confidence": confidence,
            "reasoning": reasoning,
            "qValues": {k: round(v, 3) for k, v in q_values.items()},
            "state": {
                "rsi": round(rsi, 1),
                "priceSmaRatio": round(float(price_sma), 4),
                "momentum5d": round(float(momentum * 100), 2),
            },
        }
