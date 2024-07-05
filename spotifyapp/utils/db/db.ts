import * as pg from 'pg';
import {Sequelize} from "sequelize";

const dbUrl = process.env.DB_URL;
const db = new Sequelize(dbUrl as string,{dialectModule: pg});

export default db;