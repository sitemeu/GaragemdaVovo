document.getElementById('send-order').addEventListener('click', function () {
    const name = encodeURIComponent(document.getElementById('name').value);
    const phone = encodeURIComponent(document.getElementById('phone').value);
    const description = encodeURIComponent(document.getElementById('description').value);
    const message = `Olá! Gostaria de fazer um pedido:\n\nNome: ${name}\nTelefone: ${phone}\nDescrição: ${description}`;
    const whatsappUrl = `https://wa.me/+5517997081907?text=${message}`;
    window.open(whatsappUrl, '_blank');
});
