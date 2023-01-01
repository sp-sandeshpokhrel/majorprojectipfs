import React from "react"
import Table from "./Components/Table"
import FileUpload  from "./Components/FileUpload"
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./Components/NavBar"
import { Web3Storage } from "web3.storage"
import { DAppProvider, Goerli, Kovan, Rinkeby } from "@usedapp/core"
import publicupload from "./build/Publicupload.json"
import mapping from "./build/map.json"
import {ethers} from "ethers"




function makeStorageClient(){
  return new Web3Storage({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIzQzU5OTQ4MDVGMDMyYUI3N2I3MmEwZkJlMTVBMDgyREUyZmMwMTMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjA1NjE1MTQ5MTksIm5hbWUiOiJ0ZXN0In0.kfsVeIp6ac-SocvBAp0FlPwSXJwOGGvUdfIIUKj2hkg"})
}
function getFiles(){
  const fileInput = document.querySelector("input[type='file']")
  return fileInput.files
}

async function storeFiles(){
  const client = makeStorageClient()
  const files = getFiles()
  console.log(files[0].name)
  const cid = await client.put(files)
  toast.success("File Uploaded.")
  const puaddress = mapping["5"]["Publicupload"][0]
  const { abi } = publicupload
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
        puaddress,
        abi,
        signer
    )
    try {
        const response = await contract.addcid(cid,files[0]["name"])
        await response.wait()
        toast.success("Files CID added to blockchain")

    } catch (err) {
        console.log("error", err)
    }
}
  console.log("Stored files with cid: ", cid)
  return cid
}

export default function App(){
  const [fileState, setFileState] = React.useState([])


  
  function handleFile(event){
    console.log("runs")
    setFileState(event.target.files[0])
    if(event.target.files.length>=1){
      document.getElementById("upload-button").disabled = false
    }
    else{
      document.getElementById("upload-button").disabled = true
    }
  }
    

  

  function handleUpload(event){//handles upload to web3
      event.preventDefault()
      storeFiles()
  }


  
  
  return(
    <DAppProvider config={{
      networks: [Kovan, Rinkeby,Goerli]
    }}>
      <Navbar />
      <FileUpload handleFile={handleFile} handleUpload={handleUpload} />
      <div className="table-container">
        <Table/>
      </div>
      <ToastContainer/>
      </DAppProvider >
  )
}














// const trialData={
  //   data: [
    //       {
      //           name:"asdfwe",
      //           id: nanoid(),
      //           status:true,
      //           size: Math.ceil(Math.random()*100),
      //           date: Date.now() + Math.random()
      //       },
      //       {
        //           name:"asdfasdwe",
        //           id: nanoid(),
        //           status:true,
        //           size: Math.ceil(Math.random()*100),
        //           date: Date.now() + Math.random()
//       },
//       {
  //           name:"asdgrefwe",
  //           id: nanoid(),
  //           status:true,
  //           size: Math.ceil(Math.random()*100),
  //           date: Date.now() + Math.random()
  //       },
  //       {
    //           name:"dfrghrtghdg",
    //           id: nanoid(),
    //           status:true,
    //           size: Math.ceil(Math.random()*100),
    //           date: Date.now() + Math.random()
    //       },
    //       {
      //           name:"vbnsert",
      //           id: nanoid(),
      //           status:true,
      //           size: Math.ceil(Math.random()*100),
      //           date: Date.now() + Math.random()
      //       }
      //   ]
      // }
      
      
      // function handleChange(event){
      
      //   let newState = []
      //   setTableState(()=>{
      //     trialData.data.map(obj=>{
      //       if(obj.name.match(event.target.value) || obj.id.match(event.target.value)){
      //         if((obj.name.startsWith(event.target.value) || obj.id.match(event.target.value) )&& !newState.includes(obj))
      //           {newState.push(obj)}
      //         console.log(newState)
      //       }
      //     })
      //     return newState
      //   })
      // }