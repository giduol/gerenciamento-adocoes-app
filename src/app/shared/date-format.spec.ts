import { formatarDataApi } from './date-format';

describe('formatarDataApi', () => {
  it('formats LocalDate arrays used by birth dates', () => {
    expect(formatarDataApi([2022, 1, 19])).toContain('19/01/2022');
  });

  it('formats LocalDateTime arrays used by registration dates', () => {
    const data = formatarDataApi([2026, 11, 10, 13, 9, 55, 434061000]);

    expect(data).toContain('10/11/2026');
    expect(data).toContain('13:09:55');
  });

  it('formats comma-separated date components and ISO dates', () => {
    expect(formatarDataApi('2026,11,10,18,19,51,147967000')).toContain('10/11/2026');
    expect(formatarDataApi('2026-11-10')).toContain('10/11/2026');
  });
});
