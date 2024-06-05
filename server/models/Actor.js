const { DataTypes } = require('sequelize');
const database = require("../db");



const Actor = database.define("Actor", {
    id:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
       type: DataTypes.STRING(60),
       allowNull: false     
    },
    apellido:{
        type: DataTypes.STRING(60),
        allowNull: false    
    },
    altura:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    edad:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 3,
            max: 110
        }
    }, 
    foto:{
        type: DataTypes.BLOB,
        validate: {
            isUrl: true
        }
    },
    

})


module.exports = Actor;
