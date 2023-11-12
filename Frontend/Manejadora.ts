/// <reference path = "./Planta.ts" />


namespace RecPrimerParcial
{
    window.addEventListener("load", ():void => {
        Manejadora.MostrarPlantasFotosBD();
    }); 

    
    export class Manejadora
    {
        
        public static AgregarPlantaFotoBD()
        {
            let xhttp : XMLHttpRequest = new XMLHttpRequest();
            let codigo : string = ((<HTMLInputElement> document.getElementById("codigo")).value);
            let nombre : string = ((<HTMLInputElement> document.getElementById("nombre")).value);
            let color_flor : string = ((<HTMLInputElement> document.getElementById("color_flor")).value);
            let precio : number = parseFloat(((<HTMLInputElement> document.getElementById("precio")).value));
            let foto : any = (<HTMLInputElement>document.getElementById("foto"));


            if (codigo !="" && nombre !="" && color_flor !="" && precio !=-1 && foto !="") 
            {
                let planta : Vukosich.Planta = new Vukosich.Planta(codigo,nombre,color_flor,precio,foto);
                let formData : FormData = new FormData();
                xhttp.open("POST","http://localhost:2023/agregarPlantaFotoBD");
                formData.append('codigo', planta.codigo);
                formData.append('nombre', planta.nombre);
                formData.append('color_flor', planta.color_flor);
                formData.append('precio', planta.precio.toString());
                formData.append('foto', foto.files[0]);

                xhttp.setRequestHeader("enctype","multipart/form-data");

                xhttp.send(formData);
                xhttp.onreadystatechange = () => 
                {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                    if (xhttp.readyState == 4 && xhttp.status == 200) 
                    {
                        console.log(xhttp.responseText);
                        
                        alert(xhttp.responseText);

                        Manejadora.MostrarPlantasFotosBD();
                    }
                };
            }
            else
            {
                alert("Cargue TODOS los datos del formulario!");
            }
        }


