/**
 * Created by ZhengLu on 2016/5/24.
 */

$(function() {
    // 图片轮播 EDIT 2016.5.24
    $.fn.slide = function(options) {
        options = $.extend({
            imgW          :  0,                        // 图片宽度
            imgH          :  0,                        // 图片高度
            timeout       :  '3000',                   // 轮播间隔时间
            moveTime      :  '500',                    // 动画时间
            moveMode      :  'slide',                  // 动画效果：默认slide滑动效果，还可以选择fade渐变效果
            autoSlide     :  true,                     // 是否自动轮播
            addTag        :  true,                     // 是否创建圆点标记
            tagSize       :  12,                       // 圆点标记的大小
            tagDefaultBg  :  '#fff',                   // 圆点标记的默认背景颜色
            tagActiveBg   :  '#5638d8',                // 圆点标记选中背景颜色
            btnShow       :  true,                     // 是否显示左右按钮
            btnW          :  30,                       // 按钮的宽度
            btnH          :  60,                       // 按钮的高度
            btnBg         :  'rgba(255,255,255,.6)',   // 按钮的背景颜色
        }, options || {});

        // 定义基本样式
        var cssStyle = {
            // 外容器样式
            slideWrap: {
                'height': options.imgH + 'px'
            },
            // 包裹图片的a标签样式
            link: {
                'left': '100%'
            },
            // 圆点外容器样式
            tagBox: {
                'height': '40px',
                'line-height': '40px'
            },
            // 圆点样式
            tag: {
                'margin-top': (40 - options.tagSize) / 2 + 'px',
                'margin-left': '5px',
                'margin-right': '5px',
                'width': options.tagSize + 'px',
                'height': options.tagSize + 'px',
                'background-color': options.tagDefaultBg
            },
            // 左右按钮样式
            btn: {
                'margin-top': (-1) * options.btnH / 2 + 'px',
                'width': options.btnW + 'px',
                'height': options.btnH + 'px',
                'background-color': options.btnBg
            }
        };

        // 轮播间隔时间不足1500则以1500显示，否则以默认间隔时间显示
        options.timeout = options.timeout < 1500 ? 1500 : options.timeout;

        var $item = this, // 触发的元素
            $imgs = $item.find('img'),
            $imgLink = $item.find('a'),
            imgSize = $imgs.size(),
            $btn,
            $tag,
            count = 0;

        var init = function() {
            initCss();
            pauseSlide();
            //$item.find('.tag').remove();
            //$item.find('.btn').remove();

            $imgLink.eq(0).css({'left': 0});   // 第一张图显示
            //$imgLink.eq(imgSize - 1).css({'left': '-100%'});

            // 点击左右按钮
            if(options.btnShow) {
                createBtn($item);
                $btn.on('click', function() {
                    pauseSlide();
                    var index = $btn.index(this);
                    // 点击左按钮
                    if(index == 0) {
                        imgsMove('left');
                    }
                    // 点击右按钮
                    else if(index == 1) {
                        imgsMove();
                    }
                    //console.log(index);
                });
            }

            // 增加圆点标记
            if(options.addTag) {
                createTag($item);
                $tag.find('span').eq(0).css({'background-color': options.tagActiveBg});
                // 点击圆点标记切换图片------未完成
                $tag.find('span').click(function() {
                    pauseSlide();

                    $(this).css({'background-color': options.tagActiveBg})
                        .siblings().css({'background-color': options.tagDefaultBg});

                    imgsMove();
                })
            }

            startSlide();
        }

        // 修改样式
        setCss = function(obj, cssArr) {
            obj.css(cssArr);
        }

        // 初始化样式
        initCss = function() {
            setCss($item, cssStyle.slideWrap);
            setCss($imgLink, cssStyle.link);
        }

        // 创建左右按钮
        createBtn = function(b) {
            $btn = b.find('.btn');
            setCss($btn, cssStyle.btn);
        }

        // 创建圆点标记
        createTag = function(t) {
            $tag = t.find('.tag');
            //console.log($tag);
            setCss($tag, cssStyle.tagBox);

            // 根据图片个数动态加载圆点标记个数
            for(var i=0; i<imgSize; i++) {
                $tag.append('<span></span>');
            }
            setCss($tag.find('span'), cssStyle.tag);
        }

        // 圆点标记移动，当前标记突出显示
        tagsMove = function() {
            if(options.addTag) {
                var $tagSpan = $tag.find('span');
                $tagSpan.css({
                    'background-color': options.tagDefaultBg
                }).eq(count).css({
                    'background-color': options.tagActiveBg
                });
            }
        }

        // 轮播动画---当图片仅有两张时，有问题，最好用克隆，这个效果有待提高
        imgsMove = function(dir) {
            // 滑动效果
            if(options.moveMode == 'slide') {
                // 左滑动
                if(dir == 'left') {
                    count--;
                    count = count < 0 ? imgSize - 1 : count;
                    $imgLink.eq(count).stop().animate({'left': 0}, options.moveTime, function() {
                        // countR从3,2,1,0,4
                        var countR = count - 1;
                        console.log(countR);
                        $imgLink.eq(countR).css({'left': '-100%'});
                    });
                    var countL = count + 1 == imgSize ? 0 : count + 1;
                    $imgLink.eq(countL).stop().animate({'left': '100%'}, options.moveTime);
                }
                // 右滑动
                else {
                    count++;
                    // 当滑动到最后一张时，count换成0，从第一张从头开始
                    count = count == imgSize ? 0 : count;
                    //console.log(count);
                    $imgLink.eq(count).stop().animate({'left': 0}, options.moveTime, function() {

                        // count从1,2,3,4,0; countR从2,3,4,0,1
                        var countR = (count == imgSize - 1 ? -1 : count) + 1;
                        //console.log(countR);
                        $imgLink.eq(countR).css({'left': '100%'});

                    });
                    $imgLink.eq(count-1).stop().animate({'left': '-100%'}, options.moveTime);
                }
            }
            startSlide();
            tagsMove();
        }

        // 开始播放
        startSlide = function() {
            if(options.autoSlide) {
                $item.data('autoSli', window.setTimeout(imgsMove, options.timeout));
            }
        }

        // 暂停播放
        pauseSlide = function() {
            window.clearTimeout($item.data('autoSli'));
        }


        // 首张图片加载完毕后执行初始化
        var bannerImg = new Image;
        bannerImg.onload = function() {
            var loadImgW = $item.width();
            cssStyle.slideWrap.height = options.imgH = loadImgW * 9 / 16;    // 以16:9的尺寸显示
            //console.log(cssStyle.slideWrap.height);
            init();
        }
        bannerImg.src = $imgs.eq(0).attr('src');
    }

    //$('.slide').slide();

    $.each($('*[e-fun = slider]'), function(i){
        $('*[e-fun = slider]').eq(i).slide();
    });



    // 下拉 EDIT 2016.5.26
    $.fn.drop = function(options) {
        options = $.extend({
            tapType  :  'click',   // 默认点击方式click
            n        :  0,         // 默认li的初始值
            nType    :  'name',    // 提交给span的属性值
            speed    :  100        // 下拉框下拉或收起的速度
        }, options || {});

        var $item = this; // 解决this指向问题
        var $dropUl = $item.find('ul');
        var $dropLi = $item.find('ul li');
        var $dropInput = $item.find('input');
        var $dropIcon = $item.find('i');


        // 每个li赋属性值value
        for(var i=0; i<$dropLi.length; i++) {
            $dropLi.eq(i).attr('value', options.n);
            options.n++;
        }

        // 绑定--下拉收起事件
        $item.on(options.tapType, function() {
            $('*[e-fun = drop]').find("ul").stop().slideUp(50);
            $dropUl.stop().slideToggle(options.speed);
            // 下拉收起图标切换(这里的图标用的font awesome 可以自行替换)
            if($dropIcon.hasClass('fa-caret-down')) {
                $dropIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
            }
            else if($dropIcon.hasClass('fa-caret-up')) {
                $dropIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
            }
        }).on('click', 'li', function() {
            var _this = $(this),
                liText = _this.text();  // 获取li标签内的文本内容
            // 将li中的值赋给input
            $dropInput.attr('value', liText).attr(options.nType, liText);
        });

        // 点击页面其他地方下拉框收起
        $(document).on(options.tapType, function(e) {
            var target = $(e.target);
            if($dropUl.is(':visible') && target.parents('[e-fun]').attr('e-fun') != 'drop') {
                $dropUl.stop().slideUp(options.speed);
            }
        });
    }

    $.each($('*[e-fun = drop]'), function(i){
        $('*[e-fun = drop]').eq(i).drop();
    });

    // 左右图片无缝滚动 EDIT 2016.5.30
    //$.fn.roll = function(options) {
    //    options = $.extend({
    //        orientation : 'right',
    //        speed       : 30
    //    }, options || {});
    //
    //    var $e = $(this); // 解决this指向问题
    //    var $imgBox = $e.find('.roll-pic');
    //    var $imgWrap = $imgBox.find('a')
    //    var $img = $imgBox.find('img');
    //
    //    var init = function() {
    //        var len = $img.length;
    //        $imgBox.css({
    //            // outerWidth(true);true表示加上外边距；img宽度加上a标签的margin值
    //            'width'  : $imgWrap.outerWidth(true) * len,
    //            'height' : $imgWrap.outerHeight(true)
    //        });
    //        $e.html();
    //    }
    //    init();
    //
    //    var _rollUl1 = $e.find('.roll-pic ul:eq(0)');
    //    var _rollUl2 = $e.find('.roll-pic ul:eq(1)');
    //    _rollUl2.html(_rollUl1.html());
    //
    //    // 无缝滚动
    //    function Marquee() {
    //        if($e.scrollLeft() >= _rollul1.width()) {
    //            $e.scrollLeft = 0;
    //        }
    //        else {
    //            $e.scrollLeft($e.scrollLeft() + 1);
    //        }
    //    }
    //    var timer = setInterval(Marquee, options.speed);
    //}
    //$.each($('*[e-fun = roll]'), function(i){
    //    $('*[e-fun = roll]').eq(i).roll();
    //});

});
