import { Box, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import React, { useState } from 'react';
import { TransferPage } from '../TransferPage/TransferPage';
import { EditDribble } from "../EditDribble/EditDribble";
import { StatusPage } from "../StatusPage/StatusPage";

export const Dashboard = () => {
    const [tabValue, setTabValue] = useState("0");
    const handleTabChange = (_, newValue) => setTabValue(newValue);
    const tab = "0";
    return (
        <Box className="main-area blur-background">
            <TabContext value={tabValue}>
                <Box>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Account Status" value="0" />
                        <Tab label="Edit Dribble" value="1" />
                        <Tab label="Transfer" value="2" />
                    </Tabs>
                </Box>
                <TabPanel value="0"><StatusPage /></TabPanel>
                <TabPanel value="1"><EditDribble /></TabPanel>
                <TabPanel value="2"><TransferPage /></TabPanel>
            </TabContext>
        </Box>
    );
};
