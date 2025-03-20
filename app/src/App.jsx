import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API endpoint URL - replace with your actual API Gateway URL
    const API_URL = "https://your-api-gateway-url.execute-api.your-region.amazonaws.com/prod/bookings";

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            // Example filter payload - adjust based on your FilterBookingList requirements
            const filterPayload = {
                // Add filter properties as needed
                startDate: "",
                endDate: "",
            };

            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify(filterPayload)  // For GET requests with body
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            // Assuming data structure has a 'data' property containing bookings array
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

            <button
                onClick={fetchBookings}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Refresh Bookings
            </button>

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

export default App
