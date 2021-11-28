import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'modules'))

from modules import dataBaseConnection as dBC
from modules import fetchData
from modules import dataOperations as dO
import pandas as pd
import dotenv

env = dotenv.dotenv_values()
URI = "mongodb+srv://%s:%s@cluster0.3qz6v.mongodb.net/%s?retryWrites=true&w=majority" %(env['USERNAME'], env['PASSWORD'], env['DB'])
data_link = "https://www.atlantapd.org/home/showpublisheddocument/4470/637728271158000000"

# check = fetchData.fetchCSV(data_link)
DB = dBC.DB(URI)
col = dBC.startDB(DB, env['DB'], env['COLLECTION'])

# if col and check:
if col:
    CSV_path = os.path.join(os.path.join(os.path.dirname(__file__), "Data"),os.listdir(os.path.join(os.path.dirname(__file__), "Data"))[0])
    df = pd.read_csv(CSV_path)
    # df = dO.clean(df)
    # dO.validateSize(df, col)
    dO.crimeByNeighborhood(df, DB)
    # dO.topIncidentDates(df, DB)


# CSV_path = os.path.join(os.path.join(os.path.dirname(__file__), "Data"),os.listdir(os.path.join(os.path.dirname(__file__), "Data"))[0])
# df = pd.read_csv(CSV_path)
