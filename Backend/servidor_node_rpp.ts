
const express = require('express');

const app = express();

app.set('puerto', 2023);

//AGREGO FILE SYSTEM
const fs = require('fs');

//AGREGO JSON
app.use(express.json());

//AGREGO MULTER
const multer = require('multer');

//AGREGO MIME-TYPES
const mime = require('mime-types');

//AGREGO STORAGE
const storage = multer.diskStorage({

    destination: "public/plantas/fotos/",
});

const upload = multer({

    storage: storage
});

//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require('mysql');
const myconn = require('express-myconnection');
const db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'vivero_bd'
};

//AGREGO MW 
app.use(myconn(mysql, db_options, 'single'));

//AGREGO CORS (por default aplica a http://localhost)
const cors = require("cors");

//AGREGO MW 
app.use(cors());

//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));


//##############################################################################################//
//RUTAS PARA EL CRUD - CON BD - PLANTAS con FOTO
//##############################################################################################//

//LISTAR BD - plantas con foto
app.get('/listarPlantasFotosBD', (request:any, response:any)=>{

    request.getConnection((err:any, conn:any)=>{

        if(err)
        {
            console.log(err);
            //throw("Error al conectarse a la base de datos.");
            response.send(JSON.stringify("[]"));
        } 
        else
        {
            conn.query("select codigo, nombre, color_flor, precio, foto from plantas", (err:any, rows:any)=>{

                if(err) throw("Error en consulta de base de datos.");

                response.send(JSON.stringify(rows));
            });
        }
    });

});

//AGREGAR BD - Planta con foto
app.post('/agregarPlantaFotoBD', upload.single("foto"), (request:any, response:any)=>{
   
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = request.body;
    let path : string = file.destination + obj.codigo + "." + extension;

    fs.renameSync(file.path, path);

    obj.foto = path.split("public/")[1];

    let obj_rta:any={};
    obj_rta.exito = true;
    obj_rta.mensaje = "Planta con foto agregada en BD";

    request.getConnection((err:any, conn:any)=>{

        if(err){

            obj_rta.exito = false;
            obj_rta.mensaje = "Error al conectarse a la base de datos.";
        }
        else {

            conn.query("insert into plantas set ?", [obj], (err:any, rows:any)=>{

                if(err) { 

                    obj_rta.exito = false;
                    obj_rta.mensaje = "Error en consulta {insert} de base de datos.";
                }
            });
        }
    });

    response.send(JSON.stringify(obj_rta));
});

//MODIFICAR BD - Planta con foto
app.post('/modificarPlantaFotoBD', upload.single("foto"), (request:any, response:any)=>{
    
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.planta_json);
    let path : string = file.destination + obj.codigo + "." + extension;

    fs.renameSync(file.path, path);

    let obj_modif : any = {};
    //para excluir la pk (codigo)
    obj_modif.nombre = obj.nombre;
    obj_modif.color_flor = obj.color_flor;
    obj_modif.precio = obj.precio;
    obj_modif.foto = path.split("public/")[1];

    let obj_rta:any={};
    obj_rta.exito = true;
    obj_rta.mensaje = "Planta con foto modificada en BD";

    request.getConnection((err:any, conn:any)=>{

        if(err){

            obj_rta.exito = false;
            obj_rta.mensaje = "Error al conectarse a la base de datos.";
        }
        else {

            conn.query("update plantas set ? where codigo = ?", [obj_modif, obj.codigo], (err:any, rows:any)=>{

                if(err) { 

                    obj_rta.exito = false;
                    obj_rta.mensaje = "Error en consulta {update} de base de datos.";
                }
            });
        }

        response.send(JSON.stringify(obj_rta));
    });
});

//ELIMINAR BD - Planta con foto
app.post('/eliminarPlantaFotoBD', (request:any, response:any)=>{
   
    let obj = request.body;
    let path_foto : string = "public/";

    let obj_rta:any={};
    obj_rta.exito = true;
    obj_rta.mensaje = "Planta con foto eliminada en BD";

    request.getConnection((err:any, conn:any)=>{

        if(err){

            obj_rta.exito = false;
            obj_rta.mensaje = "Error al conectarse a la base de datos.";
        }
        else {

            //obtengo el path de la foto de la planta a ser eliminada
            conn.query("select foto from plantas where codigo = ?", [obj.codigo], (err:any, result:any)=>{

                if(err){

                    obj_rta.exito = false;
                    obj_rta.mensaje = "Error al conectarse a la base de datos.";
                }
                else {

                    path_foto += result[0].foto;
                }
            });
        }
    });

    request.getConnection((err:any, conn:any)=>{

        if(err){

            obj_rta.exito = false;
            obj_rta.mensaje = "Error al conectarse a la base de datos.";
        }
        else {

            conn.query("delete from plantas where codigo = ?", [obj.codigo], (err:any, rows:any)=>{

                fs.unlink(path_foto, (err:any) => {
                    if(err){

                        obj_rta.exito = false;
                        obj_rta.mensaje = "Error al eliminar foto.";
                    }
                });

            });
        }

        response.send(JSON.stringify(obj_rta));
    });
});

//LISTAR BD - plantas filtradas con foto
app.get('/listarPlantasFiltradasFotosBD', (request:any, response:any)=>{
console.log(request.query);
    let obj = JSON.parse(request.query.planta_json);

    filtrar(request, response, obj);
});

function filtrar(request:any, response:any, obj:any) : any
{
    request.getConnection((err:any, conn:any)=>{

        if(err)
        {
            console.log(err);
            //throw("Error al conectarse a la base de datos.");
            response.send(JSON.stringify("[]"));
        } 
        else
        {
            let cadena = "select codigo, nombre, color_flor, precio, foto from plantas where 1 ";

            cadena += obj.codigo !== undefined ? "and codigo = '" + obj.codigo + "' " : "";
            cadena += obj.nombre !== undefined ? "and nombre = '" + obj.nombre + "' " : "";
            cadena += obj.color_flor !== undefined ? "and color_flor = '" + obj.color_flor + "' " : "";
            cadena += obj.precio !== undefined ? "and precio = " + obj.precio : "";

            conn.query(cadena, (err:any, rows:any)=>{

                if(err)
                {
                    console.log(err);
                    response.send(JSON.stringify("[]"));
                } 
                else
                {
                    response.send(JSON.stringify(rows));
                }
            });
        }
    });    
}

app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});