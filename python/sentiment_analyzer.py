"""
Sentiment Analysis Module for Indian Stock Market News
"""

import re
from typing import List, Dict, Any


class SentimentAnalyzer:
    """
    Rule-based sentiment analyzer for financial news.
    In production, use a fine-tuned BERT/FinBERT model.
    """

    # Positive financial terms
    POSITIVE_TERMS = {
        "strong": 0.5, "beat": 0.7, "surpass": 0.8, "exceed": 0.7, "growth": 0.6,
        "profit": 0.6, "gain": 0.5, "rise": 0.5, "increase": 0.4, "up": 0.3,
        "bullish": 0.8, "buy": 0.6, "upgrade": 0.7, "outperform": 0.8, "positive": 0.5,
        "record": 0.6, "high": 0.4, "expand": 0.5, "launch": 0.4, "win": 0.6,
        "partnership": 0.4, "dividend": 0.6, "buyback": 0.7, "acquisition": 0.3,
        "revenue": 0.3, "margin": 0.4, "momentum": 0.5, "robust": 0.6, "solid": 0.5,
        "impressive": 0.6, "good": 0.4, "great": 0.6, "excellent": 0.7, "promising": 0.5,
        "recovery": 0.5, "rebound": 0.6, "attractive": 0.5, "opportunity": 0.4,
    }

    # Negative financial terms
    NEGATIVE_TERMS = {
        "decline": -0.5, "fall": -0.5, "drop": -0.5, "loss": -0.7, "weak": -0.5,
        "miss": -0.6, "below": -0.4, "decrease": -0.4, "bearish": -0.8, "sell": -0.5,
        "downgrade": -0.7, "underperform": -0.8, "concern": -0.5, "risk": -0.4,
        "headwind": -0.5, "pressure": -0.4, "struggle": -0.6, "challenge": -0.4,
        "slowdown": -0.5, "recession": -0.8, "inflation": -0.4, "debt": -0.4,
        "fraud": -1.0, "scam": -1.0, "penalty": -0.6, "fine": -0.5, "raid": -0.7,
        "lawsuit": -0.6, "negative": -0.5, "poor": -0.5, "bad": -0.6, "terrible": -0.8,
        "disappointing": -0.6, "disappoints": -0.6, "problem": -0.4, "issue": -0.3,
        "volatile": -0.3, "uncertainty": -0.4, "downside": -0.5,
    }

    # Intensifiers
    INTENSIFIERS = {
        "very": 1.5, "extremely": 2.0, "highly": 1.5, "significantly": 1.5,
        "substantially": 1.5, "sharply": 1.5, "dramatically": 1.8, "slightly": 0.5,
        "marginally": 0.5, "modestly": 0.7,
    }

    def analyze(self, headlines: List[str]) -> Dict[str, Any]:
        """
        Analyze sentiment of financial news headlines.

        Args:
            headlines: List of news headlines

        Returns:
            Sentiment analysis result
        """
        if not headlines:
            return {
                "sentiment": "NEUTRAL",
                "score": 0.0,
                "key_phrases": [],
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
            }

        scores = []
        key_phrases = []
        breakdown = {"positive": 0, "negative": 0, "neutral": 0}

        for headline in headlines:
            score, phrases = self._analyze_headline(headline)
            scores.append(score)
            key_phrases.extend(phrases)

            if score > 0.2:
                breakdown["positive"] += 1
            elif score < -0.2:
                breakdown["negative"] += 1
            else:
                breakdown["neutral"] += 1

        avg_score = sum(scores) / len(scores) if scores else 0.0
        avg_score = max(-1.0, min(1.0, avg_score))

        sentiment = (
            "BULLISH" if avg_score > 0.2
            else "BEARISH" if avg_score < -0.2
            else "NEUTRAL"
        )

        # Get unique key phrases (top 5)
        unique_phrases = list(dict.fromkeys(key_phrases))[:5]

        return {
            "sentiment": sentiment,
            "score": round(avg_score, 3),
            "key_phrases": unique_phrases,
            "breakdown": breakdown,
            "headlineCount": len(headlines),
        }

    def _analyze_headline(self, headline: str) -> tuple:
        """
        Analyze a single headline.

        Returns:
            (score, key_phrases)
        """
        words = re.findall(r"\b\w+\b", headline.lower())
        score = 0.0
        key_phrases = []
        intensifier = 1.0

        for i, word in enumerate(words):
            # Check for intensifier
            if word in self.INTENSIFIERS:
                intensifier = self.INTENSIFIERS[word]
                continue

            # Check positive terms
            if word in self.POSITIVE_TERMS:
                term_score = self.POSITIVE_TERMS[word] * intensifier
                score += term_score
                key_phrases.append(word)
                intensifier = 1.0

            # Check negative terms
            elif word in self.NEGATIVE_TERMS:
                term_score = self.NEGATIVE_TERMS[word] * intensifier
                score += term_score
                key_phrases.append(word)
                intensifier = 1.0
            else:
                intensifier = 1.0

        # Normalize score
        score = max(-1.0, min(1.0, score))

        return score, key_phrases

    def batch_analyze(
        self, symbol_headlines: Dict[str, List[str]]
    ) -> Dict[str, Dict[str, Any]]:
        """
        Analyze sentiment for multiple stocks.

        Args:
            symbol_headlines: Dict of symbol -> list of headlines

        Returns:
            Dict of symbol -> sentiment result
        """
        results = {}
        for symbol, headlines in symbol_headlines.items():
            results[symbol] = self.analyze(headlines)
        return results

    def get_market_sentiment(self, all_sentiments: List[float]) -> Dict[str, Any]:
        """
        Calculate overall market sentiment from individual stock sentiments.

        Args:
            all_sentiments: List of sentiment scores

        Returns:
            Market sentiment result
        """
        if not all_sentiments:
            return {"sentiment": "NEUTRAL", "score": 0.0}

        avg = sum(all_sentiments) / len(all_sentiments)
        bullish = sum(1 for s in all_sentiments if s > 0.2)
        bearish = sum(1 for s in all_sentiments if s < -0.2)
        neutral = len(all_sentiments) - bullish - bearish

        sentiment = "BULLISH" if avg > 0.2 else "BEARISH" if avg < -0.2 else "NEUTRAL"

        return {
            "sentiment": sentiment,
            "score": round(avg, 3),
            "bullishCount": bullish,
            "bearishCount": bearish,
            "neutralCount": neutral,
            "totalStocks": len(all_sentiments),
        }
