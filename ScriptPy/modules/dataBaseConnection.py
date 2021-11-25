import pymongo
from pymongo.database import Database
from pymongo.collection import Collection

class DB:
    def __init__(self, uri) -> None:
        self.uri = uri
        self.client = None
        self.db = None
        self.col = None
            
    def connect(self) -> bool:
        try:
            self.client = pymongo.MongoClient(self.uri)
            return True
        except:
            return False

    def set_dataBase(self, db_name:str) -> bool:
        if db_name in self.client.list_database_names():
            self.db = self.client.get_database(db_name)
            return True
        else: return False
    
    def set_collection(self, collection_name: str) -> bool:
        if collection_name in self.db.list_collection_names() and self.db != None:
            self.col = self.db.get_collection(collection_name)
            return True
        else: return False
    
    def get_collection(self) -> Collection:
        return self.col    
    
    def create_collection(self, collection_name:str)-> None:
        self.db.create_collection(collection_name)



def startDB(database, dataBaseName:str, collectionName:str):
    if database.connect() and database.set_dataBase(dataBaseName) and database.set_collection(collectionName):
        return database.get_collection()