const { Client } = require('pg');
var connectionString = "postgres://postgres:CrystalBoa12@localhost:5432/postgres";
const client = new Client({
    connectionString: connectionString
});

const knex = require("knex");