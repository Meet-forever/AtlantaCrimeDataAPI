from requests_html import HTMLSession

session = HTMLSession()

def get_link()->str:
    """[summary]
        It fetch the data from the apd's crime-data-downloads 
    Returns:
        str: CSV file url link
    """
    r = session.get('https://www.atlantapd.org/i-want-to/crime-data-downloads')
    data_content = r.html.find('#widget_362_0_197', first=True)
    link = data_content.find('li', first=True).links
    download_link = "https://www.atlantapd.org" + next(iter(link))
    return download_link
