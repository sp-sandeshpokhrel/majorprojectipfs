import requests, os


API_endpoint = "https://api.web3.storage"
apikey = os.getenv("WEB3_API")


def uploadfile(filepath):
    url = "/upload"
    test_url = API_endpoint + url
    headers = {"Authorization": "Bearer " + str(apikey)}
    test_file = open(filepath, "rb")
    response = requests.post(test_url, files={"file": test_file}, headers=headers)
    # print(response.json())
    return response.json()["cid"]


def retrievefile(cid, name):
    test_url = "https://ipfs.io/ipfs/" + str(cid)
    response = requests.get(test_url)
    # print(response.text)
    # print(response.content)
    # Write to file
    binary_file = open(name, "wb")
    binary_file.write(response.content)
    binary_file.close()
    # pickle.dump(response.content, open(name, "wb"))


def main():
    # print(uploadfile("h.exe"))
    """retrievefile("bafybeidqowyxip7uzp7qya5a3yzzs5qaljqzmwafjbcutzn4hhpkjqilcy", "h2.exe")"""
