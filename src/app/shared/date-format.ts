export type ApiDateValue = string | number[];

export function formatarDataApi(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não informado';
  }

  if (typeof valor === 'string') {
    const partes = valor.split(',').map((parte) => parte.trim());
    if (partes.every((parte) => /^\d+$/.test(parte))) {
      const dataSerializada = formatarPartes(partes.map(Number));
      if (dataSerializada) {
        return dataSerializada;
      }
    }

    const somenteData = /^\d{4}-\d{2}-\d{2}$/.test(valor);
    const dataFormatada = new Date(somenteData ? `${valor}T00:00:00` : valor);
    if (Number.isNaN(dataFormatada.getTime())) {
      return valor;
    }

    return somenteData
      ? dataFormatada.toLocaleDateString('pt-BR')
      : dataFormatada.toLocaleString('pt-BR');
  }

  if (Array.isArray(valor) && valor.every((parte) => typeof parte === 'number')) {
    return formatarPartes(valor) ?? valor.join(',');
  }

  return String(valor);
}

function formatarPartes(partes: number[]): string | null {
  if (partes.length !== 3 && partes.length !== 6 && partes.length !== 7) {
    return null;
  }

  const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0, nanos = 0] = partes;
  if (!partes.every(Number.isInteger) || mes < 1 || mes > 12 || nanos < 0 || nanos > 999_999_999) {
    return null;
  }

  const data = new Date(ano, mes - 1, dia, hora, minuto, segundo, Math.floor(nanos / 1_000_000));
  if (
    Number.isNaN(data.getTime()) ||
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia ||
    data.getHours() !== hora ||
    data.getMinutes() !== minuto ||
    data.getSeconds() !== segundo
  ) {
    return null;
  }

  return partes.length === 3 ? data.toLocaleDateString('pt-BR') : data.toLocaleString('pt-BR');
}
