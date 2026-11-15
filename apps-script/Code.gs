/**
 * Backend gratuito da Agenda de Eventos de Maués (Google Apps Script).
 * - doPost: recebe o cadastro do formulário da página e grava na aba "Cadastros" (status "pendente").
 * - doGet: devolve em JSON apenas as linhas com status "aprovado", SEM o contato do organizador.
 * Moderação: na planilha, troque o status de "pendente" para "aprovado".
 */
const ABA = 'Cadastros';
const COLUNAS = ['data_envio','status','nome','cat','local','area','data','sem','hora','preco','org','desc','contato','origem'];

function aba_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(ABA);
  if (!sh) { sh = ss.insertSheet(ABA); sh.appendRow(COLUNAS); }
  return sh;
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const t = (v) => String(v == null ? '' : v).slice(0, 500);
  aba_().appendRow([
    new Date(), 'pendente', t(d.nome), t(d.cat), t(d.local), t(d.area),
    t(d.data), t(d.sem), t(d.hora), t(d.preco), t(d.org), t(d.desc), t(d.contato), t(d.origem)
  ]);
  return ContentService.createTextOutput('ok');
}

function doGet() {
  const sh = aba_();
  const rows = sh.getDataRange().getValues();
  const head = rows.shift();
  const tz = 'America/Manaus';
  const out = rows
    .map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])))
    .filter(o => String(o.status).toLowerCase() === 'aprovado')
    .map((o, i) => ({
      id: 'p' + i,
      nome: o.nome, cat: o.cat, local: o.local, area: o.area,
      data: o.data instanceof Date ? Utilities.formatDate(o.data, tz, 'yyyy-MM-dd') : String(o.data || ''),
      sem: o.sem === '' ? '' : o.sem,
      hora: o.hora instanceof Date ? Utilities.formatDate(o.hora, tz, 'HH:mm') : String(o.hora || ''),
      preco: o.preco, org: o.org, desc: o.desc, status: 'confirmado'
    }));
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
