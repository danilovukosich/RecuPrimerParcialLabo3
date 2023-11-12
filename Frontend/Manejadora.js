"use strict";
/// <reference path = "./Planta.ts" />
var RecPrimerParcial;
(function (RecPrimerParcial) {
    window.addEventListener("load", () => {
        Manejadora.MostrarPlantasFotosBD();
    });
    class Manejadora {
        static AgregarPlantaFotoBD() {
            let xhttp = new XMLHttpRequest();
            let codigo = (document.getElementById("codigo").value);
            let nombre = (document.getElementById("nombre").value);
            let color_flor = (document.getElementById("color_flor").value);
            let precio = parseFloat((document.getElementById("precio").value));
            let foto = document.getElementById("foto");
            if (codigo != "" && nombre != "" && color_flor != "" && precio != -1 && foto != "") {
                let planta = new Vukosich.Planta(codigo, nombre, color_flor, precio, foto);
                let formData = new FormData();
                xhttp.open("POST", "http://localhost:2023/agregarPlantaFotoBD");
                formData.append('codigo', planta.codigo);
                formData.append('nombre', planta.nombre);
                formData.append('color_flor', planta.color_flor);
                formData.append('precio', planta.precio.toString());
                formData.append('foto', foto.files[0]);
                xhttp.setRequestHeader("enctype", "multipart/form-data");
                xhttp.send(formData);
                xhttp.onreadystatechange = () => {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        console.log(xhttp.responseText);
                        alert(xhttp.responseText);
                        Manejadora.MostrarPlantasFotosBD();
                    }
                };
            }
            else {
                alert("Cargue TODOS los datos del formulario!");
            }
        }
        static MostrarPlantasFotosBD() {
            let xhttp = new XMLHttpRequest();
            xhttp.open("get", "http://localhost:2023/listarPlantasFotosBD");
            xhttp.send();
            xhttp.onreadystatechange = () => {
                console.log(xhttp.readyState + " - " + xhttp.status);
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    let objeto = JSON.parse(xhttp.responseText);
                    let tabla = `<table class="table table-hover">
                    <tr>
                        <th>CODIGO</th><th>NOMBRE</th><th>COLOR</th><th>PRECIO</th><th>FOTO</th>
                    <tr>`;
                    objeto.forEach((elemento) => {
                        if (elemento != "") {
                            tabla += `<tr> 
                                            <td>  ${elemento.codigo}  </td> 
                                            <td>  ${elemento.nombre}  </td>
                                            <td><input type='color' value="${elemento.color_flor}"/></td>
                                            <td>  ${elemento.precio}  </td> 
                                            <td> <img src="http://localhost:2023/${elemento.foto}" width="50px" height="50px"></td>
                                            <td>
                                                <input type="button" value="Modificar" data-json=\' ${JSON.stringify(elemento)} \' data-action="Modificar">
                                                <input type ="button" value="Eliminar" data-json=\' ${JSON.stringify(elemento)} \' data-action="Eliminar">
                                            </td>
                                    <tr>`;
                        }
                    });
                    tabla += "</table>";
                    document.getElementById("divTablaPlantaFotos").innerHTML = tabla;
                    var botonModificar = document.querySelectorAll('[data-action="Modificar"]');
                    botonModificar.forEach(function (boton) {
                        boton.addEventListener('click', function () {
                            var objPlanta = JSON.parse(boton.getAttribute('data-json'));
                            //pongo los datos de la plnata a modificar el el fromulario, equivalente a MostrarInfoDePlataFoto 
                            document.getElementById("codigo").value = objPlanta.codigo;
                            document.getElementById("nombre").value = objPlanta.nombre;
                            document.getElementById("color_flor").value = objPlanta.color_flor;
                            document.getElementById("precio").value = objPlanta.precio;
                            document.getElementById("imgFoto").src = "http://localhost:2023/" + objPlanta.foto;
                            const inputCodigo = document.getElementById("codigo");
                            if (inputCodigo) {
                                inputCodigo.readOnly = true;
                            }
                        });
                    });
                    var botonEliminar = document.querySelectorAll('[data-action="Eliminar"]');
                    botonEliminar.forEach(function (boton) {
                        boton.addEventListener('click', function () {
                            var objPlanta = JSON.parse(boton.getAttribute('data-json'));
                            document.getElementById("codigo").value = objPlanta.codigo;
                            document.getElementById("nombre").value = objPlanta.nombre;
                            document.getElementById("color_flor").value = objPlanta.color_flor;
                            document.getElementById("precio").value = objPlanta.precio;
                            document.getElementById("imgFoto").src = "http://localhost:2023/" + objPlanta.foto;
                            const inputCodigo = document.getElementById("codigo");
                            if (inputCodigo) {
                                inputCodigo.readOnly = true;
                            }
                            Manejadora.EliminarPlantaFotoBD();
                        });
                    });
                }
            };
        }
        static ModificarPlantaFotoBD() {
            let xhttp = new XMLHttpRequest();
            let codigo = (document.getElementById("codigo").value);
            let nombre = (document.getElementById("nombre").value);
            let color_flor = (document.getElementById("color_flor").value);
            let precio = parseFloat((document.getElementById("precio").value));
            let foto = document.getElementById("foto");
            if (codigo != "" && nombre != "" && color_flor != "" && precio != -1 && foto != "") {
                let planta = new Vukosich.Planta(codigo, nombre, color_flor, precio);
                let formData = new FormData();
                xhttp.open("POST", "http://localhost:2023/modificarPlantaFotoBD");
                formData.append('planta_json', planta.toJSON());
                formData.append('foto', foto.files[0]);
                xhttp.setRequestHeader("enctype", "multipart/form-data");
                xhttp.send(formData);
                xhttp.onreadystatechange = () => {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        let respuesta = JSON.parse(xhttp.responseText);
                        if (respuesta.exito == true) {
                            const inputCodigo = document.getElementById("codigo");
                            Manejadora.MostrarPlantasFotosBD();
                            if (inputCodigo) {
                                inputCodigo.readOnly = false;
                            }
                        }
                        console.log(xhttp.responseText);
                        alert(xhttp.responseText);
                        alert(planta.toJSON()); //verifico q este bien el JSON//
                    }
                };
            }
            else {
                alert("Cargue TODOS los datos");
            }
        }
        static EliminarPlantaFotoBD() {
            let xhttp = new XMLHttpRequest();
            let codigo = (document.getElementById("codigo").value);
            let nombre = (document.getElementById("nombre").value);
            if (confirm(`¿ Seguro de eliminar la planta con la patente : ${codigo} y
                la planta: ${nombre} ?`)) {
                xhttp.open("POST", "http://localhost:2023/eliminarPlantaFotoBD");
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify({ "codigo": codigo }));
                xhttp.onreadystatechange = () => {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        let respuesta = JSON.parse(xhttp.responseText);
                        if (respuesta.exito == true) {
                            const inputCodigo = document.getElementById("codigo");
                            Manejadora.MostrarPlantasFotosBD();
                            if (inputCodigo) {
                                inputCodigo.readOnly = false;
                            }
                        }
                        console.log(xhttp.responseText);
                        alert(xhttp.responseText);
                    }
                };
            }
        }
    }
    RecPrimerParcial.Manejadora = Manejadora;
})(RecPrimerParcial || (RecPrimerParcial = {}));
//# sourceMappingURL=Manejadora.js.map