import './App.css';
import { Box, Button, Card, InputAdornment, TextField, Stack, ToggleButtonGroup, ToggleButton, Tooltip, OutlinedInput} from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Scatter, ScatterChart, ResponsiveContainer } from 'recharts';
import * as R from 'ramda';
import React from 'react';

const ethInAccount = 1500;
const fastDispersement = [...R.repeat(0, 7), ...R.repeat(0, 54).map((_, x) => Math.pow((x+1)/54, 3))];
const mediumDispersement = [...R.repeat(0, 13), ...R.repeat(0, 108).map((_, x) => Math.pow((x+1)/108, 3))];
const slowDispersement = [...R.repeat(0, 19), ...R.repeat(0, 162).map((_, x) => Math.pow((x+1)/162, 3))];

const DispersementSchedule = ({value, onChange}) => {
  const dispersement = value === "fast" ? fastDispersement : ((value === "medium") ? mediumDispersement : slowDispersement);
  const dispersementData = dispersement.map((x, mo) => ({x: mo/12, y: x * ethInAccount }));
  console.log(dispersementData);
  return (
    <Card className="Card">
      <div className="section-title">Dispersement Schedule</div>
      <ToggleButtonGroup value={value} exclusive className="dispersement-speed-selector" onChange={onChange}>
        <ToggleButton value="fast">
          Fast Dispersement
        </ToggleButton>
        <ToggleButton value="medium">
          Medium Dispersement
        </ToggleButton>
        <ToggleButton value="slow">
          Slow Dispersement
        </ToggleButton>
      </ToggleButtonGroup>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart width={600} height={300} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="x" type="time" scale="linear" name="years" unit=" years" domain={[0, 'dataMax']} interval="preserveStartEnd" allowDecimals={false}/>
          <YAxis dataKey="y" type="number" scale="linear" name="eth" unit=" ethx" width={100} domain={[0, 'dataMax']} interval="preserveStartEnd" allowDecimals={false} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Dispersement Schedule" data={dispersementData} fill="#8884d8" line/>
        </ScatterChart>
      </ResponsiveContainer>
      
    </Card>
  );
};

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      schedule: 'medium'
    };
  }
  render() {
    const handleSchedule = (e, newSchedule) => this.setState({ schedule: newSchedule});
    return (
      <div className="App">
        <header>
          Safe Wallet
        </header>
        <div className="main-area">
          <Stack spacing={2}>
            <Card className="Card">
              <p>Your last check in was at June 25, 2022 1:31am.</p>
              <p>You must check in again before June 24, 2023 1:31am before dispersement begins.</p>
            </Card>
            <Card className="Card">
              <p>This is your wallet address: <strong>0x123797324001238098</strong></p>
              <p>Wallet Balance: <strong>{ethInAccount} ethx</strong></p>
            </Card>
            <Card className="Card">
              <div className="section-title">Withdraw</div>
              <TextField
                label="Recipient Wallet Address"
                fullWidth
              />
              <Box><OutlinedInput label="Quantity" type="number" endAdornment={<InputAdornment position="end">ethx</InputAdornment>} /></Box>
              <Button variant="contained" size="large">
                Send
              </Button>
            </Card>
            <Card className="Card">
              <TextField
                label="Beneficiary Address"
                fullWidth
              />
              <Button variant="contained" size="large">
                Update
              </Button>
            </Card>
            <DispersementSchedule value={this.state.schedule} onChange={handleSchedule} />
          </Stack>
        </div>
      </div>
    );
  }
};
export default App;
