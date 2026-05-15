function carrinho_load(){
    var dataSession = jQuery("html").attr("data-session");
    var IdStoreSession = jQuery("html").attr("data-store");

    var produtosCarrinhoTrayStorage = localStorage.getItem('produtosCarrinhoTrayStorage') || false;

    if(produtosCarrinhoTrayStorage !== false && typeof dataSession !== 'undefined' && typeof IdStoreSession !== 'undefined' ){
 
        var dataSession = jQuery("html").attr("data-session");

        if(!jQuery("html").attr("data-session")){

            // document.location.reload(true);
            
            jQuery('.carrinho-lateral-corpo').html('<p>Carrinho Vazio</p>');

            var carrinho_load_div = `
                <div class="carrinho-lateral-total-produtos">
                    Sem itens
                </div>
                <div class="carrinho-lateral-total-valor">
                    Subtotal: <strong>R$ 0,00</strong>
                </div>
            `;
    
            jQuery('.carrinho-lateral-subtotal').html(carrinho_load_div);
    
            jQuery('.cart .cart-quantity').html('0');
    
            if(jQuery('.carrinho-lateral-frete-gratis-padrao').length > 0){
                jQuery('.carrinho-lateral-frete-gratis-padrao').show();
                jQuery('.carrinho-lateral-frete-gratis-porcentagem').html('');
            }
    
            localStorage.setItem('produtosCarrinhoTrayStorage', true);

        }else{

            jQuery.ajax({
                method: "GET",
                url: `/checkout/cart/api?session_id=${dataSession}&store_id=${IdStoreSession}`,
                beforeSend: function(){
                    // $('.carrinho-ajax').html('<p><em>Buscando, por favor aguarde...</em></p>');
                }
            }).done(function( response, textStatus, jqXHR ) {
                
                carrinho_load_listagem(response.data.cart);

            }).fail(function( jqXHR, status, errorThrown ){

                var response = jQuery.parseJSON(jqXHR.responseText);

                if(jQuery('.carrinho-ajax').length > 0){

                    jQuery('.carrinho-ajax').html('<p>Carrinho Vazio</p>');
                    jQuery('.cart-dropdown').css('margin-left', '-118px');
                    jQuery('.cart-dropdown').css('width', '180px');

                }else{

                    jQuery('.carrinho-lateral-corpo').html('<p>Carrinho Vazio</p>');

                    var carrinho_load_div = `
                        <div class="carrinho-lateral-total-produtos">
                            Sem itens
                        </div>
                        <div class="carrinho-lateral-total-valor">
                            Subtotal: <strong>R$ 0,00</strong>
                        </div>
                    `;

                    jQuery('.carrinho-lateral-subtotal').html(carrinho_load_div);

                    if(jQuery('.carrinho-lateral-frete-gratis-padrao').length > 0){
                        jQuery('.carrinho-lateral-frete-gratis-padrao').show();
                        jQuery('.carrinho-lateral-frete-gratis-porcentagem').html('');
                    }

                }

                jQuery('.cart .cart-quantity').html('0');
                jQuery('.h-carrinho .cart-quantity').html('0');

            });
        }

    }else{

        jQuery('.carrinho-lateral-corpo').html('<p>Carrinho Vazio</p>');

        var carrinho_load_div = `
            <div class="carrinho-lateral-total-produtos">
                Sem itens
            </div>
            <div class="carrinho-lateral-total-valor">
                Subtotal: <strong>R$ 0,00</strong>
            </div>
        `;

        jQuery('.carrinho-lateral-subtotal').html(carrinho_load_div);

        jQuery('.cart .cart-quantity').html('0');

        if(jQuery('.carrinho-lateral-frete-gratis-padrao').length > 0){
            jQuery('.carrinho-lateral-frete-gratis-padrao').show();
            jQuery('.carrinho-lateral-frete-gratis-porcentagem').html('');
        }

        localStorage.setItem('produtosCarrinhoTrayStorage', true);

    }

    return;
}

