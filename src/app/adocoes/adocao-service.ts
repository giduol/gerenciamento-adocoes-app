import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdocaoForm, AdocaoRelatorio } from './dados-adocao';
import { API_URL } from '../shared/api-url';

@Injectable({
  providedIn: 'root',
})
export class AdocaoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<AdocaoRelatorio[]> {
    return this.http.get<AdocaoRelatorio[]>(`${API_URL}/adocoes`);
  }

  criar(dados: AdocaoForm): Observable<void> {
    const formulario = new FormData();
    formulario.append('document', dados.document);
    formulario.append('data', JSON.stringify({
      ongId: dados.ongId,
      animalId: dados.animalId,
      adotanteId: dados.adotanteId,
      status: dados.status,
    }));

    return this.http.post<void>(`${API_URL}/adocoes`, formulario);
  }
}
