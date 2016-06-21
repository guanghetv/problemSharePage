;(function(win) {
  var elem = win.document.documentElement;
  var benchmark = 720;  //页面基准宽度
  var timer;

  function setFontSize() {
    var deviceWidth = elem.clientWidth;
    if(deviceWidth > benchmark) deviceWidth = benchmark;
    elem.style.fontSize = deviceWidth / (benchmark / 100) + 'px';
  }

  win.addEventListener('resize', function() {
    clearTimeout(timer);
    timer = setTimeout(setFontSize, 300);
  }, false);

  setFontSize();

})(window);
