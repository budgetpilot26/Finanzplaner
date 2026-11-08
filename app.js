/* ============================================================
   FUNKTIONEN: Hier änderst du, was die App kann.
   Deine Daten liegen in Firestore unter users/<deine-id>/planner/main.
   ============================================================ */
const MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const SAV=["Vorsorge","Anlagen"];
const CC={Wohnen:"#3b82f6",Krankenkasse:"#06b6d4",Auto:"#f97316",Abos:"#a855f7",Lebensmittel:"#22c55e",Restaurant:"#eab308",Freizeit:"#ec4899",Ferien:"#14b8a6",Vorsorge:"#6366f1",Anlagen:"#8b5cf6"};
const PC=["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ec4899","#06b6d4","#ef4444"];
const AB=[["AHV / IV / EO","Alter, Invalidität, Erwerbsersatz"],["ALV","Arbeitslosenversicherung, bis CHF 148’200"],["Pensionskasse (BVG)","je nach Alter und Vorsorgeplan"],["NBU","Nichtberufsunfall-Versicherung"],["Krankentaggeld (KTG)","oft hälftig vom Arbeitgeber getragen"],["Quellensteuer","nur ohne Niederlassungsbewilligung C"]];
const T0=new Date();
const mk0=()=>({cur:"CHF",cash:10000,cashR:.5,yrs:10,lead:3,paid:{},
inc:{mode:"y",gross:96000,net:0,th:false,day:25,tax:12},
ab:[{on:1,p:5.3},{on:1,p:1.1},{on:1,p:6},{on:1,p:1},{on:1,p:.5},{on:0,p:0}],
items:[
{name:"Miete",cat:"Wohnen",amt:1800,freq:"m",day:1,mon:1},
{name:"Krankenkasse",cat:"Krankenkasse",amt:380,freq:"m",day:26,mon:1},
{name:"Säule 3a",cat:"Vorsorge",amt:588,freq:"m",day:27,mon:1,bal:18000,rate:2.5},
{name:"Säule 3b",cat:"Vorsorge",amt:200,freq:"m",day:27,mon:1,bal:8000,rate:1.5},
{name:"ETF-Sparplan",cat:"Anlagen",amt:300,freq:"m",day:28,mon:1,bal:12000,rate:5.5},
{name:"Benzin / Tanken",cat:"Auto",amt:150,freq:"m",day:15,mon:1},
{name:"Autoversicherung",cat:"Auto",amt:1200,freq:"y",day:15,mon:3},
{name:"Autosteuern",cat:"Auto",amt:400,freq:"y",day:10,mon:6},
{name:"Netflix",cat:"Abos",amt:17.9,freq:"m",day:8,mon:1},
{name:"Deezer",cat:"Abos",amt:12.9,freq:"m",day:12,mon:1},
{name:"Swisscom Handyabo",cat:"Abos",amt:49,freq:"m",day:5,mon:1},
{name:"Lebensmittel",cat:"Lebensmittel",amt:600,freq:"m",day:1,mon:1},
{name:"Restaurant",cat:"Restaurant",amt:200,freq:"m",day:1,mon:1},
{name:"Freizeit",cat:"Freizeit",amt:200,freq:"m",day:1,mon:1},
{name:"Ferien",cat:"Ferien",amt:3000,freq:"y",day:1,mon:7}]});
const mk=()=>{const d=mk0();d.items.forEach((x,i)=>{x.id="i"+i});return d};
let D=mk();
const U={tab:"home",cm:T0.getMonth(),cy:T0.getFullYear()};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const F=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,maximumFractionDigits:0}).format(n);
const Fd=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2}).format(n);
function fix(){D.items.forEach((x,i)=>{if(!x.id)x.id="i"+i});D.paid=D.paid||{}}
function bn(m){$("bn").textContent=m;$("bn").className=m?"bn":"hide"}
let uid=null,unsub=null,tm=null,ready=false;
const ref=()=>db.collection("users").doc(uid).collection("planner").doc("main");
function sv(){if(!uid||!ready)return;clearTimeout(tm);tm=setTimeout(()=>ref().set(JSON.parse(JSON.stringify(D))).then(()=>bn("")).catch(e=>bn("Speichern fehlgeschlagen: "+e.message)),500)}

