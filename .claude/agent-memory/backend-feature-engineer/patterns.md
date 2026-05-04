# Patrones Reutilizables — PipoApp Backend

## Importacion masiva desde Excel (multer + xlsx)

### Estructura de archivos
- Configuracion multer + handler en el mismo controller file.
- La ruta usa un wrapper callback de multer para manejar errores de archivo ANTES del handler principal.

### Controller (fragmento de clienteController.js)
```js
// Al inicio del controller:
const multer = require('multer');
const XLSX = require('xlsx');

exports.uploadExcel = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => { /* validar extension */ },
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('archivo'); // nombre del campo multipart

exports.importarXxxExcel = async (req, res) => {
    if (!req.file) return ResponseHandler.sendValidationError(res, "...");
    // 1. XLSX.read(req.file.buffer, { type: 'buffer' })
    // 2. sheet_to_json con defval: ''
    // 3. Normalizar headers a snake_case
    // 4. Validar campos requeridos fila por fila → filas_con_error[]
    // 5. findAll con Op.in para detectar duplicados EN UNA SOLA QUERY
    // 6. bulkCreate({ validate: true }) + fallback fila-por-fila si falla
    // 7. ResponseHandler.sendCreated con resumen { total_filas, creados, omitidos_duplicados, errores, filas_con_error }
};
```

### Ruta (fragmento de xxxRoutes.js)
```js
router.post(
    '/importar-excel',
    (req, res, next) => {
        XxxController.uploadExcel(req, res, (err) => {
            if (err) return res.status(422).json({ error: true, status: 422, message: err.message, data: null, timestamp: new Date().toISOString() });
            next();
        });
    },
    XxxController.importarXxxExcel
);
// IMPORTANTE: esta ruta debe ir ANTES de router.post('/', ...) para que Express no confunda paths
```

### MIME types aceptados para Excel
```js
const MIMETYPES_EXCEL = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel',   // .xls
    'application/octet-stream'    // fallback — algunos SO/browsers envian este tipo
];
// Ademas validar por extension .xlsx / .xls como doble comprobacion
```

### Resumen de respuesta estandar para importaciones
```json
{
  "total_filas": N,
  "creados": N,
  "omitidos_duplicados": N,
  "errores": N,
  "filas_con_error": [{ "fila": N, "numero_documento": "...", "motivo": "..." }]
}
```
