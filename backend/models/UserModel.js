import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define("users", {
    nama : {
        type: DataTypes.STRING
    },
    ktp : {
        type: DataTypes.STRING
    },
    tanggal_lahir : {
        type: DataTypes.STRING
    },
    telepon : {
        type: DataTypes.STRING
    },
    email : {
        type: DataTypes.STRING
    },
    password : {
        type: DataTypes.STRING
    },
    refresh_token : {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

export default Users;