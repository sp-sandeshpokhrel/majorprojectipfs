from brownie import Publicupload, privateupload
from scripts.helpful_scripts import get_account


def deploy():
    account = get_account()
    pu = privateupload.deploy({"from": account}, publish_source=True)
    return pu


def main():
    deploy()
