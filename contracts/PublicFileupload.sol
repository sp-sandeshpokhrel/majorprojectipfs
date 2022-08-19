//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Publicupload {
    struct File {
        string name;
        string CID;
    }

    //mapping (address=>mapping(bytes32=>string)[]) usercid;
    mapping(address => bytes32) public publickey;
    mapping(string => string) public checkcid;
    mapping(address => File[]) public userscid;
    mapping(address => File[]) public sharedwithuser;

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
    function addcid(string memory cids, string memory name) public {
        checkcid[cids] = name;
        userscid[msg.sender].push(File(name, cids));
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
    function sharewithother(address user, string memory cids) public {
        sharedwithuser[user].push(File(checkcid[cids], cids));
    }
}
