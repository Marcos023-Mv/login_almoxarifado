/* ════════════════════════════════════════
   script.js — Login
   Sem back-end: usuários ficam no
   localStorage (criados em criar_conta.html)
   ════════════════════════════════════════ */

const toggleBtn  = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');
const eyeIcon    = document.getElementById('eyeIcon');
const loginForm  = document.getElementById('loginForm');
const msgEl      = document.getElementById('msg');

/* ── SVG olho ── */
const OLHO_ABERTO = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>`;

const OLHO_FECHADO = `
  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
           a18.45 18.45 0 015.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8
           a18.5 18.5 0 01-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>`;

let senhaVisivel = false;

toggleBtn.addEventListener('click', () => {
  senhaVisivel       = !senhaVisivel;
  senhaInput.type    = senhaVisivel ? 'text' : 'password';
  eyeIcon.innerHTML  = senhaVisivel ? OLHO_FECHADO : OLHO_ABERTO;
  toggleBtn.title    = senhaVisivel ? 'Ocultar senha' : 'Mostrar senha';
});

/* ── Mensagens ── */
function showMsg(texto, tipo) {
  msgEl.textContent = texto;
  msgEl.className   = 'msg ' + tipo;
}

function clearMsg() {
  msgEl.textContent = '';
  msgEl.className   = 'msg';
}

/* ── Aviso de conta criada (vindo da outra página) ── */
window.addEventListener('load', () => {
  if (sessionStorage.getItem('contaCriada')) {
    showMsg('Conta criada com sucesso! Faça login.', 'success');
    sessionStorage.removeItem('contaCriada');
  }
});

/* ── Login: valida contra usuários salvos no localStorage ── */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearMsg();

  const usuario = document.getElementById('usuario').value.trim();
  const senha   = senhaInput.value;

  if (!usuario || !senha) {
    showMsg('Por favor, preencha o usuário e a senha.', 'error');
    return;
  }

  /* Lê lista de usuários cadastrados */
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const encontrado = usuarios.find(
    u => u.usuario === usuario && u.senha === senha
  );

  if (encontrado) {
    /* Salva sessão e redireciona */
    sessionStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
    showMsg('Bem-vindo, ' + encontrado.nome + '!', 'success');
    /* Aqui você redireciona para a página principal do sistema */
    /* window.location.href = 'dashboard.html'; */
  } else {
    showMsg('Usuário ou senha inválidos.', 'error');
  }
});

/* Enter no campo usuário vai para senha */
document.getElementById('usuario').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    senhaInput.focus();
  }
});
