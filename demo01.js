var http = require('http')
var url = 'http://www.imooc.com/learn/348';
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
var cors = require('koa2-cors');


const app = new Koa()
app.use(cors());
const staticPath = './static'
app.use(static(
  path.join( __dirname, staticPath)
))
app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})
 
app.listen(3006, () => {
  console.log('[demo] static-use-middleware is starting at port 3006')
})

function filterChapters(html) {
    var $ = cheerio.load(html)
    var chapters = $('.course-wrap')
    var courseData = []
    chapters.each(function(item) {
        var chapter = $(this)
        var chapterTitle = chapter.find('h3').text().replace(/\s/g, "")
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        videos.each(function(item) {
            var video  = $(this).find('.J-media-item')
            var videoTitle = video.text().replace(/\n/g, "").replace(/\s/g, "");
            var id = video.attr('href').split('video/')[1];
            var url = `http://www.imooc.com/video/${id}`
            chapterData.videos.push({
                title:videoTitle,
                id: id,
                url: url
            })
        })
        courseData.push(chapterData)
    })
    console.log(courseData);
    return courseData
}

function printCourseInfo(courseData){
    courseData.forEach(item => {
        var chapterTitle = item.chapterTitle
        item.videos.forEach(video => {
          var vidoId = video.id
            var  videoTitle = video.title
        })
    })
    
}

http.get(url, function(res) {
    var html = '';
    res.on('data', function(data) {
        html += data;

    })
    
    res.on('end', function() {
        var courseData = filterChapters(html);
        let content = courseData.map((o)=>{
            return JSON.stringify(o)
        })
       
        printCourseInfo(courseData)
     
        fs.writeFile('./index.json',content, function(err){
            if(err) throw new Error ('写文件失败'+err);
            console.log("成功写入文件")
        })

    })

}).on('error', function() {
    console.log('获取资源出错！');
})