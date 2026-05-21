const formatDate = (date?: string) => {
  if (!date) return "-";

  try {
    let parsedDate: Date;

    // 🔹 Caso venha só "2026-04-14" (sem timezone)
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split("-").map(Number);
      parsedDate = new Date(y, m - 1, d); //LOCAL (corrige bug de fuso)
    } else {
      //Caso venha com timezone (ISO)
      parsedDate = new Date(date);
    }

    return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
  } catch (err) {
    console.error("Erro ao formatar data:", err);
    return "-";
  }
};

export default formatDate;