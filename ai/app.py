import plotly.graph_objects as go
import streamlit as st

from utils import (
    fetch_stock_data,
    process_data,
    calculate_metrics,
    add_technical_indicators,
)

from linear_regression import linear_model, linear_predict
from _xgboost import xgboost_model, xgboost_predict
from _prophet import prophet_model, prophet_predict


# Streamlit app
def main():
    # mapping of time periods to data intervals
    predict_days_mapping = {"1wk": 1, "1mo": 10, "1y": 180, "max": 365}

    # setup Streamlit page layout
    st.set_page_config(layout="wide")
    st.title("Real-time Stock Dashboard")

    # SIDEBAR PARAMETERS
    # sidebar for user input params
    st.sidebar.header("Chart Parameters ")
    ticker = st.sidebar.text_input("Ticker", "AAPL")
    time_period = st.sidebar.selectbox(
        "Time Period", ["1wk", "1mo", "1y", "max"], index=3
    )
    chart_type = st.sidebar.selectbox("Chart Type", ["Line", "Candlestick"])
    indicators = st.sidebar.multiselect("Technical Indicators", ["SMA 20", "EMA 20"])

    forecast_out = 0
    models = []
    predicted_data = {}
    if chart_type == "Line":
        forecast_out = st.sidebar.number_input(
            "Predicted days",
            value=predict_days_mapping[time_period],
            min_value=1,
            max_value=365,
        )

        models = st.sidebar.multiselect(
            "Predict models", ["Linear Regression", "XGBoost", "Prophet"]
        )

    # AI MODELS
    # update the dashboard based on user input
    data = fetch_stock_data(ticker, time_period)
    data = process_data(data)
    data = add_technical_indicators(data)
    last_close, change, pct_change, high, low, volume = calculate_metrics(data)

    # train data
    if "Linear Regression" in models:
        _linear_model = linear_model(data)
        predicted = linear_predict(_linear_model, forecast_out, data)
        predicted["Datetime"] = predicted["Datetime"].dt.strftime("%Y-%m-%d")
        predicted_data["Linear Regression"] = predicted

    if "XGBoost" in models:
        _xgboost_model = xgboost_model(data)
        predicted = xgboost_predict(_xgboost_model, forecast_out, data)
        predicted["Datetime"] = predicted["Datetime"].dt.strftime("%Y-%m-%d")
        predicted_data["XGBoost"] = predicted

    if "Prophet" in models:
        _prophet_model = prophet_model(data)
        predicted = prophet_predict(_prophet_model, forecast_out, data)
        predicted["Datetime"] = predicted["Datetime"].dt.strftime("%Y-%m-%d")
        predicted_data["Prophet"] = predicted

    data["Datetime"] = data["Datetime"].dt.strftime("%Y-%m-%d")

    # MAIN CONTENT AREA
    # display main metrics
    st.metric(
        label=f"{ticker} Last Price",
        value=f"{last_close:.2f} USD",
        delta=f"{change:.2f} ({pct_change:.2f}%)",
    )

    col1, col2, col3 = st.columns(3)
    col1.metric("High", f"{high: .2f} USD")
    col2.metric("Low", f"{low:.2f} USD")
    col3.metric("Volume", f" {volume:,}")

    # plot the stock price chart
    fig = go.Figure()
    if chart_type == "Candlestick":
        fig.add_trace(
            go.Candlestick(
                x=data["Datetime"],
                open=data["Open"],
                close=data["Close"],
                high=data["High"],
                low=data["Low"],
            )
        )
    elif chart_type == "Line":
        fig.add_trace(
            go.Scatter(
                x=data["Datetime"],
                y=data["Close"],
                mode="lines",
                name="Actual",
                line=dict(color="orange"),
            )
        )

        for model in models:
            fig.add_trace(
                go.Scatter(
                    x=predicted_data[model]["Datetime"],
                    y=predicted_data[model]["Close"],
                    mode="lines",
                    name=model,
                )
            )

    # add selected technical indicators to the chart
    for indicator in indicators:
        if indicator == "SMA 20":
            fig.add_trace(
                go.Scatter(x=data["Datetime"], y=data["SMA_20"], name="SMA 20")
            )
        elif indicator == "EMA 20":
            fig.add_trace(
                go.Scatter(x=data["Datetime"], y=data["EMA_20"], name="EMA 20")
            )

    # format graph
    fig.update_layout(
        title=f"{ticker} {time_period.upper()} Chart",
        xaxis_title="Time",
        yaxis_title="Price (USD) ",
        height=600,
    )

    fig.update_xaxes(type="category")
    st.plotly_chart(fig, use_container_width=True)

    # display historical data and technical indicators
    st.subheader("Historical Data")
    st.dataframe(
        data[["Datetime", "Open", "High", "Low", "Close", "Volume"]],
        width=2000,  # a big number for full screen table
    )

    st.subheader("Technical Indicators")
    st.dataframe(
        data[["Datetime", "SMA_20", "EMA_20"]],
        width=2000,  # a big number for full screen table
    )

    # SIDEBAR PRICES

    # Sidebar section for real—time stock prices of selected symbols
    st.sidebar.header("Real-time Stock Prices")
    stock_symbols = ["AAPL", "GOOGL", "AMZN", "MSFT"]
    for symbol in stock_symbols:
        real_time_data = fetch_stock_data(symbol, "1d")
        if not real_time_data.empty:
            real_time_data = process_data(real_time_data)
            last_price = real_time_data["Close"].iloc[-1]
            change = last_price - real_time_data["Open"].iloc[0]
            pct_change = (change / real_time_data["Open"].iloc[0]) * 100
            st.sidebar.metric(
                f"{symbol}",
                f"{last_price:.2f} USD",
                f"{change:.2f} ({pct_change:.2f}%)",
            )

    # Sidebar information section
    st.sidebar.subheader("About")
    st.sidebar.info(
        "This dashboard provides stock data and technical indicators for various time periods."
    )


if __name__ == "__main__":
    main()
