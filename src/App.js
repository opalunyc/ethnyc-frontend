import './App.css';
import logo from './logo.png';
import metamaskFox from './MetaMask_Fox.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { Box, Button, Card, InputAdornment, TextField, Stack, Tab, Tabs, ToggleButtonGroup, ToggleButton, Tooltip, OutlinedInput, Skeleton, LinearProgress} from '@mui/material';
import Typography from "@mui/material/Typography";
import { Send } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { CartesianGrid, XAxis, YAxis, Scatter, ScatterChart, ResponsiveContainer } from 'recharts';
import * as R from 'ramda';
import React, { useState } from 'react';
import { dark } from '@mui/material/styles/createPalette';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const theme = createTheme({
  typography: {
    fontFamily: ['DM Sans'],
  },
  
  palette: {
    mode: "dark",
  //   primary: {
  //     // light: will be calculated from palette.primary.main,
  //     main: '#ff4400',
  //     // dark: will be calculated from palette.primary.main,
  //     // contrastText: will be calculated to contrast with palette.primary.main
  //   },
  //   secondary: {
  //     light: '#0066ff',
  //     main: '#0044ff',
  //     // dark: will be calculated from palette.secondary.main,
  //     contrastText: '#ffcc00',
  //   },
  //   // Used by `getContrastText()` to maximize the contrast between
  //   // the background and the text.
  //   contrastThreshold: 3,
  //   // Used by the functions below to shift a color's luminance by approximately
  //   // two indexes within its tonal palette.
  //   // E.g., shift from Red 500 to Red 300 or Red 700.
  //   tonalOffset: 0.2,
  },
});

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

const getWalletAddress = async () => {
  await sleep(10);
  return "0xc994f5ea0ba39494ce839613fffba74279579268"
};

const getWalletBalance = async () => {
  await sleep(10);
  return 2000;
};

const getBeneficiaryAddress = async () => {
  await sleep(10);
  return "0xb794f5ea0ba39494ce839613fffba74279579268";
};

const sendBeneficiaryAddress = async (address) => {
  await sleep(10);
  return "0xb794f5ea0ba39494ce839613fffba74279579268";
}

const getLastCheckInDate = async () => {
  await sleep(10);
  return Date.now();
};

const checkIn = async (address) => {
  await sleep(10);
  return Date.now();
}

const getDispersementSchedule = async () => {
  await sleep(10);
  return "medium";
};

const sendDispersementSchedule = async (plan) => {
  await sleep(10);
  return "medium";
}

const sendWithdrawal = async (address, amount) => {
  await sleep(10);
}


class StatusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCheckInDate: null,
      checkInStatus: null,
      walletAddress: null,
      walletBalance: null,
      checkInBy: "[UNKNOWN DATE]",
    };
  }
  componentDidMount() {
    // TODO: Add check in call
    getLastCheckInDate().then(date => this.setState({ lastCheckInDate: date }));
    getWalletBalance().then(balance => this.setState({ walletBalance: balance }));
    getWalletAddress().then(address => this.setState({ walletAddress: address }));
    
  }
  render() {
    return (<Stack spacing={2}>
      <Box className="Card">
        {this.state.lastCheckInDate ? 
          <Box sx={{margin:1}}>
            <Box className="section-title">Check-in Status</Box>
            <p>Your last check in was at {this.state.lastCheckInDate}.</p>
            <p>You must check in again before {this.state.checkInBy} before dispersement begins.</p>
          </Box> : <Skeleton animation="wave" />}
      </Box>
      <Box className="Card">
        <Box sx={{margin:1}}>
          <Box className="section-title">Your Dribble Dapp Info</Box>
          <p>This is your Dribble Dapp address: {this.state.walletAddress ? <>{this.state.walletAddress}</> : <LinearProgress />}</p>
          <p>Dribble Dapp Balance: {this.state.walletBalance != null ? <>{this.state.walletBalance}  fdaix</> : <LinearProgress />}</p>
        </Box>
      </Box>
    </Stack>);
  };
};

class BeneficiaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beneficiaryAddressStatus: "loading",
      beneficiaryAddress: "",
      schedule: "medium",
      beneficaryScheduleStatus: "loading",
      beneficarySchedule: "",
    };
  }
  componentDidMount() {
    getBeneficiaryAddress().then(address => {
      this.setState({
        beneficiaryAddressStatus: "ready",
        beneficiaryAddress: address,
      });
    });
    getDispersementSchedule().then(schedule => {
      this.setState({
        beneficaryScheduleStatus: "ready",
        beneficarySchedule: schedule,
      });
    });
  }
  render() {
    const handleSchedule = (e, newSchedule) => {
      const oldSchedule = this.state.schedule;
      this.setState({ beneficarySchedule: newSchedule });
      sendDispersementSchedule(newSchedule).catch(error => {
        this.setState({ beneficarySchedule: oldSchedule });
      });
    };
    return (<Stack spacing={2}>
      <Box className="Card">
        <Box className="section-title" sx={{ margin: 1}}>Update Beneficiary Address</Box>
          {this.state.beneficiaryAddressStatus === "ready" ? 
            <>
              <Box sx={{ margin: 1}}>
                <TextField
                  label="Beneficiary Address"
                  fullWidth
                  className="input-elements"
                  disabled
                /> 
              </Box>
              <Box sx={{ margin: 1}}>
                <Button variant="contained" size="large" sx={{ borderRadius: 6 }}>
                  Update
                </Button>
              </Box>
            </>
          : <LinearProgress />}
      </Box>
      {this.state.beneficaryScheduleStatus === "ready" ? 
        <DispersementSchedule value={this.state.beneficarySchedule} onChange={handleSchedule} /> :
        <LinearProgress />
      }
      
    </Stack>);
  }
};
const DispersementSchedule = ({value, onChange}) => {
  const dispersement = value === "fast" ? fastDispersement : ((value === "medium") ? mediumDispersement : slowDispersement);
  const years = R.repeat(0, (dispersement[dispersement.length-1].x)).map((_, year) => year);
  console.log(years);
  
  return (
    <Box className="Card">
      <Box sx={{ margin: 1 }}>
        <Box className="section-title">Change Dispersement Schedule</Box>
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
    </Box>
  );
};

const WithdrawPage = () => {
  return (<Stack spacing={2}>
    <Box className="Card">
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
        <Button variant="contained" size="large" endIcon={<Send />} disabled sx={{ borderRadius: 24 }}>
          Send
        </Button>
      </Box>
    </Box>
  </Stack>);
}


const Dashboard = () => {
  const [tabValue, setTabValue] = useState("0");
  const handleTabChange = (_, newValue) => setTabValue(newValue);
  const tab = "0";
  return (
    <Box className="main-area blur-background">
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
        <ThemeProvider theme={theme}>
          <header>
            <img src={logo} width="48" height="48" style={{bottom:-7, position: "relative", marginRight: 12}} />Dribble Dapp
          </header>
          { this.state.loggedIn === "true" ? 
              <Dashboard /> :
              ( this.state.loggedIn === "false" ?
                  <LoginToMetamask setLoggedInState={setLoggedInState} /> :
                  <CheckingIfLoggedIn /> )
          }
        </ThemeProvider>
      </div>
    );
  }
};
export default App;
