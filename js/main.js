/* Psycho — interazioni, i18n, orari dinamici */
(function(){
  "use strict";
  var intro=document.getElementById('intro');
  window.addEventListener('load',function(){ setTimeout(function(){ if(intro) intro.classList.add('gone'); },900); });
  setTimeout(function(){ if(intro) intro.classList.add('gone'); },2600);

  var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });},{threshold:.13});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  var burger=document.getElementById('burger'), navlinks=document.getElementById('navlinks');
  if(burger){ burger.addEventListener('click',function(){ navlinks.classList.toggle('show'); }); }
  document.querySelectorAll('#navlinks a').forEach(function(a){ a.addEventListener('click',function(){ navlinks.classList.remove('show'); }); });

  document.querySelectorAll('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){ var it=b.parentElement,a=b.nextElementSibling,o=it.classList.contains('open'); it.classList.toggle('open'); a.style.maxHeight=o?null:a.scrollHeight+'px'; });
  });

  /* ---------- ORARI dinamici ---------- */
  // getDay 0=Dom..6=Sab · Lun 15–19:30 · Mar–Ven 9–19:30 (continuato) · Sab 9:30–19:30 · Dom chiuso
  var HOURS={0:[],1:[[15,19.5]],2:[[9,19.5]],3:[[9,19.5]],4:[[9,19.5]],5:[[9,19.5]],6:[[9.5,19.5]]};
  var DAYS_IT=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){ var H=Math.floor(h),M=Math.round((h-H)*60); H=H%24; return H+':'+(M<10?'0'+M:''+M); }
  function winStr(w){ return fmt(w[0])+'–'+fmt(w[1]); }
  function romeNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'})); }
  function computeStatus(){
    var n=romeNow(), d=n.getDay(), h=n.getHours()+n.getMinutes()/60, wins=HOURS[d]||[];
    for(var i=0;i<wins.length;i++){ if(h>=wins[i][0]&&h<wins[i][1]) return {open:true,close:wins[i][1]}; }
    for(var j=0;j<wins.length;j++){ if(h<wins[j][0]) return {open:false,next:wins[j][0],today:true}; }
    for(var k=1;k<=7;k++){ var dd=(d+k)%7; if((HOURS[dd]||[]).length) return {open:false,next:HOURS[dd][0][0],nextDay:dd}; }
    return {open:false};
  }
  var LANG='it';
  function renderHours(){
    var box=document.getElementById('hours'); if(!box) return;
    var days=LANG==='en'?DAYS_EN:DAYS_IT, today=romeNow().getDay(), out='';
    [1,2,3,4,5,6,0].forEach(function(d){
      var wins=HOURS[d], txt=wins&&wins.length?wins.map(winStr).join(' · '):(LANG==='en'?'Closed':'Chiuso');
      out+='<div class="hours-line'+(d===today?' today':'')+'"><span class="d">'+days[d]+'</span><span>'+txt+'</span></div>';
    });
    box.innerHTML=out;
    var st=computeStatus(), sb=document.getElementById('statusbox'), ab=document.getElementById('ab-state'), label,cls;
    if(st.open){ cls='open'; label=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(st.close); }
    else if(st.next!=null){ cls='closed'; var dt=st.today?'':((LANG==='en'?days[st.nextDay]:days[st.nextDay])+' '); label=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+dt+fmt(st.next); }
    else { cls='closed'; label=(LANG==='en'?'Closed':'Chiuso'); }
    if(sb) sb.innerHTML='<span class="status '+cls+'"><span class="dot"></span>'+label+'</span>';
    if(ab) ab.textContent=(st.open?(LANG==='en'?'Open now':'Aperto ora'):(LANG==='en'?'Closed now':'Ora chiuso'));
  }

  /* ---------- i18n ---------- */
  var EN={
    'nav.storia':'The story','nav.cart':'The tag','nav.crate':'What you find','nav.dove':'Find us','nav.cta':'Call',
    'hero.kick':'Via Zamenhof 2 · Milan · Navigli area','hero.big':'Since 1988','hero.mono':'LP · 7" · CD — new & used',
    'hero.lead':'One of the last bastions of quality music in Milan. Italian and international rock, the classics and the newest releases — with Fabio and Amos behind the counter.',
    'hero.cta1':'Call the shop','hero.cta2':'See on Discogs','hero.p1':'since 1 October','hero.p2':'151 reviews',
    'storia.kick':'The story · since 1988','storia.h2':'Opened on 1 October <em>1988</em>',
    'storia.p1':'Psycho opened in 1988, when the future owner was offered to take over the record shop where he worked as a clerk. Since then, on via Zamenhof, it has been a landmark for anyone after real music.',
    'storia.p2':'Today it’s a <b>musical library</b> run by <b>Fabio and Amos</b>: knowledgeable, warm, passionate. New and used, the classics and the latest rock releases, plus collectible posters and memorabilia.',
    'storia.quote':'«The first shop I visited in Milan, and it was love at first sight.»',
    'cart.kick':'The gesture that sets us apart','cart.h2':'Every record has its <em>tag</em>',
    'cart.sub':'At Psycho every record is tagged by hand: format, pressing and year, condition of the vinyl and the sleeve. You always know what you’re buying — at an honest price.',
    'cart.t1a':'Italian rock','cart.t1t':'Original pressing · 1970s','cart.t2a':'Punk / New wave','cart.t2t':'The right 7", checked','cart.t3a':'Jazz-fusion / Prog','cart.t3t':'Latest releases & reissues',
    'cart.cond':'Condition','cart.price':'Price','cart.hand':'marked by hand','cart.honest':'honest, we swear',
    'cart.note':'— record condition graded to the Goldmine standard, from the sleeve to the groove —',
    'crate.kick':'In the crates','crate.h2':'What you find at <em>Psycho</em>','crate.sub':'You won’t find fire-sale bargains: you’ll find the right record, chosen.',
    'crate.c1h':'New & used','crate.c1p':'Large quantities of LPs, 7"s and CDs, both new and second-hand, for every pocket and every search.',
    'crate.c2h':'Rock & subgenres','crate.c2p':'Italian and international rock, punk, new wave, jazz-fusion, prog: the classics and all the latest releases.',
    'crate.c3h':'Posters & memorabilia','crate.c3p':'Posters, prints and music memorabilia sought after by collectors — pieces that tell a story.',
    'crate.c4h':'In-store events','crate.c4p':'Listening parties, live-to-tape and Record Store Day: at Psycho music is listened to and lived, not just bought.',
    'gal.kick':'Inside Psycho','gal.h2':'The shop',
    'rev.src':'On Google · 151 reviews',
    'rev.q1':'My favorite record store in Milan. Great selection of used and new, each record tagged with edition and condition. Good prices for Milan.',
    'rev.q2':'A fabulous experience: we went in to sample the atmosphere of an Italian record shop and left an hour later with a Record Store Day Living Colour and an original pressing of Jimmy Page’s «Outrider».',
    'rev.q3':'The best record store I’ve ever been to: great selection and fair prices. Especially loved the jazz-fusion and the 70s rock.',
    'rev.q4':'Writing a review for Psycho is a real challenge: I’m too biased. It was the first shop I visited in Milan, and it was love at first sight.',
    'dove.h2':'Find us','dove.addr':'Address','dove.phone':'Phone','dove.hours':'Opening hours','dove.call':'Call the shop','dove.dir':'Get directions',
    'faq.kick':'Frequently asked','faq.h2':'Good to know',
    'faq.q1':'How old is Psycho?','faq.a1':'Since 1 October 1988, on via Zamenhof 2. It’s one of Milan’s historic record shops, run by Fabio and Amos.',
    'faq.q2':'Do you sell used? Do you buy records?','faq.a2':'Yes: we deal in new and used, and we do sell–buy–trade. Every record is tagged with condition and pressing.',
    'faq.q3':'What genres do you carry?','faq.a3':'Mostly rock, Italian and international, and its subgenres: punk, new wave, jazz-fusion, prog. LPs, 7"s and CDs, plus posters and memorabilia.',
    'faq.q4':'When are you open?','faq.a4':'Monday 3:00–7:30pm; Tuesday to Friday 9:00am–7:30pm; Saturday 9:30am–7:30pm. Closed on Sunday.',
    'faq.q5':'Can you listen to music in the shop?','faq.a5':'Yes: besides selling, we host listening parties, live-to-tape sessions and events like Record Store Day. Come by.',
    'foot.sub':'records & vinyl · Zamenhof 2 · Milan · since 1988','foot.rating':'4.7★ on Google (151 reviews)',
    'foot.demo':'Demo website by Bespoke Studio. Content and reviews from public sources (Google Maps).',
    'ab.call':'Call','ab.map':'Map'
  };
  var IT={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  function apply(lang){
    LANG=lang; var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.innerHTML=dict[k]; else if(lang==='it'&&IT[k]!=null) el.innerHTML=IT[k]; });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-lang')===lang); });
    renderHours();
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); }); });

  renderHours();
  setInterval(renderHours,60000);

  /* ---------- JSON-LD ---------- */
  var ld1={"@context":"https://schema.org","@type":"Store","name":"Psycho","description":"Negozio di dischi a Milano dal 1988: LP, 7\" e CD nuovi e usati, rock e sottogeneri, poster e memorabilia.","image":"https://rotenzark.github.io/psycho-records/img/facciata.jpg","telephone":"+390289401256","url":"https://rotenzark.github.io/psycho-records/","priceRange":"€€","address":{"@type":"PostalAddress","streetAddress":"Via Ludovico Lazzaro Zamenhof 2","addressLocality":"Milano","postalCode":"20136","addressCountry":"IT"},"geo":{"@type":"GeoCoordinates","latitude":45.4448857,"longitude":9.1795908},"sameAs":["https://www.discogs.com/user/psycho_records","https://www.facebook.com/PSYCHO-124090999054/"],"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"151"},"foundingDate":"1988-10-01","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":"Monday","opens":"15:00","closes":"19:30"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday"],"opens":"09:00","closes":"19:30"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"09:30","closes":"19:30"}]};
  var ld2={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"Da quando esiste Psycho?","acceptedAnswer":{"@type":"Answer","text":"Dal 1° ottobre 1988, in via Zamenhof 2 a Milano. Gestito da Fabio e Amos."}},
    {"@type":"Question","name":"Vendete usato e comprate dischi?","acceptedAnswer":{"@type":"Answer","text":"Sì, nuovo e usato con vendo-compro-scambio; ogni disco è etichettato con condizione e pressing."}},
    {"@type":"Question","name":"Quando siete aperti?","acceptedAnswer":{"@type":"Answer","text":"Lunedì 15–19:30; martedì–venerdì 9–19:30; sabato 9:30–19:30; domenica chiuso."}}
  ]};
  [ld1,ld2].forEach(function(o){ var s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(o); document.head.appendChild(s); });
})();
