const { DataTypes } = require("sequelize");
const database = require("../db");


const Papel = database.define("Papel", {
    id:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.ENUM("Principal", "Secundario", "Actor de voz", "Antagonista", "Extra"),
        allowNull: false
    }
})

module.exports = Papel;