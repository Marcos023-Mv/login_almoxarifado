/* ════════════════════════════════════════════
   criar_conta.js
   Sem back-end: salva usuários no localStorage
   ════════════════════════════════════════════ */

const form            = document.getElementById('criarContaForm');
const msgEl           = document.getElementById('msg');

const senhaInput      = document.getElementById('senha');
const confirmarInput  = document.getElementById('confirmarSenha');

const toggleSenha     = document.getElementById('toggleSenha');
const toggleConfirmar = document.getElementById('toggleConfirmar');

const eyeSenha        = document.getElementById('eyeIconSenha');
const eyeConfirmar    = document.getElementById('eyeIconConfirmar');

const strengthWrap    = document.getElementById('strengthWrap');
const strengthFill    = document.getElementById('strengthFill');
const strengthLabel   = document.getElementById('strengthLabel');
const matchHint       = document.getElementById('matchHint');

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

/* ── Mostrar / ocultar senha ── */
function criarToggle(btn, input, icon) {
  let visivel = false;
  btn.addEventListener('click', () => {
    visivel        = !visivel;
    input.type     = visivel ? 'text' : 'password';
    icon.innerHTML = visivel ? OLHO_FECHADO : OLHO_ABERTO;
    btn.title      = visivel ? 'Ocultar senha' : 'Mostrar senha';
  });
}

criarToggle(toggleSenha,     senhaInput,     eyeSenha);
criarToggle(toggleConfirmar, confirmarInput, eyeConfirmar);

/* ── Força da senha ── */
function avaliarForca(senha) {
  if (!senha) return null;
  let pontos = 0;
  if (senha.length >= 8)           pontos++;
  if (/[A-Z]/.test(senha))        pontos++;
  if (/[0-9]/.test(senha))        pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return { classe: 'fraca', texto: 'Fraca' };
  if (pontos === 2) return { classe: 'media', texto: 'Média' };
  if (pontos === 3) return { classe: 'boa',   texto: 'Boa'   };
  return               { classe: 'forte', texto: 'Forte' };
}

senhaInput.addEventListener('input', () => {
  const val    = senhaInput.value;
  const result = avaliarForca(val);

  if (!val) {
    strengthWrap.classList.remove('visible');
    strengthFill.className    = 'strength-fill';
    strengthLabel.className   = 'strength-label';
    strengthLabel.textContent = '';
    return;
  }

  strengthWrap.classList.add('visible');
  strengthFill.className    = 'strength-fill ' + result.classe;
  strengthLabel.className   = 'strength-label ' + result.classe;
  strengthLabel.textContent = result.texto;

  if (confirmarInput.value) verificarMatch();
});

/* ── Verificar match ── */
function verificarMatch() {
  const s = senhaInput.value;
  const c = confirmarInput.value;

  if (!c) {
    matchHint.textContent = '';
    matchHint.className   = 'match-hint';
    return true;
  }

  if (s === c) {
    matchHint.textContent = '✓ Senhas coincidem';
    matchHint.className   = 'match-hint ok';
    return true;
  } else {
    matchHint.textContent = '✗ As senhas não coincidem';
    matchHint.className   = 'match-hint erro';
    return false;
  }
}

confirmarInput.addEventListener('input', verificarMatch);

/* ── Mensagens ── */
function showMsg(texto, tipo) {
  msgEl.textContent = texto;
  msgEl.className   = 'msg ' + tipo;
}

function clearMsg() {
  msgEl.textContent = '';
  msgEl.className   = 'msg';
}

/* ── Validação de usuário ── */
function validarUsuario(valor) {
  return /^[a-zA-Z0-9_]+$/.test(valor);
}

/* ── Submit: salva no localStorage e redireciona ── */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearMsg();

  const nome      = document.getElementById('nome').value.trim();
  const usuario   = document.getElementById('usuario').value.trim();
  const senha     = senhaInput.value;
  const confirmar = confirmarInput.value;

  /* Validações */
  if (!nome) {
    showMsg('Por favor, informe o nome completo.', 'error');
    document.getElementById('nome').focus();
    return;
  }

  if (!usuario) {
    showMsg('Por favor, escolha um nome de usuário.', 'error');
    document.getElementById('usuario').focus();
    return;
  }

  if (!validarUsuario(usuario)) {
    showMsg('Usuário inválido: use apenas letras, números e underline (_).', 'error');
    document.getElementById('usuario').focus();
    return;
  }

  if (!senha) {
    showMsg('Por favor, crie uma senha.', 'error');
    senhaInput.focus();
    return;
  }

  const forca = avaliarForca(senha);
  if (forca && forca.classe === 'fraca') {
    showMsg('Senha muito fraca. Use letras maiúsculas, números e símbolos.', 'error');
    senhaInput.focus();
    return;
  }

  if (!verificarMatch()) {
    showMsg('As senhas não coincidem.', 'error');
    confirmarInput.focus();
    return;
  }

  /* Verifica se usuário já existe */
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const jaExiste = usuarios.find(u => u.usuario === usuario);

  if (jaExiste) {
    showMsg('Este nome de usuário já está em uso. Escolha outro.', 'error');
    document.getElementById('usuario').focus();
    return;
  }

  /* Salva novo usuário */
  usuarios.push({ nome, usuario, senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  /* Avisa a tela de login e redireciona */
  sessionStorage.setItem('contaCriada', '1');
  window.location.href = 'login.html';
});
