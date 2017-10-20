// 
//	Scripts for the theme, 
// 	slideshow is used for Home Alt #4 (index4.html)
// 	services is used for Services (services.html)
// 

$(function () {
  slideshow.initialize();

  services.initialize();

  contactForm.initialize();


  // retina display
  if (window.devicePixelRatio >= 1.2) {
    $("[data-2x]").each(function () {
      if (this.tagName == "IMG") {
        $(this).attr("src", $(this).attr("data-2x"));
      } else {
        $(this).css({ "background-image": "url(" + $(this).attr("data-2x") + ")" });
      }
    });
  }

  $('.input-group-select .dropdown-menu a').on('click', function () {
    $('.input-grounp-select__pse').attr('data-value', $(this).attr('data-value'))
    $('.input-grounp-select__pse').text($(this).text());

  });

  // Jquery data table setting
  if($('.jquery-data-table').length){
    $('.jquery-data-table').DataTable({
      'info': false,
      'lengthChange': false,
      "pagingType": "numbers",
      'language': {
        'zeroRecords': '<span class="uk-text-warning">没有相关数据…</span>',
        'search':         '<i class="uk-icon-search uk-text-muted"></i>&nbsp;<span class="uk-text-muted">搜索：<span>',
      }
    });
  }
  
});

window.utils = {
  isFirefox: function () {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }
};

var contactForm = {
  initialize: function () {
    var $contactForm = $("#contact-form");
    if (!$contactForm.length) {
      return;
    }

    $contactForm.validate({
      rules: {
        "name": {
          required: true
        },
        "email": {
          required: true,
          email: true
        },
        "message": {
          required: true
        }
      },
      highlight: function (element) {
        $(element).closest('.form-group').removeClass('success').addClass('error')
      },
      success: function (element) {
        element.addClass('valid').closest('.form-group').removeClass('error').addClass('success')
      }
    });
  }
}

var services = {
  tabs: function () {
    $tabs = $(".services-tabs");
    $hexagons = $tabs.find(".hexagon");
    $sections = $tabs.find(".section");

    $hexagons.click(function () {
      $hexagons.removeClass("active");
      $(this).addClass("active");
      var index = $hexagons.index(this);
      $sections.fadeOut();
      $sections.eq(index).fadeIn();
    });
  },

  screenHover: function () {
    $screens = $(".features-hover-section .images img");
    $features = $(".features-hover-section .features .feature");
    $features.mouseenter(function () {
      if (!$(this).hasClass("active")) {
        $features.removeClass("active");
        $(this).addClass("active");
        var index = $features.index(this);
        $screens.stop().fadeOut();
        $screens.eq(index).fadeIn();
      }
    });
  },

  initialize: function () {
    this.tabs();
    this.screenHover();
  }
}

var slideshow = {
  initialize: function () {
    var $slideshow = $(".slideshow"),
      $slides = $slideshow.find(".slide"),
      $btnPrev = $slideshow.find(".btn-nav.prev"),
      $btnNext = $slideshow.find(".btn-nav.next");

    var index = 0;
    var interval = setInterval(function () {
      index++;
      if (index >= $slides.length) {
        index = 0;
      }
      updateSlides(index);
    }, 4500);

    $btnPrev.click(function () {
      clearInterval(interval);
      interval = null;
      index--;
      if (index < 0) {
        index = $slides.length - 1;
      }
      updateSlides(index);
    });

    $btnNext.click(function () {
      clearInterval(interval);
      interval = null;
      index++;
      if (index >= $slides.length) {
        index = 0;
      }
      updateSlides(index);
    });

    $slideshow.hover(function () {
      $btnPrev.addClass("active");
      $btnNext.addClass("active");
    }, function () {
      $btnPrev.removeClass("active");
      $btnNext.removeClass("active");
    });


    function updateSlides(index) {
      $slides.removeClass("active");
      $slides.eq(index).addClass("active");
    }
  }
}


/**
 * Add row fields to table
 */
$('.add-row-form').on('click', function () {
  var $table = $(this).parent().parent().parent().parent();
  var htmlStr = '<tr class="uk-animation-fade">' +
    $table.find('tbody tr:first-child').html()
      .replace(/disabled=""|disabled/g, '')
      .replace(/readonly=""|readonly/g, '') +
    '</tr>';
  var $trDom = $(htmlStr);
  $trDom.find('input').each(function () {
    $(this).val('');
  })
  $table.find('tbody').append($trDom);
});

/**
 * Remove row fields in table
 * if only one record left, just clear the form data
 */
