import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Box,
} from '@mui/material';

function App() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "https://bk27glct06.execute-api.us-east-1.amazonaws.com/default/booking";

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const filterPayload = {
                startDate: "",
                endDate: "",
            };

            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.data) {
                setBookings(data.data.bookings || []);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Booking Management
            </h1>

            <Button
                variant="contained"
                onClick={fetchBookings}
                sx={{ mb: 3 }}
            >
                Refresh Bookings
            </Button>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <div>Error: {error}</div>
                    <div>Please check your API configuration and try again.</div>
                </Alert>
            )}

            {!loading && !error && bookings.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No bookings found.
                </Alert>
            )}

            {bookings.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="booking table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Matricula</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Laboratorio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking, index) => (
                                <TableRow
                                    key={booking.idStudent || index}
                                    sx={{ '&:hover': { backgroundColor: 'grey.100' } }}
                                >
                                    <TableCell>{booking.idStudent}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>
                                        {new Date(booking.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{booking.laboratory}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default App;
