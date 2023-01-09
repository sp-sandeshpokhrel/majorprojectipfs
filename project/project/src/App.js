import React,{useState} from "react"
import Table from "./Components/Table"
import FileUpload  from "./Components/FileUpload"
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./Components/NavBar"
import { Web3Storage } from "web3.storage"
import privateupload from "./build/privateupload.json"
import publicupload from "./build/Publicupload.json"
import mapping from "./build/map.json"
import {ethers} from "ethers"
import "./Components/init"
import {startEncryption,startDecryption} from './Components/encfunctions'
import Enckey from "./Components/try"
import FileSaver from "file-saver";





export default function App(){

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [up, setUp] = useState(false)
  const [userMode, setUserMode] = useState(true)
  
function makeStorageClient(){
  return new Web3Storage({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIzQzU5OTQ4MDVGMDMyYUI3N2I3MmEwZkJlMTVBMDgyREUyZmMwMTMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjA1NjE1MTQ5MTksIm5hbWUiOiJ0ZXN0In0.kfsVeIp6ac-SocvBAp0FlPwSXJwOGGvUdfIIUKj2hkg"})
}
function getFiles(){
  const fileInput = document.querySelector("input[type='file']")
  return fileInput.files
}


//store file on ipfs and store the cid and keys on blockchain for encrypted
async function storeFiles(setUp){
  
  const client = makeStorageClient()
  const files = getFiles()
  console.log(files[0].name)
  const {enc,iv,key}=await startEncryption(files[0]);
  console.log(enc)
  const cid = await client.put([enc])
  toast.success("File Uploaded.")
  const puaddress = mapping["5"]["privateupload"][0]
  const { abi } = privateupload
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
        puaddress,
        abi,
        signer
    )
    try {      
        console.log(iv)
        const buffer = Buffer.from(iv.buffer);
        const inv = buffer.toString('hex');
        console.log(inv);
        //const buffer = Buffer.from(iv.buffer);
        //const inv = buffer.toString();
        const response = await contract.addcid(cid,files[0]["name"],key,inv,)//,iv)
        await response.wait()
        toast.success("Files CID added to blockchain")

    } catch (err) {
        console.log("error", err)
    }
}
  console.log("Stored files with cid: ", cid)
  setUp(prev=>!prev)
  return cid
}



async function getyourFile(cid,password,iv){

  const client = makeStorageClient()
  const res=await client.get(cid)
  console.log(res.status)
  const files=await res.files()
  if(userMode){
    FileSaver.saveAs(files[0], files[0].name);
    console.log(files[0])
  }else{  
    try{
  const buffer = Buffer.from(iv, 'hex');
  const inv = new Uint8Array(buffer);
  console.log(inv);
  //const buffer = Buffer.from(iv);
  //const inv = new Uint8Array(buffer);
  await startDecryption(files[0],password,inv)
  }catch(error){
    console.log(error)
  }
}
}



  function handleFile(event){
    console.log("runs")
    if(event.target.files.length>=1){
      document.getElementById("upload-button").disabled = false
    }
    else{
      document.getElementById("upload-button").disabled = true
    }
  }
    

  

  function handleUpload(event){//handles upload to web3
      event.preventDefault()
      storeFiles(setUp)
  }


  
  
  return(
    <>
      <Navbar mapping={mapping} privateupload={privateupload} address={address} connected={connected} setAddress={setAddress} setConnected={setConnected} />
      <FileUpload  connected={connected} handleFile={handleFile} handleUpload={handleUpload} />
      <button className="login-button info" onClick={()=>setUserMode(prev=>!prev)}>{userMode?"Public":"Private"}-Switch mode</button>
      <div className="table-container">
        <Table connected={connected} mapping={mapping} publicupload={publicupload} privateupload={privateupload} getyourFile={getyourFile} userMode={userMode}/>
      </div>
      <ToastContainer/>
      <Enckey/>
    </>
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