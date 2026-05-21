import { useState } from "react"
import ModalEditFamilia from "../components/ModalEditFamilia"
import { useFamilia } from "../hooks/useFamilia"
import calculateAge from "../utils/calculateAge"
import type { Familia } from "../types/familia"
import { Link } from "react-router-dom"
import type { Pessoa } from "../types/pessoa"



const Familias = () => {

    const { data: familias } = useFamilia()

    const [openFamilia, setOpenFamilia] = useState(false);

    const [familiaSelecionada, setFamiliaSelecionada] = useState<Familia | null>(null);

    const handleNovaFamilia = () => {
        setFamiliaSelecionada(null); 
        setOpenFamilia(true);
    };

    const handleEditarFamilia = (familia: Familia) => {
        setFamiliaSelecionada(familia);
        setOpenFamilia(true);
    };


    return (
    <div className="flex flex-col gap-4 px-2 sm:px-4">
        <button
            type="button"
            onClick={handleNovaFamilia}
            className="text-sm text-green-600 hover:underline font-medium"
            >
            + Criar Novo
        </button>
        {familias?.map((f: Familia) => (
        <div key={f.id} className="w-full">

            <div className="mt-2 bg-green-600/60 rounded-lg p-3 sm:p-4 text-white">

            <h2 className="text-xl sm:text-2xl font-bold text-center">
                Família {f.id} - {f.descricao || 'Sem descrição'}
            </h2>

            <button
                type="button"
                onClick={() => handleEditarFamilia(f)}
                className="text-sm text-green-600 hover:underline font-medium"
                >
                Editar Endereço
            </button>

            <p className="font-semibold mt-2">Endereço</p>
            <p className="text-sm sm:text-base">
                {f.endereco}, {f.numero} <br />
                {f.bairro} - Anajás/PA
            </p>

            {/* ================= MOBILE (CARDS) ================= */}
            <div className="mt-4 flex flex-col gap-3 sm:hidden">
                {f.pessoas?.map((p: Pessoa) => (
                <div
                    key={p.id}
                    className="bg-white text-gray-800 rounded-lg p-3 shadow-md"
                >
                    <p className="font-semibold text-base">
                    {p.nome || 'Nome não disponível'}
                    </p>

                    <p className="text-sm">
                    <span className="font-medium">Idade: </span>
                    {calculateAge(String(p.dataNascimento)) > 1
                        ? `${calculateAge(String(p.dataNascimento))} anos`
                        : `${calculateAge(String(p.dataNascimento))} ano`}
                    </p>

                    <p className="text-sm">
                    <span className="font-medium">Sexo: </span>
                    {p.sexo === 'M'
                        ? 'Masculino'
                        : p.sexo === 'F'
                        ? 'Feminino'
                        : 'Não informado'}
                    </p>

                    <a
                    href={`/pessoa/${p.id}`}
                    className="mt-2 inline-block text-purple-700 font-semibold text-sm"
                    >
                    Ver detalhes →
                    </a>
                </div>
                ))}
            </div>

            {/* ================= DESKTOP (TABELA) ================= */}
            <div className="hidden sm:block mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] rounded-lg bg-white divide-y divide-gray-300 text-gray-800">
                
                <thead className="bg-gray-900">
                    <tr className="text-white text-left text-sm">
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Idade</th>
                    <th className="px-6 py-3 text-center">Sexo</th>
                    <th className="px-6 py-3 text-center">Detalhes</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {f.pessoas?.map((p: Pessoa) => (
                    <tr key={p.id} className="hover:bg-gray-100 transition">
                        
                        <td className="px-6 py-3">
                        {p.nome || 'Nome não disponível'}
                        </td>

                        <td className="px-6 py-3">
                        {calculateAge(String(p.dataNascimento)) > 1
                            ? `${calculateAge(String(p.dataNascimento))} anos`
                            : `${calculateAge(String(p.dataNascimento))} ano`}
                        </td>

                        <td className="px-6 py-3 text-center">
                        {p.sexo === 'M'
                            ? 'Masculino'
                            : p.sexo === 'F'
                            ? 'Feminino'
                            : 'Não informado'}
                        </td>

                        <td className="px-6 py-3 text-center">
                            <Link to={`/pessoa/${p.id}`} className="text-purple-800 hover:underline">
                                Ver detalhes →
                            </Link>
                        </td>

                    </tr>
                    ))}
                </tbody>

                </table>
            </div>

            </div>
        </div>
        ))}
        {/* 🧩 MODAL DE FAMÍLIA */}
        {openFamilia && (
        <ModalEditFamilia

            key={familiaSelecionada?.id ?? 'nova'}
            familia={familiaSelecionada ?? undefined}
            
            onClose={() => {
            setOpenFamilia(false);
            setFamiliaSelecionada(null);
            }}
            onSave={(familiaAtualizada: Familia) => {
            if (!familiaAtualizada.id) {
                console.error("Família sem ID");
                return;
            }

            setFamiliaSelecionada(familiaAtualizada);
            setOpenFamilia(false);
            }}
        />
        )}
    </div>
    )
   
}

export default Familias