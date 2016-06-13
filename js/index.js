/**
 * Created by zhaoyan on 16/6/13.
 */
+function() {
  var formula1 = document.querySelector('#formula1');

  if(Hls.isSupported()) {
    var video = document.getElementById('video');
    var hls = new Hls();
    hls.loadSource('http://pchls.media.yangcong345.com/pcM_571bc8fc9fcb86114c61cfe5.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
    });
  }
  katex.render("x=-\\frac{-2m}{2m}=1", formula1);

}()
