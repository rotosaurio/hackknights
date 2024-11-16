import mongoose from 'mongoose';

interface IDiabetesEntry {
  userId: string;
  fecha: string;
  glucosa: string;
  insulina: string;
  medicamentos: string;
  nivelActividad: string;
  comidasPorDia: string;
  desafios: string;
}

const DiabetesEntrySchema = new mongoose.Schema<IDiabetesEntry>({
  userId: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  glucosa: {
    type: String,
    required: true,
  },
  insulina: {
    type: String,
    required: true,
  },
  medicamentos: {
    type: String,
    required: true,
  },
  nivelActividad: {
    type: String,
    required: true,
  },
  comidasPorDia: {
    type: String,
    required: true,
  },
  desafios: {
    type: String,
    required: true,
  }
});

const DiabetesEntry = mongoose.models.DiabetesEntry || mongoose.model<IDiabetesEntry>('DiabetesEntry', DiabetesEntrySchema);

export default DiabetesEntry;