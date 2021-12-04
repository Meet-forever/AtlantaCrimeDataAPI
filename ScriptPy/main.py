import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'modules'))

from modules import dataBaseConnection as dBC
from modules import fetchData
from modules import dataOperations as dO
from modules import getLink
import pandas as pd
import dotenv

env = dotenv.dotenv_values()
URI = f"mongodb+srv://{env['USERNAME']}:{env['PASSWORD']}@cluster0.3qz6v.mongodb.net/{env['DB']}?retryWrites=true&w=majority" 
data_link = getLink.get_link()
check = fetchData.fetchCSV(data_link)
DB = dBC.DB(URI)
col = dBC.startDB(DB, env['DB'], env['COLLECTION'])

if col and check:
# if col:
    CSV_path = os.path.join(os.path.join(os.path.dirname(__file__), "Data"),os.listdir(os.path.join(os.path.dirname(__file__), "Data"))[0])
    df = pd.read_csv(CSV_path)
    df = dO.clean(df)
    dO.validateSize(df, col)
    dO.crimeByNeighborhood(df, DB)
    dO.topIncidentDates(df, DB)
    print("Job Done!")

# CSV_path = os.path.join(os.path.join(os.path.dirname(__file__), "Data"),os.listdir(os.path.join(os.path.dirname(__file__), "Data"))[0])
# df = pd.read_csv(CSV_path)
