const formatCPF = (cpf: string | undefined) => {
  if (!cpf || cpf.length !== 11) return cpf || '-';
  //return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  return `${cpf.slice(0, 3)}.***.***-${cpf.slice(9)}`;
};

export default formatCPF;