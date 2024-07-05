import Sequelize from "sequelize";

import db from "@/utils/db/db";

const User = db.define("user",{
    id: {
        type: Sequelize.INTEGER,   
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    spotifyUserId: {
        type: Sequelize.STRING,
        unique: true,
    },
    refreshToken: {
        type: Sequelize.STRING,
        unique: true        
    },
    accessToken: {
        type: Sequelize.STRING,
        unique: true
    }
});


export default User;