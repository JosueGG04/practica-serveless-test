import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Box,
    IconButton,
    Tooltip,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Refresh as RefreshIcon,
    Book as BookIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [apiUrl, setApiUrl] = useState("https://9s6xkethbl.execute-api.us-east-1.amazonaws.com/default/booking");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newApiUrl, setNewApiUrl] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [apiUrl]); // Añadimos apiUrl como dependencia

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl, {
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

    const handleOpenDialog = () => {
        setNewApiUrl(apiUrl); // Precargamos la URL actual
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveApiUrl = () => {
        if (newApiUrl.trim()) {
            setApiUrl(newApiUrl.trim());
            setDialogOpen(false);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {[
                    { text: 'Bookings', icon: <BookIcon /> },
                    // { text: 'Students', icon: <PeopleIcon /> },
                ].map((item) => (
                    <ListItem button key={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static">
                    <Toolbar>
                        {/* ... contenido existente del Toolbar ... */}
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {drawerContent}
                </Drawer>

                <Container sx={{ mt: 4, mb: 4, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, width: '100%' }}>
                        <Typography variant="h4" component="h1">
                            Booking Management
                        </Typography>
                        <Box>
                            <Tooltip title="Change API URL">
                                <Button
                                    variant="outlined"
                                    onClick={handleOpenDialog}
                                    sx={{ mr: 2 }}
                                >
                                    Change API
                                </Button>
                            </Tooltip>
                            <Tooltip title="Refresh booking list">
                                <Button
                                    variant="contained"
                                    startIcon={<RefreshIcon />}
                                    onClick={fetchBookings}
                                >
                                    Refresh
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Diálogo para cambiar la API URL */}
                    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Change API URL</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="API URL"
                                type="url"
                                fullWidth
                                value={newApiUrl}
                                onChange={(e) => setNewApiUrl(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleSaveApiUrl}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <Typography>Error: {error}</Typography>
                            <Typography>Please check your API configuration and try again.</Typography>
                        </Alert>
                    )}

                    {!loading && !error && bookings.length === 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            No bookings found.
                        </Alert>
                    )}

                    {bookings.length > 0 && (
                        <TableContainer component={Paper} elevation={3} sx={{ overflowX: 'auto', width: '100%' }}>
                            <Table sx={{ width: '100%' }} aria-label="booking table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Matricula</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Laboratorio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((booking, index) => (
                                        <TableRow
                                            key={booking.idStudent || index}
                                            sx={{
                                                '&:hover': { backgroundColor: 'grey.100' },
                                                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                                            }}
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
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;