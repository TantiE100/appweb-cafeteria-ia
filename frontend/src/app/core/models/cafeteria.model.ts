export interface Cafeteria {
  id: number;
  nombre: string;
  eslogan: string;
  titulo: string;
  titulo_destacado: string;
  ciudad: string;
  historia: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  video: string;
}

export interface FotoGaleria {
  id: number;
  titulo: string;
  imagen: string;
}

export interface Nosotros extends Cafeteria {
  galeria: FotoGaleria[];
}
