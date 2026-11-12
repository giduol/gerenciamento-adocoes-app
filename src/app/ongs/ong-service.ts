import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OngForm, OngDetails } from './dados-ong';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OngService {
  private readonly http = inject(HttpClient);

  criar(dados: OngForm): Observable<OngDetails> {
    const url = 'http://localhost:8080/ongs';
    const payload: OngForm = {
      name: dados.name,
      cnpj: dados.cnpj,
      email: dados.email,
      contact: dados.contact,
      phone: dados.phone,
    };

    return this.http.post<OngDetails>(url, payload);
  }
}
