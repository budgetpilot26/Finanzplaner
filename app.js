/* ============================================================
   FUNKTIONEN: Hier änderst du, was die App kann.
   Deine Daten liegen in Firestore unter users/<deine-id>/planner/main.
   ============================================================ */
const MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const SAV=["Vorsorge","Anlagen"];
const CC={Wohnen:"#3b82f6",Krankenkasse:"#06b6d4",Versicherungen:"#0ea5e9",Auto:"#f97316",Abos:"#a855f7",Lebensmittel:"#22c55e",Restaurant:"#eab308",Freizeit:"#ec4899",Kleider:"#f43f5e",Möbel:"#d97706",Mitgliedschaften:"#84cc16",Ferien:"#14b8a6",Vorsorge:"#6366f1",Anlagen:"#8b5cf6"};
const VAR=["Lebensmittel","Restaurant","Freizeit","Kleider","Möbel","Ferien"],VARSUB={Auto:["Tanken","Service / Reparatur"]};
const PC=["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ec4899","#06b6d4","#ef4444"];
const AB=[["AHV / IV / EO","Alter, Invalidität, Erwerbsersatz"],["ALV","Arbeitslosenversicherung, bis CHF 148’200"],["Pensionskasse (BVG)","je nach Alter und Vorsorgeplan"],["NBU","Nichtberufsunfall-Versicherung"],["Krankentaggeld (KTG)","oft hälftig vom Arbeitgeber getragen"],["Quellensteuer","nur ohne Niederlassungsbewilligung C"]];
const T0=new Date();
const mk0=()=>({cur:"CHF",cash:10000,cashR:.5,yrs:10,lead:3,paid:{},extra:[],km:0,goals:[],ist:{},istIn:{},rules:{},hist:{},carStash:[],exp:[],past:[],started:0,start:T0.getFullYear()+"-"+String(T0.getMonth()+1).padStart(2,"0"),car:{price:0,year:0,age:0,off:0,mode:"run"},
inc:{mode:"y",gross:96000,net:0,th:false,day:25,tax:12},
ab:[{on:1,p:5.3},{on:1,p:1.1},{on:1,p:6},{on:1,p:1},{on:1,p:.5},{on:0,p:0}],
items:[
{name:"Miete",cat:"Wohnen",amt:1800,freq:"m",day:1,mon:1},
{name:"Krankenkasse",cat:"Krankenkasse",amt:380,freq:"m",day:26,mon:1},
{name:"Risikolebensversicherung",cat:"Versicherungen",sub:"Risikolebensversicherung",amt:35,freq:"m",day:0,mon:1},
{name:"Rechtsschutz",cat:"Versicherungen",sub:"Rechtsschutz",amt:280,freq:"y",day:0,mon:1},
{name:"3a-Säule",cat:"Vorsorge",amt:588,freq:"m",day:27,mon:1,bal:18000,rate:2.5},
{name:"3b-Säule",cat:"Vorsorge",amt:200,freq:"m",day:27,mon:1,bal:8000,rate:1.5},
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
{name:"Kleider",cat:"Kleider",amt:100,freq:"m",day:0,mon:1},
{name:"Möbel und Haushalt",cat:"Möbel",amt:50,freq:"m",day:0,mon:1},
{name:"Ferien",cat:"Ferien",amt:3000,freq:"y",day:1,mon:7}]});
const defTrk=x=>{if(VAR.includes(x.cat))return 1;if(x.cat=="Auto")return(/Tanken|Service/.test(x.sub||"")||/benzin|tank|diesel|service|reparatur|garage|pneu/i.test(x.name))?1:0;return 0};
const mk=()=>{const d=mk0();d.items.forEach((x,i)=>{x.id="i"+i;x.trk=defTrk(x);x.pv=x.freq=="y"?"y":"m";x.carry=0});return d};
let D=mk();
const U={tab:"home",ws:"ov",bs:"exp",bv:"m",by:T0.getFullYear(),im:T0.getFullYear()+"-"+String(T0.getMonth()+1).padStart(2,"0"),ae:0,ab:0,ep:null,ge:null,ga:0,wf:0,pc:null,pi:null,msg:"",ed:null,cm:T0.getMonth(),cy:T0.getFullYear()};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const F=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,maximumFractionDigits:0}).format(n);
const Fd=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2}).format(n);
function fix(){
 D.items.forEach((x,i)=>{if(!x.id)x.id="i"+i;if(x.trk===undefined)x.trk=defTrk(x);if(!x.pv)x.pv=x.freq=="y"?"y":"m";if(x.carry===undefined)x.carry=0});
 D.items.forEach(x=>{if(x.cat=="Vorsorge"&&x.name=="Säule 3a")x.name="3a-Säule";if(x.cat=="Vorsorge"&&x.name=="Säule 3b")x.name="3b-Säule"});
 D.extra=D.extra||[];D.extra.forEach((x,i)=>{if(!x.id)x.id="e"+i});D.goals=D.goals||[];D.goals.forEach((x,i)=>{if(!x.id)x.id="g"+i});
 D.km=D.km||0;D.paid=D.paid||{};D.ist=D.ist||{};D.istIn=D.istIn||{};D.rules=D.rules||{};D.hist=D.hist||{};D.carStash=D.carStash||[];
 D.car=Object.assign({price:0,year:0,age:0,off:0},D.car||{});if(!D.car.mode)D.car.mode=D.car.price>0?"full":"run";
 D.exp=D.exp||[];D.past=D.past||[];D.started=D.started?1:0;if(!D.start)D.start=curK();
 Object.keys(D.ist).forEach(m=>{Object.keys(D.ist[m]||{}).forEach(cat=>{const a=+D.ist[m][cat];if(a>0&&CC[cat]){const it=D.items.find(x=>x.cat==cat&&x.trk);D.exp.push({id:"m"+m+cat,d:m+"-15",cat,item:it?it.id:"",amt:a,note:"Monatssumme (übernommen)",once:0,ded:1})}})});D.ist={}}
function bn(m){$("bn").textContent=m;$("bn").className=m?"bn":"hide"}
let uid=null,unsub=null,tm=null,ready=false;
const ref=()=>db.collection("users").doc(uid).collection("planner").doc("main");
function sv(){if(!uid||!ready)return;clearTimeout(tm);tm=setTimeout(()=>ref().set(JSON.parse(JSON.stringify(D))).then(()=>bn("")).catch(e=>bn("Speichern fehlgeschlagen: "+e.message)),500)}

function calc(){
 const i=D.inc,f=i.mode=="m"?(i.th?13:12):1,gross=i.gross*f,ded=D.ab.reduce((s,a)=>s+(a.on?a.p:0),0),net=i.net>0?i.net*f:gross*(1-ded/100);
 let xm=0,xt=0;D.extra.forEach(x=>{const m=x.freq=="y"?x.amt/12:x.amt;xm+=m;if(x.tax)xt+=m});
 const netM=net/12+xm,taxY=(net+xt*12)*i.tax/100,taxM=taxY/12,by={};let exp=0,sav=0;
 D.items.forEach(x=>{const m=x.freq=="y"?x.amt/12:x.amt;if(SAV.includes(x.cat))sav+=m;else exp+=m;by[x.cat]=(by[x.cat]||0)+m});
 return{gross,net,ded,xm,netM,taxY,taxM,by,exp,sav,free:netM-taxM-exp-sav}}
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
 const L=[];
 D.items.forEach(x=>{if(x.day>0&&!x.trk&&(x.freq=="m"||+x.mon==m+1))L.push({id:x.id,n:x.name,d:x.day,v:x.amt})});
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

function tInc(){
 const i=D.inc,v=(k,l)=>'<label>'+l+'</label><input type="number" inputmode="decimal" value="'+(i[k]||"")+'" oninput="si(\''+k+'\',+this.value)">';
 return'<div class="card"><h2>Lohn</h2><p class="s">Trag Brutto, Netto oder beides ein. Lässt du das Netto leer, wird es aus den Abzügen unten geschätzt.</p><label>Eingabe als</label><select onchange="si(\'mode\',this.value);R()"><option value="y"'+(i.mode=="y"?" selected":"")+'>Jahreslohn</option><option value="m"'+(i.mode=="m"?" selected":"")+'>Monatslohn</option></select><div class="cr"><div>'+v("gross","Brutto")+'</div><div>'+v("net","Netto (optional)")+'</div></div>'+(i.mode=="m"?'<label class="ck"><input type="checkbox" '+(i.th?"checked":"")+' onchange="si(\'th\',this.checked)"> 13. Monatslohn</label>':"")+'<div class="cr"><div>'+v("tax","Steuersatz % vom Netto")+'</div><div>'+v("day","Lohn kommt am (Tag)")+'</div></div></div>'
 +'<div class="card"><h2>Abzüge vom Bruttolohn</h2><p class="s">Anteil der Arbeitnehmenden. Richtwerte, bitte mit deiner Lohnabrechnung abgleichen.</p>'+AB.map((a,k)=>'<div class="rw"><input type="checkbox" '+(D.ab[k].on?"checked":"")+' onchange="sa('+k+',\'on\',this.checked?1:0)"><div>'+a[0]+'<small>'+a[1]+'</small></div><input type="number" step="0.1" inputmode="decimal" value="'+D.ab[k].p+'" oninput="sa('+k+',\'p\',+this.value)"><span class="u">%</span></div>').join("")+'</div>'+xcard()+'<div class="card" id="ires"></div>'}