function carrinho_load_listagem(produtos_carrinho){

    if(produtos_carrinho.products.length > 0){

        var qtde_produtos = produtos_carrinho.products.length;
        var carrinho_load_div = "";
        var carrinho_load_total_preco_produtos = 0;
        var carrinho_load_total_produtos = 0;

        jQuery(produtos_carrinho.products).each(function(k, item){

            var carrinho_item = item;
            var carrinho_item_valor_total = item.quantity * item.price;
            carrinho_load_total_preco_produtos += carrinho_item_valor_total;
            carrinho_load_total_produtos += parseInt(item.quantity);
            var produto_item_imagem = (item.images.small.length > 0) ? "<img src='"+item.images.small+"' alt='"+item.product_name+"'>" : "";
            var carrinho_item_name_variacao = (item.has_variation === true ) ? `<p>${item.variant.replace('|'," -")}</p>` : "";

            carrinho_load_div += `
                <div class="devrocket-carrinho-item box-cart-product-${carrinho_item.id+'-'+carrinho_item.variant_id}" data-indexp='${carrinho_item.id}' idvariacao='${carrinho_item.variant_id}' data-cart='${carrinho_item.cart_id}'>
                    
                    <div class="devrocket-carrinho-item-imagem produto-carrinho-action" data-url-action="${carrinho_item.url.https}">
                        `+produto_item_imagem+`
                    </div>
                    <div class="devrocket-carrinho-item-nome produto-carrinho-action" data-url-action="${carrinho_item.url.https}">
                        <p>
                            <strong>`+ produto_perfil_name_format(carrinho_item.name) +`</strong>
                        </p>
                        `+ carrinho_item_name_variacao +`
                        Quantidade: `+ carrinho_item.quantity +` <br />
                        Pre&ccedil;o Unit&aacute;rio: R$ `+ produto_perfil_price_format(carrinho_item.price) +` 
                    </div>
                    
                    <div class="devrocket-carrinho-item-total">
                        ${template_quantity_cart(carrinho_item.id, carrinho_item.variant_id,  carrinho_item.quantity,carrinho_item.cart_id,(k + 1))}
                        <strong class="m-text-nowrap">R$ `+ produto_perfil_price_format(carrinho_item_valor_total) +`</strong>
                        <div class="devrocket-carrinho-remover-item" data-id="`+carrinho_item.id+`" data-variacao="`+carrinho_item.variant_id+`">
                            Remover
                        </div>
                    </div>
                </div>
            `;

        });

        var desc_itens = (produtos_carrinho.products.length > 1) ?  'itens' : 'item';
        var desc_produtos = (carrinho_load_total_produtos > 1) ?  'produtos' : 'produto';

        if(jQuery('.carrinho-lateral-corpo').length > 0){

            if(jQuery('.carrinho-lateral-frete-gratis-padrao').length > 0){
                jQuery('.carrinho-lateral-frete-gratis-padrao').hide();

                var valor_frete = jQuery('.carrinho-lateral-frete-gratis').data('valor-frete');

                if(carrinho_load_total_preco_produtos > valor_frete){
                    var frete_gratis_div = `
                        <span class="status"></span> Voc&ecirc; ganhou <strong>Frete Gr&aacute;tis</strong> para suas Compras.
                    `;
                }else{
                    valor_frete = produto_perfil_price_format(valor_frete - carrinho_load_total_preco_produtos);
                    var frete_gratis_div = `
                        <span class="status"></span> Faltam apenas <strong>R$ `+valor_frete+`</strong> para voc&ecirc; ganhar <br /> o <strong>Frete Gr&aacute;tis</strong>. Aproveite!
                    `;
                }

                jQuery('.carrinho-lateral-frete-gratis-porcentagem').html(frete_gratis_div);
            }

            jQuery('.carrinho-lateral-corpo').html(carrinho_load_div);

            carrinho_load_div = `
                <div class="carrinho-lateral-total-produtos">
                    <strong>`+ produtos_carrinho.products.length +` `+desc_itens+`</strong> (`+carrinho_load_total_produtos+` `+desc_produtos+`)
                </div>
                <div class="carrinho-lateral-total-valor">
                    Subtotal: <strong>R$ `+ produto_perfil_price_format(carrinho_load_total_preco_produtos) +`</strong>
                </div>
            `;

            jQuery('.carrinho-lateral-subtotal').html(carrinho_load_div);

        }else{

            carrinho_load_div += `
                <div class="devrocket-carrinho-item devrocket-carrinho-item-rodape">
                    <div class="devrocket-carrinho-item-imagem">
                        <strong>Total</strong>
                    </div>
                    <div class="devrocket-carrinho-item-nome">
                        <p>
                            <strong>`+ produtos_carrinho.length +` `+desc_itens+`</strong> (`+carrinho_load_total_produtos+` `+desc_produtos+`)
                        </p>
                    </div>
                    <div class="devrocket-carrinho-item-total">
                        <strong>R$ `+ produto_perfil_price_format(carrinho_load_total_preco_produtos) +`</strong>
                    </div>
                </div>
                <div class="devrocket-carrinho-item devrocket-carrinho-item-rodape">
                    <div class="devrocket-carrinho-item-imagem">
                    </div>
                    <div class="devrocket-carrinho-item-nome">
                        <p class="text-center">
                        <a href="{{ links.cart }}">
                                Finalizar Compra 
                                <svg style="margin-bottom: -4px;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                </svg>
                            </a>
                        </p>
                    </div>
                    <div class="devrocket-carrinho-item-total">
                        
                    </div>
                </div>
            `;

            jQuery('.carrinho-ajax').html(carrinho_load_div);

            jQuery('.cart-dropdown').css('margin-left', '-418px');
            jQuery('.cart-dropdown').css('width', '480px');

        }

        jQuery('.cart .cart-quantity').html(carrinho_load_total_produtos);
        jQuery('.h-carrinho .cart-quantity').html(carrinho_load_total_produtos);

    }else{

        if(jQuery('.carrinho-lateral-corpo').length > 0){
            jQuery('.carrinho-lateral-corpo').html('<p>Carrinho Vazio</p>');
        }else{
            jQuery('.carrinho-ajax').html('<p>Carrinho Vazio</p>');
        }

    }

    const cart_produtos = jQuery('.devrocket-carrinho-item');

    var arr_cart_produtos = cart_produtos.sort((a, b) => {
                        var x = jQuery(a).data('indexp');
                        var y = jQuery(b).data('indexp');
                        return ((x > y) ? 1 : ((x < y) ? -1 : 0));
                    });
    
    jQuery('.carrinho-lateral-corpo').html(arr_cart_produtos);

}

