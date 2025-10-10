const { Op } = require('sequelize');
const ResponseHandler = require('../../lib/responseHanlder');
const Cliente = require('../../models/ventas/cliente');

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