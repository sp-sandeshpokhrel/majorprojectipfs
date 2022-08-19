from brownie import accounts, network
import os

FORKED = ["mainnet-fork-dev"]
LOCAL_CHAIN = ["development", "ganache-cli"]


def get_account():
    if network.show_active() in LOCAL_CHAIN or network.show_active in FORKED:
        return accounts[0]
    else:
        return accounts.add(os.getenv("PRIVATE_KEY"))
