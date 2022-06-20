import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState,useEffect } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/load-contract';

function App() {
  const[web3Api,setweb3Api] = useState({
    provider:null, 
    web3:null,
    contract:null
  });
  const[account,setaccount] = useState(null);
  const[balance,setbalance] = useState(null);
  const[reload,setReload] = useState(false);
  const reloadEffect = ()=> setReload(!reload);
  
  useEffect(()=>{
   const loadprovider = async()=>{ 
   const provider = await detectEthereumProvider();
   const contract = await loadContract("funding",provider);

   if (provider) {
    provider.request({method:"eth_requestAccounts"});
   setweb3Api({
    web3:new Web3(provider),
    provider,
    contract
  });
}
  }
  loadprovider();
  },[]);

  useEffect(()=>{
    const getaccount = async()=>{
      const accounts = await web3Api.web3.eth.getAccounts();
      setaccount(accounts[0]);
    }
    web3Api.web3 && getaccount(); 
  },[web3Api.web3]);

  useEffect(()=>{
    const loadbalance = async ()=>{
      const{contract,web3} = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setbalance(web3.utils.fromWei(balance,"ether"));
    }
    web3Api.contract && loadbalance();
  },[web3Api,reload]);

  const tra_fund = async ()=>{
    const {web3,contract} = web3Api;
    await contract.transferFund({
      from:account,
      value:web3.utils.toWei("2","ether")
    })
    reloadEffect();
  }


  const withdrawFund = async ()=>{
    const {web3,contract} = web3Api;
    const wamount = web3.utils.toWei("2","ether");
    await contract.withdraw(wamount,{from:account});
  }
    reloadEffect(); 
  

  return (
    <>
      <div className="card text-center">
        <div className="card-header">Crowd Funding</div>
        <div className="card-body">
          <h5 className="card-title">Balance: {balance} ETH </h5>
          <p className="card-text">Account : {account ? account : "not connected"}</p>
          &nbsp;
          <button type="button" className="btn btn-success" onClick={tra_fund}> 
            Transfer
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary " onClick={withdrawFund} >
            Withdraw
          </button>
        </div>
        <div className="card-footer text-muted">Dixit kava crowdfunding project</div>
      </div>
    </>
  );
}
export default App;

