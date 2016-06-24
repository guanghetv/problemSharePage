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
    success: function() {alert('分享成功')},
    cancel: function() {}
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
    $param.remove();
    listenVideoEvents();
    getWeixinConfig();
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

  function getWeixinConfig() {
    var url = location.href.split('#')[0];
    $.ajax({
      url: domain + '/config/weixin/token',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({url: url})
    }).success(function(data) {
      console.log(data);
      shareInit(data);
    })
  }

  function shareInit(data) {
    /**
     * 微信分享代码
     */
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature,// 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function(){
      //分享到朋友圈
      wx.onMenuShareTimeline(shareInfo);

      //分享给朋友
      wx.onMenuShareAppMessage(shareInfo);

      //分享到QQ
      wx.onMenuShareQQ(shareInfo);

      //分享到QQ空间
      wx.onMenuShareQZone(shareInfo);
    });

    /**
     * QQ分享代码
     */
    setShareInfo({
      title: shareInfo.title,
      summary: shareInfo.desc,
      pic: shareInfo.imgUrl,
      url: shareInfo.link,
      WXconfig: {
        swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
        appId: data.appId, // 公众号的唯一标识
        timestamp: data.timestamp, // 生成签名的时间戳
        nonceStr: data.nonceStr, // 生成签名的随机串
        signature: data.signature // 签名
      }
    });
  }

  init();

}()
