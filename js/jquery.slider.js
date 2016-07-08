/**
 * Created by ZhengLu on 2016/6/13.
 */

$(function() {
    // 图片轮播 EDIT 2016.6.2
    $.fn.slider = function(options) {
        options = $.extend({
            imgW          :  918,                      // 图片宽度
            imgH          :  516,                      // 图片高度
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

        var $item = this, // 触发的元素
            $itemParent = $item.parent();
            $imgs = $item.find('img'),
            $imgLink = $item.find('a'),
            imgSize = $imgs.size(),
            showIndex = $item.find('.show').index();

        // 定义基本样式
        var cssStyle = {
            // 外容器样式
            sliderWrap: {
                'width' : options.imgW + 'px',
                'height': options.imgH + 'px'
            },
            slide: {
                'width' : options.imgW * imgSize + 'px',
                'height': options.imgH + 'px'
            },
            // 圆点外容器样式
            tagBox: {
                'width' : options.imgW + 'px',
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

        var $btn,
            $tag;

        var init = function() {
            initCss();
            pauseSlider();

            // 点击左右按钮
            if(options.btnShow) {
                createBtn($itemParent);
                $btn.on('click', function() {
                    pauseSlider();
                    var index = $btn.index(this);
                    // 点击左按钮
                    if(index == 0) {
                        imgsMove('left');
                    }
                    // 点击右按钮
                    else if(index == 1) {
                        imgsMove();
                    }
                });
            }

            // 增加圆点标记
            if(options.addTag) {
                createTag($itemParent);
                // 默认第一个圆点标记背景色为tagActiveBg
                $tag.find('span').eq(0).css({'background-color': options.tagActiveBg});
                // 点击圆点标记切换图片
                $tag.find('span').click(function() {
                    pauseSlider();

                    $(this).css({'background-color': options.tagActiveBg})
                        .siblings().css({'background-color': options.tagDefaultBg});
                    imgsMove();
                });
            }
            startSlider();
        }

        // 修改样式
        setCss = function(obj, cssArr) {
            obj.css(cssArr);
        }

        // 初始化样式
        initCss = function() {
            setCss($itemParent, cssStyle.sliderWrap);
            setCss($item, cssStyle.slide);
        }

        // 创建左右按钮
        createBtn = function(b) {
            $btn = b.find('.btn');
            setCss($btn, cssStyle.btn);
        }

        // 创建圆点标记
        createTag = function(t) {
            $tag = t.find('.tag');
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
                }).eq(showIndex).css({
                    'background-color': options.tagActiveBg
                });
            }
        }

        // 轮播动画-- 有n张图
        imgsMove = function(dir) {
            // 滑动效果slide
            if(options.moveMode == 'slide') {
                // 初始化
                $imgLink.eq(0).addClass('show').css('left', 0).siblings().removeClass('show').css('left', -options.imgW);
                // 左滑动
                if(dir == 'left') {
                    showIndex--;
                    // 假设从第一张图向左滑动，showIndex的顺序为n,4,3,2,1,0...n...
                    showIndex = showIndex < 0 ? (imgSize - 1) : showIndex;

                    // 设置当前索引的前一个索引，beforeIndex的顺序为n-1,3,2,1,0,n...
                    var beforeIndex = showIndex == 0 ? (imgSize -1) : (showIndex -1);

                    // 下一个索引的滚动特效
                    $imgLink.eq(showIndex).addClass('show').css('left', 0).siblings().removeClass('show').css('left', -options.imgW);

                    $imgLink.eq(beforeIndex).animate({left: 0}, options.moveTime);

                    $imgLink.eq(showIndex).stop().animate({
                        left: options.imgW
                    }, options.moveTime, function() {
                        $imgLink.eq(beforeIndex).addClass('show').css('left', 0).siblings().removeClass('show').css('left', -options.imgW);
                    });
                }
                // 右滑动
                else {
                    // 假设从第一张图切换，共有n张图，showIndex的顺序为1,2,3,4...n,0...
                    $imgLink.eq(showIndex).addClass('show').css('left', 0).siblings().removeClass('show').css('left', options.imgW);
                    // 当滑动到最后一张图时,showIndex为0，自动切换到第一张
                    showIndex = (showIndex + 1) == imgSize ? -1 : showIndex;
                    showIndex++;

                    // 设置当前索引的后一个索引，nextIndex的顺序为1,2,3,4,5...n,1...
                    var nextIndex = showIndex;
                    nextIndex = showIndex == 0 ? (nextIndex = imgSize) : nextIndex;

                    $imgLink.eq(showIndex).animate({left: 0}, options.moveTime);
                    // 当前索引和当前索引的后一个索引的滚动特效
                    $imgLink.slice(nextIndex -1, nextIndex).stop().animate({
                        left: -options.imgW
                    }, options.moveTime, function() {
                        $imgLink.eq(showIndex).addClass('show').css('left', 0).siblings().removeClass('show').css('left', options.imgW);
                    });
                }
            }
            // 渐隐渐现效果fade
            else if(options.moveMode == 'fade') {
                // 左fade
                if(dir == 'left') {
                    showIndex--;
                    showIndex = showIndex < 0 ? (imgSize - 1) : showIndex;
                }
                // 右fade
                else {
                    showIndex++;
                    showIndex = showIndex == imgSize ? 0 : showIndex;
                }
                $imgLink.eq(showIndex).stop().addClass('show').fadeIn(options.moveTime).siblings().removeClass('show').fadeOut(options.moveTime);
            }
            startSlider();
            tagsMove();
        }

        // 开始播放
        startSlider = function() {
            // 自动播放
            if(options.autoSlide) {
                // data()函数用于在当前jQuery对象所匹配的所有元素上存取数据
                // 通过data()函数存取的数据都是临时数据，一旦页面刷新，之前存放的数据都将不复存在
                $item.data('autoSliderTime', window.setTimeout(imgsMove, options.timeout));
            }
        }

        // 暂停播放
        pauseSlider = function() {
            window.clearTimeout($item.data('autoSliderTime'));
        }

        // 首张图片加载完毕后执行初始化
        var bannerImg = new Image;
        bannerImg.onload = function() {
            init();
        }
        bannerImg.src = $imgs.eq(0).attr("src");
    }

    //---------- Html 调用 -----------
    $.each($('*[e-fun ="slider"]'), function(i){
        $('*[e-fun ="slider"]').eq(i).slider();
    });
});
