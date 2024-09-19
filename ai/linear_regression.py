import pandas as pd
from sklearn.linear_model import LinearRegression


def linear_model(data):
    X = data["Close"][:-1].values.reshape(-1, 1)
    y = data["Close"][1:].values

    model = LinearRegression()
    model.fit(X, y)

    return model


def linear_predict(model, number_of_predict_data, data):
    last_data = data["Close"].values[-1].reshape(-1, 1)
    last_date = data["Datetime"].values[-1]

    prediction = [last_data[0][0]]
    future_dates = [last_date]

    for i in range(number_of_predict_data):
        last_data = model.predict(last_data)
        prediction.append(last_data[0])
        last_data = last_data.reshape(-1, 1)

        # skip weekends
        last_date = last_date + pd.DateOffset(1)
        while last_date.weekday() >= 5:
            last_date = last_date + pd.DateOffset(1)
        future_dates.append(last_date)

    predicted_data = pd.DataFrame({"Datetime": future_dates, "Close": prediction})
    return predicted_data
