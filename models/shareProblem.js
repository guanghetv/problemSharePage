/**
 * Created by sl on 16/6/21.
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var shareProblemSchema = new Schema({
  uid: String,
  title: String,
  topicImg: String,
  content: {
    question: String, //img
    answer: String //img
  },
  video: {
    hypervideoId: ObjectId,
    poster: String,
    pcMp4: String,
    mobileMp4: String,
    hls: String
  },
  shareInfo: {
    title: String,
    desc: String,
    imgUrl: String,	//尺寸：300*300px
    link: String	//由于手机QQ限制，分享URL必须与页面URL同一域名，否则设置不生效（url由后端配置）
  }
})
  
module.exports = mongoose.model('ShareProblem', shareProblemSchema)
