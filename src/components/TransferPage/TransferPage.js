import { Box, Button, InputAdornment, TextField, Stack, OutlinedInput } from '@mui/material';
import { Send } from '@mui/icons-material';
import React from 'react';

export const TransferPage = () => {
    return (<Stack spacing={2}>
        <Box className="Card">
            <Box sx={{ margin: 1 }} className="section-title">Transfer</Box>
            <Box sx={{ margin: 1 }}>
                <TextField
                    label="Recipient Wallet Address"
                    fullWidth />
            </Box>
            <Box sx={{ margin: 1 }}>
                <OutlinedInput label="Quantity" type="number" notched={false} endAdornment={<InputAdornment position="end">fdaix</InputAdornment>} />
            </Box>
            <Box sx={{ margin: 1 }}>
                <Button variant="contained" size="large" endIcon={<Send />} disabled sx={{ borderRadius: 24 }}>
                    Send
                </Button>
            </Box>
        </Box>
    </Stack>);
};
