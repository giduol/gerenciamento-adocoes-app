import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AcompanhamentoService } from '../acompanhamento-service';
import { RelatorioAcompanhamentos } from './relatorio-acompanhamentos';

describe('RelatorioAcompanhamentos', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioAcompanhamentos],
      providers: [provideRouter([]), { provide: AcompanhamentoService, useValue: {} }],
    }).compileComponents();
  });

  it('formata a data serializada pelo backend como componentes locais', () => {
    const fixture = TestBed.createComponent(RelatorioAcompanhamentos);

    const data = fixture.componentInstance.formatarData('2026,11,10,18,19,51,147967000');

    expect(data).toContain('10/11/2026');
    expect(data).toContain('18:19:51');
    fixture.destroy();
  });

  it('continua formatando datas ISO', () => {
    const fixture = TestBed.createComponent(RelatorioAcompanhamentos);

    const data = fixture.componentInstance.formatarData('2026-11-10T18:19:51');

    expect(data).toContain('10/11/2026');
    expect(data).toContain('18:19:51');
    fixture.destroy();
  });
});
