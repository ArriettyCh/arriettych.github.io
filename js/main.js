 /* --------------------------------------------------
  * Custom Js 
  * --------------------------------------------------*/
 (function($) {
	'use strict';

     /* --------------------------------------------------
      * template options (customable)
      * --------------------------------------------------*/

     var cz_nav_style = 1; // 1 - solid, 2 - transparent
     var cz_nav_color = 1; // 1 - dark, - 2 light
     var cz_nav_color_scroll = 1; // 1 - default, - 2 light

     /* --------------------------------------------------
      * predefined vars
      * --------------------------------------------------*/
     var mobile_menu_show = 0;
     var v_count = '0';
     var $window = $(window);
     var $tmp_h = '90';
	 var $op_header_autoshow = 0;
	 
	 if($('header').hasClass("has-topbar")){
		  $tmp_h = '125px';
     }
     //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

     /* --------------------------------------------------
      * header | style
      * --------------------------------------------------*/
     function header_styles() {
         if (cz_nav_style == 2) {
             $('header').addClass('transparent')
         }
         $('#mainmenu').addClass('no-separator');
         if (cz_nav_color == 2) {
             $('header').addClass('header-light');
         }
         if (cz_nav_color_scroll == 2) {
             $('header').addClass('scroll-light');
         }
     }    
     
     /* --------------------------------------------------
      * header | sticky
      * --------------------------------------------------*/
     function header_sticky() {
         jQuery("header").addClass("clone", 1000, "easeOutBounce");
         var $document = $(document);
         var vscroll = 0;
		 var header = jQuery("header.autoshow");
         if ($document.scrollTop() >= 50 && vscroll == 0) {
             header.removeClass("scrollOff");
             header.addClass("scrollOn");
             header.css("height", "auto");
             vscroll = 1;
         } else {
             header.removeClass("scrollOn");
             header.addClass("scrollOff");
             vscroll = 0;
         }
     }
     /* --------------------------------------------------
      * plugin | enquire.js
      * --------------------------------------------------*/
     function init_resize() {
        enquire.register("screen and (min-width: 993px)", {
            match: function() {
                mobile_menu_show = 1;
            },
            unmatch: function() {
                mobile_menu_show = 0;
                jQuery("#menu-btn").show();
            }
        });
        enquire.register("screen and (max-width: 993px)", {
            match: function() {
                $('header').addClass("header-mobile");
                var body = jQuery('body');
                if (body.hasClass('side-content')) {
                    body.removeClass('side-layout');
                }
            },
            unmatch: function() {
                $('header').removeClass("header-mobile");
                jQuery('header').css("height", $tmp_h);
                var body = jQuery('body');
                if (body.hasClass('side-content')) {
                    body.addClass('side-layout');
                }
            }
        });
        init();
        
        var header = $('header');
        header.removeClass('smaller');
        header.removeClass('logo-smaller');
        header.removeClass('clone');

        var mx = window.matchMedia("(max-width: 992px)");
        var osw = jQuery('.owl-slide-wrapper');
        if (mx.matches) {			 
            osw.find("img").css("height", $(window).innerHeight());
            osw.find("img").css("width", "auto");
            if($op_header_autoshow==1){
                header.removeClass('autoshow');
            }
            
        } else {
            osw.find("img").css("width", "100%");
            osw.find("img").css("height", "auto");
            if($op_header_autoshow==1){
                header.addClass('autoshow');
            }
        }


    };
     /* --------------------------------------------------
      * plugin | owl carousel
      * --------------------------------------------------*/
     function load_owl() {
		 
         jQuery("#testimonial-carousel").owlCarousel({
            center: false,
			items:3,
			loop:true,
			margin:30,
             responsive: {
                 320: {
                     items: 1
                 },
                 480: {
                     items: 1
                 },
                 768: {
                     items: 2
                 },
                 991: {
                     items: 3
                 }
             }
         });
		 
		 
     }
     /* --------------------------------------------------
      * counting number
      * --------------------------------------------------*/
     function cz_counter() {
         jQuery('.timer').each(function() {
             var imagePos = jQuery(this).offset().top;
             var topOfWindow = jQuery(window).scrollTop();
             if (imagePos < topOfWindow + jQuery(window).height() && v_count == '0') {
                 jQuery(function($) {
                     // start all the timers
                     jQuery('.timer').each(count);

                     function count(options) {
                         v_count = '1';
                         var $this = jQuery(this);
                         options = $.extend({}, options || {}, $this.data('countToOptions') || {});
                         $this.countTo(options);
                     }
                 });
             }
         });
     }
     /* --------------------------------------------------
      * add arrow for mobile menu
      * --------------------------------------------------*/
     function menu_arrow() {
         // mainmenu create span
         jQuery('#mainmenu li a').each(function() {
             if ($(this).next("ul").length > 0) {
                 $("<span></span>").insertAfter($(this));
             }
         });
         // mainmenu arrow click
         jQuery("#mainmenu > li > span").on("click", function() {
             
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     $(this).addClass("active");
                     $(this).parent().find("ul:first").css("height", "auto");
                     var curHeight = $(this).parent().find("ul:first").height();
                     $(this).parent().find("ul:first").css("height", "0");
                     $(this).parent().find("ul:first").animate({
                         'height': curHeight
                     }, 300, 'easeOutQuint');
					 $('header').css("height", $('#mainmenu')[0].scrollHeight+curHeight+(parseInt($tmp_h)*2));
                     break;
                 case 2:
					var curHeight = $(this).parent().find("ul:first").height();
                     $(this).removeClass("active");
                     $(this).parent().find("ul:first").animate({
                         'height': "0"
                     }, 300, 'easeOutQuint');
					 $('header').css("height", $('#mainmenu')[0].scrollHeight-curHeight+(parseInt($tmp_h)*2));
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
         jQuery("#mainmenu > li > ul > li > span").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     $(this).addClass("active");
                     $(this).parent().find("ul:first").css("height", "auto");
                     $(this).parent().parent().parent().find("ul:first").css("height", "auto");
                     var curHeight = $(this).parent().find("ul:first").height();
                     $(this).parent().find("ul:first").css("height", "0");
                     $(this).parent().find("ul:first").animate({
                         'height': curHeight
                     }, 400, 'easeInOutQuint');
                     break;
                 case 2:
                     $(this).removeClass("active");
                     $(this).parent().find("ul:first").animate({
                         'height': "0"
                     }, 400, 'easeInOutQuint');
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
     }
     /* --------------------------------------------------
      * center-y
      * --------------------------------------------------*/
     function centerY() {
         jQuery('.full-height').each(function() {
             var dh = jQuery(window).innerHeight();
             jQuery(this).css("min-height", dh);
         });
     }
/* --------------------------------------------------
      * multiple function
      * --------------------------------------------------*/
     function init() {
        function scrolling() {
            var mq = window.matchMedia("(min-width: 993px)");
            if (mq.matches) {
                var distanceY = window.pageYOffset || document.documentElement.scrollTop,
                    shrinkOn = 0,
                    header = jQuery("header");
                if (distanceY > shrinkOn) {
                    header.addClass("smaller");
                } else {
                    if (header.hasClass('smaller')) {
                        header.removeClass('smaller');
                    }
                }
            }
            if (mq.matches) {
                if (jQuery("header").hasClass("side-header")) {
                        jQuery('#main').removeClass("col-md-offset-3");
                        jQuery('h1#logo img').css("padding-left", "0px");
                        jQuery('header .h-content').css("padding-left", "0px");
                        jQuery('#mainmenu li').css("width", "100%");
                }

            }
        }
        scrolling();
    }
     /* --------------------------------------------------
      * document ready
      * --------------------------------------------------*/
     jQuery(document).ready(function() {
         'use strict';
         $("body").show();
         header_styles();
         init();
         // --------------------------------------------------
         // custom positiion
         // --------------------------------------------------
         var $doc_height = jQuery(window).innerHeight();
         jQuery('#homepage #content.content-overlay').css("margin-top", $doc_height);
         
         jQuery('.full-height .de-video-container').css("min-height", $doc_height);

		 
		 if(jQuery('header').hasClass("autoshow")){
			 $op_header_autoshow = 1;
		 }

         centerY();

         jQuery(".nav-exit").on("click", function() {
             $.magnificPopup.close();
         });
         // --------------------------------------------------
         // navigation for mobile
         // --------------------------------------------------
         jQuery('#menu-btn').on("click", function() {

            var h = jQuery('header')[0].scrollHeight;
			
             if (mobile_menu_show == 0) {
                 jQuery('header.header-mobile').stop(true).animate({
                     'height': h
                 }, 200, 'easeOutCubic');
                 mobile_menu_show = 1;
             } else {
                 jQuery('header.header-mobile').stop(true).animate({
                     'height': $tmp_h
                 }, 200, 'easeOutCubic');
                 mobile_menu_show = 0;
             }
         })
         jQuery("a.btn").on("click", function(evn) {
             if (this.href.indexOf('#') != -1) {
                 evn.preventDefault();
                 jQuery('html,body').scrollTo(this.hash, this.hash);
             }
         });
         // btn arrow up
         jQuery(".arrow-up").on("click", function() {
             jQuery(".coming-soon .coming-soon-content").fadeOut("medium", function() {
                 jQuery("#hide-content").fadeIn(600, function() {
                     jQuery('.arrow-up').animate({
                         'bottom': '-40px'
                     }, "slow");
                     jQuery('.arrow-down').animate({
                         'top': '0'
                     }, "slow");
                 });
             });
         });
         // btn arrow down
         jQuery(".arrow-down").on("click", function() {
             jQuery("#hide-content").fadeOut("slow", function() {
                 jQuery(".coming-soon .coming-soon-content").fadeIn(800, function() {
                     jQuery('.arrow-up').animate({
                         'bottom': '0px'
                     }, "slow");
                     jQuery('.arrow-down').animate({
                         'top': '-40'
                     }, "slow");
                 });
             });
         });
         /* --------------------------------------------------
          after window load
          * --------------------------------------------------*/
		 
         menu_arrow();
         load_owl();
         init_resize();
         init();
         //hide preloader after loaded
         jQuery('#preloader').delay(500).fadeOut(500);
         // one page navigation
         /**
          * This part causes smooth scrolling using scrollto.js
          * We target all a tags inside the nav, and apply the scrollto.js to it.
          */
         jQuery("#homepage nav a, .scroll-to").on("click", function(evn) {
             if (this.href.indexOf('#') != -1) {
                 evn.preventDefault();
                 jQuery('html,body').scrollTo(this.hash, this.hash);
             }
         });
	
		$('.accordion-section-title').click(function(e){
         var currentAttrvalue = $(this).data('tab');
         if($(e.target).is('.active')){
             $(this).removeClass('active');
             $('.accordion-section-content:visible').slideUp(300);
         } else {
             $('.accordion-section-title').removeClass('active').filter(this).addClass('active');
             $('.accordion-section-content').slideUp(300).filter(currentAttrvalue).slideDown(300);
         }
     });
		

         /* --------------------------------------------------
          * window | on resize
          * --------------------------------------------------*/
         $(window).resize(function() {
             centerY();
         });
         /* --------------------------------------------------
          * window | on scroll
          * --------------------------------------------------*/
         jQuery(window).on("scroll", function() {
             /* functions */
             header_sticky();
             cz_counter();
             init();
             /* plugin | stellar */
             $.stellar({
                 horizontalScrolling: false,
                 verticalOffset: 0
             });
             // got to tops
             if ($(this).scrollTop() > 100) {
                $('.scrollToTop').fadeIn();
              } else {
                $('.scrollToTop').fadeOut();
             }
             /* fade base scroll position */
             var target = $('.fadeScroll');
             var targetHeight = target.outerHeight();
             var scrollPercent = (targetHeight - window.scrollY) / targetHeight;
             if (scrollPercent >= 0) {
                 target.css('opacity', scrollPercent);
             } else {
                 target.css('opacity', 0);
             }
             // custom page with background on side
             jQuery('.side-bg').each(function() {
                 jQuery(this).find(".image-container").css("height", jQuery(this).find(".image-container").parent().css("height"));
             });
             /* go to anchor */
             jQuery('#mainmenu li a').each(function() {
                 var cur = jQuery(this);
                 if (this.href.indexOf('#') != -1) {
                     var href = jQuery(this).attr('href');
					if (location.hash!=="") {
						 if (jQuery(window).scrollTop() > jQuery(href).offset().top - 140) {
							 clearTimeout($.data(this, "scrollCheck"));
							 $.data(this, "scrollCheck", setTimeout(function() {
								 jQuery('#mainmenu li a').removeClass('active');
								 cur.addClass('active');
							 }, 250));

						 }
					 }
                 }
             });
			 
			 // acc
			 $('.toggle').click(function(e) {
				e.preventDefault();
			  
				var $this = $(this);
			  
				if ($this.next().hasClass('show')) {
					$this.next().removeClass('show');
					$this.next().slideUp(350);
				} else {
					$this.parent().parent().find('li .inner').removeClass('show');
					$this.parent().parent().find('li .inner').slideUp(350);
					$this.next().toggleClass('show');
					$this.next().slideToggle(350);
				}
			});



         });
         $(function() {
             "use strict";
             var x = 0;
             setInterval(function() {
                 x -= 1;
                 $('.bg-loop').css('background-position', x + 'px 0');
             }, 50);
         })
		 
		$(window).load(function() {
		new WOW().init();
		window.dispatchEvent(new Event('resize'));
		
		$('.grid').isotope({
			itemSelector: '.grid-item'
        });
		
         });
     });
 })(jQuery);