var words = [
    {text: "TechWriter", weight: 15},
    {text: "Programming", weight: 13},
    {text: "Web Development", weight: 15},
    {text: "GIS", weight: 18},
    {text: "MEAN", weight: 14},
    {text: "Angular", weight: 15},
    {text: "Node", weight: 12},
    {text: "MongoDB", weight: 12},
    {text: "Game Dev", weight: 9},
    {text: "Python", weight: 9},
    {text: "Webstorm", weight: 9},
    {text: "Material Design", weight: 8},
    {text: "CSS", weight: 10},
    {text: "SASS", weight: 10},
    {text: "ArcMap", weight: 10},
    {text: "Flask", weight: 4},
    {text: "Firebase", weight: 7},
    {text: "PhaserJS", weight: 7},
    {text: "Atom", weight: 4},
    {text: "Sublime", weight: 5},
    {text: "Coding", weight: 10},
    {text: "EdTech", weight: 10},
    {text: "Socket.io", weight: 7},
    {text: "D3.js", weight: 6},
    {text: "React", weight: 3},
    {text: "Django", weight: 3},
    {text: "Redux", weight: 2},
    {text: "express", weight: 12},
    {text: "HTML5", weight: 10},
    {text: "JavaScript", weight: 20},
    {text: "Unity", weight: 2},
    {text: "C#", weight: 2},
    {text: "Ruby", weight: 2},
    {text: "Rails", weight: 2},
    {text: "Ionic", weight: 10},
    {text: "Data Viz", weight: 8},
    {text: "SQL", weight: 5},
];

$(document).ready(function(){
    pageScroll();
    $( window ).resize(function() {
        $(document).unbind('scroll');
        pageScroll();

    });

    $('#background').jQCloud(words,{colors: ["#0DC6DF","#0CB8CF", "#0BAAC0","#0A9DB1", "#098FA1", "#088292",
            "#077483", "#077483","#077483", "#066673", "#055964","#044B55"  ],
            fontSize: {from: 0.04, to: 0.02},
            autoResize: true,
            delay: 50
        }
    );


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

    if ($(window).width() < 376) {
        $(document).find('.col-xs-6').removeClass('col-xs-6').addClass('col-xs-12');
    }else{
        $(document).find('.col-xs-12').removeClass('col-xs-12').addClass('col-xs-6');
    }
};





