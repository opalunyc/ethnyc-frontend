import './App.css';
import logo from './assets/logo.png';
import metamaskFox from './assets/MetaMask_Fox.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Card, InputAdornment, TextField, Stack, OutlinedInput, Skeleton, LinearProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import * as R from 'ramda';
import React from 'react';
import { ethers } from 'ethers';
import daiAbi from './daiAbi.json';
import { daiContractAddress, contractAddress, contractAbi } from './constants/contractAddress';
import { Dashboard } from './components/Dashboard/Dashboard';
import { DisbursementSchedule } from './components/DisbursementSchedule/DisbursementSchedule';

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

const addTokens = async (qty) => {
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

const seeTokens = async (qty) => {
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

const getWalletAddress = async () => {
  await sleep(10);
  return "0xc994f5ea0ba39494ce839613fffba74279579268"
};

const getWalletBalance = async () => {
  await sleep(10);
  return 2000;
};


const getBeneficiaryAddress = async () => {
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

const sendBeneficiaryAddress = async (address) => {
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

const getDisbursementSchedule = async () => {
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

const sendDisbursementSchedule = async (schedule) => {

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


export class StatusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCheckInDate: null,
      checkInStatus: null,
      walletAddress: null,
      walletBalance: null,
      checkInBy: "[UNKNOWN DATE]",
      sendQty: 0,
      tokenBalanceStatus: "loading",
      tokenBalance: 0,
      schedule: null,
    };
  }
  componentDidMount() {
    // TODO: Add check in call
    getWalletBalance().then(balance => this.setState({ walletBalance: balance }));
    getWalletAddress().then(address => this.setState({ walletAddress: address }));
    seeTokens().then(qty => this.setState({ tokenBalance: qty, tokenBalanceStatus: "ready" }));
    getDisbursementSchedule().then(schedule => this.setState({ schedule }));
    this.interval = setInterval(() => seeTokens().then(qty => this.setState({ tokenBalance: qty, tokenBalanceStatus: "ready" })), 500);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const handleSendQtyChange = ({ target }) => {
      if (isNaN(target.value) || target.value < 0) return;
      this.setState({ sendQty: target.value });
    }
    const onSend = () => {
      if (isNaN(this.state.sendQty) || this.state.sendQty <= 0) return;
      addTokens(this.state.sendQty).then(console.log).catch(console.error);
    };
    return (<Stack spacing={2}>
      <Box className="Card">
        <Box sx={{ margin: 1 }} className="section-title">Account Balance: {this.state.tokenBalanceStatus === "ready" ? this.state.tokenBalance + " fdaix" : <LinearProgress />}</Box>
      </Box>
      <Box className="Card">
        <Box sx={{ margin: 1 }} className="section-title">Add Tokens</Box>
        <Box sx={{ margin: 1 }}>
          <OutlinedInput label="Quantity" type="number" value={this.state.sendQty} onChange={handleSendQtyChange} notched={false} endAdornment={<InputAdornment position="end">fdaix</InputAdornment>} sx={{ marginRight: 2 }} />
          <Button variant="contained" size="large" endIcon={<Send />} disabled={isNaN(this.state.sendQty) || this.state.sendQty == 0} sx={{ borderRadius: 24 }} onClick={onSend}>
            Send
          </Button>
        </Box>
      </Box>
      <Box className="Card">
        <Box sx={{ margin: 1 }}>
          <Box className="section-title">Check-in Status</Box>
          <p>You are checked in!</p>
          {this.state.schedule != null ?
            <p>You must check in within {this.state.schedule === "LONG" ? "24 months" : (this.state.schedule === "MEDIUM" ? "12 months" : "6 months")} before disbursement begins.</p>
            : <></>
          }
        </Box>
      </Box>
    </Stack>);
  };
};

export class BeneficiaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beneficiaryAddressStatus: "loading",
      beneficiaryAddress: "",
      schedule: "MEDIUM",
      i: "loading",
      beneficiarySchedule: "",
    };
  }
  componentDidMount() {
    getBeneficiaryAddress().then(address => {
      this.setState({
        beneficiaryAddressStatus: "ready",
        beneficiaryAddress: address,
      });
    });
    getDisbursementSchedule().then(schedule => {
      this.setState({
        i: "ready",
        beneficiarySchedule: schedule,
      });
    });
  }
  render() {
    const handleSchedule = (e, newSchedule) => {
      const oldSchedule = this.state.schedule;
      this.setState({ beneficiarySchedule: newSchedule });
      sendDisbursementSchedule(newSchedule).catch(error => {
        this.setState({ beneficiarySchedule: oldSchedule });
      });
    };
    const updateBeneficary = (e) => {
      this.setState({
        beneficiaryAddress: e.target.value,
        beneficiaryAddressStatus: "changed"
      });
    };
    const clickUpdateBeneficiary = () => {
      if (this.state.beneficiaryAddress.length != 42) return;
      sendBeneficiaryAddress(this.state.beneficiaryAddress);
    }
    return (<Stack spacing={2}>
      <Box className="Card">
        <Box className="section-title" sx={{ margin: 1 }}>Update Beneficiary Address</Box>
        {this.state.beneficiaryAddressStatus != "loading" ?
          <>
            <Box sx={{ margin: 1 }}>
              <TextField
                label="Beneficiary Address"
                fullWidth
                className="input-elements"
                value={this.state.beneficiaryAddress}
                onChange={updateBeneficary}
              />
            </Box>
            <Box sx={{ margin: 1 }}>
              <Button variant="contained" size="large" sx={{ borderRadius: 6 }} disabled={this.state.beneficiaryAddress.length != 42 || this.state.beneficiaryAddressStatus != "changed"} onClick={clickUpdateBeneficiary}>
                Update
              </Button>
            </Box>
          </>
          : <LinearProgress />}
      </Box>
      {this.state.beneficiaryScheduleStatus != "loading" ?
        <DisbursementSchedule value={this.state.beneficiarySchedule} onChange={handleSchedule} /> :
        <LinearProgress />
      }

    </Stack>);
  }
};

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
