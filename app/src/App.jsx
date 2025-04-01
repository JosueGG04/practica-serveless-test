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
    Add as AddIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { setHours, setMinutes } from 'date-fns';
// import { es } from 'date-fns/locale'; // Para español, opcional

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

// Componente para la lista de Bookings
function BookingList({ apiUrl, setApiUrl }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newApiUrl, setNewApiUrl] = useState(apiUrl);
    const navigate = useNavigate(); // Hook para navegación programática

    useEffect(() => {
        fetchBookings();
    }, [apiUrl]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setBookings(data.data?.bookings || []);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setNewApiUrl(apiUrl);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => setDialogOpen(false);

    const handleSaveApiUrl = () => {
        if (newApiUrl.trim()) {
            setApiUrl(newApiUrl.trim());
            setDialogOpen(false);
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Booking Management</Typography>
                <Box>
                    <Tooltip title="Change API URL">
                        <Button variant="outlined" onClick={handleOpenDialog} sx={{ mr: 2 }}>
                            Change API
                        </Button>
                    </Tooltip>
                    <Tooltip title="Refresh booking list">
                        <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchBookings}>
                            Refresh
                        </Button>
                    </Tooltip>
                </Box>
            </Box>

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

            {loading && <CircularProgress />}
            {error && <Alert severity="error">Error: {error}</Alert>}
            {!loading && !error && bookings.length === 0 && <Alert severity="warning">No bookings found.</Alert>}
            {bookings.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
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
                                <TableRow key={booking.idStudent || index}>
                                    <TableCell>{booking.idStudent}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.laboratory}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

function BookingForm({ apiUrl }) {
    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        email: "",
        date: Date,
        lab: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleDateChange = (newDate) => {
        // Forzamos los minutos a 0 para que siempre sea una hora completa
        if (newDate) {
            newDate = setMinutes(newDate, 0);
        }
        setFormData({ ...formData, date: newDate });
    };

    // Función auxiliar para formatear la fecha al formato "YYYY-MM-DDTHH:mm:ss"
    const formatDateToApi = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0-11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idStudent: formData.studentId,
                    name: formData.name,
                    email: formData.email,
                    date: formData.date ? formatDateToApi(formData.date) : null, // Usamos la función auxiliar
                    laboratory: formData.lab
                }),
            });
            if (!response.ok) throw new Error('Error al guardar la reserva');
            console.log("Submitted Booking:", formData);
            navigate("/bookings");
        } catch (err) {
            console.error("Error submitting booking:", err);
            alert("Hubo un error al guardar la reserva. Intenta de nuevo.");
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Registrar Nueva Reserva
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="ID de Estudiante"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        margin="normal"
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Correo"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        variant="outlined"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Fecha y Hora"
                            value={formData.date}
                            onChange={handleDateChange}
                            minDate={new Date()} // No permite fechas pasadas
                            minTime={setHours(setMinutes(new Date(), 0), 7)} // 8:00
                            maxTime={setHours(setMinutes(new Date(), 0), 21)} // 21:00
                            views={['day', 'hours']} // Solo muestra días y horas, no minutos
                            format="dd/MM/yyyy HH:00" // Formato de 24 horas sin minutos
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    error={!formData.date && params.error}
                                />
                            )}
                            ampm={false}
                        />
                    </LocalizationProvider>
                    <TextField
                        fullWidth
                        label="Laboratorio"
                        name="lab"
                        value={formData.lab}
                        onChange={handleChange}
                        margin="normal"
                        required
                        variant="outlined"
                    />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Guardar Reserva
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => navigate("/bookings")}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

