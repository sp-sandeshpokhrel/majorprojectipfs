import * as ethUtil from 'ethereumjs-util'
import * as sigUtil from '@metamask/eth-sig-util';
import { ethers } from 'ethers';

export default function keyenc() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    async function enc() {
        const accounts = await provider.listAccounts();

        let encryptionPublicKey;
        await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [accounts[0]], // you must have access to the specified account
        })
            .then((result) => {
                encryptionPublicKey = result;
            })
        //const publicKey = "04c68087b1ce0229078268f36ce3cb99686a7234603e309bb81c3e829a92a4c0e7968b5d4d69617c879607ce5f335035fdb1ae3537c86d88383600346eb5affa70"
        const encryptedMessage = await ethUtil.bufferToHex(
            Buffer.from(
                JSON.stringify(
                    sigUtil.encrypt({
                        publicKey: encryptionPublicKey,
                        data: 'hello world!',
                        version: 'x25519-xsalsa20-poly1305',
                    })
                ),
                'utf8'
            )
        );
        console.log(encryptedMessage)
        const decryptedMessage = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [encryptedMessage, accounts[0]],
        });
        console.log(decryptedMessage);
    }
    return (
        <button onClick={enc}>
            Encrypt
        </button>
    )
}