function produto_perfil_price_format(preco = ""){

    preco = parseFloat(preco).toFixed(2);
    return preco.toString().replace(".", ",");

}

function produto_perfil_name_format(nome = ""){

    nome = nome.toString().replaceAll("<br />" , " - ");
    return nome.toString().replaceAll("<br>" , " - ");

}

function template_quantity_cart(product, variant, quantity = 1, cartId, index){

    var button = `<div class="quantidade-box-cart">

                    <div class="quantidade-box-controles-itens" data-item="menus" data-index='${index}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </div>
                    
                    <div class="quantidade-box-input">
                        <input class="text numeric input-quantidade-cart quantidade-cart-${index}" value="${quantity}" data-product='${product}' data-variacao='${variant}' data-quantity="${quantity}" data-index='${product+'-'+variant}' data-Cart='${cartId}' maxlength="4" title="Campo Quantidade"/>
                    </div>

                    <div class="quantidade-box-controles-itens" data-item="mais" data-index='${index}'>
                        <svg xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -2px;" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </div>
                </div>`;

    return button;
}


jQuery(document).on('click', '.devrocket-carrinho-remover-item', function(){

    var dataSession = jQuery("html").attr("data-session");
    var produto_id = jQuery(this).data('id');
    var variacao = jQuery(this).data('variacao');
    var variacaoId;

    if (variacao > 0) {
        variacaoId = `/${variacao}`
    }

    jQuery.ajax({
        type: "delete",
        url: `/web_api/carts/${dataSession}/${produto_id}${variacaoId}`,
        contentType: "application/json; charset=utf-8",

        beforeSend: function(){
            jQuery(this).html('<em>Removendo...</em>');
        }            
    }).done(function(data){

        carrinho_load();

    }).fail(function(data){
        console.log('Erro ao remover item do carrinho.');
    });
});


jQuery(document).on('click', '.carrinho-lateral-on', function(){
    jQuery('.carrinho-lateral').addClass('active');
    carrinho_load();
});

setTimeout(function(){
    carrinho_load();
}, 2000);


jQuery(document).on('click', '.carrinho-lateral-fechar, .carrinho-lateral-continuar-comprando', function(){
    jQuery('.carrinho-lateral').removeClass('active');
});

jQuery(document).on('click', '.quantidade-box-cart .quantidade-box-controles-itens', function(){

    const tipo = jQuery(this).attr('data-item');
    const index = jQuery(this).attr('data-index');

    var estoque = parseInt(jQuery('.quantidade-cart-'+index).attr('data-estoque'));
    var quantidade = parseInt(jQuery('.quantidade-cart-'+index).val());
   
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

    jQuery('.quantidade-cart-'+index).val(quantidade).trigger('change');

});

