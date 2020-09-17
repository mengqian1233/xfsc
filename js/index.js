var box = document.getElementById('box');
var isshowimg = document.getElementById('isshowimg')
var isshow = document.getElementById('isshow')
var btn = document.querySelector('.btn')
for (let i = 1; i <=27; i++) {
    if (i!=13){
        let item = document.createElement('div');
        let index = document.createElement('div')
        index.innerText='编号'+i
        item.className = 'item'
        item.innerHTML = "<img src='./assets/"+ i +".jpg' data-src= './assets/"+ i +".jpg'>"
        item.appendChild(index);
        box.appendChild(item);
    }

}

var items = box.children;
// 定义每一列之间的间隙 为10像素
var gap = 10;

window.onload = function() {
    function Rem() {
        var docEl = document.documentElement,
            oSize = docEl.clientWidth / 7.5;
        if (oSize > 100) {
            oSize = 100; //  限制rem值   640 / 6.4 =100
        }
        docEl.style.fontSize = oSize + 'px';
    }
    window.addEventListener('resize', Rem, false);
    Rem();
    // 一进来就调用一次
    waterFall();



    var imgs = document.querySelectorAll('img')
    // console.log(imgs)
    detail(imgs)

    btn.onclick=function () {

        isshow.style.display='none'
    }

    // 绑定事件
    function detail(s) {
        s.forEach(function (ev) {
            // console.log(ev)
            ev.onclick=function () {
                console.log(this.getAttribute('src'))
                var src= this.getAttribute('src')
                isshow.style.display='block'
                isshowimg.setAttribute('src',src)
            }
        })
    }
    // 封装成一个函数
    function waterFall() {
        // 1- 确定列数  = 页面的宽度 / 图片的宽度
        var pageWidth = getClient().width;
        var itemWidth = items[0].offsetWidth;
        var columns = parseInt(pageWidth / (itemWidth + gap));
        var arr = [];
        for (var i = 0; i < items.length; i++) {
            if (i < columns) {
                // 2- 确定第一行
                items[i].style.top = 0;
                items[i].style.left = (itemWidth + gap) * i + 'px';
                arr.push(items[i].offsetHeight);

            } else {
                // 其他行
                // 3- 找到数组中最小高度  和 它的索引f
                var minHeight = arr[0];
                var index = 0;
                for (var j = 0; j < arr.length; j++) {
                    if (minHeight > arr[j]) {
                        minHeight = arr[j];
                        index = j;
                    }
                }
                // 4- 设置下一行的第一个盒子位置
                // top值就是最小列的高度 + gap
                items[i].style.top = arr[index] + gap + 'px';
                // left值就是最小列距离左边的距离
                items[i].style.left = items[index].offsetLeft + 'px';

                // 5- 修改最小列的高度
                // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
                arr[index] = arr[index] + items[i].offsetHeight + gap;
            }
        }
    }
    // 页面尺寸改变时实时触发
    window.onresize = function() {
        waterFall();
    };
    // 当加载到第30张的时候
    window.onscroll = function() {
        if (getClient().height + getScrollTop() >= items[items.length - 1].offsetTop) {
            // 模拟 ajax 获取数据
            var datas = [

            ];
            for (var i = 0; i < datas.length; i++) {
                var div = document.createElement("div");
                div.className = "item";
                div.innerHTML = '<img src="' + datas[i] + '" alt="">';
                box.appendChild(div);
            }
            waterFall();
        }

    };
};

// clientWidth 处理兼容性
function getClient() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}
// scrollTop兼容性处理
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}




$("img").lazyload({
    // 当图片完全加载的时候，插件默认地使用show()方法来将图显示出来。你也可以使用其他的效果
    effect: "fadeIn",
    //lazyload插件默认用户滚动到图片位置时才触发加载图片，如果我们希望滚动到距离图片一定位置就触发加载，可以指定lazyload函数的threshold参数
    threshold: 200,
    //如果我们希望滚到到图片的位置后，还要通过click或hover事件来唤醒图片的加载，我们可以指定lazyload函数的event属性
    event: "click"
});