function calc(){
 const i=D.inc,f=i.mode=="m"?(i.th?13:12):1,gross=i.gross*f,ded=D.ab.reduce((s,a)=>s+(a.on?a.p:0),0),net=i.net>0?i.net*f:gross*(1-ded/100);
 const netM=net/12,taxY=net*i.tax/100,taxM=taxY/12,by={};let exp=0,sav=0;
 D.items.forEach(x=>{const m=x.freq=="y"?x.amt/12:x.amt;if(SAV.includes(x.cat))sav+=m;else exp+=m;by[x.cat]=(by[x.cat]||0)+m});
 return{gross,net,ded,netM,taxY,taxM,by,exp,sav,free:netM-taxM-exp-sav}}
function proj(){
 const c=calc(),n=D.yrs*12;
 const A=D.items.filter(x=>SAV.includes(x.cat)).map(x=>({n:x.name,v:x.bal||0,r:x.rate||0,m:x.freq=="y"?x.amt/12:x.amt}));
 A.push({n:"Konto / Cash",v:D.cash,r:D.cashR,m:c.free});
 const S=A.map(a=>{let v=a.v,w=a.v;const o=[[v,w]];for(let t=1;t<=n;t++){v=v*(1+a.r/1200)+a.m;w+=a.m;o.push([v,w])}return o});
 return{A,S}}

function bar(P){const t=P.reduce((s,p)=>s+Math.max(p[1],0),0)||1;
 return'<div class="stk">'+P.map(p=>'<i style="flex:'+Math.max(p[1],0)/t+';background:'+p[2]+'"></i>').join("")+'</div>'}
function donut(by,keys,total){
 const r=40,C=2*Math.PI*r;let o=0,s='<svg viewBox="0 0 120 120" class="dn"><g transform="rotate(-90 60 60)" fill="none" stroke-width="20">';
 keys.forEach(k=>{const l=by[k]/total*C;s+='<circle cx="60" cy="60" r="'+r+'" stroke="'+CC[k]+'" stroke-dasharray="'+Math.max(l-1.5,0)+' '+(C-Math.max(l-1.5,0))+'" stroke-dashoffset="'+(-o)+'"/>';o+=l});
 return s+'</g><text x="60" y="57" class="t1">pro Monat</text><text x="60" y="69" class="t2">'+F(total)+'</text></svg>'}
function area(S){
 const W=320,H=150,n=S[0].length-1,cum=[];
 S.forEach((o,k)=>cum.push(o.map((p,t)=>Math.max(p[0],0)+(k?cum[k-1][t]:0))));
 const mx=Math.max(...cum[cum.length-1],1),X=t=>(t/n*W).toFixed(1),Y=v=>(H-v/mx*H).toFixed(1);
 let s='<svg viewBox="0 0 320 154" style="width:100%;display:block;border-radius:10px">';
 for(let k=cum.length-1;k>=0;k--)s+='<polygon points="0,'+H+' '+cum[k].map((v,t)=>X(t)+","+Y(v)).join(" ")+' '+W+','+H+'" fill="'+PC[k%PC.length]+'" opacity=".92"/>';
 return s+'</svg>'}

function due(y,m){
 const L=[{id:"lohn",n:"Lohn",d:D.inc.day,v:calc().netM,inc:1}];
 D.items.forEach(x=>{if(x.freq=="m"||+x.mon==m+1)L.push({id:x.id,n:x.name,d:x.day,v:x.amt})});
 L.forEach(l=>{l.key=y+"-"+m+":"+l.id;l.ok=!!D.paid[l.key]});
 return L.sort((a,b)=>a.d-b.d)}
function st(l,y,m){
 if(l.ok)return["erledigt","ok"];
 const t=new Date(),cur=y*12+m,now=t.getFullYear()*12+t.getMonth();
 if(cur<now||(cur==now&&l.d<t.getDate()))return[l.inc?"ausstehend":"überfällig","late"];
 if(cur==now){const k=l.d-t.getDate();if(k==0)return["heute fällig","now"];if(k<=D.lead)return["in "+k+" Tg.","soon"]}
 return["offen",""]}
function tg(k){D.paid[k]=!D.paid[k];sv();R()}
function mv(n){U.cm+=n;if(U.cm<0){U.cm=11;U.cy--}if(U.cm>11){U.cm=0;U.cy++}R()}

