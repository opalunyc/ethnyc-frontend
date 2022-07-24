import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Scatter, ScatterChart, ResponsiveContainer } from 'recharts';
import * as R from 'ramda';
import React from 'react';
import { fastDisbursement, mediumDisbursement, slowDisbursement } from '../../App';

export const DisbursementSchedule = ({ value, onChange }) => {
    const disbursement = value === "SHORT" ? fastDisbursement : ((value === "MEDIUM") ? mediumDisbursement : slowDisbursement);
    const years = R.repeat(0, (disbursement[disbursement.length - 1].x)).map((_, year) => year);

    return (
        <Box className="Card">
            <Box sx={{ margin: 1 }}>
                <Box className="section-title">Change Disbursement Schedule</Box>
                <ToggleButtonGroup value={value} exclusive className="disbursement-speed-selector" onChange={onChange}>
                    <ToggleButton value="LONG">
                        Slow Disbursement
                    </ToggleButton>
                    <ToggleButton value="MEDIUM">
                        Medium Disbursement
                    </ToggleButton>
                    <ToggleButton value="SHORT">
                        Fast Disbursement
                    </ToggleButton>
                    <ToggleButton value="INSTANT" disabled>
                        Instant Disbursement
                    </ToggleButton>
                </ToggleButtonGroup>
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart width={600} height={300} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="x" type="number" scale="linear" name="years" unit=" years" range={[0, disbursement.length / 12]} allowDecimals={false} ticks={years} />
                        <YAxis yAxisId="qty" dataKey="y" type="number" scale="linear" name="eth" unit=" fdaix" width={100} range={[0, 'dataMax']} allowDecimals={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter yAxisId="qty" name="Disbursement Schedule" data={disbursement} fill="#8884d8" line />
                    </ScatterChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};
