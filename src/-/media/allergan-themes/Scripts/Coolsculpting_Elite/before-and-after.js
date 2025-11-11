var delay = 600;
var indication = '';
var baPhotos = '';
var currentFront = '';
var currentBack = '';
var allText = '';

$(document).on('click', '.indications', function(event) {
    event.preventDefault();
indication = event.target.id;

    console.log('indication on update: '+indication);
    var getGender = $('.button-toggle.active').attr('id');
    filterGenderAndIndication(getGender, indication);

    console.log('Last line of indications click.');
}); //End .indications click


$('.button-toggle').click(function(event) {
    if ($(this).hasClass('active')) {

    } else {
        $('.button-toggle').removeClass('active');
        $(this).addClass('active');

        var getGender = $(this).attr('id').split('-')[0];
        $('#slider').slick('slickUnfilter'); 
        //move links for male image indications
        if (getGender == 'male') {
            $('.front.female').removeClass('female').addClass('male');
            $('.back.female').removeClass('female').addClass('male');
            dataLayer.push({
                "event": "seeRealResultsTabClick",
                "tabClicked": "Male"
            })

        } else {
            $('.front.male').removeClass('male').addClass('female');
            $('.back.male').removeClass('male').addClass('female');
            dataLayer.push({
                "event": "seeRealResultsTabClick",
                "tabClicked": "Female"
            })

        }

        if (getGender == 'male') {
            setTimeout(function(){
                $('#slider').slick('slickFilter', $('.male').parent().parent());
                $('#slider').slick('slickGoTo', '0').parent().parent();
                $('span#indication').replaceWith(allText);
            }, delay);

        } else {
            setTimeout(function(){
                $('#slider').slick('slickFilter', $('.female').parent().parent());
                $('#slider').slick('slickGoTo', '0').parent().parent();
                $('span#indication').replaceWith(allText);
            }, delay);
        }
        var frontupdateId = $(this).attr('id').replace('0', 'front')
        $('#front-image').attr('src', $('[data-id='+frontupdateId+']').attr('data-imgUrl'));
        var backupdateId = $(this).attr('id').replace('0', 'back')
        $('#back-image').attr('src', $('[data-id=' + backupdateId + ']').attr('data-imgUrl'));
    }
}); //End button toggle


