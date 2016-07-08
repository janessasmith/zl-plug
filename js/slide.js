/**
 * Created by ZhengLu on 2016/5/31.
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
            count = 0;

        var l = 0;

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


            $item.append($item.html()).css({
                // 外容器总宽度
                'width' : options.imgW *imgSize * 2,
                // 左偏移，默认从第二组开始显示
                'left'  : -options.imgW * imgSize
            });

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
                }).eq(count).css({
                    'background-color': options.tagActiveBg
                });
            }
        }

        // 轮播动画-- 有n张图
        imgsMove = function(dir) {
            // 滑动效果slide
            if(options.moveMode == 'slide') {
                // 左滑动
                if(dir == 'left') {
                    // 假设从0开始，一共有四张图，则count应该是-1(3),2,1,0...-1(3),2,1,0...
                    count--;
                    count = count < 0 ? imgSize - 1 : count;
                    if ($item.is(':animated')) {
                        return
                    }
                    l = parseInt($item.position().left + options.imgW);
                    $item.animate({'left' : l}, options.moveTime, function() {
                        if (l == 0) {
                            $item.css('left', -options.imgW * imgSize);
                        }
                    });
                }
                // 右滑动
                else {
                    // 假设从0开始，一共有四张图，则count应该是1,2,3,0...1,2,3,0...
                    count++;
                    count = count == imgSize ? 0 : count;
                    if ($item.is(':animated')) {
                        return
                    }
                    l = parseInt($item.position().left - options.imgW);
                    $item.animate({'left' : l}, options.moveTime, function() {
                        // 从第二组第一张图开始，一直展示到最后一张时，再转回第二组第一张图开始
                        if(l == (1 -imgSize * 2) * options.imgW) {
                            $item.css('left', (1 - imgSize) * options.imgW);
                        }
                    });
                }
            }
            // 渐隐渐现效果fade
            else if(options.moveMode = 'fade') {
                //$item.remove($item.html()).css({
                //    // 外容器总宽度
                //    'width' : options.imgW *imgSize,
                //    // 左偏移，默认从第二组开始显示
                //    'left'  : 0
                //});

                $item.css({
                    // 外容器总宽度
                    'width' : options.imgW,
                    // 左偏移，默认从第二组开始显示
                    'left'  : 0
                });
                if(dir == 'left') {
                    count--;
                    count = count < 0 ? imgSize -1 : count;
                }
                else {
                    count++;
                    count = count == imgSize ? 0 : count;
                }
                $imgLink.stop().hide().eq(count).fadeIn(options.moveTime);
            }
            startSlider();
            tagsMove();
        }

        // 开始播放
        startSlider = function() {
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
        // 初始化
        init();
    }

    $.each($('*[e-fun = slider]'), function(i){
        $('*[e-fun = slider]').eq(i).slider();
    });
});
