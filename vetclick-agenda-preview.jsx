import { useState } from "react";

const V="#2D6A4F",VL="#74C69D",LA="#F4A261",AZ="#3A86FF",AM="#FFB703",VM="#E63946";

const tutores=[
  {id:1,nome:"Ana Paula Ferreira",whats:"(11) 99999-1111",cpf:"123.456.789-00",
    email:"ana.paula@email.com",nasc:"14/06/1988",sexo:"Feminino",
    endereco:"Rua das Flores, 142 — Vila Madalena, São Paulo/SP",
    cep:"05435-000",obs:"Prefere contato por WhatsApp. Muito cuidadosa com os pets.",
    desde:"Janeiro 2024",totalAtend:5,
    conta:{saldo:-60,pagamentos:[
      {data:"10/03",desc:"Consulta Bolt",val:120,st:"pago"},
      {data:"08/03",desc:"Retorno Luna",val:60,st:"pendente"},
    ]},
    termos:["lgpd"],
    animais:[
      {id:1,nome:"Bolt",especie:"Cão",ei:"🐕",sexo:"Macho",idade:"3",raca:"Golden Retriever",peso:"12.5",restricao:"Alérgico a dipirona",
        exames:[
          {id:1,tipo:"Hemograma",data:"12/01/2026",obs:"Leucocitose leve",arquivo:"hemograma_bolt_jan26.pdf",icon:"🩸"},
          {id:2,tipo:"Bioquímica",data:"12/01/2026",obs:"ALT levemente elevada",arquivo:"bioquimica_bolt_jan26.pdf",icon:"🧪"},
          {id:3,tipo:"Raio-X",data:"05/11/2025",obs:"Sem alterações",arquivo:"rx_bolt_nov25.jpg",icon:"🫁"},
        ]},
      {id:2,nome:"Luna",especie:"Gato",ei:"🐈",sexo:"Fêmea",idade:"1",raca:"SRD",peso:"3.8",restricao:"",exames:[]},
    ]},
  {id:2,nome:"Ricardo Souza",whats:"(11) 99999-2222",cpf:"987.654.321-00",
    email:"ricardo.s@gmail.com",nasc:"03/11/1975",sexo:"Masculino",
    endereco:"Av. Paulista, 900 — Bela Vista, São Paulo/SP",
    cep:"01310-100",obs:"",
    desde:"Março 2025",totalAtend:2,
    conta:{saldo:0,pagamentos:[
      {data:"09/03",desc:"Vacinação Thor",val:80,st:"pago"},
    ]},
    termos:["lgpd","anestesia"],
    animais:[
      {id:3,nome:"Thor",especie:"Cão",ei:"🐕",sexo:"Macho",idade:"5",raca:"Rottweiler",peso:"42.0",restricao:"Morde em consulta",
        exames:[
          {id:4,tipo:"Ultrassom",data:"20/01/2026",obs:"Fígado aumentado",arquivo:"usg_thor_jan26.pdf",icon:"🔬"},
        ]},
    ]},
  {id:3,nome:"Fernanda Lima",whats:"(11) 99999-3333",cpf:"456.789.123-00",
    email:"fernanda.lima@hotmail.com",nasc:"22/03/1995",sexo:"Feminino",
    endereco:"Rua Oscar Freire, 55 — Jardins, São Paulo/SP",
    cep:"01426-001",obs:"Mora sozinha. Mia é muito ansiosa em consultas.",
    desde:"Outubro 2025",totalAtend:1,
    conta:{saldo:0,pagamentos:[
      {data:"08/03",desc:"Consulta Mia",val:90,st:"pago"},
    ]},
    termos:[],
    animais:[
      {id:4,nome:"Mia",especie:"Gato",ei:"🐈",sexo:"Fêmea",idade:"2",raca:"Persa",peso:"3.2",restricao:"",exames:[]},
    ]},
];

const ags=[
  {id:1,tutor:"Ana Paula",animal:"Bolt",servico:"Consulta",horario:"08:00",ei:"🐕"},
  {id:2,tutor:"Ricardo Souza",animal:"Thor",servico:"Vacinação",horario:"10:00",ei:"🐕"},
  {id:3,tutor:"Fernanda Lima",animal:"Mia",servico:"Retorno",horario:"14:00",ei:"🐈"},
];

const vacinas=[
  {animal:"Bolt",tutor:"Ana Paula",vacina:"V8",venc:"15/03/2026",st:"vencendo"},
  {animal:"Thor",tutor:"Ricardo Souza",vacina:"Antirrábica",venc:"01/02/2026",st:"vencida"},
  {animal:"Mia",tutor:"Fernanda Lima",vacina:"Tríplice Felina",venc:"10/06/2026",st:"ok"},
];

const meses=[{m:"Out",v:1800},{m:"Nov",v:2200},{m:"Dez",v:1950},{m:"Jan",v:2600},{m:"Fev",v:2400},{m:"Mar",v:2840}];

const svcs=[
  {nome:"Consulta clínica",valor:120},
  {nome:"Retorno",valor:60},
  {nome:"Vacina V8",valor:80},
  {nome:"Vacina Antirrábica",valor:70},
  {nome:"Aplicação medicamento",valor:40},
  {nome:"Exame físico completo",valor:150},
];

const navs=[
  {id:"dashboard",icon:"🏠",label:"Dashboard"},
  {id:"solicitacoes",icon:"🔔",label:"Solicitações"},
  {id:"agenda",icon:"📅",label:"Agenda"},
  {id:"tutores",icon:"🗂️",label:"Tutores"},
  {id:"consulta",icon:"🩺",label:"Consulta"},
  {id:"vacinas",icon:"💉",label:"Vacinas"},
  {id:"financeiro",icon:"💰",label:"Financeiro"},
  {id:"perfil",icon:"⚙️",label:"Perfil"},
];

const csMap={"Consulta":V,"Vacinação":AZ,"Retorno":AM};

const TERMOS={
  anestesia:{label:"Termo de Anestesia",icon:"💉",texto:`TERMO DE CONSENTIMENTO — ANESTESIA\n\nEu, [TUTOR], responsável pelo animal [ANIMAL], autorizo o procedimento anestésico indicado pelo Dr. Carlos Mendes (CRMV-SP 45231), estando ciente dos riscos inerentes ao procedimento, incluindo reações adversas e complicações anestésicas.\n\nDeclaro ter sido informado(a) sobre:\n• Tipo de anestesia a ser utilizada\n• Riscos e benefícios do procedimento\n• Cuidados pré e pós-anestésicos necessários\n\nData: [DATA]`},
  cirurgia:{label:"Autorização Cirúrgica",icon:"🔪",texto:`AUTORIZAÇÃO PARA PROCEDIMENTO CIRÚRGICO\n\nEu, [TUTOR], responsável pelo animal [ANIMAL], autorizo a realização do procedimento cirúrgico indicado pelo Dr. Carlos Mendes (CRMV-SP 45231).\n\nDeclaro estar ciente de:\n• Natureza e finalidade do procedimento\n• Riscos e possíveis complicações\n• Necessidade de internação e pós-operatório\n• Estimativa de custos apresentada\n\nData: [DATA]`},
  internacao:{label:"Termo de Internação",icon:"🏥",texto:`TERMO DE AUTORIZAÇÃO DE INTERNAÇÃO\n\nEu, [TUTOR], responsável pelo animal [ANIMAL], autorizo a internação sob cuidados do Dr. Carlos Mendes (CRMV-SP 45231).\n\nCompreendo que:\n• O animal receberá monitoramento e cuidados necessários\n• Serei contatado em caso de alteração do quadro clínico\n• Os custos diários serão informados previamente\n• Posso visitar o animal em horários acordados\n\nData: [DATA]`},
  procedimento:{label:"Autorização de Procedimento",icon:"📋",texto:`AUTORIZAÇÃO DE PROCEDIMENTO VETERINÁRIO\n\nEu, [TUTOR], responsável pelo animal [ANIMAL], autorizo a realização do procedimento indicado pelo Dr. Carlos Mendes (CRMV-SP 45231), declarando estar ciente dos riscos e benefícios envolvidos e que todas as dúvidas foram esclarecidas.\n\nData: [DATA]`},
  lgpd:{label:"Termo LGPD",icon:"🔒",texto:`AUTORIZAÇÃO DE USO DE DADOS — LGPD\n\nEu, [TUTOR], autorizo o armazenamento e uso dos meus dados pessoais e do animal [ANIMAL] pelo Dr. Carlos Mendes (CRMV-SP 45231), exclusivamente para fins de atendimento veterinário, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).\n\nOs dados poderão ser usados para:\n• Prontuário e histórico clínico\n• Envio de lembretes de vacinas e retornos\n• Emissão de receituários e documentos\n\nDados não serão compartilhados com terceiros sem consentimento.\n\nData: [DATA]`},
};

const historico=[
  {data:"12/01/2026",tipo:"Consulta",peso:12.3,queixa:"Coceira intensa no focinho e patas",diag:"Dermatite alérgica",prescricao:"Apoquel 16mg 1x/dia por 10 dias"},
  {data:"05/11/2025",tipo:"Vacinação",peso:12.0,queixa:"—",diag:"V8 + Antirrábica",prescricao:"—"},
  {data:"20/08/2025",tipo:"Consulta",peso:11.5,queixa:"Vômito 2x no dia",diag:"Gastrite aguda",prescricao:"Omeprazol 10mg 5 dias + dieta"},
];

const medicamentos=[
  {nome:"Amoxicilina 250mg",grupo:"Antibiótico"},
  {nome:"Amoxicilina 500mg",grupo:"Antibiótico"},
  {nome:"Apoquel 16mg",grupo:"Antialérgico"},
  {nome:"Apoquel 5.4mg",grupo:"Antialérgico"},
  {nome:"Dipirona 500mg/mL",grupo:"Analgésico"},
  {nome:"Doxiciclina 100mg",grupo:"Antibiótico"},
  {nome:"Metronidazol 250mg",grupo:"Antibiótico"},
  {nome:"Omeprazol 10mg",grupo:"Gastro"},
  {nome:"Prednisolona 5mg",grupo:"Corticoide"},
  {nome:"Tramadol 50mg",grupo:"Analgésico"},
];

const vacinasCao=[
  {nome:"V8 (Óctupla)",desc:"Parvo, Cinomose, Hepatite, Leptospirose e mais",periodo:"Anual"},
  {nome:"V10 (Déctupla)",desc:"V8 + Leptospirose L3/L4",periodo:"Anual"},
  {nome:"Antirrábica",desc:"Raiva",periodo:"Anual"},
  {nome:"Gripe Canina",desc:"Tosse dos canis (Bordetella)",periodo:"Anual"},
  {nome:"Giárdia",desc:"Giardia duodenalis",periodo:"Anual"},
  {nome:"Leishmaniose",desc:"Leishmania infantum (3 doses)",periodo:"Anual"},
];

const vacinasGato=[
  {nome:"Tríplice Felina V3",desc:"Rinotraqueíte, Calicivírus, Panleucopenia",periodo:"Anual"},
  {nome:"Quádrupla Felina V4",desc:"V3 + Clamidofilose",periodo:"Anual"},
  {nome:"Antirrábica Felina",desc:"Raiva",periodo:"Anual"},
  {nome:"FeLV",desc:"Leucemia viral felina",periodo:"Anual"},
  {nome:"FIV + FeLV combo",desc:"Imunodeficiência + Leucemia",periodo:"Anual"},
];