$('table').on('click', '.remove-row-form', function () {
  var $trDom = $(this).parent().parent();
  if ($trDom.siblings().length) {
    $trDom.addClass('uk-animation-reverse').remove();
  }

  // if only one record left, instead of delete, just clear form value
  else {
    $trDom.find('input').each(function () {
      $(this).val('');
    })
  }
});


/**
 * Return section-form data
 * @param  {$dom} $ele The section element
 * @return {Array}      example: [{"name": "value"}]
 */
function loopSectionData($ele){
    var arrayData = [];
    $ele.each(function(){
      var item = {};
      $(this).find('input').each(function(){
        item[$(this).attr('name')] = $(this).val().trim();
      });
      $(this).find('select').each(function(){
        item[$(this).attr('name')] = $(this).val().trim();
      });
      $(this).find('textarea').each(function(){
        item[$(this).attr('name')] = $(this).val().trim();
      });
      arrayData.push(item);
    });
    return arrayData
}



/**
 * Proxy change or add submit
 * @param  {string} postUrl     Post address
 * @param  {string} redirectUrl If the param exists, redirect to the url after success deal with response data
 * @return {[type]}             [description]
 */
function proxyInfoSubmit(postUrl, redirectUrl) {
  $('.proxy-info-submit').on('click', function () {
    var modal = UIkit.modal("#loading-modal");
    modal.show();
    var reqData = {};
    $('.proxy-form--modify input').each(function () {
      reqData[$(this).attr('name')] = $(this).val().trim();
    })
    $('.proxy-form--modify select').each(function () {
      reqData[$(this).attr('name')] = $(this).val().trim();
    })
    $('.proxy-form--modify textarea').each(function () {
      reqData[$(this).attr('name')] = $(this).val().trim();
    })
    $.post(postUrl, JSON.stringify(reqData), function (res) {
      modal.hide();
      if (res.code === '0000') {
        if (redirectUrl) {
          UIkit.notify('数据上传成功， 请上传合同文件', { status: 'success' });
          setTimeout(function(){
            window.location.href = redirectUrl;
          }, 3000);
        }
        else {
          UIkit.notify(res.msg, { status: 'success' });          
        }
      }
      else {
        UIkit.notify(res.msg, { status: 'warning' })
      }
    }, 'json')
      .fail(function () {
      modal.hide(); 
      UIkit.notify('无法连接到服务器，请稍后再试(＞﹏＜)', { status: 'warning' })
    }); 
  });
}
  


function doAction(url, reqData, onSuccess) {
    $.post(url, reqData, function(res){
      if (res.code === '0000') {
        UIkit.notify((res.msg || '数据更新成功') + ', 3s 后刷新数据', {status:'success'});
        if((typeof onSuccess) === 'function') {
          onSuccess();
        }
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
      else {
        UIkit.notify(res.msg || '数据处理异常，请联系管理员', {status:'warning'});
      }
    }, 'json')
    .fail(function(err){
      UIkit.notify('无法连接到服务器，请稍后再试(＞﹏＜)', {status:'warning'})
    });
  }



/**
 * Full page Loading modal, block page
 */
  function LoadingModal(){
    var loadingModal = '<div id="loading-modal" class="uk-modal">' +
      '<div class="uk-modal-dialog uk-modal-dialog-blank uk-height-viewport uk-text-center">' +
      '<div class="uk-container-center" style="position: relative;top: 30%;"><div class="css-loader"></div></div>' +
      '</div>' +
      '</div>';
    $('body').append(loadingModal);
    this.modal = UIkit.modal("#loading-modal");
  }
  LoadingModal.prototype.show = function(){
    this.modal.show();
  }
  LoadingModal.prototype.hide = function(){
    this.modal.hide();
  }


  
  /**
   * Returns an array of dates between the two dates
   * @param  {[type]} startDate [description]
   * @param  {[type]} endDate   [description]
   * @example
   * const start = moment('2011-04-15', 'YYYY-MM-DD');
   * const end   = moment('2011-04-17', 'YYYY-MM-DD');
   * enumerateDaysBetweenDates(start, end);
   * @return {[type]}           [description]
   */
  function enumerateDaysBetweenDates(startDate, endDate) {
    startDate = moment(startDate);
    endDate = moment(endDate);
    var now = startDate, dates = [];
    while (now.isBefore(endDate) || now.isSame(endDate)) {
      dates.push(now.format('YYYY-MM-DD'));
      now.add(1, 'days');
    }
    return dates;
  };