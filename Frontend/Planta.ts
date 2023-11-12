namespace Vukosich
{
    export class Planta
    {
        public  codigo :string;
        public  nombre :string;
        public color_flor :string;
        public precio :number;
        public path_foto : string;

        public constructor(codigo : string, nombre : string, color_flor : string, precio : number, path_foto : string = "")
        {
            this.codigo = codigo;
            this.nombre = nombre;
            this.color_flor = color_flor;
            this.precio = precio;
            this.path_foto=path_foto;
        }

        public toString() : string
        {
            return `"codigo": "${this.codigo}","nombre":"${this.nombre}","color_flor":"${this.color_flor}","precio": "${this.precio}","foto": "${this.path_foto}"`;
        }

        public toJSON() : string
        {
            return "{" + this.toString() + "}";
        }

    }
}
