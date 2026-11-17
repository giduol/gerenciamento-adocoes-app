import { ApiDateValue } from '../shared/date-format';

export interface AnimalForm {
  name: string;
  species: string;
  birthDate: string;
  breed: string;
  specialCharacteristics: string;
  knownDiseases: string;
}

export interface AnimalDetails extends Omit<AnimalForm, 'birthDate'> {
  id: number;
  birthDate: ApiDateValue;
  registrationDate?: ApiDateValue;
}
