"use strict";
var Vukosich;
(function (Vukosich) {
    class Planta {
        constructor(codigo, nombre, color_flor, precio, path_foto = "") {
            this.codigo = codigo;
            this.nombre = nombre;
            this.color_flor = color_flor;
            this.precio = precio;
            this.path_foto = path_foto;
        }
        toString() {
            return `"codigo": "${this.codigo}","nombre":"${this.nombre}","color_flor":"${this.color_flor}","precio": "${this.precio}","foto": "${this.path_foto}"`;
        }
        toJSON() {
            return "{" + this.toString() + "}";
        }
    }
    Vukosich.Planta = Planta;
})(Vukosich || (Vukosich = {}));
//# sourceMappingURL=Planta.js.map