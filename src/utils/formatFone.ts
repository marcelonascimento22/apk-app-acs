const formatFone = (fone: string | undefined) => {
  if (!fone) return '-';

  const clean = fone.replace(/\D/g, '');

  // Telefone vazio
  if (clean.length === 0) return '';

  if (clean.length === 8) {
    return `(91) 9 ${clean.slice(0, 4)}-${clean.slice(4)}`;
  }

  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }

  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
};

export default formatFone;