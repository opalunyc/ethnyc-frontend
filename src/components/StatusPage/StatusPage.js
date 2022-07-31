import { Box, Button, InputAdornment, Stack, OutlinedInput, LinearProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import React from 'react';
import { getWalletBalance, getWalletAddress, seeTokens, getDisbursementSchedule, addTokens } from '../../App';



export class StatusPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenBalance: 0,
        };
    }
    componentDidMount() {
        // TODO: Add check in call
    }
    componentWillUnmount() {
    }
    render() {
        const handleSendQtyChange = ({ target }) => {
            if (isNaN(target.value) || target.value < 0)
                return;
            this.setState({ sendQty: target.value });
        };
        const onSend = () => {
            if (isNaN(this.state.sendQty) || this.state.sendQty <= 0)
                return;
            addTokens(this.state.sendQty).then(console.log).catch(console.error);
        };
        return (<Stack spacing={2}>
            <Box className="Card">
                <Box sx={{ margin: 1 }} className="section-title">Add Tokens</Box>
                <Box sx={{ margin: 1 }}>
                    <OutlinedInput label="Quantity" type="number" value={this.state.sendQty} onChange={handleSendQtyChange} notched={false} endAdornment={<InputAdornment position="end">fdaix</InputAdornment>} sx={{ marginRight: 2 }} />
                    <Button variant="contained" size="large" endIcon={<Send />} disabled={isNaN(this.state.sendQty) || this.state.sendQty == 0} sx={{ borderRadius: 24 }} onClick={onSend}>
                        Deposit
                    </Button>
                </Box>
            </Box>
            <Box className="Card">
                <Box sx={{ margin: 1 }} className="section-title">Account Balance: {this.state.tokenBalance + " fdaix"}</Box>
            </Box>
            <Box className="Card">
                <Box sx={{ margin: 1 }}>
                    <Box className="section-title">Check-in Status:</Box>
                    <p>You are checked in!</p>
                </Box>
                <Box sx={{ margin: 1 }}>
                    <Box className="section-title">Next Check-in:</Box>
                    <p>Mock-Date</p>
                </Box>
                <Button variant="contained" disabled>
                    Check-In
                </Button>
            </Box>
        </Stack>);
    };
}
;
