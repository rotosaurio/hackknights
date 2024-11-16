import mongoose from 'mongoose';

interface IUserData {
  edad: number;
  altura: number;
  peso: number;
  género: string;
  historia_familiar: string;
  nivel_actividad: string;
  preferencias_dietéticas: string;
  consumo_azúcar: string;
  patrones_comida: string;
  niveles_estrés: string;
  patrones_sueño: string;
  desafíos_actuales: string;
  user: string;
}

const UserDataSchema = new mongoose.Schema<IUserData>({
  edad: Number,
  altura: Number,
  peso: Number,
  género: String,
  historia_familiar: String,
  nivel_actividad: String,
  preferencias_dietéticas: String,
  consumo_azúcar: String,
  patrones_comida: String,
  niveles_estrés: String,
  patrones_sueño: String,
  desafíos_actuales: String,
  user: String
}, { 
  collection: 'datosnodiab',
  strict: false 
});

const UserData = mongoose.models.UserData || mongoose.model<IUserData>('UserData', UserDataSchema);

export default UserData;
