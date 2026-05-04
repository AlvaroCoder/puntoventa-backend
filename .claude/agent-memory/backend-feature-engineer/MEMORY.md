# PipoApp Backend — Memoria del Agente

## Paquetes instalados (además del package.json original)
- `multer` — subida de archivos (memoryStorage para importaciones)
- `xlsx` — lectura/escritura de archivos Excel

## Patron de importacion Excel (implementado en cliente)
Ver `patterns.md` para detalles completos del patron reutilizable.

## Notas de entorno
- El cache de npm tiene permisos root en esta máquina.
  Solución: `npm install ... --cache /tmp/npm-cache`
- No se puede usar `sudo` en el entorno de agente (sin terminal interactiva).

## Links a archivos de detalle
- `patterns.md` — patrones reutilizables confirmados
