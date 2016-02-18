$(document).ready(function(){
/*
* OBJECTS
*/
    var helper = {
        locationSearch : window.location.search,
        setBreadcrumbs : function(){
            //var pid = this.pidParse(); //use for render deeper inheritance
            var categoryName = this.cgParse();
            if(categoryName.length > 0 ){
                $('.breadcrumbs ul li.js-category a').attr('href', ('category-all.html?cg=' + categoryName.toLowerCase()) ).html(categoryName);
            }
        },
        pidParse : function(){
            var pidRegExp = /pid=\d+/;
            if( this.locationSearch.match(pidRegExp) ){
                return parseInt(((this.locationSearch.match(pidRegExp)).toString()).replace(/pid=/, ''));
            } else {
                return 'no id';
            }
        },
        cgParse : function(){
            var categoryRegExp = /cg=\w+[%20]*\w*/;
            if( !this.locationSearch.match(categoryRegExp) ){
                return false;
            }
            var categoryName = (((this.locationSearch.match(categoryRegExp)).toString()).replace(/cg=/, '')).replace(/%20/, ' ');
            categoryName = categoryName.toUpperCase();
            return categoryName;
        },
        makeDropDown : function(){

        }
    };

    var product = {
        addProduct : function(pid, size, qty){
            var storage = window.localStorage;
            var basketObject = basket.getBasket();
            var productObject = {
                'pid' : pid,
                'size' : size,
                'qty' : qty || 1
            };
            if( basketObject.length === 0 ){
                basketObject.push(productObject);
            } else {
                for( var i = 0; i < basketObject.length; i++){
                    if( basketObject[i]['pid'] == productObject['pid'] && basketObject[i]['size'] == productObject['size'] ){
                        if( arguments[2] ){
                            basketObject[i]['qty'] = qty;
                            break;
                        }
                        basketObject[i]['qty']+=1;
                        break;
                    } else if( i == basketObject.length - 1 ){
                        basketObject.push(productObject);
                        break;
                    }
                }
            }
            storage.setItem('basket', JSON.stringify(basketObject));
            basket.updateBasketCounter();
        },

        getProduct : function(pid){
            var productObject;
            for( var i = 0; i < productsDB.length; i++){
                if( productsDB[i]['id'] == pid ){
                    productObject = productsDB[i];
                }
            }
            return productObject;
        },

        renderPDP : function(){
            var pid = helper.pidParse();
            var j = 0;
            var productObject = this.getProduct(pid);
            //render
            $('.main-view').css('background-image', ('url(' + productObject.photos[0] + ')'));
            $('.product-thumbnail').each(function(){
                $(this).find('img').attr('src', productObject.thumbnails[j]);
                j++;
            });
            $('.breadcrumbs ul li.js-product-name').find('a').html(productObject.name);
            $('.breadcrumbs ul li.js-product-name').find('a').attr('href', location.href);
            $('.product-name').html(productObject.name);
            $('.article-number').find('span').html(productObject.article);
            $('.product-price').find('span').html(productObject.price);

        },

        findProduct : function(name){
            var tempProduct, pid, url;
            for( var i = 0; i < productsDB.length; i++){
                var tempName = productsDB[i]['name'];
                if( tempName.toLowerCase() == name ){
                    console.log(tempName.toLowerCase() + ' ' + name);
                    tempProduct = productsDB[i];
                    break;
                }
            }
            if( !tempProduct ){
                return console.log('Sorry - no product. We have another good shoes for you! Check new arrivals! You want?');
            }
            pid = tempProduct['id'];
            url = 'pdp.html?cg=men&pid=' + pid;
            location.href = url;
        }
    };

    var basket = {
        getBasket : function(){
            var storage = window.localStorage;
            if( storage['basket'] != undefined ){
                return JSON.parse(storage['basket']);
            } else {
                return [];
            }
        },

        removeProduct : function(pid, that){
            var basketObject = this.getBasket();
            var storage = window.localStorage;
            var rows = $('.product-detail-row');
            for( var i = 0; i < basketObject.length; i++){
                if( basketObject[i]['pid'] == pid ){
                    basketObject.splice(i,1);
                    break;
                }
            }
            storage.setItem('basket', JSON.stringify(basketObject));
            this.updateBasketCounter();
            if( rows.length == 1 ){
                $(that).closest('.product-detail-row').addClass('hidden');
            } else {
                $(that).closest('.product-detail-row').remove();
            }
            this.calculateCart();
        },

        renderBasket : function(){
            var basketObject = this.getBasket();
            var example = $('.product-detail-row.hidden');
            var total = 0;
            for( var i = 0; i < basketObject.length; i++){
                var newRow = $(example).clone();
                var img, name, color, size, qty, price;
                for( var j = 0; j < productsDB.length; j++ ){
                    if( basketObject[i]['pid'] == productsDB[j]['id']){
                        img = productsDB[j]['thumbnails'][0];
                        name = productsDB[j]['name'];
                        color = productsDB[j]['color'];
                        size = basketObject[i]['size'];
                        qty = basketObject[i]['qty'];
                        price = productsDB[j]['price'];
                    }
                }
                $(newRow).attr('data-pid', basketObject[i]['pid']);
                $(newRow).attr('data-price', price);
                $(newRow).find('.product-thumbnail img').attr('src', img);
                $(newRow).find('.p-description .name').html(name);
                $(newRow).find('.p-color .color').html(color);
                $(newRow).find('.p-size .size').html(size);
                $(newRow).find('.p-qty input').val(qty);
                $(newRow).find('.p-amount span').html((price * qty).toFixed(2));
                $(newRow).removeClass('hidden').appendTo('.shopping-cart-table tbody');
                total += (parseFloat(price) * parseInt(qty));
            }
            $('.shopping-cart-total span').html((total).toFixed(2));
        },

        updateBasketCounter : function(){
            var basketObject = this.getBasket();
            var count = 0;
            for( var i = 0; i < basketObject.length; i++){
                count+= parseInt(basketObject[i]['qty']);
            }
            $('.basket-count').html(count);
        },

        calculateCart : function(){
            var total = 0;
            var rows = $('.product-detail-row');
            for(var i = 1; i < rows.length; i++){
                var price = $(rows[i]).data('price');
                var qty = $(rows[i]).find('.p-qty input').val();
                total += ( price * qty );
                $(rows[i]).find('.p-amount span').html( (price * qty).toFixed(2) );
            }
            total = total.toFixed(2);
            $('.shopping-cart-total span').html(total);
        }
    };

/*
* CALL EVENTS
*/
    helper.setBreadcrumbs();
    basket.updateBasketCounter();

/*
* LISTENERS
*/
    //call render functions on each own case
    (function router(){
        var path = location.pathname;
        if( path.match(/pdp\.html/) ){
            product.renderPDP();
        } else if( path.match(/shop\-cart\.html/) ) {
            basket.renderBasket();
        }
    })();

    //Remove product row form cart
    $('.product-detail-row').on('click', '.p-del span', function(){
        var pid = $(this).closest('.product-detail-row').data('pid');
        var that = $(this);
        basket.removeProduct(pid, that);
    });

    //Listener for changing quantity input in cart
    $('.p-qty input').change(function(e){
        basket.calculateCart();
        var pid = $(this).closest('.product-detail-row').data('pid');
        var size = $(this).closest('.product-detail-row').find('.p-size span').html();
        var qty = $(this).val();
        product.addProduct(pid, size, qty);
    });

    //Search expand
    $('.search').on('click', function(){
        $(this).css({
            backgroundColor: "#606060",
            color: 'white'
        });
        $('.search-field').fadeIn('fast', function(){
            $(this).focus();
        });
        $(this).on('click', function(){
            var productName = ($('.search-field').val()).toLowerCase();
            product.findProduct(productName);
        });
    });

    //Select product and load pdp
    $('.cat-row').on('click', '.product, p', function(e){
        e.stopPropagation();
        var pid = $(this).closest('.cat-row-group').data('pid');
        location.href = 'pdp.html' + location.search + '&pid=' + pid;
    });

    //Switcher for thumbnails
    $('.product-thumbnail-wrap').on('click', '.product-thumbnail', function(){
        var thumbId = $(this).data('thumb-id');
        var pid = helper.pidParse();
        var productObject = product.getProduct(pid);
        var url = 'url(' + productObject.photos[thumbId] + ')';
        $(this).parent().find('.active-view').removeClass('active-view');
        $(this).addClass('active-view');
        $('.main-view').css('background-image', url);
    });

    //Size select
    $('.sizes').on('click', 'li', function(){
        $(this).parent().find('.size-selected').removeClass('size-selected');
        $(this).addClass('size-selected');
    });

    //Open shop-cart on basket click
    $('.basket').on('click', function(){
        location.href = 'shop-cart.html';
    });

    //Add product to basket
    $('.add-product-button').on('click', function(e){
        e.preventDefault();
        var pid = helper.pidParse();
        var size = $('.size-selected').html();
        if( size != undefined ){
            size = parseInt(size);
            product.addProduct(pid, size);
            $('.size-selected').removeClass('size-selected');
            $(this).html('PRODUCT ADDED');
            $(this).css('background-color', 'green');
            var that = $(this);
            setTimeout( function(){
                $(that).html('ADD TO CART');
                $(that).removeAttr('style');
            }, 2000);
        } else {
            alert('Select size');
        }
    });

    //Checkout and redirect to the thank-you page
    $('.order-button').on('click', function(e){
        e.preventDefault();
        window.localStorage.removeItem('basket');
        window.location.href = 'thank-you.html';
    });

    //Dropdowns
    $('nav').on('click', function(){

    });

});