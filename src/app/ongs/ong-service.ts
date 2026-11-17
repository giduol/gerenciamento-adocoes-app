import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OngForm, OngDetails } from './dados-ong';
import { Observable } from 'rxjs';
import { API_URL } from '../shared/api-url';

@Injectable({
  providedIn: 'root',
})
export class OngService {
  private readonly http = inject(HttpClient);

  listar(): Observable<OngDetails[]> {
    return this.http.get<OngDetails[]>(`${API_URL}/ongs`);
  }

  criar(dados: OngForm): Observable<OngDetails> {
    const url = `${API_URL}/ongs`;
    const payload: OngForm = {
      name: dados.name,
      cnpj: dados.cnpj,
      email: dados.email,
      contact: dados.contact,
      phone: dados.phone,
    };

    return this.http.post<OngDetails>(url, payload);
  }

  atualizar(id: number, dados: OngForm): Observable<void> {
    const url = `${API_URL}/ongs/${id}`;
    const payload: OngForm = {
      name: dados.name,
      cnpj: dados.cnpj,
      email: dados.email,
      contact: dados.contact,
      phone: dados.phone,
    };

    return this.http.put<void>(url, payload);
  }
}
