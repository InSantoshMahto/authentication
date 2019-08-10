const dbConfig = {
  host: 'mongodb://127.0.0.1/',
  name: 'auth',
};
const mongoDb = dbConfig.host + dbConfig.name;

module.exports = mongoDb;