function tHome(){
 const c=calc(),rem=12-T0.getMonth(),{S}=proj(),end=S.reduce((s,o)=>s+o[D.yrs*12][0],0),q=c.netM>0?Math.round((c.free+c.sav)/c.netM*100):0;
 const P=[["Steuern (geschätzt)",c.taxM,"#f59e0b"],["Fixe Ausgaben",c.exp,"#3b82f6"],["Vorsorge und Anlagen",c.sav,"#8b5cf6"],["Frei zum Sparen",Math.max(c.free,0),"#10b981"]];
 const keys=Object.keys(c.by).filter(k=>!SAV.includes(k)).sort((a,b)=>c.by[b]-c.by[a]),tot=c.exp||1;
 const dl=due(T0.getFullYear(),T0.getMonth()).filter(l=>!l.ok&&st(l,T0.getFullYear(),T0.getMonth())[1]);
 let h='<div class="hero"><small>Frei zum Sparen</small><b class="big">'+F(c.free)+'<span> / Monat</span></b>'+(c.free<0?'<p style="margin:-8px 0 12px">Die Ausgaben übersteigen das Einkommen.</p>':'')+'<div class="g"><div><b>'+F(Math.max(c.free,0)*rem)+'</b><span>bis Jahresende</span></div><div><b>'+F((c.free+c.sav)*12)+'</b><span>pro Jahr gespart ('+q+' %)</span></div><div><b>'+F(end)+'</b><span>Vermögen in '+D.yrs+' J.</span></div></div></div>';
 h+='<div class="card"><h2>Fällig</h2>'+(dl.length?dl.slice(0,5).map(l=>{const s=st(l,T0.getFullYear(),T0.getMonth());return'<div class="rw"><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[T0.getMonth()]+'</small></div><div class="r"><b>'+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div></div>'}).join(""):'<p class="s">Aktuell ist nichts fällig.</p>')+'<button class="btn" onclick="tab(\'chk\')">Zur Checkliste</button></div>';
 h+='<div class="card"><h2>Wohin dein Nettolohn fliesst</h2><p class="s">Netto im Durchschnitt: '+F(c.netM)+' pro Monat</p>'+bar(P)+P.map(p=>'<div class="lg"><span><u style="background:'+p[2]+'"></u>'+p[0]+'</span><b>'+F(p[1])+'</b></div>').join("")+'<p class="s" style="margin:10px 0 0">Steuern: rund '+F(c.taxY)+' pro Jahr. Bis Jahresende solltest du noch '+F(c.taxM*rem)+' zurücklegen.</p></div>';
 return h+'<div class="card"><h2>Ausgaben nach Kategorie</h2>'+donut(c.by,keys,tot)+keys.map(k=>'<div class="lg"><span><u style="background:'+CC[k]+'"></u>'+k+'<em>'+Math.round(c.by[k]/tot*100)+' %</em></span><b>'+F(c.by[k])+'</b></div>').join("")+'</div>'+konto()}

function tInc(){
 const i=D.inc,v=(k,l)=>'<label>'+l+'</label><input type="number" inputmode="decimal" value="'+(i[k]||"")+'" oninput="si(\''+k+'\',+this.value)">';
 return'<div class="card"><h2>Lohn</h2><p class="s">Trag Brutto, Netto oder beides ein. Lässt du das Netto leer, wird es aus den Abzügen unten geschätzt.</p><label>Eingabe als</label><select onchange="si(\'mode\',this.value);R()"><option value="y"'+(i.mode=="y"?" selected":"")+'>Jahreslohn</option><option value="m"'+(i.mode=="m"?" selected":"")+'>Monatslohn</option></select><div class="cr"><div>'+v("gross","Brutto")+'</div><div>'+v("net","Netto (optional)")+'</div></div>'+(i.mode=="m"?'<label class="ck"><input type="checkbox" '+(i.th?"checked":"")+' onchange="si(\'th\',this.checked)"> 13. Monatslohn</label>':"")+'<div class="cr"><div>'+v("tax","Steuersatz % vom Netto")+'</div><div>'+v("day","Lohn kommt am (Tag)")+'</div></div></div>'
 +'<div class="card"><h2>Abzüge vom Bruttolohn</h2><p class="s">Anteil der Arbeitnehmenden. Richtwerte, bitte mit deiner Lohnabrechnung abgleichen.</p>'+AB.map((a,k)=>'<div class="rw"><input type="checkbox" '+(D.ab[k].on?"checked":"")+' onchange="sa('+k+',\'on\',this.checked?1:0)"><div>'+a[0]+'<small>'+a[1]+'</small></div><input type="number" step="0.1" inputmode="decimal" value="'+D.ab[k].p+'" oninput="sa('+k+',\'p\',+this.value)"><span class="u">%</span></div>').join("")+'</div><div class="card" id="ires"></div>'}
