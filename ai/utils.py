from datetime import datetime, timedelta

import ta.trend
import yfinance as yf


# fetch stock data based on ticker, period, and interval
def fetch_stock_data(ticker, period):
    if period == "max":
        data = yf.download(ticker, period="max")
    elif period == "1d":
        data = yf.download(ticker, period="1d")
    else:
        time_delta = {"1wk": 7, "1mo": 30, "1y": 365, "max": max}
        end_date = datetime.now()
        start_date = end_date - timedelta(days=time_delta[period])
        data = yf.download(ticker, start=start_date, end=end_date)

    return data


# process data to ensure it is timezone-aware and has the correct format
def process_data(data):
    data.reset_index(inplace=True)
    data.rename(columns={"Date": "Datetime"}, inplace=True)
    return data


# calculate basic metrics from the stock data
def calculate_metrics(data):
    last_close = data["Close"].iloc[-1]
    prev_close = data["Close"].iloc[0]
    change = last_close - prev_close
    pct_change = (change / prev_close) * 100
    high = data["High"].max()
    low = data["Low"].min()
    volume = data["Volume"].sum()
    return last_close, change, pct_change, high, low, volume


# add simple moving average (SMA) and exponential moving average (EMA) indicators
def add_technical_indicators(data):
    data["SMA_20"] = ta.trend.sma_indicator(data["Close"], window=20)
    data["EMA_20"] = ta.trend.ema_indicator(data["Close"], window=20)
    return data
