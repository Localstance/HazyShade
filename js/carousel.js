$(document).ready(function(){
    $('.inspirations').on('click', '.inspirations-right-arrow', function(){
        var blocks = $('.inspirations-block');
        $('.inspirations-left-arrow').css('visibility', 'visible')
        if( $(blocks).first().css('left') == '-460px' ){
            return false;
        } else if( $(blocks).first().css('left') == '-360px' ) {
            $(blocks).each(function(){
                $(this).animate({
                    left: "-=100"
                }, 500);
            });
            $(this).css('visibility', 'hidden');
        } else {
            $(blocks).each(function(){
                $(this).animate({
                    left: "-=200"
                }, 500);
            });
        }
    }).on('click', '.inspirations-left-arrow', function(){
        var blocks = $('.inspirations-block');
        if( $(blocks).first().css('left') == '40px') {
            $(this).css('visibility', 'hidden');
            return false;
        } else if( $(blocks).first().css('left') == '-60px' ){
            $('.inspirations-block').each(function(){
                $(this).animate({
                    left: "+=100"
                }, 500);

            });
        } else {
            $('.inspirations-block').each(function(){
                $(this).animate({
                    left: "+=200"
                }, 500);
            });
        }
    });
});