function filterGenderAndIndication(g, i) {
    console.log('filterGenderAndIndication gender is: '+g);
    console.log('filterGenderAndIndication indication is: '+i);
    //Unfitler to show all slides, and go to the first slide.
    $('.slide-wrap').css('visibility', 'hidden');
    $('#slider').slick('slickUnfilter'); 
    if (indication.split('-')[0] == "male") {
        var malesplitterValue = indication.split('-')[1]
        $('#front-image').attr('src', $('[data-id=male-front-' + indication.split('-' + malesplitterValue + '-')[1] + ']').attr('data-imgUrl'));
        $('#back-image').attr('src', $('[data-id=male-back-' + indication.split('-' + malesplitterValue + '-')[1] + ']').attr('data-imgUrl'));
        setTimeout(function () {
            var bodyPart = $('#' + indication).attr('bodypart');
            $('span#indication').replaceWith('<span id="indication">' + bodyPart + '</span>');
            //event
            dataLayer.push({
                "event": "seeRealResultsBodyPartClick",
                "bodyPart": bodyPart
            })
            $('#slider').slick('slickFilter', $('.male-' + indication.split('-' + malesplitterValue+'-')[1]).parent().parent());
            $('#slider').slick('slickGoTo', '0').parent().parent();
            $('.loader').css('display', 'none');
            $('.slide-wrap').css('visibility', 'visible');
        }, delay);
    } else {
        var femalesplitterValue = indication.split('-')[1]
        $('#front-image').attr('src', $('[data-id=female-front-' + indication.split('-' + femalesplitterValue+'-')[1] + ']').attr('data-imgUrl'));
        $('#back-image').attr('src', $('[data-id=female-back-' + indication.split('-' + femalesplitterValue + '-')[1] + ']').attr('data-imgUrl'));
        setTimeout(function () {
            var bodyPart = $('#' + indication).attr('bodypart');
            $('span#indication').replaceWith('<span id="indication">' + bodyPart + '</span>');
            //event
            dataLayer.push({
                "event": "seeRealResultsBodyPartClick",
                "bodyPart": bodyPart
            })

            $('#slider').slick('slickFilter', $('.female-' + indication.split('-' + femalesplitterValue+'-')[1]).parent().parent());
            $('#slider').slick('slickGoTo', '0').parent().parent();
            $('.loader').css('display', 'none');
            $('.slide-wrap').css('visibility', 'visible');
        }, delay);
    }
    currentFront = $('#front-image').attr('src');
    currentBack = $('#back-image').attr('src');
console.log('Last line of filterGenderAndIndication function.');
}
$(document).ready(function () {
$('.li-coord li').on('dblclick', function () {
    var parId = $(this).parent().parent().attr('id');
    var x_default = $(this).find("[data-drag=dragged-val-x]").children("div").find("span.scWebEditInput").text();
    var y_default = $(this).find("[data-drag=dragged-val-y]").children("div").find("span.scWebEditInput").text();
    var w_default = $(this).find("[data-drag=dragged-val-w]").children("div").find("span.scWebEditInput").text();
    var h_default = $(this).find("[data-drag=dragged-val-h]").children("div").find("span.scWebEditInput").text();

    if (x_default == null || x_default == undefined || x_default == "" || x_default == "[No text in field]") {
        x_default = "0";
    }
    if (y_default == null || y_default == undefined || y_default == "" || y_default == "[No text in field]") {
        y_default = "0";
    }
    if (w_default == null || w_default == undefined || w_default == "" || w_default == "[No text in field]") {
        w_default = "20px";
    }
    if (h_default == null || h_default == undefined || h_default == "" || h_default == "[No text in field]") {
        h_default = "20px";
    }

    $("#"+parId+" .rectResize").empty().remove();
    $('#' + parId).find(".body-view-image").find('.image-sec').append("<div data-parId='" + parId + "' data-liIndex='" + $(this).index() + "' style='border: 1px dashed red; position: absolute; top:" + y_default + "; left:" + x_default + "; width:" + w_default + "; height:" + h_default + "; border-radius:5px; background-color: transparent;' class='rectResize ui-widget-content'></div>");
    $('#' + parId).find(".body-view-image .rectResize").resizable();
    $('#' + parId).find(".body-view-image .rectResize").draggable();
});

$(document).on('dblclick', '.body-view-image .rectResize', function () {
    var data_parId = $(this).attr("data-parId");
    var data_liIndex = $(this).attr("data-liIndex");
    if ($(data_parId).find(".body-view-image").hasClass("female")) {
        gender = "female"
    }
    else {
        gender = "male";
    }
    var id = data_parId.replace("-", "-"+ gender +"-")
    var x = Number((($(this).position().left) / $('#' + data_parId + ' img').width() * 100).toFixed(1));
    $(this).attr('data-coords-x', x + "%");
    var y = Number((($(this).position().top) / $('#' + data_parId + ' img').height() * 100).toFixed(1));
    $(this).attr('data-coords-y', y + "%");
    var w = Number((($(this).width()) / $('#' + data_parId + ' img').width() * 100).toFixed(1));
    $(this).attr('data-coords-w', w + "%");
    var h = Number((($(this).height()) / $('#' + data_parId + ' img').height() * 100).toFixed(1));
    $(this).attr('data-coords-h', h + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).find("[data-drag=dragged-val-x]").children("div").text(x + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).find("[data-drag=dragged-val-y]").children("div").text(y + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).find("[data-drag=dragged-val-w]").children("div").text(w + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).find("[data-drag=dragged-val-h]").children("div").text(h + "%");

    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-coords-x-d', x + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-coords-y-d', y + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-coords-w-d', w + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-coords-h-d', h + "%");
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-id', id);
    $('#' + data_parId + ' .li-coord li').eq(data_liIndex).attr('data-gender', gender);
    getcoords(data_parId);
});

function getcoords(hotspottabid) {
    $("#" + hotspottabid + " .svg").empty();
    $("#" + hotspottabid + " .li-coord").find('li').each(function () {
        var x = $(this).attr("data-coords-x-d");
        var y = $(this).attr("data-coords-y-d");
        var w = $(this).attr("data-coords-w-d");
        var h = $(this).attr("data-coords-h-d");
        var bodyPart = $(this).attr("data-bodypart");
        var id = $(this).attr("data-id");
        var setClass = "indications " + $(this).attr("data-gender");
        drawSVG(x, y, w, h, id, hotspottabid, bodyPart, setClass);
    });
}
function drawSVG(x, y, w, h, id, hotspottabid, bodyPart, setClass) {
    var svg = $("#" + hotspottabid + " .svg");
    var rect = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
        x: x,
        y: y,
        width: w,
        height: h,
        "bodypart": bodyPart,
        stroke: "red",
        fill: "transparent",
        "stroke-width": 1,
        "rx": "5",
        "ry": "5",
        "stroke-dasharray": 2,
        "id": id,
        "class": setClass
    });
    svg.append(rect);
}
resizeSVG();
$(window).resize(function () {
    resizeSVG();
});
function resizeSVG() {
    $('.li-coord').each(function(){
        getcoords($(this).parent().attr('id'));
    })
}
})


$(function() {
    //initialize slides

    $("#slider").slick({
          //lazyLoad: 'progressive', // ondemand progressive anticipated
        dots: false,
        infinite: false,
        slidesToShow: 1,
        //adaptiveHeight: true,
        arrows: true,
        lazyLoad: 'ondemand',
        prevArrow: '<button type="button" aria-label="Previous Arrow" class="slick-prev" title="Previous"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="svg-inline--fa fa-chevron-left fa-w-10" role="img" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg></button>',
        nextArrow: '<button type="button" aria-label="Next Arrow" class="slick-next" title="Next"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="svg-inline--fa fa-chevron-right fa-w-10" role="img" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg></button>'
    });
    //Add Results Header
    var header = '';
    var lang = $('html').attr('data-lang').toLowerCase();
    if (lang == "zh") {
        allText = '<span id="indication"> &#20840;&#37096;</span> '
        header = '<h4 class="results">&#32080;&#26524;: ' + allText + '</span></h4> '
    } else {
        allText = '<span id="indication">All</span>'
        header = '<h4 class="results">Results:' + allText + '</h4> '
    }
    $('#slider').prepend(header);
    //Load all female indications by default, on page load.
    setTimeout(function () {
        $('#slider').slick('slickFilter', $('.female').parent().parent());
        $('.loader').css('display', 'none');
    }, 2000);

    $(document).on('click', '.slick-prev', function () {
        var bodyPart = "";
        if (indication == "") {
            bodyPart = "All"
        } else {
            bodyPart = $('#' + indication).attr('bodypart');
        }
        dataLayer.push({ 'event': 'seeRealResultsCarouselLeftClick', 'bodyPart': bodyPart })
    })
    $(document).on('click', '.slick-next', function () {
        var bodyPart = "";
        if (indication == "") {
            bodyPart = "All"
        } else {
            bodyPart = $('#' + indication).attr('bodypart');
        }
        dataLayer.push({ 'event': 'seeRealResultsCarouselRightClick', 'bodyPart': bodyPart })
    })
});