/**
 * Backend gratuito da Tá Rolando em Maués (Google Apps Script).
 * - doPost: recebe o cadastro do formulário da página e grava na primeira aba da planilha (status "pendente").
 * - doGet: devolve em JSON apenas as linhas com status "aprovado", SEM o contato do organizador.
 * Moderação: na planilha, troque o status de "pendente" para "aprovado".
 */
/* ID da planilha (trecho da URL entre /d/ e /edit). Vazio = usa a planilha à qual o script está ligado. */
const PLANILHA_ID = '';
const COLUNAS = ['data_envio','status','nome','cat','local','area','data','sem','hora','preco','org','desc','contato','origem'];

function aba_() {
  const ss = PLANILHA_ID ? SpreadsheetApp.openById(PLANILHA_ID) : SpreadsheetApp.getActive();
  const sh = ss.getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(COLUNAS);
  return sh;
}

function ehData_(v) {
  return Object.prototype.toString.call(v) === '[object Date]';
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const t = (v) => String(v == null ? '' : v).slice(0, 500);
  const sh = aba_();
  sh.appendRow([
    new Date(), 'pendente', t(d.nome), t(d.cat), t(d.local), t(d.area),
    t(d.data), t(d.sem), t(d.hora), t(d.preco), t(d.org), t(d.desc), t(d.contato), t(d.origem)
  ]);
  // Mantém data (col. 7) e hora (col. 9) como texto, para o Sheets não converter em data/hora.
  const linha = sh.getLastRow();
  sh.getRange(linha, 7).setNumberFormat('@').setValue(t(d.data));
  sh.getRange(linha, 9).setNumberFormat('@').setValue(t(d.hora));
  return ContentService.createTextOutput('ok');
}

function doGet() {
  const sh = aba_();
  const range = sh.getDataRange();
  const rows = range.getValues();
  const shown = range.getDisplayValues();
  const head = rows.shift();
  shown.shift();
  const tz = 'America/Manaus';
  const out = [];
  rows.forEach((r, n) => {
    const o = Object.fromEntries(head.map((h, i) => [h, r[i]]));
    const v = Object.fromEntries(head.map((h, i) => [h, shown[n][i]]));
    if (String(o.status).trim().toLowerCase() !== 'aprovado') return;
    const data = ehData_(o.data) ? Utilities.formatDate(o.data, tz, 'yyyy-MM-dd') : String(o.data || '').trim();
    const hora = ehData_(o.hora) ? String(v.hora).trim().slice(0, 5) : String(o.hora || '').trim();
    out.push({
      id: 'p' + n,
      nome: o.nome, cat: o.cat, local: o.local, area: o.area,
      data: data,
      sem: o.sem === '' ? '' : o.sem,
      hora: hora,
      preco: o.preco, org: o.org, desc: o.desc, status: 'confirmado'
    });
  });
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
