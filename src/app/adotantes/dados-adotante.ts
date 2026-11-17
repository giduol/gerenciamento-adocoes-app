import { ApiDateValue } from '../shared/date-format';

export interface AdotanteForm {
  name: string;
  cpf: string;
  address: string;
  email: string;
  phone: string;
}

export interface AdotanteDetails extends AdotanteForm {
  id: number;
  registrationDate?: ApiDateValue;
}
