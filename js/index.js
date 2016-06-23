/**
 * Created by zhaoyan on 16/6/13.
 */
+function() {
  var video = document.querySelector('#video');
  var $shareBtn = $('#share');
  var $shareMask = $('#mask-share');
  var $downloadBtn = $('.btn-download');
  var $param = $('#pageInfo');

  //var problemId = location.pathname;
  //var videoUrl = 'http://pchls.media.yangcong345.com/pcM_571b87939fcb86114c61ce95.m3u8';
  var videoStart = false;

  var pageInfo = {
    problemId: $param.attr('problemId'),
    videoId: $param.attr('videoId'),
    mobileMp4: $param.attr('mobileMp4')
  };
  var shareInfo = {
    title: $param.attr('shareTitle'),
    desc: $param.attr('shareDesc'),
    imgUrl: $param.attr('imgUrl'),
    link: $param.attr('link'),
  };

  //if(Hls.isSupported()) {
  //  var hls = new Hls();
  //  hls.loadSource(videoUrl);
  //  hls.attachMedia(video);
  //  hls.on(Hls.Events.MANIFEST_PARSED,function() {
  //    //video.play();
  //  });
  //} else{
  //  video.src = videoUrl;
  //}

  $shareBtn.on('click', function(e) {
    e.preventDefault();
    $shareMask.removeClass('hidden');
    buryPoint('clickSPPShare', {problemId: pageInfo.problemId});
  });

  $shareMask.on('click', function() {
    $shareMask.addClass('hidden');
  });

  $downloadBtn.on('click', function(e) {
    e.preventDefault();
    downloadApp();
  });

  function init(){
    buryPoint('enterShareProblemPage', {problemId: pageInfo.problemId});
    if(pageInfo.mobileMp4.match('private')) {
      getMp4Src(pageInfo.mobileMp4);
    } else {
      video.src = pageInfo.mobileMp4;
    }
    listenVideoEvents();
    $param.remove();
  }

  function downloadApp(){
    buryPoint('clickSPPDownloadApp', {problemId: pageInfo.problemId});
    if(bowser.ios) {
      window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yangcong345.android.phone';
    }
    if(bowser.android) {
      downloadAndroidApp();
    }
  };

  function downloadAndroidApp() {
    if(/micromessenger/.test(navigator.userAgent.toLowerCase())) {
      window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yangcong345.android.phone';
    } else {
      var q = localStorage.q || '';
      // for android, judge the resource is available or not, if not download default apk;
      nanoajax.ajax({
          url: 'http://yc-mobile-content.qiniudn.com/YCMath_Android_V2.5.1_' + q + '.apk',
          method: 'HEAD'
        },
        function (code, responseText, request) {
          switch(code){
            case 403:
            case 400:
            case 500:
            case 404:
              window.location = 'http://yc-mobile-content.qiniudn.com/YCMath_Android_V2.5.1_ychome.apk';
              break;
            case 204:
            case 200:
              window.location = 'http://yc-mobile-content.qiniudn.com/YCMath_Android_V2.5.1_' + q + '.apk';
              break;
            default:
              window.location = 'http://yc-mobile-content.qiniudn.com/YCMath_Android_V2.5.1_ychome.apk';
              break;
          }
        }
      );
    }
  }

  function listenVideoEvents(){
    video.onplaying = function(){
      if(videoStart) return;
      videoStart = true;
      buryPoint('startVideo', { problemId: pageInfo.problemId, videoId: pageInfo.videoId}, 'video');
    };
    // videoDom.onpause = function(){
    //   buryPoint('startVideo', { videoName: $('.video-name').text() });
    // };
    //videoDom.onended = function(){
    //  buryPoint('finishVideo', { videoName: $('.video-name').text() }, 'video');
    //};
  }

  function getMp4Src(url) {
    $.ajax({
      url: domain + '/config/signVideo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({url: url})
    }).success(function(obj) {
      video.src = obj.url;
    }).fail(function() {

    });
  }

  init();

  // QQ分享代码
  setShareInfo({
    title: '做会这道题，中考数学还能再拿10分',
    summary: '100次中考考了101次的二次函数大题',
    pic: 'http://vs.yangcong345.com/problemSharePage/img/wx-share.png',
    url: 'http://vs.yangcong345.com/problemSharePage/template/index.html'
  });

}()
