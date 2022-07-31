import './App.css';
import logo from './assets/logo.png';
import metamaskFox from './assets/MetaMask_Fox.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Card, Skeleton } from '@mui/material';
import * as R from 'ramda';
import React from 'react';
import { ethers } from 'ethers';
import daiAbi from './daiAbi.json';
import { daiContractAddress, contractAddress, contractAbi } from './constants/contractAddress';
import { Dashboard } from './components/Dashboard/Dashboard';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const theme = createTheme({
  typography: {
    fontFamily: ['DM Sans'],
  },

  palette: {
    mode: "dark",
  },
});

const ethInAccount = 1500;
export const fastDisbursement = [...R.repeat(0, 54).map((_, x) => Math.pow((x + 1) / 54, 3))].map((x, mo) => ({ x: (mo + 7) / 12, y: x * ethInAccount }));
export const mediumDisbursement = [...R.repeat(0, 108).map((_, x) => Math.pow((x + 1) / 108, 3))].map((x, mo) => ({ x: (mo + 13) / 12, y: x * ethInAccount }));
export const slowDisbursement = [...R.repeat(0, 216).map((_, x) => Math.pow((x + 1) / 216, 3))].map((x, mo) => ({ x: (mo + 25) / 12, y: x * ethInAccount }));

const isWalletConnected = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("no window.ethereum");
      return false;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log("accounts: ", accounts);

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("wallet is connected!", + account);
      return true;
    } else {
      console.log("make sure MetaMask is connected");
      return false;
    }
  } catch (error) {
    console.log("error: ", error)
  }
  return false;
};

const connectWallet = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("no window.ethereum");
  }
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log("accounts: ", accounts);

  if (accounts.length > 0) {
    const account = accounts[0];
    console.log("wallet is connected!", + account);
  } else {
    throw new Error("metamask not connected");
  }
};

export const addTokens = async (qty) => {
  const { ethereum } = window;
  if (!ethereum) return;
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  const signer = provider.getSigner();
  const daiContract = new ethers.Contract(
    daiContractAddress,
    daiAbi,
    signer,
  );
  const result = await daiContract.transfer(contractAddress, ethers.utils.parseEther(qty));
};

export const seeTokens = async (qty) => {
  const { ethereum } = window;
  if (!ethereum) return;
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  const signer = provider.getSigner();
  const daiContract = new ethers.Contract(
    daiContractAddress,
    daiAbi,
    signer,
  );
  const result = (await daiContract.balanceOf(contractAddress)).div(1e9).div(1e6).toNumber() / 1000;
  console.log("dai result", result);
  return result;
};

export const getWalletAddress = async () => {
  await sleep(10);
  return "0xc994f5ea0ba39494ce839613fffba74279579268"
};

export const getWalletBalance = async () => {
  await sleep(10);
  return 2000;
};


export const getBeneficiaryAddress = async () => {
  const { ethereum } = window;
  if (!ethereum) return "";
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  const signer = provider.getSigner();
  const ethersContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer,
  );

  console.log("getting beneficiary address...");
  console.log(ethersContract);
  const address = await ethersContract.recipient();

  console.log("got address?", address);
  return address;
};

export const sendBeneficiaryAddress = async (address) => {
  const { ethereum } = window;
  if (!ethereum) return "";
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  const signer = provider.getSigner();
  const ethersContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer,
  );

  console.log("setting beneficiary address...");
  const result = await ethersContract.setRecipient(address);
  console.log("set address?", result);
}

const checkIn = async (address) => {
  await sleep(10);
  return Date.now();
}

export const getDisbursementSchedule = async () => {
  // const { ethereum } = window;
  // if (!ethereum) return "";
  // const provider = new ethers.providers.Web3Provider(ethereum, "any");
  // const signer = provider.getSigner();
  // const ethersContract = new ethers.Contract(
  //   contractAddress,
  //   contractAbi,
  //   signer,
  // );

  // console.log("getting disbursement schedule...");
  // console.log(ethersContract);
  // const schedule = await ethersContract.plan();

  // console.log("got schedule?", schedule);
  // return schedule;
};

export const sendDisbursementSchedule = async (schedule) => {

  console.log(schedule);

  //Delete THis Function as the user will not be able to edit the Disbursement schedule unless they
  //create a new Dribble. 

  // const { ethereum } = window;
  // if (!ethereum) return "";
  // const provider = new ethers.providers.Web3Provider(ethereum, "any");
  // const signer = provider.getSigner();
  // const ethersContract = new ethers.Contract(
  //   contractAddress,
  //   contractAbi,
  //   signer,
  // );

  // console.log("setting beneficiary schedule...", schedule);
  // const result = await ethersContract.setPlan(schedule);
  // console.log("set schedule?", result);
}


const LoginToMetamask = ({ setLoggedInState }) => {
  return (<Box className="login-main-area">
    <Box sx={{ margin: 1 }} className="login-header">Login to Dribble</Box>
    <Box sx={{ margin: 1 }}>
      Connect your Metamask wallet to use Dribble
    </Box>
    <Button className="login-button" sx={{ backgroundColor: "#e3d4bf", margin: 3 }} onClick={() => {
      setLoggedInState("loading");
      connectWallet().then(() => {
        // success!
        setLoggedInState("true");
      }).catch(error => {
        console.log("failed to log in", error);
        setLoggedInState("false");
      });
    }}>
      <img src={metamaskFox} height="100" width="100" />
      <Box sx={{ fontSize: 20 }}>Login to Metamask</Box>
    </Button>
  </Box>);
};

const CheckingIfLoggedIn = () => {
  return (<Box>
    Loading...
  </Box>);
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: "loading" };
  }
  componentDidMount() {
    isWalletConnected()
      .then(status => this.setState({ loggedIn: status ? "true" : "false" }));
  }
  render() {
    const setLoggedInState = (state) => this.setState({ loggedIn: state });
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <header>
            <img src={logo} width="48" height="48" style={{ bottom: -7, position: "relative", marginRight: 11 }} />dribble
          </header>
          {this.state.loggedIn === "true" ?
            <Dashboard /> :
            (this.state.loggedIn === "false" ?
              <LoginToMetamask setLoggedInState={setLoggedInState} /> :
              <CheckingIfLoggedIn />)
          }
        </ThemeProvider>
      </div>
    );
  }
};
export default App;
