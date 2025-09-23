const jwt = require('jsonwebtoken');
const clientMiddleware =(req, res, next)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autorizado, token requerido' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        req.user = decoded; // Guarda los datos del usuario en la request
        next(); // Pasa al siguiente middleware
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
module.exports ={clientMiddleware}