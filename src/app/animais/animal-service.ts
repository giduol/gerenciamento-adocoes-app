import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimalForm } from './dados-animal';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private readonly http = inject(HttpClient);

  criar(dados: AnimalForm): Observable<void> {
    const payload: AnimalForm = {
      name: dados.name,
      species: dados.species,
      birthDate: dados.birthDate,
      breed: dados.breed,
      specialCharacteristics: dados.specialCharacteristics,
      knownDiseases: dados.knownDiseases,
    };

    return this.http.post<void>('http://localhost:8080/animais', payload);
  }
}
