/**
 * Created by ZhengLu on 2016/6/7.
 */

$(function() {
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
});