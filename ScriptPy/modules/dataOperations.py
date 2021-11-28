from pymongo.collection import Collection
from pandas.core.frame import DataFrame
from pymongo.database import Database
import dotenv
import pandas as pd
# import os

env = dotenv.dotenv_values()


# Data Cleansing Function
def clean(df:pd.DataFrame)->pd.DataFrame:
    df = df.dropna(subset=['occur_date', 'rpt_date', 'poss_date']).reset_index(drop=True)
    df['occur_date'] = pd.to_datetime(df['occur_date'])
    df['rpt_date'] = pd.to_datetime(df['rpt_date'])
    df['poss_date'] = pd.to_datetime(df['poss_date'])
    df['neighborhood'] = df['neighborhood'].str.replace('.', '', regex=False)
    df = df.sort_values(by='occur_date', ascending=True).reset_index(drop=True)
    return df
    # df['occur_date'] = pd.to_datetime(df['occur_date']).dt.date MongoDB doesn't not support date 


def validateSize(df:DataFrame, col: Collection)->None:
    colSize = col.count_documents({})
    if colSize < df.shape[0]:
        newdf = df.iloc[(colSize+1):]
        rawCrimeData(newdf, col)
        # print(newdf)


def rawCrimeData(df:DataFrame, col: Collection)->None:
    if not df.empty:
        # print(df.head(5).to_dict("records")); 
        col.insert_many(df.to_dict("records"))


def crimeByNeighborhood(df:DataFrame, DB: Database) -> None:
    topCounties = []
    index = 0
    for i, k in df['neighborhood'].value_counts().to_dict().items():
        topCounties.append({str(index): [i, k]})
        index +=1
    
    DB.set_collection('topCrimeNeighborhoods')
    temp_col = DB.get_collection()
    temp_col.delete_many({})
    temp_col.insert_many(topCounties)
    DB.set_collection(env['COLLECTION'])


def topIncidentDates(df:DataFrame, DB:Database)->None:
    topList = []
    df1 = df['occur_date'].map(lambda x: x.strftime('%Y-%m-%d'))
    for i, j in df1.value_counts().to_dict().items():
        topList.append({i:j})
    
    DB.set_collection('topIncidentDates')
    temp_col = DB.get_collection()
    temp_col.delete_many({})
    temp_col.insert_many(topList)
    DB.set_collection(env['COLLECTION'])


#BETA
# Used this to add neighborhoods in the collection
# doc = df['neighborhood'].sort_values().dropna().unique().tolist()
# docLen = len(df['neighborhood'].sort_values().dropna().unique().tolist())
# obj = {
#     "Neighborhoods": doc,
#     "length": docLen
# }
# col2.insert_one(obj)


# CSV_path = os.path.join(os.path.dirname(__file__).replace('modules', 'Data'),os.listdir(os.path.dirname(__file__).replace('modules', 'Data'))[0])
# df = pd.read_csv(CSV_path)
# def test(df):
#     topCounties = []
#     for i, k in df['neighborhood'].value_counts().to_dict().items():
#         topCounties.append([i, k])

#     print(topCounties)

# test(df)

# 1) Clean Data
# 2) Paste it into validation
# df = clean(df)
# rawCrimeData(df, )
# validateSize(df, col) 
# crimeByNeighborhood(df, DB)
# topIncidentDates(df, DB)

