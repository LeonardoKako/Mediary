"""
MediDiary — Backend Flask
Banco de dados: SQL Server via pyodbc
"""
import os
import pyodbc
from functools import wraps
from datetime import datetime, date
import calendar as cal_mod
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "medidiary-dev-secret-key-change-in-prod")

# ── Conexão SQL Server ─────────────────────────────────────────────────────────
DB_CONN_STR = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=DESKTOP-LENA;"
    "DATABASE=MediDiary;"
    "UID=dev;"
    "PWD=123456;"
    "TrustServerCertificate=yes;"
)

def get_db():
    return pyodbc.connect(DB_CONN_STR)


# ── Tipos de sintoma disponíveis ───────────────────────────────────────────────
SINTOMAS = [
    {"key": "DOR",         "label": "DOR",        "icon": "💢"},
    {"key": "NAUSEA",      "label": "NÁUSEA",     "icon": "🤢"},
    {"key": "FADIGA",      "label": "FADIGA",     "icon": "😴"},
    {"key": "VERTIGEM",    "label": "VERTIGEM",   "icon": "💫"},
    {"key": "FALTA_AR",    "label": "FALTA DE AR","icon": "😮‍💨"},
    {"key": "TOSSE",       "label": "TOSSE",      "icon": "🤧"},
    {"key": "DIARREIA",    "label": "DIARRÉIA",   "icon": "🚽"},
    {"key": "CONSTIPACAO", "label": "CONSTIPAÇÃO","icon": "🫃"},
    {"key": "COCEIRA",     "label": "COCEIRA",    "icon": "🖐️"},
    {"key": "OUTRO",       "label": "OUTRO",      "icon": "•••"},
]

SUBTIPOS_DOR = [
    "CABEÇA", "ABDOMINAL", "MUSCULAR", "COSTAS",
    "ARTICULAÇÃO", "GARGANTA", "OUTRO"
]


# ── Decorator de autenticação ──────────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "usuario_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


# ── Rotas de Autenticação ──────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def index():
    if "usuario_id" in session:
        return redirect(url_for("calendario"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        senha = request.form.get("senha", "")

        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, nome, senha_hash FROM Usuarios WHERE email = ?", email
            )
            row = cursor.fetchone()
            conn.close()

            if row and check_password_hash(row.senha_hash, senha):
                session["usuario_id"] = row.id
                session["usuario_nome"] = row.nome
                return redirect(url_for("calendario"))
            else:
                flash("E-mail ou senha incorretos.", "erro")
        except Exception as e:
            flash(f"Erro de conexão: {e}", "erro")

    return render_template("login.html")


@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    if request.method == "POST":
        nome  = request.form.get("nome", "").strip()
        email = request.form.get("email", "").strip().lower()
        senha = request.form.get("senha", "")
        conf  = request.form.get("confirmar_senha", "")

        if not nome or not email or not senha:
            flash("Preencha todos os campos.", "erro")
        elif senha != conf:
            flash("As senhas não coincidem.", "erro")
        elif len(senha) < 6:
            flash("A senha deve ter pelo menos 6 caracteres.", "erro")
        else:
            try:
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
                    nome, email, generate_password_hash(senha)
                )
                conn.commit()
                conn.close()
                flash("Conta criada com sucesso! Faça login.", "sucesso")
                return redirect(url_for("login"))
            except pyodbc.IntegrityError:
                flash("E-mail já cadastrado.", "erro")
            except Exception as e:
                flash(f"Erro: {e}", "erro")

    return render_template("cadastro.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# ── Calendário ─────────────────────────────────────────────────────────────────
@app.route("/calendario")
@login_required
def calendario():
    hoje = date.today()
    ano  = int(request.args.get("ano",  hoje.year))
    mes  = int(request.args.get("mes",  hoje.month))

    # Clamp
    if mes < 1:  mes = 12; ano -= 1
    if mes > 12: mes =  1; ano += 1

    # Dias do mês
    _, dias_no_mes = cal_mod.monthrange(ano, mes)
    primeiro_dia   = date(ano, mes, 1)
    dia_semana_ini = primeiro_dia.weekday()  # 0=seg … 6=dom → vamos usar dom=0
    offset = (dia_semana_ini + 1) % 7  # offset para domingo como primeiro col

    # Datas com sintomas
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT CAST(inicio AS DATE) AS dia, COUNT(*) as total
               FROM Sintomas
               WHERE usuario_id = ?
                 AND YEAR(inicio) = ?
                 AND MONTH(inicio) = ?
               GROUP BY CAST(inicio AS DATE)""",
            session["usuario_id"], ano, mes
        )
        dias_com_sintoma = {row.dia: row.total for row in cursor.fetchall()}
        conn.close()
    except Exception:
        dias_com_sintoma = {}

    MESES_PT = [
        "", "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ]

    mes_anterior = {"ano": ano if mes > 1 else ano-1, "mes": mes-1 if mes > 1 else 12}
    mes_proximo  = {"ano": ano if mes < 12 else ano+1, "mes": mes+1 if mes < 12 else 1}

    return render_template(
        "calendario.html",
        ano=ano, mes=mes,
        nome_mes=MESES_PT[mes],
        dias_no_mes=dias_no_mes,
        offset=offset,
        hoje=hoje,
        dias_com_sintoma=dias_com_sintoma,
        mes_anterior=mes_anterior,
        mes_proximo=mes_proximo,
    )


# ── Visualizar dia ─────────────────────────────────────────────────────────────
@app.route("/visualizar/<int:ano>/<int:mes>/<int:dia>")
@login_required
def visualizar(ano, mes, dia):
    data_sel = date(ano, mes, dia)
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, tipo, subtipo, descricao, inicio, fim
               FROM Sintomas
               WHERE usuario_id = ?
                 AND CAST(inicio AS DATE) = ?
               ORDER BY inicio""",
            session["usuario_id"], data_sel
        )
        sintomas = [
            {"id": r.id, "tipo": r.tipo, "subtipo": r.subtipo,
             "descricao": r.descricao, "inicio": r.inicio, "fim": r.fim}
            for r in cursor.fetchall()
        ]
        conn.close()
    except Exception as e:
        flash(f"Erro: {e}", "erro")
        sintomas = []

    MESES_PT = [
        "", "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ]
    return render_template(
        "visualizar.html",
        sintomas=sintomas,
        data_sel=data_sel,
        dia=dia, mes=mes, ano=ano,
        nome_mes=MESES_PT[mes],
    )


# ── Adicionar sintoma ──────────────────────────────────────────────────────────
@app.route("/adicionar", methods=["GET", "POST"])
@login_required
def adicionar():
    data_str = request.args.get("data", str(date.today()))

    if request.method == "POST":
        tipo       = request.form.get("tipo", "")
        subtipo    = request.form.get("subtipo", None) or None
        descricao  = request.form.get("descricao", None) or None
        inicio_str = request.form.get("inicio", "")
        fim_str    = request.form.get("fim", "") or None

        try:
            inicio = datetime.strptime(inicio_str, "%Y-%m-%dT%H:%M")
            fim    = datetime.strptime(fim_str,    "%Y-%m-%dT%H:%M") if fim_str else None
        except ValueError:
            flash("Datas inválidas.", "erro")
            return render_template("adicionar.html", sintomas=SINTOMAS,
                                   subtipos_dor=SUBTIPOS_DOR, data_str=data_str)

        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO Sintomas
                       (usuario_id, tipo, subtipo, descricao, inicio, fim)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                session["usuario_id"], tipo, subtipo, descricao, inicio, fim
            )
            conn.commit()
            conn.close()
            flash("Sintoma adicionado!", "sucesso")
            d = inicio.date()
            return redirect(url_for("visualizar", ano=d.year, mes=d.month, dia=d.day))
        except Exception as e:
            flash(f"Erro ao salvar: {e}", "erro")

    return render_template("adicionar.html", sintomas=SINTOMAS,
                           subtipos_dor=SUBTIPOS_DOR, data_str=data_str)


