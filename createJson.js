/**
 * Created by sl on 16/6/21.
 */
//
const mongoose = require('mongoose')
const jsonfile = require('jsonfile')
const fs = require('fs')
const ShareProblem = require('./models/shareProblem')
const config  = require('./config')
mongoose.connect(config.db, {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
})

process.on('SIGINT', () => {
  console.warn('Express exit')
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close()
  } else {
    process.exit(0)
  }
})

mongoose.connection.on('error', () => {
  console.error(err)
  console.info('Exit process')
  process.exit(1)
});

mongoose.connection.on('disconnected', () => {
  console.error('Database disconnected')
  console.info('Exit process')
  process.exit(1)
});

mongoose.connection.on('connected', () => {
  console.info('Database connected to ' + config.db)
  ShareProblem.find({}, (err, problems) => {
    jsonfile.writeFile(__dirname + '/problemShares.json', problems, (err)=> {
      process.exit(0)
    })
  })
})
