# Agenda de Eventos de Maués

Agenda gratuita com os eventos de Maués (AM): festas, esportes, eventos religiosos, beneficentes e culturais, na sede e na zona rural.

- `index.html` — a página (sem dependências).
- `eventos.json` — os eventos publicados. Para incluir um evento, edite este arquivo.
- `apps-script/Code.gs` — backend opcional (Google Apps Script + planilha) para receber cadastros pelo formulário da página e devolver os eventos aprovados.

## Publicação
Settings → Pages → Branch `main` / pasta `/ (root)`.

## Ativar o formulário
1. Crie uma planilha no Google Sheets → Extensões → Apps Script → cole `apps-script/Code.gs`.
2. Implantar → Nova implantação → Aplicativo da Web → Executar como: eu; Quem tem acesso: qualquer pessoa.
3. Copie a URL gerada e coloque em `CONFIG.FORM_ENDPOINT` e `CONFIG.EVENTS_URL` no `index.html`.
4. Para aprovar um cadastro, mude `pendente` para `aprovado` na planilha.

## Privacidade
Este repositório é público. Não inclua dados pessoais; contatos de organizadores ficam só na planilha.
