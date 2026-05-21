const formatSUS = (sus?: string) => {
  sus = String(sus);
  if (!sus) return '-';
  
  sus = String(sus).replace(/\D/g, '');

  if (sus.length !== 15) return sus;

  return `${sus.slice(0, 3)} ${sus.slice(3, 7)} ${sus.slice(7, 11)} ${sus.slice(11)}`;
};

export default formatSUS;