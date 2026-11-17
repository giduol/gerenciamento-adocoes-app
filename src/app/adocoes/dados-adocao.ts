import { ApiDateValue } from '../shared/date-format';

export interface AdocaoForm {
  ongId: number;
  animalId: number;
  adotanteId: number;
  document: File;
  status: 'PENDENTE';
}

export interface DadosRelatorio {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  contact: string;
  phone: string;
  registrationDate: ApiDateValue;
}

export interface AnimalRelatorio {
  id: number;
  species: string;
  name: string;
  birthDate: ApiDateValue;
  breed: string;
  specialCharacteristics: string;
  knownDiseases: string;
  registrationDate: ApiDateValue;
}

export interface AdotanteRelatorio {
  id: number;
  name: string;
  cpf: string;
  address: string | null;
  email: string;
  phone: string;
  registrationDate: ApiDateValue;
}

export interface AdocaoRelatorio {
  id: number;
  ong: DadosRelatorio;
  animal: AnimalRelatorio;
  adotante: AdotanteRelatorio;
  adoptionDocument: string | null;
  adoptionDate: ApiDateValue;
  status: string;
}
