import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Booking() {
    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        email: "",
        date: "",
        lab: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Booking:", formData);
        // Aquí puedes hacer un fetch() para enviar la reserva a la API
        navigate("/");
    };

    return (
        <div className="bg-gray-50">
            {/* Navbar */}
            <nav className="bg-blue-600 p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold">Booking Register</h1>
                </div>
            </nav>

            {/* Formulario */}
            <main className="flex justify-center items-center min-h-screen">
                <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="studentId" className="text-lg font-medium text-gray-700">ID de Estudiante</label>
                            <input
                                type="text"
                                name="studentId"
                                id="studentId"
                                placeholder="Ingresa tu ID de Estudiante"
                                value={formData.studentId}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-lg font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Ingresa tu nombre completo"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-lg font-medium text-gray-700">Correo</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="date" className="text-lg font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lab" className="text-lg font-medium text-gray-700">Laboratorio</label>
                            <input
                                type="text"
                                name="lab"
                                id="lab"
                                placeholder="Ingresa el nombre del laboratorio"
                                value={formData.lab}
                                onChange={handleChange}
                                className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Guardar Booking
                            </button>
                        </div>
                    </form>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 mt-4 bg-gray-600 text-white text-lg font-medium rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                        Cancelar
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Booking;
