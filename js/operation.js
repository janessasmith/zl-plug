/**
 * Created by ZhengLu on 2016/5/27.
 */

//$(function($) {
//    // 图片轮播重置 EDIT 2016.5.27
//    function slideInit() {
//        var $btnGo = $(this),
//            $list = $btnGo.prev('.list'),
//            $listCon = $list.find('.list-con'),
//            $listSpan = $listCon.find('span.tit'),
//            $listInput = $listCon.find('input'),
//
//        //$dropSpan = $drop.find('span'),
//            param = {};
//
//        for (var i = 0; i < $listCon.size(); i++) {
//            var paramName = $listSpan.eq(i).text().split('(')[0], // 获取“(”之前的字段
//                paramVal = $listInput.eq(i).val(); // 获取input框中的value值
//            //paramSpan = $dropSpan.eq(i)
//            param[paramName] = paramVal;
//        }
//
//        $('.slide').slider(param);
//        console.log(param);
//    }
//
//    $('.btn-op').on('click', slideInit);
//});

(function($) {
    //轮播重置
    function sliderInit(){
        var ths = $(this),
            $thsUl = ths.prev(".list"),
            $thsLi = $thsUl.find(".list-con"),
            $thsSpan = $thsLi.find("span.tit"),
            $thsIpt = $thsLi.find("input"),
            param = {};
        //console.log($thsLi);
        for(var i = 0, len = $thsLi.size(); i < len; i ++){
            var paramName = $thsSpan.eq(i).text().split("(")[0],
                paramVal = $thsIpt.eq(i).val();
            param[paramName] = paramVal;
        }
        $(".slide").slider(param);
        //console.log(param);
    }
    $(".btn-op").on("click", sliderInit);
})(jQuery);