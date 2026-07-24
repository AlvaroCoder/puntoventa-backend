const generateSKU = (nombre, rubroId, categoriaId) => {
    const prefijo = nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')    
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X'); 

    const rubro = String(rubroId).padStart(2, '0');
    const categoria = String(categoriaId).padStart(2, '0');
    const sufijo = Date.now().toString(36).slice(-5).toUpperCase();

    return `${prefijo}-${rubro}${categoria}-${sufijo}`;
};

module.exports = { generateSKU };