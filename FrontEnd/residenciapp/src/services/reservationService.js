import axios from "axios";

const API_URL = "http://localhost:4002";  

export const getReservations = async () => {
    try {
        const response = await axios.get(`${API_URL}/readreservations`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo reservaciones:", error);
        return [];
    }
};
