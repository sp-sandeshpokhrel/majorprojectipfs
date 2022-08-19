from brownie import Publicupload
from scripts.helpful_scripts import get_account


def deploy():
    account = get_account()
    pu = Publicupload.deploy({"from": account}, publish_source=True)
    return pu


def main():
    deploy()
