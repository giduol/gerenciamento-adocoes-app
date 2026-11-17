import { ApiDateValue } from '../shared/date-format';

export interface OngForm {
    name: string;
    cnpj: string;
    email: string;
    contact: string;
    phone: string;
}

export interface OngDetails extends OngForm {
    id: number;
    registrationDate: ApiDateValue;
}