jQuery(document).on('change', '.input-quantidade-cart', function(){
    
    var dataSession = jQuery("html").attr("data-session");
    var IdStoreSession = jQuery("html").attr("data-store");
    var quantidade = parseInt(jQuery(this).val());
    const produto = jQuery(this).data('product');
    const variante = jQuery(this).data('variacao');
    const quantidade_old = jQuery(this).data('quantity');
    const index = jQuery(this).data('index');
    const cart = jQuery(this).data('cart');

    if(quantidade > 0 && !isNaN(quantidade)){
        atualizar_cart(dataSession,IdStoreSession, quantidade,produto, variante,cart,quantidade_old,index);
    }
});

jQuery(document).on('click', '.produto-carrinho-action', function(){

    const url = String( jQuery(this).data('url-action'));

    if(url.length > 0){        
        window.open(url,'_blank');
    }

});

jQuery(document).on('click', '#button-buy, .cart-preview-item-delete', function(){
    setTimeout(() => {
        var y = setInterval(() => {
            if(jQuery('.cart-preview-loading:visible').length == 0){
                carrinho_load();
                
                clearInterval(y);
            }
        }, 100);
    }, 200);
});

jQuery(document).on('click', '.lista_cor_variacao > li', function(){
    carrinho_load();
});

function atualizar_cart(session,store_id,quantidade,prodId,variante=0,IDcarrinho,quantidade_antiga,index = 0) {
    if(!jQuery("html").attr("data-session")){
        // document.location.reload(true);
        
         jQuery(`<div class="alert alert-danger text-center msg-erro-cart-product-${index}">N&atilde;o foi possivel atualizar o carrinho</div>`).insertAfter(".box-cart-product-"+index);
        
    }else{
        jQuery.ajax({
            method: "PUT",
            url: `/checkout/cart/api/item/${IDcarrinho}?session_id=${session}&store_id=${store_id}&quantity=${quantidade}&product_id=${prodId}&variant_id=${variante}`,
            contentType: "application/json; charset=utf-8",
            beforeSend: function(){
                // $('.carrinho-ajax').html('<p><em>Buscando, por favor aguarde...</em></p>');
            }
        }).done((dataProduto) => {
            carrinho_load_listagem(dataProduto.data.cart)

        }).fail(function(errorCart){
            var response = jQuery.parseJSON( errorCart.responseText );

            jQuery(`<div class="alert alert-danger text-center msg-erro-cart-product-${index}">${response.errors[0]}</div>`).insertAfter(".box-cart-product-"+index);
            setTimeout(() => {
                jQuery(".msg-erro-cart-product-"+index).fadeOut(300, function(){ $(this).remove();});
                jQuery(".box-cart-product-"+index).find('.devrocket-carrinho-item-total .quantidade-box-input input').val(quantidade_antiga)
            }, 2000);
            
        });
    }
}

function AddCartProductBusiness(data, produto, quantidade, variante=0) {
    jQuery.ajax({
        type: "POST",
        url: `/loja/cartService.php?loja=${data}&acao=incluir&IdProd=${produto}`,
        contentType: "application/x-www-form-urlencoded",
        data: `variacao=${variante}&quant=${quantidade}`,

    }).done(function(data){

        carrinho_load();

    }).fail(function(data){
        console.log('Erro ao adicionar item do carrinho.');
    });
}

function AddCartProduct(data, produto, quantidade, variante=0) {
    jQuery.ajax({
        type: "POST",
        url: '/web_api/cart/',
        contentType: "application/json; charset=utf-8",
        data: `{Cart:{session_id:${data},product_id:${produto},quantity:${quantidade},variant_id:${variante}}}`,

    }).done(function(data){

        carrinho_load();

    }).fail(function(data){
        console.log('Erro ao adicionar item do carrinho.');
    });
}

jQuery(document).ready(() => {

    jQuery(document).on("change", '.select-tamanho', function(){

        var variacao = jQuery(this).val();
        var estoque = jQuery(this).find('option:selected').attr('estoque');

        jQuery(this).parents('.config-variacoes-compra').find(' > input[name=variacao]').val(variacao);
        jQuery(this).parents('.config-variacoes-compra').find(' > input[name=estoque]').val(estoque);
    });

    jQuery(document).on('click', '#bt_comprar', function(){
        carrinho_load();
    });

});