;(function(win) {
  //var doc = win.document;
  //var html = doc.documentElement;
  //var benchmark = 720;  //页面基准宽度（一般为设计稿宽度）
  //var timer;
  //
  //function setFontSize() {
  //  var htmlWidth = html.getBoundingClientRect().width;
  //  console.log('htmlWidth', htmlWidth);
  //  var ratio = htmlWidth / benchmark;
  //  if(htmlWidth < benchmark) {
  //      win.rem = ratio * 1.5;
  //  } else {
  //      win.rem = 1.5;
  //  }
  //  win.responseRatio = ratio;
  //  html.style.fontSize = win.rem + "rem";
  //}
  //
  //win.addEventListener('resize', function() {
  //  clearTimeout(timer);
  //  timer = setTimeout(setFontSize, 300);
  //}, false);
  //
  //setFontSize();
  var deviceWidth = document.documentElement.clientWidth;
  if(deviceWidth > 720) deviceWidth = 720;
  document.documentElement.style.fontSize = deviceWidth / 7.2 + 'px';

})(window);
