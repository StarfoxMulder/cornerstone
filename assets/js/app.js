__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

import Global from './theme/global';
// import Cart from './theme/cart';

const getAccount = () => import('./theme/account');
const getLogin = () => import('./theme/auth');
const noop = null;

const pageClasses = {
    account_orderstatus: getAccount,
    account_order: getAccount,
    account_addressbook: getAccount,
    shippingaddressform: getAccount,
    account_new_return: getAccount,
    'add-wishlist': () => import('./theme/wishlist'),
    account_recentitems: getAccount,
    account_downloaditem: getAccount,
    editaccount: getAccount,
    account_inbox: getAccount,
    account_saved_return: getAccount,
    account_returns: getAccount,
    account_paymentmethods: getAccount,
    account_addpaymentmethod: getAccount,
    account_editpaymentmethod: getAccount,
    login: getLogin,
    createaccount_thanks: getLogin,
    createaccount: getLogin,
    getnewpassword: getLogin,
    forgotpassword: getLogin,
    blog: noop,
    blog_post: noop,
    brand: () => import('./theme/brand'),
    brands: noop,
    cart: () => import('./theme/cart'),
    category: () => import('./theme/category'),
    compare: () => import('./theme/compare'),
    page_contact_form: () => import('./theme/contact-us'),
    error: noop,
    404: noop,
    giftcertificates: () => import('./theme/gift-certificate'),
    giftcertificates_balance: () => import('./theme/gift-certificate'),
    giftcertificates_redeem: () => import('./theme/gift-certificate'),
    default: noop,
    page: noop,
    product: () => import('./theme/product'),
    amp_product_options: () => import('./theme/product'),
    search: () => import('./theme/search'),
    rss: noop,
    sitemap: noop,
    newsletter_subscribe: noop,
    wishlist: () => import('./theme/wishlist'),
    wishlists: () => import('./theme/wishlist'),
};

const customClasses = {};

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || '{}');

    return {
        load() {
            $(() => {
                // Load globals
                if (loadGlobal) {
                    Global.load(context);
                }

                const importPromises = [];

                // Find the appropriate page loader based on pageType
                const pageClassImporter = pageClasses[pageType];
                if (typeof pageClassImporter === 'function') {
                    importPromises.push(pageClassImporter());
                }

                // See if there is a page class default for a custom template
                const customTemplateImporter = customClasses[context.template];
                if (typeof customTemplateImporter === 'function') {
                    importPromises.push(customTemplateImporter());
                }

                // Wait for imports to resolve, then call load() on them
                Promise.all(importPromises).then(imports => {
                    imports.forEach(imported => {
                        imported.default.load(context);
                    });
                });
            });
        },
    };
};

// Functionality for alternating the card image src on hover

// $('img.card-image').hover(
//     function() {
//       var image = $(this).find('.card-image');
//       var newImg = image.attr('data-hoverimage');
//       var currentImg = image.attr('src');
//         if (newImg && newImg != '') image.attr('src', newImg);
//    }, function() {
//       var image = $(this).find('.card-image');
//       var newImg = image.attr('data-src');
//       var currentImg = image.attr('src');
//         if (newImg && newImg != '') image.attr('src', newImg);
//     }
// );

