
function initCarousels(){
  document.querySelectorAll('.carousel').forEach(c=>{
    const track = c.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dotsWrap = c.querySelector('.dots');
    slides.forEach((_,i)=>{
      const d=document.createElement('div'); d.className='dot'+(i===0?' active':''); dotsWrap.appendChild(d);
      d.addEventListener('click',()=>go(i));
    });
    let idx=0;
    function go(i){
      idx=i; track.style.transform = `translateX(-${i*100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d,k)=>d.classList.toggle('active',k===i));
    }
    setInterval(()=>{ idx=(idx+1)%slides.length; go(idx); }, 4000);
  });
}
function initJuka(){
  const fab=document.querySelector('.juka-fab');
  const panel=document.querySelector('.juka-panel');
  fab?.addEventListener('click',()=>{ panel.style.display = panel.style.display==='block' ? 'none' : 'block'; });
  const input = panel?.querySelector('input'); const btn = panel?.querySelector('button');
  btn?.addEventListener('click',()=>{
    const q = (input?.value||'').trim().toLowerCase(); const body = panel.querySelector('.juka-body');
    if(!q){ body.innerHTML = '<p>Oi! Eu sou o Juka. Pergunte sobre Juquitiba, trilhas ou onde comer. 🙂</p>'; return; }
    if(q.includes('história')) body.innerHTML = '<p>Juquitiba é conhecida como Terra de Muitas Águas. Posso te contar sobre trilhas e cachoeiras também!</p>';
    else if(q.includes('trilha')||q.includes('cachoeira')) body.innerHTML = '<p>Confira a aba Trilhas/Cachoeiras — eu já deixei um mapa e dicas de segurança por lá!</p>';
    else body.innerHTML = '<p>Acho que essa informação está no meu mapa perdido. Vou caçar direitinho e te aviso quando souber! 🗺️</p>';
  });
}
document.addEventListener('DOMContentLoaded',()=>{ initCarousels(); initJuka(); });
