/**
 *   自动播放融e学创业课视频
 *    @startIndex 视频序号, 从 0 开始
*/
function autopaly(startIndex) {
   // 所有课程节点
   const courseList = document.querySelectorAll('.course_box');

   // 与 startIndex 序号相同的节点
   const startCourseNode = [...courseList].find(
      courseNode =>
         +courseNode.querySelector('p').innerText.split('.')[0] == startIndex
   );

   // 下一个播放节点
   let nextNode = startCourseNode.nextElementSibling;
   
   // 等待一定时间执行脚本
   const next_play_interval = 6000;

   // 视频播放时间
   const playTime = 20;
   
   // 首先播放当前节点视频
   startCourseNode.click();
   
   // 延迟执行脚本
   setTimeout(() => {
      circle();
   }, next_play_interval);

   function circle() {
      // video
      const video = document.querySelector('video');

      // 视频时长（秒）
      const duration = video.duration;

      // 设置视频当前播放时间为 总时长 - 播放时长
      video.currentTime = duration - playTime;

      // 监听当期视频播放状态, 当结束时, 自动点击下一个课程节点
      video.addEventListener('ended', e => {
         // 当不是最后一个节点时
         if (nextNode) {
            // 切换节点
            nextNode.click();
            // 更换下一个节点
            nextNode = nextNode.nextElementSibling;

            setTimeout(() => {
               circle();
            }, next_play_interval);
         }
      })
   }
}
