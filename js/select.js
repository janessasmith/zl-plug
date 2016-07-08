/**
 * Created by ZhengLu on 2016/6/7.
 */

$(function() {
    // ���� EDIT 2016.5.26
    $.fn.drop = function(options) {
        options = $.extend({
            tapType  :  'click',   // Ĭ�ϵ����ʽclick
            n        :  0,         // Ĭ��li�ĳ�ʼֵ
            nType    :  'name',    // �ύ��span������ֵ
            speed    :  100        // ������������������ٶ�
        }, options || {});

        var $item = this; // ���thisָ������
        var $dropUl = $item.find('ul');
        var $dropLi = $item.find('ul li');
        var $dropInput = $item.find('input');
        var $dropIcon = $item.find('i');


        // ÿ��li������ֵvalue
        for(var i=0; i<$dropLi.length; i++) {
            $dropLi.eq(i).attr('value', options.n);
            options.n++;
        }

        // ��--���������¼�
        $item.on(options.tapType, function() {
            $('*[e-fun = drop]').find("ul").stop().slideUp(50);
            $dropUl.stop().slideToggle(options.speed);
            // ��������ͼ���л�(�����ͼ���õ�font awesome ���������滻)
            if($dropIcon.hasClass('fa-caret-down')) {
                $dropIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
            }
            else if($dropIcon.hasClass('fa-caret-up')) {
                $dropIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
            }
        }).on('click', 'li', function() {
            var _this = $(this),
                liText = _this.text();  // ��ȡli��ǩ�ڵ��ı�����
            // ��li�е�ֵ����input
            $dropInput.attr('value', liText).attr(options.nType, liText);
        });

        // ���ҳ�������ط�����������
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