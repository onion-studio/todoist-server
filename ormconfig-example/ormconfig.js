let config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'todoist',
  password: 'todoist',
  database: 'todoist',
}

if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...require('./ormconfig.test'),
  }
} else {
}

module.exports = config
