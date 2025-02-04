require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9000; // Puerto de la API Gateway

app.use(cors()); // Permitir CORS
app.use(express.json()); // Soporte para JSON en las solicitudes

// 🔹 Mapeo de rutas a microservicios
const services = {
    properties: {
        create: { target: 'http://localhost:3001/cproperties', method: 'POST' },
        read: { target: 'http://localhost:3002/rproperties', method: 'GET' },
        update: { target: 'http://localhost:3003/upproperties/:id', method: 'PUT', dynamic: true },
        delete: { target: 'http://localhost:3004/dproperties/:id', method: 'DELETE', dynamic: true }
    },
    students: {
        create: { target: 'http://localhost:6001/cstudents', method: 'POST' },
        read: { target: 'http://localhost:6002/rstudents', method: 'GET' },
        update: { target: 'http://localhost:6003/upstudents/:id', method: 'PUT', dynamic: true },
        delete: { target: 'http://localhost:6004/dstudents/:id', method: 'DELETE', dynamic: true }
    },
    owners: {
        create: { target: 'http://localhost:7001/cowners', method: 'POST' },
        read: { target: 'http://localhost:7002/rowners', method: 'GET' },
        update: { target: 'http://localhost:7003/upowners/:id', method: 'PUT', dynamic: true },
        delete: { target: 'http://localhost:7004/downers/:id', method: 'DELETE', dynamic: true }
    },
    reservations: {
        create: { target: 'http://localhost:4001/creservations', method: 'POST' },
        read: { target: 'http://localhost:4002/readreservations', method: 'GET' },
        update: { target: 'http://localhost:4003/upreservations/:id', method: 'PUT', dynamic: true },
        delete: { target: 'http://localhost:4004/dreservations/:id', method: 'DELETE', dynamic: true }
    }
};

// 🔹 Configurar dinámicamente los proxies para los microservicios
Object.entries(services).forEach(([service, endpoints]) => {
    Object.entries(endpoints).forEach(([action, config]) => {
        const route = config.dynamic ? `/${service}/${action}/:id` : `/${service}/${action}`;
        console.log(`✅ Registrando proxy: ${route} -> ${config.target}`);

        app.use(route, createProxyMiddleware({
            target: config.target,
            changeOrigin: true,
            pathRewrite: (path, req) => {
                if (config.dynamic) {
                    const id = req.params.id; // Obtener el ID de la URL
                    return `/${id}`;
                }
                return path;
            },
            onProxyReq: (proxyReq, req, res) => {
                if (req.method === 'POST' || req.method === 'PUT') {
                    if (req.body) {
                        const bodyData = JSON.stringify(req.body);
                        proxyReq.setHeader('Content-Type', 'application/json');
                        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                        proxyReq.write(bodyData);
                    }
                }
            },
            onError: (err, req, res) => {
                console.error(`Error en el proxy: ${err.message}`);
                res.status(500).send('Error en el Gateway');
            }
        }));
    });
});

// 🔹 Endpoint de prueba
app.get('/', (req, res) => {
    res.send('API Gateway funcionando correctamente 🚀');
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
