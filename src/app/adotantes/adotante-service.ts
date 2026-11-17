import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdotanteDetails, AdotanteForm } from './dados-adotante';
import { API_URL } from '../shared/api-url';

@Injectable({
  providedIn: 'root',
})
export class AdotanteService {
  private readonly http = inject(HttpClient);

  listar(): Observable<AdotanteDetails[]> {
    return this.http.get<AdotanteDetails[]>(`${API_URL}/adotantes`);
  }

  criar(dados: AdotanteForm): Observable<void> {
    const payload: AdotanteForm = {
      name: dados.name,
      cpf: dados.cpf,
      address: dados.address,
      email: dados.email,
      phone: dados.phone,
    };

    return this.http.post<void>(`${API_URL}/adotantes`, payload);
  }
}
