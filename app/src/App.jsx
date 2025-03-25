import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [newBooking, setNewBooking] = useState({
        studentId: '',
        name: '',
        email: '',
        date: '',
        laboratory: ''
    });

    // API endpoint URL - replace with your actual API Gateway URL
    const API_URL = "https://avc4k7skn2.execute-api.us-east-1.amazonaws.com/default/booking";

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías hacer la llamada a la API para registrar el booking.
        console.log("New Booking Data:", newBooking);

        // Resetea el formulario y cierra el modal
        setNewBooking({
            studentId: '',
            name: '',
            email: '',
            date: '',
            laboratory: ''
        });
        setShowRegisterForm(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
            <div className="flex mb-6">
                <button
                    onClick={fetchBookings}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
                >
                    Refresh Bookings
                </button>
                <button
                    onClick={() => setShowRegisterForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Register Booking
                </button>
            </div>

            {/* Modal del formulario de Register Booking */}
            {showRegisterForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Register Booking</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">ID de estudiante</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={newBooking.studentId}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newBooking.name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Correo</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newBooking.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={newBooking.date}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Laboratorio</label>
                                <input
                                    type="text"
                                    name="laboratory"
                                    value={newBooking.laboratory}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterForm(false)}
                                    className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    Submit Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center p-4">
                    <p className="text-gray-600">Loading bookings...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error: {error}</p>
                    <p className="text-sm">Please check your API configuration and try again.</p>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>No bookings found.</p>
                </div>
            )}

            {bookings.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Date</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={booking.id || index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b border-gray-200">{booking.id}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{booking.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {new Date(booking.date).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
