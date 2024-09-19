import xgboost
import pandas as pd


def xgboost_model(data):
    dropped_data = data.drop(columns=["Datetime", "SMA_20", "EMA_20"])
    X = dropped_data[:-1].values.reshape(-1, 6)
    y = dropped_data[1:].values
    model = xgboost.XGBRegressor()
    model.fit(X, y)

    return model


def xgboost_predict(model, number_of_predict_data, data):
    last_data = (
        data.drop(columns=["Datetime", "SMA_20", "EMA_20"]).values[-1].reshape(1, 6)
    )
    last_date = data["Datetime"].values[-1]

    prediction = [last_data[0][3]]
    future_dates = [last_date]

    for i in range(number_of_predict_data):
        last_data = model.predict(last_data)
        prediction.append(last_data[0][3])

        # skip weekends
        last_date = last_date + pd.DateOffset(1)
        while last_date.weekday() >= 5:
            last_date = last_date + pd.DateOffset(1)
        future_dates.append(last_date)

    predicted_data = pd.DataFrame({"Datetime": future_dates, "Close": prediction})
    return predicted_data
