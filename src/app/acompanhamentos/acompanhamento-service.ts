import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import {
  AcompanhamentoCadastro,
  AcompanhamentoPorAdocao,
  AcompanhamentoPorCpfResponse,
} from './dados-acompanhamento';
import { API_URL, BACKEND_ORIGIN } from '../shared/api-url';

@Injectable({
  providedIn: 'root',
})
export class AcompanhamentoService {
  private readonly http = inject(HttpClient);

  criar(adocaoId: number, dados: AcompanhamentoCadastro): Observable<void> {
    const formulario = new FormData();
    for (const media of dados.medias) {
      formulario.append('medias', media);
    }

    formulario.append(
      'data',
      JSON.stringify({
        periodDays: dados.periodDays,
        animalWithAdopter: dados.animalWithAdopter,
        animalHealthy: dados.animalHealthy,
        animalReturned: dados.animalReturned,
        animalNotFound: dados.animalNotFound,
        methods: dados.methods,
        notes: dados.notes,
      }),
    );

    return this.http.post<void>(`${API_URL}/adocoes/${adocaoId}/acompanhamentos`, formulario);
  }

  listarPorCpf(cpf: string): Observable<AcompanhamentoPorAdocao[]> {
    const params = new HttpParams().set('cpf', cpf);
    return this.http
      .get<AcompanhamentoPorCpfResponse>(`${API_URL}/acompanhamentos`, { params })
      .pipe(
        map(({ acompanhamentos }) => {
          const porAdocao = new Map<number, AcompanhamentoPorAdocao>();

          for (const { adocao, acompanhamento } of acompanhamentos) {
            let registro = porAdocao.get(adocao.id);
            if (!registro) {
              registro = { adocao, acompanhamentos: [] };
              porAdocao.set(adocao.id, registro);
            }
            registro.acompanhamentos.push(acompanhamento);
          }

          return Array.from(porAdocao.values());
        }),
      );
  }

  baixarMidia(downloadUrl: string): Observable<Blob> {
    const url = new URL(downloadUrl, BACKEND_ORIGIN);
    if (url.origin !== BACKEND_ORIGIN) {
      return throwError(() => new Error('A URL da mídia não pertence ao backend configurado.'));
    }

    return this.http.get(`${API_URL}${url.pathname}${url.search}`, { responseType: 'blob' });
  }
}