// document.addEventListener("DOMContentLoaded", function(){
    // var testUrl = $('img.card-image').dataset.test;
    // console.log(testUrl);
    
    // document.querySelectorAll('img.card-image').addEventListener('mouseover', function() {
    //     console.log(this);
    //     var hoverImgSrc = document.querySelectorAll('img.card-image').getAttribute('data-test');
    //     this.src = hoverImgSrc;
    // });

    // $('img.card-image').addEventListener('mouseover', function(){
    //     console.log(this.dataset.test)
    // });

    $('.card-figure').hover(
    	function() {
            var image = $(this).find('.card-image');
            var newImg = image.attr('data-hoverimage');
            var currentImg = image.attr('src');
            if (newImg && newImg != '') image.attr('src', newImg);

            var newAlt = image.attr('data-newAlt');
            var currentAlt = image.attr('alt');
            if (newAlt && newAlt != '') image.attr('alt', newAlt);
            if (newAlt && newAlt != '') image.attr('title', newAlt);

       }, function() {
            var image = $(this).find('.card-image');
            var newImg = image.attr('data-src');
            var currentImg = image.attr('src');
            if (newImg && newImg != '') image.attr('src', newImg);

            var newAlt = image.attr('data-alt');
            var currentAlt = image.attr('alt');
            if (newAlt && newAlt != '') image.attr('alt', newAlt);
            if (newAlt && newAlt != '') image.attr('title', newAlt);
    	}
    );

    $("#customAtC").click(
        function(){
            var cartId = $(this).attr('data-cartid');

            if(!cartId){
                createCart('/api/storefront/carts', {
                    "lineItems": [
                        {
                            "quantity":1,
                            "productId": 112
                        }
                    ]
                })
                // .then(data => console.log(data))
                .then(data => $(this).attr('data-cartid', data.id))
                .catch(error => console.error(error));
            }
            else {
                $.get("/cart.php?action=add&product_id=112");
            }
            console.log(cartId)


            var quantity, removeAllItems;
            removeAllItems = $("span.remove-all-items");
            getCart('/api/storefront/carts')
            .then(data => validateData(data))
            .catch(error => console.error(error));

            // $("span.cart-quantity").text(quantity);
            $('.cart-quantity').removeClass('countPill--positive', quantity == 0)
            $('.cart-quantity').addClass('countPill--positive', quantity > 0)
            if(quantity>0){
                $(".remove-all-items").addClass("show")
            }
            if(quantity==0){
                $(".remove-all-items").addClass("hide")
                $(".remove-all-items").removeClass("show")
            }

            switchClasses(".itemAddedNote");
            setTimeout(function(){switchClasses(".itemAddedNote")}, 2000)


            //$('body').trigger('cart-quantity-update', cartNum);

            // cartNum = data.lineItems.physicalItems.quantity
            // data[0].lineItems.physicalItems.quantity
            // countPill cart-quantity countPill--positive
            // quantity = data[0].lineItems.physicalItems[0].quantity

        }
    );


    $(".remove-all-items").click(
        function(){
            var cartId = $("#customAtC").attr('data-cartid');
            var itemId
            console.log(cartId)
            
            switchClasses(".remove-all-items")

            getCart('/api/storefront/carts')
            .then(data => {
                itemId = data[0].lineItems.physicalItems[0].id;
                console.log(itemId)
                deleteCartItem(`/api/storefront/carts/`, cartId, itemId)
            })
            // .then(window.location.reload())


            //var cartrmpath = '/cart.php?action=update&product_id=112&qty=0'  
            // $.get(cartrmpath, function() {
            //     window.location.reload();
            // });

            // .then(data => console.log(data))
            // .catch(error => console.log(error));

        }
    )

    function switchClasses(target) {
        if ($(target).hasClass("hide")){
            $(target).removeClass("hide")
            $(target).addClass("show")
        }
        else {
            $(target).addClass("hide")
            $(target).removeClass("show")
        }
    }

    function validateData(data){
        var quantityV;
        console.log(data[0])
        if (data[0].lineItems.physicalItems[0].quantity){
            quantityV = data[0].lineItems.physicalItems[0].quantity
            quantityV+=1
        }
        else {
            quantityV=1;
        }
        console.log(quantityV)
        $("span.cart-quantity").text(quantityV);

        return quantityV
    }

    function getCart(url) {
        return fetch(url, {
            method: "GET",
            credentials: "same-origin"
        })
        .then(response => response.json());
    };

    function createCart(url, cartItems) {
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(cartItems),
        })
        .then(response => response.json());
    };

    function deleteCartItem(url, cartId, itemId) {
        return fetch(url + cartId + '/items/' + itemId,  {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",}
        })
        .then(response => response.json());
     };

     function deleteCart(url, cartId) {
        return fetch(url + cartId + '/items/', {
            method: "DELETE",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json",}
        })
        .then(response => response.json());
    };

    function addCartItem(url, cartId, cartItems) {
        return fetch(url + cartId + '/items', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(cartItems),
        })
        .then(response => response.json());
   };


// });