        public  static MostrarPlantasFotosBD()
        {
            let xhttp : XMLHttpRequest = new XMLHttpRequest();

            xhttp.open("get","http://localhost:2023/listarPlantasFotosBD");

            xhttp.send();

            xhttp.onreadystatechange = () => 
            {
                console.log(xhttp.readyState + " - " + xhttp.status);
                
                if (xhttp.readyState == 4 && xhttp.status == 200) 
                {
                    let objeto = JSON.parse(xhttp.responseText);

                    let tabla : string = `<table class="table table-hover">
                    <tr>
                        <th>CODIGO</th><th>NOMBRE</th><th>COLOR</th><th>PRECIO</th><th>FOTO</th>
                    <tr>`;
                    objeto.forEach((elemento : any) => {
                        if (elemento != "") 
                        {
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
                    (<HTMLDivElement>document.getElementById("divTablaPlantaFotos")).innerHTML = tabla; 
                      

                        var botonModificar= document.querySelectorAll('[data-action="Modificar"]');

                        botonModificar.forEach(function(boton : any) {

                        boton.addEventListener('click', function() {

                        var objPlanta = JSON.parse(boton.getAttribute('data-json'));
                        //pongo los datos de la plnata a modificar el el fromulario, equivalente a MostrarInfoDePlataFoto 
                        (<HTMLInputElement> document.getElementById("codigo")).value = objPlanta.codigo;
                        (<HTMLInputElement> document.getElementById("nombre")).value = objPlanta.nombre;
                        (<HTMLInputElement> document.getElementById("color_flor")).value = objPlanta.color_flor;
                        (<HTMLInputElement> document.getElementById("precio")).value = objPlanta.precio;  
                        (<HTMLInputElement> document.getElementById("imgFoto")).src = "http://localhost:2023/" + objPlanta.foto;  
                        
                        const inputCodigo = document.getElementById("codigo") as HTMLInputElement;
                        if (inputCodigo) {
                            inputCodigo.readOnly = true; 
                        }
                        
                    });
                });
                
                
                var botonEliminar= document.querySelectorAll('[data-action="Eliminar"]');
                botonEliminar.forEach(function(boton : any) {
                    boton.addEventListener('click', function() {
                        var objPlanta = JSON.parse(boton.getAttribute('data-json'));
                         
                        (<HTMLInputElement> document.getElementById("codigo")).value = objPlanta.codigo;
                        (<HTMLInputElement> document.getElementById("nombre")).value = objPlanta.nombre;
                        (<HTMLInputElement> document.getElementById("color_flor")).value = objPlanta.color_flor;
                        (<HTMLInputElement> document.getElementById("precio")).value = objPlanta.precio;  
                        (<HTMLInputElement> document.getElementById("imgFoto")).src = "http://localhost:2023/" + objPlanta.foto;

                        const inputCodigo = document.getElementById("codigo") as HTMLInputElement;
                        if (inputCodigo) {
                            inputCodigo.readOnly = true; 
                        }

                        Manejadora.EliminarPlantaFotoBD();
                        });
                    });
                }
            };
        }

        public static ModificarPlantaFotoBD()
        {
            let xhttp : XMLHttpRequest = new XMLHttpRequest();
            let codigo : string = ((<HTMLInputElement> document.getElementById("codigo")).value);
            let nombre : string = ((<HTMLInputElement> document.getElementById("nombre")).value);
            let color_flor : string = ((<HTMLInputElement> document.getElementById("color_flor")).value);
            let precio : number = parseFloat(((<HTMLInputElement> document.getElementById("precio")).value));
            let foto : any = (<HTMLInputElement>document.getElementById("foto"));

            if (codigo !="" && nombre !="" && color_flor !="" && precio !=-1 && foto != "") 
            {
                let planta : Vukosich.Planta = new Vukosich.Planta(codigo,nombre,color_flor,precio);
                
                let formData : FormData = new FormData();

                xhttp.open("POST","http://localhost:2023/modificarPlantaFotoBD");
                formData.append('planta_json', planta.toJSON());
                formData.append('foto', foto.files[0]);
                xhttp.setRequestHeader("enctype","multipart/form-data");
                xhttp.send(formData);

                xhttp.onreadystatechange = () => 
                {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                    
                    if (xhttp.readyState == 4 && xhttp.status == 200) 
                    {
                        let respuesta = JSON.parse(xhttp.responseText);
                        if (respuesta.exito == true) 
                        {
                            const inputCodigo = document.getElementById("codigo") as HTMLInputElement;
                            Manejadora.MostrarPlantasFotosBD();


                            if (inputCodigo) {
                                inputCodigo.readOnly = false; 
                            }
                        }

                        console.log(xhttp.responseText);
                        alert(xhttp.responseText);
                        alert(planta.toJSON());//verifico q este bien el JSON//

                    }
                };
            }
            else
            {
                alert("Cargue TODOS los datos");
            }
            
        }

        public static EliminarPlantaFotoBD()
        {
            let xhttp : XMLHttpRequest = new XMLHttpRequest();

            let codigo : string = ((<HTMLInputElement> document.getElementById("codigo")).value);
            let nombre : string = ((<HTMLInputElement> document.getElementById("nombre")).value);




            if (confirm(`¿ Seguro de eliminar la planta con la patente : ${codigo} y
                la planta: ${nombre} ?`)) 
            {

                xhttp.open("POST","http://localhost:2023/eliminarPlantaFotoBD");

                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify({ "codigo": codigo }));
                
                xhttp.onreadystatechange = () => 
                {
                    console.log(xhttp.readyState + " - " + xhttp.status);
                
                    if (xhttp.readyState == 4 && xhttp.status == 200) 
                    {
                        let respuesta = JSON.parse(xhttp.responseText);
                        if (respuesta.exito == true) 
                        {
                            const inputCodigo = document.getElementById("codigo") as HTMLInputElement;
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
}