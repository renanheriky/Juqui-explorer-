/* app.js - funcionalidades globais: carrossel, chat Juka, perfil (localStorage),
   acessibilidade (contraste, tamanho da fonte, leitura por voz),
   e carregamento de dados para páginas de detalhe.
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------ SKIP LINK focus helper ------------------ */
  document.querySelectorAll('a.skip-link').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if(target) { target.setAttribute('tabindex','-1'); target.focus(); window.scrollTo({top: target.offsetTop - 10, behavior: 'smooth'}); }
    });
  });

  /* ------------------ ACCESSIBILITY CONTROLS ------------------ */
  const root = document.documentElement;
  const btnContrast = document.querySelector('#btn-contrast');
  const btnLarger = document.querySelector('#btn-larger');
  const btnXL = document.querySelector('#btn-xl');
  const btnSpeak = document.querySelector('#btn-speak');

  if(btnContrast) btnContrast.addEventListener('click', ()=>{
    document.body.classList.toggle('high-contrast');
    btnContrast.setAttribute('aria-pressed', String(document.body.classList.contains('high-contrast')));
  });
  if(btnLarger) btnLarger.addEventListener('click', ()=> {
    document.body.classList.toggle('large-text');
    btnLarger.setAttribute('aria-pressed', String(document.body.classList.contains('large-text')));
  });
  if(btnXL) btnXL.addEventListener('click', ()=> {
    document.body.classList.toggle('extra-large-text');
    btnXL.setAttribute('aria-pressed', String(document.body.classList.contains('extra-large-text')));
  });

  if(btnSpeak){
    btnSpeak.addEventListener('click', ()=>{
      const speakText = document.querySelector('main') ? document.querySelector('main').innerText : 'Bem-vindo ao Juqui-Explorer';
      if('speechSynthesis' in window){
        const ut = new SpeechSynthesisUtterance(speakText);
        ut.lang = 'pt-BR';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(ut);
      } else alert('Leitura por voz não suportada neste navegador.');
    });
  }

  /* ------------------ CARROSSEL SIMPLES ------------------ */
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((c)=>{
    const imgs = Array.from(c.querySelectorAll('img'));
    const dotsContainer = c.querySelector('.carousel-dots');
    let idx = 0;
    imgs.forEach((img,i)=>{
      img.style.display = (i===0)?'block':'none';
      const dot = document.createElement('button');
      dot.className='dot';
      dot.setAttribute('aria-label', `Ir para imagem ${i+1}`);
      dot.addEventListener('click', ()=> { show(i); });
      dotsContainer.appendChild(dot);
    });
    function show(i){
      imgs.forEach((im,k)=> im.style.display = (k===i)?'block':'none');
      dotsContainer.querySelectorAll('.dot').forEach((d,k)=> d.classList.toggle('active', k===i));
      idx = i;
    }
    show(0);
    setInterval(()=> { show((idx+1) % imgs.length); }, 5000);
  });

  /* ------------------ JUKA CHAT (melhorado) ------------------ */
  const chatBtn = document.querySelector('.chatbot');
  const chatWindow = document.querySelector('.chat-window');
  const chatForm = document.querySelector('#chat-form');
  const chatInput = document.querySelector('#chat-input');
  const chatMessages = document.querySelector('.chat-messages');

  function appendMsg(text, who='juka', html=false){
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'user' ? 'user' : 'juka');
    if(html) div.innerHTML = text; else div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const responses = [
    { intent: ['olá','oi','bom dia','boa tarde','boa noite'], reply: 'Olá! Eu sou a Juka 🦫, mascote do Juqui-Explorer. Posso ajudar com trilhas, cachoeiras, pousadas, produtos e dicas de conservação. Pergunte "Trilhas" para ver as trilhas.'},
    { intent: ['trilha','trilhas','como chegar trilha'], reply: 'Temos várias trilhas — clique em "Trilhas" no menu ou diga "ver trilhas". Deseja ver o mapa com todas as trilhas?' , action:'open_trilhas'},
    { intent: ['cachoeira','cachoeiras','banho'], reply: 'As cachoeiras possuem níveis de periculosidade. Diga "detalhes cachoeira X" ou clique em "Cachoeiras" no menu.' },
    { intent: ['produto','comprar','loja','artesanato'], reply: 'Veja os produtos na seção "Produtos". Posso mostrar os artigos em destaque ou filtrar por preço.' },
    { intent: ['parceria','apoio','contato'], reply: 'Para parcerias, use a página "Contato" e nos envie uma mensagem. E-mail sugerido: contato@juqui-explorer.com' },
    { intent: ['lixo','preservar','conscientiza','conserva'], reply: 'Obrigado por se preocupar! Dica rápida: leve sempre uma sacola para seu lixo, não deixe restos na trilha, e evite sons altos que prejudiquem a fauna.' },
  ];

  function jukaReply(text){
    const lower = text.toLowerCase();
    for(const r of responses){
      for(const key of r.intent){
        if(lower.includes(key)){
          return r;
        }
      }
    }
    // fallback: suggest options
    return { reply: 'Desculpe, não entendi. Posso ajudar com: Trilhas, Cachoeiras, Pousadas, Produtos ou Contato. Qual você prefere?' };
  }

  if(chatBtn){
    chatBtn.addEventListener('click', ()=> {
      if(chatWindow.style.display === 'flex') chatWindow.style.display = 'none';
      else { chatWindow.style.display = 'flex'; chatWindow.style.flexDirection='column'; chatInput.focus(); }
    });
  }
  if(chatForm){
    chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const t = chatInput.value.trim(); if(!t) return;
      appendMsg(t,'user');
      chatInput.value='';
      setTimeout(()=> {
        const r = jukaReply(t);
        appendMsg(r.reply,'juka');
        if(r.action === 'open_trilhas'){
          // add button to open Trilhas
          const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Abrir Trilhas';
          btn.addEventListener('click', ()=> location.href = 'trilhas.html');
          const wrapper = document.createElement('div'); wrapper.style.marginTop='8px'; wrapper.appendChild(btn);
          chatMessages.appendChild(wrapper); chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, 700);
    });
  }

  /* ------------------ PROFILE / LOGIN localStorage ------------------ */
  function getUser(){ try{ return JSON.parse(localStorage.getItem('juqui_user'))||null;}catch(e){return null}}
  function setUser(u){ localStorage.setItem('juqui_user', JSON.stringify(u)); updateNavUser(); }
  function updateNavUser(){
    const navUser = document.querySelector('#nav-user');
    const user = getUser();
    if(navUser) navUser.textContent = user ? (user.name || user.email) : 'Entrar / Cad.';
  }
  updateNavUser();

  const regForm = document.querySelector('#register-form');
  if(regForm){
    regForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(regForm);
      const user = { name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone') };
      setUser(user);
      alert('Cadastro realizado (local). Você será redirecionado para a página inicial.');
      window.location.href = 'index.html';
    });
  }

  // profile modal
  const profileBtn = document.querySelector('#open-profile');
  const profileModal = document.querySelector('#profile-modal');
  const profileClose = document.querySelector('#profile-close');
  const profileForm = document.querySelector('#profile-form');
  if(profileBtn) profileBtn.addEventListener('click', ()=> profileModal.style.display='flex');
  if(profileClose) profileClose.addEventListener('click', ()=> profileModal.style.display='none');
  if(profileForm){
    profileForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(profileForm);
      const user = getUser() || {};
      user.name = fd.get('name'); user.email = fd.get('email'); user.phone = fd.get('phone');
      setUser(user); profileModal.style.display='none'; alert('Perfil salvo.');
    });
  }
  const btnLogout = document.querySelector('#btn-logout');
  if(btnLogout) btnLogout.addEventListener('click', ()=>{
    localStorage.removeItem('juqui_user'); updateNavUser(); alert('Você saiu.'); profileModal.style.display='none';
  });

  /* Close modals when clicking outside */
  document.querySelectorAll('.modal').forEach(mod=> {
    mod.addEventListener('click', (e)=> { if(e.target === mod) mod.style.display='none'; });
  });

  /* Mobile menu toggle */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if(toggle && nav) toggle.addEventListener('click', ()=> nav.style.display = (nav.style.display === 'flex')? 'none' : 'flex');

  /* --------------- Load page-specific JSON if needed --------------- */
  // If page includes element with data-special, load content (used for details pages)
  const dataContainer = document.querySelector('[data-load="places"]');
  if(dataContainer){
    // Example data (you can replace with server JSON)
    const places = [
      { id:'mirante', type:'trilha', title:'Trilha do Mirante', coords:[-23.706, -46.886], diff:'Fácil', dist:'1.5 km', description:'Trilha curta com mirante e vista da cidade.'},
      { id:'serra', type:'trilha', title:'Trilha da Serra', coords:[-23.712, -46.882], diff:'Moderada', dist:'4 km', description:'Trilha com subidas e vegetação densa.'},
      { id:'azul', type:'cachoeira', title:'Cachoeira Azul', coords:[-23.709, -46.879], diff:'Moderado', dist:'2 km', description:'Cachoeira de águas límpidas; atenção ao piso escorregadio.'},
      { id:'vale', type:'cachoeira', title:'Cachoeira do Vale', coords:[-23.715, -46.888], diff:'Fácil', dist:'1.2 km', description:'Local com área para banho.'}
    ];
    // render list
    places.forEach(p=>{
      const article = document.createElement('article'); article.className='card';
      article.innerHTML = `
        <img src="${p.type==='trilha' ? 'https://source.unsplash.com/800x600/?trail,forest' : 'https://source.unsplash.com/800x600/?waterfall'}" alt="${p.title}">
        <div style="padding-top:8px">
          <h3>${p.title}</h3>
          <div style="color:var(--muted)">${p.diff} • ${p.dist}</div>
          <p>${p.description}</p>
          <a class="btn" href="${p.type==='trilha' ? 'trilhas.html' : 'cachoeiras.html'}?slug=${p.id}">Ver detalhes</a>
        </div>`;
      dataContainer.appendChild(article);
    });
  }

}); // DOMContentLoaded
