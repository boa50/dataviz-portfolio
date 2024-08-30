from os import path
import pandas as pd
import numpy as np


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("humidity-brasilia.csv"),
    sep=";",
    usecols=["Data", "Umi. Max. (%)", "Umi. Min. (%)"],
)

df.columns = ["date", "humidityMax", "humidityMin"]

df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")
df["humidityMax"] = df["humidityMax"].str.replace(",", ".").astype(float)
df["humidityMin"] = df["humidityMin"].str.replace(",", ".").astype(float)

med = (
    df.groupby("date")[["humidityMax", "humidityMin"]].apply(np.nanmedian).reset_index()
)
med.columns = ["date", "humidityMed"]

df = df.groupby("date").agg({"humidityMax": "max", "humidityMin": "min"}).reset_index()

df = pd.merge(df, med, on="date")

print(df.isna().sum())
print(df)

df.to_csv(get_path("dataset.csv"), index=False)
