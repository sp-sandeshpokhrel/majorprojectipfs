from scripts.helpful_scripts import get_account
from brownie import Publicupload


def test_add():
    account = get_account()
    pu = Publicupload.deploy({"from": account})
    tx = pu.addcid(
        "bafybeidi2ideqrb5m5np3qyzb2oireuyay7fjzvmoat7qgj2w47azhbtci",
        "SEE_ChapterThree.pdf",
    )
    tx.wait(1)
    assert (
        pu.checkcid("bafybeidi2ideqrb5m5np3qyzb2oireuyay7fjzvmoat7qgj2w47azhbtci")
        == "SEE_ChapterThree.pdf"
    )
    assert pu.getlength() == 1