function Card({children,style}){
  return <div style={{background:"#fff",borderRadius:16,padding:20,border:"1px solid #E8EDE8",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",...style}}>{children}</div>;
}

function Chip({children,cor}){
  return <span style={{background:cor+"22",color:cor,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:600,display:"inline-block"}}>{children}</span>;
}

function FormAnimal({tutorNome,onSalvar,onCancelar}){
  const [nome,setNome]=useState("");
  const [esp,setEsp]=useState("");
  const [sexo,setSexo]=useState("");
  const [idade,setIdade]=useState("");
  const [rest,setRest]=useState("");
  return(
    <div style={{background:"#F8FBF8",border:`1px solid ${V}44`,borderRadius:12,padding:16,marginTop:10}}>
      <div style={{fontSize:13,fontWeight:700,color:V,marginBottom:12}}>🐾 Novo animal — {tutorNome}</div>
      <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome do animal"
        style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {[{l:"🐕 Cão",v:"Cão"},{l:"🐈 Gato",v:"Gato"},{l:"🐾 Outro",v:"Outro"}].map(e=>(
          <button key={e.v} onClick={()=>setEsp(e.v)} style={{flex:1,padding:"8px 4px",borderRadius:9,border:`2px solid ${esp===e.v?V:"#E8EDE8"}`,background:esp===e.v?V+"12":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:esp===e.v?700:400,color:esp===e.v?V:"#555"}}>{e.l}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div style={{display:"flex",gap:6}}>
          {["Macho","Fêmea"].map(s=>(
            <button key={s} onClick={()=>setSexo(s)} style={{flex:1,padding:"8px 4px",borderRadius:9,border:`2px solid ${sexo===s?V:"#E8EDE8"}`,background:sexo===s?V+"12":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:sexo===s?700:400,color:sexo===s?V:"#555"}}>{s}</button>
          ))}
        </div>
        <input value={idade} onChange={e=>setIdade(e.target.value)} placeholder="Idade (anos)" type="number"
          style={{padding:"9px 10px",borderRadius:9,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",outline:"none"}}/>
      </div>
      <input value={rest} onChange={e=>setRest(e.target.value)} placeholder="Restrições (opcional)"
        style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:12}}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancelar} style={{flex:1,background:"#F0F4F0",color:"#555",border:"none",borderRadius:10,padding:"10px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
        <button onClick={()=>{
          if(!nome||!esp) return;
          onSalvar({nome,especie:esp,ei:esp==="Cão"?"🐕":esp==="Gato"?"🐈":"🐾",sexo,idade,restricao:rest});
        }} style={{flex:2,background:V,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Próximo →</button>
      </div>
    </div>
  );
}

export default function App(){
  const [sec,setSec]=useState("dashboard");
  const [sb,setSb]=useState(true);
  const [dr,setDr]=useState(false);
  const [sols,setSols]=useState([
    {id:1,tutor:"Juliana Ramos",animal:"Pipoca",ei:"🐈",servico:"Consulta",horario:"09:00",obs:"Vomitando desde ontem à noite",foto:true},
    {id:2,tutor:"Bruno Castro",animal:"Rex",ei:"🐕",servico:"Vacinação",horario:"15:00",obs:"",foto:false},
  ]);
  const [itens,setItens]=useState([]);
  const [toast,setToast]=useState("");
  const [lc,setLc]=useState(false);
  const [peso,setPeso]=useState("");
  const [queixa,setQueixa]=useState("");
  const [diag,setDiag]=useState("");
  const [abaC,setAbaC]=useState("prontuario");
  const [buscaMed,setBuscaMed]=useState("");
  const [prescricoes,setPrescricoes]=useState([]);
  const [medSel,setMedSel]=useState(null);
  const [medDose,setMedDose]=useState("");
  const [medFreq,setMedFreq]=useState("");
  const [medDur,setMedDur]=useState("");
  const [medObsP,setMedObsP]=useState("");
  const [tipoAtend,setTipoAtend]=useState("Consulta");
  const [vacsApl,setVacsApl]=useState([]);
  const [pac,setPac]=useState(null);
  const [modalFin,setModalFin]=useState(false);
  const [pgto,setPgto]=useState("pix");
  const [lancsDin,setLancsDin]=useState([
    {data:"10/03",tutor:"Ana Paula",animal:"Bolt",serv:"Consulta",val:120,st:"pago"},
    {data:"09/03",tutor:"Ricardo Souza",animal:"Thor",serv:"Vacinação",val:80,st:"pago"},
    {data:"08/03",tutor:"Fernanda Lima",animal:"Mia",serv:"Retorno",val:60,st:"pendente"},
  ]);
  const [modal,setModal]=useState(false);
  const [etapa,setEtapa]=useState(1);
  const [tSel,setTSel]=useState(null);
  const [ntNome,setNtNome]=useState("");
  const [ntWh,setNtWh]=useState("");
  const [novoAn,setNovoAn]=useState(false);
  const [anEt3,setAnEt3]=useState(null);
  const [tutEt3,setTutEt3]=useState("");
  const [buscaTutor,setBuscaTutor]=useState("");
  const [fichaAberta,setFichaAberta]=useState(null);
  const [abaFicha,setAbaFicha]=useState("animais");
  const [modalTermo,setModalTermo]=useState(null);
  const [termoAssinado,setTermoAssinado]=useState(false);
  const [tipoExameFiltro,setTipoExameFiltro]=useState("Todos");
  const [modalWpp,setModalWpp]=useState(false);
  const [telaAnimal,setTelaAnimal]=useState(null);
  const [abaAnimal,setAbaAnimal]=useState("resumo");
  const [telaTutor,setTelaTutor]=useState(null);
  const [abaTutor,setAbaTutor]=useState("dados");

  const st=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const addI=(i)=>setItens(p=>[...p,{...i,uid:Date.now()}]);
  const remI=(u)=>setItens(p=>p.filter(x=>x.uid!==u));
  const sub=itens.reduce((a,i)=>a+i.valor,0);
  const maxB=Math.max(...meses.map(m=>m.v));

  const abrirC=(tutor,animal,tipo="Consulta")=>{
    setPac({tutor,animal});
    setTipoAtend(tipo);
    setSec("consulta");setSb(false);setDr(false);
    setItens([]);setPeso("");setQueixa("");setDiag("");
    setAbaC("prontuario");setVacsApl([]);
    setPrescricoes([]);setMedSel(null);setBuscaMed("");
    setMedDose("");setMedFreq("");setMedDur("");setMedObsP("");
    setModal(false);setEtapa(1);setTSel(null);
    setNtNome("");setNtWh("");setNovoAn(false);
    setAnEt3(null);setTutEt3("");
  };

  const irSec=(id)=>{setSec(id);if(id!=="consulta")setSb(true);};
  const fecharM=()=>{setModal(false);setEtapa(1);setTSel(null);setNtNome("");setNtWh("");setNovoAn(false);setAnEt3(null);setTutEt3("");};
  const avancar=()=>{
    if(tSel){setEtapa(2);}
    else{if(!ntNome||!ntWh){st("⚠️ Preencha nome e WhatsApp.");return;}setEtapa(2);}
  };
  const irEt3=(tutor,animal)=>{setTutEt3(tutor);setAnEt3(animal);setEtapa(3);};

  const sw=sb?215:62;

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",display:"flex",height:"100vh",background:"#F0F4F0",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px}textarea,input{outline:none}button{transition:opacity 0.15s}button:hover{opacity:0.85}`}</style>

      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:"#1E1E1E",color:"#fff",padding:"12px 20px",borderRadius:12,fontSize:14,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,0.25)"}}>{toast}</div>}

      {/* ── MODAL FINALIZAR ── */}
      {modalFin&&pac&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:440,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.22)"}}>
            <div style={{background:V,borderRadius:"22px 22px 0 0",padding:"22px 24px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>✅ Finalizar Consulta</div>
                <button onClick={()=>setModalFin(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15,color:"#fff",fontFamily:"inherit"}}>✕</button>
              </div>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 14px",fontSize:13,color:"#fff"}}>
                <div style={{fontWeight:700}}>👤 {pac.tutor} · {pac.animal?.nome||pac.animal} {pac.animal?.ei||""}</div>
                {pac.animal?.restricao&&<div style={{fontSize:11,color:"#ffcccc",marginTop:3}}>⚠️ {pac.animal.restricao}</div>}
              </div>
            </div>
            <div style={{padding:"20px 24px"}}>
              {itens.length>0&&(
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:8}}>COBRANÇA</div>
                  <div style={{border:"1px solid #E8EDE8",borderRadius:12,overflow:"hidden"}}>
                    {itens.map((item,i)=>(
                      <div key={item.uid} style={{display:"flex",justifyContent:"space-between",padding:"9px 14px",borderBottom:i<itens.length-1?"1px solid #F0F4F0":"none",fontSize:13}}>
                        <span>{item.nome}</span><span style={{fontWeight:600}}>R$ {item.valor}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"11px 14px",background:"#F8FBF8",fontSize:14,fontWeight:700}}>
                      <span>Total</span><span style={{color:V}}>R$ {sub.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:10}}>FORMA DE PAGAMENTO</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[{val:"pix",icon:"⚡",label:"PIX"},{val:"dinheiro",icon:"💵",label:"Dinheiro"},{val:"cartao",icon:"💳",label:"Cartão"},{val:"pendente",icon:"⏳",label:"Pendente"}].map(p=>(
                    <button key={p.val} onClick={()=>setPgto(p.val)} style={{padding:"10px 6px",borderRadius:10,border:`2px solid ${pgto===p.val?V:"#E8EDE8"}`,background:pgto===p.val?V+"12":"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                      <div style={{fontSize:18,marginBottom:3}}>{p.icon}</div>
                      <div style={{fontSize:11,fontWeight:pgto===p.val?700:500,color:pgto===p.val?V:"#555"}}>{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:10}}>ENVIAR AO TUTOR</div>
                <div style={{display:"flex",gap:8}}>
                  {[{icon:"📄",label:"Receituário",dis:prescricoes.length===0},{icon:"📋",label:"Prontuário",dis:false},{icon:"💬",label:"WhatsApp",dis:false}].map((a,i)=>(
                    <button key={i} disabled={a.dis} onClick={()=>st(`${a.icon} ${a.label} enviado!`)} style={{flex:1,padding:"9px 6px",borderRadius:10,border:"1px solid #E8EDE8",background:a.dis?"#F8F8F8":"#fff",cursor:a.dis?"not-allowed":"pointer",fontFamily:"inherit",textAlign:"center",opacity:a.dis?0.4:1}}>
                      <div style={{fontSize:18,marginBottom:2}}>{a.icon}</div>
                      <div style={{fontSize:11,color:"#555",fontWeight:500}}>{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={()=>{
                const hoje=new Date();
                const d=`${String(hoje.getDate()).padStart(2,"0")}/${String(hoje.getMonth()+1).padStart(2,"0")}`;
                setLancsDin(prev=>[{data:d,tutor:pac.tutor,animal:pac.animal?.nome||String(pac.animal),serv:tipoAtend,val:sub||120,st:pgto==="pendente"?"pendente":"pago"},...prev]);
                setModalFin(false);
                st("✅ Consulta finalizada e lançada no financeiro!");
                setTimeout(()=>irSec("financeiro"),1600);
              }} style={{width:"100%",background:"#1E1E1E",color:"#fff",border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                ✅ Confirmar e lançar no financeiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL TERMO ── */}
      {modalTermo&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:500,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}}>
            {/* Header */}
            <div style={{background:V,borderRadius:"22px 22px 0 0",padding:"20px 24px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{modalTermo.termo.icon} {modalTermo.termo.label}</div>
                  <div style={{fontSize:12,color:VL,marginTop:3}}>
                    {modalTermo.tutor.nome} · {modalTermo.animal?.nome||"—"}
                  </div>
                </div>
                <button onClick={()=>{setModalTermo(null);setTermoAssinado(false);}} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15,color:"#fff",fontFamily:"inherit"}}>✕</button>
              </div>
            </div>

            <div style={{padding:"22px 24px"}}>
              {/* Texto do termo */}
              <div style={{background:"#F8FBF8",borderRadius:12,padding:16,marginBottom:20,border:"1px solid #E8EDE8"}}>
                <pre style={{fontSize:12,color:"#444",fontFamily:"inherit",whiteSpace:"pre-wrap",lineHeight:1.7,margin:0}}>
                  {modalTermo.termo.texto
                    .replace("[TUTOR]",modalTermo.tutor.nome)
                    .replace("[ANIMAL]",modalTermo.animal?.nome||"—")
                    .replace("[DATA]",new Date().toLocaleDateString("pt-BR"))}
                </pre>
              </div>

              {/* Status de assinatura */}
              {termoAssinado?(
                <div style={{background:"#E8F4ED",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10,border:`1px solid ${V}44`}}>
                  <span style={{fontSize:20}}>✅</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:V}}>Termo assinado digitalmente</div>
                    <div style={{fontSize:11,color:"#888",marginTop:1}}>Registrado em {new Date().toLocaleDateString("pt-BR")} · IP simulado</div>
                  </div>
                </div>
              ):(
                <div style={{background:"#FFF8E8",borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1px solid ${AM}44`}}>
                  <div style={{fontSize:12,color:"#888"}}>Ao clicar em <strong>"Confirmar assinatura"</strong>, o tutor reconhece ter lido e concordado com os termos acima. A assinatura será registrada com data, hora e IP.</div>
                </div>
              )}

              <div style={{display:"flex",gap:10}}>
                {!termoAssinado&&(
                  <button onClick={()=>{setTermoAssinado(true);st(`✅ Termo "${modalTermo.termo.label}" assinado!`);}}
                    style={{flex:2,background:V,color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    ✅ Confirmar assinatura
                  </button>
                )}
                <button onClick={()=>st("📄 PDF gerado!")}
                  style={{flex:1,background:"#F0F4F0",color:"#555",border:"none",borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  📄 Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:20,padding:26,width:"100%",maxWidth:460,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontSize:16,fontWeight:700}}>
                {etapa===1?"👤 Tutor":etapa===2?"🐾 Animal":"🔖 Tipo de atendimento"}
              </div>
              <button onClick={fecharM} style={{background:"#F0F4F0",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15,color:"#555",fontFamily:"inherit"}}>✕</button>
            </div>
            {/* Progress */}
            <div style={{display:"flex",gap:6,marginBottom:22}}>
              {[1,2,3].map(e=>(
                <div key={e} style={{flex:1,height:4,borderRadius:4,background:e<=etapa?V:"#E8EDE8"}}/>
              ))}
            </div>

            {/* ETAPA 1 — Tutor */}
            {etapa===1&&(
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:10}}>Tutores cadastrados</div>
                {tutores.map(t=>(
                  <button key={t.id} onClick={()=>{setTSel(t);setNtNome("");setNtWh("");}}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:7,background:tSel?.id===t.id?V+"12":"#F8F8F8",border:`1.5px solid ${tSel?.id===t.id?V:"#E8EDE8"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:VL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>👤</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#1E1E1E"}}>{t.nome}</div>
                      <div style={{fontSize:11,color:"#888"}}>{t.animais.map(a=>`${a.ei} ${a.nome}`).join(", ")}</div>
                    </div>
                    {tSel?.id===t.id&&<span style={{color:V,fontSize:18}}>✓</span>}
                  </button>
                ))}
                <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 12px"}}>
                  <div style={{flex:1,height:1,background:"#E8EDE8"}}/><span style={{fontSize:12,color:"#aaa"}}>ou novo tutor</span><div style={{flex:1,height:1,background:"#E8EDE8"}}/>
                </div>
                <input value={ntNome} onChange={e=>{setNtNome(e.target.value);setTSel(null);}} placeholder="Nome do tutor"
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",marginBottom:8}}/>
                <input value={ntWh} onChange={e=>{setNtWh(e.target.value);setTSel(null);}} placeholder="WhatsApp"
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",marginBottom:18}}/>
                <button onClick={avancar} style={{width:"100%",background:V,color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Próximo →</button>
              </div>
            )}

            {/* ETAPA 2 — Animal */}
            {etapa===2&&(
              <div>
                <div style={{background:"#E8F4ED",borderRadius:10,padding:"9px 14px",marginBottom:16,fontSize:13,color:V,fontWeight:500}}>
                  👤 <strong>{tSel?tSel.nome:ntNome}</strong>
                </div>
                {tSel?(
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:10}}>Selecionar animal</div>
                    {tSel.animais.map(a=>(
                      <button key={a.id} onClick={()=>irEt3(tSel.nome,a)}
                        style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:8,background:"#F8F8F8",border:"1.5px solid #E8EDE8",borderRadius:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                        <div style={{width:40,height:40,borderRadius:10,background:a.especie==="Cão"?V+"22":LA+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.ei}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:700,color:"#1E1E1E"}}>{a.nome}</div>
                          <div style={{fontSize:12,color:"#888",marginTop:1}}>{a.especie} · {a.sexo} · {a.idade} anos</div>
                          {a.restricao&&<div style={{fontSize:11,color:VM,fontWeight:600,marginTop:2}}>⚠️ {a.restricao}</div>}
                        </div>
                        <span style={{color:V,fontSize:18}}>→</span>
                      </button>
                    ))}
                    {!novoAn&&(
                      <button onClick={()=>setNovoAn(true)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",marginTop:4,background:"#fff",border:`2px dashed ${V}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:V}}>
                        ➕ Animal novo
                      </button>
                    )}
                    {novoAn&&<FormAnimal tutorNome={tSel.nome} onCancelar={()=>setNovoAn(false)} onSalvar={(a)=>irEt3(tSel.nome,a)}/>}
                  </div>
                ):(
                  <FormAnimal tutorNome={ntNome} onCancelar={()=>setEtapa(1)} onSalvar={(a)=>irEt3(ntNome,a)}/>
                )}
                <button onClick={()=>{setEtapa(1);setNovoAn(false);}} style={{background:"none",border:"none",color:"#888",fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:12}}>← Voltar</button>
              </div>
            )}

            {/* ETAPA 3 — Tipo de atendimento */}
            {etapa===3&&anEt3&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:12,background:"#F8F8F8",borderRadius:12,padding:"12px 14px",marginBottom:22}}>
                  <div style={{width:42,height:42,borderRadius:10,background:anEt3.especie==="Cão"?V+"22":LA+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{anEt3.ei||"🐾"}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700}}>{anEt3.nome}</div>
                    <div style={{fontSize:12,color:"#888"}}>{tutEt3} · {anEt3.especie||"—"} · {anEt3.sexo||"—"} · {anEt3.idade||"?"} anos</div>
                    {anEt3.restricao&&<div style={{fontSize:11,color:VM,fontWeight:600,marginTop:2}}>⚠️ {anEt3.restricao}</div>}
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#1E1E1E",marginBottom:14}}>O que será realizado?</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {[
                    {tipo:"Consulta",icon:"🩺",desc:"Exame clínico, queixa livre e diagnóstico",cor:V},
                    {tipo:"Vacina",icon:"💉",desc:`Lista de vacinas para ${anEt3.especie||"pet"}`,cor:AZ},
                    {tipo:"Retorno",icon:"🔁",desc:"Evolução da consulta anterior",cor:AM},
                  ].map(op=>(
                    <button key={op.tipo} onClick={()=>abrirC(tutEt3,anEt3,op.tipo)} style={{
                      display:"flex",alignItems:"center",gap:14,padding:"16px",
                      background:op.cor+"10",border:`2px solid ${op.cor}44`,
                      borderRadius:14,cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                    }}>
                      <div style={{width:46,height:46,borderRadius:12,background:op.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{op.icon}</div>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:"#1E1E1E"}}>{op.tipo}</div>
                        <div style={{fontSize:12,color:"#888",marginTop:2}}>{op.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={()=>{setEtapa(2);setNovoAn(false);}} style={{background:"none",border:"none",color:"#888",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← Voltar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL WHATSAPP ── */}
      {modalWpp&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:480,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.22)"}}>
            <div style={{background:"#25D366",borderRadius:"22px 22px 0 0",padding:"20px 24px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>💬 WhatsApp Automático</div>
                  <div style={{fontSize:12,color:"#d4f5e2",marginTop:3}}>Mensagens enviadas pelo VetClick</div>
                </div>
                <button onClick={()=>setModalWpp(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15,color:"#fff",fontFamily:"inherit"}}>✕</button>
              </div>
            </div>
            <div style={{padding:"20px 24px"}}>
              <div style={{background:"#F0FFF4",border:"1px solid #25D36633",borderRadius:12,padding:"12px 14px",marginBottom:18,fontSize:12,color:"#555"}}>
                ℹ️ As mensagens abaixo são enviadas automaticamente pelo sistema. Você pode ativar ou desativar cada uma individualmente.
              </div>
              {[
                {id:"confirmar",icon:"✅",label:"Confirmação de agendamento",desc:"Enviada quando uma solicitação é confirmada",ativo:true,
                  preview:`Olá [TUTOR]! 🐾 Confirmamos o agendamento de *[ANIMAL]* com o Dr. Carlos Mendes para *[DATA] às [HORA]*. Em caso de dúvidas, responda esta mensagem.`},
                {id:"lembrete",icon:"🔔",label:"Lembrete 1 dia antes",desc:"Enviada na véspera da consulta",ativo:true,
                  preview:`Oi [TUTOR]! Lembrando que amanhã temos o atendimento de *[ANIMAL]* às *[HORA]*. 🩺 Confirma presença?`},
                {id:"receituario",icon:"📄",label:"Receituário após consulta",desc:"Enviada ao finalizar a consulta com prescrição",ativo:false,
                  preview:`Olá [TUTOR]! Segue o receituário de *[ANIMAL]* referente à consulta de hoje. 💊 Qualquer dúvida estou à disposição!`},
                {id:"vacina",icon:"💉",label:"Aviso de vacina vencendo",desc:"Enviada 15 dias antes do vencimento",ativo:true,
                  preview:`Oi [TUTOR]! A vacina *[VACINA]* de *[ANIMAL]* vence em *[DATA]*. 📅 Que tal agendar o reforço? Responda esta mensagem!`},
              ].map((msg,i)=>(
                <div key={msg.id} style={{background:"#fff",border:"1px solid #E8EDE8",borderRadius:14,padding:"14px",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:20}}>{msg.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1E1E1E"}}>{msg.label}</div>
                      <div style={{fontSize:11,color:"#888",marginTop:1}}>{msg.desc}</div>
                    </div>
                    <div onClick={()=>st(`${msg.ativo?"🔕 Desativado":"🔔 Ativado"}!`)}
                      style={{width:42,height:24,borderRadius:12,background:msg.ativo?"#25D366":"#E8EDE8",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                      <div style={{position:"absolute",top:3,left:msg.ativo?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </div>
                  </div>
                  <div style={{background:"#F8FBF8",borderRadius:9,padding:"10px 12px",fontSize:12,color:"#555",lineHeight:1.6,borderLeft:`3px solid ${msg.ativo?"#25D366":"#E8EDE8"}`}}>
                    {msg.preview}
                  </div>
                </div>
              ))}
              <button onClick={()=>{st("⚙️ Configurações salvas!");setModalWpp(false);}} style={{width:"100%",background:"#25D366",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
                💾 Salvar configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{width:sw,background:V,display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.25s ease",overflow:"hidden"}}>
        <div style={{padding:sb?"18px 14px 14px":"18px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:sb?"space-between":"center"}}>
          {sb&&<div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:VL,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>🐾</div>
            <div><div style={{color:"#fff",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>VetClick</div><div style={{color:VL,fontSize:10}}>Agenda</div></div>
          </div>}
          <button onClick={()=>setSb(v=>!v)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>{sb?"◀":"▶"}</button>
        </div>
        <nav style={{flex:1,padding:sb?"12px 10px":"12px 6px",display:"flex",flexDirection:"column",gap:2}}>
          {navs.map(n=>(
            <button key={n.id} onClick={()=>irSec(n.id)} title={!sb?n.label:""} style={{display:"flex",alignItems:"center",gap:sb?10:0,justifyContent:sb?"flex-start":"center",padding:sb?"9px 12px":"10px 0",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:sec===n.id?600:400,background:sec===n.id?"rgba(255,255,255,0.18)":"transparent",color:sec===n.id?"#fff":"rgba(255,255,255,0.65)",whiteSpace:"nowrap",overflow:"hidden",position:"relative"}}>
              <span style={{fontSize:17,flexShrink:0}}>{n.icon}</span>
              {sb&&n.label}
              {n.id==="solicitacoes"&&sols.length>0&&<span style={{marginLeft:sb?"auto":0,position:sb?"relative":"absolute",top:sb?0:4,right:sb?0:4,background:VM,color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:10,fontWeight:700}}>{sols.length}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:sb?"12px 14px":"12px 0",borderTop:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:VL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>👨‍⚕️</div>
          {sb&&<div><div style={{color:"#fff",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>Dr. Carlos Mendes</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:10}}>CRMV-SP 45231</div></div>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:"#fff",padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #E8EDE8",flexShrink:0}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#1E1E1E"}}>{navs.find(n=>n.id===sec)?.icon} {navs.find(n=>n.id===sec)?.label}</div>
            <div style={{fontSize:11,color:"#bbb",marginTop:1}}>Terça-feira, 10 de Março de 2026</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setModal(true);setEtapa(1);}} style={{background:V,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🩺 Nova Consulta</button>
            <button onClick={()=>setSec("solicitacoes")} style={{position:"relative",background:"none",border:"none",cursor:"pointer",fontSize:20}}>
              🔔
              {sols.length>0&&<span style={{position:"absolute",top:-2,right:-2,background:VM,color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{sols.length}</span>}
            </button>
          </div>
        </header>

        <div style={{flex:1,overflow:"auto",padding:20}}>

          {/* DASHBOARD */}
          {sec==="dashboard"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                {[
                  {label:"Agendamentos hoje",val:"3",icon:"📅",cor:V},
                  {label:"Solicitações pendentes",val:String(sols.length),icon:"🔔",cor:sols.length>0?LA:V,d:sols.length>0},
                  {label:"Faturamento do mês",val:"R$ 2.840",icon:"💰",cor:V},
                  {label:"Vacinas vencendo",val:"2",icon:"💉",cor:VM},
                ].map((c,i)=>(
                  <Card key={i} style={{border:c.d?`2px solid ${c.cor}`:"1px solid #E8EDE8"}}>
                    <div style={{fontSize:20,marginBottom:6}}>{c.icon}</div>
                    <div style={{fontSize:22,fontWeight:700,color:c.cor}}>{c.val}</div>
                    <div style={{fontSize:12,color:"#888",marginTop:3}}>{c.label}</div>
                  </Card>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Card>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📋 Próximos atendimentos</div>
                  {ags.map(ag=>{
                    const tC=tutores.find(t=>t.nome===ag.tutor);
                    const aC=tC?.animais.find(a=>a.nome===ag.animal);
                    return(
                      <div key={ag.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #F0F4F0"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:csMap[ag.servico]||V,flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600}}>{ag.ei} {ag.animal}</div>
                          <div style={{fontSize:11,color:"#888"}}>{ag.tutor} · {ag.servico}</div>
                        </div>
                        <button onClick={()=>irEt3(ag.tutor,aC||{nome:ag.animal,ei:ag.ei,especie:"Cão"})} style={{fontSize:11,color:V,fontWeight:600,background:"#E8F4ED",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit"}}>Abrir</button>
                      </div>
                    );
                  })}
                </Card>
                <Card>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>⚡ Ações rápidas</div>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    {[
                      {label:"🩺 Nova consulta",fn:()=>{setModal(true);setEtapa(1);},bg:V,col:"#fff",bdr:"none"},
                      {label:lc?"✅ Link copiado!":"🔗 Copiar meu link",fn:()=>{setLc(true);st("🔗 Link copiado!");setTimeout(()=>setLc(false),2000);},bg:lc?VL:"#F0F4F0",col:lc?"#fff":V,bdr:"1px solid #E8EDE8"},
                      {label:`🔔 Solicitações (${sols.length})`,fn:()=>setSec("solicitacoes"),bg:sols.length>0?"#FFF3E8":"#F0F4F0",col:sols.length>0?LA:"#888",bdr:`1px solid ${sols.length>0?LA:"#E8EDE8"}`},
                      {label:"💰 Ver financeiro",fn:()=>setSec("financeiro"),bg:"#F0F4F0",col:V,bdr:"1px solid #E8EDE8"},
                    ].map((b,i)=>(
                      <button key={i} onClick={b.fn} style={{background:b.bg,color:b.col,border:b.bdr,borderRadius:10,padding:"11px 14px",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>{b.label}</button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SOLICITAÇÕES */}
          {sec==="solicitacoes"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {sols.length===0?(
                <div style={{textAlign:"center",padding:60,color:"#aaa"}}>
                  <div style={{fontSize:44,marginBottom:10}}>🐾</div>
                  <div style={{fontSize:15,fontWeight:600}}>Nenhuma solicitação pendente</div>
                </div>
              ):sols.map(sol=>(
                <Card key={sol.id} style={{border:`1px solid ${LA}55`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div><div style={{fontSize:15,fontWeight:700}}>{sol.ei} {sol.animal}</div><div style={{fontSize:12,color:"#888"}}>{sol.tutor}</div></div>
                    <Chip cor={LA}>Pendente</Chip>
                  </div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
                    <Chip cor={V}>{sol.servico}</Chip>
                    <Chip cor="#666">🕐 {sol.horario}</Chip>
                    {sol.foto&&<Chip cor={AZ}>📷 Foto enviada</Chip>}
                  </div>
                  {sol.obs?<div style={{background:"#FAFAFA",borderRadius:8,padding:"9px 12px",fontSize:12,color:"#555",fontStyle:"italic",marginBottom:12}}>"{sol.obs}"</div>:null}
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>{setSols(s=>s.filter(x=>x.id!==sol.id));st("✅ Confirmado!");}} style={{flex:1,background:V,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✅ Confirmar</button>
                    <button onClick={()=>{setSols(s=>s.filter(x=>x.id!==sol.id));st("❌ Recusado.");}} style={{flex:1,background:"#FFF0F0",color:VM,border:`1px solid ${VM}44`,borderRadius:10,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>❌ Recusar</button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* AGENDA */}
          {sec==="agenda"&&(
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14}}>Semana de 10 a 16 de Março</div>
                <div style={{display:"flex",gap:6}}>{["Dia","Semana","Mês"].map(v=><button key={v} style={{padding:"5px 12px",borderRadius:8,border:"1px solid #E8EDE8",background:v==="Semana"?V:"#fff",color:v==="Semana"?"#fff":"#555",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{v}</button>)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"50px repeat(7,1fr)",gap:1,background:"#E8EDE8",borderRadius:10,overflow:"hidden"}}>
                <div style={{background:"#F0F4F0"}}/>
                {["Seg 10","Ter 11","Qua 12","Qui 13","Sex 14","Sáb 15","Dom 16"].map((d,i)=><div key={d} style={{background:"#F0F4F0",padding:"8px 4px",textAlign:"center",fontSize:11,fontWeight:600,color:i===1?V:"#666"}}>{d}</div>)}
                {["08:00","09:00","10:00","11:00","14:00","15:00","16:00"].map(hora=>{
                  const ag=ags.find(a=>a.horario===hora);
                  return[
                    <div key={"h"+hora} style={{background:"#fff",padding:"6px 4px",fontSize:10,color:"#bbb",display:"flex",alignItems:"center",justifyContent:"center"}}>{hora}</div>,
                    ...["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((dia,di)=>(
                      <div key={dia+hora} style={{background:"#fff",padding:3,minHeight:40}}>
                        {di===1&&ag&&(
                          <button onClick={()=>{const tC=tutores.find(t=>t.nome===ag.tutor);const aC=tC?.animais.find(a=>a.nome===ag.animal);irEt3(ag.tutor,aC||{nome:ag.animal,ei:ag.ei,especie:"Cão"});}}
                            style={{width:"100%",background:csMap[ag.servico]||V,border:"none",borderRadius:5,padding:"3px 5px",fontSize:10,color:"#fff",fontWeight:500,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>{ag.ei} {ag.animal}</button>
                        )}
                      </div>
                    ))
                  ];
                })}
              </div>
            </Card>
          )}

          {/* TUTORES */}
          {sec==="tutores"&&!telaAnimal&&!telaTutor&&(()=>{
            const q=buscaTutor.toLowerCase().trim();
            const filtrados=tutores.filter(t=>
              t.nome.toLowerCase().includes(q)||
              t.cpf.replace(/\D/g,"").includes(q.replace(/\D/g,""))||
              t.animais.some(a=>a.nome.toLowerCase().includes(q))
            );
            const hl=(txt)=>{
              if(!q) return txt;
              const idx=txt.toLowerCase().indexOf(q);
              if(idx===-1) return txt;
              return <>{txt.slice(0,idx)}<mark style={{background:VL+"55",color:V,fontWeight:700,borderRadius:3,padding:"0 1px"}}>{txt.slice(idx,idx+q.length)}</mark>{txt.slice(idx+q.length)}</>;
            };
            return(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",gap:10}}>
                  <div style={{flex:1,position:"relative"}}>
                    <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span>
                    <input value={buscaTutor} onChange={e=>{setBuscaTutor(e.target.value);setFichaAberta(null);}}
                      placeholder="Buscar por tutor, animal ou CPF..."
                      style={{width:"100%",padding:"11px 14px 11px 40px",borderRadius:12,border:`2px solid ${buscaTutor?V:"#E8EDE8"}`,fontSize:13,fontFamily:"inherit",background:"#fff"}}/>
                    {buscaTutor&&<button onClick={()=>{setBuscaTutor("");setFichaAberta(null);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"#E8EDE8",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>}
                  </div>
                  <button onClick={()=>{setModal(true);setEtapa(1);}} style={{background:V,color:"#fff",border:"none",borderRadius:12,padding:"11px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>➕ Novo tutor</button>
                </div>

                {/* SEM BUSCA — tela inicial limpa */}
                {!q&&(
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",color:"#aaa",textAlign:"center"}}>
                    <div style={{width:72,height:72,borderRadius:20,background:V+"10",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,marginBottom:16}}>🔍</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#555",marginBottom:6}}>Busque um tutor</div>
                    <div style={{fontSize:13,color:"#aaa",maxWidth:260,lineHeight:1.6}}>Digite o nome, CPF ou nome do animal para encontrar o cadastro</div>
                    <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap",justifyContent:"center"}}>
                      {tutores.map(t=>(
                        <button key={t.id} onClick={()=>{setTelaTutor(t);setAbaTutor("dados");}}
                          style={{background:"#F8FBF8",border:`1px solid ${V}22`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,color:V,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                          <span>👤</span>{t.nome.split(" ")[0]}
                          <span style={{fontSize:10,color:"#aaa",fontWeight:400}}>({t.animais.length} {t.animais.length===1?"animal":"animais"})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COM BUSCA — resultados */}
                {q&&(
                  <>
                    <div style={{fontSize:12,color:"#888",paddingLeft:2}}>
                      {filtrados.length===0?"Nenhum resultado":`${filtrados.length} resultado${filtrados.length>1?"s":""} para "${buscaTutor}"`}
                    </div>
                    {filtrados.length===0?(
                      <div style={{textAlign:"center",padding:"40px 20px",color:"#aaa"}}>
                        <div style={{fontSize:36,marginBottom:10}}>😕</div>
                        <div style={{fontSize:14,fontWeight:600,color:"#555",marginBottom:4}}>Nenhum tutor encontrado</div>
                        <div style={{fontSize:12}}>Tente outro nome, CPF ou animal</div>
                      </div>
                    ):filtrados.map(t=>{
                  const aberta=fichaAberta===t.id;
                  const animalMatch=q?t.animais.find(a=>a.nome.toLowerCase().includes(q)):null;
                  const inadim=t.conta.saldo<0;
                  return(
                    <Card key={t.id} style={{border:aberta?`2px solid ${V}`:"1px solid #E8EDE8",padding:0,overflow:"hidden"}}>
                      {/* Header tutor */}
                      <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px"}}>
                        <button onClick={()=>{setTelaTutor(t);setAbaTutor("dados");}}
                          style={{width:46,height:46,borderRadius:13,background:V+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:"none",cursor:"pointer"}}>
                          👤
                        </button>
                        <div style={{flex:1,minWidth:0}}>
                          <button onClick={()=>{setTelaTutor(t);setAbaTutor("dados");}}
                            style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",padding:0}}>
                            <div style={{fontSize:14,fontWeight:700,color:"#1E1E1E",display:"flex",alignItems:"center",gap:8}}>
                              {hl(t.nome)}
                              {inadim&&<span style={{fontSize:10,fontWeight:700,color:VM,background:VM+"12",borderRadius:5,padding:"2px 6px"}}>⚠️ Inadimplente</span>}
                            </div>
                          </button>
                          <div style={{fontSize:11,color:"#999",marginTop:2}}>📱 {t.whats} · 🪪 {hl(t.cpf)}</div>
                          <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                            {t.animais.map(a=>(
                              <span key={a.id} onClick={()=>{setTelaAnimal({tutor:t,animal:a});setAbaAnimal("resumo");}}
                                style={{background:animalMatch?.id===a.id?V+"18":"#F0F4F0",border:animalMatch?.id===a.id?`1px solid ${V}44`:"none",borderRadius:20,padding:"3px 9px",fontSize:11,color:animalMatch?.id===a.id?V:"#666",fontWeight:animalMatch?.id===a.id?700:400,cursor:"pointer"}}>
                                {a.ei} {hl(a.nome)}{a.restricao?" ⚠️":""}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button onClick={()=>{setFichaAberta(aberta?null:t.id);setAbaFicha("animais");}}
                          style={{background:"none",border:"none",cursor:"pointer",padding:"6px",fontSize:13,color:"#ccc",flexShrink:0}}>
                          <span style={{display:"inline-block",transform:aberta?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
                        </button>
                      </div>

                      {/* Expandido: lista de animais como cards clicáveis */}
                      {aberta&&(
                        <div style={{borderTop:"1px solid #F0F4F0",background:"#FAFCFA",padding:"16px 20px 18px"}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:1,marginBottom:12}}>🐾 ANIMAIS DO TUTOR</div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:14}}>
                            {t.animais.map(a=>{
                              const temExames=a.exames?.length>0;
                              const temRestricao=!!a.restricao;
                              return(
                                <button key={a.id} onClick={()=>{setTelaAnimal({tutor:t,animal:a});setAbaAnimal("resumo");}}
                                  style={{display:"flex",flexDirection:"column",gap:0,padding:0,background:"#fff",border:`1.5px solid ${V}22`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",overflow:"hidden",transition:"all 0.15s",boxShadow:"0 2px 8px rgba(45,106,79,0.06)"}}>
                                  {/* Topo colorido */}
                                  <div style={{background:a.especie==="Cão"?`linear-gradient(120deg,${V}18,${VL}22)`:`linear-gradient(120deg,${LA}22,${AM}18)`,padding:"14px 14px 10px",display:"flex",alignItems:"center",gap:10}}>
                                    <div style={{width:48,height:48,borderRadius:13,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 2px 6px rgba(0,0,0,0.08)",flexShrink:0}}>{a.ei}</div>
                                    <div style={{flex:1,minWidth:0}}>
                                      <div style={{fontSize:14,fontWeight:700,color:"#1E1E1E",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.nome}</div>
                                      <div style={{fontSize:11,color:"#777",marginTop:1}}>{a.especie} · {a.sexo}</div>
                                      <div style={{fontSize:11,color:"#888",marginTop:1}}>{a.idade} {parseInt(a.idade)===1?"ano":"anos"}</div>
                                    </div>
                                  </div>
                                  {/* Info + badges */}
                                  <div style={{padding:"10px 14px 12px",display:"flex",flexDirection:"column",gap:6}}>
                                    {temRestricao&&(
                                      <div style={{display:"flex",alignItems:"center",gap:5,background:"#FFF0F0",borderRadius:7,padding:"4px 8px",fontSize:11,color:VM,fontWeight:600}}>
                                        <span>⚠️</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.restricao}</span>
                                      </div>
                                    )}
                                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                                      {temExames&&<span style={{fontSize:10,background:AZ+"15",color:AZ,borderRadius:6,padding:"2px 7px",fontWeight:700}}>🔬 {a.exames.length} exame{a.exames.length>1?"s":""}</span>}
                                      <span style={{fontSize:10,background:V+"12",color:V,borderRadius:6,padding:"2px 7px",fontWeight:700}}>Ver ficha →</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                            {/* Card adicionar novo animal */}
                            <button onClick={()=>st("➕ Cadastro de novo animal em breve!")}
                              style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"20px 14px",background:"transparent",border:`1.5px dashed ${V}44`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",color:V+"88",minHeight:120}}>
                              <span style={{fontSize:24}}>➕</span>
                              <span style={{fontSize:12,fontWeight:600}}>Novo animal</span>
                            </button>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>st(`📱 ${t.whats}`)} style={{flex:1,background:"#F0F4F0",color:"#555",border:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📱 WhatsApp</button>
                            <button onClick={()=>st("✏️ Em breve!")} style={{flex:1,background:"#F0F4F0",color:"#555",border:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏️ Editar tutor</button>
                            <button onClick={()=>{setFichaAberta(t.id);setAbaFicha("conta");}} style={{background:inadim?"#FFF0F0":"#F0F4F0",color:inadim?VM:"#555",border:`1px solid ${inadim?VM+"44":"#E8EDE8"}`,borderRadius:10,padding:"9px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💰 Conta</button>
                            <button onClick={()=>{setFichaAberta(t.id);setAbaFicha("termos");}} style={{background:t.termos.length===0?"#FFF8E8":"#F0F4F0",color:t.termos.length===0?"#B8860B":"#555",border:`1px solid ${t.termos.length===0?"#F0D060":"#E8EDE8"}`,borderRadius:10,padding:"9px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📄 Termos</button>
                          </div>

                          {/* Sub-painel conta/termos inline */}
                          {abaFicha==="conta"&&fichaAberta===t.id&&(
                            <div style={{marginTop:14,background:"#FAFAFA",borderRadius:12,padding:14,border:"1px solid #E8EDE8"}}>
                              <div style={{display:"flex",gap:10,marginBottom:12}}>
                                <div style={{flex:1,background:t.conta.saldo<0?"#FFF0F0":"#E8F4ED",borderRadius:10,padding:12,border:`1px solid ${t.conta.saldo<0?VM+"33":V+"33"}`}}>
                                  <div style={{fontSize:10,fontWeight:700,color:"#888"}}>SALDO</div>
                                  <div style={{fontSize:18,fontWeight:700,color:t.conta.saldo<0?VM:V,marginTop:4}}>{t.conta.saldo<0?`- R$ ${Math.abs(t.conta.saldo).toFixed(2)}`:"R$ 0,00"}</div>
                                  <div style={{fontSize:10,fontWeight:600,color:t.conta.saldo<0?VM:V,marginTop:3}}>{t.conta.saldo<0?"⚠️ Inadimplente":"✅ Em dia"}</div>
                                </div>
                                <div style={{flex:1,background:"#F8F8F8",borderRadius:10,padding:12,border:"1px solid #E8EDE8"}}>
                                  <div style={{fontSize:10,fontWeight:700,color:"#888"}}>ATENDIMENTOS</div>
                                  <div style={{fontSize:18,fontWeight:700,marginTop:4}}>{t.conta.pagamentos.length}</div>
                                </div>
                              </div>
                              {t.conta.pagamentos.map((p,i)=>(
                                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #F0F4F0",fontSize:12}}>
                                  <div style={{width:7,height:7,borderRadius:"50%",background:p.st==="pago"?V:VM,flexShrink:0}}/>
                                  <span style={{flex:1,fontWeight:500}}>{p.desc}</span>
                                  <span style={{color:"#aaa",fontSize:11}}>{p.data}</span>
                                  <span style={{fontWeight:700}}>R$ {p.val}</span>
                                  <span style={{fontSize:10,fontWeight:700,color:p.st==="pago"?V:VM}}>{p.st==="pago"?"✓":"⏳"}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {abaFicha==="termos"&&fichaAberta===t.id&&(
                            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:7}}>
                              {Object.entries(TERMOS).map(([key,termo])=>{
                                const assinado=t.termos.includes(key);
                                return(
                                  <div key={key} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:10,padding:"10px 14px",border:`1px solid ${assinado?V+"33":"#E8EDE8"}`}}>
                                    <span style={{fontSize:16}}>{termo.icon}</span>
                                    <div style={{flex:1,fontSize:12,fontWeight:600,color:"#1E1E1E"}}>{termo.label}</div>
                                    <span style={{fontSize:10,fontWeight:700,color:assinado?V:"#bbb"}}>{assinado?"✅ Assinado":"— Pendente"}</span>
                                    <button onClick={()=>{setModalTermo({key,termo,tutor:t,animal:t.animais[0]});setTermoAssinado(assinado);}}
                                      style={{background:assinado?"#F0F4F0":V,color:assinado?"#555":"#fff",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{assinado?"Ver":"Assinar"}</button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
                  </>
                )}
              </div>
            );
          })()}

          {/* TELA DEDICADA DO TUTOR */}
          {sec==="tutores"&&telaTutor&&!telaAnimal&&(()=>{
            const t=telaTutor;
            const inadim=t.conta.saldo<0;
            const abasTutor=[
              {id:"dados",icon:"👤",label:"Dados"},
              {id:"animais",icon:"🐾",label:"Animais"},
              {id:"conta",icon:"💰",label:"Conta",badge:inadim},
              {id:"termos",icon:"📄",label:"Termos",badge:t.termos.length===0},
            ];
            return(
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {/* Breadcrumb */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <button onClick={()=>setTelaTutor(null)} style={{background:"#F0F4F0",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#555",cursor:"pointer",fontFamily:"inherit"}}>← Tutores</button>
                  <span style={{fontSize:12,color:"#bbb"}}>/</span>
                  <span style={{fontSize:13,color:V,fontWeight:700}}>👤 {t.nome}</span>
                </div>

                {/* Header do tutor */}
                <div style={{background:`linear-gradient(135deg,#1a3a2a 0%,${V} 60%,#3a8a5f 100%)`,borderRadius:18,padding:"22px 24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
                  <div style={{position:"absolute",right:40,bottom:-40,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
                  <div style={{display:"flex",alignItems:"center",gap:16,position:"relative"}}>
                    <div style={{width:72,height:72,borderRadius:18,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0,border:"2px solid rgba(255,255,255,0.2)"}}>👤</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:22,fontWeight:700,color:"#fff"}}>{t.nome}</div>
                      <div style={{fontSize:12,color:VL,marginTop:3,display:"flex",gap:14,flexWrap:"wrap"}}>
                        <span>📱 {t.whats}</span>
                        <span>📧 {t.email}</span>
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,background:"rgba(255,255,255,0.15)",color:"#fff",borderRadius:20,padding:"3px 10px"}}>Cliente desde {t.desde}</span>
                        <span style={{fontSize:11,background:inadim?"rgba(230,57,70,0.3)":"rgba(116,198,157,0.25)",color:inadim?"#ffaaaa":VL,borderRadius:20,padding:"3px 10px",fontWeight:700}}>{inadim?"⚠️ Inadimplente":"✅ Em dia"}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                      <button onClick={()=>st(`📱 Abrindo WhatsApp de ${t.nome}...`)} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 WhatsApp</button>
                      <button onClick={()=>st("✏️ Edição em breve!")} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏️ Editar</button>
                    </div>
                  </div>
                  {/* Mini stats */}
                  <div style={{display:"flex",gap:10,marginTop:16,position:"relative"}}>
                    {[
                      {label:"Animais",val:String(t.animais.length),icon:"🐾"},
                      {label:"Atendimentos",val:String(t.totalAtend),icon:"🩺"},
                      {label:"Termos",val:`${t.termos.length}/5`,icon:"📄"},
                      {label:"Saldo",val:inadim?`-R$${Math.abs(t.conta.saldo)}`:"Em dia",icon:"💰"},
                    ].map((s,i)=>(
                      <div key={i} style={{flex:1,background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                        <div style={{fontSize:16}}>{s.icon}</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#fff",marginTop:2}}>{s.val}</div>
                        <div style={{fontSize:10,color:VL,marginTop:1}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abas */}
                <div style={{display:"flex",gap:3,marginBottom:14,background:"#fff",borderRadius:12,padding:4,border:"1px solid #E8EDE8"}}>
                  {abasTutor.map(ab=>(
                    <button key={ab.id} onClick={()=>setAbaTutor(ab.id)} style={{
                      flex:1,padding:"9px 4px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",
                      fontSize:12,fontWeight:abaTutor===ab.id?700:500,
                      background:abaTutor===ab.id?V:"transparent",
                      color:abaTutor===ab.id?"#fff":"#888",
                      position:"relative",transition:"all 0.15s",
                    }}>
                      <div>{ab.icon}</div>
                      <div style={{marginTop:2}}>{ab.label}</div>
                      {ab.badge===true&&<span style={{position:"absolute",top:4,right:6,width:7,height:7,borderRadius:"50%",background:VM}}/>}
                    </button>
                  ))}
                </div>

                {/* ABA DADOS */}
                {abaTutor==="dados"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <Card>
                      <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>DADOS PESSOAIS</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[
                          {label:"Nome completo",val:t.nome,full:true},
                          {label:"CPF",val:t.cpf},
                          {label:"Data de nascimento",val:t.nasc},
                          {label:"Sexo",val:t.sexo},
                          {label:"WhatsApp",val:t.whats},
                          {label:"E-mail",val:t.email,full:true},
                          {label:"CEP",val:t.cep},
                          {label:"Endereço",val:t.endereco,full:true},
                        ].map((d,i)=>(
                          <div key={i} style={{background:"#F8FBF8",borderRadius:10,padding:"10px 12px",gridColumn:d.full?"span 2":"span 1"}}>
                            <div style={{fontSize:10,color:"#aaa",fontWeight:600,letterSpacing:0.5}}>{d.label.toUpperCase()}</div>
                            <div style={{fontSize:13,fontWeight:600,color:"#1E1E1E",marginTop:3}}>{d.val||"—"}</div>
                          </div>
                        ))}
                      </div>
                      {t.obs&&(
                        <div style={{marginTop:12,background:"#FFFBEA",borderRadius:10,padding:"10px 14px",border:"1px solid #F0D060",fontSize:13,color:"#7A6000"}}>
                          📝 <strong>Obs:</strong> {t.obs}
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                {/* ABA ANIMAIS */}
                {abaTutor==="animais"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                      {t.animais.map(a=>(
                        <button key={a.id} onClick={()=>{setTelaAnimal({tutor:t,animal:a});setAbaAnimal("resumo");}}
                          style={{display:"flex",flexDirection:"column",gap:0,padding:0,background:"#fff",border:`1.5px solid ${V}22`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",textAlign:"left",overflow:"hidden",boxShadow:"0 2px 8px rgba(45,106,79,0.06)"}}>
                          <div style={{background:a.especie==="Cão"?`linear-gradient(120deg,${V}18,${VL}22)`:`linear-gradient(120deg,${LA}22,${AM}18)`,padding:"14px 14px 10px",display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:48,height:48,borderRadius:13,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 2px 6px rgba(0,0,0,0.08)",flexShrink:0}}>{a.ei}</div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:"#1E1E1E"}}>{a.nome}</div>
                              <div style={{fontSize:11,color:"#777"}}>{a.raca||a.especie} · {a.sexo}</div>
                              <div style={{fontSize:11,color:"#888"}}>{a.idade} {parseInt(a.idade)===1?"ano":"anos"} · {a.peso}kg</div>
                            </div>
                          </div>
                          <div style={{padding:"10px 14px 12px"}}>
                            {a.restricao&&<div style={{background:"#FFF0F0",borderRadius:7,padding:"4px 8px",fontSize:11,color:VM,fontWeight:600,marginBottom:6}}>⚠️ {a.restricao}</div>}
                            <div style={{display:"flex",gap:5}}>
                              {a.exames?.length>0&&<span style={{fontSize:10,background:AZ+"15",color:AZ,borderRadius:6,padding:"2px 7px",fontWeight:700}}>🔬 {a.exames.length} exame{a.exames.length>1?"s":""}</span>}
                              <span style={{fontSize:10,background:V+"12",color:V,borderRadius:6,padding:"2px 7px",fontWeight:700}}>Ver ficha →</span>
                            </div>
                          </div>
                        </button>
                      ))}
                      <button onClick={()=>st("➕ Novo animal em breve!")}
                        style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"20px",background:"transparent",border:`1.5px dashed ${V}44`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",color:V+"88",minHeight:130}}>
                        <span style={{fontSize:26}}>➕</span>
                        <span style={{fontSize:12,fontWeight:600}}>Novo animal</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ABA CONTA */}
                {abaTutor==="conta"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>FINANCEIRO DO TUTOR</div>
                    <div style={{display:"flex",gap:10,marginBottom:16}}>
                      <div style={{flex:1,background:inadim?"#FFF0F0":"#E8F4ED",borderRadius:12,padding:14,border:`1px solid ${inadim?VM+"44":V+"44"}`}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#888"}}>SALDO</div>
                        <div style={{fontSize:22,fontWeight:700,color:inadim?VM:V,marginTop:4}}>{inadim?`- R$ ${Math.abs(t.conta.saldo).toFixed(2)}`:"R$ 0,00"}</div>
                        <div style={{fontSize:11,fontWeight:600,color:inadim?VM:V,marginTop:3}}>{inadim?"⚠️ Inadimplente":"✅ Em dia"}</div>
                      </div>
                      <div style={{flex:1,background:"#F8F8F8",borderRadius:12,padding:14,border:"1px solid #E8EDE8"}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#888"}}>ATENDIMENTOS</div>
                        <div style={{fontSize:22,fontWeight:700,marginTop:4}}>{t.totalAtend}</div>
                        <div style={{fontSize:11,color:"#888",marginTop:3}}>no total</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:10}}>HISTÓRICO</div>
                    {t.conta.pagamentos.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:"1px solid #F0F4F0"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:p.st==="pago"?V:VM,flexShrink:0}}/>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.desc}</div><div style={{fontSize:11,color:"#aaa"}}>{p.data}</div></div>
                        <div style={{fontSize:14,fontWeight:700}}>R$ {p.val}</div>
                        <span style={{fontSize:10,fontWeight:700,color:p.st==="pago"?V:VM,background:p.st==="pago"?V+"12":VM+"12",borderRadius:6,padding:"2px 8px"}}>{p.st==="pago"?"✓ Pago":"⏳ Pendente"}</span>
                      </div>
                    ))}
                    <button onClick={()=>st("💰 Cobrança avulsa em breve!")} style={{width:"100%",background:"#F0F4F0",color:V,border:`1px solid ${V}`,borderRadius:10,padding:"10px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:12}}>➕ Lançar cobrança avulsa</button>
                  </Card>
                )}

                {/* ABA TERMOS */}
                {abaTutor==="termos"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>TERMOS E AUTORIZAÇÕES</div>
                    {t.termos.length===0&&(
                      <div style={{background:"#FFF8E8",borderRadius:10,padding:"10px 14px",border:"1px solid #F0D060",fontSize:13,color:"#7A6000",marginBottom:14}}>
                        ⚠️ Nenhum termo assinado por este tutor ainda.
                      </div>
                    )}
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {Object.entries(TERMOS).map(([key,termo])=>{
                        const assinado=t.termos.includes(key);
                        return(
                          <div key={key} style={{display:"flex",alignItems:"center",gap:12,background:assinado?"#F8FBF8":"#fff",borderRadius:12,padding:"14px",border:`1px solid ${assinado?V+"33":"#E8EDE8"}`}}>
                            <div style={{width:40,height:40,borderRadius:10,background:assinado?V+"18":"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{termo.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600}}>{termo.label}</div>
                              <div style={{fontSize:11,marginTop:2,color:assinado?V:"#bbb",fontWeight:600}}>{assinado?"✅ Assinado":"— Pendente"}</div>
                            </div>
                            <button onClick={()=>{setModalTermo({key,termo,tutor:t,animal:t.animais[0]});setTermoAssinado(assinado);}}
                              style={{background:assinado?"#F0F4F0":V,color:assinado?"#555":"#fff",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                              {assinado?"Ver":"Assinar"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>
            );
          })()}

          {/* TELA DEDICADA DO ANIMAL */}
          {sec==="tutores"&&telaAnimal&&(()=>{
            const {tutor:t,animal:a}=telaAnimal;
            const abas=[
              {id:"resumo",icon:"🐾",label:"Resumo"},
              {id:"historico",icon:"📋",label:"Histórico"},
              {id:"exames",icon:"🔬",label:"Exames",badge:a.exames?.length||0},
              {id:"vacinas",icon:"💉",label:"Vacinas"},
              {id:"termos",icon:"📄",label:"Termos",badge:t.termos.length===0},
              {id:"conta",icon:"💰",label:"Conta",badge:t.conta.saldo<0},
            ];
            return(
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {/* Breadcrumb + voltar */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <button onClick={()=>{setTelaAnimal(null);setTelaTutor(null);}} style={{background:"#F0F4F0",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#555",cursor:"pointer",fontFamily:"inherit"}}>← Tutores</button>
                  <span style={{fontSize:12,color:"#bbb"}}>/</span>
                  <button onClick={()=>setTelaAnimal(null)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:V,fontWeight:600,padding:0}}>{t.nome}</button>
                  <span style={{fontSize:12,color:"#bbb"}}>/</span>
                  <span style={{fontSize:12,color:V,fontWeight:700}}>{a.ei} {a.nome}</span>
                </div>

                {/* Header do animal */}
                <div style={{background:`linear-gradient(135deg, ${V} 0%, #1a4a30 100%)`,borderRadius:18,padding:"22px 24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div style={{width:72,height:72,borderRadius:18,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,flexShrink:0}}>{a.ei}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:22,fontWeight:700,color:"#fff"}}>{a.nome}</div>
                      <div style={{fontSize:13,color:VL,marginTop:3}}>{a.especie} · {a.sexo} · {a.idade} anos · Tutor: {t.nome}</div>
                      {a.restricao&&<div style={{marginTop:8,background:"rgba(230,57,70,0.25)",border:"1px solid rgba(230,57,70,0.4)",borderRadius:8,padding:"5px 10px",fontSize:12,color:"#ffaaaa",fontWeight:600,display:"inline-block"}}>⚠️ {a.restricao}</div>}
                    </div>
                    <button onClick={()=>irEt3(t.nome,a)} style={{background:VL,color:V,border:"none",borderRadius:12,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>🩺 Nova consulta</button>
                  </div>
                  {/* Mini stats */}
                  <div style={{display:"flex",gap:10,marginTop:16}}>
                    {[
                      {label:"Consultas",val:"3",icon:"🩺"},
                      {label:"Exames",val:String(a.exames?.length||0),icon:"🔬"},
                      {label:"Vacinas",val:"2",icon:"💉"},
                      {label:"Último peso",val:"12.5kg",icon:"⚖️"},
                    ].map((s,i)=>(
                      <div key={i} style={{flex:1,background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                        <div style={{fontSize:16}}>{s.icon}</div>
                        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginTop:2}}>{s.val}</div>
                        <div style={{fontSize:10,color:VL,marginTop:1}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abas */}
                <div style={{display:"flex",gap:3,marginBottom:14,background:"#fff",borderRadius:12,padding:4,border:"1px solid #E8EDE8"}}>
                  {abas.map(ab=>(
                    <button key={ab.id} onClick={()=>setAbaAnimal(ab.id)} style={{
                      flex:1,padding:"8px 4px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",
                      fontSize:11,fontWeight:abaAnimal===ab.id?700:500,
                      background:abaAnimal===ab.id?V:"transparent",
                      color:abaAnimal===ab.id?"#fff":"#888",
                      position:"relative",
                    }}>
                      <div>{ab.icon}</div>
                      <div style={{marginTop:2}}>{ab.label}</div>
                      {ab.badge&&typeof ab.badge==="number"&&ab.badge>0&&<span style={{position:"absolute",top:4,right:6,background:AZ,color:"#fff",borderRadius:10,padding:"0 4px",fontSize:9,fontWeight:700}}>{ab.badge}</span>}
                      {ab.badge===true&&<span style={{position:"absolute",top:4,right:6,width:7,height:7,borderRadius:"50%",background:VM}}/>}
                    </button>
                  ))}
                </div>

                {/* ABA RESUMO */}
                {abaAnimal==="resumo"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <Card>
                      <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:12}}>DADOS DO ANIMAL</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[
                          {label:"Espécie",val:a.especie},
                          {label:"Sexo",val:a.sexo},
                          {label:"Idade",val:`${a.idade} anos`},
                          {label:"Último peso",val:"12.5 kg"},
                          {label:"Raça",val:"—"},
                          {label:"Pelagem",val:"—"},
                        ].map((d,i)=>(
                          <div key={i} style={{background:"#F8FBF8",borderRadius:10,padding:"10px 12px"}}>
                            <div style={{fontSize:10,color:"#aaa",fontWeight:600}}>{d.label}</div>
                            <div style={{fontSize:13,fontWeight:600,color:"#1E1E1E",marginTop:3}}>{d.val}</div>
                          </div>
                        ))}
                      </div>
                      {a.restricao&&(
                        <div style={{marginTop:12,background:"#FFF0F0",borderRadius:10,padding:"10px 14px",border:`1px solid ${VM}33`,fontSize:13,color:VM,fontWeight:600}}>
                          ⚠️ Restrição clínica: {a.restricao}
                        </div>
                      )}
                    </Card>
                    <Card>
                      <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:12}}>TUTOR RESPONSÁVEL</div>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:44,height:44,borderRadius:12,background:V+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:700}}>{t.nome}</div>
                          <div style={{fontSize:12,color:"#888",marginTop:2}}>📱 {t.whats} · 🪪 {t.cpf}</div>
                        </div>
                        <button onClick={()=>st(`📱 ${t.whats}`)} style={{background:"#F0F4F0",border:"none",borderRadius:9,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#555"}}>📱 WhatsApp</button>
                      </div>
                    </Card>
                  </div>
                )}

                {/* ABA HISTÓRICO */}
                {abaAnimal==="historico"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:16}}>TIMELINE DE CONSULTAS</div>
                    {historico.map((h,i)=>(
                      <div key={i} style={{borderLeft:`3px solid ${h.tipo==="Consulta"?V:AZ}`,paddingLeft:16,marginBottom:22,position:"relative"}}>
                        <div style={{position:"absolute",left:-8,top:0,width:14,height:14,borderRadius:"50%",background:h.tipo==="Consulta"?V:AZ,border:"2px solid #F0F4F0"}}/>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <Chip cor={h.tipo==="Consulta"?V:AZ}>{h.tipo}</Chip>
                          <span style={{fontSize:11,color:"#aaa"}}>{h.data}</span>
                        </div>
                        <div style={{background:"#fff",border:"1px solid #E8EDE8",borderRadius:12,padding:14}}>
                          {h.queixa!=="—"&&<div style={{marginBottom:8}}><span style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:1}}>QUEIXA </span><span style={{fontSize:12,color:"#444"}}>{h.queixa}</span></div>}
                          <div style={{marginBottom:8}}><span style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:1}}>DIAGNÓSTICO </span><span style={{fontSize:12,color:"#444"}}>{h.diag}</span></div>
                          {h.prescricao!=="—"&&<div><span style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:1}}>PRESCRIÇÃO </span><span style={{fontSize:12,color:"#444"}}>{h.prescricao}</span></div>}
                          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #F0F4F0",fontSize:11,color:"#aaa"}}>⚖️ Peso: <strong style={{color:"#333"}}>{h.peso}kg</strong></div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {/* ABA EXAMES */}
                {abaAnimal==="exames"&&(
                  <Card>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1}}>EXAMES E LAUDOS</div>
                      <button onClick={()=>st("📎 Upload em breve!")} style={{background:V,color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>➕ Novo exame</button>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                      {["Todos",...new Set((a.exames||[]).map(e=>e.tipo))].map(tp=>(
                        <button key={tp} onClick={()=>setTipoExameFiltro(tp)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${tipoExameFiltro===tp?V:"#E8EDE8"}`,background:tipoExameFiltro===tp?V:"#fff",color:tipoExameFiltro===tp?"#fff":"#666",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{tp}</button>
                      ))}
                    </div>
                    {(a.exames||[]).length===0?(
                      <div style={{textAlign:"center",padding:"30px 0",color:"#bbb"}}>
                        <div style={{fontSize:36,marginBottom:8}}>🔬</div>
                        <div style={{fontSize:13}}>Nenhum exame cadastrado</div>
                      </div>
                    ):(a.exames||[]).filter(e=>tipoExameFiltro==="Todos"||e.tipo===tipoExameFiltro).map((ex,i)=>(
                      <div key={ex.id} style={{display:"flex",gap:12,background:"#F8FBF8",borderRadius:12,padding:"14px",marginBottom:10,border:"1px solid #E8EDE8",alignItems:"flex-start"}}>
                        <div style={{width:42,height:42,borderRadius:10,background:V+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{ex.icon}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <div style={{fontSize:13,fontWeight:700}}>{ex.tipo}</div>
                            <span style={{fontSize:11,color:"#aaa"}}>📅 {ex.data}</span>
                          </div>
                          {ex.obs&&<div style={{fontSize:12,color:"#555",marginTop:5,background:"#fff",borderRadius:8,padding:"6px 10px",border:"1px solid #E8EDE8"}}>{ex.obs}</div>}
                          <div style={{display:"flex",gap:6,marginTop:10}}>
                            <button onClick={()=>st("📄 Abrindo...")} style={{flex:1,background:"#fff",color:V,border:`1px solid ${V}44`,borderRadius:8,padding:"6px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📎 {ex.arquivo}</button>
                            <button onClick={()=>st("💬 Enviado!")} style={{background:"#E8F4ED",color:V,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💬 Enviar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {/* ABA VACINAS */}
                {abaAnimal==="vacinas"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>CARTEIRA DE VACINAS</div>
                    {(a.especie==="Cão"?vacinasCao:vacinasGato).map((vac,i)=>{
                      const aplicada=vacinas.find(v=>v.animal===a.nome&&v.vacina.includes(vac.nome.split(" ")[0]));
                      const cor=aplicada?.st==="vencida"?VM:aplicada?.st==="vencendo"?LA:aplicada?V:"#ccc";
                      const ic=aplicada?.st==="vencida"?"❌":aplicada?.st==="vencendo"?"⚠️":aplicada?"✅":"○";
                      return(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F0F4F0"}}>
                          <div style={{width:36,height:36,borderRadius:9,background:cor+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ic}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:"#1E1E1E"}}>{vac.nome}</div>
                            <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{vac.desc}</div>
                            {aplicada&&<div style={{fontSize:11,color:cor,fontWeight:600,marginTop:2}}>Vencimento: {aplicada.venc}</div>}
                          </div>
                          {!aplicada&&<button onClick={()=>irEt3(t.nome,a)} style={{background:V+"12",color:V,border:`1px solid ${V}33`,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💉 Aplicar</button>}
                        </div>
                      );
                    })}
                  </Card>
                )}

                {/* ABA TERMOS */}
                {abaAnimal==="termos"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>TERMOS E AUTORIZAÇÕES</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {Object.entries(TERMOS).map(([key,termo])=>{
                        const assinado=t.termos.includes(key);
                        return(
                          <div key={key} style={{display:"flex",alignItems:"center",gap:12,background:assinado?"#F8FBF8":"#fff",borderRadius:12,padding:"14px",border:`1px solid ${assinado?V+"33":"#E8EDE8"}`}}>
                            <div style={{width:40,height:40,borderRadius:10,background:assinado?V+"18":"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{termo.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600}}>{termo.label}</div>
                              <div style={{fontSize:11,marginTop:2,color:assinado?V:"#bbb",fontWeight:600}}>{assinado?"✅ Assinado":"— Pendente"}</div>
                            </div>
                            <button onClick={()=>{setModalTermo({key,termo,tutor:t,animal:a});setTermoAssinado(assinado);}}
                              style={{background:assinado?"#F0F4F0":V,color:assinado?"#555":"#fff",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                              {assinado?"Ver":"Assinar"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* ABA CONTA */}
                {abaAnimal==="conta"&&(
                  <Card>
                    <div style={{fontSize:12,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:14}}>CONTA DO TUTOR</div>
                    <div style={{display:"flex",gap:10,marginBottom:16}}>
                      <div style={{flex:1,background:t.conta.saldo<0?"#FFF0F0":"#E8F4ED",borderRadius:12,padding:14,border:`1px solid ${t.conta.saldo<0?VM+"44":V+"44"}`}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#888"}}>SALDO</div>
                        <div style={{fontSize:20,fontWeight:700,color:t.conta.saldo<0?VM:V,marginTop:4}}>{t.conta.saldo<0?`- R$ ${Math.abs(t.conta.saldo).toFixed(2)}`:"R$ 0,00"}</div>
                        <div style={{fontSize:11,fontWeight:600,color:t.conta.saldo<0?VM:V,marginTop:3}}>{t.conta.saldo<0?"⚠️ Inadimplente":"✅ Em dia"}</div>
                      </div>
                      <div style={{flex:1,background:"#F8F8F8",borderRadius:12,padding:14,border:"1px solid #E8EDE8"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#888"}}>ATENDIMENTOS</div>
                        <div style={{fontSize:20,fontWeight:700,marginTop:4}}>{t.conta.pagamentos.length}</div>
                      </div>
                    </div>
                    {t.conta.pagamentos.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #F0F4F0",fontSize:13}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:p.st==="pago"?V:VM,flexShrink:0}}/>
                        <div style={{flex:1}}><div style={{fontWeight:600}}>{p.desc}</div><div style={{fontSize:11,color:"#aaa"}}>{p.data}</div></div>
                        <div style={{fontWeight:700}}>R$ {p.val}</div>
                        <span style={{fontSize:10,fontWeight:700,color:p.st==="pago"?V:VM,background:p.st==="pago"?V+"12":VM+"12",borderRadius:6,padding:"2px 8px"}}>{p.st==="pago"?"✓ Pago":"⏳ Pendente"}</span>
                      </div>
                    ))}
                    <button onClick={()=>st("💰 Em breve!")} style={{width:"100%",background:"#F0F4F0",color:V,border:`1px solid ${V}`,borderRadius:10,padding:"10px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:12}}>➕ Lançar cobrança avulsa</button>
                  </Card>
                )}
              </div>
            );
          })()}

          {/* CONSULTA */}
          {sec==="consulta"&&pac&&(
            <div style={{display:"flex",gap:0,height:"calc(100vh - 170px)"}}>
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",marginRight:14}}>

                {/* Header paciente */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                  <div style={{background:"#E8F4ED",borderRadius:10,padding:"7px 14px",fontSize:13,color:V,fontWeight:600}}>
                    👤 {pac.tutor} · {pac.animal?.ei||"🐾"} {pac.animal?.nome||pac.animal}
                  </div>
                  {pac.animal?.restricao&&(
                    <div style={{background:"#FFF0F0",border:`1px solid ${VM}44`,borderRadius:10,padding:"7px 14px",fontSize:12,color:VM,fontWeight:600}}>⚠️ {pac.animal.restricao}</div>
                  )}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <button onClick={()=>{
                      const tut=tutores.find(t=>t.nome===pac.tutor);
                      if(tut) setModalTermo({key:"procedimento",termo:TERMOS.procedimento,tutor:tut,animal:pac.animal});
                    }} style={{background:"#FFF8E8",color:"#B8860B",border:"1px solid #F0D060",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                      📄 Termos
                    </button>
                    <button onClick={()=>{setModal(true);setEtapa(1);}} style={{background:"#F0F4F0",color:V,border:`1px solid ${V}`,borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>➕ Nova Consulta</button>
                  </div>
                </div>

                {/* Abas — 4 abas, label da 1ª muda com o tipo */}
                <div style={{display:"flex",gap:4,marginBottom:12}}>
                  {[
                    {id:"prontuario",icon:tipoAtend==="Vacina"?"💉":tipoAtend==="Retorno"?"🔁":"🩺",label:tipoAtend},
                    {id:"termos",icon:"📄",label:"Termos"},
                    {id:"prescricao",icon:"💊",label:"Prescrição"},
                    {id:"historico",icon:"📁",label:"Histórico"},
                  ].map(ab=>(
                    <button key={ab.id} onClick={()=>setAbaC(ab.id)} style={{
                      flex:1,padding:"9px 6px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",
                      fontSize:12,fontWeight:abaC===ab.id?700:500,
                      background:abaC===ab.id?V:"#fff",
                      color:abaC===ab.id?"#fff":"#666",
                      boxShadow:abaC===ab.id?"0 2px 8px rgba(45,106,79,0.25)":"none",
                      border:abaC===ab.id?"none":"1px solid #E8EDE8",
                    }}>{ab.icon} {ab.label}</button>
                  ))}
                </div>

                {/* ABA PRONTUÁRIO — conteúdo muda por tipo */}
                {abaC==="prontuario"&&(
                  <Card style={{flex:1,overflow:"auto",padding:18}}>
                    {/* Dados animal */}
                    <div style={{display:"flex",gap:10,marginBottom:14}}>
                      <div style={{flex:1,background:"#F0F4F0",borderRadius:10,padding:"10px 12px"}}>
                        <div style={{fontSize:11,color:"#888",marginBottom:2}}>Espécie / Sexo</div>
                        <div style={{fontSize:13,fontWeight:600}}>{pac.animal?.especie||"—"} · {pac.animal?.sexo||"—"}</div>
                      </div>
                      <div style={{flex:1,background:"#F0F4F0",borderRadius:10,padding:"10px 12px"}}>
                        <div style={{fontSize:11,color:"#888",marginBottom:2}}>Idade</div>
                        <div style={{fontSize:13,fontWeight:600}}>{pac.animal?.idade||"—"} anos</div>
                      </div>
                      <div style={{width:95,background:"#F0F4F0",borderRadius:10,padding:"10px 12px"}}>
                        <div style={{fontSize:11,color:"#888",marginBottom:2}}>Peso (kg)</div>
                        <input value={peso} onChange={e=>setPeso(e.target.value)} placeholder="12.5" style={{width:"100%",background:"none",border:"none",fontSize:13,fontWeight:600,fontFamily:"inherit"}}/>
                      </div>
                    </div>

                    {/* Gráfico peso */}
                    <div style={{background:"#F8FBF8",borderRadius:10,padding:12,marginBottom:16,border:"1px solid #E8EDE8"}}>
                      <div style={{fontSize:12,fontWeight:600,color:V,marginBottom:8}}>📊 Histórico de peso (kg)</div>
                      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:52}}>
                        {[11.2,11.8,12.0,11.5,12.3,12.5].map((p,i)=>(
                          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                            <div style={{fontSize:8,color:"#888"}}>{p}</div>
                            <div style={{width:"100%",background:i===5?V:VL,borderRadius:"3px 3px 0 0",height:`${(p/13)*34}px`}}/>
                            <div style={{fontSize:8,color:"#aaa"}}>{["O","N","D","J","F","M"][i]}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:11,color:V,fontWeight:600,marginTop:6}}>▲ +0.2kg desde a última consulta</div>
                    </div>

                    {/* CONSULTA: campos livres */}
                    {tipoAtend==="Consulta"&&(
                      <div>
                        {[{label:"Queixa principal",val:queixa,set:setQueixa,ph:"Descreva o motivo da consulta..."},{label:"Diagnóstico",val:diag,set:setDiag,ph:"Diagnóstico clínico..."}].map((c,i)=>(
                          <div key={i} style={{marginBottom:12}}>
                            <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>{c.label}</label>
                            <textarea value={c.val} onChange={e=>c.set(e.target.value)} placeholder={c.ph} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",resize:"vertical"}}/>
                          </div>
                        ))}
                        <div style={{border:"2px dashed #E8EDE8",borderRadius:10,padding:12,textAlign:"center",color:"#bbb",fontSize:13,cursor:"pointer"}}>📎 Anexar exames ou arquivos</div>
                      </div>
                    )}

                    {/* VACINA: lista por espécie */}
                    {tipoAtend==="Vacina"&&(
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                          <div style={{fontSize:13,fontWeight:700,color:V}}>
                            {pac.animal?.especie==="Gato"?"🐈 Vacinas para Gatos":"🐕 Vacinas para Cães"}
                          </div>
                          <span style={{fontSize:11,color:"#aaa",background:"#F0F4F0",borderRadius:6,padding:"2px 8px"}}>{vacsApl.length} selecionada(s)</span>
                        </div>
                        {(pac.animal?.especie==="Gato"?vacinasGato:vacinasCao).map((vac,i)=>{
                          const sel=vacsApl.includes(vac.nome);
                          return(
                            <button key={i} onClick={()=>setVacsApl(p=>sel?p.filter(x=>x!==vac.nome):[...p,vac.nome])}
                              style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:8,borderRadius:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left",background:sel?V+"0E":"#fff",border:`2px solid ${sel?V:"#E8EDE8"}`}}>
                              <div style={{width:38,height:38,borderRadius:9,background:sel?V:V+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{sel?"✅":"💉"}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:13,fontWeight:sel?700:500,color:sel?V:"#1E1E1E"}}>{vac.nome}</div>
                                <div style={{fontSize:11,color:"#888",marginTop:2}}>{vac.desc}</div>
                                <div style={{fontSize:10,color:"#aaa",marginTop:1}}>Reforço: {vac.periodo}</div>
                              </div>
                            </button>
                          );
                        })}
                        {vacsApl.length>0&&(
                          <div style={{background:"#E8F4ED",borderRadius:10,padding:"10px 14px",marginTop:6,fontSize:12,color:V,fontWeight:500}}>
                            ✅ Selecionadas: {vacsApl.join(", ")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* RETORNO: evolução */}
                    {tipoAtend==="Retorno"&&(
                      <div>
                        <div style={{background:"#F8F8F8",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#555",border:"1px solid #E8EDE8"}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:4}}>ÚLTIMA CONSULTA — 12/01/2026</div>
                          <div><strong>Diagnóstico:</strong> Dermatite alérgica</div>
                          <div style={{marginTop:3}}><strong>Prescrição:</strong> Apoquel 16mg 1x/dia por 10 dias</div>
                        </div>
                        {[{label:"Evolução clínica",val:queixa,set:setQueixa,ph:"Como o animal está em relação à última consulta? Houve melhora?"},{label:"Conduta / Observações",val:diag,set:setDiag,ph:"Manter tratamento, ajustar dose, novo exame..."}].map((c,i)=>(
                          <div key={i} style={{marginBottom:12}}>
                            <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>{c.label}</label>
                            <textarea value={c.val} onChange={e=>c.set(e.target.value)} placeholder={c.ph} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit",resize:"vertical"}}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* ABA PRESCRIÇÃO */}
                {abaC==="prescricao"&&(
                  <Card style={{flex:1,overflow:"auto",padding:18}}>
                    <div style={{fontSize:13,fontWeight:700,color:V,marginBottom:14}}>💊 Prescrição de medicamentos</div>
                    <div style={{position:"relative",marginBottom:14}}>
                      <input value={buscaMed} onChange={e=>{setBuscaMed(e.target.value);setMedSel(null);}} placeholder="🔍 Buscar medicamento..."
                        style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #E8EDE8",fontSize:13,fontFamily:"inherit"}}/>
                      {buscaMed&&!medSel&&(
                        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #E8EDE8",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:10,overflow:"hidden",marginTop:4}}>
                          {medicamentos.filter(m=>m.nome.toLowerCase().includes(buscaMed.toLowerCase())).slice(0,6).map((m,i)=>(
                            <button key={i} onClick={()=>{setMedSel(m);setBuscaMed(m.nome);}}
                              style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",border:"none",background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,textAlign:"left",borderBottom:"1px solid #F0F4F0"}}>
                              <span style={{fontWeight:500}}>{m.nome}</span>
                              <span style={{fontSize:11,color:"#aaa",background:"#F0F4F0",borderRadius:6,padding:"2px 8px"}}>{m.grupo}</span>
                            </button>
                          ))}
                          {medicamentos.filter(m=>m.nome.toLowerCase().includes(buscaMed.toLowerCase())).length===0&&(
                            <div style={{padding:"12px 14px",fontSize:13,color:"#aaa"}}>Nenhum resultado</div>
                          )}
                        </div>
                      )}
                    </div>
                    {medSel&&(
                      <div style={{background:"#F8FBF8",border:`1px solid ${V}44`,borderRadius:12,padding:14,marginBottom:16}}>
                        <div style={{fontSize:13,fontWeight:700,color:V,marginBottom:12}}>{medSel.nome}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                          {[{ph:"Dose",val:medDose,set:setMedDose,label:"Dose"},{ph:"Frequência",val:medFreq,set:setMedFreq,label:"Frequência"},{ph:"Duração",val:medDur,set:setMedDur,label:"Duração"}].map((f,i)=>(
                            <div key={i}>
                              <div style={{fontSize:11,color:"#888",marginBottom:4}}>{f.label}</div>
                              <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"1px solid #E8EDE8",fontSize:12,fontFamily:"inherit"}}/>
                            </div>
                          ))}
                        </div>
                        <input value={medObsP} onChange={e=>setMedObsP(e.target.value)} placeholder="Observações" style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"1px solid #E8EDE8",fontSize:12,fontFamily:"inherit",marginBottom:10}}/>
                        <button onClick={()=>{
                          if(!medDose||!medFreq) return st("⚠️ Preencha dose e frequência.");
                          setPrescricoes(p=>[...p,{med:medSel.nome,dose:medDose,freq:medFreq,dur:medDur,obs:medObsP,uid:Date.now()}]);
                          setMedSel(null);setBuscaMed("");setMedDose("");setMedFreq("");setMedDur("");setMedObsP("");
                          st("💊 Medicamento adicionado!");
                        }} style={{width:"100%",background:V,color:"#fff",border:"none",borderRadius:9,padding:"9px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>➕ Adicionar à prescrição</button>
                      </div>
                    )}
                    {prescricoes.length>0?(
                      <div>
                        {prescricoes.map((p)=>(
                          <div key={p.uid} style={{background:"#fff",border:"1px solid #E8EDE8",borderRadius:12,padding:12,marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                            <div style={{width:36,height:36,borderRadius:9,background:V+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>💊</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:700}}>{p.med}</div>
                              <div style={{fontSize:12,color:"#555",marginTop:2}}>{p.dose} · {p.freq}{p.dur?` · ${p.dur}`:""}</div>
                              {p.obs&&<div style={{fontSize:11,color:"#888",marginTop:2,fontStyle:"italic"}}>{p.obs}</div>}
                            </div>
                            <button onClick={()=>setPrescricoes(pr=>pr.filter(x=>x.uid!==p.uid))} style={{background:"none",border:"none",cursor:"pointer",color:VM,fontSize:17,padding:0,fontFamily:"inherit"}}>×</button>
                          </div>
                        ))}
                        <button onClick={()=>st("📄 Receituário gerado em PDF!")} style={{width:"100%",background:"#F0F4F0",color:V,border:`1px solid ${V}`,borderRadius:10,padding:"11px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>📄 Gerar Receituário PDF</button>
                      </div>
                    ):(
                      <div style={{textAlign:"center",padding:"30px 0",color:"#bbb"}}>
                        <div style={{fontSize:36,marginBottom:8}}>💊</div>
                        <div style={{fontSize:13}}>Busque e adicione medicamentos acima</div>
                      </div>
                    )}
                  </Card>
                )}

                {/* ABA HISTÓRICO */}
                {abaC==="historico"&&(
                  <Card style={{flex:1,overflow:"auto",padding:18}}>
                    <div style={{fontSize:13,fontWeight:700,color:V,marginBottom:14}}>📁 Histórico — {pac.animal?.nome||"Animal"}</div>
                    {historico.map((h,i)=>(
                      <div key={i} style={{borderLeft:`3px solid ${h.tipo==="Consulta"?V:AZ}`,paddingLeft:14,marginBottom:20,position:"relative"}}>
                        <div style={{position:"absolute",left:-8,top:0,width:14,height:14,borderRadius:"50%",background:h.tipo==="Consulta"?V:AZ,border:"2px solid #F0F4F0"}}/>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <Chip cor={h.tipo==="Consulta"?V:AZ}>{h.tipo}</Chip>
                          <div style={{fontSize:11,color:"#aaa"}}>{h.data}</div>
                        </div>
                        <div style={{background:"#fff",border:"1px solid #E8EDE8",borderRadius:10,padding:12}}>
                          {h.queixa!=="—"&&<div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:600,color:"#888"}}>QUEIXA </span><span style={{fontSize:12}}>{h.queixa}</span></div>}
                          <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:600,color:"#888"}}>DIAGNÓSTICO </span><span style={{fontSize:12}}>{h.diag}</span></div>
                          {h.prescricao!=="—"&&<div><span style={{fontSize:11,fontWeight:600,color:"#888"}}>PRESCRIÇÃO </span><span style={{fontSize:12}}>{h.prescricao}</span></div>}
                          <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #F0F4F0",fontSize:11,color:"#888"}}>⚖️ Peso: <strong style={{color:"#333"}}>{h.peso}kg</strong></div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {/* ABA TERMOS — na consulta */}
                {abaC==="termos"&&(()=>{
                  const tutorDados=tutores.find(t=>t.nome===pac.tutor)||{termos:[]};
                  return(
                    <Card style={{flex:1,overflow:"auto",padding:18}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                        <div style={{fontSize:13,fontWeight:700,color:V}}>📄 Termos e Autorizações</div>
                        <div style={{fontSize:11,color:"#888",background:"#F0F4F0",borderRadius:8,padding:"4px 10px"}}>
                          {tutorDados.termos.length} / {Object.keys(TERMOS).length} assinados
                        </div>
                      </div>

                      {/* Barra de progresso */}
                      <div style={{height:6,borderRadius:6,background:"#E8EDE8",marginBottom:16,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:6,background:V,width:`${(tutorDados.termos.length/Object.keys(TERMOS).length)*100}%`,transition:"width 0.4s"}}/>
                      </div>

                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {Object.entries(TERMOS).map(([key,termo])=>{
                          const assinado=tutorDados.termos.includes(key);
                          return(
                            <div key={key} style={{display:"flex",alignItems:"center",gap:12,background:assinado?"#F8FCF9":"#fff",borderRadius:12,padding:"12px 14px",border:`1.5px solid ${assinado?V+"44":"#E8EDE8"}`}}>
                              <div style={{width:40,height:40,borderRadius:10,background:assinado?V:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>
                                <span style={{filter:assinado?"brightness(10)":"none"}}>{termo.icon}</span>
                              </div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:13,fontWeight:600}}>{termo.label}</div>
                                <div style={{fontSize:11,marginTop:2,fontWeight:600,color:assinado?V:"#bbb"}}>
                                  {assinado?"✅ Assinado digitalmente":"— Pendente"}
                                </div>
                              </div>
                              <button onClick={()=>{setModalTermo({key,termo,tutor:tutorDados,animal:pac.animal});setTermoAssinado(assinado);}}
                                style={{background:assinado?"#F0F4F0":V,color:assinado?"#555":"#fff",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                                {assinado?"Ver":"Assinar"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {tutorDados.termos.length===0&&(
                        <div style={{marginTop:14,background:"#FFF8E8",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#888",border:`1px solid ${AM}44`}}>
                          ⚠️ Nenhum termo assinado ainda. Recomendado assinar o Termo LGPD antes de iniciar o atendimento.
                        </div>
                      )}
                    </Card>
                  );
                })()}
              </div>

              {/* Painel lateral itens — toggle drawer */}
              <div style={{width:dr?270:44,flexShrink:0,transition:"width 0.25s ease",display:"flex",flexDirection:"column",position:"relative"}}>
                <button onClick={()=>setDr(v=>!v)} style={{width:44,height:"100%",background:dr?V:"#fff",border:dr?"none":"1px solid #E8EDE8",borderRadius:dr?"12px 0 0 12px":12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"14px 0",boxShadow:dr?"none":"0 2px 8px rgba(0,0,0,0.06)",fontFamily:"inherit",flexShrink:0}}>
                  <span style={{fontSize:18}}>🛒</span>
                  {itens.length>0&&<span style={{background:LA,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{itens.length}</span>}
                  <span style={{fontSize:13,color:dr?"#fff":V}}>{dr?"▶":"◀"}</span>
                </button>
                {dr&&(
                  <div style={{position:"absolute",right:0,top:0,width:226,height:"100%",background:"#fff",borderLeft:"1px solid #E8EDE8",display:"flex",flexDirection:"column",padding:14,zIndex:5}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>🛒 Itens</div>
                    <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginBottom:6}}>ADICIONAR</div>
                    <div style={{flex:1,overflow:"auto"}}>
                      {svcs.map((s,i)=>(
                        <button key={i} onClick={()=>addI(s)} style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"7px 9px",marginBottom:4,background:"#F0F4F0",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>
                          <span>{s.nome}</span><span style={{color:V,fontWeight:600}}>+R${s.valor}</span>
                        </button>
                      ))}
                      {itens.length>0&&(
                        <div style={{marginTop:10}}>
                          <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginBottom:6}}>SELECIONADOS</div>
                          {itens.map(item=>(
                            <div key={item.uid} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",fontSize:12,borderBottom:"1px solid #F0F4F0"}}>
                              <span style={{flex:1,paddingRight:4,fontSize:11}}>{item.nome}</span>
                              <span style={{color:V,fontWeight:700}}>R${item.valor}</span>
                              <button onClick={()=>remI(item.uid)} style={{background:"none",border:"none",cursor:"pointer",color:VM,fontSize:15,lineHeight:1,padding:"0 0 0 5px",fontFamily:"inherit"}}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{borderTop:"1px solid #E8EDE8",paddingTop:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                        <span style={{fontWeight:700,fontSize:13}}>Total</span>
                        <span style={{fontWeight:700,fontSize:15,color:V}}>R$ {sub.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        <button onClick={()=>st("📄 Orçamento gerado!")} style={{background:"#F0F4F0",color:V,border:`1px solid ${V}`,borderRadius:9,padding:"8px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📄 Gerar Orçamento</button>
                        <button onClick={()=>setModalFin(true)} style={{background:"#1E1E1E",color:"#fff",border:"none",borderRadius:9,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✅ Finalizar consulta</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VACINAS */}
          {sec==="vacinas"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {vacinas.map((v,i)=>{
                const cor=v.st==="vencida"?VM:v.st==="vencendo"?LA:V;
                const ic=v.st==="vencida"?"❌":v.st==="vencendo"?"⚠️":"✅";
                return(
                  <Card key={i} style={{display:"flex",alignItems:"center",gap:14,border:`1px solid ${cor}33`}}>
                    <div style={{width:40,height:40,borderRadius:10,background:cor+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{ic}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700}}>{v.animal} <span style={{fontWeight:400,color:"#888",fontSize:12}}>· {v.tutor}</span></div>
                      <div style={{fontSize:12,color:"#555",marginTop:2}}>{v.vacina} · Vencimento: {v.venc}</div>
                    </div>
                    <button onClick={()=>st(`📱 Tutor de ${v.animal} notificado!`)} style={{background:"#F0F4F0",color:V,border:"none",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Notificar</button>
                  </Card>
                );
              })}
            </div>
          )}

          {/* FINANCEIRO */}
          {sec==="financeiro"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[{label:"Recebido",val:"R$ 2.840",cor:V},{label:"Pendente",val:"R$ 480",cor:LA},{label:"Atendimentos",val:"24",cor:AZ}].map((c,i)=>(
                  <Card key={i}><div style={{fontSize:22,fontWeight:700,color:c.cor}}>{c.val}</div><div style={{fontSize:12,color:"#888",marginTop:4}}>{c.label}</div></Card>
                ))}
              </div>
              <Card>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📊 Faturamento — últimos 6 meses</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:10,height:90}}>
                  {meses.map((m,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{fontSize:10,color:"#666"}}>R${(m.v/1000).toFixed(1)}k</div>
                      <div style={{width:"100%",background:i===5?V:VL,borderRadius:"5px 5px 0 0",height:`${(m.v/maxB)*60}px`}}/>
                      <div style={{fontSize:10,color:"#aaa"}}>{m.m}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📋 Lançamentos recentes</div>
                {lancsDin.map((l,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F0F4F0"}}>
                    <div style={{fontSize:11,color:"#bbb",width:44}}>{l.data}</div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.tutor} · {l.animal}</div><div style={{fontSize:11,color:"#888"}}>{l.serv}</div></div>
                    <div style={{fontSize:13,fontWeight:700}}>R$ {l.val}</div>
                    <Chip cor={l.st==="pago"?V:LA}>{l.st==="pago"?"✅ Pago":"⏳ Pendente"}</Chip>
                  </div>
                ))}
              </Card>
              <div style={{background:"#F8F8F8",borderRadius:14,padding:16,border:"2px dashed #E8EDE8",textAlign:"center"}}>
                <button disabled style={{background:"#E8EDE8",color:"#bbb",border:"none",borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:600,cursor:"not-allowed",fontFamily:"inherit"}}>🧾 Em breve: Emitir NFS-e</button>
                <div style={{fontSize:11,color:"#bbb",marginTop:6}}>Disponível em breve</div>
              </div>
            </div>
          )}

          {/* PERFIL */}
          {sec==="perfil"&&(
            <div style={{maxWidth:520}}>
              <Card>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
                  <div style={{width:62,height:62,borderRadius:"50%",background:VL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👨‍⚕️</div>
                  <div>
                    <div style={{fontSize:17,fontWeight:700}}>Dr. Carlos Mendes</div>
                    <div style={{fontSize:13,color:V,fontWeight:600,marginTop:2}}>✅ CRMV-SP 45231</div>
                    <div style={{fontSize:12,color:"#888",marginTop:2}}>Atendimento domiciliar e clínica geral</div>
                  </div>
                </div>
                <div style={{background:"#F0F4F0",borderRadius:12,padding:14,marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:8}}>🔗 Meu link público</div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,background:"#fff",borderRadius:8,padding:"9px 12px",fontSize:13,color:V,fontWeight:500,border:"1px solid #E8EDE8"}}>vetclick.app/drcarlos</div>
                    <button onClick={()=>{setLc(true);st("🔗 Link copiado!");setTimeout(()=>setLc(false),2000);}} style={{background:V,color:"#fff",border:"none",borderRadius:8,padding:"9px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lc?"✅":"Copiar"}</button>
                  </div>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:10}}>⏰ Dias disponíveis</div>
                <div style={{display:"flex",gap:6,marginBottom:16}}>
                  {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((d,i)=>(
                    <div key={d} style={{flex:1,textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#888",marginBottom:4}}>{d}</div>
                      <div style={{height:30,borderRadius:8,background:i<5?V:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:i<5?"#fff":"#ddd"}}>{i<5?"✓":"–"}</div>
                    </div>
                  ))}
                </div>
                {/* WhatsApp automático */}
                <div style={{background:"#F0FFF4",border:"1px solid #25D36633",borderRadius:12,padding:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:22}}>💬</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1E1E1E"}}>WhatsApp Automático</div>
                      <div style={{fontSize:11,color:"#888",marginTop:1}}>3 de 4 mensagens ativas</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,color:"#25D366",background:"#25D36618",borderRadius:6,padding:"3px 8px"}}>● Ativo</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                    {[
                      {label:"Confirmação de agendamento",ativo:true},
                      {label:"Lembrete 1 dia antes",ativo:true},
                      {label:"Receituário após consulta",ativo:false},
                      {label:"Aviso de vacina vencendo",ativo:true},
                    ].map((m,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                        <span style={{color:m.ativo?"#25D366":"#ccc",fontSize:14}}>{m.ativo?"✓":"○"}</span>
                        <span style={{color:m.ativo?"#555":"#bbb"}}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setModalWpp(true)} style={{width:"100%",background:"#25D366",color:"#fff",border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    ⚙️ Configurar mensagens
                  </button>
                </div>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
