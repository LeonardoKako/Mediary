# MediDiary 🏥

Diário médico web desenvolvido com Python (Flask), HTML, CSS e SQL Server.

---

## Estrutura do Projeto

```
medidiary/
├── app.py                  ← Backend Flask (rotas, lógica)
├── schema.sql              ← Script SQL Server (banco + tabelas)
├── requirements.txt        ← Dependências Python
├── templates/
│   ├── base.html           ← Layout base
│   ├── login.html          ← Tela de login
│   ├── cadastro.html       ← Tela de cadastro
│   ├── calendario.html     ← Calendário mensal
│   ├── visualizar.html     ← Sintomas do dia selecionado
│   ├── adicionar.html      ← Formulário para novo sintoma
│   └── editar.html         ← Editar / excluir sintoma
└── static/
    └── css/
        └── style.css       ← Estilos completos
```

---

## Pré-requisitos

- Python 3.10+
- SQL Server (local ou remoto) com ODBC Driver 17
- pip

---

## Configuração

### 1. Banco de dados

Abra o SQL Server Management Studio (SSMS) ou Azure Data Studio e execute:

```sql
-- Execute o arquivo schema.sql
```

### 2. Dependências Python

```bash
pip install -r requirements.txt
```

### 3. Configurar a conexão

Edite a variável `DB_CONN_STR` em `app.py`:

```python
DB_CONN_STR = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"        # ← seu servidor
    "DATABASE=MediDiary;"
    "UID=sa;"                  # ← seu usuário
    "PWD=SuaSenha123!;"        # ← sua senha
    "TrustServerCertificate=yes;"
)
```

### 4. Executar

```bash
python app.py
```

Acesse: http://localhost:5000

---

## Telas

| Rota | Descrição |
|------|-----------|
| `/login` | Login com e-mail e senha |
| `/cadastro` | Criar nova conta |
| `/calendario` | Calendário mensal com marcação de dias com sintomas |
| `/visualizar/<ano>/<mes>/<dia>` | Lista de sintomas do dia |
| `/adicionar` | Adicionar novo sintoma |
| `/editar/<id>` | Editar ou excluir sintoma existente |
| `/api/sintomas/<ano>/<mes>` | API JSON dos sintomas do mês |

---

## Sintomas disponíveis

| Chave | Exibição |
|-------|---------|
| DOR | Dor (com subtipo: Cabeça, Abdominal, Muscular, Costas, Articulação, Garganta) |
| NAUSEA | Náusea |
| FADIGA | Fadiga |
| VERTIGEM | Vertigem |
| FALTA_AR | Falta de Ar |
| TOSSE | Tosse |
| DIARREIA | Diarréia |
| CONSTIPACAO | Constipação |
| COCEIRA | Coceira |
| OUTRO | Outro (campo livre) |

---

## Segurança

- Senhas armazenadas com hash (Werkzeug `generate_password_hash`)
- Sessões Flask protegidas por `SECRET_KEY`
- Todos os dados filtrados por `usuario_id` da sessão
- Para produção, defina `SECRET_KEY` via variável de ambiente
