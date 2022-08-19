import React from "react"
import { useEthers } from "@usedapp/core";

export default function NavBar() {
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const isConnected = account !== undefined


    return <>
        <header>
            <nav className="nav-bar">
                {isConnected ? (
                    <button className="login-button info" onClick={deactivate}>
                        {account}
                    </button>

                ) : (
                    <button className="login-button info" onClick={() => activateBrowserWallet()}>
                        Connect
                    </button>
                )}
            </nav>
        </header>
    </>
}