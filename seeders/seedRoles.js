const Roles = require('../models/core/rol');

const ROLES_PREDEFINIDOS = [
    { id: 1, nombre: 'Vendedor',   descripcion: 'Puede realizar ventas y gestionar clientes',                          nivel_permiso: 1 },
    { id: 2, nombre: 'Cajero',     descripcion: 'Puede gestionar caja, cobros y devoluciones',                         nivel_permiso: 2 },
    { id: 3, nombre: 'Almacenero', descripcion: 'Puede gestionar inventario, productos y proveedores',                 nivel_permiso: 3 },
    { id: 4, nombre: 'Supervisor', descripcion: 'Puede gestionar trabajadores, ver reportes y supervisar operaciones', nivel_permiso: 4 }
];

async function seedRoles() {
    try {
        const count = await Roles.count();
        if (count > 0) {
            console.log(`[Seeder] Roles ya existen (${count} registros). Omitiendo.`);
            return;
        }
        await Roles.bulkCreate(ROLES_PREDEFINIDOS, { ignoreDuplicates: true });
        console.log('[Seeder] Roles predefinidos creados:', ROLES_PREDEFINIDOS.map(r => r.nombre).join(', '));
    } catch (err) {
        console.error('[Seeder] Error al crear roles predefinidos:', err.message);
    }
}

module.exports = seedRoles;