//Componente para la lista de Bookings pasados
function OldBookingList({ apiUrl, setApiUrl }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newApiUrl, setNewApiUrl] = useState(apiUrl);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();


    // useEffect(() => {
    //     fetchBookings();
    // }, [apiUrl]);

    // Función auxiliar para formatear la fecha al formato "YYYY-MM-DDTHH:mm:ss"
    const formatDateToApi = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0-11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const fetchBookings = async (filter = {}) => {
        try {
            setLoading(true);
            const requestBody = {
                startDate: formatDateToApi(filter.startDate),
                endDate: formatDateToApi(filter.endDate),
            }

            console.log(requestBody)

            const response = await fetch(apiUrl,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setBookings(data.data?.bookings || []);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterBookings = () => {
        if (startDate && endDate) {
            fetchBookings({ startDate, endDate });
        } else {
            alert("Por favor selecciona ambas fechas para filtrar.");
        }
    };

    const handleOpenDialog = () => {
        setNewApiUrl(apiUrl);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => setDialogOpen(false);

    const handleSaveApiUrl = () => {
        if (newApiUrl.trim()) {
            setApiUrl(newApiUrl.trim());
            setDialogOpen(false);
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Booking Management</Typography>
                <Box>
                    <Tooltip title="Change API URL">
                        <Button variant="outlined" onClick={handleOpenDialog} sx={{ mr: 2 }}>
                            Change API
                        </Button>
                    </Tooltip>
                    <Tooltip title="Refresh booking list">
                        <Button variant="contained" startIcon={<RefreshIcon />} onClick={() => fetchBookings()}>
                            Refresh
                        </Button>
                    </Tooltip>
                </Box>
            </Box>

            {/* Nueva sección de filtro por fechas */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Fecha de Inicio"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        maxDate={endDate || new Date()} // No permite fechas futuras a endDate o hoy
                        minTime={setHours(setMinutes(new Date(), 0), 7)} // 8:00
                        maxTime={setHours(setMinutes(new Date(), 0), 21)} // 21:00
                        views={['day', 'hours']} // Solo muestra días y horas, no minutos
                        format="dd/MM/yyyy HH:00" // Formato de 24 horas sin minutos
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                        )}
                        ampm={false}
                    />
                    <DateTimePicker
                        label="Fecha de Fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate} // No permite fechas anteriores a startDate
                        maxDate={new Date()} // No permite fechas futuras
                        minTime={setHours(setMinutes(new Date(), 0),  8)} // 8:00
                        maxTime={setHours(setMinutes(new Date(), 0), 21)} // 21:00
                        views={['day', 'hours']} // Solo muestra días y horas, no minutos
                        format="dd/MM/yyyy HH:00" // Formato de 24 horas sin minutos
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                        )}
                        ampm={false}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterBookings}
                >
                    Filtrar
                </Button>
            </Box>

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

            {loading && <CircularProgress />}
            {error && <Alert severity="error">Error: {error}</Alert>}
            {!loading && !error && bookings.length === 0 && <Alert severity="warning">No bookings found.</Alert>}
            {bookings.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
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
                                <TableRow key={booking.idStudent || index}>
                                    <TableCell>{booking.idStudent}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.laboratory}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

// Componente principal App
function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [apiUrl, setApiUrl] = useState("https://a2uh23li58.execute-api.us-east-1.amazonaws.com/default/booking");

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
        setDrawerOpen(open);
    };

    const drawerContent = (
        <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
            <List>
                <ListItem button component={Link} to="/bookings">
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Bookings" />
                </ListItem>
                <ListItem button component={Link} to="/new-booking">
                    <ListItemIcon><AddIcon /></ListItemIcon>
                    <ListItemText primary="New Booking" />
                </ListItem>
                <ListItem button component={Link} to="/old-bookings">
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Old Bookings" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                Booking App
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                        {drawerContent}
                    </Drawer>

                    <Routes>
                        <Route path="/bookings" element={<BookingList apiUrl={apiUrl} setApiUrl={setApiUrl} />} />
                        <Route path="/new-booking" element={<BookingForm apiUrl={apiUrl} />} />
                        <Route path="/" element={<BookingList apiUrl={apiUrl} setApiUrl={setApiUrl} />} />
                        <Route path="/old-bookings" element={<OldBookingList apiUrl={apiUrl} setApiUrl={setApiUrl} />} />
                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;