/**
 * Created by zhaoyan on 16/6/13.
 */
+function() {
  //var formula1 = document.querySelector('#formula1');
  var shareBtn = document.querySelector('#share');
  var shareMask = document.querySelector('#mask-share');
  var downloadBtn = document.querySelector('.btn-download');

  if(Hls.isSupported()) {
    var video = document.getElementById('video');
    var hls = new Hls();
    hls.loadSource('http://pchls.media.yangcong345.com/pcM_571b87939fcb86114c61ce95.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      //video.play();
    });
  }

  //katex.render("x=-\\frac{-2m}{2m}=1", formula1);

  shareBtn.addEventListener('click', function() {
    shareMask.className = '';
  });

  shareMask.addEventListener('click', function() {
    shareMask.className = 'hidden';
  });

  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    downloadApp();
  });

  function downloadApp(){
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

}()