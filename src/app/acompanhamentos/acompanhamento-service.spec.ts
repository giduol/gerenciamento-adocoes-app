import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AcompanhamentoService } from './acompanhamento-service';
import { AcompanhamentoPorAdocao, AcompanhamentoPorCpfResponse } from './dados-acompanhamento';
import { AdocaoRelatorio } from '../adocoes/dados-adocao';

describe('AcompanhamentoService', () => {
  let service: AcompanhamentoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AcompanhamentoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('converte a resposta da consulta em adoções com listas de acompanhamentos', () => {
    const adocao = criarAdocao(1);
    const outraAdocao = criarAdocao(2);
    const primeiroAcompanhamento = criarAcompanhamento(10);
    const segundoAcompanhamento = criarAcompanhamento(11);
    const terceiroAcompanhamento = criarAcompanhamento(12);
    const cpf = '99224646168';
    let resultado: AcompanhamentoPorAdocao[] = [];

    service.listarPorCpf(cpf).subscribe((adocoes) => {
      resultado = adocoes;
    });

    const request = httpTestingController.expectOne('/api/acompanhamentos?cpf=99224646168');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('cpf')).toBe(cpf);
    request.flush({
      acompanhamentos: [
        { adocao, acompanhamento: primeiroAcompanhamento },
        { adocao, acompanhamento: segundoAcompanhamento },
        { adocao: outraAdocao, acompanhamento: terceiroAcompanhamento },
      ],
    } satisfies AcompanhamentoPorCpfResponse);

    expect(resultado).toEqual([
      { adocao, acompanhamentos: [primeiroAcompanhamento, segundoAcompanhamento] },
      { adocao: outraAdocao, acompanhamentos: [terceiroAcompanhamento] },
    ]);
  });
});

function criarAdocao(id: number): AdocaoRelatorio {
  return {
    id,
    ong: {
      id: 1,
      name: 'ONG',
      cnpj: '00000000000000',
      email: 'ong@example.com',
      contact: 'Contato',
      phone: '0000000000',
      registrationDate: '2026-01-01',
    },
    animal: {
      id: 1,
      species: 'Cão',
      name: 'Animal',
      birthDate: '2024-01-01',
      breed: 'SRD',
      specialCharacteristics: '',
      knownDiseases: '',
      registrationDate: '2025-01-01',
    },
    adotante: {
      id: 1,
      name: 'Adotante',
      cpf: '00000000000',
      address: null,
      email: 'adotante@example.com',
      phone: '0000000000',
      registrationDate: '2025-01-01',
    },
    adoptionDocument: null,
    adoptionDate: '2026-01-01',
    status: 'ATIVA',
  };
}

function criarAcompanhamento(id: number) {
  return {
    id,
    periodDays: 30,
    performedAt: '2026-02-01',
    animalWithAdopter: true,
    animalHealthy: true,
    animalReturned: false,
    animalNotFound: false,
    methods: ['PHOTOS'],
    mediaFiles: [],
    notes: null,
  };
}
