"""
MediDiary — Backend Flask
Banco de dados: SQL Server via pyodbc
"""
import os
import sqlite3
from flask_cors import CORS
from functools import wraps
from datetime import datetime, date, timedelta
import calendar as cal_mod
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("SECRET_KEY", "medidiary-dev-secret-key-change-in-prod")

# Configurações de Cookie para Cross-Origin (necessário para localhost:5173 -> localhost:5000)
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=False, # True apenas em produção com HTTPS
)

# ── Conexão SQLite ─────────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "mediary.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Usuarios (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            nome       TEXT NOT NULL,
            email      TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL,
            criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Sintomas (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id    INTEGER NOT NULL,
            tipo          TEXT NOT NULL,
            subtipo       TEXT,
            descricao     TEXT,
            inicio        DATETIME NOT NULL,
            fim           DATETIME,
            criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
        )
    """)
    conn.commit()
    conn.close()

init_db()


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
            return jsonify({"error": "Não autorizado"}), 401
        return f(*args, **kwargs)
    return decorated


# ── Rotas de Autenticação ──────────────────────────────────────────────────────
@app.route("/api/me", methods=["GET"])
def me():
    if "usuario_id" in session:
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id, nome, email FROM Usuarios WHERE id = ?", (session["usuario_id"],))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return jsonify({
                    "id": row["id"],
                    "nome": row["nome"],
                    "email": row["email"]
                })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "Não logado"}), 401


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    senha = data.get("senha", "")

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, nome, senha_hash FROM Usuarios WHERE email = ?", (email,)
        )
        row = cursor.fetchone()
        conn.close()

        if row and check_password_hash(row["senha_hash"], senha):
            session["usuario_id"] = row["id"]
            session["usuario_nome"] = row["nome"]
            return jsonify({
                "message": "Login realizado com sucesso",
                "user": {"id": row["id"], "nome": row["nome"]}
            })
        else:
            return jsonify({"error": "E-mail ou senha incorretos"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/cadastro", methods=["POST"])
def cadastro():
    data = request.json
    nome  = data.get("nome", "").strip()
    email = data.get("email", "").strip().lower()
    senha = data.get("senha", "")

    if not nome or not email or not senha:
        return jsonify({"error": "Preencha todos os campos"}), 400
    
    if len(senha) < 6:
        return jsonify({"error": "A senha deve ter pelo menos 6 caracteres"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
            (nome, email, generate_password_hash(senha))
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Conta criada com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "E-mail já cadastrado"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/usuario", methods=["PUT"])
@login_required
def update_usuario():
    data = request.json
    nome = data.get("nome")
    email = data.get("email")
    
    if not nome or not email:
        return jsonify({"error": "Nome e e-mail são obrigatórios"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Usuarios SET nome=?, email=? WHERE id=?",
            (nome, email, session["usuario_id"])
        )
        conn.commit()
        conn.close()
        
        session["usuario_nome"] = nome
        return jsonify({"message": "Perfil atualizado com sucesso", "nome": nome, "email": email})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Este e-mail já está em uso por outro usuário"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/usuario/senha", methods=["PUT"])
@login_required
def update_senha():
    data = request.json
    senha_atual = data.get("senha_atual")
    senha_nova = data.get("senha_nova")
    
    if not senha_atual or not senha_nova:
        return jsonify({"error": "Preencha todos os campos"}), 400
        
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT senha_hash FROM Usuarios WHERE id = ?", (session["usuario_id"],))
        row = cursor.fetchone()
        
        if row and check_password_hash(row["senha_hash"], senha_atual):
            cursor.execute(
                "UPDATE Usuarios SET senha_hash=? WHERE id=?",
                (generate_password_hash(senha_nova), session["usuario_id"])
            )
            conn.commit()
            conn.close()
            return jsonify({"message": "Senha atualizada com sucesso"})
        else:
            conn.close()
            return jsonify({"error": "Senha atual incorreta"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logout realizado com sucesso"})


# Rotas do Calendário agora são via API JSON
@app.route("/api/sintomas/calendario")
@login_required
def api_calendario_info():
    ano = int(request.args.get("ano", date.today().year))
    mes = int(request.args.get("mes", date.today().month))

    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Busca sintomas que podem ter intersecção com o mês solicitado
        cursor.execute(
            """SELECT inicio, fim FROM Sintomas 
               WHERE usuario_id=? 
                 AND (
                    (strftime('%Y-%m', inicio) <= ?)
                    AND
                    (fim IS NULL OR strftime('%Y-%m', fim) >= ?)
                 )
            """,
            (session["usuario_id"], f"{ano}-{mes:02d}", f"{ano}-{mes:02d}")
        )
        rows = cursor.fetchall()
        
        calendario = {}
        for row in rows:
            # Formatos esperados: YYYY-MM-DD ou ISO
            ini_str = row["inicio"][:10]
            fim_str = row["fim"][:10] if row["fim"] else ini_str
            
            try:
                ini_dt = datetime.strptime(ini_str, "%Y-%m-%d").date()
                fim_dt = datetime.strptime(fim_str, "%Y-%m-%d").date()
                
                curr = ini_dt
                while curr <= fim_dt:
                    if curr.year == ano and curr.month == mes:
                        d_str = curr.strftime("%Y-%m-%d")
                        calendario[d_str] = calendario.get(d_str, 0) + 1
                    curr += timedelta(days=1)
            except Exception:
                continue # Pula se houver erro de formato de data
                    
        conn.close()
        return jsonify(calendario)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/sintomas/dia")
@login_required
def api_sintomas_dia():
    data_sel = request.args.get("data") # yyyy-mm-dd
    if not data_sel:
        return jsonify({"error": "Data não informada"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """SELECT id, tipo, subtipo, descricao, inicio, fim
               FROM Sintomas
               WHERE usuario_id = ?
                 AND (
                    (fim IS NULL AND strftime('%Y-%m-%d', inicio) = ?)
                    OR
                    (fim IS NOT NULL AND strftime('%Y-%m-%d', inicio) <= ? AND strftime('%Y-%m-%d', fim) >= ?)
                 )
               ORDER BY inicio""",
            (session["usuario_id"], data_sel, data_sel, data_sel)
        )
        sintomas = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(sintomas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/sintomas", methods=["POST"])
@login_required
def api_adicionar_sintoma():
    data = request.json
    tipo       = data.get("tipo", "")
    subtipo    = data.get("subtipo")
    descricao  = data.get("descricao")
    inicio     = data.get("inicio") # ISO string
    fim        = data.get("fim")    # ISO string ou null

    if not tipo or not inicio:
        return jsonify({"error": "Tipo e início são obrigatórios"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO Sintomas
                   (usuario_id, tipo, subtipo, descricao, inicio, fim)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (session["usuario_id"], tipo, subtipo, descricao, inicio, fim)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Sintoma adicionado com sucesso"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/sintomas/<int:sintoma_id>", methods=["PUT", "DELETE"])
@login_required
def api_sintoma_detail(sintoma_id):
    if request.method == "DELETE":
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM Sintomas WHERE id=? AND usuario_id=?",
                (sintoma_id, session["usuario_id"])
            )
            conn.commit()
            conn.close()
            return jsonify({"message": "Sintoma excluído"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    # PUT (Editar)
    data = request.json
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Busca o sintoma atual para preencher campos ausentes
        cursor.execute("SELECT * FROM Sintomas WHERE id=? AND usuario_id=?", (sintoma_id, session["usuario_id"]))
        sintoma_atual = cursor.fetchone()
        
        if not sintoma_atual:
            conn.close()
            return jsonify({"error": "Sintoma não encontrado"}), 404
            
        tipo      = data.get("tipo", sintoma_atual["tipo"])
        subtipo   = data.get("subtipo", sintoma_atual["subtipo"])
        descricao = data.get("descricao", sintoma_atual["descricao"])
        inicio    = data.get("inicio", sintoma_atual["inicio"])
        fim       = data.get("fim", sintoma_atual["fim"])

        cursor.execute(
            """UPDATE Sintomas SET tipo=?, subtipo=?, descricao=?,
               inicio=?, fim=?, atualizado_em=CURRENT_TIMESTAMP
               WHERE id=? AND usuario_id=?""",
            (tipo, subtipo, descricao, inicio, fim, sintoma_id, session["usuario_id"])
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Sintoma atualizado"})
    except Exception as e:
        if 'conn' in locals(): conn.close()
        return jsonify({"error": str(e)}), 500


# ── API de Sintomas por Mês ───────────────────────────────────────────────────
@app.route("/api/sintomas/mes/<int:ano>/<int:mes>")
@login_required
def api_sintomas_mes(ano, mes):
    try:
        conn = get_db()
        cursor = conn.cursor()
        # Busca sintomas que abrangem qualquer parte do mês
        cursor.execute(
            """SELECT id, tipo, subtipo, descricao, inicio, fim
               FROM Sintomas
               WHERE usuario_id=? 
                 AND (
                    (strftime('%Y-%m', inicio) <= ?)
                    AND
                    (fim IS NULL OR strftime('%Y-%m', fim) >= ?)
                 )
               ORDER BY inicio""",
            (session["usuario_id"], f"{ano}-{mes:02d}", f"{ano}-{mes:02d}")
        )
        data = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
