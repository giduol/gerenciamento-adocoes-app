import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AcompanhamentoService } from '../acompanhamento-service';
import { CadastroAcompanhamento } from './cadastro-acompanhamento';

describe('CadastroAcompanhamento', () => {
  it('preenche o ID da adoção recebido pela rota', async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAcompanhamento],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ adocaoId: '13' })) },
        },
        { provide: AcompanhamentoService, useValue: {} },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CadastroAcompanhamento);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.adocaoId.value).toBe(13);
  });
});
