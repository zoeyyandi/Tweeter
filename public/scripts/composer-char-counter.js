$(document).ready(function() {
  $(document).on('keyup', '#text', function(){
    var length = $(this).val().length
    var remaining = 140 - length
    var $counter = $(this).siblings('.counter')
    if(remaining < 0) {
      $counter.addClass('overLimit')
    } else {
      $counter.removeClass('overLimit')
    }
    $counter.text(remaining)
  }) 
});

