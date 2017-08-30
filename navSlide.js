
(function ($, window, undefined) {
    $.fn.jqSwipe = function (classname) {
        var $binder = $(this),
            binder = $(this).get(0),
            $children = $binder.children(),
            itemNum = $children.length,
            binderWidth = 0,
            transl_x = 0,  //translate3d transition value
            transl_x_temp = 0,
            prefix = (function(temp) {
                var props = [['transformProperty',''], ['WebkitTransform','-webkit-'], ['MozTransform','-moz-'], ['OTransform','-o-'], ['msTransform','-ms-']];
                for ( var i in props ) {
                    if (temp.style[ props[i][0] ] !== undefined) return props[i][1];
                }
                return '';
            })(document.createElement('jqSwipe')),
            transition = prefix + "transition",
            transform = prefix + "transform",
            vp_width = prefix==="-moz-" ? screen.width : window.innerWidth; //vieport width hack

        classname = classname || null;
        for(var j = 0; j < itemNum; j++) {
            binderWidth += $children.eq(j).innerWidth();
        }
        binderWidth += 10;
        initSwipe();

        /**
         * init UI
         */
        function initUI(){
            setTransition("0");
            $binder.css(transform, "translate3d(0,0,0)")
            .css("width",binderWidth);
        }

        /** 
         * @param time {string} - transition time（s）
         */
        function setTransition(time){
            binder.style[transition] = transform + " " + time + "ms";
        }

        function dealTransition(x,transTime){
            x = x||0;
            transTime = transTime||"300";
            setTransition(transTime);
            $binder.css(transform, "translate3d(" + x + "px,0,0)");
            setTimeout(function(){setTransition("0")},transTime);
            transl_x = x;
        }

        function activeItem(){
            $binder.on("click",$children,function(e){
                var $item = $(e.target),
                    index = $item.index(),
                    transl_x_temp = 0;
                if(classname){
                    $item.addClass(classname).siblings().removeClass(classname);
                }
            })
        }

        /**
         * deal gesture
         */
        function dealGesture(){
            var min_x = vp_width - binderWidth,
                touch_x = 0,
                move_s = 0;
            binder.addEventListener('touchstart', function (e) {
                transl_x_temp = transl_x;
                touch_x = e.targetTouches[0].clientX;
            },false);
            binder.addEventListener('touchmove', function (e) {
                move_s = e.targetTouches[0].clientX - touch_x;
                if(transl_x_temp < min_x){
                    transl_x_temp = move_s + transl_x + (min_x-transl_x_temp)*0.6;
                }else if(transl_x_temp>0){
                    transl_x_temp = move_s + transl_x - (transl_x_temp)*0.6;
                }else{
                    transl_x_temp = move_s + transl_x;
                }

                $binder.css(transform, "translate3d(" + transl_x_temp + "px,0,0)");

                e.preventDefault();
                e.stopPropagation();
            },false);
            binder.addEventListener('touchend', function () {
                if(transl_x_temp < min_x){
                    dealTransition(min_x);
                }else if(transl_x_temp>0){
                    dealTransition();
                }else{
                    transl_x = transl_x_temp;
                }
            },false);
        }

        /**
         * init all
         */
        function initSwipe() {
            initUI();
            dealGesture();
            activeItem();
        }
    }
}(jQuery,window,undefined));
