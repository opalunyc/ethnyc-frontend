import './App.css';
import metamaskFox from './MetaMask_Fox.png';
import { Box, Button, Card, InputAdornment, TextField, Stack, Tab, Tabs, ToggleButtonGroup, ToggleButton, Tooltip, OutlinedInput} from '@mui/material';
import { Send } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { CartesianGrid, XAxis, YAxis, Scatter, ScatterChart, ResponsiveContainer } from 'recharts';
import * as R from 'ramda';
import React, { useState } from 'react';

const ethInAccount = 1500;
const fastDispersement = [...R.repeat(0, 54).map((_, x) => Math.pow((x+1)/54, 3))].map((x, mo) => ({x: (mo+7)/12, y: x * ethInAccount }));
const mediumDispersement = [...R.repeat(0, 108).map((_, x) => Math.pow((x+1)/108, 3))].map((x, mo) => ({x: (mo+13)/12, y: x * ethInAccount }));
const slowDispersement = [...R.repeat(0, 162).map((_, x) => Math.pow((x+1)/162, 3))].map((x, mo) => ({x: (mo+19)/12, y: x * ethInAccount }));

const isWalletConnected = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("no window.ethereum");
      return false;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts'});
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
}

const connectWallet = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("no window.ethereum");
  }
  const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
  console.log("accounts: ", accounts);

  if (accounts.length > 0) {
    const account = accounts[0];
    console.log("wallet is connected!", + account);
  } else {
    throw new Error("metamask not connected");
  }
};


const StatusPage = () => {
  return (<Stack spacing={2}>
    <Card className="Card">
      <Box sx={{margin:1}}>
        <p>Your last check in was at June 25, 2022 1:31am.</p>
        <p>You must check in again before June 24, 2023 1:31am before dispersement begins.</p>
      </Box>
    </Card>
    <Card className="Card">
      <Box sx={{margin:1}}>
        <p>This is your wallet address: <strong>0x123797324001238098</strong></p>
        <p>Wallet Balance: <strong>{ethInAccount} fdaix</strong></p>
      </Box>
    </Card>
  </Stack>);
};

const BeneficiaryPage = () => {
  const [schedule, setSchedule] = useState("medium");
  const handleSchedule = (e, newSchedule) => setSchedule(newSchedule);
  return (<Stack spacing={2}>
    <Card className="Card">
      <Box sx={{ margin: 1}}>
        <TextField
          label="Beneficiary Address"
          fullWidth
        />
      </Box>
      <Box sx={{ margin: 1}}>
        <Button variant="contained" size="large" disabled>
          Update
        </Button>
      </Box>
    </Card>
    <DispersementSchedule value={schedule} onChange={handleSchedule} />
  </Stack>);
}
const DispersementSchedule = ({value, onChange}) => {
  const dispersement = value === "fast" ? fastDispersement : ((value === "medium") ? mediumDispersement : slowDispersement);
  const years = R.repeat(0, (dispersement[dispersement.length-1].x)).map((_, year) => year);
  console.log(years);
  
  return (
    <Card className="Card">
      <Box sx={{ margin: 1 }}>
        <div className="section-title">Dispersement Schedule</div>
        <ToggleButtonGroup value={value} exclusive className="dispersement-speed-selector" onChange={onChange}>
          <ToggleButton value="slow">
            Slow Dispersement
          </ToggleButton>
          <ToggleButton value="medium">
            Medium Dispersement
          </ToggleButton>
          <ToggleButton value="fast">
            Fast Dispersement
          </ToggleButton>
          <ToggleButton value="instant" disabled>
            Instant Dispersement
          </ToggleButton>
        </ToggleButtonGroup>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart width={600} height={300} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="x" type="number" scale="linear" name="years" unit=" years" range={[0, dispersement.length/12]} allowDecimals={false} ticks={years} />
            <YAxis yAxisId="qty" dataKey="y" type="number" scale="linear" name="eth" unit=" fdaix" width={100} range={[0, 'dataMax']} allowDecimals={false} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter yAxisId="qty" name="Dispersement Schedule" data={dispersement} fill="#8884d8" line/>
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

const WithdrawPage = () => {
  return (<Stack spacing={2}>
    <Card className="Card">
      <Box sx={{margin: 1}} className="section-title">Withdraw</Box>
      <Box sx={{margin: 1}}>
        <TextField
          label="Recipient Wallet Address"
          fullWidth
        />
      </Box>
      <Box sx={{margin: 1}}>
        <OutlinedInput label="Quantity" type="number" notched={false} endAdornment={<InputAdornment position="end">fdaix</InputAdornment>} />
        </Box>
      <Box sx={{margin: 1}}>
        <Button variant="contained" size="large" endIcon={<Send />} disabled>
          Send
        </Button>
      </Box>
    </Card>
  </Stack>);
}


const Dashboard = () => {
  const [tabValue, setTabValue] = useState("0");
  const handleTabChange = (_, newValue) => setTabValue(newValue);
  const tab = "0";
  return (
    <Box className="main-area">
      <TabContext value={tabValue}>
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Home" value="0" /> 
            <Tab label="Beneficiary Info" value="1" /> 
            <Tab label="Withdraw" value="2"/> 
          </Tabs>
        </Box>
        <TabPanel value="0"><StatusPage /></TabPanel>
        <TabPanel value="1"><BeneficiaryPage /></TabPanel>
        <TabPanel value="2"><WithdrawPage /></TabPanel>
      </TabContext>
    </Box>
  );
};

const LoginToMetamask = ({setLoggedInState}) => {
  return (<Box className="login-main-area">
    <Box sx={{ margin: 1 }} className="login-header">Login to Dribble Dapp</Box>
    <Box sx={{ margin: 1 }}>
      Connect your Metamask wallet to use Dribble Dapp
    </Box>
    <Button className="login-button" sx={{backgroundColor: "#e3d4bf", margin: 3 }} onClick={() => {
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
      <Box sx={{ fontSize: 20}}>Login to Metamask</Box>
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
        <header>
          Dribble Dapp
        </header>
        { this.state.loggedIn === "true" ? 
            <Dashboard /> :
            ( this.state.loggedIn === "false" ?
                <LoginToMetamask setLoggedInState={setLoggedInState} /> :
                <CheckingIfLoggedIn /> )
        }
        
      </div>
    );
  }
};
export default App;
