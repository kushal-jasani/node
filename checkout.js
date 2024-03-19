var stripe=Stripe('pk_test_51Ot1cCSCHK44EDHwd48KVHRzzhud57MHdgGOkV1SVsNVvyygtSsciEnfgb0abJ3omQtDkvAYi6CfBwQPkGvix2aQ00iVRpVFUQ')
var orderbtn=document.getElementById('order-btn');
    orderbtn.addEventListener('click',function(){
        stripe.redirectToCheckout({
        sessionId:'<%=sessionId%>'
    })
})