import React from "react"
import { ethers } from "ethers";
import { arrayify, hashMessage } from 'ethers/lib/utils';

export default function NavBar(props) {


    const handleConnect = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", [])
            const signer = provider.getSigner();
            props.setAddress(await signer.getAddress());
            props.setConnected(true);
            const puaddress = props.mapping["5"]["privateupload"][0]
            const { abi } = props.privateupload
            const puContract = new ethers.Contract(puaddress, abi, signer)
            const pub = await puContract.getpublickey(await signer.getAddress())
            console.log(pub)
            if (pub.toString().length === 0) {
                const message = 'I am signing this message to verify that I am allowing my public key to be saved in this contract';
                const signedMessage = await signer.signMessage(message); // Sign the message
                const digest = arrayify(hashMessage(message));
                const publicKey = ethers.utils.recoverPublicKey(digest, signedMessage); // Get the public key
                console.log(publicKey.slice(4))
                const response = await puContract.addpublickey(publicKey.slice(4))
                await response.wait()
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDisconnect = async () => {
        try {
            props.setConnected(false);
            props.setAddress(null);
            //setSignedMessage(null);
        } catch (error) {
            console.error(error);
        }
    };

    return <>
        <header>
            <nav className="nav-bar">
                {props.connected ? (
                    <button className="login-button info" onClick={handleDisconnect}>
                        {props.address}
                    </button>

                ) : (
                    <button className="login-button info" onClick={handleConnect}>
                        Connect
                    </button>
                )}
            </nav>
        </header>
    </>
}