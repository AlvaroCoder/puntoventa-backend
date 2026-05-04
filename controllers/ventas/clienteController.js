const { Op } = require('sequelize');
const multer = require('multer');
const XLSX = require('xlsx');
const ResponseHandler = require('../../lib/responseHanlder');
const Cliente = require('../../models/ventas/cliente');

const MIMETYPES_EXCEL = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'application/vnd.ms-excel',                                       
    'application/octet-stream'  
];

const storageExcel = multer.memoryStorage();

const fileFilterExcel = (req, file, cb) => {
    const extension = file.originalname.toLowerCase();
    if (MIMETYPES_EXCEL.includes(file.mimetype) || extension.endsWith('.xlsx') || extension.endsWith('.xls')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos Excel (.xlsx o .xls)'), false);
    }
};

exports.uploadExcel = multer({
    storage: storageExcel,
    fileFilter: fileFilterExcel,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('archivo');

exports.getAllClientesByIdEmpresa = async (req, res) => {
    try {
        const { categoria } = req.query; 
        
        let whereClause = {
            empresa_id: req.params.id
        };

        if (categoria) {
            whereClause.categoria = categoria;
        }

        const clientes = await Cliente.findAll({
            where: whereClause,
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Clientes de la empresa obtenidos exitosamente", {
            data: clientes,
            count: clientes.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getClienteByNumeroDocumento = async (req, res) => {
    try {
        const { empresa_id } = req.query; 
        
        let whereClause = {
            numero_documento: req.params.numero_documento
        };

        if (empresa_id) {
            whereClause.empresa_id = empresa_id;
        }

        const cliente = await Cliente.findOne({
            where: whereClause
        });

        if (!cliente) {
            return ResponseHandler.sendNotFound(res, "Cliente no encontrado");
        }

        ResponseHandler.sendSuccess(res, "Cliente encontrado", cliente);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return ResponseHandler.sendNotFound(res, "Cliente no encontrado"); // CORRECCIÓN: Validar existencia
        }

        ResponseHandler.sendSuccess(res, "Cliente encontrado", cliente);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.validacionCliente = async (req, res) => {
    try {
        const { email, numero_documento, empresa_id } = req.query;
        
        if (!empresa_id) {
            return ResponseHandler.sendValidationError(res, "El parámetro empresa_id es requerido");
        }

        let whereClause = { empresa_id };

        if (email && numero_documento) {
            whereClause[Op.or] = [
                { email: email },
                { numero_documento: numero_documento }
            ];
        } else if (email) {
            whereClause.email = email;
        } else if (numero_documento) {
            whereClause.numero_documento = numero_documento;
        } else {
            return ResponseHandler.sendValidationError(res, "Debe proporcionar email o numero_documento");
        }

        const clienteExistente = await Cliente.findOne({ where: whereClause });

        ResponseHandler.sendSuccess(res, "Validación completada", {
            existe: !!clienteExistente,
            cliente: clienteExistente || null
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createCliente = async (req, res) => {
    try {
        const { empresa_id, numero_documento, email } = req.body;

        if (!empresa_id || !numero_documento || !req.body.nombre_completo) {
            return ResponseHandler.sendValidationError(res, "empresa_id, numero_documento y nombre_completo son requeridos");
        }

        const clienteExistente = await Cliente.findOne({
            where: {
                empresa_id: empresa_id,
                numero_documento: numero_documento
            }
        });

        if (clienteExistente) {
            return ResponseHandler.sendValidationError(res, "Ya existe un cliente con este número de documento en la empresa");
        }

        if (email) {
            const clienteConEmail = await Cliente.findOne({
                where: {
                    empresa_id: empresa_id,
                    email: email
                }
            });

            if (clienteConEmail) {
                return ResponseHandler.sendValidationError(res, "Ya existe un cliente con este email en la empresa");
            }
        }

        const cliente = await Cliente.create(req.body);
        ResponseHandler.sendCreated(res, "Cliente creado exitosamente", cliente);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return ResponseHandler.sendNotFound(res, "Cliente no encontrado");
        }

        if (req.body.numero_documento && req.body.numero_documento !== cliente.numero_documento) {
            const clienteConDocumento = await Cliente.findOne({
                where: {
                    empresa_id: cliente.empresa_id,
                    numero_documento: req.body.numero_documento,
                    id: { [Op.ne]: cliente.id }
                }
            });

            if (clienteConDocumento) {
                return ResponseHandler.sendValidationError(res, "Ya existe otro cliente con este número de documento en la empresa");
            }
        }

        if (req.body.email && req.body.email !== cliente.email) {
            const clienteConEmail = await Cliente.findOne({
                where: {
                    empresa_id: cliente.empresa_id,
                    email: req.body.email,
                    id: { [Op.ne]: cliente.id }
                }
            });

            if (clienteConEmail) {
                return ResponseHandler.sendValidationError(res, "Ya existe otro cliente con este email en la empresa");
            }
        }

        await cliente.update(req.body);
        ResponseHandler.sendSuccess(res, "Cliente actualizado exitosamente", cliente);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return ResponseHandler.sendNotFound(res, "Cliente no encontrado");
        }

        await cliente.destroy();
        ResponseHandler.sendSuccess(res, "Cliente eliminado exitosamente");

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateCategoriaCliente = async (req, res) => {
    try {
        const { categoria } = req.body;
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return ResponseHandler.sendNotFound(res, "Cliente no encontrado");
        }

        const categoriasValidas = ['REGULAR', 'DEUDOR', 'RESPONSABLE'];
        if (!categoriasValidas.includes(categoria)) {
            return ResponseHandler.sendValidationError(res, "Categoría no válida. Debe ser: REGULAR, DEUDOR o RESPONSABLE");
        }

        await cliente.update({ categoria });
        ResponseHandler.sendSuccess(res, "Categoría del cliente actualizada exitosamente", cliente);

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.searchClientes = async (req, res) => {
    try {
        const { termino } = req.params;
        const { empresa_id, categoria } = req.query;

        if (!empresa_id) {
            return ResponseHandler.sendValidationError(res, "El parámetro empresa_id es requerido");
        }

        let whereClause = {
            empresa_id: empresa_id,
            [Op.or]: [
                { nombre_completo: { [Op.like]: `%${termino}%` } },
                { numero_documento: { [Op.like]: `%${termino}%` } },
                { email: { [Op.like]: `%${termino}%` } }
            ]
        };

        if (categoria) {
            whereClause.categoria = categoria;
        }

        const clientes = await Cliente.findAll({
            where: whereClause,
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Búsqueda de clientes completada", {
            data: clientes,
            count: clientes.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.getClientesByCategoria = async (req, res) => {
    try {
        const { empresa_id } = req.query;
        const { categoria } = req.params;

        if (!empresa_id) {
            return ResponseHandler.sendValidationError(res, "El parámetro empresa_id es requerido");
        }

        const categoriasValidas = ['REGULAR', 'DEUDOR', 'RESPONSABLE'];
        if (!categoriasValidas.includes(categoria)) {
            return ResponseHandler.sendValidationError(res, "Categoría no válida");
        }

        const clientes = await Cliente.findAll({
            where: {
                empresa_id: empresa_id,
                categoria: categoria
            },
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, `Clientes de categoría ${categoria} obtenidos exitosamente`, {
            data: clientes,
            count: clientes.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.verificarDocumentoCliente = async (req, res) => {
    try {
        const { documento } = req.params;
        const { empresa_id, exclude_id } = req.query;

        if (!empresa_id) {
            return ResponseHandler.sendValidationError(res, "El parámetro empresa_id es requerido");
        }

        let whereClause = {
            empresa_id: empresa_id,
            numero_documento: documento
        };

        if (exclude_id) {
            whereClause.id = { [Op.ne]: exclude_id };
        }

        const clienteExistente = await Cliente.findOne({ where: whereClause });

        ResponseHandler.sendSuccess(res, "Verificación de documento completada", {
            disponible: !clienteExistente,
            documento: documento
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

const COLUMNAS_VALIDAS = ['numero_documento', 'nombre_completo', 'tipo_documento', 'email', 'telefono', 'direccion', 'categoria'];
const CATEGORIAS_VALIDAS = ['REGULAR', 'DEUDOR', 'RESPONSABLE'];

const normalizarHeader = (header) =>
    String(header).trim().toLowerCase().replace(/\s+/g, '_');

exports.importarClientesExcel = async (req, res) => {
    if (!req.file) {
        return ResponseHandler.sendValidationError(res, "No se recibió ningún archivo Excel");
    }

    try {
        const empresa_id = req.user.empresa_id;

        // 1. Parsear el buffer Excel
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const nombreHoja = workbook.SheetNames[0];
        const hoja = workbook.Sheets[nombreHoja];

        // Convertir la hoja a array de objetos; defval evita celdas undefined
        const filasCrudas = XLSX.utils.sheet_to_json(hoja, { defval: '' });

        if (!filasCrudas.length) {
            return ResponseHandler.sendValidationError(res, "El archivo Excel está vacío o no contiene datos");
        }

        // 2. Normalizar headers para que coincidan con snake_case sin importar mayúsculas/espacios
        const filasNormalizadas = filasCrudas.map((fila) => {
            const filaNorm = {};
            for (const [key, value] of Object.entries(fila)) {
                const keyNorm = normalizarHeader(key);
                if (COLUMNAS_VALIDAS.includes(keyNorm)) {
                    filaNorm[keyNorm] = String(value).trim();
                }
            }
            return filaNorm;
        });

        // 3. Primer pasada: separar filas válidas de filas con errores de validación básica
        const filas_con_error = [];
        const filasValidas = [];

        filasNormalizadas.forEach((fila, index) => {
            const numeroFila = index + 2; // +2 porque fila 1 es el header

            if (!fila.numero_documento) {
                filas_con_error.push({
                    fila: numeroFila,
                    numero_documento: fila.numero_documento || '',
                    motivo: 'El campo numero_documento es requerido'
                });
                return;
            }

            if (!fila.nombre_completo) {
                filas_con_error.push({
                    fila: numeroFila,
                    numero_documento: fila.numero_documento,
                    motivo: 'El campo nombre_completo es requerido'
                });
                return;
            }

            // Normalizar campos opcionales
            const tipoDocumento = fila.tipo_documento || 'DNI';
            const categoriaRaw = (fila.categoria || '').toUpperCase();
            const categoria = CATEGORIAS_VALIDAS.includes(categoriaRaw) ? categoriaRaw : 'REGULAR';

            filasValidas.push({
                _fila: numeroFila,
                empresa_id,
                numero_documento: fila.numero_documento,
                nombre_completo: fila.nombre_completo,
                tipo_documento: tipoDocumento,
                email: fila.email || null,
                telefono: fila.telefono || null,
                direccion: fila.direccion || null,
                categoria
            });
        });

        // 4. Consulta única: obtener documentos que ya existen para esta empresa
        const documentosExcel = filasValidas.map((f) => f.numero_documento);

        const clientesExistentes = await Cliente.findAll({
            attributes: ['numero_documento'],
            where: {
                empresa_id,
                numero_documento: { [Op.in]: documentosExcel }
            }
        });

        const documentosExistentes = new Set(clientesExistentes.map((c) => c.numero_documento));

        // 5. Separar nuevos de duplicados
        const clientesNuevos = [];
        let omitidos_duplicados = 0;

        for (const fila of filasValidas) {
            if (documentosExistentes.has(fila.numero_documento)) {
                omitidos_duplicados++;
            } else {
                // Eliminar campo interno _fila antes de crear
                const { _fila, ...datosCliente } = fila;
                clientesNuevos.push(datosCliente);
            }
        }

        // 6. Inserción masiva de los clientes nuevos
        let creados = 0;
        const erroresBulk = [];

        if (clientesNuevos.length > 0) {
            try {
                const resultado = await Cliente.bulkCreate(clientesNuevos, {
                    validate: true,
                    // ignoreDuplicates como salvaguarda extra ante condición de carrera
                    ignoreDuplicates: false
                });
                creados = resultado.length;
            } catch (bulkErr) {
                // Si bulkCreate falla en alguna fila, intentamos insertar de a uno para aislar el error
                for (const clienteData of clientesNuevos) {
                    const filaOriginal = filasValidas.find(
                        (f) => f.numero_documento === clienteData.numero_documento
                    );
                    const numeroFila = filaOriginal ? filaOriginal._fila : '?';
                    try {
                        await Cliente.create(clienteData);
                        creados++;
                    } catch (rowErr) {
                        erroresBulk.push({
                            fila: numeroFila,
                            numero_documento: clienteData.numero_documento,
                            motivo: rowErr.message || 'Error al crear el cliente'
                        });
                    }
                }
            }
        }

        const totalErrores = filas_con_error.length + erroresBulk.length;

        return ResponseHandler.sendCreated(res, "Importación de clientes completada", {
            total_filas: filasCrudas.length,
            creados,
            omitidos_duplicados,
            errores: totalErrores,
            filas_con_error: [...filas_con_error, ...erroresBulk]
        });

    } catch (err) {
        return ResponseHandler.sendInternalError(res);
    }
};