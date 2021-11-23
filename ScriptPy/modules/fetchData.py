from io import BytesIO
import requests
import zipfile
import os

def fetchCSV(uri:str)->bool:
    """Fetch CSV file using URI link, and then save it to the Data Folder.

    Args:
        uri (str): Enter CSV file link that needs to be downloaded.

    Returns:
        bool: 
            True: Executed Sucessfully.
            False: Bad Link. 

    """
    try:
        data_file = requests.get(uri)
        if data_file.status_code != 200: return False
        with zipfile.ZipFile(BytesIO(data_file.content)) as downloaded_file:
            saveFileTo = os.path.join(os.path.dirname(__file__).strip('\modules'), 'Data')
            existingFile = os.listdir(saveFileTo)[0]
            os.remove(os.path.join(saveFileTo, existingFile))
            downloaded_file.extractall(saveFileTo)
            downloaded_file.close()
    except:
        return False
    return True
