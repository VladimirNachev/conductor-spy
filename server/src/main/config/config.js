const config = {
  "development": {
    "username": "postgres",
    "password": "mysecretpassword",
    "database": "conductors-spy",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "mysecretpassword",
    "database": "conductors-spy-test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "mysecretpassword",
    "database": "conductors-spy-production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

module.exports = config;
