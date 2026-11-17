import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimalDetails, AnimalForm } from './dados-animal';
import { API_URL } from '../shared/api-url';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private readonly http = inject(HttpClient);

  listar(): Observable<AnimalDetails[]> {
    return this.http.get<AnimalDetails[]>(`${API_URL}/animais`);
  }

  criar(dados: AnimalForm): Observable<void> {
    const payload: AnimalForm = {
      name: dados.name,
      species: dados.species,
      birthDate: dados.birthDate,
      breed: dados.breed,
      specialCharacteristics: dados.specialCharacteristics,
      knownDiseases: dados.knownDiseases,
    };

    return this.http.post<void>(`${API_URL}/animais`, payload);
  }
}
