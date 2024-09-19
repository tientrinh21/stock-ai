import pandas as pd
from prophet import Prophet


def prophet_model(data):
    df = data[["Datetime", "Close"]].rename(columns={"Datetime": "ds", "Close": "y"})
    model = Prophet()
    model.fit(df)

    return model


def prophet_predict(model, number_of_predict_data, data):
    last_data = (
        data.drop(columns=["Datetime", "SMA_20", "EMA_20"]).values[-1].reshape(1, 6)
    )
    last_date = data["Datetime"].values[-1]

    future_dates = [last_date]

    for i in range(number_of_predict_data):
        # skip weekends
        last_date = last_date + pd.DateOffset(1)
        while last_date.weekday() >= 5:
            last_date = last_date + pd.DateOffset(1)
        future_dates.append(last_date)

    future = pd.DataFrame(future_dates, columns=pd.Series(["ds"]))
    forecast = model.predict(future)

    predict_df = forecast[["ds", "yhat"]].rename(
        columns={"ds": "Datetime", "yhat": "Close"}
    )
    predict_df.iloc[0] = last_data[0][3]
    print(predict_df.head())
    return predict_df
