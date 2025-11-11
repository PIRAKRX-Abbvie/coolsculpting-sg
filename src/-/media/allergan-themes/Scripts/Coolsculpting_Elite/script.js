$(document).ready(function () {
    //    $(window).scroll(function(){
    //        if($(window).scrollTop() > $('header').height() -70) {
    //            $('header').addClass('sticky');
    //            }
    //        else {
    //            $('header').removeClass('sticky');
    //        }
    
    //    })
        var element = null;
        if (window.location.href.includes('#')) {
            var element = $('#' + window.location.href.split('#')[1]);
            var headerHeight = $('header').height();
            setTimeout(function () {
                var offsetVal = element.offset().top - headerHeight;
                $('body, html').animate({
                    scrollTop: offsetVal
                }, 100);
            }, 400)
        }
        $('.faqs .accordion-section #collapse1 a, .faqs .accordion-section #collapse9 a').click(function () {
            var targetID = $(this).attr('href');
            if ($(window).width() > 767) {
            var targetST = $(targetID).offset().top - 135;
            } else {
            var targetST = $(targetID).offset().top - 90;
            }
            $('body, html').animate({
            scrollTop: targetST + 'px'
            }, 500);
        })
    
        //Hero Banner Carousel Script
        $('.carousel').attr('data-interval', '3000');
        var noOfSlides = $('.carousel-inner .carousel-item').length;
        var carouselIndicatorUl = $('<ul/>')
            .attr('class', 'carousel-indicators');
    
        for (i = 0; i < noOfSlides; i++) {
            var carouselIndicatorli = $('<li/>')
                .attr('data-iseeditor', i)
                .attr('data-slide-to', i)
                .attr('tabindex', 0)
                .attr('data-target', '.carousel')
            if (i == 0) {
                carouselIndicatorli.attr('class', 'active');
            }
            carouselIndicatorUl.append(carouselIndicatorli);
        }
        $('.carousel-inner').after(carouselIndicatorUl);
        $('.carousel-sec .carousel .carousel-item:first-child').addClass('active');
        $('.carousel').carousel({   
            'interval': false
        });
    
        if ($('body').hasClass('home')) {
            var player = (typeof Vimeo !== 'undefined') ? (new Vimeo.Player($('.carousel-sec .carousel-inner iframe'))) : null;
           if (player != null) {
               player.on('ended', function () {
                   $('.carousel-sec .carousel .carousel-indicators li:nth-child(2)').click();
               });
               player.on('play', () => {
                   $('.carousel-sec .carousel-indicators').hide();
                });
                
               player.on('pause', () => {
                   controls: false
                   $('.carousel-sec .carousel-indicators').show();
                });
                
            }
            
            var player1 = (typeof Vimeo !== 'undefined') ? (new Vimeo.Player($('.video-comp .video-wrapper iframe'))) : null;
            if (player1 != null) {
                var timer = 1;
               player1.on('ended', function () {
                   if (timer <= 1) {
                       player1.play();
                       timer++;
                   }
                   else {
                       player1.stop();
                   }
               })
           }
        }
        //Adding Gradient Line in Wht to expect Page
        $('<div class="gradient-line"></div>').insertBefore('.let-science-go')
        $('<div class="gradient-line"></div>').insertBefore('.and-chill')
    
        //navigation
        var device = $(window).width() > 992 ? "desktop" : "mobile";
        $('header a.nav-link').each(function () {
            if ($(this).attr('data-toggle') == "dropdown") {
                $(this).removeAttr('data-toggle');
            }
        })
    
        // Change the Language navigator Divider 
        $('.language_selector a + span').html('|');
        //Toggle Hamburger icon 
        $('.navbar-toggler').on('click', function () {
            if ($(window).width() < 992) {
                if (!$('.navbar-toggler').hasClass('showContent')) {
                    $('.navbar-toggler, .header-links').addClass('showContent');
                } else {
                    $('.navbar-toggler, .header-links').removeClass('showContent');
                }
            }
        })
    
        var $dropdown = $(".nav-item.dropdown");
        var $dropdownToggle = $(".dropdown-toggle");
        var $dropdownMenu = $(".dropdown-menu");
        var showClass = "show";
    
        // $(window).on("load resize", function () {
        $dropdown.hover(
            function () {
                var $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function () {
                var $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
        );
        // });
       // $('.second-level-menus .top-nav .nav-item:first-child a.nav-link').addClass('active');
        var i = window.location.href;
        $(".nav-item a").each(function () {
            i == this.href && $(this).closest("li").addClass("active") && $(this).closest("a").addClass("active") && $(this).closest("ul").prev('a').addClass("active")
        }),
            $(".top-nav-link a").each(function () {
                i != this.href || i.includes("#") || $(this).closest("li").addClass("active")
            });
    
        if (device == "desktop") {
            $(document).delegate(".cards .item", "click", function () {
                window.location = $(this).find("a").attr("href");
            });
        }
    
    
        $('#accordion .card').each(function () {
            $(this).find('.card-header img.img-collapse').attr('src', $(this).parents('.accordion-section').data('collapse-icon'));
            $(this).find('.card-header img.img-expand').attr('src', $(this).parents('.accordion-section').data('expand-icon'));
        });
    
        //$('.accordion-section .card .card-header a').removeClass('collapsed');
        //$('.accordion-section .card:first-child .collapse').addClass('show');
        //$('.accordion-section .card:first-child h2 a').attr('aria-expanded', true);
        $('.collapse').each(function () {
            $(this).attr('data-parent', '#accordion');
            $(this).eq(0).collapse('show');
        })
    
    });
    
    
    
    // Back to top
    $(document).ready(function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > ($(window).height() / 5)) {
                $('.backtotop').show();
            } else {
                $('.backtotop').hide();
            }
        });
    
        $('.backtotop img').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });
    });
    
    //Multiple Spans for Navbar togggler 
    $('header .navbar .navbar-toggler').append('<span></span><span></span>');
    
    //Adding ID's for required Sections
    $('.uses-comp').attr('id', 'uses');
    $('.references-comp').attr('id', 'references');
    
    // Videos Section
    $(function () {
        $('.footer-brand-logo').attr('tabindex', '-1');
        var $allVideos = $("iframe[src*='https://player.vimeo.com'], iframe[src*='https://vimeo.com'], iframe[src*='https://www.youtube.com'], iframe[src*='/-/media/Feature/'], object, embed");
        var $fluidEl1 = document.querySelectorAll(".video-wrapper");
        var $fluidEl = [];
        for (var i = 0; i < $fluidEl1.length; i++) {
            $fluidEl[i] = $fluidEl1[i];
        }
        $allVideos.each(function () {
            $(this)
               .attr('data-aspectRatio', this.height / this.width)
                .removeAttr('height')
               .removeAttr('width');
        });
        $(window).resize(function () {
            var i = 0;
            $allVideos.each(function () {
                var newWidth = $fluidEl[i].clientWidth;
                var $el = $(this);
                $el.width(newWidth).height(newWidth * $el.attr('data-aspectRatio'));
                i++;
            });
        }).resize();
    });
    
    // Counter Animation
    $(function () {
    
    
    
    var iCounter = 10;
    
    
    
    function isScrolledIntoView($elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = ($elem.parents('.multicolumn').offset() != undefined) ? ($elem.parents('.multicolumn').offset().top) : null;
    var elemBottom = $elem.parents('.multicolumn').height() + elemTop;
    return (docViewTop > (elemTop - 450) && docViewTop < (elemBottom - 450));
    }
    
    
    
    function count($this) {
    
    var current = parseFloat(($this).find('.count-percent').html(), iCounter).toFixed('0');
    if (isScrolledIntoView($this)) {
    
    
    
    $this.removeProp('Counter', 0).animate({
    Counter: $this.data("count")
    
    
    
    }, {
    duration: 3000,
    easing: 'swing',
    step: function (now) {
    $this.find('.count-percent').html(parseFloat(now, iCounter).toFixed('0'));
    }
    });
    
    
    
    $this.data("isCounting", true);
    } else {
    $this.data("isCounting", false);
    $this.stop();
    $this.find('.count-percent').text('0');
    }
        }
        
        $('.counter .item').each(function () {
            $(this).data('count', parseFloat( $(this).find('.count-percent').html(), iCounter).toFixed('0'))
            $(this).find('.count-percent').html(parseFloat(0, iCounter).toFixed('0'));
            $(this).data("isCounting", false);
        })
    
    $(window).scroll(function () {
    count($(".counter .item").last());
    });
    });
    