


function setErro(campoId, erroId, texto) {
  var campo = document.getElementById(campoId);
  document.getElementById(erroId).textContent = texto;
  if (campo) campo.classList.toggle("is-invalid", texto !== "");
  return texto === "";
}

function mostrarResultado(msgId, ok, texto) {
  var msg = document.getElementById(msgId);
  msg.textContent = ok ? texto : "";
  msg.className = ok ? "text-center fw-semibold text-success mt-3" : "mt-3";
}


function validarEmail(v) {
  if (v === "") return "Informe o e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mail inválido.";
  return "";
}

function validarSenhaLogin(v) {
  if (v === "") return "Informe a senha.";
  if (v.length < 6) return "A senha deve ter ao menos 6 caracteres.";
  return "";
}

function validarNome(v) {
  if (v === "") return "Informe o nome.";
  if (!/^[A-Za-zÀ-ÿ' ]+$/.test(v)) return "Use apenas letras no nome.";
  if (v.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
  return "";
}

function validarSenhaForte(v) {
  if (v.length < 8) return "A senha deve ter ao menos 8 caracteres.";
  if (!/[A-Za-z]/.test(v)) return "Inclua ao menos uma letra.";
  if (!/[0-9]/.test(v)) return "Inclua ao menos um número.";
  return "";
}


function validarConfirmacao(v) {
  var senha = document.getElementById("senhaCad").value;
  if (v === "") return "Confirme a senha.";
  if (v !== senha) return "As senhas não conferem.";
  return "";
}

function validarCurso(v) { return v === "" ? "Escolha um curso." : ""; }
function validarBio(v)   { return v.trim().length < 10 ? "Escreva ao menos 10 caracteres." : ""; }



function validarAoDigitar(campoId, erroId, regra) {
  var campo = document.getElementById(campoId);
  var executar = function () {
    var ehSenha = campoId.indexOf("senha") === 0 || campoId === "confirmaSenha";
    var valor = ehSenha ? campo.value : campo.value.trim(); 
    setErro(campoId, erroId, regra(valor));
  };
  campo.addEventListener("input", executar);
  campo.addEventListener("blur", executar);
  if (campo.tagName === "SELECT") campo.addEventListener("change", executar);
}


function atualizarForcaSenha(senha) {
  var pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  var niveis = ["", "Fraca", "Razoável", "Boa", "Forte"];
  var cores = ["bg-secondary", "bg-danger", "bg-warning", "bg-info", "bg-success"];
  var barra = document.getElementById("forcaBarra");
  barra.style.width = (senha === "" ? 0 : pontos * 25) + "%";
  barra.className = "progress-bar " + cores[senha === "" ? 0 : pontos];
  document.getElementById("forcaTexto").textContent = senha === "" ? "" : "Força: " + niveis[pontos];
}



function iniciarLogin() {
  var form = document.getElementById("formLogin");
  var senha = document.getElementById("senha");


  document.getElementById("toggleSenha").addEventListener("click", function () {
    var oculta = senha.type === "password";
    senha.type = oculta ? "text" : "password";
    this.textContent = oculta ? "Ocultar" : "Mostrar";
  });


  ["linkCadastro", "linkRecuperar"].forEach(function (id) {
    document.getElementById(id).addEventListener("click", function (e) { e.preventDefault(); });
  });


  validarAoDigitar("email", "erroEmail", validarEmail);
  validarAoDigitar("senha", "erroSenha", validarSenhaLogin);

 
  form.onsubmit = function (event) {
    event.preventDefault(); 

    var okEmail = setErro("email", "erroEmail", validarEmail(document.getElementById("email").value.trim()));
    var okSenha = setErro("senha", "erroSenha", validarSenhaLogin(senha.value));
    var ok = okEmail && okSenha;

    mostrarResultado("msgLogin", ok, "Login validado com sucesso!");
    if (ok) {
      console.log("Dados do login:", {
        email: document.getElementById("email").value.trim(),
        lembrar: document.getElementById("lembrar").checked
      });
    }
  };
}




function capturarDados() {
  var form = document.getElementById("formCadastro");
  var genero = form.querySelector('input[name="genero"]:checked');
  var interesses = Array.prototype.map.call(
    form.querySelectorAll('input[name="interesses"]:checked'),
    function (i) { return i.value; }
  );
  return {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("emailCad").value.trim(),
    genero: genero ? genero.value : "",
    curso: document.getElementById("curso").value,
    interesses: interesses,
    bio: document.getElementById("bio").value.trim()
  };
}


function atualizarResumo() {
  var d = capturarDados();
  document.getElementById("resumo").innerHTML =
    "<strong>Nome:</strong> " + (d.nome || "-") +
    "<br><strong>E-mail:</strong> " + (d.email || "-") +
    "<br><strong>Gênero:</strong> " + (d.genero || "-") +
    "<br><strong>Curso:</strong> " + (d.curso || "-") +
    "<br><strong>Interesses:</strong> " + (d.interesses.join(", ") || "-");
}

function iniciarCadastro() {
  var form = document.getElementById("formCadastro");
  var bio = document.getElementById("bio");


  validarAoDigitar("nome", "erroNome", validarNome);
  validarAoDigitar("emailCad", "erroEmailCad", validarEmail);
  validarAoDigitar("senhaCad", "erroSenhaCad", validarSenhaForte);
  validarAoDigitar("confirmaSenha", "erroConfirma", validarConfirmacao);
  validarAoDigitar("curso", "erroCurso", validarCurso);
  validarAoDigitar("bio", "erroBio", validarBio);


  document.getElementById("senhaCad").addEventListener("input", function () {
    atualizarForcaSenha(this.value);
    var conf = document.getElementById("confirmaSenha");
    if (conf.value !== "") setErro("confirmaSenha", "erroConfirma", validarConfirmacao(conf.value));
  });


  bio.addEventListener("input", function () {
    document.getElementById("contador").textContent = bio.value.length + "/200";
  });

  
  form.addEventListener("input", atualizarResumo);
  form.addEventListener("change", atualizarResumo);

  
  form.onsubmit = function (event) {
    event.preventDefault();
    var d = capturarDados();
    var ok = true;

    ok = setErro("nome", "erroNome", validarNome(d.nome)) && ok;
    ok = setErro("emailCad", "erroEmailCad", validarEmail(d.email)) && ok;
    ok = setErro("senhaCad", "erroSenhaCad", validarSenhaForte(document.getElementById("senhaCad").value)) && ok;
    ok = setErro("confirmaSenha", "erroConfirma", validarConfirmacao(document.getElementById("confirmaSenha").value)) && ok;
    ok = setErro("curso", "erroCurso", validarCurso(d.curso)) && ok;
    ok = setErro("bio", "erroBio", validarBio(d.bio)) && ok;

    
    document.getElementById("erroGenero").textContent = d.genero ? "" : "Selecione uma opção.";
    ok = d.genero !== "" && ok;

    document.getElementById("erroInteresses").textContent = d.interesses.length ? "" : "Marque ao menos um interesse.";
    ok = d.interesses.length > 0 && ok;

    var termos = document.getElementById("termos").checked;
    document.getElementById("erroTermos").textContent = termos ? "" : "Você precisa aceitar os termos.";
    ok = termos && ok;


    mostrarResultado("msgCadastro", ok, "Cadastro validado com sucesso!");
    var saida = document.getElementById("resultado");
    if (ok) {
      saida.textContent = JSON.stringify(d, null, 2); 
      saida.classList.remove("d-none");
    } else {
      saida.classList.add("d-none");
    }
  };
}



if (document.getElementById("formLogin")) iniciarLogin();
if (document.getElementById("formCadastro")) iniciarCadastro();
