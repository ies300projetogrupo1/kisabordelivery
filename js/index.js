var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyiX1jGxgOZWSbYJ'}).base('app5RwooVnqX8GzHG');
var cliente = null;
let precototal = 0.0;

function preencherCampoPedido() {
    precototal = 0.0;
    document.getElementById("itenspedido").value = "";
    let lista = document.getElementById("app").getElementsByTagName('li');
    for (let i = 0; i < lista.length; ++i) {
        let itemprecototal = (parseFloat(lista[i].getElementsByTagName("input")[1].value) * parseFloat(lista[i].getElementsByTagName('span')[0].innerHTML));
        if (lista[i].getElementsByTagName("input")[0].checked && lista[i].getElementsByTagName("input")[1].checkValidity()) {
            document.getElementById("itenspedido").value += ("0" + lista[i].getElementsByTagName("input")[1].value).slice(-2) + " " +
                                                            lista[i].getElementsByTagName('h3')[0].innerHTML + ": R$ " + itemprecototal.toFixed(2) + "\n";
            precototal += itemprecototal;
        }
    }
    if (precototal != 0) {
        document.getElementById("itenspedido").value += `Total: R$ ${precototal.toFixed(2)}`;
        document.getElementById("enviarpedido").style.display = "inline";
    }
    else {
        document.getElementById("enviarpedido").style.display = "none";
    }
}

preencherpedido.onclick = function() {preencherCampoPedido();}

verificarcadastro.onclick = function() {
    alert("ok");
    if (document.getElementById("telefone").checkValidity()) {
        base('Cliente').select({
            filterByFormula: "({Telefone} = " + document.getElementById("telefone").value + ")"
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                cliente = record;
                document.getElementById("nome").value = record.get('Nome');
                document.getElementById("endereco").value = record.get('Endereco');
                document.getElementById("nome").disabled = true;
                document.getElementById("endereco").disabled = true;
            });
        
            fetchNextPage();
        }, function done(error) {
            console.log(error);
        });

        document.getElementById("telefone").disabled = true;
        document.getElementById("verificarcadastro").style.display = "none";
        document.getElementById("dadospedido").style.display = "inline";
        document.getElementById("apagar").style.display = "inline";
        if (cliente == null) {
            document.getElementById("nome").disabled = false;
            document.getElementById("endereco").disabled = false;
        }
    }
}

function cadastrarCliente() {
    base('Cliente').create([
        {
            "fields": {
            "Telefone": document.getElementById("telefone").value,
            "Nome": document.getElementById("nome").value.trim(),
            "Endereco": document.getElementById("endereco").value.trim()
            }
        }
        ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function (record) {
            console.log(record.getId());
        });
        });    
}

enviarpedido.onclick = function () {
    if (document.getElementById("nome").checkValidity && document.getElementById("endereco").checkValidity &&
        document.getElementById("nome").value.trim().length >= 2 && document.getElementById("endereco").value.trim().length >= 2) {
        if (cliente == null) {
            cadastrarCliente();
        }

        base('Pedido').create([
            {
                "fields": {
                "Descricao": document.getElementById("itenspedido").value,
                "Status": "Aberto",
                "ClienteTelefone": document.getElementById("telefone").value
                }
            }
            ], function(err, records) {
            if (err) {
                console.error(err);
                return;
            }
            records.forEach(function (record) {
                console.log(record.getId());
            });
            });
        
        document.getElementById("nome").disabled = true;
        document.getElementById("endereco").disabled = true;
        document.getElementById("enviarpedido").style.display = "none";
        document.getElementById("preencherpedido").style.display = "none";
        document.getElementById("apagar").style.display = "none";
        document.getElementById("msgenviado").innerHTML = "Pedido enviado!";
    }
}

function apagarcampos() {
    document.getElementById("dadospedido").style.display = "none";
    document.getElementById("nome").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("nome").disabled = false;
    document.getElementById("endereco").disabled = false;
    document.getElementById("itenspedido").value = "";
    document.getElementById("enviarpedido").style.display = "none";
    document.getElementById("telefone").value = "";
    document.getElementById("telefone").disabled = false;
    document.getElementById("verificarcadastro").style.display = "inline";
    document.getElementById("apagar").style.display = "none";
    cliente = null;
}

apagar.onclick = function() {apagarcampos();}
