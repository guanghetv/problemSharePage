/**
 * Created by sl on 16/6/24.
 */
module.exports = {
  devPrefix:'.',
  prodPrefix:'http://vs.yangcong345.com/problems',
  des: process.env.NODE_ENV === 'dev'?'./dev':'./dist',
  db:'mongodb://10.8.4.4/onions'
}