# ── Editar sintoma ─────────────────────────────────────────────────────────────
@app.route("/editar/<int:sintoma_id>", methods=["GET", "POST"])
@login_required
def editar(sintoma_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, tipo, subtipo, descricao, inicio, fim FROM Sintomas WHERE id=? AND usuario_id=?",
            sintoma_id, session["usuario_id"]
        )
        row = cursor.fetchone()
        conn.close()
    except Exception as e:
        flash(f"Erro: {e}", "erro")
        return redirect(url_for("calendario"))

    if not row:
        flash("Sintoma não encontrado.", "erro")
        return redirect(url_for("calendario"))

    sintoma = {
        "id": row.id, "tipo": row.tipo, "subtipo": row.subtipo,
        "descricao": row.descricao, "inicio": row.inicio, "fim": row.fim
    }

    if request.method == "POST":
        action = request.form.get("action", "salvar")

        if action == "excluir":
            try:
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute(
                    "DELETE FROM Sintomas WHERE id=? AND usuario_id=?",
                    sintoma_id, session["usuario_id"]
                )
                conn.commit()
                conn.close()
                flash("Sintoma excluído.", "sucesso")
                d = row.inicio.date()
                return redirect(url_for("visualizar", ano=d.year, mes=d.month, dia=d.day))
            except Exception as e:
                flash(f"Erro: {e}", "erro")
        else:
            tipo      = request.form.get("tipo", "")
            subtipo   = request.form.get("subtipo", None) or None
            descricao = request.form.get("descricao", None) or None
            inicio_str = request.form.get("inicio", "")
            fim_str    = request.form.get("fim", "") or None
            try:
                inicio = datetime.strptime(inicio_str, "%Y-%m-%dT%H:%M")
                fim    = datetime.strptime(fim_str,    "%Y-%m-%dT%H:%M") if fim_str else None
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute(
                    """UPDATE Sintomas SET tipo=?, subtipo=?, descricao=?,
                       inicio=?, fim=?, atualizado_em=GETDATE()
                       WHERE id=? AND usuario_id=?""",
                    tipo, subtipo, descricao, inicio, fim,
                    sintoma_id, session["usuario_id"]
                )
                conn.commit()
                conn.close()
                flash("Sintoma atualizado!", "sucesso")
                d = inicio.date()
                return redirect(url_for("visualizar", ano=d.year, mes=d.month, dia=d.day))
            except Exception as e:
                flash(f"Erro: {e}", "erro")

    return render_template("editar.html", sintoma=sintoma,
                           sintomas=SINTOMAS, subtipos_dor=SUBTIPOS_DOR)


# ── API JSON (opcional) ────────────────────────────────────────────────────────
@app.route("/api/sintomas/<int:ano>/<int:mes>")
@login_required
def api_sintomas_mes(ano, mes):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, tipo, subtipo, descricao,
                      FORMAT(inicio,'yyyy-MM-ddTHH:mm') AS inicio,
                      FORMAT(fim,   'yyyy-MM-ddTHH:mm') AS fim
               FROM Sintomas
               WHERE usuario_id=? AND YEAR(inicio)=? AND MONTH(inicio)=?
               ORDER BY inicio""",
            session["usuario_id"], ano, mes
        )
        data = [dict(zip([c[0] for c in cursor.description], row))
                for row in cursor.fetchall()]
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
