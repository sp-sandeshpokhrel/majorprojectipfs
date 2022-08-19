import React from "react"
import { useEthers } from "@usedapp/core"
export default function FileUpload(props) {
    const { account } = useEthers()

    return (
        <>
            <div className="form-container">
                {account ? (<form method="post" action="#" onSubmit={props.handleUpload} className="upload" encType="multipart/form-data">
                    <label htmlFor="file" className="upload-label success">Select File</label>
                    <input type="file" name="fileName" onChange={props.handleFile} id="file" multiple />
                    <button id="upload-button" disabled>Upload</button>
                </form>) : (<p className="upload-label">Connect Wallet to upload</p>)}


            </div>
        </>)
}