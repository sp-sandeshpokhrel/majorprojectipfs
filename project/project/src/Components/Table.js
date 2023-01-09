import React from "react"
import { utils, ethers } from "ethers"
import { toast } from "react-toastify"



export default function Table({ connected, mapping, publicupload, privateupload, getyourFile, userMode }) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    if (userMode) {
        var puaddress = mapping["5"]["Publicupload"][0]
        var { abi } = publicupload
        var puInterface = new utils.Interface(abi)
        var puContract = new ethers.Contract(puaddress, puInterface, provider)
    } else {
        var puaddress = mapping["5"]["privateupload"][0]
        var { abi } = privateupload
        var puInterface = new utils.Interface(abi)
        var puContract = new ethers.Contract(puaddress, puInterface, provider)

    }


    const [filee, setFile] = React.useState([])


    async function deletee(cids: string) {
        if (window.ethereum) {
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                puaddress,
                abi,
                signer
            )
            try {
                const response = await contract.removecid(cids)
                await response.wait()
                toast.success("Files removed from blockchain")
            } catch (err) {
                console.log("error", err)
            }
        }
    }

    async function updateTable() {
        if (connected) {
            const accounts = await provider.listAccounts();
            let hhh = await puContract.getusercid(accounts[0])
            setFile(hhh)
            console.log(connected)
            setFile(hhh)
            /* if (typeof filee === 'object') {
                 setFile(current =>
                     current.filter(fill => {
                         return fill.CID.length !== 0;
                     })
                 )
                 console.log(filee.length)
             }*/
        } else {
            setFile([])
        }
    }

    React.useEffect(() => { updateTable() }, [connected, userMode])


    /*function handleClick(event) {
        let id = event.target.parentNode.parentNode.id
        let name = document.getElementById(id).firstChild.innerHTML
        // axios({
        //     method: 'get',
        //     url: '//localhost:8000/download',
        //     data: {
        //       name: {name},
        //       id : {id}
        //     }
        //   });
        // console.log(event.target.parentNode.parentNode.name)

        axios.get("//localhost:8000/download", {
            responseType: 'blob',
            params: {
                name: { name },
                id: { id }
            }
        })
            .then(res => {
                FileDownload(res.data, name)
            })
    }*/

    return (<>
        <table>
            <thead>
                {/* <tr className="table-top">
                    <h2>Files</h2>
                    <input sytle={{display:"inline-block"}}name="search-bar" placeholder="Search Files" onChange={props.handleChange} ></input>
                </tr> */}
                <tr>
                    <th>Name</th>
                    <th>CID</th>
                    <th>Storage</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th>Delete</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>

                {
                    filee.map(element => {
                        return (<tr key={element.CID} id={element.CID}>
                            <td>{element.name}</td>
                            <td>{element.CID}</td>
                            <td>--</td>
                            <td>--</td>
                            <td>--</td>
                            <td><button onClick={() => { deletee(element.CID) }}>Delete</button></td>
                            <td><button onClick={() => userMode ? getyourFile(element.CID) : getyourFile(element.CID, element.key, element.iv)}>Download your file</button></td>
                        </tr>)
                    })
                }
            </tbody>
        </table>
    </>
    )
}

//<a href={"https://ipfs.io/ipfs/" + element.CID} target="_blank">
/*
{filee.map(element => {
                    return (<tr key={element.CID} id={element.CID}>
                        <td>{element.name}</td>
                        <td>{element.CID}</td>
                        <td></td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td><button >Download</button></td>
                    </tr>)
                })}

*/