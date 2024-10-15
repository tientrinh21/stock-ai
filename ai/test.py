import yfinance as yf
from datetime import datetime, timedelta

def fetch_stock_data(ticker, period):
    if period == "max":
        data = yf.download(ticker, period="max")
    elif period == "1d":
        data = yf.download(ticker, period="1d")
    else:
        time_delta = {"1wk": 7, "1mo": 30, "1y": 365, "max": max}
        end_date = datetime.now()
        start_date = end_date - timedelta(days=time_delta[period])
        print(start_date)
        data = yf.download(ticker, start=start_date, end=end_date)

    return data

stock_data = yf.download("AAPL", start="2024-10-16", end=datetime.now())

print(stock_data)