function si(k,v){D.inc[k]=v;sv();if($("ires"))ires()}
function sa(i,k,v){D.ab[i][k]=v;sv();ires()}
function ires(){
 const c=calc(),i=D.inc,own=i.net>0,rows=[["Brutto pro Jahr",i.gross>0?F(c.gross):"–"]];
 if(c.gross>0)AB.forEach((a,k)=>{if(D.ab[k].on&&D.ab[k].p>0)rows.push(["− "+a[0]+" ("+D.ab[k].p+" %)",F(c.gross*D.ab[k].p/100)])});
 rows.push(["Lohn netto pro Jahr"+(own?" (deine Eingabe)":" (geschätzt)"),F(c.net)]);
 if(c.xm>0)rows.push(["Weitere Einkommen pro Monat",F(c.xm)]);
 rows.push(["Einkommen netto pro Monat",F(c.netM)],["Steuern pro Jahr (geschätzt)",F(c.taxY)],["Nach Steuern pro Monat",F(c.netM-c.taxM)]);
 if(i.day>0&&c.net>0)rows.push(["Nächster Lohn",dl(nxt(i.day,"m"))]);
 $("ires").innerHTML='<h2>Ergebnis</h2>'+rows.map(r=>'<div class="lg"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join("")+(own?'<p class="s" style="margin:8px 0 0">Mit eingetragenem Netto dienen die Abzüge nur zur Anzeige.</p>':'')}
function ui(i,v){D.items[i].amt=v;sv();R()}
function di(i){D.items.splice(i,1);sv();R()}

function tChk(){
 const L=due(U.cy,U.cm),n=L.filter(l=>l.ok).length;
 return'<div class="card"><div class="mn"><button onclick="mv(-1)" aria-label="Voriger Monat">‹</button><h2>'+MN[U.cm]+' '+U.cy+'</h2><button onclick="mv(1)" aria-label="Nächster Monat">›</button></div>'+(L.length?'<p class="s" style="text-align:center">'+n+' von '+L.length+' erledigt</p><div class="pg"><i style="width:'+n/L.length*100+'%"></i></div>'+L.map(l=>{const s=st(l,U.cy,U.cm);return'<div class="rw'+(l.ok?" done":"")+'"><button class="o'+(l.ok?" on":"")+'" onclick="tg(\''+l.key+'\')" aria-label="Erledigt">'+(l.ok?"✓":"")+'</button><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[U.cm]+'</small></div><div class="r"><b>−'+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div><button class="x" onclick="calOne(\''+l.id+'\')" aria-label="Im Kalender speichern">'+ICAL+'</button></div>'}).join(""):'<p class="s" style="text-align:center">In diesem Monat gibt es keine Zahlungen mit Zahltag.</p>')+'</div><div class="card"><h2>Erinnerung</h2><p class="s">Hier erscheinen nur Zahlungen mit Zahltag. Bei Lastschrift oder Dauerauftrag lässt du den Zahltag leer, dann musst du nichts abhaken. Ab wie vielen Tagen vor der Fälligkeit soll eine Zahlung als „bald fällig“ erscheinen?</p><select onchange="D.lead=+this.value;sv();R()">'+[1,2,3,5,7].map(d=>'<option value="'+d+'"'+(D.lead==d?" selected":"")+'>'+d+' Tage vorher</option>').join("")+'</select></div>'+calCard()}
function sw(i,k,v){if(i<0)D[k]=v;else D.items[i][k]=v;sv();wc()}
/* ===== Neu: Countdown, weitere Einkommen, Tipps, Darstellung ===== */
const yl=n=>n==1?"einem Jahr":n+" Jahren";
function nxt(day,freq,mon){
 const t=new Date(),y=t.getFullYear(),m=t.getMonth(),td=new Date(y,m,t.getDate());
 const cl=(yy,mm)=>new Date(yy,mm,Math.min(day,new Date(yy,mm+1,0).getDate()));
 let d=freq=="y"?cl(y,mon-1):cl(y,m);
 if(d<td)d=freq=="y"?cl(y+1,mon-1):cl(y,m+1);
 return Math.round((d-td)/864e5)}
const dl=n=>n==0?"heute":n==1?"morgen":"in "+n+" Tagen";
function incs(){
 const c=calc(),L=[];
 if(D.inc.day>0&&c.net>0)L.push({n:"Lohn",day:D.inc.day,d:nxt(D.inc.day,"m"),v:c.net/12});
 D.extra.forEach(x=>{if(x.day>0)L.push({n:x.name,day:x.day,d:nxt(x.day,x.freq,x.mon),v:x.amt})});
 return L.sort((a,b)=>a.d-b.d)}
function spark(S){
 const n=S[0].length-1,v=[];
 for(let i=0;i<=24;i++){const t=Math.round(i/24*n);v.push(S.reduce((s,o)=>s+o[t][0],0))}
 const mx=Math.max(...v,1),mn=Math.min(...v,0),p=v.map((y,i)=>(i/24*300).toFixed(1)+","+(60-(y-mn)/(mx-mn||1)*60).toFixed(1)).join(" ");
 return'<svg class="sp" viewBox="0 0 300 60" preserveAspectRatio="none"><polygon points="0,60 '+p+' 300,60" fill="rgba(255,255,255,.13)"/><polyline points="'+p+'" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>'}

function xcard(){
 return'<div class="card"><h2>Weitere Einkommen</h2><p class="s">Zum Beispiel Nebenjob, Mieteinnahmen oder Zulagen. Betrag netto, der Tag ist optional und zeigt dir den Countdown bis zur nächsten Zahlung.</p>'+D.extra.map((x,i)=>'<div class="rw"><div>'+esc(x.name)+'<small>'+(x.freq=="y"?"jährlich"+(x.day>0?" im "+MN[x.mon-1]:""):"monatlich")+(x.day>0?", "+dl(nxt(x.day,x.freq,x.mon)):"")+(x.tax?", steuerpflichtig":"")+'</small></div><input type="number" inputmode="decimal" value="'+x.amt+'" onchange="ux('+i+',+this.value)"><button class="x" onclick="dx('+i+')" aria-label="Löschen">✕</button></div>').join("")+'<label>Bezeichnung</label><input id="xn" placeholder="z. B. Nebenjob"><div class="cr"><div><label>Betrag (netto)</label><input id="xa" type="number" inputmode="decimal"></div><div><label>Rhythmus</label><select id="xf" onchange="$(\'xm\').parentNode.style.display=this.value==\'y\'?\'\':\'none\'"><option value="m">monatlich</option><option value="y">jährlich</option></select></div><div><label>Tag (optional)</label><input id="xd" type="number" min="1" max="31" inputmode="numeric"></div><div style="display:none"><label>Monat</label><select id="xm">'+MN.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div></div><label class="ck"><input id="xt" type="checkbox" checked> steuerpflichtig</label><button class="btn" onclick="ax()">Einkommen hinzufügen</button></div>'}
function ax(){const n=$("xn").value.trim(),a=+$("xa").value;if(!n||!(a>0))return;D.extra.push({id:"e"+Date.now(),name:n,amt:a,freq:$("xf").value,day:+$("xd").value||0,mon:+$("xm").value,tax:$("xt").checked});sv();R()}
function ux(i,v){D.extra[i].amt=v;sv();R()}
function dx(i){D.extra.splice(i,1);sv();R()}

function te(id){U.ed=U.ed==id?null:id;R()}
function tipsList(){
 const c=calc(),T=[],g=c.gross>0?c.gross/12:c.netM,pc=(v,b)=>b>0?Math.round(v/b*100):0,mo=x=>x.freq=="y"?x.amt/12:x.amt,sm=(cat,sb)=>D.items.filter(x=>x.cat==cat&&(!sb||subOf(x)==sb)).reduce((s,x)=>s+mo(x),0);
 const W=c.by.Wohnen||0,wp=pc(W,g);
 if(W>0)T.push([wp>33?"warn":wp>25?"info":"good","Wohnen: "+wp+" % vom Bruttolohn",wp>33?"Die Drittelregel empfiehlt höchstens etwa "+F(g/3)+" pro Monat für Wohnkosten. Du liegst darüber, das schränkt dein Sparen ein.":wp>25?"Im oberen Bereich der üblichen Faustregel von etwa einem Drittel des Bruttolohns (bis "+F(g/3)+").":"Unter einem Viertel deines Bruttolohns, das ist komfortabel.",wp+" %"]);
 const A=c.by.Auto||0,cp=pc(A,c.netM),km=D.km||0,cc=carCalc(),nc0=T.length;
 if(A>0){
  if(cc&&cc.P>0&&D.car.mode=="full"){const x=cc.cost(cc.n0),y=cc.cost(Math.max(cc.n0,10)),pot=Math.max((x-.74)*km,0);
   T.push([x>.9?"warn":x>.74?"info":"good","Auto: wirklich "+Math.round(x*100)+" Rp. pro Kilometer","Mit Betriebskosten ("+F(A*12)+" pro Jahr) und Abschreibung (rund "+F(cc.dep)+" pro Jahr) kostet dich jeder Kilometer so viel. Der TCS rechnet beim Musterauto 2026 mit rund 74 Rp. pro km bei 15’000 km."+(pot>0?" Gegenüber diesem Wert wären etwa "+F(pot)+" pro Jahr drin (grobe Schätzung).":"")+(cc.n0<10?" Behältst du das Auto "+Math.max(cc.n0,10)+" Jahre, sinkt der Wert auf etwa "+Math.round(y*100)+" Rp. pro km, weil der Wertverlust pro Jahr mit der Zeit kleiner wird.":" Die Abschreibung ist weitgehend durch, jetzt zählen vor allem Betrieb und Reparaturen."),pot>0?F(pot)+" / J.":Math.round(x*100)+" Rp."])}
  else if(km>0&&D.car.mode!="off"){const pk=A*12/km;
   T.push([pk>.9||cp>15?"warn":pk>.74||cp>10?"info":"good","Auto: "+Math.round(pk*100)+" Rp. pro Kilometer (ohne Abschreibung)","Du zahlst "+F(A*12)+" pro Jahr für "+km.toLocaleString("de-CH")+" km ("+cp+" % vom Netto). Der TCS rechnet beim Musterauto 2026 mit rund 74 Rp. pro km inklusive Abschreibung. Trag unter Tipps die Anschaffungskosten ein, dann rechne ich genauer."+(km<10000&&A*12>5000?" Bei wenig Fahrleistung lohnt sich ein Vergleich mit Car-Sharing und ÖV.":""),Math.round(pk*100)+" Rp."])}
  else T.push([cp>15?"warn":cp>10?"info":"good","Auto: "+cp+" % vom Nettoeinkommen","Du zahlst "+F(A*12)+" pro Jahr."+(D.car.mode=="off"?"":" Trag bei Tipps die gefahrenen Kilometer pro Jahr ein, dann schätze ich die Kosten pro Kilometer."),cp+" %"])}
 T.slice(nc0).forEach(t=>t[4]="car");
 const H=sm("Abos","Handy");
 if(H>0)T.push([H>=40?"warn":H>=25?"info":"good","Handyabo: "+F(H)+" pro Monat",H>25?"Unlimitierte Schweizer Handyabos gibt es bei günstigen Anbietern schon ab etwa CHF 13 bis 25 pro Monat (Stand Juli 2026). Bestandskunden zahlen oft mehr als Neukunden. Bei einem Wechsel sparst du rund "+F((H-25)*12)+" pro Jahr.":"Dein Handyabo liegt bereits im günstigen Bereich.",H>25?F((H-25)*12)+" / J.":F(H)+" / Mt."]);
 const ab=D.items.filter(x=>x.cat=="Abos"&&subOf(x)!="Handy"),B=ab.reduce((s,x)=>s+mo(x),0);
 if(ab.length>1&&B>0)T.push(["info",ab.length+" Abos kosten "+F(B*12)+" pro Jahr","Prüfe, ob du alle noch nutzt. Jedes gekündigte Abo spart Geld, ohne dass du viel merkst.",F(B)+" / Mt."]);
 const Fi=sm("Mitgliedschaften","Fitness");
 if(Fi>0)T.push([Fi>=60?"info":"good","Fitness: "+F(Fi)+" pro Monat",Fi>=60?"Rechne aus, was dich ein Besuch kostet ("+F(Fi*12)+" pro Jahr). Wer seltener als zweimal pro Woche geht, fährt mit Zehnerkarten oder einem günstigeren Angebot oft besser.":"Im üblichen Rahmen. Prüfe trotzdem, ob du das Angebot regelmässig nutzt.",F(Fi)+" / Mt."]);
 const Rs=c.by.Restaurant||0,Lm=c.by.Lebensmittel||0;
 if(Rs>=100&&Rs>.4*Lm)T.push(["info","Auswärts essen: "+F(Rs)+" pro Monat","Das sind "+pc(Rs,Lm)+" % deines Lebensmittelbudgets. Halbierst du es, sparst du etwa "+F(Rs/2*12)+" pro Jahr.",F(Rs)]);
 const K=c.by.Krankenkasse||0;
 if(K>0){const m=T0.getMonth(),dd=new Date(T0.getFullYear(),10,30)-new Date(T0.getFullYear(),m,T0.getDate()),w=m>=9&&m<=10&&dd>=0;
  T.push([w?"warn":"info","Krankenkasse: Prämien vergleichen",(w?"Für einen Wechsel der Grundversicherung per 1. Januar muss die Kündigung bis zum 30. November bei der Kasse eintreffen (noch "+Math.round(dd/864e5)+" Tage). ":"")+"Du zahlst "+F(K*12)+" pro Jahr. Ein Vergleich von Prämie, Franchise und Modell lohnt sich jedes Jahr.",F(K)+" / Mt."])}
 const V=c.by.Versicherungen||0;
 if(V>0)T.push(["info","Versicherungen: "+F(V*12)+" pro Jahr","Prüfe alle paar Jahre, ob Deckung und Prämie noch passen. Rechtsschutz, Haftpflicht und Risikolebensversicherung lassen sich gut vergleichen. Eine Risikolebensversicherung ist vor allem bei Familie oder Hypothek ein Thema.",F(V)+" / Mt."]);
 const p3=D.items.filter(x=>/3a/i.test(x.name)).reduce((s,x)=>s+(x.freq=="y"?x.amt:x.amt*12),0),mx=D.ab[2].on?7258:Math.min(c.net*.2,36288),left=Math.max(mx-p3,0),s3=left*D.inc.tax/100;
 if(c.net>0){
  if(p3<=0)T.push(["warn","Säule 3a: Steuern sparen",(c.gross>=80000?"Bei deinem Einkommen lohnt sich die Säule 3a besonders. ":"")+"Du zahlst nichts in die Säule 3a ein. Mit dem Maximalbetrag von "+F(mx)+" pro Jahr sparst du bei deinem Steuersatz rund "+F(s3)+" Steuern, oft mehr, weil der Grenzsteuersatz höher liegt. Das Geld muss bis zum 31. Dezember auf dem 3a-Konto sein.",F(s3)]);
  else if(left>0)T.push(["info","Säule 3a: noch "+F(left)+" möglich","Du zahlst "+F(p3)+" von höchstens "+F(mx)+" pro Jahr ein. Mit dem Rest sparst du rund "+F(s3)+" Steuern. Einzahlen bis 31. Dezember.",F(s3)]);
  else T.push(["good","Säule 3a: Maximum ausgeschöpft","Du zahlst den Höchstbetrag von "+F(mx)+" pro Jahr ein, das senkt deine Steuern."])}
 const q=c.netM>0?Math.round((c.free+c.sav)/c.netM*100):0;
 if(c.netM>0)T.push([c.free<0||q<10?"warn":q<20?"info":"good","Sparquote: "+q+" %",c.free<0?"Deine Ausgaben übersteigen das Einkommen. Prüfe zuerst die grössten Posten.":q<20?"Als Richtwert gelten rund 20 % des Einkommens fürs Sparen und Investieren. Dir fehlen etwa "+F(c.netM*.2-(c.free+c.sav))+" pro Monat bis dahin.":"Du erreichst den Richtwert von 20 %. Gut gemacht.",q+" %"]);
 if(c.exp>0&&D.cash<3*c.exp)T.push(["info","Notgroschen aufbauen","Ein Richtwert sind drei bis sechs Monatsausgaben auf dem Konto, bei dir "+F(3*c.exp)+" bis "+F(6*c.exp)+". Eingetragen sind "+F(D.cash)+" bei Konto / Cash.",F(D.cash)]);
 const gt=D.goals.reduce((s,x)=>{const r=gc(x);return s+(r.left>0?(r.r>0?r.r:(r.req||0)):0)},0);
 if(gt>0&&gt>Math.max(c.free,0))T.push(["warn","Sparziele: "+F(gt)+" pro Monat nötig","Frei zum Sparen sind aktuell "+F(Math.max(c.free,0))+" pro Monat. Passe Ziele, Dauer oder Ausgaben an.",F(gt)]);
 const o={warn:0,info:1,good:2};return T.sort((a,b)=>o[a[0]]-o[b[0]])}
const tipHtml=t=>'<div class="tp '+t[0]+'"><div><b>'+t[1]+'</b><small>'+t[2]+'</small></div>'+(t[3]?'<span class="chip">'+t[3]+'</span>':'')+'</div>';
function carBox(){
 if(!carOn())return'<div class="card"><h2>Auto</h2><p class="s">Auto-Kosten und Auto-Tipps sind ausgeschaltet.</p><button class="btn ghost" onclick="setCar(1)">Auto wieder einschalten</button></div>';
 const k=D.car,m=k.mode,cc=carCalc(),A=calc().by.Auto||0,tp=tipsList().find(t=>t[4]=="car");
 const chip=(v,l)=>'<button class="'+(m==v?"on":"")+'" onclick="D.car.mode=\''+v+'\';sv();R()">'+l+'</button>';
 const fld=(l,v,set,ph)=>'<div><label>'+l+'</label><input type="number" inputmode="numeric" value="'+(v||"")+'" placeholder="'+ph+'" onchange="'+set+';sv();R()"></div>';
 let h='<div class="card"><div class="mn"><h2>Auto</h2><button class="lk" style="width:auto;margin:0" onclick="setCar(0)">Ich habe kein Auto</button></div><div class="chips"><button class="'+(m=="run"?"on":"")+'" onclick="D.car.mode=\'run\';sv();R()">Nur Betrieb</button>'+chip("full","Wahre Kosten")+chip("off","Aus")+'</div>';
 if(m!="off")h+='<div class="cr" style="margin-top:4px">'+fld("km pro Jahr",D.km,"D.km=+this.value","z. B. 12000")+(m=="full"?fld("Kaufpreis",k.price,"D.car.price=+this.value","z. B. 25000")+fld("Kaufjahr",k.year,"D.car.year=+this.value","z. B. 2022")+fld("Alter beim Kauf (Jahre)",k.age,"D.car.age=+this.value","0 = neu"):"")+'</div>';
 if(!(A>0))h+='<p class="s" style="margin:10px 0 0">Trag bei Ausgaben die Auto-Kosten ein (Tanken, Versicherung, Steuern), dann rechne ich mit.</p>';
 else if(tp)h+=tipHtml(tp);
 if(m=="full"&&cc&&cc.P>0){const x=n=>Math.round(cc.cost(n)*100),cell=(n,t)=>'<div><b>'+x(n)+' Rp.</b><span class="u" style="display:block;margin:0">'+t+'</span></div>';
  h+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;margin-top:10px">'+cell(1,"nach 1 J.")+cell(5,"nach 5 J.")+cell(10,"nach 10 J.")+cell(15,"nach 15 J.")+'</div>'+carChart(cc)+'<p class="s" style="margin:6px 0 0">Heute (Jahr '+cc.n0+'): Wertverlust rund '+F(cc.dep)+' pro Jahr, Restwert etwa '+F(cc.rest)+'. Richtwert: Der Wertverlust ist am Anfang am höchsten (rund 11 % pro Jahr plus 1 % je 10’000 km). Bei Leasing trägst du 0 als Kaufpreis ein.</p>'}
 else if(m=="full"&&A>0)h+='<p class="s" style="margin:10px 0 0">Trag Kaufpreis und Kaufjahr ein, um die wahren Kosten pro Kilometer zu sehen.</p>';
 if(m=="off")h+='<p class="s" style="margin:10px 0 0">Die Kosten pro Kilometer werden nicht berechnet.</p>';
 return h+'</div>'}
function tTip(){
 const T=tipsList().filter(t=>t[4]!="car");
 return carBox()+'<div class="card"><h2>Sparpotenzial und Tipps</h2><p class="s">Auswertung deiner Eingaben mit groben Richtwerten. Das ist keine Steuer- oder Anlageberatung.</p>'+(T.length?T.map(tipHtml).join(""):'<p class="s">Trag zuerst Einkommen und Ausgaben ein, dann erscheinen hier Tipps.</p>')+'</div>'}
let TH="auto";try{TH=localStorage.getItem("fp_theme")||"auto"}catch(e){}
function applyTheme(){const r=document.documentElement;if(TH=="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",TH);const b=$("th");if(b){b.textContent={auto:"◐",light:"☀",dark:"☾"}[TH];b.title="Darstellung: "+{auto:"automatisch",light:"hell",dark:"dunkel"}[TH]}}
function cycleTheme(){TH={auto:"light",light:"dark",dark:"auto"}[TH];try{localStorage.setItem("fp_theme",TH)}catch(e){}applyTheme()}
applyTheme();


/* ===== Neu: Unterkategorien, Sparziele, Hauskauf ===== */
const SUBS={Vorsorge:["3a-Säule","3b-Säule","Sonstiges"],Auto:["Tanken","Versicherung","Steuern","Service / Reparatur","Parkplatz / Leasing","Sonstiges"],Abos:["Handy","Internet / TV","Streaming","Musik","Sonstiges"],Mitgliedschaften:["Fitness","Verein","Sonstiges"],Versicherungen:["Risikolebensversicherung","Rechtsschutz","Haftpflicht / Hausrat","Unfall / Invalidität","Sonstiges"]};
const GU={Vorsorge:[[/3a/i,"3a-Säule"],[/3b/i,"3b-Säule"]],Auto:[[/benzin|tank|diesel|laden/i,"Tanken"],[/versicher/i,"Versicherung"],[/steuer/i,"Steuern"],[/service|reparatur|garage|pneu/i,"Service / Reparatur"],[/park|leasing/i,"Parkplatz / Leasing"]],Abos:[[/handy|mobile|natel|swisscom|sunrise|salt|wingo|yallo/i,"Handy"],[/internet|wlan|glasfaser|fiber|\btv\b/i,"Internet / TV"],[/netflix|disney|prime|streaming|sky|teleclub|youtube|dazn/i,"Streaming"],[/spotify|deezer|apple music|musik|tidal/i,"Musik"]],Mitgliedschaften:[[/fitness|gym|yoga|sport|activ/i,"Fitness"],[/verein|club|tcs|sac/i,"Verein"]],Versicherungen:[[/risiko|leben/i,"Risikolebensversicherung"],[/rechts/i,"Rechtsschutz"],[/haftpflicht|hausrat/i,"Haftpflicht / Hausrat"],[/unfall|invalid|erwerbs/i,"Unfall / Invalidität"]]};
function subOf(x){if(x.sub)return x.sub;const g=GU[x.cat];if(g)for(const r of g)if(r[0].test(x.name))return r[1];return SUBS[x.cat]?"Sonstiges":""}
const GT={reise:"Reise",ferien:"Ferien",moebel:"Möbel / Einrichtung",auto:"Auto",anlage:"Investition",haus:"Haus / Wohnung (mit Finanzierung)",sonst:"Sonstiges"};
const hcost=(p,e)=>{const h=Math.max(p-e,0);return h*.05+p*.01+Math.max(h-p*2/3,0)/15};
function fs(){const s=SUBS[$("nc").value];$("nsw").style.display=s?"":"none";$("ns").innerHTML=s?s.map(x=>"<option>"+x+"</option>").join(""):"";if($("nt"))$("nt").checked=VAR.includes($("nc").value)}
function gc(g){
 const hs=g.type=="haus",need=hs?g.target*.2:g.target,left=Math.max(need-(g.have||0),0),r=g.rate||0;
 const mo=r>0?Math.ceil(left/r):0,md=g.date?(+g.date.slice(0,4))*12+(+g.date.slice(5,7))-1-(T0.getFullYear()*12+T0.getMonth()):null;
 return{hs,need,left,r,mo,md,req:md>0?left/md:null,done:new Date(T0.getFullYear(),T0.getMonth()+mo,1)}}
function dur(mo){const y=Math.floor(mo/12),m=mo%12;return(y?y+(y==1?" Jahr":" Jahre"):"")+(y&&m?" und ":"")+(m?m+(m==1?" Monat":" Monate"):"")||"weniger als ein Monat"}
function ag(){const n=$("gn").value.trim(),a=+$("ga").value;if(!n||!(a>0))return;D.goals.push({id:"g"+Date.now(),name:n,type:$("gt").value,target:a,have:0,rate:0,date:$("gm").value||""});sv();R()}
function ug(i,k,v){D.goals[i][k]=v;sv();R()}
function dg(i){if(confirm("Dieses Sparziel löschen?")){D.goals.splice(i,1);sv();R()}}
/* ===== Monate, Budget und Restbudget ===== */
const mkey=(y,m)=>y+"-"+String(m+1).padStart(2,"0");
const curK=()=>{const t=new Date();return mkey(t.getFullYear(),t.getMonth())};
const mAdd=(k,n)=>{const d=new Date(+k.slice(0,4),+k.slice(5)-1+n,1);return mkey(d.getFullYear(),d.getMonth())};
const mDiff=(a,b)=>(+b.slice(0,4)-+a.slice(0,4))*12+(+b.slice(5)-+a.slice(5));
const ML=m=>MN[+m.slice(5)-1]+" "+m.slice(0,4);
const mo=x=>x.freq=="y"?x.amt/12:x.amt;
const sumE=f=>D.exp.filter(f).reduce((s,e)=>s+e.amt,0);
const ded=e=>!e.once||e.ded!==0;
const dot=k=>'<u style="background:'+(CC[k]||"#94a3b8")+'"></u>';
const pgc=(s,b)=>b>0?(s>b?"bad":s>b*.85?"warn":"ok"):"ok";
const pgw=(s,b)=>(b>0?Math.min(100,s/b*100):(s>0?100:0)).toFixed(1);
const carOn=()=>!D.car.off;

function carryIn(x,m){
 let c=0,k=D.start<m?D.start:m;if(mDiff(k,m)>120)k=mAdd(m,-120);
 while(k<m){const s=sumE(e=>e.item==x.id&&e.d.slice(0,7)==k&&ded(e));c=Math.max(0,c+mo(x)-s);k=mAdd(k,1)}
 return c}
function bstat(x,m){
 if(x.pv=="y"||x.freq=="y"){const y=m.slice(0,4),B=mo(x)*12,S=sumE(e=>e.item==x.id&&e.d.slice(0,4)==y&&e.d.slice(0,7)<=m&&ded(e));return{pv:"y",B,S,rest:B-S,carry:0}}
 const c=x.carry?carryIn(x,m):0,B=mo(x)+c,S=sumE(e=>e.item==x.id&&e.d.slice(0,7)==m&&ded(e));return{pv:"m",B,S,rest:B-S,carry:c}}
const trkCats=()=>Object.keys(CC).filter(k=>!SAV.includes(k)&&D.items.some(x=>x.cat==k&&x.trk));
const pk=(id,m)=>m.slice(0,4)+"-"+(+m.slice(5)-1)+":"+id;
const allCats=()=>Object.keys(CC).filter(k=>!SAV.includes(k)&&D.items.some(x=>x.cat==k));
const fixDue=m=>D.items.filter(x=>!SAV.includes(x.cat)&&!x.trk&&(x.freq!="y"||+x.mon==+m.slice(5)));
const yT=x=>x.trk&&x.freq=="y";
const yE=e=>!!e.item&&D.items.some(z=>z.id==e.item&&yT(z));
function gstat(cat,m){
 let B=0,S=0;
 D.items.forEach(x=>{if(x.cat!=cat)return;
  if(yT(x)){if(+x.mon==+m.slice(5)){B+=x.amt;S+=sumE(e=>e.item==x.id&&e.d.slice(0,4)==m.slice(0,4)&&e.d.slice(0,7)<=m&&ded(e))}}
  else if(x.trk)B+=mo(x)+(x.carry&&x.pv!="y"?carryIn(x,m):0);
  else if(x.freq!="y"||+x.mon==+m.slice(5)){B+=x.amt;if(D.paid[pk(x.id,m)])S+=x.amt}});
 S+=sumE(e=>e.cat==cat&&e.d.slice(0,7)==m&&ded(e)&&!yE(e));
 return{B,S,rest:B-S}}
function mtot(m){let B=0,S=0;allCats().forEach(c=>{const g=gstat(c,m);B+=g.B;S+=g.S});return{B,S,rest:B-S}}
function budM(){const c=calc();return c.exp+c.taxM}
function realM(m){
 let s=0;fixDue(m).forEach(x=>{if(D.paid[pk(x.id,m)])s+=x.amt});
 return s+sumE(e=>e.d.slice(0,7)==m)}
function outM(k){
 const c=calc(),tc=trkCats();let fixed=0,tb=0;D.items.forEach(x=>{if(SAV.includes(x.cat))return;if(x.trk)tb+=mo(x);else fixed+=mo(x)});
 const isT=e=>{const it=e.item?D.items.find(z=>z.id==e.item):null;return it?!!it.trk:tc.includes(e.cat)};
 const E=D.exp.filter(e=>e.d.slice(0,7)==k),T=E.filter(isT),te=T.reduce((s,e)=>s+e.amt,0),ex=E.reduce((s,e)=>s+e.amt,0)-te;
 return{out:fixed+ex+(T.length?te:tb)+c.taxM,real:T.length>0}}

/* ===== Vermögen: Startwert plus Einnahmen minus Ausgaben, Monat für Monat ===== */
function wmodel(){
 const c=calc(),cur=curK(),sav=D.items.filter(x=>SAV.includes(x.cat)),inv={};let cash=D.cash||0;
 sav.forEach(x=>{inv[x.id]=+x.bal||0});
 const tot=()=>cash+sav.reduce((s,x)=>s+inv[x.id],0),pts=[{m:D.start,v:tot()}];let k=D.start,n=0;
 while(k<cur&&n<240){
  const o=outM(k).out,dep=sav.reduce((s,x)=>s+mo(x),0);
  cash=cash*(1+(D.cashR||0)/1200)+c.netM-o-dep;
  sav.forEach(x=>{inv[x.id]=inv[x.id]*(1+(x.rate||0)/1200)+mo(x)});
  k=mAdd(k,1);n++;pts.push({m:k,v:tot()})}
 return{cash,inv,sav,total:tot(),pts,months:n}}
function proj(yrs){
 const c=calc(),n=(yrs||D.yrs)*12,w=wmodel();
 const A=w.sav.map(x=>({n:x.name,v:w.inv[x.id],r:x.rate||0,m:mo(x)}));
 A.push({n:"Konto / Cash",v:w.cash,r:D.cashR,m:c.free});
 const S=A.map(a=>{let v=a.v,q=a.v;const o=[[v,q]];for(let t=1;t<=n;t++){v=v*(1+a.r/1200)+a.m;q+=a.m;o.push([v,q])}return o});
 return{A,S}}
function fser(yrs){const S=proj(yrs).S,n=yrs*12,o=[],k=curK();for(let t=0;t<=n;t++)o.push({m:mAdd(k,t),v:S.reduce((q,a)=>q+a[t][0],0)});return o}

/* ===== Ausgaben: Fixkosten abhaken, variable Posten mit Budgetbalken ===== */
const mbar=(S,B,sf)=>'<div class="mb '+pgc(S,B)+'"><i style="width:'+pgw(S,B)+'%"></i><span>'+F(S)+' von '+F(B)+(sf||"")+'</span></div>';
const oc=id=>"U.ep=U.ep=='"+id+"'?null:'"+id+"';R()";
function imv(n){U.im=mAdd(U.im,n);if(U.im>curK())U.im=curK();U.msg="";R()}
function goExp(){U.tab="ist";U.im=curK();U.ae=1;U.msg="";R();scrollTo(0,0)}
function quick(id){const x=D.items.find(z=>z.id==id);if(!x)return;U.ae=1;U.pc=x.cat;U.pi=id;R();const f=$("ef");if(f&&f.scrollIntoView)f.scrollIntoView({block:"center"})}
function fe(){
 const cs=allCats(),sel=U.pc&&cs.includes(U.pc)?U.pc:(trkCats()[0]||cs[0]);
 $("ec").innerHTML=cs.map(k=>'<option'+(k==sel?" selected":"")+'>'+k+'</option>').join("");
 fi()}
function fi(){
 const cat=$("ec").value,L=D.items.filter(x=>x.cat==cat);
 $("ei").innerHTML='<option value="">Ohne Posten</option>'+L.map(x=>'<option value="'+x.id+'"'+(U.pi==x.id?" selected":"")+'>'+esc(x.name)+'</option>').join("")}
function addE(){
 const a=parseFloat(String($("ea").value).replace(",","."));if(!(a>0)){$("ea").focus();return}
 const cat=$("ec").value,item=$("ei").value,once=$("eo").checked?1:0,dd=once&&$("ex").value=="0"?0:1,t=new Date();
 let d=$("ed").value;if(!/^\d{4}-\d{2}-\d{2}$/.test(d))d=curK()==U.im?t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0"):U.im+"-15";
 D.exp.push({id:"x"+Date.now(),d,cat,item,amt:Math.round(a*100)/100,note:$("en").value.trim(),once,ded:dd});
 const m=d.slice(0,7),x=item?D.items.find(z=>z.id==item):null;U.im=m;
 if(!dd)U.msg="Gespeichert. Die Ausgabe wird nicht vom Budget abgezogen.";
 else if(x&&!x.trk)U.msg="Gespeichert.";
 else{const s=x&&x.trk?bstat(x,m):gstat(cat,m),nm=x&&x.trk?x.name:cat,r=Math.round(s.rest);U.msg="Gespeichert. Übrig bei "+nm+": "+F(r)+(r<0?" (über Budget)":"")+"."}
 U.ae=0;U.pi=null;sv();R()}
function delE(id){if(!confirm("Diese Ausgabe löschen?"))return;D.exp=D.exp.filter(e=>e.id!=id);sv();R()}
function spx(id,k,v){const x=D.items.find(z=>z.id==id);if(x){x[k]=v;sv();R()}}

function cmp3(m,lab){
 const c=calc(),I=c.netM-c.taxM,B=mtot(m).B,S=realM(m),mx=Math.max(I,B,S,1);
 const row=(l,v,col)=>'<div class="hc"><span>'+l+'</span><div class="mb"><i style="width:'+(v/mx*100).toFixed(1)+'%;background:'+col+'"></i><span>'+F(v)+'</span></div></div>';
 return'<div class="card"><h2>Einnahmen, Budget, Ausgaben</h2>'+(lab?'<p class="s">'+ML(m)+'</p>':'')+row("Einnahmen",I,"var(--pos)")+row("Budget",B,"var(--pri)")+row("Ausgaben",S,S>B?"var(--neg)":"var(--warn)")+'</div>'}
function ipn(x){
 const q="'"+x.id+"'",s=bstat(x,U.im);
 return'<div class="pn"><button class="btn sm" onclick="quick('+q+')">Ausgabe erfassen</button>'+(x.freq=="y"?'':'<label>Budget anzeigen</label><div class="seg"><button class="'+(x.pv!="y"?"on":"")+'" onclick="spx('+q+',\'pv\',\'m\')">Monatlich</button><button class="'+(x.pv=="y"?"on":"")+'" onclick="spx('+q+',\'pv\',\'y\')">Jährlich</button></div>'+(x.pv=="y"?'':'<label class="ck" style="margin-top:14px"><input type="checkbox" '+(x.carry?"checked":"")+' onchange="spx('+q+',\'carry\',this.checked?1:0)"> Rest in den nächsten Monat übertragen</label>'+(s.carry>0?'<p class="s" style="margin:6px 0 0">Übertrag aus Vormonaten: '+F(s.carry)+'</p>':'')))+'</div>'}
function subHtml(cat,L,row,sum){
 const sb=SUBS[cat],subs={},ks=[];
 L.forEach(p=>{const s=sb?subOf(p.x):"";if(!subs[s]){subs[s]=[];ks.push(s)}subs[s].push(p)});
 let h="";
 ks.forEach(s=>{const A=subs[s];
  if(!s){A.forEach(p=>{h+=row(p,0)});return}
  if(A.length==1&&A[0].x.name.toLowerCase()==s.toLowerCase()){h+=row(A[0],2);return}
  h+='<div class="sub"><span>'+esc(s)+'</span><span>'+(A.length>1?sum(A):"")+'</span></div>';
  A.forEach(p=>{h+=row(p,1)})});
 return h}
function igroup(cat,m){
 const mm=+m.slice(5),L=D.items.filter(x=>x.cat==cat&&(x.freq!="y"||+x.mon==mm));
 if(!L.length)return"";
 const g=gstat(cat,m),allFix=L.every(x=>!x.trk),fr=sumE(e=>e.cat==cat&&!e.item&&e.d.slice(0,7)==m&&ded(e));
 const rowF=(x,lv)=>{const k=pk(x.id,m),ok=!!D.paid[k],ex=sumE(e=>e.item==x.id&&e.d.slice(0,7)==m&&ded(e));
  return'<div class="rw l'+lv+(ok?" done":"")+'"><button class="o'+(ok?" on":"")+'" onclick="tg(\''+k+'\')" aria-label="Bezahlt">'+(ok?"✓":"")+'</button><div>'+esc(x.name)+(ex>0?'<small>+ '+Fd(ex)+' zusätzlich</small>':'')+'</div><b>'+Fd(x.amt)+'</b><button class="x" onclick="quick(\''+x.id+'\')" aria-label="Weitere Ausgabe erfassen">+</button></div>'};
 const rowT=(x,lv)=>{const s=bstat(x,m);
  return'<div class="rw ed l'+lv+'" onclick="'+oc(x.id)+'"><div>'+esc(x.name)+mbar(s.S,s.B,s.pv=="y"?" im Jahr":"")+'</div><b class="nw '+(s.rest<0?"neg":"pos")+'">'+F(s.rest)+'</b></div>'+(U.ep==x.id?ipn(x):"")};
 if(L.length==1&&!fr){
  const x=L[0];if(!x.trk)return'<div class="card">'+rowF(x,3)+'</div>';
  const s=bstat(x,m);
  return'<div class="card"><div class="gt ed" onclick="'+oc(x.id)+'"><span>'+dot(cat)+'<b>'+esc(x.name)+'</b></span><b class="nw '+(s.rest<0?"neg":"pos")+'">'+(s.rest<0?"Über Budget "+F(-s.rest):"Rest "+F(s.rest))+'</b></div>'+mbar(s.S,s.B,s.pv=="y"?" im Jahr":"")+(U.ep==x.id?ipn(x):"")+'</div>'}
 const off=L.filter(x=>!x.trk&&!D.paid[pk(x.id,m)]).reduce((s,x)=>s+x.amt,0);
 const rt=allFix?(off>0?"Offen "+F(off):"Alles bezahlt"):(g.rest<0?"Über Budget "+F(-g.rest):"Rest "+F(g.rest));
 let h='<div class="card"><div class="gt"><span>'+dot(cat)+'<b>'+cat+'</b></span><b class="nw '+((allFix?off<=0:g.rest>=0)?"pos":"neg")+'">'+rt+'</b></div>'+mbar(g.S,g.B);
 h+=subHtml(cat,L.map(x=>({x})),(p,lv)=>p.x.trk?rowT(p.x,lv):rowF(p.x,lv),()=>"");
 if(fr>0)h+='<div class="rw l1"><div>Weitere Ausgaben</div><b>−'+Fd(fr)+'</b></div>';
 return h+'</div>'}
function eform(m){
 const t=new Date(),today=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
 return'<div class="card" id="ef"><h2>Ausgabe erfassen</h2><div class="cr"><div><label>Betrag</label><input id="ea" type="number" step="0.01" inputmode="decimal" placeholder="0.00"></div><div><label>Datum</label><input id="ed" type="date" max="'+today+'" value="'+(m==curK()?today:m+"-15")+'"></div><div><label>Gruppe</label><select id="ec" onchange="U.pi=null;fi()"></select></div><div><label>Posten</label><select id="ei"></select></div></div><label>Notiz (optional)</label><input id="en" placeholder="z. B. Wocheneinkauf">'
  +'<label class="ck" style="margin-top:14px"><input type="checkbox" id="eo" onchange="$(\'exw\').style.display=this.checked?\'\':\'none\'"> Einmalig und unvorhergesehen</label><div id="exw" style="display:none"><label>Vom Budget abziehen?</label><select id="ex"><option value="1">Ja, vom Budget abziehen</option><option value="0">Nein, nur festhalten</option></select></div>'
  +'<button class="btn" onclick="addE()">Speichern</button><button class="lk" onclick="U.ae=0;R()">Abbrechen</button></div>'}
function tIst(){
 const m=U.im,cur=curK();
 let h='<div class="mn"><button onclick="imv(-1)" aria-label="Voriger Monat">‹</button><h2>'+ML(m)+'</h2><button onclick="imv(1)" '+(m>=cur?"disabled":"")+' aria-label="Nächster Monat">›</button></div>';
 if(U.msg)h+='<div class="note">'+esc(U.msg)+'</div>';
 h+=U.ae?eform(m):'<button class="btn" onclick="U.ae=1;U.msg=\'\';R()">+ Ausgabe erfassen</button>';
 h+=cmp3(m);
 allCats().forEach(c=>{h+=igroup(c,m)});
 const L=D.exp.filter(e=>e.d.slice(0,7)==m).sort((a,b)=>b.d.localeCompare(a.d)||b.id.localeCompare(a.id));
 h+='<div class="card"><h2>Erfasste Ausgaben</h2>'+(L.length?L.map(e=>{const x=e.item?D.items.find(z=>z.id==e.item):null;return'<div class="rw"><div>'+dot(e.cat)+esc(x?x.name:e.cat)+'<small>'+e.d.slice(8)+"."+e.d.slice(5,7)+"."+(e.note?" · "+esc(e.note):"")+(e.once?" · einmalig":"")+'</small></div><b>−'+Fd(e.amt)+'</b><button class="x" onclick="delE(\''+e.id+'\')" aria-label="Löschen">✕</button></div>'}).join(""):'<p class="s" style="margin:0">Noch nichts erfasst.</p>')+'</div>';
 return h}

/* ===== Vermögen: Verlauf und Prognose in einer Grafik ===== */
function wchart(hs,fs){
 const all=hs.concat(fs),idx=k=>(+k.slice(0,4))*12+(+k.slice(5)-1),i0=idx(all[0].m),span=Math.max(idx(all[all.length-1].m)-i0,1),v=all.map(p=>p.v),mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.12||Math.abs(mx)*.05||1,lo=mn-pad,hi=mx+pad,W=320,H=120,f=n=>n.toFixed(1);
 const P=p=>f((idx(p.m)-i0)/span*W)+","+f(H-(p.v-lo)/(hi-lo)*H),pl=a=>a.map(P).join(" "),L=hs[hs.length-1],xs=(idx(L.m)-i0)/span*W,xy=P(L).split(",");
 let s='<svg viewBox="0 0 330 135" style="width:100%;display:block;overflow:visible;margin-top:10px">';
 if(hs.length>1)s+='<polygon points="0,'+H+' '+pl(hs)+' '+f(xs)+','+H+'" fill="var(--pri)" opacity=".12"/><polyline points="'+pl(hs)+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linejoin="round"/>';
 if(fs.length>1)s+='<line x1="'+f(xs)+'" x2="'+f(xs)+'" y1="0" y2="'+H+'" stroke="var(--ln)" stroke-width="1.5" stroke-dasharray="3 3"/><polyline points="'+pl(fs)+'" fill="none" stroke="var(--pos)" stroke-width="2.5" stroke-dasharray="6 5" stroke-linejoin="round"/>';
 s+='<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="5" fill="var(--gold)"/></svg><div class="ax"><span>'+ML(all[0].m)+'</span>'+(fs.length>1?'<span>heute</span>':'')+'<span>'+ML(all[all.length-1].m)+'</span></div>';
 return s}
function wcard(){
 if(!D.started)return'<div class="card"><h2>Vermögen</h2><p class="s">Trag dein Startvermögen ein, dann siehst du hier den Verlauf.</p><button class="btn" onclick="tab(\'set\')">Startvermögen festlegen</button></div>';
 const w=wmodel(),hs=(D.past||[]).concat(w.pts),d=w.total-hs[0].v,hr=U.hr==undefined?1:U.hr,fs=hr>0?fser(hr):[];
 const ch=[[0,"Verlauf"],[1,"+1 J."],[5,"+5 J."],[10,"+10 J."]].map(o=>'<button class="'+(hr==o[0]?"on":"")+'" onclick="U.hr='+o[0]+';R()">'+o[1]+'</button>').join("");
 let h='<div class="card"><h2>Vermögen</h2><b class="big2">'+F(w.total)+'</b><div class="chips" style="margin:10px 0 0">'+ch+'</div>'+wchart(hs,fs);
 if(hs.length>1)h+='<div class="lg"><span>Seit '+ML(hs[0].m)+'</span><b class="'+(d>=0?"pos":"neg")+'">'+(d>=0?"+":"−")+F(Math.abs(d))+'</b></div>';
 if(fs.length>1)h+='<div class="lg"><span>Prognose '+ML(fs[fs.length-1].m)+'</span><b>'+F(fs[fs.length-1].v)+'</b></div>';
 return h+'</div>'}

function hgoals(){
 if(!D.goals.length)return"";
 return'<div class="card"><h2>Sparziele</h2>'+D.goals.map(g=>{const r=gc(g),have=Math.min(g.have||0,r.need),m=r.r>0?r.r:(r.req||0);return'<div class="rw ed" onclick="tab(\'goal\')"><div>'+esc(g.name)+'<div class="mb"><i style="width:'+pgw(have,r.need)+'%"></i><span>'+F(have)+' von '+F(r.need)+'</span></div></div><div class="r"><b class="'+(r.left>0?"":"pos")+'">'+(r.left>0?"Noch "+F(r.left):"Erreicht")+'</b>'+(r.left>0&&m>0?'<span class="tg">'+F(m)+' / Mt.</span>':'')+'</div></div>'}).join("")+'</div>'}
/* ===== Start ===== */
function tHome(){
 const c=calc(),m=curK(),t=mtot(m),P=[["Steuern (geschätzt)",c.taxM,"#f59e0b"],["Ausgaben (Budget)",c.exp,"#3b82f6"],["Vorsorge und Anlagen",c.sav,"#8b5cf6"],["Frei zum Sparen",Math.max(c.free,0),"#10b981"]];
 const keys=Object.keys(c.by).filter(k=>!SAV.includes(k)).sort((a,b)=>c.by[b]-c.by[a]),tot=c.exp||1,n=new Date(),left=new Date(n.getFullYear(),n.getMonth()+1,0).getDate()-n.getDate();
 let h='<div class="hero"><small>Verbleibendes Budget · '+MN[n.getMonth()]+'</small><b class="big">'+F(t.rest)+'</b><div class="pg wh"><i style="width:'+pgw(t.S,t.B)+'%"></i></div><p class="hs">'+(t.rest<0?"Budget um "+F(-t.rest)+" überschritten":F(t.S)+" von "+F(t.B)+" ausgegeben, noch "+left+(left==1?" Tag":" Tage"))+'</p>';
 h+='<div class="g"><div><b>'+F(t.S)+'</b><span>ausgegeben</span></div><div><b>'+F(t.B)+'</b><span>Budget</span></div><div><b>'+F(c.free)+'</b><span>frei zum Sparen</span></div></div><button class="btn hb2" onclick="goExp()">+ Ausgabe erfassen</button></div>';
 h+=wcard()+hgoals()+cmp3(m,1);
 h+='<div class="card"><h2>Wohin dein Einkommen fliesst</h2><p class="s">Netto im Durchschnitt: '+F(c.netM)+' pro Monat</p>'+bar(P)+P.map(p=>'<div class="lg"><span><u style="background:'+p[2]+'"></u>'+p[0]+'</span><b>'+F(p[1])+'</b></div>').join("")+'</div>';
 return h+'<div class="card"><h2>Ausgaben nach Kategorie</h2>'+donut(c.by,keys,tot)+keys.map(k=>'<div class="lg"><span>'+dot(k)+k+'<em>'+Math.round(c.by[k]/tot*100)+' %</em></span><b>'+F(c.by[k])+'</b></div>').join("")+'</div>'}

/* ===== Budget ===== */
function pn(i){
 const x=D.items[i],sb=SUBS[x.cat],cs=Object.keys(CC).filter(k=>k!="Auto"||carOn()||x.cat=="Auto");
 return'<div class="pn"><div class="cr"><div><label>Bezeichnung</label><input placeholder="leer = Untergruppe" value="'+esc(x.name)+'" onchange="ue('+i+',\'name\',this.value)"></div><div><label>Betrag '+(x.freq=="y"?"pro Jahr":"pro Monat")+'</label><input type="number" inputmode="decimal" value="'+x.amt+'" onchange="ue('+i+',\'amt\',+this.value)"></div><div><label>Gruppe</label><select onchange="ue('+i+',\'cat\',this.value)">'+cs.map(k=>'<option'+(x.cat==k?" selected":"")+'>'+k+'</option>').join("")+'</select></div>'+(sb?'<div><label>Untergruppe</label><select onchange="ue('+i+',\'sub\',this.value)">'+sb.map(s=>'<option'+(subOf(x)==s?" selected":"")+'>'+s+'</option>').join("")+'</select></div>':'')+'<div><label>Rhythmus</label><select onchange="ue('+i+',\'freq\',this.value)"><option value="m"'+(x.freq=="m"?" selected":"")+'>monatlich</option><option value="y"'+(x.freq=="y"?" selected":"")+'>jährlich</option></select></div><div><label>Zahltag (optional)</label><input type="number" min="1" max="31" inputmode="numeric" value="'+(x.day>0?x.day:"")+'" onchange="ue('+i+',\'day\',+this.value||0)"></div>'+(x.freq=="y"?'<div><label>Monat der Zahlung</label><select onchange="ue('+i+',\'mon\',+this.value)">'+MN.map((m,k)=>'<option value="'+(k+1)+'"'+(x.mon==k+1?" selected":"")+'>'+m+'</option>').join("")+'</select></div>':'')+'</div>'
  +(SAV.includes(x.cat)?'':'<label>Art</label><div class="seg"><button class="'+(!x.trk?"on":"")+'" onclick="ue('+i+',\'trk\',0)">Fixbetrag</button><button class="'+(x.trk?"on":"")+'" onclick="ue('+i+',\'trk\',1)">Variabel</button></div>')
  +'<div class="two"><button class="btn ghost" onclick="te(null)">Fertig</button><button class="btn ghost dng" onclick="if(confirm(\'Diesen Posten löschen?\'))di('+i+')">Löschen</button></div></div>'}
function ue(i,k,v){if(k=="name"&&!String(v).trim()){const sb=SUBS[D.items[i].cat]?subOf(D.items[i]):"";if(sb)v=sb;else return R()}D.items[i][k]=v;if(k=="cat")D.items[i].sub="";if(k=="freq")D.items[i].pv=v=="y"?"y":"m";sv();R()}
function tBud(){
 const seg=(a,b,va,vb,cur,fa,fb)=>'<div class="seg" style="margin-bottom:12px"><button class="'+(cur==va?"on":"")+'" onclick="'+fa+'">'+a+'</button><button class="'+(cur==vb?"on":"")+'" onclick="'+fb+'">'+b+'</button></div>';
 let h=seg("Kosten","Einkommen","exp","inc",U.bs=="inc"?"inc":"exp","U.bs=\'exp\';R()","U.bs=\'inc\';R()");
 if(U.bs=="inc")return h+tInc();
 const c=calc(),k=U.bv=="y"?12:1;
 h+=seg("Monatlich","Jährlich","m","y",U.bv=="y"?"y":"m","U.bv=\'m\';R()","U.bv=\'y\';R()");
 h+='<div class="card">'+[["Einkommen (netto)",c.netM*k],["Steuern (geschätzt)",-c.taxM*k],["Ausgaben",-c.exp*k],["Vorsorge und Anlagen",-c.sav*k]].map(r=>'<div class="lg"><span>'+r[0]+'</span><b>'+(r[1]<0?"−":"")+F(Math.abs(r[1]))+'</b></div>').join("")+'<div class="lg tot"><b>Frei zum Sparen</b><b class="'+(c.free<0?"neg":"pos")+'">'+F(c.free*k)+'</b></div></div>';
const row=(p,lv)=>{const x=p.x;return'<div class="rw ed l'+lv+'" onclick="te(\''+x.id+'\')"><div>'+(lv==3?dot(x.cat):"")+esc(x.name)+'</div><b>'+F(mo(x)*k)+'</b><span class="chev">›</span></div>'+(U.ed==x.id?pn(p.i):"")};
 Object.keys(CC).forEach(cat=>{
  const L=D.items.map((x,i)=>({x,i})).filter(p=>p.x.cat==cat);if(!L.length)return;
  if(L.length==1){h+='<div class="card">'+row(L[0],3)+'</div>';return}
  h+='<div class="card"><div class="gt"><span>'+dot(cat)+'<b>'+cat+'</b></span><b>'+F(c.by[cat]*k)+'</b></div>'+subHtml(cat,L,row,A=>F(A.reduce((t,p)=>t+mo(p.x),0)*k))+'</div>'});
 if(!U.ab)return h+'<button class="btn" onclick="U.ab=1;R()">+ Posten hinzufügen</button>';
 return h+'<div class="card"><h2>Neuer Posten</h2><label>Bezeichnung (leer = Name der Untergruppe)</label><input id="nn" placeholder="z. B. Spotify"><div class="cr"><div><label>Gruppe</label><select id="nc" onchange="fs()">'+Object.keys(CC).filter(k=>k!="Auto"||carOn()).map(k=>'<option>'+k+'</option>').join("")+'</select></div><div><label>Betrag</label><input id="na" type="number" inputmode="decimal"></div><div id="nsw" style="display:none"><label>Untergruppe</label><select id="ns"></select></div><div><label>Rhythmus</label><select id="nf" onchange="$(\'nm\').parentNode.style.display=this.value==\'y\'?\'\':\'none\'"><option value="m">monatlich</option><option value="y">jährlich</option></select></div><div><label>Zahltag (optional)</label><input id="nd" type="number" min="1" max="31" inputmode="numeric" placeholder="automatisch"></div><div style="display:none"><label>Monat der Zahlung</label><select id="nm">'+MN.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div></div><label class="ck" style="margin-top:14px"><input id="nt" type="checkbox"> Variabel (Budgetbalken statt Häkchen)</label><button class="btn" onclick="ai()">Hinzufügen</button><button class="lk" onclick="U.ab=0;R()">Abbrechen</button></div>'}
function ai(){let n=$("nn").value.trim();const a=+$("na").value,k=$("nc").value,sub=SUBS[k]?$("ns").value:"";if(!n&&sub)n=sub;if(!n||!(a>0))return;const f=$("nf").value;D.items.push({id:"n"+Date.now(),name:n,cat:k,sub:sub,amt:a,freq:f,day:+$("nd").value||0,mon:+$("nm").value,bal:0,rate:k=="Vorsorge"?2:5,trk:$("nt").checked?1:0,pv:f=="y"?"y":"m",carry:0});U.ab=0;sv();R()}

/* ===== Vermögen ===== */
function lchart(ser){
 const v=ser.map(p=>p.v),idx=k=>(+k.slice(0,4))*12+(+k.slice(5)-1),i0=idx(ser[0].m),span=Math.max(idx(ser[ser.length-1].m)-i0,1),mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.12||Math.abs(mx)*.05||1,lo=mn-pad,hi=mx+pad,W=320,H=120,f=n=>n.toFixed(1);
 const P=ser.map(p=>[(idx(p.m)-i0)/span*W,H-(p.v-lo)/(hi-lo)*H]),pl=P.map(p=>f(p[0])+","+f(p[1])).join(" "),L=P[P.length-1];
 return'<svg viewBox="0 0 330 130" style="width:100%;display:block;overflow:visible"><polygon points="0,'+H+' '+pl+' '+W+','+H+'" fill="var(--pri)" opacity=".12"/><polyline points="'+pl+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="'+f(L[0])+'" cy="'+f(L[1])+'" r="5" fill="var(--gold)"/></svg><div class="ax"><span>'+ML(ser[0].m)+'</span><span>'+ML(ser[ser.length-1].m)+'</span></div>'}
function wform(md){
 const w=wmodel(),r=v=>Math.round(v),first=md==1,corr=md==2,sy=md==0;
 const rows=[["c","Konto / Cash",sy?w.cash:D.cash]].concat(D.items.filter(x=>SAV.includes(x.cat)).map(x=>[x.id,x.name,sy?w.inv[x.id]:(+x.bal||0)]));
 const tt=first?"Startvermögen festlegen":corr?"Startvermögen korrigieren":"Kontostände abgleichen";
 const tx=first?"Trag ein, was du heute auf deinen Konten hast. Danach rechnet die App jeden Monat Einnahmen und Ausgaben dazu.":corr?"Hier änderst du die Werte vom Start, falls etwas nicht stimmt. Alles danach wird neu berechnet.":"Trag die echten Kontostände von heute ein. Der Verlauf läuft danach mit diesen Werten weiter.";
 return'<div class="card"><h2>'+tt+'</h2><p class="s">'+tx+'</p>'+(sy?'':'<label for="wm'+md+'">Beginn der Aufzeichnung</label><input id="wm'+md+'" type="month" value="'+(first?curK():D.start)+'" max="'+curK()+'">')+rows.map(q=>'<div class="rw"><div>'+esc(q[1])+'</div><input id="wb'+md+'-'+q[0]+'" type="number" inputmode="decimal" value="'+r(q[2])+'"></div>').join("")+'<button class="btn" onclick="setBal('+md+')">Speichern</button>'+(corr?'<button class="lk" onclick="U.sc=0;R()">Abbrechen</button>':'')+'</div>'}
function setBal(md){
 const w=wmodel(),P="wb"+md+"-";if(md==0)D.past=(D.past||[]).concat(w.pts.slice(0,-1));
 D.cash=+$(P+"c").value||0;D.items.forEach(x=>{if(SAV.includes(x.cat)){const e=$(P+x.id);if(e)x.bal=+e.value||0}});
 if(md==0)D.start=curK();else{const v=$("wm"+md).value;D.start=/^\d{4}-\d{2}$/.test(v)?v:curK()}
 D.started=1;U.sc=0;sv();R();bn("Gespeichert");setTimeout(()=>bn(""),2500)}
function tWea(){
 const seg='<div class="seg" style="margin-bottom:14px"><button class="'+(U.ws!="prog"?"on":"")+'" onclick="U.ws=\'ov\';R()">Übersicht</button><button class="'+(U.ws=="prog"?"on":"")+'" onclick="U.ws=\'prog\';R()">Prognose</button></div>';
 if(U.ws=="prog")return seg+'<div class="card" id="wc"></div><div class="card"><h2>Zeitraum</h2><div class="seg" style="margin-top:8px">'+[1,5,10,20,30].map(y=>'<button class="'+(D.yrs==y?"on":"")+'" onclick="D.yrs='+y+';sv();R()">'+y+' J.</button>').join("")+'</div></div><div class="card"><h2>Rendite pro Konto</h2><p class="s">Erwartete Rendite pro Jahr für die Prognose.</p>'+D.items.map((x,i)=>[x,i]).filter(p=>SAV.includes(p[0].cat)).map(p=>'<div class="rw"><div>'+esc(p[0].name)+'<small>'+F(mo(p[0]))+' pro Monat</small></div><input class="sm" type="number" step="0.1" inputmode="decimal" value="'+(p[0].rate||0)+'" onchange="ue('+p[1]+',\'rate\',+this.value)"><span class="u">%</span></div>').join("")+'<div class="rw"><div>Konto / Cash</div><input class="sm" type="number" step="0.1" inputmode="decimal" value="'+D.cashR+'" onchange="D.cashR=+this.value;sv();R()"><span class="u">%</span></div></div>';
 let h=seg+wcard();
 const w=wmodel();
 h+='<div class="card"><h2>Konten</h2>'+[["Konto / Cash",w.cash],...w.sav.map(x=>[x.name,w.inv[x.id]])].map(q=>'<div class="rw"><div>'+esc(q[0])+'</div><b>'+F(q[1])+'</b></div>').join("")+'<button class="btn ghost" onclick="tab(\'set\')">Kontostände abgleichen</button></div>';
 return h+cmp3(curK(),1)}
function wc(){
 const{A,S}=proj(),n=D.yrs*12,end=S.reduce((s,o)=>s+o[n][0],0),inn=S.reduce((s,o)=>s+o[n][1],0),y=new Date().getFullYear();
 $("wc").innerHTML='<h2>Vermögen in '+yl(D.yrs)+'</h2><b class="big2">'+F(end)+'</b><p class="s">Eingezahlt '+F(inn)+', erwartete Rendite '+F(end-inn)+'. Die Prognose ist eine Annahme und keine Garantie.</p>'+area(S)+'<div class="ax"><span>'+y+'</span><span>'+(y+D.yrs)+'</span></div>'+A.map((a,k)=>'<div class="lg"><span><u style="background:'+PC[k%PC.length]+'"></u>'+esc(a.n)+'<em>'+a.r+' % p. a.</em></span><b>'+F(S[k][n][0])+'</b></div>').join("")}

/* ===== Sparziele ===== */
function ring(p,sz,col){const r=36,C=2*Math.PI*r,d=Math.max(0,Math.min(100,p))/100*C;return'<svg viewBox="0 0 90 90" width="'+sz+'" height="'+sz+'"><circle cx="45" cy="45" r="'+r+'" fill="none" stroke="var(--ln)" stroke-width="9"/><circle cx="45" cy="45" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+d.toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 45 45)"/><text x="45" y="51" text-anchor="middle" style="font-size:19px;font-weight:800;fill:var(--tx)">'+Math.round(p)+' %</text></svg>'}
function gchart(g,r){
 const n=Math.min(Math.max(r.mo,1),120),W=320,H=90,have=g.have||0,v=[];for(let t=0;t<=n;t++)v.push(Math.min(r.need,have+r.r*t));
 const mx=Math.max(r.need,1),X=t=>(t/n*W).toFixed(1),Y=y=>(H-y/mx*H).toFixed(1),p=v.map((y,t)=>X(t)+","+Y(y)).join(" ");
 return'<svg viewBox="0 0 320 96" style="width:100%;display:block;margin-top:12px"><line x1="0" x2="320" y1="0" y2="0" stroke="var(--gold)" stroke-dasharray="4 4" stroke-width="1.5"/><polygon points="0,'+H+' '+p+' '+W+','+H+'" fill="var(--pri)" opacity=".13"/><polyline points="'+p+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linejoin="round"/></svg><div class="ax"><span>heute</span><span>'+MN[r.done.getMonth()]+' '+r.done.getFullYear()+'</span></div>'}
function gdep(i){const e=$("gd"+i),v=parseFloat(String(e.value).replace(",","."));if(!(v>0))return;D.goals[i].have=(D.goals[i].have||0)+v;sv();R()}
function gcard(g,i){
 const r=gc(g),have=g.have||0,pct=r.need>0?Math.min(100,have/r.need*100):0,col=PC[i%PC.length],P=g.target,G=calc().gross>0?calc().gross:calc().net*1.15;
 const f=(k,l,t,v)=>'<div><label>'+l+'</label><input type="'+t+'"'+(t=="number"?' inputmode="decimal"':'')+' value="'+v+'" onchange="ug('+i+',\''+k+'\','+(t=="number"?"+this.value":"this.value")+')"></div>';
 const tile=(b,s)=>'<div class="tile"><b>'+b+'</b><span>'+s+'</span></div>';
 let h='<div class="card goal"><div class="gh">'+ring(pct,84,col)+'<div><b class="gn">'+esc(g.name)+'</b><em>'+GT[g.type]+'</em><span class="gl">'+(r.left>0?"Noch "+F(r.left):"Ziel erreicht")+'</span></div></div>';
 h+='<div class="pg" style="margin-top:12px"><i style="width:'+pct.toFixed(1)+'%;background:'+col+'"></i></div><div class="ax"><span>'+F(have)+' gespart</span><span>Ziel '+F(r.need)+'</span></div>';
 let when="–";if(r.left<=0)when="erreicht";else if(r.r>0)when=MN[r.done.getMonth()].slice(0,3)+" "+r.done.getFullYear();
 h+='<div class="tiles">'+tile(r.r>0?F(r.r):(r.req?F(r.req):"–"),r.r>0?"Sparrate / Mt.":(r.req?"nötig / Mt.":"Sparrate / Mt."))+tile(r.left<=0?"–":(r.r>0?dur(r.mo):"–"),"Dauer")+tile(when,"erreicht im")+'</div>';
 if(r.left>0&&r.r>0)h+=gchart(g,r);
 if(r.left>0&&r.r>0&&r.md>0)h+='<p class="s" style="margin:10px 0 0">'+(r.req>r.r+.5?"Für "+MN[+g.date.slice(5,7)-1]+" "+g.date.slice(0,4)+" musst du "+F(r.req)+" pro Monat sparen.":"Mit deiner Sparrate erreichst du den Zielmonat rechtzeitig.")+'</p>';
 else if(r.left>0)h+='<p class="s" style="margin:10px 0 0">'+(r.md>0?"Bis "+MN[+g.date.slice(5,7)-1]+" "+g.date.slice(0,4)+" musst du "+F(r.req)+" pro Monat sparen.":"Trag eine Sparrate oder einen Zielmonat ein, dann rechne ich es aus.")+'</p>';
 if(r.left>0)h+='<div class="dep"><input id="gd'+i+'" type="number" inputmode="decimal" placeholder="Einzahlung"><button class="btn sm" onclick="gdep('+i+')">Einzahlen</button></div>';
 h+='<button class="lk" onclick="U.ge=U.ge==\''+g.id+'\'?null:\''+g.id+'\';R()">'+(U.ge==g.id?"Schliessen":"Bearbeiten")+'</button>';
 if(U.ge==g.id){
  h+='<div class="pn"><div class="cr">'+f("name","Name","text",esc(g.name))+f("target",r.hs?"Kaufpreis":"Zielbetrag","number",g.target)+f("have","Bereits gespart","number",g.have||0)+f("rate","Sparrate pro Monat","number",g.rate||"")+'</div><label>Zielmonat (optional)</label><input type="month" value="'+(g.date||"")+'" onchange="ug('+i+',\'date\',this.value)">';
  const t=x=>'<p class="s" style="color:var(--tx);margin:10px 0 0">'+x+'</p>';
  if(r.hs&&P>0){
   const ek=P*.2,cost=hcost(P,ek),hv=have/.2;
   h+=t("Eigenkapital: mindestens "+F(ek)+" (20 % vom Kaufpreis), davon "+F(P*.1)+" aus eigenen Mitteln (Ersparnisse, Säule 3a), nicht aus der Pensionskasse. Die Hypothek beträgt dann rund "+F(P-ek)+".");
   h+=t("Tragbarkeit: Die Bank rechnet mit etwa "+F(cost)+" pro Jahr (5 % Zins, 1 % Unterhalt, Amortisation der 2. Hypothek in 15 Jahren). Das darf höchstens ein Drittel des Bruttoeinkommens sein, du brauchst also rund "+F(cost*3)+" pro Jahr."+(G>0?" Dein Bruttolohn von "+F(G)+" "+(cost<=G/3?"reicht dafür aus":"reicht dafür nicht aus")+" (Belastung "+Math.round(cost/G*100)+" %).":""));
   if(G>0&&have>0){let lo=0,up=hv;for(let k=0;k<40;k++){const m=(lo+up)/2;if(hcost(m,have)<=G/3)lo=m;else up=m}
    h+=t("Mit deinem Eigenkapital von "+F(have)+" und deinem Lohn wäre ein Kaufpreis bis rund "+F(Math.round(lo/1000)*1000)+" möglich, begrenzt durch "+(lo>=hv-1?"das Eigenkapital":"die Tragbarkeit")+".")}
   h+=t("Kaufnebenkosten (Notar, Grundbuch, je nach Kanton) kommen noch dazu. Jede Bank rechnet im Detail anders, das ist keine Finanzierungsberatung.")}
  h+='<button class="btn ghost dng" onclick="dg('+i+')">Sparziel löschen</button></div>'}
 return h+'</div>'}
function tGoals(){
 const c=calc();let tot=0,sh=0,sn=0;
 D.goals.forEach(g=>{const r=gc(g);if(r.left>0)tot+=r.r>0?r.r:(r.req||0);sh+=Math.min(g.have||0,r.need);sn+=r.need});
 let h='';
 if(D.goals.length)h+='<div class="card"><h2>Deine Sparziele</h2><b class="big2">'+F(sh)+'</b><p class="s">von '+F(sn)+' gespart ('+(sn>0?Math.round(sh/sn*100):0)+' %)</p><div class="pg"><i style="width:'+(sn>0?Math.min(100,sh/sn*100):0).toFixed(1)+'%"></i></div><p class="s" style="margin:8px 0 0">Frei zum Sparen: '+F(c.free)+' pro Monat. Deine Ziele brauchen zusammen '+F(tot)+' pro Monat'+(tot>Math.max(c.free,0)?', das ist mehr, als du frei sparen kannst.':'.')+'</p></div>';
 h+=D.goals.map(gcard).join("");
 if(!U.ga&&D.goals.length)return h+'<button class="btn" onclick="U.ga=1;R()">+ Neues Sparziel</button>';
 return h+'<div class="card"><h2>Neues Sparziel</h2><p class="s">Auch kleine Ziele wie Möbel, Ferien oder eine Reise. Mit einem Zielmonat rechnet die App aus, wie viel du pro Monat sparen musst.</p><label>Name</label><input id="gn" placeholder="z. B. Eigenheim"><div class="cr"><div><label>Art</label><select id="gt">'+Object.keys(GT).map(k=>'<option value="'+k+'">'+GT[k]+'</option>').join("")+'</select></div><div><label>Zielbetrag / Kaufpreis</label><input id="ga" type="number" inputmode="decimal"></div><div><label>Zielmonat (optional)</label><input id="gm" type="month" min="'+curK()+'"></div></div><button class="btn" onclick="ag()">Sparziel hinzufügen</button>'+(D.goals.length?'<button class="lk" onclick="U.ga=0;R()">Abbrechen</button>':'')+'</div>'}

/* ===== Mehr, Einstellungen, Navigation ===== */
function setCar(on){
 if(on&&D.car.off){D.items=D.items.concat(D.carStash);D.carStash=[];D.car.off=0}
 else if(!on&&!D.car.off){D.carStash=D.items.filter(x=>x.cat=="Auto");D.items=D.items.filter(x=>x.cat!="Auto");D.car.off=1}
 sv();R()}
function carSw(){return'<div class="card"><div class="rw" style="border:0;padding:0"><input type="checkbox" '+(carOn()?"checked":"")+' onchange="setCar(this.checked?1:0)" id="hc"><div><label for="hc" style="margin:0;color:var(--tx);font-size:15px">Ich besitze ein Auto</label><small>Ausgeschaltet verschwinden Auto-Kosten, Tipps und der Kilometerpreis aus der Rechnung. Deine Eingaben bleiben gespeichert.</small></div></div></div>'}
function setTheme(t){TH=t;try{localStorage.setItem("fp_theme",TH)}catch(e){}applyTheme();R()}
function konto(){
 return'<div class="card"><h2>Konto</h2><p class="s">Angemeldet als '+esc(auth.currentUser?auth.currentUser.email:"")+'. Deine Daten werden mit allen Geräten synchronisiert.</p><button class="btn ghost" onclick="auth.signOut()">Abmelden</button><button class="btn ghost dng" onclick="wipe()">Alle Einträge löschen und leer starten</button></div>'}
function tSet(){
 const th=(v,l)=>'<button class="'+(TH==v?"on":"")+'" onclick="setTheme(\''+v+'\')">'+l+'</button>';
 return'<div class="card"><h2>Darstellung</h2><div class="seg">'+th("auto","Automatisch")+th("light","Hell")+th("dark","Dunkel")+'</div><label>Währung</label><select onchange="D.cur=this.value;sv();R()">'+["CHF","EUR","USD","GBP"].map(c=>'<option'+(D.cur==c?" selected":"")+'>'+c+'</option>').join("")+'</select></div>'+(!D.started?wform(1):(U.sc?wform(2):'<div class="card"><h2>Startvermögen</h2><div class="lg"><span>Beginn</span><b>'+ML(D.start)+'</b></div><button class="btn ghost" onclick="U.sc=1;R()">Startvermögen bearbeiten</button></div>')+wform(0))+carSw()+konto()}
function tMore(){
 const t=new Date(),L=due(t.getFullYear(),t.getMonth()).filter(l=>!l.ok).length,n=tipsList().filter(x=>x[0]!="good").length;
 const r=(p,a,s)=>'<button class="lr" onclick="tab(\''+p+'\')"><span><b>'+a+'</b><small>'+s+'</small></span><i>›</i></button>';
 return r("chk","Checkliste",L?L+" Zahlungen offen in diesem Monat":"Zahlungen abhaken und im Kalender speichern")+r("tip","Tipps",n?n+" Hinweise zum Sparen":"Sparpotenzial und Richtwerte")+r("set","Einstellungen","Startvermögen, Darstellung, Auto, Konto")}
const IC={home:"M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",bud:"M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l11-4v4M16 14h2",ist:"M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",goal:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12h.01",wea:"M3 17l6-6 4 4 8-8M15 7h6v6",more:"M5 12h.01M12 12h.01M19 12h.01"};
const NAV=[["home","Start"],["bud","Budget"],["ist","Ausgaben"],["goal","Ziele"],["wea","Vermögen"],["more","Mehr"]];
const PAGES={home:tHome,bud:tBud,ist:tIst,goal:tGoals,wea:tWea,more:tMore,chk:tChk,tip:tTip,set:tSet};
function R(){
 const sub=["chk","tip","set"].includes(U.tab),act=sub?"more":U.tab;
 $("v").innerHTML=(sub?'<button class="bk" onclick="tab(\'more\')">‹ Mehr</button>':'')+PAGES[U.tab]();
 $("nv").innerHTML=NAV.map(t=>'<button class="'+(act==t[0]?"on":"")+'" onclick="tab(\''+t[0]+'\')"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="'+(t[0]=="more"?3:1.8)+'" stroke-linecap="round" stroke-linejoin="round"><path d="'+IC[t[0]]+'"/></svg><span>'+t[1]+'</span></button>').join("");
 if(U.tab=="bud"&&U.bs=="inc")ires();
 if(U.tab=="bud"&&U.bs!="inc"&&U.ab)fs();
 if(U.tab=="ist"&&U.ae)fe();
 if(U.tab=="wea"&&U.ws=="prog")wc()}
function tab(t){U.tab=t;if(t=="ist"){U.im=curK();U.msg=""}R();scrollTo(0,0)}

function carCalc(){
 const c=calc(),A=(c.by.Auto||0)*12,km=D.km||0,k=D.car||{},P=+k.price||0;
 if(!(A>0)||!(km>0))return null;
 const a=+k.age||0,d=Math.min(.3,(.11+.01*km/1e4)*Math.max(.5,1-.07*a)),val=t=>P*Math.pow(1-d,t),cost=n=>(P-val(n)+A*n)/(n*km);
 const n0=Math.max(T0.getFullYear()-(+k.year||T0.getFullYear())+1,1),yo=n0-1+T0.getMonth()/12;
 return{A,km,P,d,dep:val(n0-1)-val(n0),cost,n0,rest:val(yo)}}
function carChart(cc){
 const W=320,H=120,v=[];for(let n=1;n<=15;n++)v.push(cc.cost(n)*100);
 const mx=Math.max(...v),mn=Math.min(...v)*.9,X=i=>(i/14*W).toFixed(1),Y=y=>(H-(y-mn)/(mx-mn||1)*H).toFixed(1),p=v.map((y,i)=>X(i)+","+Y(y)).join(" "),i0=Math.min(Math.max(cc.n0,1),15)-1;
 return'<svg viewBox="0 0 320 130" style="width:100%;display:block;overflow:visible;margin-top:10px"><polygon points="0,'+H+' '+p+' '+W+','+H+'" fill="var(--pri)" opacity=".12"/><polyline points="'+p+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="'+X(i0)+'" cy="'+Y(v[i0])+'" r="5" fill="var(--gold)"/></svg><div class="ax"><span>1 Jahr Besitz</span><span>15 Jahre</span></div>'}

/* ===== Kalender-Export (.ics), funktioniert mit Google, Samsung, Apple und Outlook ===== */
const ICAL='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>';
const APPURL="https://budgetpilot26.github.io/Finanzplaner/";
const p2=n=>String(n).padStart(2,"0"),ie=t=>String(t).replace(/\\/g,"\\\\").replace(/;/g,"\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
const fold=l=>{let o="",i=0;while(l.length-i>60){o+=l.slice(i,i+60)+"\r\n ";i+=60}return o+l.slice(i)};
function nextOcc(day,freq,mon){
 const t=new Date(),y=t.getFullYear(),m=t.getMonth(),td=t.getDate(),dim=(yy,mm)=>new Date(yy,mm+1,0).getDate();
 if(freq=="y"){let yy=y;if(new Date(yy,mon-1,Math.min(day,dim(yy,mon-1)))<new Date(y,m,td))yy++;return[yy,mon,Math.min(day,dim(yy,mon-1))]}
 let yy=y,mm=m,dd=Math.min(day,dim(yy,mm));if(dd<td){mm++;if(mm>11){mm=0;yy++}dd=Math.min(day,dim(yy,mm))}
 return[yy,mm+1,dd]}
function icsEv(id,sum,desc,st,hh,rr,al){
 const z=new Date().toISOString().replace(/[-:]|\.\d{3}/g,""),L=["BEGIN:VEVENT","UID:fp-"+id+"@budgetpilot26.github.io","DTSTAMP:"+z,"DTSTART:"+st[0]+p2(st[1])+p2(st[2])+"T"+hh+"0000","DURATION:PT15M","SUMMARY:"+ie(sum),"DESCRIPTION:"+ie(desc),"RRULE:"+rr];
 al.forEach(a=>L.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+ie(sum),"TRIGGER:"+a,"END:VALARM"));
 L.push("END:VEVENT");return L}
function payEv(x){
 const dd=x.day>28?-1:x.day,y=x.freq=="y",rr=y?"FREQ=YEARLY;BYMONTH="+(+x.mon)+";BYMONTHDAY="+dd:"FREQ=MONTHLY;BYMONTHDAY="+dd;
 return icsEv("pay-"+x.id,"Zahlung: "+x.name+" ("+D.cur+" "+Math.round(x.amt*100)/100+")",(y?"Fällig am "+x.day+". "+MN[x.mon-1]+".":"Fällig jeden Monat am "+x.day+".")+" Im Finanzplaner abhaken: "+APPURL,nextOcc(x.day,x.freq,+x.mon),"09",rr,D.lead>0?["-P"+D.lead+"D","PT0M"]:["PT0M"])}
function dlIcs(fn,ev){
 const t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Finanzplaner//DE","CALSCALE:GREGORIAN","METHOD:PUBLISH"].concat(ev,["END:VCALENDAR"]).map(fold).join("\r\n")+"\r\n";
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/calendar;charset=utf-8"}));a.download=fn;document.body.appendChild(a);a.click();
 setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);return t}
function calOne(id){const x=D.items.find(z=>z.id==id);if(x)dlIcs("zahlung-"+x.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".ics",payEv(x))}
function calAll(){const L=D.items.filter(x=>x.day>0&&!x.trk),ev=[];L.forEach(x=>payEv(x).forEach(l=>ev.push(l)));
 if(!ev.length){bn("Es gibt keine Zahlungen mit Zahltag.");setTimeout(()=>bn(""),3000);return}dlIcs("finanzplaner-zahlungen.ics",ev)}
function calRem(){
 const v=+$("rd").value,rr="FREQ=MONTHLY;BYMONTHDAY="+v;
 dlIcs("finanzplaner-erinnerung.ics",icsEv("monatlich","Finanzplaner: Daten nachtragen","Ausgaben (Lebensmittel, Restaurant, Kleider usw.) nachtragen und Fixkosten abhaken: "+APPURL,nextOcc(v<0?31:v,"m",0),"18",rr,["PT0M"]))}
function calCard(){
 return'<div class="card"><h2>Kalender</h2><p class="s">Speichere deine Zahlungen als Kalendereintrag. Tippe oben bei einer Zahlung auf das Kalendersymbol oder nimm alle auf einmal. Öffne die heruntergeladene Datei, dann landet sie in deinem Kalender und wiederholt sich automatisch. Ändert sich ein Betrag oder Zahltag, lade die Datei neu.</p><button class="btn ghost" onclick="calAll()">Alle Zahlungen in den Kalender</button>'
  +'<label for="rd" style="margin-top:14px">Monatliche Erinnerung: Daten nachtragen</label><select id="rd">'+[[1,"am 1. des Monats"],[3,"am 3. des Monats"],[5,"am 5. des Monats"],[10,"am 10. des Monats"],[25,"am 25. des Monats"],[-1,"am letzten Tag des Monats"]].map(o=>'<option value="'+o[0]+'">'+o[1]+'</option>').join("")+'</select><button class="btn ghost" onclick="calRem()">Erinnerung in den Kalender</button></div>'}

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
   if(s.exists){D=Object.assign(mk(),s.data());fix();ready=true;if(!typing())R()}
   else if(!s.metadata.fromCache){D=mk();fix();ready=true;sv();R()}
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
function signUp(){$("lerr").textContent="";$("lok").textContent="";if($("pw").value.length<10){$("lerr").textContent="Bitte wähle ein Passwort mit mindestens 10 Zeichen.";return}auth.createUserWithEmailAndPassword($("em").value.trim(),$("pw").value).catch(e=>$("lerr").textContent=errText(e))}
function reset(){
 const e=$("em").value.trim();$("lerr").textContent="";$("lok").textContent="";
 if(!e){$("lerr").textContent="Bitte zuerst deine E-Mail eintragen.";return}
 auth.sendPasswordResetEmail(e).then(()=>$("lok").textContent="Wir haben dir eine E-Mail zum Zurücksetzen geschickt.").catch(x=>$("lerr").textContent=errText(x))}
function wipe(){
 if(!confirm("Alle Einträge löschen und leer starten? Das lässt sich nicht rückgängig machen."))return;
 D=mk();D.items=[];D.inc.gross=0;D.cash=0;D.paid={};fix();sv();R()}

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

