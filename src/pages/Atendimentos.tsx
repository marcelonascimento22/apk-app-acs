import Agenda from "./atendimento/Agenda";
import InfoAgendasCriadas from "./atendimento/InfoAgendasCriadas";


const Atendimento = () => {


    
   
    return (
        <>
        <div>
            <h1>Atendimentos</h1>
            <p>Criar Horários de Atendimento.</p>


        </div>

        <Agenda/>

        <InfoAgendasCriadas/> 



        </>
    );
}

export default Atendimento;