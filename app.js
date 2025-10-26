/* app.js - funcionalidades comuns: carrossel, chatbot, cadastro em localStorage, perfil */
document.addEventListener('DOMContentLoaded', ()=>{

  /* ===== CARROSSEL =====
     Edite as imagens em assets/images/carousel-1.jpg etc.
  */
  const carouselEl = document.querySelector('.carousel-inner');
  const dotsEl = document.querySelector('.carousel-dots');
  if(carouselEl && dotsEl){
    const imgs = Array.from(carouselEl.querySelectorAll('img'));
    let idx = 0;
    function show(i){
      imgs.forEach((im, k)=> im.style.display = (k===i)?'block':'none');
      const dots = dotsEl.querySelectorAll('.dot');
      dots.forEach((d,k)=> d.classList.toggle('active', k===i));
    }
    // init dots
    imgs.forEach((_,i)=>{
      const d = document.createElement('div'); d.className='dot'; if(i===0) d.classList.add('active');
      d.addEventListener('click',()=>{ idx=i; show(i); });
      dotsEl.appendChild(d);
    });
    show(0);
    setInterval(()=>{ idx=(idx+1)%imgs.length; show(idx); },4000);
  }

  /* ===== CHATBOT JUKA - simples (respostas predefinidas) ===== */
  const chatBtn = document.querySelector('.chatbot');
  const chatWindow = document.querySelector('.chat-window');
  const chatForm = document.querySelector('#chat-form');
  const chatInput = document.querySelector('#chat-input');
  const chatMessages = document.querySelector('.chat-messages');
  function appendMsg(text, who='juka'){
    const div = document.createElement('div'); div.className = 'msg '+(who==='user'?'user':'juka'); div.textContent=text;
    chatMessages.appendChild(div); chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  if(chatBtn){
    chatBtn.addEventListener('click', ()=> { chatWindow.style.display = (chatWindow.style.display==='flex')? 'none':'flex'; chatWindow.style.flexDirection='column'; });
  }
  if(chatForm){
    chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const t = chatInput.value.trim(); if(!t) return;
      appendMsg(t, 'user');
      chatInput.value='';
      // respostas simples
      setTimeout(()=>{
        const lower = t.toLowerCase();
        if(lower.includes('onde') || lower.includes('local') || lower.includes('como chegar')) appendMsg('Posso abrir o mapa da trilha ou te orientar. Deseja ver a página de Trilhas?');
        else if(lower.includes('comprar') || lower.includes('produto') || lower.includes('loja')) appendMsg('Na seção "Produtos" você encontra artesanatos. Quer que eu abra a página de Produtos?');
        else if(lower.includes('contato') || lower.includes('parceria')) appendMsg('Você pode nos contatar pelo e-mail: contato@juqui-explorer.com ou pelo Instagram listado no rodapé.');
        else appendMsg('Olá! Eu sou a Juka 🦫 (capivara mascote). Posso ajudar com Trilhas, Cachoeiras, Pousadas ou Produtos. Pergunte-me!');
      },700);
    });
  }

  /* ===== CADASTRO / PERFIL (localStorage) ===== */
  const formRegister = document.querySelector('#register-form');
  const profileBtn = document.querySelector('#open-profile');
  const profileModal = document.querySelector('#profile-modal');
  const profileClose = document.querySelector('#profile-close');
  const profileForm = document.querySelector('#profile-form');
  const btnLogout = document.querySelector('#btn-logout');

  function getUser(){ try{ return JSON.parse(localStorage.getItem('juqui_user'))||null;}catch(e){return null}}
  function setUser(u){ localStorage.setItem('juqui_user', JSON.stringify(u)); updateUI(); }

  function updateUI(){
    const user = getUser();
    const elUser = document.querySelector('#nav-user');
    if(elUser){
      if(user) elUser.textContent = user.name || user.email;
      else elUser.textContent = 'Entrar / Cad.';
    }
  }

  if(formRegister){
    formRegister.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData(formRegister);
      const user = {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone')
      };
      setUser(user);
      alert('Cadastro salvo localmente. Para tornar funcional com vendas precisará integrar um back-end.');
      formRegister.reset();
    });
  }

  if(profileBtn){
    profileBtn.addEventListener('click', ()=> profileModal.style.display='flex');
  }
  if(profileClose){
    profileClose.addEventListener('click', ()=> profileModal.style.display='none');
  }
  if(profileForm){
    profileForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData(profileForm);
      const user = getUser() || {};
      user.name = fd.get('name');
      user.email = fd.get('email');
      user.phone = fd.get('phone');
      setUser(user);
      profileModal.style.display='none';
      alert('Perfil atualizado.');
    });
  }
  if(btnLogout){
    btnLogout.addEventListener('click', ()=>{
      localStorage.removeItem('juqui_user'); updateUI(); alert('Você saiu.');
    });
  }
  updateUI();

  /* Close modals on outside click */
  document.querySelectorAll('.modal').forEach(mod=>{
    mod.addEventListener('click', (e)=>{
      if(e.target === mod) mod.style.display='none';
    })
  });

  /* Mobile menu toggler */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if(toggle && nav) toggle.addEventListener('click', ()=> nav.style.display = (nav.style.display==='flex')?'none':'flex');

});
