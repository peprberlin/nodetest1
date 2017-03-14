


/*=============================================================
 Authour URI: www.binarycart.com
 License: Commons Attribution 3.0
 
 http://creativecommons.org/licenses/by/3.0/
 
 100% To use For Personal And Commercial Use.
 IN EXCHANGE JUST GIVE US CREDITS AND TELL YOUR FRIENDS ABOUT US
 
 ========================================================  */


(function ($) {
  "use strict";
  var mainApp = {

    main_fun: function () {
      /*====================================
       METIS MENU 
       ======================================*/
      $('#main-menu').metisMenu();

      /*====================================
       LOAD APPROPRIATE MENU BAR
       ======================================*/
      $(window).bind("load resize", function () {
        if ($(this).width() < 768) {
          $('div.sidebar-collapse').addClass('collapse')
        } else {
          $('div.sidebar-collapse').removeClass('collapse')
        }
      });
    },

    check_notify: function () {
      console.log('check_notify', $('.js-message').length);
      if ($('.js-message').length > 0) {
        $('.js-message').each(function (index) {
          var type;
          var t = 600;
          switch($(this).attr('data-message-type')){
            case 'error' : type = 'danger'; t = null; break;
            case 'success' : type = 'success';break;
            case 'warning' : type = 'warning';break;
            case 'info' : 
            default: type = 'warning';break;
          }
          console.log(index,t);
          $.notify({
            message: $(this).html()
          }, {
            // settings
            type: type,
            timer: t,
            placement: {
              from: "top",
              align: "center"
            }
          });
        });
      }
    },
    clear_password: function () {
      if ($('.js-empty-input').length > 0){
        $('.js-empty-input').val('');
      }
    },
    initialization: function () {
      mainApp.main_fun();
    }

  }
  // Initializing ///

  $(document).ready(function () {
    mainApp.main_fun();
    mainApp.check_notify();
    mainApp.clear_password();
  });

}(jQuery));
