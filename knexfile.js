require('dotenv').config();

const pg = require('pg');
//pg.defaults.ssl = true;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
    pool: {
      min: 2,
      max: 10
    }
  }
};
