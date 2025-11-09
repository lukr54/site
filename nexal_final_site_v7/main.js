
    (function(){
      const qs = s => document.querySelector(s);
      const qsa = s => Array.from(document.querySelectorAll(s));

      // map ids/selectors to overlay selectors
      const map = {
        'nav-why': '#overlay-why',
        'nav-about': '#overlay-about',
        'nav-devis': '#overlay-devis',
        'nav-contact': '#overlay-contact',
        'select-particuliers': '#overlay-particuliers',
        'select-professionnels': '#overlay-pro'
      };

      // audio: play only after first user interaction (to satisfy autoplay policies)
      const blip = document.getElementById('ui-blip');
      let userInteracted = false;
      window.addEventListener('click', ()=> { userInteracted = true; }, { once:true });
      function playBlip(){
        if(!userInteracted) return;
        try{ blip.currentTime = 0; blip.play().catch(()=>{}); }catch(e){}
      }

      // open/close by setting aria-hidden (CSS handles smooth transitions)
      function openOverlay(sel){
        const o = document.querySelector(sel);
        if(!o) return;
        // set aria-hidden false - CSS transition will handle fade/slide
        o.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        // small delay to trigger blip after visible (optional)
        requestAnimationFrame(()=> playBlip());
        // focus first focusable element for accessibility
        const focusable = o.querySelector('button, a, input, [tabindex], select, textarea');
        if(focusable) focusable.focus();
      }
      function closeOverlay(o){
        if(!o) return;
        // set aria-hidden true - CSS handles transition
        o.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
      }

      // attach open handlers to elements with data-open or mapped IDs
      Object.keys(map).forEach(id=>{
        const el = qs('#'+id);
        if(el){
          el.addEventListener('click', ()=> openOverlay(map[id]));
          el.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openOverlay(map[id]); }
          });
        }
      });
      // elements using data-open attribute (category cards and nav links)
      qsa('[data-open]').forEach(el=>{
        const id = el.id;
        // if mapped by id, open the corresponding overlay; otherwise fallback to data-target (not used here)
        el.addEventListener('click', ()=> {
          if(map[id]) openOverlay(map[id]);
        });
        el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); if(map[id]) openOverlay(map[id]); }});
      });

      // close buttons
      qsa('.return-btn, .header-return a').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const parentOverlay = btn.closest('.overlay');
          if(parentOverlay) closeOverlay(parentOverlay);
        });
      });
      // click outside panel closes overlay
      qsa('.overlay').forEach(o=>{
        o.addEventListener('click', (e)=>{ if(e.target === o) closeOverlay(o); });
      });
      // ESC closes overlays
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ qsa('.overlay[aria-hidden="false"]').forEach(o=> closeOverlay(o)); }});

      // demo form handler
      const frm = qs('#devisForm');
      if(frm){
        frm.addEventListener('submit', (e)=>{
          e.preventDefault();
          const msg = qs('#devisMessage');
          const name = qs('#d-name').value || '—';
          msg.style.display = 'block';
          msg.style.color = 'var(--accent1)';
          msg.innerText = `Merci ${name} — votre demande a bien été reçue (mode démonstration). Je vous recontacterai par e-mail.`;
msg.animate([{opacity:0},{opacity:1}],{duration:420,easing:'ease-out'});
// Add glowing animation to form
frm.classList.add('sent');
setTimeout(()=> frm.classList.remove('sent'), 1600);
frm.reset();
        });
      }

      // make cards keyboard accessible with :focus styles handled by CSS
      qsa('.cat-card, .service, .forfait').forEach(el=>{
        el.addEventListener('keydown', (e)=>{
          if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
        });
      });
    })();
  