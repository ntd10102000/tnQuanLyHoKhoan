var pg = require("pg");

var config_db = {
  user: "postgres",
<<<<<<< HEAD
  database: "tnquanlycongtrinhngamhanoi",
  password: "admin_humg",
=======
  database: "tnquanlyhokhoan",
  password: "nguyentienduong1",
>>>>>>> 22aa39f2e38de00f17cf7a53543de1c4261f8804
  host: "localhost",
  port: "5432",
  max: 10,
  idleTimeoutMillis: 30000,
};

var pool_db = new pg.Pool(config_db);

module.exports = { pool_db, config_db };
