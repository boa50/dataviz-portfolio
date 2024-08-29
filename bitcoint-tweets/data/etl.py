from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


### tweets
df = pd.read_csv(
    get_path("Bitcoin_tweets.csv"),
    usecols=["date"],
    dtype={"date": str},
    # low_memory=False,
    # nrows=100000
)

df["date"] = df["date"].str.slice(0, 10)
df = df["date"].value_counts().reset_index()
# To remove non date values
df = df[df["count"] >= 10]

print(df.tail())

df.to_csv(get_path("tweets.csv"), index=False)

### prices
df = pd.read_csv(get_path("BTC-USD.csv"), usecols=["Date", "Close"])

df.columns = ["date", "close"]

print(df.head())
print(df.isna().sum())

df.to_csv(get_path("prices.csv"), index=False)
