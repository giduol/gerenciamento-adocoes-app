import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdotanteForm } from './dados-adotante';

@Injectable({
  providedIn: 'root',
})
export class AdotanteService {
  private readonly http = inject(HttpClient);

  criar(dados: AdotanteForm): Observable<void> {
    const payload: AdotanteForm = {
      name: dados.name,
      cpf: dados.cpf,
      address: dados.address,
      email: dados.email,
      phone: dados.phone,
    };

    return this.http.post<void>('http://localhost:8080/adotantes', payload);
  }
}
