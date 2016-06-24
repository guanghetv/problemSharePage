/**
 * Created by sl on 16/6/21.
 */
//
const mongoose = require('mongoose')
const fs = require('fs')
const ShareProblem = require('./models/shareProblem')
const R = require('ramda')
const Replacer = require('pattern-replace');
const HTMLUglify = require('html-compress');
const package = require('./package.json')
const config = require('./config')
const problems = require('./problemShares.json')
const option = {
  'level': 'strip'   //压缩等级分为strip、strip_comment、strip_space,默认为strip
};

problems.forEach((problem) => {
  const template = fs.readFileSync('./tmp/index.html', 'utf8')
  const options = {
    patterns: [
      {
        json: {
          "problemId": R.pathOr('', ['_id'], problem).toString(),
          "title": R.pathOr('', ['title'], problem),
          "topicImg": R.pathOr('', ['topicImg'], problem),
          "viewportJs": `${process.env.NODE_ENV === 'dev' ? config.devPrefix : config.prodPrefix}/viewport_${package.version}.js`,
          "bundleCss": `${process.env.NODE_ENV === 'dev' ? config.devPrefix : config.prodPrefix}/bundle_${package.version}.css`,
          "bundleJs": `${process.env.NODE_ENV === 'dev' ? config.devPrefix : config.prodPrefix}/bundle_${package.version}.js`,
          "question": R.pathOr('', ['content', 'question'], problem),
          "answer": R.pathOr('', ['content', 'answer'], problem),
          "mobileMp4": R.pathOr('', ['video', 'mobileMp4'], problem),
          "poster":R.pathOr('', ['video', 'poster'], problem),
          "videoId": R.pathOr('', ['video', 'hypervideoId'], problem).toString(),
          "shareTitle": R.pathOr('', ['shareInfo', 'title'], problem),
          "shareDesc": R.pathOr('', ['shareInfo', 'desc'], problem),
          "imgUrl": R.pathOr('', ['shareInfo', 'imgUrl'], problem),
          "link": `${config.prodPrefix}/${problem.uid}.html`
        }
      }
    ]
  }
  const replacer = new Replacer(options);
  fs.writeFileSync(`${config.des}/${problem.uid}.html`, HTMLUglify.compress(replacer.replace(template), option), 'utf8')
  fs.createReadStream('./tmp/viewport.js').pipe(fs.createWriteStream(`${config.des}/viewport_${package.version}.js`));
  fs.createReadStream('./tmp/bundle.css').pipe(fs.createWriteStream(`${config.des}/bundle_${package.version}.css`));
  fs.createReadStream('./tmp/bundle.js').pipe(fs.createWriteStream(`${config.des}/bundle_${package.version}.js`));
})
setTimeout(function () {
  process.exit(1)
}, 2000)

