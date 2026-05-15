/* Makes jQuery accessible via $ using function escope because tray load another lib which creates conflict with jQuery $ */
(function($){

    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };

    Number.prototype.formatMoney = function(precision = 2, decimal = '.', thousands = ',', withCurrency = false) {

        const placeholderRegex = /{{\s*(\w+)\s*}}/;
        const format           = 'R$ {{amount}}';

        var number = this.toFixed(precision);

        var parts         = number.split('.');
        var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        var centsAmount   = parts[1] ? decimal + parts[1] : '';
        var value         = dollarsAmount + centsAmount;

        return (withCurrency) ? format.replace(placeholderRegex, value) : value;

    };

    window.theme = {

        ...window.theme,

        settings :{
            lastScrollPosition        : 0,
            storeId                   : 0,
            productVariantsQuantities : null,
            productThumbs             : null,
            productGallery            : null
        },


        /* General */

        recoveryStoreId: function(){
            this.settings.storeId = $('html').data('store');
        },

        resets: function(){

            if($('.box-loja-manutencao').length == 0){

                // logo tray
                var trayLogo = $('.logotray-message a');
                trayLogo.attr('rel', 'noopener').attr('href', trayLogo.attr('href').replace('http', 'https'));

                // modal remove id duplcate

                $('[role="dialog"] .modal-title').removeAttr('id');

                /* Advanced search page */
                $('.page-search #Vitrine input[type="image"]').after('<button type="submit" class="botao-commerce">BUSCAR</button>')
                $('.page-search #Vitrine input[type="image"]').remove();
                $('.advancedSearchFormBTimg').addClass('botao-commerce');

                $('.page-central_senha input[type="image"]').after('<button type="submit" class="botao-commerce">CONTINUAR</button>').remove();
                $('.caixa-cadastro #email_cadastro').attr('placeholder', 'Seu e-mail');

                $('#imagem[src*="filtrar.gif"]').after('<button type="submit" class="botao-commerce">Filtrar</button>');
                $('#imagem[src*="filtrar.gif"]').remove();

                $('input[src*="gerarordem.png"]').after('<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>');
                $('input[src*="gerarordem.png"]').remove();

                if($(window).width() > 768){

                    var altura_header = $('.header').height();

                    if($('html').hasClass('page-home')){
                        $('body > div.application').css('padding-top', altura_header);
                    }else{
                        // $('.page-content').css('padding-top', '4rem');
                        $('body > div.application').css('padding-top', altura_header);
                    }

                }

                if($('.page-listas_evento').length > 0){
                    
                    $('.page-listas_evento .bt-avancar').html('<button class="botao-commerce"> Buscar </button>');
                    $('.page-listas_evento body > div.application > main > div > div > div:nth-child(2) > div:nth-child(4) > div > div.board > a:nth-child(3)').html('<button class="botao-commerce"> Criar Nova Lista </button> &nbsp; ');
                    $('.page-listas_evento body > div.application > main > div > div > div:nth-child(2) > div:nth-child(4) > div > div.board > a:nth-child(4)').html('<button class="botao-commerce"> Gerenciar Lista </button>');

                }

            }

            $('.operadora').each(function(k, item){

                var texto = $(item).text();
                texto = texto.replace('Sem', 'sem');
                $(item).text(texto);

            });

        },

        initMasks: function(){

            var phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            var phoneMaskOptions = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                }
            };

            $('.phone-mask').mask(phoneMaskBehavior, phoneMaskOptions);

            $('.zip-code-mask').mask('00000-000');

        },

        initLazyload: function(selector = '.lazyload'){
            new LazyLoad({
                elements_selector: selector
            });
        },

        getLoader: function(message = null){
            return `
                <div class="loader show">
                    <div class="spinner">
                        <div class="double-bounce-one"></div>
                        <div class="double-bounce-two"></div>
                    </div>
                    ${ message ? `<div class="message">${message}</div>` : ''}
                </div>`;
        },

        scrollToElement: function (target, adjust = 0) {
            if(target && target !== "#"){

                $("html,body").animate({
                    scrollTop : Math.round($(target).offset().top) - adjust
                }, 600);

            }
        },

        overlay: function(){

            $('[data-toggle="overlay-shadow"]').on('click', function () {

                var target = $($(this).data('target'));
                target.addClass('show').attr('data-overlay-shadow-target', '');

                $('.overlay-shadow').addClass('show');
                $('body').addClass('overflowed');

            });

            $('.overlay-shadow').on('click', function(){
                $('[data-overlay-shadow-target]').removeClass('show').removeAttr('data-overlay-shadow-target');
                $('.overlay-shadow').removeClass('show');
                $('body').removeClass('overflowed');
            });

            $('.close-overlay').on('click', function(){
                $('.overlay-shadow').trigger('click');
            });

        },

        toggleModalTheme: function(){

            $('body').on('click', '[data-toggle="modal-theme"]', function(){
                $($(this).data('target')).addClass('show');
            });

            $('.modal-theme:not(.no-action) .modal-shadow, .modal-theme:not(.no-action) .close-icon').on('click', function(){
                $('.modal-theme').removeClass('show');
            });

        },

        generateBreadcrumb: function(local = ''){

            var items;
            var breadcrumb = '';
            var pageName   = document.title.split(' - ')[0];

            if(local == 'news-page'){
                items = [
                    { text: 'Home',            link: '/'         },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName }
                ];
            } else {
                items = [
                    { text: 'Home',  link: '/' },
                    { text: pageName }
                ];
            }

            $.each(items, function (index, item){
                if(this.link){

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="t-color" href="${ item.link }">
                                <span itemprop="name">${ item.text }</span>
                            </a>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>   
                    `;

                } else {

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${ item.text }</span>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>          
                    `;

                }
            });

            $('.page-content > .container').prepend(`
                <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);

        },

        processRteElements: function(){

            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');

        },
        
        /* Scroll behavior */

        setCorrectHeaderDesk: function(){

            var internal     = this;
            var deltaOne     = 32;
            var deltaTwo     = 152;
            var header       = $('.header');
            var nav          = $('.header .nav');
            var navbarHeight = $('.header').outerHeight() * 2;
            var position     = $(window).scrollTop();

            (position > deltaOne) ? header.addClass('hide-top-bar') : header.removeClass('hide-top-bar');
            (position > deltaTwo) ? header.addClass('fixed')        : header.removeClass('fixed');

            if(position > internal.settings.lastScrollPosition || position <= navbarHeight){
                nav.removeClass('show-nav');
            }
            else if(position > navbarHeight) {
                nav.addClass('show-nav');
            }

            internal.settings.lastScrollPosition = position;

        },

        setCorrectHeaderMobile: function(){

            var header       = $('.header');
            var headerMobile = $('.header-mobile');
            var headerHeight = $('.header').outerHeight() + 20;
            var position     = $(window).scrollTop() - 20;

            if(position > headerHeight){
                headerMobile.addClass('show');
                header.addClass('not-visible');
            } else {
                headerMobile.removeClass('show');
                header.removeClass('not-visible');
            }

        },

        scrollHeader: function () {

            var internal = this;

            if($(window).width() >= 768){
                this.setCorrectHeaderDesk();
            } else {
                this.setCorrectHeaderMobile();
            }

            $(window).on('scroll', function(){

                if($(window).width() >= 768){
                    internal.setCorrectHeaderDesk();
                } else {

                    internal.setCorrectHeaderMobile();

                    var scrollHeight = $(document).height();
                    var scrollPosition = $(window).height() + $(window).scrollTop();
                    var scrollPositionBottom = (scrollHeight - scrollPosition) / scrollHeight;

                    if (scrollPositionBottom <= 0.026) {
                        $('.box-opcoes-flutuantes').hide();
                    }else{
                        $('.box-opcoes-flutuantes').show();
                    }

                }

            });

        },

        /* Main menu */

        fixSubcategoriesHeight: function(){

            var topContent   = $('.header').height();
            var windowHeight = $(window).height();
            var extraMargin  = 10;

            $('.nav .list > .first-level.sub .second-level').css('max-height', windowHeight - topContent - extraMargin);

        },

        mainMenu: function(){

            var internal = this;

            this.fixSubcategoriesHeight();

            $(window).on('resize', function(){
                internal.fixSubcategoriesHeight();
            });

        },

        mainMenuMobile: function(){

            $('.nav-mobile .first-level > .sub > a').on('click', function(event){

                var item = $(this).parent();

                item.toggleClass('show');

                if(item.hasClass('show')){
                    item.children('.sub').slideDown();
                } else {
                    item.children('.sub').slideUp();
                }

                event.preventDefault();
                return false;

            });

        },

        /* Index */

        bannerHome: function(){
            if($('.banner-home').length){

                var slideshow  = $('.banner-home');
                var size       = $('.swiper-slide', slideshow).length;
                var settings   = slideshow.data('settings');

                if(size > 0){

                    new Swiper('.banner-home .swiper-container', {
                        preloadImages : false,
                        loop          : true,
                        autoHeight    : true,
                        effect        : 'slide',
                        autoplay :{
                            delay: settings.timer,
                            disableOnInteraction : false
                        },
                        lazy :{
                            loadPrevNext: false,
                        },
                        pagination: {
                            el                : '.banner-home .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : !settings.isMobile
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });

                    if(settings.stopOnHover){

                        $('.banner-home .swiper-container').on('mouseenter', function(){
                            (this).swiper.autoplay.stop();
                        });

                        $('.banner-home .swiper-container').on('mouseleave', function(){
                            (this).swiper.autoplay.start();
                        });

                    }
                }

            }
        },
        /* Comentarios */
        comentarios: function(){
            if($('.swiper-comentarios').length){

                var slideshow  = $('.swiper-comentarios');
                var size       = $('.swiper-slide', slideshow).length;
        
                if(size > 0){
        
                    new Swiper('.swiper-comentarios', {
                        slidesPerView: 4,
                        speed: 400,
                        preloadImages : false,
                        loop          : false,
                        effect        : 'slide',
                        spaceBetween: 10,
                        observer: true,
                        observeParents: true,
                        lazy :{
                            loadPrevNext: true,
                        },
                        pagination: {
                            el                : '.swiper-comentarios .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : true
                        },
                        navigation: {
                            nextEl: '.swiper-comentarios .next',
                            prevEl: '.swiper-comentarios .prev',
                        },
                        breakpoints :{
                              0  :{ slidesPerView : 1},
                            465  :{ slidesPerView : 1},
                            765  :{ slidesPerView : 2},
                           1000  :{ slidesPerView : 3},
                        }
                    });
        
                    var marginnavigation = ((jQuery('.comentarios-itens').height()-48)/2) + 18;
        
                    jQuery('.swiper-comentarios .prev, .swiper-comentarios .next').css({ 'bottom':'unset', 'margin-top':marginnavigation });
                  
                }
        
            }
        },

        storeReviewsIndex: function(){
            if(!$('.section-avaliacoes .dep_lista').length){

                $('.section-avaliacoes').remove();

            } else {
               
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');

                $('.dep_item').addClass('swiper-slide');
                $('.section-avaliacoes .dep_lista').addClass('swiper-wrapper').wrap('<div class="swiper-container"></div>');
                
                // $('.section-avaliacoes .swiper-container').append(`            
                //     <div class="swiper-pagination"></div>
                // `);

                new Swiper('.section-avaliacoes .swiper-container', {
                    slidesPerView: 3,
                    lazy: {
                        loadPrevNext: false,
                    },
                    loop: false,
                    breakpoints :{
                        0 :{
                            slidesPerView : 1,
                        },
                        600 :{
                            slidesPerView : 2,
                        },
                        1000 :{
                            slidesPerView : 3,

                        }
                    },
                    // pagination: {
                    //     el: ".swiper-pagination",
                    //     clickable: true,
                    // },
                    on: {
                        init: function () {
                            $('.section-avaliacoes').addClass('show');
                        },
                    }
                });

                $('.section-avaliacoes').addClass('show');

                $('.section-avaliacoes .dep_dados').wrap('<a href="/depoimentos-de-clientes" title="Ver depoimento"></a>');
                $('.dep_lista li:hidden').remove();

            }
        },

        loadNews: function(){

            if($('.section-news').length || $('.noticias').length){

                var dataFiles = $('html').data('files');

                $.ajax({
                    url     : `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method  : 'get',
                    success : function(response){

                        var target;
                        var news;

                        if(!$(response).find('.noticias').length){
                            $('.section-news').remove();
                            return;
                        }

                        target = $('.section-news .news-content .swiper-wrapper');
                        news   = $($(response).find('.noticias'));

                        news.find('li:nth-child(n+7)').remove();
                        news.find('li').wrapInner('<div class="swiper-slide"><div class="box-noticia"></div></div>');
                        news.find('.swiper-slide').unwrap();
                        news = news.contents();

                        /* news.each(function (index, news){
                            var image  = $(news).find('img').closest('div').remove();
                        }); */

                        target.append(news);

                        if($(window).width() > 767){

                            new Swiper('.news-content .swiper-container', {
                                spaceBetween: 10,
                                lazy : {
                                    loadPrevNext: false,
                                },
                                pagination: {
                                    el: ".swiper-pagination",
                                    clickable: true,
                                },
                                breakpoints: {
                                    0: {
                                        slidesPerView: 1
                                    },
                                    550: {
                                        slidesPerView: 2
                                    },
                                    768: {
                                        slidesPerView: 3
                                    
                                    }
                                }
                            });

                        }else{
                            new Swiper('.news-content .swiper-container', {
                                observer: true, 
                                observeParents: true,
                                pagination: {
                                    el: ".swiper-pagination",
                                  },
                                slidesPerView: 1,
                                breakpoints: {
                                    0: {
                                        slidesPerView: 1
                                    },
                                    550: {
                                        slidesPerView: 2
                                    },
                                    768: {
                                        slidesPerView: 3
                                    
                                    },
                                    1000: {
                                        slidesPerView: 4
                                    
                                    }
                                },
                            });
                        }

                    }
                });

            }
        },

        /* Marcas */
        loadMarcas: function(){

            if($('.section-marcas').length > 0){

                new Swiper('.marcas-content .swiper-container', {
                    preloadImages : false,
                    loop          : true,
                    autoHeight    : true,
                    effect        : 'slide',
                    lazy :{
                        loadPrevNext: false,
                    },
                    pagination: {
                        el                : '.marcas-content .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 2
                        },
                        620: {
                            slidesPerView: 3
                        },
                        1200: {
                            slidesPerView: 5
                        },
                    }
                });

                /* var qtde_itens = (window.innerWidth < 600) ? 2 : (window.innerWidth < 900) ? 3 : 6;
                var w_marcas = $('.marcas-content').width() / qtde_itens;
                
                $('.flexslider-marcas').flexslider({
                    directionNav: true,
                    controlNav: true,
                    animation: "slide",
                    animationSpeed: 400,
                    animationLoop: false,
                    itemWidth: w_marcas,
                    itemMargin: 0,
                    minItems: qtde_itens, // use function to pull in initial value
                    maxItems: qtde_itens, // use function to pull in initial value
                });

                setTimeout(function(){
                    $('.flex-direction-nav a').text('');
                }, 100); */

            }
            
        },

        /* Categorias */
        loadCategorias: function(){

            if($('.section-categorias').length > 0){

                console.log();

                new Swiper('.section-categorias .swiper-container', {
                    preloadImages : false,
                    loop          : false,
                    autoHeight    : true,
                    effect        : 'slide',
                    lazy :{
                        loadPrevNext: false,
                    },
                    pagination: {
                        el                : '.section-categorias .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 2
                        },
                        620: {
                            slidesPerView: 3
                        },
                        1200: {
                            slidesPerView: 6
                        },
                        1300: {
                            slidesPerView: ($('.categorias-content .swiper-slide').length < 8) ? $('.categorias-content .swiper-slide').length : 8
                        },
                    }
                });

                /* var qtde_itens = (window.innerWidth < 600) ? 2 : (window.innerWidth < 900) ? 4 : 6;
                var w_categorias = $('.categorias-content').width() / qtde_itens;
                
                $('.flexslider-categorias').flexslider({
                    directionNav: true,
                    controlNav: true,
                    animation: "slide",
                    animationSpeed: 400,
                    animationLoop: false,
                    itemWidth: w_categorias,
                    itemMargin: 0,
                    minItems: qtde_itens, // use function to pull in initial value
                    maxItems: qtde_itens, // use function to pull in initial value
                }); */

            }
            
        },

        /* Produtos mini banners */

        loadProutosMiniBanners: function()
        {

            if($('.mini-banner-produto-1').length > 0){

                var altura = 0;

                $('.mini-banner-produto-1 .produto-perfil').each(function(k, item){
                    if($(item).height() > altura){
                        altura = $(item).height();
                    }
                });

                $('.mini-banner-produto-1 .produto-perfil').css('min-height', altura);

                new Swiper('.mini-banner-produto-1 .swiper-container', {
                    preloadImages : false,
                    loop          : true,
                    autoHeight    : true,
                    effect        : 'slide',
                    lazy :{
                        loadPrevNext: false,
                    },
                    pagination: {
                        el                : '.mini-banner-produto-1 .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });

            }

            if($('.mini-banner-produto-2').length > 0){

                var altura = 0;

                $('.mini-banner-produto-2 .produto-perfil').each(function(k, item){
                    if($(item).height() > altura){
                        altura = $(item).height();
                    }
                });

                $('.mini-banner-produto-2 .produto-perfil').css('min-height', altura);

                new Swiper('.mini-banner-produto-2 .swiper-container', {
                    preloadImages : false,
                    loop          : true,
                    autoHeight    : true,
                    effect        : 'slide',
                    lazy :{
                        loadPrevNext: false,
                    },
                    pagination: {
                        el                : '.mini-banner-produto-2 .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });

            }

        },

        /* Vitrine Personalizada */
        loadVitrinePersonalizada: function(){
            
        },

        /* Promocao Destaque */
        loadPromocaoDestaque: function(){
            
        },

        /* Vitrine */
        loadShowCase: function(){

            if($('.showcase-slide').length > 0){

                /*if(jQuery('.product.redimensionar').length > 0){
                    var altura = 0;

                    $('.showcase-slide .product').each(function(k, item){
                        if($(item).height() > altura){
                            altura = $(item).height();
                        }
                    });

                    altura += 20;

                    $('.showcase-slide .product').css('min-height', altura);
                } else if(jQuery('.product.redimensionard').length > 0 && jQuery(window).width() > 767){
                    var altura = 0;

                    $('.showcase-slide .product').each(function(k, item){
                        if($(item).height() > altura){
                            altura = $(item).height();
                        }
                    });

                    altura += 20;

                    $('.showcase-slide .product').css('min-height', altura);
                }

                $('.showcase-slide .product').removeClass('show-down');*/

                /* var qtde_itens; */
                var space_between;

                if(window.innerWidth < 500){
                    /* qtde_itens = 2; */
                    space_between = 6;
                }else if(window.innerWidth < 1025){
                    /* qtde_itens = 3; */
                    space_between = 6;
                }else{
                    /* qtde_itens = 4; */
                    space_between = 5;
                }
                
                $('.showcase-slide').each(function(){
                    var showCase = $(this).attr('id');
                    showCase = '#'+showCase;
                    
                    if($(this).hasClass('loop-infinito')){
                        var loopInfinit = true;
                    }else{
                        var loopInfinit = false;
                    }
    
                    setTimeout(function(){
                       
                        new Swiper(showCase + ' .swiper-container', {
                            preloadImages : false,
                            slidesPerView : 4,
                            spaceBetween  : space_between,
                            loop          : loopInfinit,
                            autoHeight    : false,
                            effect        : 'slide',
                            pagination: {
                                el: ".swiper-pagination",
                                clickable: true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 2
                                },
                                620: {
                                    slidesPerView: 3
                                },
                                1200: {
                                    slidesPerView: 4
                                },
                            },                   
                        });
                        
                    }, 400);
                });
                
            }
            
        },

        loadCupomDescontoTimer: function(){

            if($('.cupom-especial-timer-box').length > 0){
                    
                var data_final = new Date($('.cupom-especial-timer-box').attr('data-final')+'T23:59:59').getTime();
                
                var x = setInterval(function() {
                
                    var agora = new Date().getTime();
    
                    var t = data_final - agora; 
                    var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                    var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                    var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                    var segundos = Math.floor((t % (1000 * 60)) / 1000);

                    div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+dias+' </strong> Dias </div> </div>';
                    div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+horas+' </strong> Horas </div> </div>';
                    div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+minutos+' </strong> Min </div> </div>';
                    div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+segundos+' </strong> Seg </div> </div>';
                    
                    $('.cupom-especial-timer-box').html(div_timer);
                    
                    if (t < 0) { 
                        clearInterval(x); 
                        $('.cupom-especial-timer-box').remove(); 
                    }
                    
                }, 1000);
                
            }

        },

        loadPaginaManutencaoTimer: function(){

            if($('.box-loja-manutencao-timer').length > 0){
            
                $('.box-loja-manutencao-timer').each(function(k, item){
                    
                    var data_final = new Date($(item).attr('data-final')+'T23:59:59').getTime();
                    
                    var x = setInterval(function() {
                    
                        var agora = new Date().getTime();
        
                        var t = data_final - agora; 
                        var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                        var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                        var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                        var segundos = Math.floor((t % (1000 * 60)) / 1000);

                        div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+dias+' </strong> Dias </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+horas+' </strong> H </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+minutos+' </strong> M </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+segundos+' </strong> S </div> </div>';
                        
                        $(item).html(div_timer);
                        
                        if (t < 0) { 
                            clearInterval(x); 
                            $(item).remove(); 
                        }
                        
                    }, 1000);
                    
                });
                
            }

        },

        loadVitrinePersonalizadaTimer: function(){

            if($('.vitrine-personalizada-timer-promocao').length > 0){
            
                $('.vitrine-personalizada-timer-promocao').each(function(k, item){
                    
                    var data_final = new Date($(item).attr('data-final')+'T23:59:59').getTime();
                    
                    var x = setInterval(function() {
                    
                        var agora = new Date().getTime();
        
                        var t = data_final - agora; 
                        var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                        var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                        var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                        var segundos = Math.floor((t % (1000 * 60)) / 1000);

                        var icon_timer = `<svg xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -2px;" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>`;
        
                        var div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+icon_timer+' </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+dias+' </strong> Dias </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+horas+' </strong> H </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+minutos+' </strong> M </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+segundos+' </strong> S </div> </div>';
                        
                        $(item).html(div_timer);
                        
                        if (t < 0) { 
                            clearInterval(x); 
                            $(item).html('Promo&ccedil;&atilde;o Finalizada.'); 
                        }
                        
                    }, 1000);
                    
                });
                
            }

        },

        loadPaginaProdutoTimer: function(){

            if($('.produto-timer-promocao').length > 0){
            
                $('.produto-timer-promocao').each(function(k, item){
                    
                    if($(item).attr('data-inicial').length > 0 && $(item).attr('data-final').length > 0){
                    
                        var data_final = new Date($(item).attr('data-final')+'T23:59:59').getTime();
                        
                        var x = setInterval(function() {
                        
                            var agora = new Date().getTime();
            
                            var t = data_final - agora; 

                            if (t < 0) { 
                                clearInterval(x); 
                                // $(item).html('Promo&ccedil;&atilde;o Expirada.'); 
                                $(item).remove(); 
                            }else{

                                var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                                var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                                var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                                var segundos = Math.floor((t % (1000 * 60)) / 1000);

                                var icon_timer = `<svg xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -2px;" width="18" height="18" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>`;
                
                                var div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+icon_timer+' </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+dias+' D </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+horas+' H </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+minutos+' M </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+segundos+' S </div> </div>';
                                
                                $(item).html(div_timer);
                            
                            }
                            
                            $(item).css('display', 'flex');
                            
                        }, 1000);

                    }else{
                        
                        $(item).remove();

                    }
                    
                });
                
            }

        },

        loadProdutosTimer: function(){

            if($('.listagem-produtos-timer-promocao').length > 0){
            
                $('.listagem-produtos-timer-promocao').each(function(k, item){

                    if($(item).attr('data-inicial').length > 0 && $(item).attr('data-final').length > 0){
                    
                        var data_final = new Date($(item).attr('data-final')+'T23:59:59').getTime();
                        
                        var x = setInterval(function() {
                        
                            var agora = new Date().getTime();
            
                            var t = data_final - agora; 

                            if (t < 0) { 
                                clearInterval(x); 
                                // $(item).html('Promo&ccedil;&atilde;o Expirada.'); 
                                $(item).remove(); 
                            }else{

                                var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                                var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                                var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                                var segundos = Math.floor((t % (1000 * 60)) / 1000);
                
                                var div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+dias+' D </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+horas+' H </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+minutos+' M </div> </div>';
                                div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+segundos+' S </div> </div>';
                                
                                $(item).html(div_timer);
                            
                            }
                            
                            $(item).css('display', 'flex');
                            
                        }, 1000);

                    }else{
                        
                        $(item).remove();

                    }
                    
                });
                
            }

        },
        loadBarraFullBannerTimer: function(){

            if($('.barra-oferta-full-banners-timer').length > 0){
            
                $('.barra-oferta-full-banners-timer').each(function(k, item){
                    
                    var data_final = new Date($(item).attr('data-final')+'T23:59:59').getTime();
                    
                    var x = setInterval(function() {
                    
                        var agora = new Date().getTime();
            
                        var t = data_final - agora; 
                        var dias = Math.floor(t / (1000 * 60 * 60 * 24)); 
                        var horas = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
                        var minutos = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
                        var segundos = Math.floor((t % (1000 * 60)) / 1000);
            
                        var icon_timer = `<svg xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -2px;" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>`;
            
                        var div_timer = '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> '+icon_timer+' </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+dias+' </strong> Dias </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+horas+' </strong> H </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+minutos+' </strong> M </div> </div>';
                        div_timer += '<div class="timer-promocao-itens"> <div class="timer-promocao-item-tempo"> <strong> '+segundos+' </strong> S </div> </div>';
                        
                        $(item).html(div_timer);
                        
                        if (t < 0) { 
                            clearInterval(x); 
                            $(item).html('Promo&ccedil;&atilde;o Finalizada.'); 
                        }
                        
                    }, 1000);
                    
                });
            }
        
        },

        /* Category and search pages */

        slideCatalog: function(){
            if($('.slide-catalog').length){

                new Swiper('.slide-catalog', {
                    slidesPerView : 1,
                    preloadImages : false,
                    lazy :{
                        loadPrevNext: false,
                    },
                    pagination: {
                        el                : '.slide-catalog .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    }
                });

            }
        },

        sortMobile: function(){

            var options      = $();
            var selectedValue = $('#select_ordem').val();

            $('#select_ordem option').each(function(){
                options = options.add(
                    `<li ${ selectedValue === $(this).val() ? 'class="active"' : ''} data-option="${$(this).val()}">
                        ${$(this).text()}
                    </li>
                `);
            });

            $('.catalog-header .sort-mobile .sort-panel .sort-options').append(options);

            $('.catalog-header .sort-mobile .sort-panel .sort-options').on('click', 'li', function(){
                var option = $(this).data('option');
                $('#select_ordem').val(option).trigger('change');
            });

        },

        /* Product page */

        initProductGallery: function(){
            var zoomActive = $('.product-gallery').hasClass('zoom-true');

            var gallerySettings = {
                slidesPerView : 1,
                lazy :{
                    loadPrevNext: false,
                },
                on: {
                    init: function () {
                        if(!zoomActive) return;

                        if(this.slides.length === 1){
                            this.unsetGrabCursor();
                            this.allowTouchMove = false;
                        }

                        var wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="1"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    },
                    slideChange: function () {
                        if(!zoomActive) return;
                        var index = this.activeIndex + 1;
                        var wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="${index}"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    }
                }
            };


            if($('.product-wrapper .product-gallery .product-thumbs .swiper-slide').length){

                this.settings.productThumbs = new Swiper('.product-wrapper .product-gallery .product-thumbs .thumbs-list', {
                    slidesPerView: 4,
                    updateOnWindowResize: true,
                    centerInsufficientSlides: true,
                    watchSlidesProgress   : true,
                    watchSlidesVisibility : true,
                    navigation: {
                        nextEl: '.product-wrapper .product-gallery .product-thumbs .controls .next',
                        prevEl: '.product-wrapper .product-gallery .product-thumbs .controls .prev',
                    },
                    pagination: {
                        el                : '.product-wrapper .product-gallery .product-thumbs .thumbs-list .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    lazy :{
                        loadPrevNext: false,
                    },
                    breakpoints:{
                        0: {
                            slidesPerView: 3,
                        },
                        575: {
                            slidesPerView: 4,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                        1201: {
                            slidesPerView: 5,
                        }
                    },
                    on: {
                        init: function () {
                            $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                        }
                    }
                });

                gallerySettings.thumbs = {
                    autoScrollOffset     : 1,
                    multipleActiveThumbs : false,
                    swiper: this.settings.productThumbs
                };

            }

            this.settings.productGallery = new Swiper('.product-wrapper .product-gallery .product-images', gallerySettings);

        },

        recreateProductGallery: function(images){

            var productName = $('.product-wrapper .product-form .product-name').text();
            var htmlThumbs  = ``;
            var htmlImages  = ``;

            $.each(images, function (index, item){

                var slideIndex = index + 1;

                htmlImages += `
                    <div class="image swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="zoom">
                            <img loading="lazy" class="swiper-lazy" src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

                htmlThumbs +=
                    `<li class="swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="thumb">
                            <img src="${item.thumbs[90].https}" alt="${productName}">
                        </div>
                    </li>
                `;

            });

            if($('.product-wrapper .product-box .product-video').length > 0){
                var video = $('.product-wrapper .product-box .product-video').parent().html();
                htmlThumbs +=
                    `<li class="swiper-slide">
                        ${video}
                    </li>
                `;
            }

            if(theme.settings.productThumbs){
                theme.settings.productThumbs.destroy();
            }

            if(theme.settings.productGallery){
                theme.settings.productGallery.destroy();
            }

            $('.product-wrapper .product-gallery .product-images .image').remove();
            $('.product-wrapper .product-gallery .product-thumbs .swiper-slide').remove();
            $('.product-wrapper .product-gallery .product-images .swiper-wrapper').html(htmlImages);

            if(images.length > 1){

                $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                $('.product-wrapper .product-gallery .product-thumbs .thumbs-list .swiper-wrapper').html(htmlThumbs);

            } else {
                $('.product-wrapper .product-gallery .product-thumbs').removeClass('show');
            }

            theme.initProductGallery();

        },

        toggleProductVideo: function(){

            var internal = this;

            $(document).on('click', '.product-wrapper .product-box .product-video', function(){

                $('.modal-video').find('iframe').attr('data-src', $(this).data('url'));
                $('.modal-video').addClass('show');

                internal.initLazyload('.iframe-lazy');

            });

            $(document).on('click', '.modal-video, .modal-video .close-icon', function(event){
                if(!$(event.target).hasClass('modal-info')){
                    setTimeout(function () {
                        $('.modal-video .video iframe').removeAttr('src').removeClass('loaded').removeAttr('data-was-processed data-ll-status');
                    },300);
                }
            });

        },

        goToProductReviews: function(){

            var internal = this;

            $('.product-wrapper .product-box .product-form .product-rating .total').on('click', function(){

                var target;
                var adjust;

                if($(window).width() < 768){
                    target = '.product-tabs .tabs-content .tab-link-mobile.comments-link-tab';
                    adjust = 60;
                } else {
                    target = '.product-tabs .tabs-nav .tab-link.comments-link-tab';
                    adjust = 120;
                }

                $(target).trigger('click');
                internal.scrollToElement(target, adjust);

            });

            setTimeout(() => {
                $("#form-comments .submit-review").on("click", function(e){

                    if(!$("#form-comments .stars .starn.star-on").length) {
                        var textError = 'Avalia&ccedil;&atilde;o do produto obrigat&oacute;ria, d&ecirc; sua avalia&ccedil;&atilde;o por favor';
                        $("#div_erro .blocoAlerta").text(textError).show();
                        setTimeout(() => {
                            $("#div_erro .blocoAlerta").hide();
                        }, 5000);
                    }

                });
            }, 3000);

        },

        getShippingRates: function(){

            let internal = this;
            var quantity = 1;

            $('.shipping-form').on('submit', function(event){

                event.preventDefault();

                let variant  = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                //let url      = $('#shippingSimulatorButton').data('url'); 
                let url      = $('#shippingSimulatorButton').attr('data-url');                 
                let cep      = $('input', this).val().split('-');

                if (jQuery('#quant:visible').is(':visible')) {
                    quantity = jQuery('#quant:visible').val();
                }

                if(variant.length && variant.val() === ''){
                    $('.product-shipping .result').addClass('loaded').html(`<div class="error-message">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</div>`);
                    return;
                }

                variant = variant.val() || 0;

                url = url.replace('cep1=%s', `cep1=${cep[0]}`  )
                         .replace('cep2=%s', `cep2=${cep[1]}`  )
                         .replace('acao=%s', `acao=${variant}` )
                         .replace('dade=%s', `dade=${quantity}`);


                $('.product-shipping .result').removeClass('loaded').addClass('loading').html(internal.getLoader('Carregando fretes...'));

                /* Validate zip code first using viacep web service */
                $.ajax({
                    'url'      : `https://viacep.com.br/ws/${cep[0]+cep[1]}/json/`,
                    'method'   : 'get',
                    'dataType' : 'json',
                    'success'  : function (viacepResponse) {

                        if(viacepResponse.erro){

                            let message = 'Cep inv&aacute;lido. Verifique e tente novamente.'
                            $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            return;

                        }

                        $.ajax({
                            'url'    : url,
                            'method' : 'get',
                            'success' : function (response) {

                                if(response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')){

                                    let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.'
                                    $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                                    return;

                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                let local = shippingRates.find('p .color').html().replace(/\s\s\\\s/g, '').replace(/ \\/g, ',');

                                //shippingRates.find('table:first-child, p, table tr td:first-child').remove();
                                shippingRates.find('table:first-child, p').remove();
                                shippingRates.find('table, table th, table td').removeAttr('align class width border cellpadding cellspacing height colspan');

                                shippingRates.find('table').addClass('shipping-rates-table');

                                var frete = shippingRates.find('table th:first-child').text();
                                if (frete == 'Forma de Envio:'){
                                    shippingRates.find('table th:first-child').html('Frete').attr("colspan", "2");
                                }

                                var valor = shippingRates.find('table th:nth-child(2)').text();
                                if (valor == 'Valor:'){
                                    shippingRates.find('table th:nth-child(2)').html('Valor');
                                }

                                var prazo = shippingRates.find('table th:last-child').text();
                                if (prazo == 'Prazo de Entrega e Observa\u00E7\u00F5es:'){
                                    shippingRates.find('table th:last-child').html('Prazo');
                                }
                                shippingRates = shippingRates.children();

                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html('').append(shippingRates);

                            },
                            'error' : function (request, status, error) {

                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if(request.responseText !== ''){
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            }
                        });

                    },
                    'error': function (request, status, error) {

                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                        $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                    }
                });

                return false;

            });

        },

        productBuyTogether: function(){

            var internal = this;

            $('.compreJunto form .fotosCompreJunto').append('<div class="plus color to">=</div>');

            $('.compreJunto .produto img').each(function(){

                var imagUrl = $(this).attr('src').replace('/90_', '/180_');
                var link    = $(this).parent().attr('href') || '';
                var name    = $(this).attr('alt');

                $(this).addClass('lazyload-buy-together').attr('src', '').attr('data-src', imagUrl);
                internal.initLazyload('.lazyload-buy-together');

                if(link !== ''){
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="product-name" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<span class="product-name">${name}</span>`);
                }

            });

            if ($('.fotosCompreJunto .produto').length <= 2) {
                $('.fotosCompreJunto').addClass('buy-minus')
            }
            

        },

        loadProductPaymentOptionsTab: function(){

            var productId     = $('#form_comprar').data('id');
            var price         = $('#preco_atual').val();
            var paymentTab    = $('.product-tabs .tabs-content .payment-tab');
            var previousPrice = paymentTab.attr('data-loaded-price');

            if(previousPrice !== price){

                $.ajax({
                    'url'     : `/mvc/store/product/payment_options?loja=${theme.settings.storeId}&IdProd=${productId}&preco=${price}`,
                    'method'  : 'get',
                    'success' : function (response){

                        var html = $(response);

                        html = html.find('#atualizaFormas').unwrap();
                        html = html.find('ul.Forma1').unwrap();

                        html.find('li').each(function () {
                            var image = $('img', this).remove();
                            $('a', this).prepend(image);
                        });

                        html.find('table br').remove();
                        html.find('table td:first-child').remove();

                        html.find('table').removeAttr('id class width cellpadding cellspacing border style');
                        html.find('table td, table th').removeAttr('class width style');
                        html.find('li').removeAttr('id style');
                        html.find('li a').removeAttr('id class name');
                        html.find('li a img').removeAttr('border');

                        html.removeClass().addClass('payment-options');
                        html.find('li').addClass('option');
                        html.find('li a').attr('href', 'javascript:void(0)');
                        html.find('table').wrap('<div class="option-details"></div>');
                        html.find('.option-details').css('display', 'none');

                        paymentTab.attr('data-loaded-price', price);
                        paymentTab.html('').append(html);

                    }
                });

            }

        },

        productTabsAction: function(){

            var internal = this;

            $('.tab-link-mobile[href*="AbaPersonalizada"]').each(function(){

                var target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);

            });

            $('.product-tabs .tabs-content .tab[data-url]').each(function(){

                var tab = $(this);
                var url = tab.data('url');

                if(tab.hasClass('payment-tab')){

                    internal.loadProductPaymentOptionsTab();

                } else {
                    $.ajax({
                        'url'     : url,
                        'method'  : 'get',
                        'success' : function (response){
                            tab.html(response);
                        }
                    });
                }

            });

            $('.product-tabs .tabs-content .tab.payment-tab').on('click', '.option a', function (){

                var parent = $(this).parent();
                var table  = $(this).next();

                if (parent.hasClass('show')){
                    parent.removeClass('show');
                    table.slideUp();
                } else {
                    parent.addClass('show');
                    table.slideDown();
                }

            });

            $('.product-tabs .tabs-nav .tab-link').on('click', function (event) {

                var tabs = $(this).closest('.product-tabs');

                if(!$(this).hasClass('active')){

                    var target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $('.tab-link', tabs).removeClass('active');
                    $(this).addClass('active');

                    $('.tabs-content .tab', tabs).fadeOut();

                    setTimeout(function (){
                        target.fadeIn();
                    }, 300);

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            $('.product-tabs .tabs-content .tab-link-mobile').on('click', function (event){

                var target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if($(this).hasClass('active')){

                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();

                } else {

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            internal.productTabActionsOnResize();

            $(window).on('resize', function () {
                internal.productTabActionsOnResize();
            });

        },

        productTabActionsOnResize: function(){
            if($('.product-tabs .tabs-nav li').length){

                if($(window).width() < 768 && $('.product-tabs .tabs-nav .tab-link.active').length > 0){

                    $('.product-tabs .tabs-nav .tab-link').removeClass('active');
                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                } else if($(window).width() >= 768 && $('.product-tabs .tabs-nav .tab-link.active').length == 0) {

                    var firstLink = $('.product-tabs .tabs-nav .tab-link').first();
                    var target    = firstLink.attr('href').split('#')[1];

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    firstLink.addClass('active');

                    $(`#${target}`).show();

                }

            }
        },

        productReviews: function(){

            var commentsBlock = $(`<div class="product-comments">${window.commentsBlock}</div>`);

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function(response){

                    if(!Array.isArray(response.data)){

                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass("tray-hide");

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);


                    } else {

                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass("tray-hide");
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before('<button type="submit" class="submit-review">Enviar</button>').remove();

                    $('.ranking .rating').each(function() {

                        var review = Number($(this).attr('class').replace(/[^0-9]/g,''));

                        for (i = 1; i <= 5; i++){
                            if(i <= review){
                                $(this).append('<div class="icon active"></div>');
                            } else {
                                $(this).append('<div class="icon"></div>');
                            }
                        }

                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductRating();
                    theme.sendProductReview();

                }
            })
        },

        chooseProductRating: function() {
            $('#form-comments .rateBlock .starn').on('click', function(){

                var message = $(this).data('message');
                var rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('star-on');

                $(this).prevAll().addClass('star-on');

                $(this).addClass('star-on');

            });
        },

        sendProductReview: function() {
            $('#form-comments').on('submit', function(event){

                var form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function(response) {

                        form.closest('.product-comments').find('.blocoAlerta').hide();
                        form.closest('.product-comments').find('.blocoSucesso').show();

                        setTimeout(function(){

                            form.closest('.product-comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('star-on');

                        }, 8000);
                    },
                    error: function(response){

                        form.closest('.product-comments').find('.blocoSucesso').hide();
                        form.closest('.product-comments').find('.blocoAlerta').html(response.responseText).show();
                    }

                })

                event.preventDefault();
            })
        },

        productRelatedCarousel: function(){

            $('.section-product-related .product').on('mouseenter', function() {
                $('.showcase').addClass('z-index');
            });

            $('.section-product-related product').on('mouseleave', function() {
                $('.showcase').removeClass('z-index');
            });

            new Swiper('.section-product-related .swiper-container', {
                slidesPerView : 4,
                preloadImages : false,
                loop          : false,
                lazy :{
                    loadPrevNext: false,
                },
                navigation: {
                    nextEl: '.section-product-related .next',
                    prevEl: '.section-product-related .prev',
                },
                pagination: {
                    el                : '.section-product-related .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2
                    },
                    620: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    },
                }
            });

        },

        organizeProductHistory: function(){

            var target = $('.products-history .container').get(0);

            if(!target){
                return;
            }

            var observer = new MutationObserver(function(mutationsList, observer){
                $.each(mutationsList, function(){
                    if(this.type == "childList" && $(this.target).prop('id') == "produtos"){

                        $('.products-history .container img[src*="sobconsulta"]').after('<div class="botao-commerce">Sob consulta</div>');

                        setTimeout(function () {
                            $('.products-history .history-loader').removeClass('show');
                        }, 200);

                        return false;

                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });

            $('.products-history').on('click', '#linksPag a', function (){
                $('.products-history #produtos').html('');
                $('.products-history .history-loader').addClass('show');
            });

        },

        loadProductVariantImage : function(id){
            $.ajax({
                url    : `/web_api/variants/${id}`,
                method : 'get',
                success: function (response){

                    var images = response.Variant.VariantImage;

                    if(images.length){
                        theme.recreateProductGallery(images);
                    }

                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                }
            });
        },

        detectProductVariantChanges: function(){

            var internal = this;

            $('.product-variants').on('click', '.lista_cor_variacao li[data-id]', function(){
                internal.loadProductVariantImage($(this).data('id'));
            });

            $('.product-variants').on('click', '.lista-radios-input', function(){
                internal.loadProductVariantImage($(this).find('input').val());
            });

            $('.product-variants').on('change', 'select', function(){
                internal.loadProductVariantImage($(this).val());
            });

        },

        ImageVari : function(){

            $('.product .paleta-cores').each(function(){

                var ItemPaicor = $(this)

                if ($(this).length > 0 && $(this).find('.paleta-cores-item').hasClass('cor-sem-imagem')) {
                    
                    $(this).find('.paleta-cores-item').each(function(){

                        var idSemImg = $(this).attr('id')
                        var Itemcor = $(this)

                        if (Itemcor.length == 0) {
                            $.ajax({
                                url    : `/web_api/variants/${idSemImg}`,
                                method : 'get',
                                success: function (response){
                
                                    var imgVari = response.Variant.Sku;
    
                                    $.each(imgVari, function(id, item){
                                        
                                        if (item.type.toLowerCase() == 'cor' && (item.image.length || item.image_secure.length)) {
                                            Itemcor.removeClass('cor-sem-imagem')
                                            Itemcor.find('> div').remove()
                                            Itemcor.append(`<img src="${item.image}" title="${item.value}" data-test='test1'>`)
                                            ItemPaicor.removeAttr('style');
                                        }
                                    })
                            
                                },
                                error: function (request, status, error) {
                                    console.log(`Erro ao encontrar imagem. Details: ${error}`);
                                }
                            });
                        }
                        

                    })
                }

                setTimeout(() => {
                    $(this).show()
                }, 500);
            });
        },

        /* Store reviews page */

        organizeStoreReviewsPage: function(){

            if($('.page-content .container .btns-paginator').length){
                $('.page-content .container .btns-paginator').parent().addClass('store-review-paginator');
            }

            $('.page-content .container').append('<div class="botao-commerce show-modal-store-review" data-toggle="modal-theme" data-target=".modal-store-reviews">Deixe seu depoimento</div>');
            $('#depoimento #aviso_depoimento').after('<button type="button" class="botao-commerce send-store-review">Enviar</button>');

            $('.page-content h2:first').appendTo('.modal-store-reviews .modal-info');
            $('#depoimento').appendTo('.modal-store-reviews .modal-info');

            $('#comentario_cliente').remove();
            $('.modal-store-reviews #depoimento a').remove();

            $('.page-depoimentos .page-content').addClass('show');
            $('.page-depoimentos').addClass('show-menu');

        },

        validateStoreReviewForm: function(){

            $('.modal-store-reviews #depoimento').validate({
                rules: {
                    nome_depoimento :{
                        required: true
                    },
                    email_depoimento :{
                        required: true,
                        email: true
                    },
                    msg_depoimento: {
                        required: true
                    },
                    input_captcha: {
                        required: true
                    }
                },
                messages: {
                    nome_depoimento :{
                        required: "Por favor, informe seu nome completo",
                    },
                    email_depoimento:{
                        required : "Por favor, informe seu e-mail",
                        email    : "Por favor, preencha com um e-mail v&aacute;lido",
                    },
                    msg_depoimento: {
                        required: "Por favor, escreva uma mensagem no seu depoimento",
                    },
                    input_captcha: {
                        required: "Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o"
                    }
                },
                errorElement : 'span',
                errorClass   : 'error-block',
                errorPlacement: function(error, element){

                    if(element.prop('type') === 'radio'){
                        error.insertAfter(element.parent('.nota_dep'));
                    }

                    else if(element.is('textarea')){
                        error.insertAfter(element.parent().find('h5'));
                    }

                    else {
                        error.insertAfter(element);
                    }
                }
            } );

            $('.modal-store-reviews #depoimento .send-store-review').on('click', function() {

                var form = $('.modal-store-reviews #depoimento');
                var button = $(this);

                if (form.valid()) {

                    button.html('Enviando...').attr('disabled', true);
                    enviaDepoimentoLoja();

                }

            });

            /* Create observer to detect Tray return */

            var target = $('#aviso_depoimento').get(0);
            var config = { attributes: true };

            var observerReviewMessage = new MutationObserver(function(mutationsList, observer){
                $('.depoimentos-modal #depoimento .send-store-review').html('Enviar').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);

        },

        /* News page */
        organizeNewsPage: function(){

            if(!window.location.href.includes('busca_noticias')){
                $('#listagemCategorias').parent().before('<h1>Not&iacute;cias</h1>')
            }
            $('.noticias').find('li').wrapInner('<div class="box-noticia"></div>');
            
            $('.page-busca_noticias .box-noticia').each(function(){
                var link = $(this).find('#noticia_imagem a').attr('href');
                $(this).find('p').after(`<a href="${link}" class="button-show">Ver mais</a>`);
            });

            $('.page-busca_noticias .page-content').addClass('show');
            $('.page-busca_noticias').addClass('show-menu');

        },

        /* Contact page */
        organizeContactPage: function(){

            $('.page-contact .page-content > .container').prepend(`
                <h1>Fale conosco</h1>
                <p class="description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
                <div class="cols">
                    <div class="box-form">                        
                    </div>
                    <div class="info-form"></div>
                </div>
            `);

            $($('.page-content .container3').eq(1)).appendTo('.info-form');
            $($('.page-content .container3 .container2 .container2').eq(0)).appendTo('.box-form');

            if($('.info-form h3:contains(Empresa)').length){
                $('.info-form h3:contains(Empresa)').parent().insertBefore($('.info-form h3:contains(Endere)').parent());
            }

            $('.info-form h3:contains(Endere)').parent().after($('.map-iframe'));
            $('.page-contact form img.image').after('<div class="flex justify-end"><span class="botao-commerce flex align-center justify-center">Enviar</span></div>').remove();
            $('.page-contact #telefone_contato').removeAttr('onkeypress maxlength').addClass('phone-mask');


            if ($('.page-contact .contato-telefones').children().length == 3 ) {
                
                // Telefone 1
                var phoneNumberOneFormatted = $('.page-contact .contato-telefones .block:nth-child(1)').text();
                var phoneNumber = phoneNumberOneFormatted.replace(/\D/g, '');
                $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberOneFormatted}</a>`);

                // Telefone 2
                var phoneNumberTwoFormatted = $('.page-contact .contato-telefones .block:nth-child(2)').text();
                var phoneNumberTwo = phoneNumberTwoFormatted.replace(/\D/g, '');
                $('.page-contact .contato-telefones .block:nth-child(2)').html(`<a href="tel:${phoneNumberTwo}" title="Ligue para n&oacute;s">${phoneNumberTwoFormatted}</a>`);

                // whatsapp
                var wpNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(3)').text();
                var wpNumber = wpNumberFormatted.replace(/\D/g, '');
                $('.page-contact .contato-telefones .block:nth-child(3)').html(`<a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${wpNumber}" title="Fale conosco no WhatsApp">${wpNumberFormatted}</a>`);
            }else{
                if($('.page-contact .contato-telefones .block:nth-child(1)').length){

                    // Telefone 1
                    var phoneNumberOneFormatted = $('.page-contact .contato-telefones .block:nth-child(1)').text();
                    var phoneNumber = phoneNumberOneFormatted.replace(/\D/g, '');
                    $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberOneFormatted}</a>`);
    
                }
    
                if($('.page-contact .contato-telefones .block:nth-child(2)').length){
    
                    // Telefone 2
                    var phoneNumberTwoFormatted = $('.page-contact .contato-telefones .block:nth-child(2)').text();
                    var phoneNumberTwo = phoneNumberTwoFormatted.replace(/\D/g, '');
                    $('.page-contact .contato-telefones .block:nth-child(2)').html(`<a href="tel:${phoneNumberTwo}" title="Ligue para n&oacute;s">${phoneNumberTwoFormatted}</a>`);
    
                }
            }


            $('.page-contact .page-content').addClass('active');

        },

        /* Gifts page */
        gifts: function(){
            $('#form_presentes input[type="image"]').prev().html('<div class="botao-commerce">Continuar Comprando</div>');
            $('#form_presentes input[type="image"]').wrap('<div class="relative-button"></div>').after('<button class="botao-commerce">Avan&ccedil;ar</button>').remove();
        },

        /* Newsletter page */
        organizeNewsletterPage: function(){

            if($('.page-newsletter .formulario-newsletter').length){

                $('.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input').attr('placeholder', 'Digite o c&oacute;digo ao lado').trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('botao-commerce');

            } else {

                $('.page-newsletter .page-content').addClass('success-message-newsletter');
                $('.page-newsletter .page-content.success-message-newsletter .board p:first-child a').addClass('botao-commerce').html('Voltar para p&aacute;gina inicial');

            }

            setTimeout(function () {
                $('.page-newsletter .page-content').addClass('show');
            }, 200);

        },
        /* To Action in ajax.html */ 
        // updateCartTotal: function() {
        //     $('[data-cart="amount"]').text($('.cart-preview-item').length);
        // },

        opcoesFlutuantes: function(){

            $(window).on('scroll', function(){

                var tamanho_tela_inicial = $(window).height();
                var distancia_scroll = $(window).scrollTop();

                if(distancia_scroll > tamanho_tela_inicial){
                    $('.voltar-topo').css('display', 'flex');
                }else{
                    $('.voltar-topo').css('display', 'none');
                }

            });

            $(document).on('click', '.voltar-topo', function(){

                $("html, body").animate(
                    {
                        scrollTop: 0,
                    },
                    1500,
                    "easeInOutExpo"
                );

            });

        },

        lgpd: function()
        {

            var devrocket_lgpd = localStorage.getItem('box-lgpd');
            var alerta_implantacao = localStorage.getItem('box-alerta-implantacao');

            if(!devrocket_lgpd){
                setTimeout(function(){
                    $('.box-lgpd').slideToggle();
                }, 2500);
            }

            if(!alerta_implantacao){
                $('body > div:nth-child(3) > div.box-alerts').slideToggle();
            }

            $(document).on('click', 'body > div:nth-child(3) > div.box-alerts > label', function(){
                localStorage.setItem('box-alerta-implantacao', true);
                $('body > div:nth-child(3) > div.box-alerts').hide();
            });

            $(document).on('click', '.aceitar-lgpd', function(){
                localStorage.setItem('box-lgpd', true);
                $('.box-lgpd').hide();
            });

        },

        categoriaListagem: function(){

            $(document).on('click', '.box-filtro-lista-item', function(){

                $('.box-filtro-lista-item').removeClass('active');
                $(this).addClass('active');
                var class_list = $(this).attr('data-tipo');

                $('.catalog-content > div > ul.list-product').removeClass('produtos-lista');
                $('.catalog-content > div > ul.list-product').addClass(class_list);

            });

        },
        
        loadPaginaRating: function(){
            var url = window.location.href;
            
            if(url.includes('#comments')){
                $('.product-rating a.total').click();
            }
        },
        
        setCorrectHeaderMobile: function(){
            let header       = $('.header');
        
            if($('.cabecalho-mobile').length > 0){
                var headerMobile = $('.cabecalho-mobile');
            } else{
                var headerMobile = $('.header-mobile');
            }
            
            let headerHeight = $('.header').outerHeight() + 20;
            let position     = $(window).scrollTop() - 20;
        
            if(position > headerHeight){
                headerMobile.addClass('show');
                header.addClass('not-visible');
            } else {
                headerMobile.removeClass('show');
                header.removeClass('not-visible');
            }
        
        }

    };

    $(function(){
        theme.resets();
        theme.recoveryStoreId();
        theme.scrollHeader();
        theme.opcoesFlutuantes();
        theme.lgpd();
        theme.categoriaListagem();

        setTimeout(function(){
            theme.processRteElements();
            theme.initLazyload();
            theme.mainMenu();
            theme.mainMenuMobile();
            theme.initMasks();
            theme.toggleModalTheme();
            theme.overlay();
            theme.loadProdutosTimer();
            theme.loadCupomDescontoTimer();
            theme.loadBarraFullBannerTimer();
            theme.setCorrectHeaderMobile();
            theme.ImageVari();
        }, 20);

        if($('html').hasClass('page-home')){

            setTimeout(function(){
                theme.bannerHome();
                // theme.loadVitrinePersonalizada();
                theme.loadVitrinePersonalizadaTimer();
                // theme.loadPromocaoDestaque();
                theme.comentarios();
                theme.loadMarcas();
                theme.loadCategorias();
                theme.loadNews();
                theme.loadProutosMiniBanners();
            }, 400);

            setTimeout(function(){
                theme.loadShowCase();
            }, 2000);

            theme.storeReviewsIndex();

            if($('.box-loja-manutencao').length > 0){
                theme.loadPaginaManutencaoTimer();
            }

        }

        else if($('html').hasClass('page-newsletter')){
            theme.organizeNewsletterPage();
        }

        else if($('html').hasClass('page-catalog') || $('html').hasClass('page-search')){
            theme.slideCatalog();
            theme.sortMobile();
        }

        else if($('html').hasClass('page-product')){
            theme.initProductGallery();
            theme.toggleProductVideo();
            theme.detectProductVariantChanges();
            theme.goToProductReviews();
            theme.getShippingRates();
            theme.productBuyTogether();
            theme.productTabsAction();
            theme.productReviews();
            theme.productRelatedCarousel();
            theme.organizeProductHistory();
            theme.loadPaginaProdutoTimer();
            theme.loadPaginaRating();
        }

        else if ($('html').hasClass('page-busca_noticias')){
            theme.organizeNewsPage();
            theme.generateBreadcrumb('news-page-listing');
        }

        else if ($('html').hasClass('page-noticia')){
            theme.generateBreadcrumb('news-page');
        }

        else if ($('html').hasClass('page-depoimentos')){
            theme.organizeStoreReviewsPage();
            theme.validateStoreReviewForm();
        }

        else if($('html').hasClass('page-contact')){
            theme.organizeContactPage();
        }

        else if($('html').hasClass('page-finalizar_presentes')){
            theme.gifts();
        }

    });

    /* Formulario de Variacoes na Listagem */
    $(document).ready(function(){


        setTimeout(() => {
            $('.select-cor').each(function(){
                        
                if($(this).find(' > option').length == 0){ 
                    $(this).parents('.config-variacoes-compra').find(' > .itens-tamanho .select-tamanho').show();
                    $(this).parents('.config-variacoes-compra').find(' > .itens-tamanho .select-tamanho option').show();
                    $(this).parents('.config-variacoes-compra').find(' > .itens-tamanho .select-tamanho option:first').attr('selected', true);
                }
            });

            $('.config-variacoes-compra .paleta-cores').each(function(k, item){
                if ($(item).children().length <= 0 ) {
                    $(item).siblings('.itens-tamanho').addClass('ativo')
                } 
            });
        }, 3000);
        

        $('.numeric').keyup(function() {
            $(this).val(this.value.replace(/\D/g, ''));
        });        
            
        $(document).on("click", '.paleta-cores .paleta-cores-item', function(){
            
            $('.paleta-cores .paleta-cores-item').each(function(){
                $(this).removeClass('selecionada'); 
            });

            $(this).addClass('selecionada');
            
            $('.config-variacoes-compra .itens-tamanho.ativo .select-tamanho option').each(function(){
                $(this).removeClass('ativo');
            });
            $('.config-variacoes-compra .itens-tamanho').each(function(){
                $(this).removeClass('ativo');
            });
            $('.config-variacoes-compra .select-cor').each(function(){
                $(this).removeClass('ativo');
            });

            if($(this).find(' > div').length > 0){
                var titulo = $(this).find(' > div').attr('title');
            } else{
                var titulo = $(this).find(' > img').attr('title');
            }

            if($(this).parents('.config-variacoes-compra').find(' > .itens-tamanho .select-tamanho').length == 0){

                var variacao = $(this).attr('id');
                var estoque = $(this).attr('estoque');
                
                $(this).parents('.config-variacoes-compra').find(' > input[name=variacao]').val(variacao);
                $(this).parents('.config-variacoes-compra').find(' > input[name=estoque]').val(estoque);

            }else{
        
                $(this).parents('.config-variacoes-compra').find(' > .itens-tamanho').addClass('ativo');
                $(this).parents('.config-variacoes-compra').find(' > .select-cor').addClass('ativo');
                
                $(this).parents('.config-variacoes-compra').find(' > .itens-tamanho.ativo .select-tamanho option:first').attr('selected', true);
                
                var id = [];
                
                $('.config-variacoes-compra .select-cor.ativo option').each(function(k){
                    if($(this).attr('title') == titulo){
                        id[k] = $(this).val();
                    }
                });

                for(var key in id){
                
                    $('.config-variacoes-compra .itens-tamanho.ativo .select-tamanho option').each(function(){
                        if($(this).val() == id[key]){
                            $(this).addClass('ativo');
                        }
                    });
                }
                
                var id_imagem = $(this).attr('id');

                $('.config-variacoes-compra .select-cor.ativo option').each(function(){
                    if(id_imagem == $(this).val()){
                        var url = $(this).attr('data-original');
                        
                        if($(this).parents('.product-box').find(' > a .product-image .img-prod-2').length > 0){
                            $(this).parents('.product-box').find(' > a .product-image .img-prod-2').attr('src', url);
                        }else{
                            $(this).parents('.product-box').find(' > a .product-image .img-prod-1').attr('src', url);
                        }
                        
                    }
                });
                
                $(document).on("change", '.itens-tamanho.ativo .select-tamanho', function(){
                    $(this).find(' > option:first').attr('selected', false); 
                });

            }
            
        }); 
        
        $(document).on("change",'.select-tamanho', function(){

            var variacao = $(this).val();
            var estoque = $(this).find('option:selected').attr('estoque');
            var PriceBusiness = $(this).find('option:selected').attr('price') ? $(this).find('option:selected').attr('price') : 0;

            var item = this;
            
            if($('.trocar-preco').length > 0 ){
                $.ajax({
                    method: "GET",
                    url: '/web_api/variants/'+variacao,
                    success: function(data){

                        $(item).parents('.product').find('.product-body .product-price .product-has-variants').hide();

                        var dataAtual = new Date()
                        var dataAtualFinal = dataAtual.getTime()

                        // data promocional final formatada
                        var dataPromo = new Date(data.Variant.end_promotion)
                        var dataPromoFinal = dataPromo.getTime()

                        if(dataAtualFinal <= dataPromoFinal){

                            $(item).parents('.product').find('.product-body .product-price .old-price').show();
                            
                            var price = parseFloat(data.Variant.promotional_price);
                            var priceOld = parseFloat(data.Variant.price);
                            priceEcono = (priceOld - price).toFixed(2).replace('.',',')
                            numPorcent = ((priceOld - price) / priceOld) * 100

                            $(item).parents('.product').find('.product-body .product-price .compre-economize').html(' Compre agora e Economize: R$'+' '+priceEcono);
                            $(item).parents('.product').find('.product-header .discount-value').html(Math.round(numPorcent)+'%'+' '+'OFF');

                        }else{
                            $(item).parents('.product').find('.product-body .product-price .old-price').hide();
                            
                            if(PriceBusiness != 0 ){
                                var price = parseFloat(PriceBusiness)
                            }else{
                                var price = parseFloat(data.Variant.price);
                            }
                        }

                        var perfiil_id = $('body').attr('data-id-perfil');
            
                        if(perfiil_id <= 1 || perfiil_id == null){
                            price = price.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"});

                            $(item).parents('.product').find('.product-body .product-price .current-price').html(price);

                            if(dataAtualFinal <= dataPromoFinal){
                                priceOld = priceOld.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"})
                                $(item).parents('.product').find('.product-body .product-price .old-price').html(priceOld);
                            }

                            if(PriceBusiness == 0){
                                var payment = data.Variant.payment_option_html;
                                $(item).parents('.product').find('.product-body .product-price .product-installments').html(payment);
                            }
                            
                        }
                        
                    }        
                });
            }
            
            $(this).parents('.config-variacoes-compra').find(' > input[name=variacao]').val(variacao);
            $(this).parents('.config-variacoes-compra').find(' > input[name=estoque]').val(estoque);
            $(this).parents('.config-variacoes-compra').find('input[name=quantidade]').attr('data-estoque', estoque);
        });
        
        $(document).on("click", '.btn-comprar-listagem.btn-comprar', function(){

            var btn_comprar_listagem = $(this);
            var qtde_carrinho = parseInt($('.cart-quantity').html()) || 0; 
            var action = $(this).parents('.config-variacoes-compra').find('input[name=url-add-card]').val();
            var product_id = $(this).parents('.config-variacoes-compra').find('input[name=product_id]').val();
            var variacao = $(this).parents('.config-variacoes-compra').find('input[name=variacao]').val() || '';
            var quantidade = parseInt($(this).parents('.config-variacoes-compra').find('input[name=quantidade]').val());
            var estoque = $(this).parents('.config-variacoes-compra').find('input[name=estoque]').val();
            var data_store = $('html').attr('data-store');

            if($(this).parents('.config-variacoes-compra').find('input[name=variacao]').length > 0){
                if(variacao == ''){
                    $(this).parents('.config-variacoes-compra').find(' > .alerta-variacao').show();
                    setTimeout(function(){
                        $('.alerta-variacao').hide();
                    }, 3000);
                    return false;
                }
            }

            if(quantidade == 0 || quantidade.length == 0 || quantidade == ''){
                return false;
            }
            
            if(quantidade > estoque){

                $(this).parents('.config-variacoes-compra').find(' > .alerta-estoque').show();
                $(this).parents('.config-variacoes-compra').find(' > .alerta-estoque').html('Estoque insuficiente.');
                
                setTimeout(function(){
                    $('.alerta-estoque').hide();
                }, 3000);

                return false;
                
            }

            var btn_text = $(btn_comprar_listagem).html();

            if($('.site-main').attr('data-business') == '1'){
                var data_url = `/loja/cartService.php?loja=${data_store}&acao=incluir&IdProd=${product_id}`;
                var type = "application/x-www-form-urlencoded";
                var cart = 'variacao='+variacao+'&quant='+quantidade;
            }else{
                var dataSession =  $("html").attr("data-session");
                var data_url = '/web_api/cart/';
                var type = "application/json; charset=utf-8";
                var cart = '{"Cart":{"session_id":"'+dataSession+'","product_id":"'+product_id+'","quantity":"'+quantidade+'","variant_id":"'+variacao+'"}}';
            }

            $.ajax({
                type: "POST",
                url: data_url,
                contentType: type,
                data: cart,
                beforeSend: function(){
                    $(btn_comprar_listagem).html('<em>Adicionando...</em>');
                    $(btn_comprar_listagem).prop('disabled', true);
                },         
                success: function(){

                    $(btn_comprar_listagem).prop('disabled', false);
                    $(btn_comprar_listagem).html(btn_text);
                    
                    var total_carrinho = parseInt(qtde_carrinho) + parseInt(quantidade);
                    
                    $('.cart-quantity').html(total_carrinho);

                    $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.acao-compra').slideToggle();
                    $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.alerta-adicionado').html('Produto Adicionado').slideToggle();
                    
                    setTimeout(function(){
                        $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.alerta-adicionado').html('').slideToggle();
                    }, 3000);

                    setTimeout(function(){
                        $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.acao-compra').slideToggle();
                    }, 4000);
                },
                error: function(data){
                    var mensagem = data.responseJSON.causes;
                    $(btn_comprar_listagem).prop('disabled', false);
                    $(btn_comprar_listagem).html(btn_text);
                    $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.alerta-estoque').html(mensagem);
                    $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.alerta-estoque').show();

                    setTimeout(function(){
                        $(btn_comprar_listagem).parents('.config-variacoes-compra').find('.alerta-estoque').hide();
                    }, 3500);
                }

            });
            
        });

        $(document).on('click', '.quantidade-box .quantidade-box-controles-itens', function(){

            var tipo = $(this).attr('data-item');

            var estoque = parseInt($(this).parent().parent().find('#quantidade').attr('data-estoque'));
            var quantidade = parseInt($(this).parent().parent().find('#quantidade').val());

            if(tipo == 'menus'){
                quantidade -= 1;
                if(quantidade <= 0){
                    quantidade = 1;
                }
            }else{
                if(estoque > quantidade && quantidade > 0){
                    quantidade += 1;
                }else{
                    quantidade += 1;
                }
            }

            $(this).parent().parent().find('#quantidade').val(quantidade);

        });

        $('.icone-menu-pesquisar').on('click', function(){

            if($('.menu-horizontal-busca').hasClass('active')){
                $('.menu-horizontal-busca').removeClass('active');
                $('.menu-horizontal-busca').slideUp();
            }else{
                $('.menu-horizontal-busca').addClass('active');
                $('.menu-horizontal-busca').slideDown();
            }

        });

        $('.icone-menu-lateral').on('click', function(){

            $('.menu-lateral').addClass('active');

            $('.menu-horizontal-busca').removeClass('active');
            $('.menu-horizontal-busca').slideUp();

        });

        $('.menu-lateral-fechar').on('click', function(){

            $('.menu-lateral').removeClass('active');
            $('.menu-lateral').removeClass('show');
            $('.overlay-shadow').removeClass('show');
            $('body').removeClass('overflowed');

        });

        $('.menu-lateral-corpo-item').on('click', function(){

            if($(this).find('.menu-lateral-corpo-item-opcoes').hasClass('active')){
                $(this).removeClass('active');
                $(this).find('.menu-lateral-corpo-item-opcoes').removeClass('active');
                $(this).find('.menu-lateral-corpo-item-opcoes').slideUp();
            }else{
                $(this).addClass('active');
                $(this).find('.menu-lateral-corpo-item-opcoes').addClass('active');
                $(this).find('.menu-lateral-corpo-item-opcoes').slideDown();
            }

        });

        $('.first-level-icone').on('click', function(){

            $(this).parents('.first-level').find('.second-level').slideToggle();

        });
    
        function product_comprar_hide()
        {

            $('.product').each(function(k, item){

                if($(item).find('.product-price .product-message').length > 0){

                    var desc = $(item).find('.product-price .product-message').text();

                    if(
                        desc.includes('Esse acabou') || 
                        desc.includes('Sob consulta') || 
                        desc.includes('Esse acabou')
                    ){
                        $(item).find('.product-footer').hide();
                    }

                }

            });

        }
        
        setTimeout(function(){
            product_comprar_hide();
        }, 3000);

        $(document).on('click', '.btn-choose-variants', function(){
            $('.config-variacoes-compra').removeClass('show');
            $(this).parents('.product-footer').find('.config-variacoes-compra').addClass('show');
        });

        $(document).on('click', '.btn-close-variants', function(){
            $(this).parents('.product-footer').find('.config-variacoes-compra').removeClass('show');
        });

    });

    /* Aviso Estoque insuficiente */
    if(jQuery('.page-product').length > 0){
        if( jQuery('.product-variants').length == 0 ){
            var urlcomparar = jQuery('#button-buy').attr('id-produto');
            var estoqueinicial = parseInt(jQuery('#button-buy').attr('estoque'));
    
            atualizacaoProdutoSimples();
            quantidadeEstoqueProduto();
    
            jQuery('body').on('DOMSubtreeModified', '.carrinho-lateral', function() {
                atualizacaoProdutoSimples();
                quantidadeEstoqueProduto();
            });
    
            jQuery(document).on('click', '#button-buy', function(){
                var quantidadeselecionada = parseInt(jQuery('#quantidade').val());
                var estoque = parseInt(jQuery('#button-buy').attr('estoque'));
    
                if(estoque-quantidadeselecionada < 0){
                    mensagemSemEstoque();
                }
    
            });
        } else if(jQuery('.lista_cor_variacao').length > 0){
            var idvariacao = '';
            var idproduto = '';
            var estoqueinicial;

            jQuery(document).on('click', '.lista_cor_variacao:last > li', function(){
                idvariacao = jQuery(this).attr('data-id');
                idproduto = jQuery('#button-buy').attr('id-produto');

                jQuery('#button-buy').attr('estoque', jQuery('.estoquevariacao[id-variacao="'+idvariacao+'"]').attr('estoque-variacao'));

                estoqueinicial = parseInt(jQuery('#button-buy').attr('estoque'));

                atualizacaoProdutoVariacao();
                quantidadeEstoqueProduto();
            });

            jQuery('.lista_cor_variacao:last > li:first').click();

            jQuery('body').on('DOMSubtreeModified', '.carrinho-lateral', function() {
                atualizacaoProdutoVariacao();
                quantidadeEstoqueProduto();
            });

            jQuery(document).on('click', '#button-buy', function(){
                var quantidadeselecionada = parseInt(jQuery('#quantidade').val());
                var estoque = parseInt(jQuery('#button-buy').attr('estoque'));
    
                if(estoque-quantidadeselecionada < 0){
                    mensagemSemEstoque();
                }
    
            });
   
        } else if(jQuery('.lista_radios').length > 0){
            var idvariacao = '';
            var idproduto = '';
            var estoqueinicial;

            jQuery(document).on('click', '.lista_radios:last > li', function(){
                idvariacao = jQuery(this).find('.lista-radios-input > input').val();
                idproduto = jQuery('#button-buy').attr('id-produto');

                jQuery('#button-buy').attr('estoque', jQuery('.estoquevariacao[id-variacao="'+idvariacao+'"]').attr('estoque-variacao'));

                estoqueinicial = parseInt(jQuery('#button-buy').attr('estoque'));

                atualizacaoProdutoVariacao();
                quantidadeEstoqueProduto();
            });

            jQuery('body').on('DOMSubtreeModified', '.carrinho-lateral', function() {
                atualizacaoProdutoVariacao();
                quantidadeEstoqueProduto();
            });

            jQuery(document).on('click', '#button-buy', function(){
                var quantidadeselecionada = parseInt(jQuery('#quantidade').val());
                var estoque = parseInt(jQuery('#button-buy').attr('estoque'));
    
                if(estoque-quantidadeselecionada < 0){
                    mensagemSemEstoque();
                }
    
            });
        }
    }
    
    function atualizacaoProdutoSimples(){
        var x = setInterval(() => {
            if(jQuery('body').hasClass('carrinho-lateral-carregado')){
                if(jQuery('.devrocket-carrinho-item[data-indexp="'+urlcomparar+'"]').length > 0){
                    var quantidadecart = parseInt(jQuery('.devrocket-carrinho-item[data-indexp="'+urlcomparar+'"]').find('.input-quantidade-cart').attr('value'));
    
                    var estoquenovo = estoqueinicial-quantidadecart;
    
                    jQuery('#button-buy').attr('estoque', estoquenovo);
                } else{
                    jQuery('#button-buy').attr('estoque', estoqueinicial);
                }
                clearInterval(x);
            }
        }, 100);
    }
    
    function atualizacaoProdutoVariacao(){
        var x = setInterval(() => {
            if(jQuery('body').hasClass('carrinho-lateral-carregado')){
                if(jQuery('.devrocket-carrinho-item[data-indexp="'+idproduto+'"][idvariacao="'+idvariacao+'"]').length > 0){
                    var quantidadecart = parseInt(jQuery('.devrocket-carrinho-item[data-indexp="'+idproduto+'"][idvariacao="'+idvariacao+'"]').find('.input-quantidade-cart').attr('value'));
    
                    var estoquenovo = estoqueinicial-quantidadecart;
    
                    jQuery('#button-buy').attr('estoque', estoquenovo);
                } else{
                    jQuery('#button-buy').attr('estoque', estoqueinicial);
                }
                clearInterval(x);
            }
        }, 100);
    }
    
    function mensagemSemEstoque(){
        jQuery('.estoque-insuficiente').slideDown().css('display', 'flex');
    
        setTimeout(() => {
            jQuery('.estoque-insuficiente').slideUp();
        }, 5000);
    }

    /* Mostrar preco para usuarios logados */
    if(jQuery('.tray-hide[data-logged-user="true"]').length == 0 && jQuery('.tray-hide[data-logged-user="false"]').length > 0){
        jQuery('.remove-logged').remove();
    } else{

        var loop_logged = setInterval(() => {
            if(jQuery('.tray-hide[data-logged-user="true"]').length == 0){
                    jQuery('.remove-logged').remove();

                    clearInterval(loop_logged);
            }
        }, 100);

        setTimeout(() => {
            if(jQuery('.tray-hide[data-logged-user="true"]').length > 0){
                jQuery('.autenticacao-comprar-produto').removeClass('tray-hide');
            }
        }, 3000);
        
    }

    if(jQuery('.page-product').length > 0){
        if(jQuery('.autenticacao-comprar-produto').length > 0 && jQuery('#form_compre_junto_1').length > 0){
            jQuery('.comprejunto_botao').replaceWith('<div style="border: 1px solid #000;" class="autenticacao-comprar-produto mt-2" data-logged-user="false"> <a href="/my-account/login"> <button type="button" class="w-100"> Para realizar a compra do produto, por favor realize o Login! </button> </a> </div>');
        }
    }

    /* Esconder option apple */
    var appledevices = /(Mac|iPhone|iPod|iPad)/i;
    var isapple = false;

    if (appledevices.test(navigator.platform)) {
        isapple = true;
    }

    if(isapple){
        jQuery(document).on('click', '.config-variacoes-compra .paleta-cores-item', function(){
            
            if(jQuery('.esconder-option').length > 0){
                jQuery('.esconder-option').find('option').unwrap();
            }

            setTimeout(() => {
                jQuery(this).parents('.config-variacoes-compra').find('.itens-tamanho.ativo .select-tamanho > option:not(.ativo)[disabled!="disabled"]').wrap('<span class="esconder-option"/>');
            }, 50);
            
        });
    }

    /* Correios Jadlog Rastreio */
    if(jQuery('.correios-jadlog').length > 0){
        jQuery(document).on('submit', '.correios-jadlog form', function(event){
            event.preventDefault();
    
            var codigorastreio = jQuery(this).find('input').val();
    
            if(codigorastreio.length == '13' && codigorastreio.toUpperCase().slice(-2) == 'BR'){
                var transportadora = 'correios';
            } else{
                var transportadora = 'jadlog';
            }
    
            if(transportadora == 'correios'){
                window.open('https://www.linkcorreios.com.br/?id='+codigorastreio, '_blank');
            } else{
                window.open('https://www.jadlog.com.br/tracking?cte='+codigorastreio+'&lang=', '_blank');
            }
        });
    }

    /* Estoque do Produto */
    function quantidadeEstoqueProduto(){
        if(jQuery('.box-estoque-variacao').length > 0 && jQuery('#button-buy[estoque]').length > 0){
            setTimeout(() => {
                var estoqueproduto = jQuery('#button-buy').attr('estoque');

                jQuery('.box-estoque-variacao').text('Estoque: '+estoqueproduto);
            }, 1200);
        }
    }

    quantidadeEstoqueProduto();

    /* Ajuste Cor sem Imagem */
    if(jQuery('.paleta-cores-item.cor-sem-imagem').length > 0){
        jQuery('.config-variacoes-compra .paleta-cores').each(function(){
            if(jQuery(this).find('.paleta-cores-item.cor-sem-imagem').length > 0){
                jQuery(this).css('justify-content', 'space-evenly');
            }
        });
    }


    /* Desconto Variacoes */

    jQuery(document).on('click', '.lista_cor_variacao:last > li', function(){

        idProducVari = jQuery(this).attr('data-id');
        
        jQuery.ajax({
            method: "GET",
            url: "/web_api/variants/" + idProducVari,
        }).done(function(data) {   


            var dataAtual = new Date()
            dia = dataAtual.getDate()
            mes = dataAtual.getMonth() + 1
            ano = dataAtual.getFullYear()

            var diaAtual = `${ano}-${mes}-${dia}`

            if(diaAtual <= data.Variant.end_promotion){

                var price = parseFloat(data.Variant.promotional_price);
                var priceOld = parseFloat(data.Variant.price);
                numPorcent = ((priceOld - price) / priceOld) * 100   
                $('#product-wrapper .tag-discount').html(Math.round(numPorcent)+'%'+' '+'OFF');
            }
        });
    });

    jQuery(document).on('click', '.lista_radios:last > li', function(){

        idProducVari = jQuery(this).find('.lista-radios-input > input').val();

        jQuery.ajax({
            method: "GET",
            url: "/web_api/variants/" + idProducVari,
        }).done(function(data) {   


            var dataAtual = new Date()
            dia = dataAtual.getDate()
            mes = dataAtual.getMonth() + 1
            ano = dataAtual.getFullYear()

            var diaAtual = `${ano}-${mes}-${dia}`
            
            if(diaAtual <= data.Variant.end_promotion){

                var price = parseFloat(data.Variant.promotional_price);
                var priceOld = parseFloat(data.Variant.price);
                numPorcent = ((priceOld - price) / priceOld) * 100   
                $('#product-wrapper .tag-discount').html(Math.round(numPorcent)+'%'+' '+'OFF');
            }
        });
    });

    /* Imagens Variacoes */
    if((jQuery('.trocar-imagem-compra-direta').length > 0) && (jQuery('.product').length > 0)){

        function variacoesImagens(id, dom){
            jQuery.ajax({
                method: "GET",
                url: "/web_api/variants/" + id,
            }).done(function(response) {   
                var imagensvariacoes = [];

                jQuery(response.Variant.VariantImage).each(function(k){
                    // imagensvariacoes[k] = response.Variant.VariantImage[k].thumbs[180].https;
                    imagensvariacoes[k] = response.Variant.VariantImage[k].https;
        
                    if(k == 1){
                        return false;
                    }
                })

                if(imagensvariacoes.length == 1){
                    jQuery(dom).parents('.product').find('.image img:eq(0)').attr('src', imagensvariacoes[0]);
                }else if(imagensvariacoes.length > 1){
                    jQuery(dom).parents('.product').find('.image img:eq(0)').attr('src', imagensvariacoes[0]);
                    jQuery(dom).parents('.product').find('.image img:eq(1)').attr('src', imagensvariacoes[1]);
                }
            });
        }

        jQuery(document).on('click', '.paleta-cores-item', function(){
            var idvariacao = jQuery(this).attr('id');
            
            variacoesImagens(idvariacao, jQuery(this));
        });

        jQuery(document).on('change', '.product .config-variacoes-compra', function(){
            var idvariacao = jQuery(this).find('select :selected').attr('value');

            variacoesImagens(idvariacao, jQuery(this));
        });
        
    }

    /* Esconder botao Comprar variacao sem estoque */
    jQuery(document).on('click', '.product-variants *', function(){
        setTimeout(() => {
            if(jQuery('.product-variants #selectedVariant').attr('value') != ''){
                var variacaoselecionada = jQuery('.product-variants #selectedVariant').attr('value'); 
                var estoquevariacao = jQuery('.estoquevariacao[id-variacao="'+variacaoselecionada+'"]').attr('estoque-variacao');
            
                if(estoquevariacao == '0'){
                    jQuery('#product-form-box').fadeOut();
                } else{
                    jQuery('#product-form-box').fadeIn();
                }
            }
        }, 200);
    });

    var urlatual = window.location.href;

    if(jQuery('.page-product .product-variants').length > 0 && urlatual.search('variant_id') >= 0){

        var x = setInterval(() => {
            if(jQuery('.product-variants #selectedVariant').attr('value') != ''){
                var variacaoselecionada = jQuery('.product-variants #selectedVariant').attr('value'); 
                var estoquevariacao = jQuery('.estoquevariacao[id-variacao="'+variacaoselecionada+'"]').attr('estoque-variacao');
            
                if(estoquevariacao == '0'){
                    jQuery('#product-form-box').fadeOut();
                }

                clearInterval(x);
            }
        }, 100);
    }
    
    jQuery(document).on('click', '.cabecalho-mobile .h-busca', function(){
        var alturaheader = jQuery('.cabecalho-mobile').height();
        jQuery('.cabecalho-mobile .h-search').css('margin-bottom', alturaheader).fadeToggle();
    });

    jQuery(document).on('click', '.btn-wishlist', function(e){
        e.preventDefault();

        var href = (jQuery('#box-product-wishlist a')[0]).getAttribute('href');

        href = href.replace('my-accout', 'my-account');

        if(typeof href != 'undefined' &&  href.length > 0)
            window.location = href;

        return;
    });

}(jQuery));
