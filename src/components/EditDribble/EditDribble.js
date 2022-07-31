import { Box, Button, TextField, Stack, LinearProgress } from '@mui/material';
import React from 'react';
import { DisbursementSchedule } from '../DisbursementSchedule/DisbursementSchedule';
import { getBeneficiaryAddress, getDisbursementSchedule, sendDisbursementSchedule, sendBeneficiaryAddress } from '../../App';



export class EditDribble extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beneficiaryAddress: "",
            schedule: "MEDIUM",
            i: "loading",
            beneficiarySchedule: "",
        };
    }
    componentDidMount() {

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

        };
        const clickUpdateBeneficiary = () => {
            if (this.state.beneficiaryAddress.length != 42)
                return;
            sendBeneficiaryAddress(this.state.beneficiaryAddress);
        };
        return (<Stack spacing={2}>
            <Box className="Card">
                <Box className="section-title" sx={{ margin: 1 }}>Update Beneficiary Address</Box>

                <>
                    <Box sx={{ margin: 1 }}>
                        <TextField
                            label="Beneficiary Address"
                            fullWidth
                            className="input-elements"
                            value={this.state.beneficiaryAddress}
                            onChange={updateBeneficary} />
                    </Box>
                    <Box sx={{ margin: 1 }}>
                        <Button variant="contained" size="large" sx={{ borderRadius: 6 }} disabled={this.state.beneficiaryAddress.length != 42 || this.state.beneficiaryAddressStatus != "changed"} onClick={clickUpdateBeneficiary}>
                            Update
                        </Button>
                    </Box>
                </>
            </Box>
            {this.state.beneficiaryScheduleStatus != "loading" ?
                <DisbursementSchedule value={this.state.beneficiarySchedule} onChange={handleSchedule} /> :
                <LinearProgress />}



        </Stack>);
    }
}
;
