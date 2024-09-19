import yfinance as yf
import pandas as pd

# Read and print the stock tickers that make up S&P500
sp500 = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]

tickers = sp500.Symbol.to_list()

for ticker in tickers:
    data = yf.download(ticker, period="max")
    data.to_csv(f"{ticker}.csv")
