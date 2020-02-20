const sqlite3 = require('sqlite3');
const config = require('../../config.json');

class DB {

    constructor() {
        
    }

    createDb() {
        this.db = new sqlite3.Database(config.db.file);
    }

    createSchema() {

    }

    closeDb() {

    }
}

module.exports = DB;