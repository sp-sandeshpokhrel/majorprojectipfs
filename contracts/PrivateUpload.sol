//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract privateupload {
    struct File {
        string name;
        string CID;
        string key;
        string iv;
    }

    //mapping (address=>mapping(bytes32=>string)[]) usercid;
    mapping(address => string) publickey;
    mapping(string => string) checkcid;
    mapping(address => File[]) userscid;
    mapping(address => File[]) sharedwithuser;

    //retrieving public key
    function getpublickey(address acc) public view returns (string memory) {
        return publickey[acc];
    }

    //adding publickey
    function addpublickey(string memory publicke) public {
        publickey[msg.sender] = publicke;
    }

    //getting struct length
    function getlength(address useraccount) public view returns (uint256) {
        return userscid[useraccount].length;
    }

    //get current user files
    function getusercid(address useraccount)
        public
        view
        returns (File[] memory)
    {
        return userscid[useraccount];
    }

    function getsharedwithuser(address useraccount)
        public
        view
        returns (File[] memory)
    {
        return sharedwithuser[useraccount];
    }

    //add file cid and name(if only uploaded by the user alone)
    function addcid(
        string memory cids,
        string memory name,
        string memory key,
        string memory iv
    ) public {
        checkcid[cids] = name;
        userscid[msg.sender].push(File(name, cids, key, iv));
    }

    //remove any cid if user wants it removed from his file system
    function removecid(string memory cids) public {
        uint256 j;
        for (j = 0; j < userscid[msg.sender].length; j++) {
            if (
                keccak256(abi.encodePacked(cids)) ==
                keccak256(abi.encodePacked(userscid[msg.sender][j].CID))
            ) {
                delete userscid[msg.sender][j];
                break;
            }
        }
    }

    //share file cid with other user, who wants it(add the file name and cid in other user shared with me section)
    function sharewithother(
        address user,
        string memory cids,
        string memory pekey,
        string memory iv
    ) public {
        sharedwithuser[user].push(File(checkcid[cids], cids, pekey, iv));
    }
}
