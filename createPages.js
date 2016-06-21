/**
 * Created by sl on 16/6/21.
 */
'use strict'
//
const mongoose = require('mongoose')
const fs = require('fs')
const db = 'mongodb://10.8.4.4/onions'
const ShareProblem = require('./models/shareProblem')
const R = require('ramda')
const Replacer = require('pattern-replace');
const HTMLUglify = require('html-compress');
const option = {
  'level': 'strip'   //压缩等级分为strip、strip_comment、strip_space,默认为strip
};
mongoose.connect(db, {
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
  console.info('Database connected to ' + db)

  ShareProblem.find({}, (err, problems) => {
    problems.forEach((problem) => {
      const template = fs.readFileSync('./template/index.html', 'utf8')
      const options = {
        patterns: [
          {
            json: {
              "title": R.pathOr('', ['title'], problem),
              "topicImg": R.pathOr('', ['topicImg'], problem),
              //"selfCss": process.env.NODE_ENV === 'dev' ? `${config.devPrefix}/landingPageSelf.css` : `${config.prodPrefix}/${package.version}landingPageSelf.css`,
              //"libJs": process.env.NODE_ENV === 'dev' ? `${config.devPrefix}/lib.js` : `${config.prodPrefix}/${package.version}lib.js`,
              //"selfJs": process.env.NODE_ENV === 'dev' ? `${config.devPrefix}/landingPageSelf.js` : `${config.prodPrefix}/${package.version}landingPageSelf.js`,
              "question": R.pathOr('', ['content', 'question'], problem),
              "answer": R.pathOr('', ['content', 'answer'], problem),
              "poster": R.pathOr('', ['video', 'poster'], problem),
              "pcMp4": R.pathOr('', ['video', 'pcMp4'], problem),
              "mobileMp4": R.pathOr('', ['video', 'mobileMp4'], problem),
              "hls": R.pathOr('', ['video', 'hls'], problem),
              "shareTitle": R.pathOr('', ['shareInfo', 'title'], problem),
              "shareDesc": R.pathOr('', ['shareInfo', 'desc'], problem),
              "imgUrl": R.pathOr('', ['shareInfo', 'imgUrl'], problem),
              "link": R.pathOr('', ['shareInfo', 'link'], problem)
            }
          }
        ]
      }
      const replacer = new Replacer(options);
      fs.writeFileSync(`./dist/${problem.uid}.html`, process.env.NODE_ENV === 'dev' ? replacer.replace(template) : HTMLUglify.compress(replacer.replace(template), option), 'utf8')
    })
    process.exit(1)
  })

})
