const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Creditos = sequelize.define('Creditos',{
    id_credito:{
        type : DataTypes.INTEGER,
        unique : true,
        autoIncrement : true
    },
    id_cliente : {
        
    }
})
module.exports = Creditos;
