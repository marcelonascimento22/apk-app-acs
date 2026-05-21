import { useState, useEffect } from "react";

type Zona = {
  id: number;
  nome: string;
  descricao?: string;
  acsId?: number;
};

type Acs = {
  id: number;
  nome: string;
};

type Props = {
  open: boolean;
  zona: Zona | null;
  acsList: Acs[];
  modo: "editar" | "criar";
  onClose: () => void;
  onSave: (data: { nome: string; descricao: string; acsId: number }) => void;
};

export default function DialogEditarZona({
  open,
  zona,
  acsList,
  modo,
  onClose,
  onSave
}: Props) {

  ////console.log("Renderizou DialogEditarZona", { open, zona, modo });

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [acs, setAcs] = useState<number | "">("");

  const handleSave = () => {
    //console.log("3 - CLICOU SALVAR");

    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    if (acs === "") {
      alert("Selecione um ACS");
      return;
    }
      //console.log('nome', nome);
      //console.log('descricao', descricao);
      //console.log('acsId: ac',  acs);

    onSave({
      nome,
      descricao,
      acsId: acs as number
    });
  };


  useEffect(() => {
    if (!open) return;

    if (modo === "editar" && zona) {
      setNome(zona.nome || "");
      setDescricao(zona.descricao || "");

      const idParaSetar = zona.acsId ? Number(zona.acsId) : "";
      setAcs(idParaSetar);

      //console.log("ID do ACS carregado no Modal:", idParaSetar);
    }

    if (modo === "criar") {
      setNome("");
      setDescricao("");
      setAcs("");
    }

  }, [zona, open, modo]);


  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>

        <h2>
          {modo === "criar" ? "Nova Zona" : "Editar Zona"}
        </h2>

        <label>Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={input}
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={input}
        />


        <label>ACS</label>

        <select
          value={acs}
          onChange={(e) => {
            const value = e.target.value;
            setAcs(value === "" ? "" : Number(value));
          }}
          style={input}
        >

          <option value="">Selecione</option>
          {acsList?.map((acsItem) => (

            <option key={acsItem.id} value={acsItem.id}>
              {acsItem.id} - {acsItem.nome}
            </option>
          ))}

        </select>

        <div style={{ marginTop: 20 }}>

          <button
            onClick={handleSave}
            disabled={!nome || acs === ""}
            style={{
              ...btnSalvar,
              opacity: !nome || acs === "" ? 0.5 : 1,
              cursor: !nome || acs === "" ? "not-allowed" : "pointer"
            }}
          >
            Salvar
          </button>

          <button
            onClick={onClose}
            style={btnCancelar}
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 350,
  display: "flex",
  flexDirection: "column" as const,
  gap: 10
};

const input = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const btnSalvar = {
  background: "#22c55e",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 10
};

const btnCancelar = {
  background: "#ef4444",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};