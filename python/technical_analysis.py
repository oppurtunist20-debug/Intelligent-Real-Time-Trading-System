"""
Technical Analysis Module using pandas and pandas-ta
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any


class TechnicalAnalyzer:
    """Comprehensive technical analysis using pandas-ta."""

    def analyze(self, ohlcv_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compute all technical indicators.

        Args:
            ohlcv_data: List of OHLCV dictionaries

        Returns:
            Dictionary with all computed indicators
        """
        df = pd.DataFrame(ohlcv_data)
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date").reset_index(drop=True)

        results = {}

        # Moving Averages
        results["sma"] = self._compute_smas(df)
        results["ema"] = self._compute_emas(df)

        # Momentum Indicators
        results["rsi"] = self._compute_rsi(df)
        results["macd"] = self._compute_macd(df)
        results["stochastic"] = self._compute_stochastic(df)
        results["momentum"] = self._compute_momentum(df)

        # Volatility Indicators
        results["bollingerBands"] = self._compute_bollinger_bands(df)
        results["atr"] = self._compute_atr(df)

        # Volume Indicators
        results["volumeAnalysis"] = self._compute_volume_analysis(df)
        results["obv"] = self._compute_obv(df)

        # Trend Analysis
        results["trend"] = self._detect_trend(df)
        results["supportResistance"] = self._compute_support_resistance(df)

        # Overall Signal
        results["signal"] = self._generate_signal(results)

        return results

    def _compute_smas(self, df: pd.DataFrame) -> Dict[str, float]:
        """Simple Moving Averages."""
        closes = df["close"].values
        result = {}
        for period in [10, 20, 50, 100, 200]:
            if len(closes) >= period:
                result[f"sma{period}"] = float(np.mean(closes[-period:]))
        return result

    def _compute_emas(self, df: pd.DataFrame) -> Dict[str, float]:
        """Exponential Moving Averages."""
        closes = df["close"].values
        result = {}
        for period in [9, 12, 21, 26, 50]:
            if len(closes) >= period:
                ema = self._ema_series(closes, period)
                result[f"ema{period}"] = float(ema[-1])
        return result

    def _ema_series(self, data: np.ndarray, period: int) -> np.ndarray:
        """Calculate EMA series."""
        multiplier = 2 / (period + 1)
        ema = np.zeros(len(data))
        ema[0] = data[0]
        for i in range(1, len(data)):
            ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1]
        return ema

    def _compute_rsi(self, df: pd.DataFrame, period: int = 14) -> Dict[str, float]:
        """Relative Strength Index."""
        closes = df["close"].values
        if len(closes) < period + 1:
            return {"value": 50.0, "signal": "NEUTRAL"}

        deltas = np.diff(closes)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = np.mean(gains[:period])
        avg_loss = np.mean(losses[:period])

        for i in range(period, len(deltas)):
            avg_gain = (avg_gain * (period - 1) + gains[i]) / period
            avg_loss = (avg_loss * (period - 1) + losses[i]) / period

        if avg_loss == 0:
            rsi = 100.0
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))

        signal = "OVERBOUGHT" if rsi > 70 else "OVERSOLD" if rsi < 30 else "NEUTRAL"

        return {
            "value": round(rsi, 2),
            "signal": signal,
            "period": period,
        }

    def _compute_macd(
        self,
        df: pd.DataFrame,
        fast: int = 12,
        slow: int = 26,
        signal: int = 9,
    ) -> Dict[str, float]:
        """MACD Indicator."""
        closes = df["close"].values
        if len(closes) < slow + signal:
            return {"macdLine": 0.0, "signalLine": 0.0, "histogram": 0.0, "trend": "NEUTRAL"}

        fast_ema = self._ema_series(closes, fast)
        slow_ema = self._ema_series(closes, slow)
        macd_line = fast_ema - slow_ema

        signal_line = self._ema_series(macd_line[slow - 1 :], signal)
        histogram = macd_line[-1] - signal_line[-1]

        trend = "BULLISH" if macd_line[-1] > signal_line[-1] else "BEARISH"

        return {
            "macdLine": round(float(macd_line[-1]), 4),
            "signalLine": round(float(signal_line[-1]), 4),
            "histogram": round(float(histogram), 4),
            "trend": trend,
        }

    def _compute_stochastic(
        self, df: pd.DataFrame, k_period: int = 14, d_period: int = 3
    ) -> Dict[str, float]:
        """Stochastic Oscillator."""
        if len(df) < k_period:
            return {"k": 50.0, "d": 50.0, "signal": "NEUTRAL"}

        highs = df["high"].values[-k_period:]
        lows = df["low"].values[-k_period:]
        close = df["close"].values[-1]

        high_max = np.max(highs)
        low_min = np.min(lows)

        if high_max == low_min:
            k = 50.0
        else:
            k = ((close - low_min) / (high_max - low_min)) * 100

        signal = "OVERBOUGHT" if k > 80 else "OVERSOLD" if k < 20 else "NEUTRAL"

        return {
            "k": round(float(k), 2),
            "d": round(float(k), 2),  # Simplified
            "signal": signal,
        }

    def _compute_momentum(self, df: pd.DataFrame, period: int = 10) -> Dict[str, float]:
        """Price Momentum."""
        closes = df["close"].values
        if len(closes) <= period:
            return {"value": 0.0, "roc": 0.0}

        current = closes[-1]
        previous = closes[-period - 1]
        momentum = current - previous
        roc = ((current - previous) / previous) * 100

        return {
            "value": round(float(momentum), 2),
            "roc": round(float(roc), 2),
            "period": period,
        }

    def _compute_bollinger_bands(
        self, df: pd.DataFrame, period: int = 20, std_dev: float = 2.0
    ) -> Dict[str, float]:
        """Bollinger Bands."""
        closes = df["close"].values
        if len(closes) < period:
            close = closes[-1]
            return {
                "upper": close * 1.05,
                "middle": close,
                "lower": close * 0.95,
                "bandwidth": 0.1,
                "percentB": 0.5,
            }

        recent = closes[-period:]
        middle = float(np.mean(recent))
        std = float(np.std(recent))
        upper = middle + std_dev * std
        lower = middle - std_dev * std
        bandwidth = (upper - lower) / middle
        percent_b = (closes[-1] - lower) / (upper - lower) if upper != lower else 0.5

        return {
            "upper": round(upper, 2),
            "middle": round(middle, 2),
            "lower": round(lower, 2),
            "bandwidth": round(bandwidth, 4),
            "percentB": round(float(percent_b), 4),
        }

    def _compute_atr(self, df: pd.DataFrame, period: int = 14) -> Dict[str, float]:
        """Average True Range."""
        if len(df) < 2:
            return {"value": 0.0, "period": period}

        highs = df["high"].values
        lows = df["low"].values
        closes = df["close"].values

        true_ranges = []
        for i in range(1, len(df)):
            tr = max(
                highs[i] - lows[i],
                abs(highs[i] - closes[i - 1]),
                abs(lows[i] - closes[i - 1]),
            )
            true_ranges.append(tr)

        atr_period = min(period, len(true_ranges))
        atr = float(np.mean(true_ranges[-atr_period:]))

        return {
            "value": round(atr, 2),
            "period": period,
            "asPercent": round((atr / closes[-1]) * 100, 2),
        }

    def _compute_volume_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Volume Analysis."""
        volumes = df["volume"].values
        current_vol = int(volumes[-1])
        avg_vol_20 = float(np.mean(volumes[-20:]))
        ratio = current_vol / avg_vol_20 if avg_vol_20 > 0 else 1.0

        recent_avg = float(np.mean(volumes[-5:]))
        older_avg = float(np.mean(volumes[-20:-5])) if len(volumes) > 20 else recent_avg

        if recent_avg > older_avg * 1.1:
            trend = "INCREASING"
        elif recent_avg < older_avg * 0.9:
            trend = "DECREASING"
        else:
            trend = "STABLE"

        return {
            "current": current_vol,
            "average20": round(avg_vol_20, 0),
            "ratio": round(ratio, 2),
            "trend": trend,
        }

    def _compute_obv(self, df: pd.DataFrame) -> Dict[str, float]:
        """On Balance Volume."""
        closes = df["close"].values
        volumes = df["volume"].values
        obv = 0.0

        for i in range(1, len(closes)):
            if closes[i] > closes[i - 1]:
                obv += volumes[i]
            elif closes[i] < closes[i - 1]:
                obv -= volumes[i]

        return {
            "value": round(float(obv), 0),
            "trend": "POSITIVE" if obv > 0 else "NEGATIVE",
        }

    def _detect_trend(self, df: pd.DataFrame) -> Dict[str, str]:
        """Detect price trend using multiple timeframes."""
        closes = df["close"].values
        if len(closes) < 50:
            return {"shortTerm": "SIDEWAYS", "mediumTerm": "SIDEWAYS", "overall": "SIDEWAYS"}

        short_sma = float(np.mean(closes[-20:]))
        long_sma = float(np.mean(closes[-50:]))
        current = closes[-1]

        if current > short_sma > long_sma:
            short_term = "UPTREND"
        elif current < short_sma < long_sma:
            short_term = "DOWNTREND"
        else:
            short_term = "SIDEWAYS"

        if len(closes) >= 200:
            very_long_sma = float(np.mean(closes[-200:]))
            if short_sma > very_long_sma:
                medium_term = "UPTREND"
            elif short_sma < very_long_sma:
                medium_term = "DOWNTREND"
            else:
                medium_term = "SIDEWAYS"
        else:
            medium_term = short_term

        return {
            "shortTerm": short_term,
            "mediumTerm": medium_term,
            "overall": short_term,
        }

    def _compute_support_resistance(self, df: pd.DataFrame, period: int = 20) -> Dict[str, float]:
        """Identify support and resistance levels."""
        highs = df["high"].values[-period:]
        lows = df["low"].values[-period:]

        resistance = float(np.max(highs))
        support = float(np.min(lows))
        current = float(df["close"].values[-1])

        # Pivot point
        prev_high = float(df["high"].values[-2]) if len(df) >= 2 else current
        prev_low = float(df["low"].values[-2]) if len(df) >= 2 else current
        prev_close = float(df["close"].values[-2]) if len(df) >= 2 else current

        pivot = (prev_high + prev_low + prev_close) / 3

        return {
            "support": round(support, 2),
            "resistance": round(resistance, 2),
            "pivot": round(pivot, 2),
            "distanceToResistance": round(((resistance - current) / current) * 100, 2),
            "distanceToSupport": round(((current - support) / current) * 100, 2),
        }

    def _generate_signal(self, indicators: Dict[str, Any]) -> Dict[str, Any]:
        """Generate overall trading signal from indicators."""
        score = 0
        reasons = []

        # RSI
        rsi = indicators.get("rsi", {}).get("value", 50)
        if rsi < 30:
            score += 25
            reasons.append(f"RSI oversold at {rsi:.1f}")
        elif rsi > 70:
            score -= 25
            reasons.append(f"RSI overbought at {rsi:.1f}")

        # MACD
        macd = indicators.get("macd", {})
        if macd.get("histogram", 0) > 0:
            score += 20
            reasons.append("MACD histogram positive - bullish momentum")
        elif macd.get("histogram", 0) < 0:
            score -= 20
            reasons.append("MACD histogram negative - bearish momentum")

        # Bollinger Bands
        bb = indicators.get("bollingerBands", {})
        percent_b = bb.get("percentB", 0.5)
        if percent_b < 0.2:
            score += 15
            reasons.append("Price near lower Bollinger Band - potential bounce")
        elif percent_b > 0.8:
            score -= 15
            reasons.append("Price near upper Bollinger Band - potential pullback")

        # Trend
        trend = indicators.get("trend", {}).get("overall", "SIDEWAYS")
        if trend == "UPTREND":
            score += 20
            reasons.append("Price in uptrend")
        elif trend == "DOWNTREND":
            score -= 20
            reasons.append("Price in downtrend")

        # Volume
        vol_ratio = indicators.get("volumeAnalysis", {}).get("ratio", 1.0)
        if vol_ratio > 1.5 and trend == "UPTREND":
            score += 10
            reasons.append("High volume confirms uptrend")

        # Determine signal
        if score >= 30:
            action = "BUY"
        elif score <= -30:
            action = "SELL"
        else:
            action = "HOLD"

        confidence = min(95, max(40, abs(score) + 40))

        return {
            "action": action,
            "score": score,
            "confidence": confidence,
            "reasons": reasons,
        }
