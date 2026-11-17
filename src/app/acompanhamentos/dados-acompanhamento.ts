import { AdocaoRelatorio } from '../adocoes/dados-adocao';
import { ApiDateValue } from '../shared/date-format';

export type MetodoAcompanhamento = 'PHOTOS' | 'VIDEOS';

export interface AcompanhamentoCadastro {
  periodDays: number;
  animalWithAdopter: boolean;
  animalHealthy: boolean;
  animalReturned: boolean;
  animalNotFound: boolean;
  methods: MetodoAcompanhamento[];
  notes: string;
  medias: File[];
}

export interface AcompanhamentoMedia {
  index: number;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
}

export interface AcompanhamentoRelatorio {
  id: number;
  periodDays: number;
  performedAt?: ApiDateValue;
  animalWithAdopter: boolean;
  animalHealthy: boolean;
  animalReturned: boolean;
  animalNotFound: boolean;
  methods: string[];
  mediaFiles: AcompanhamentoMedia[];
  notes: string | null;
}

export interface AcompanhamentoPorAdocao {
  adocao: AdocaoRelatorio;
  acompanhamentos: AcompanhamentoRelatorio[];
}

export interface AcompanhamentoConsulta {
  adocao: AdocaoRelatorio;
  acompanhamento: AcompanhamentoRelatorio;
}

export interface AcompanhamentoPorCpfResponse {
  acompanhamentos: AcompanhamentoConsulta[];
}