function si(k,v){D.inc[k]=v;sv();if($("ires"))ires()}
function sa(i,k,v){D.ab[i][k]=v;sv();ires()}
function ires(){
 const c=calc(),i=D.inc,own=i.net>0,rows=[["Brutto pro Jahr",i.gross>0?F(c.gross):"–"]];
 if(c.gross>0)AB.forEach((a,k)=>{if(D.ab[k].on&&D.ab[k].p>0)rows.push(["− "+a[0]+" ("+D.ab[k].p+" %)",F(c.gross*D.ab[k].p/100)])});
 rows.push(["Netto pro Jahr"+(own?" (deine Eingabe)":" (geschätzt)"),F(c.net)],["Netto pro Monat",F(c.netM)],["Steuern pro Jahr (geschätzt)",F(c.taxY)],["Nach Steuern pro Monat",F(c.netM-c.taxM)]);
 $("ires").innerHTML='<h2>Ergebnis</h2>'+rows.map(r=>'<div class="lg"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join("")+(own?'<p class="s" style="margin:8px 0 0">Mit eingetragenem Netto dienen die Abzüge nur zur Anzeige.</p>':'')}

function tExp(){
 const c=calc();
 let h='<div class="card"><h2>Fixe Ausgaben, Vorsorge und Anlagen</h2><p class="s">Pro Monat: '+F(c.exp+c.sav)+', davon Vorsorge und Anlagen '+F(c.sav)+'. Jährliche Beträge werden durch 12 geteilt.</p>';
 Object.keys(CC).forEach(k=>{
  const L=D.items.map((x,i)=>[x,i]).filter(p=>p[0].cat==k);if(!L.length)return;
  h+='<div class="lg" style="margin-top:12px"><b><u style="background:'+CC[k]+'"></u>'+k+'</b><b>'+F(c.by[k])+'</b></div>'+L.map(p=>{const x=p[0];
   return'<div class="rw"><div>'+esc(x.name)+'<small>'+(x.freq=="y"?"jährlich im "+MN[x.mon-1]:"monatlich")+', am '+x.day+'.</small></div><input type="number" inputmode="decimal" value="'+x.amt+'" onchange="ui('+p[1]+',+this.value)"><button class="x" onclick="di('+p[1]+')" aria-label="Löschen">✕</button></div>'}).join("")});
 return h+'</div><div class="card"><h2>Neue Ausgabe</h2><label>Bezeichnung</label><input id="nn" placeholder="z. B. Spotify"><div class="cr"><div><label>Kategorie</label><select id="nc">'+Object.keys(CC).map(k=>'<option>'+k+'</option>').join("")+'</select></div><div><label>Betrag</label><input id="na" type="number" inputmode="decimal"></div><div><label>Rhythmus</label><select id="nf" onchange="$(\'nm\').parentNode.style.display=this.value==\'y\'?\'\':\'none\'"><option value="m">monatlich</option><option value="y">jährlich</option></select></div><div><label>Zahltag</label><input id="nd" type="number" value="1" min="1" max="31"></div></div><div style="display:none"><label>Monat der Zahlung</label><select id="nm">'+MN.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div><button class="btn" onclick="ai()">Hinzufügen</button></div>'}
function ai(){const n=$("nn").value.trim(),a=+$("na").value,k=$("nc").value;if(!n||!(a>0))return;D.items.push({id:"n"+Date.now(),name:n,cat:k,amt:a,freq:$("nf").value,day:+$("nd").value||1,mon:+$("nm").value,bal:0,rate:k=="Vorsorge"?2:5});sv();R()}
function ui(i,v){D.items[i].amt=v;sv();R()}
function di(i){D.items.splice(i,1);sv();R()}

function tChk(){
 const L=due(U.cy,U.cm),n=L.filter(l=>l.ok).length;
 return'<div class="card"><div class="mn"><button onclick="mv(-1)" aria-label="Voriger Monat">‹</button><h2>'+MN[U.cm]+' '+U.cy+'</h2><button onclick="mv(1)" aria-label="Nächster Monat">›</button></div><p class="s" style="text-align:center">'+n+' von '+L.length+' erledigt</p><div class="pg"><i style="width:'+(n/L.length*100)+'%"></i></div>'+L.map(l=>{const s=st(l,U.cy,U.cm);return'<div class="rw'+(l.ok?" done":"")+'"><button class="o'+(l.ok?" on":"")+'" onclick="tg(\''+l.key+'\')" aria-label="Erledigt">'+(l.ok?"✓":"")+'</button><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[U.cm]+'</small></div><div class="r"><b class="'+(l.inc?"pos":"")+'">'+(l.inc?"+":"−")+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div></div>'}).join("")+'</div><div class="card"><h2>Erinnerung</h2><p class="s">Ab wie vielen Tagen vor der Fälligkeit soll eine Zahlung als „bald fällig“ erscheinen? Den Zahltag legst du bei jeder Ausgabe fest.</p><select onchange="D.lead=+this.value;sv();R()">'+[1,2,3,5,7].map(d=>'<option value="'+d+'"'+(D.lead==d?" selected":"")+'>'+d+' Tage vorher</option>').join("")+'</select></div>'}

function tWea(){
 const c=calc(),inp=(oi,k,val,cl)=>'<input'+(cl?' class="sm"':'')+' type="number" step="0.1" inputmode="decimal" value="'+val+'" oninput="sw('+oi+',\''+k+'\',+this.value)">';
 const rows=D.items.map((x,i)=>[x,i]).filter(p=>SAV.includes(p[0].cat)).map(p=>{const x=p[0],m=x.freq=="y"?x.amt/12:x.amt;return'<div class="rw"><div>'+esc(x.name)+'<small>'+F(m)+' pro Monat</small></div>'+inp(p[1],"bal",x.bal||0)+inp(p[1],"rate",x.rate||0,1)+'</div>'}).join("");
 return'<div class="card"><h2>Anlagen und Vorsorge</h2><p class="s">Trag pro Anlage den heutigen Bestand und die erwartete Rendite pro Jahr ein. Die monatlichen Einzahlungen kommen aus deinen Ausgaben, beim Konto aus dem frei sparbaren Betrag.</p><div class="rw hd"><div></div><span>Bestand</span><span class="sm">Rendite %</span></div>'+rows+'<div class="rw"><div>Konto / Cash<small>'+F(c.free)+' pro Monat</small></div>'+inp(-1,"cash",D.cash)+inp(-1,"cashR",D.cashR,1)+'</div></div><div class="card"><h2>Zeitraum</h2><div class="chips" style="margin-top:8px">'+[1,5,10,20,30].map(y=>'<button class="'+(D.yrs==y?"on":"")+'" onclick="D.yrs='+y+';sv();R()">'+y+' J.</button>').join("")+'</div></div><div class="card" id="wc"></div>'}
function sw(i,k,v){if(i<0)D[k]=v;else D.items[i][k]=v;sv();wc()}
function wc(){
 const{A,S}=proj(),n=D.yrs*12,end=S.reduce((s,o)=>s+o[n][0],0),inn=S.reduce((s,o)=>s+o[n][1],0),y=T0.getFullYear();
 $("wc").innerHTML='<h2>Vermögen in '+D.yrs+' Jahren</h2><b class="big2">'+F(end)+'</b><p class="s">Eingezahlt '+F(inn)+', erwartete Rendite '+F(end-inn)+'. Die Prognose ist eine Annahme und keine Garantie.</p>'+area(S)+'<div class="ax"><span>'+y+'</span><span>'+(y+D.yrs)+'</span></div>'+A.map((a,k)=>'<div class="lg"><span><u style="background:'+PC[k%PC.length]+'"></u>'+esc(a.n)+'<em>'+a.r+' % p. a.</em></span><b>'+F(S[k][n][0])+'</b></div>').join("")}

function R(){
 const T={home:tHome,inc:tInc,exp:tExp,chk:tChk,wea:tWea};
 $("v").innerHTML=T[U.tab]();
 $("nv").innerHTML=[["home","Übersicht"],["inc","Einkommen"],["exp","Ausgaben"],["chk","Checkliste"],["wea","Vermögen"]].map(t=>'<button class="'+(U.tab==t[0]?"on":"")+'" onclick="tab(\''+t[0]+'\')">'+t[1]+'</button>').join("");
 if(U.tab=="inc")ires();
 if(U.tab=="wea")wc()}
function tab(t){U.tab=t;R();scrollTo(0,0)}

/* ===== Firebase: Login und Synchronisation ===== */
const firebaseConfig={
  apiKey:"AIzaSyApm_qGr0MC00JMIEZATQLYvDyX7ZubW7Q",
  authDomain:"finanzplaner-da1de.firebaseapp.com",
  projectId:"finanzplaner-da1de",
  storageBucket:"finanzplaner-da1de.firebasestorage.app",
  messagingSenderId:"246005064676",
  appId:"1:246005064676:web:f6562a1aeaa1a581f09df1"
};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(),db=firebase.firestore();
db.enablePersistence({synchronizeTabs:true}).catch(()=>{});
const typing=()=>{const a=document.activeElement;return a&&/INPUT|SELECT/.test(a.tagName)&&$("v").contains(a)};

auth.onAuthStateChanged(u=>{
 if(unsub){unsub();unsub=null}
 ready=false;
 if(u){
  uid=u.uid;
  $("login").className="hide";$("app").className="";$("nv").className="";
  $("v").innerHTML='<p class="s">Daten werden geladen …</p>';
  unsub=ref().onSnapshot(s=>{
   if(s.metadata.hasPendingWrites)return;
   if(s.exists){D=Object.assign(mk(),s.data());fix();ready=true;$("cu").value=D.cur;if(!typing())R()}
   else if(!s.metadata.fromCache){D=mk();fix();ready=true;$("cu").value=D.cur;sv();R()}
  },e=>bn("Fehler beim Laden: "+e.message));
 }else{
  uid=null;D=mk();
  $("app").className="hide";$("nv").className="hide";$("login").className="";
 }
});

function errText(e){
 const m={"auth/invalid-credential":"E-Mail oder Passwort falsch.","auth/invalid-email":"Ungültige E-Mail-Adresse.","auth/email-already-in-use":"Diese E-Mail ist schon registriert.","auth/weak-password":"Das Passwort ist zu kurz (mind. 6 Zeichen).","auth/missing-password":"Bitte Passwort eingeben.","auth/network-request-failed":"Keine Internetverbindung.","auth/too-many-requests":"Zu viele Versuche. Bitte später erneut probieren."};
 return m[e.code]||e.message}
function signIn(){$("lerr").textContent="";$("lok").textContent="";auth.signInWithEmailAndPassword($("em").value.trim(),$("pw").value).catch(e=>$("lerr").textContent=errText(e))}
function signUp(){$("lerr").textContent="";$("lok").textContent="";auth.createUserWithEmailAndPassword($("em").value.trim(),$("pw").value).catch(e=>$("lerr").textContent=errText(e))}
function reset(){
 const e=$("em").value.trim();$("lerr").textContent="";$("lok").textContent="";
 if(!e){$("lerr").textContent="Bitte zuerst deine E-Mail eintragen.";return}
 auth.sendPasswordResetEmail(e).then(()=>$("lok").textContent="Wir haben dir eine E-Mail zum Zurücksetzen geschickt.").catch(x=>$("lerr").textContent=errText(x))}
function konto(){
 return'<div class="card"><h2>Konto</h2><p class="s">Angemeldet als '+esc(auth.currentUser?auth.currentUser.email:"")+'. Deine Daten werden mit allen Geräten synchronisiert. Die Beispielwerte kannst du überschreiben oder ganz entfernen.</p><button class="btn ghost" onclick="auth.signOut()">Abmelden</button><button class="btn ghost" onclick="wipe()">Alle Einträge löschen und leer starten</button></div>'}
function wipe(){
 if(!confirm("Alle Einträge löschen und leer starten? Das lässt sich nicht rückgängig machen."))return;
 D=mk();D.items=[];D.inc.gross=0;D.cash=0;D.paid={};fix();sv();R()}

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

