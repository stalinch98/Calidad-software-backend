/* eslint-disable no-unused-expressions */
/**
 * Este sera el archivo donde realizaremos la conexion a mongoAtlas
 *
 */
const { MongoClient } = require('mongodb');
const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
// Ahora construimos la libreria de mongo

class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser: true,
        });
        this.dbName = DB_NAME;
    }

    connect() {
        // Usamos el patron singleton, si ya existe una conexion usamos esa
        if (!MongoLib.connection) {
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect((err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log('Connected succesfuly');
                    resolve(this.client.db(this.dbName));
                });
            });
        }
        return MongoLib.connection;
    }

    create(collection, data) {
        return this.connect()
            .then((db) => db.collection(collection).insertOne(data))
            .then((result) => {
                const resultId = result.insertedId.toString();
                return resultId;
            });
    }

    // Vamos a implementar las acciones en la base de datos de MongoDB

    getOnly(collection, data) {
        return this.connect()
            .then((db) => {
                const datos = db
                    .collection(collection)
                    .find({ email: { $eq: data.email } })
                    .toArray();
                return datos;
            })
            .catch((err) => {
                console.log(new Error(`Algo salgio mal en getOnly ${err}`));
            });
    }

    update(collection, data) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .updateOne({ email: data.email }, { $set: { "password": data.password, "passwordConfirm": data.passwordConfirm } }, { upsert: true });
            })
            .catch((err) => {
                console.log(new Error(`Algo salgio mal en el update ${err}`));
            });
    }
}

module.exports = MongoLib;