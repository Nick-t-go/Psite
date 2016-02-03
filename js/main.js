$(document).ready(function(){
    pageScroll();
    $( window ).resize(function() {
        $(document).unbind('scroll');
        pageScroll();

    });


});


var pageScroll = function() {
    if ($(window).width() > 975) {
        $(document).scroll(function () {
            console.log($(window).width());
            var $target = $('specialcontainer');
            var winHeight = $(window).scrollTop();
            var offsetArr = $('.specialcontainer').each(function () {
                var top = $(this).offset().top;
                var difference = winHeight - top;
                $(this).find('.fixedContainer').css('top', difference);
            })

        });
    } else{
        var offsetArr2 = $('.specialcontainer').each(function () {
            $(document).find('.fixedContainer').css('top', 'inherit');
            $(document).find('.fixedContainer').addClass('row')
        })
    }
};





