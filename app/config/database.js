import { dbLog } from './winston';

const pool = {
  max: 50,
  min: 0,
  acquire: 30000,
  idle: 10000
};

const dialectOptions = {
  decimalNumbers: true
};

function dbLogging(str, time) {
  if (process.env.DB_LOGGING === '1') {
    dbLog.info(`${str} - ${time}ms`);
  }
}

export default {
  development: {
    dialect: 'mysql',
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  },
  test: {
    dialect: 'mysql',
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  },
  production: {
    dialect: 'mysql',
    pool: pool,
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  }
};
