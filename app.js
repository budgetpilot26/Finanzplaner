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
const mk0=()=>({cur:"CHF",cash:10000,cashR:.5,yrs:10,lead:3,paid:{},extra:[],km:0,goals:[],ist:{},istIn:{},rules:{},hist:{},carStash:[],car:{price:0,year:0,age:0,off:0,mode:"run"},
inc:{mode:"y",gross:96000,net:0,th:false,day:25,tax:12},
ab:[{on:1,p:5.3},{on:1,p:1.1},{on:1,p:6},{on:1,p:1},{on:1,p:.5},{on:0,p:0}],
items:[
{name:"Miete",cat:"Wohnen",amt:1800,freq:"m",day:1,mon:1},
{name:"Krankenkasse",cat:"Krankenkasse",amt:380,freq:"m",day:26,mon:1},
{name:"Risikolebensversicherung",cat:"Versicherungen",sub:"Risikolebensversicherung",amt:35,freq:"m",day:0,mon:1},
{name:"Rechtsschutz",cat:"Versicherungen",sub:"Rechtsschutz",amt:280,freq:"y",day:0,mon:1},
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
{name:"Kleider",cat:"Kleider",amt:100,freq:"m",day:0,mon:1},
{name:"Möbel und Haushalt",cat:"Möbel",amt:50,freq:"m",day:0,mon:1},
{name:"Ferien",cat:"Ferien",amt:3000,freq:"y",day:1,mon:7}]});
const mk=()=>{const d=mk0();d.items.forEach((x,i)=>{x.id="i"+i});return d};
let D=mk();
const U={tab:"home",ws:"prog",es:"bud",by:T0.getFullYear(),im:null,imp:null,base:null,msg:"",ed:null,cm:T0.getMonth(),cy:T0.getFullYear()};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const F=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,maximumFractionDigits:0}).format(n);
const Fd=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:D.cur,minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2}).format(n);
function fix(){D.items.forEach((x,i)=>{if(!x.id)x.id="i"+i});D.extra=D.extra||[];D.extra.forEach((x,i)=>{if(!x.id)x.id="e"+i});D.goals=D.goals||[];D.goals.forEach((x,i)=>{if(!x.id)x.id="g"+i});D.km=D.km||0;D.paid=D.paid||{};D.ist=D.ist||{};D.istIn=D.istIn||{};D.rules=D.rules||{};D.car=Object.assign({price:0,year:0,age:0,off:0},D.car||{});if(!D.car.mode)D.car.mode=D.car.price>0?"full":"run";D.hist=D.hist||{};D.carStash=D.carStash||[]}
function bn(m){$("bn").textContent=m;$("bn").className=m?"bn":"hide"}
let uid=null,unsub=null,tm=null,ready=false;
const ref=()=>db.collection("users").doc(uid).collection("planner").doc("main");
function sv(){if(!uid||!ready)return;snap();clearTimeout(tm);tm=setTimeout(()=>ref().set(JSON.parse(JSON.stringify(D))).then(()=>bn("")).catch(e=>bn("Speichern fehlgeschlagen: "+e.message)),500)}

function calc(){
 const i=D.inc,f=i.mode=="m"?(i.th?13:12):1,gross=i.gross*f,ded=D.ab.reduce((s,a)=>s+(a.on?a.p:0),0),net=i.net>0?i.net*f:gross*(1-ded/100);
 let xm=0,xt=0;D.extra.forEach(x=>{const m=x.freq=="y"?x.amt/12:x.amt;xm+=m;if(x.tax)xt+=m});
 const netM=net/12+xm,taxY=(net+xt*12)*i.tax/100,taxM=taxY/12,by={};let exp=0,sav=0;
 D.items.forEach(x=>{const m=x.freq=="y"?x.amt/12:x.amt;if(SAV.includes(x.cat))sav+=m;else exp+=m;by[x.cat]=(by[x.cat]||0)+m});
 return{gross,net,ded,xm,netM,taxY,taxM,by,exp,sav,free:netM-taxM-exp-sav}}
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
 const L=[];
 D.items.forEach(x=>{if(x.day>0&&(x.freq=="m"||+x.mon==m+1))L.push({id:x.id,n:x.name,d:x.day,v:x.amt})});
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
 const dd=due(T0.getFullYear(),T0.getMonth()).filter(l=>!l.ok&&st(l,T0.getFullYear(),T0.getMonth())[1]),ic=incs(),tp=tipsList().filter(t=>t[0]!="good").slice(0,2);
 let h='<div class="hero">'+spark(S)+'<small>Frei zum Sparen</small><b class="big">'+F(c.free)+'<span> / Monat</span></b>'+(c.free<0?'<p style="margin:-8px 0 12px">Die Ausgaben übersteigen das Einkommen.</p>':'')+'<div class="g"><div><b>'+F(Math.max(c.free,0)*rem)+'</b><span>bis Jahresende</span></div><div><b>'+F((c.free+c.sav)*12)+'</b><span>pro Jahr gespart ('+q+' %)</span></div><div><b>'+F(end)+'</b><span>Vermögen in '+yl(D.yrs)+'</span></div></div></div>';
 if(ic.length)h+='<div class="card"><h2>Nächste Einnahmen</h2>'+ic.slice(0,4).map(l=>'<div class="rw"><div>'+esc(l.n)+'<small>am '+l.day+'.</small></div><div class="r"><b class="pos">+'+Fd(l.v)+'</b><span class="tg ok">'+dl(l.d)+'</span></div></div>').join("")+'</div>';
 if(dd.length)h+='<div class="card"><h2>Fällig</h2>'+dd.slice(0,5).map(l=>{const s=st(l,T0.getFullYear(),T0.getMonth());return'<div class="rw"><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[T0.getMonth()]+'</small></div><div class="r"><b>'+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div></div>'}).join("")+'<button class="btn" onclick="tab(\'chk\')">Zur Checkliste</button></div>';
 if(tp.length)h+='<div class="card"><h2>Sparpotenzial</h2>'+tp.map(tipHtml).join("")+'<button class="btn ghost" onclick="tab(\'tip\')">Alle Tipps</button></div>';
 h+='<div class="card"><h2>Wohin dein Einkommen fliesst</h2><p class="s">Netto im Durchschnitt: '+F(c.netM)+' pro Monat</p>'+bar(P)+P.map(p=>'<div class="lg"><span><u style="background:'+p[2]+'"></u>'+p[0]+'</span><b>'+F(p[1])+'</b></div>').join("")+'<p class="s" style="margin:10px 0 0">Steuern: rund '+F(c.taxY)+' pro Jahr. Bis Jahresende solltest du noch '+F(c.taxM*rem)+' zurücklegen.</p></div>';
 return h+mchart()+'<div class="card"><h2>Ausgaben nach Kategorie</h2>'+donut(c.by,keys,tot)+keys.map(k=>'<div class="lg"><span><u style="background:'+CC[k]+'"></u>'+k+'<em>'+Math.round(c.by[k]/tot*100)+' %</em></span><b>'+F(c.by[k])+'</b></div>').join("")+'</div>'+konto()}
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
function tBud(){
 const c=calc();
 let h=carSw()+'<div class="card"><h2>Ausgaben, Vorsorge und Anlagen</h2><p class="s">Pro Monat: '+F(c.exp+c.sav)+', davon Vorsorge und Anlagen '+F(c.sav)+'. Tippe auf einen Namen, um Unterkategorie, Rhythmus und Zahltag zu ändern. Ohne Zahltag läuft die Zahlung automatisch (Lastschrift oder Dauerauftrag).</p>';
 Object.keys(CC).forEach(k=>{
  const L=D.items.map((x,i)=>[x,i]).filter(p=>p[0].cat==k);if(!L.length)return;
  const sb=SUBS[k],ss={};if(sb)L.forEach(p=>{const s=subOf(p[0]);ss[s]=(ss[s]||0)+(p[0].freq=="y"?p[0].amt/12:p[0].amt)});
  h+='<div class="lg" style="margin-top:12px"><b><u style="background:'+CC[k]+'"></u>'+k+'</b><b>'+F(c.by[k])+'</b></div>'+(sb&&Object.keys(ss).length>1?'<p class="s" style="margin:0 0 4px">'+Object.keys(ss).map(s=>s+" "+F(ss[s])).join(", ")+'</p>':'')+L.map(p=>{const x=p[0];
   return'<div class="rw"><div class="ed" onclick="te(\''+x.id+'\')">'+esc(x.name)+'<small>'+(sb?subOf(x)+", ":"")+(x.freq=="y"?"jährlich im "+MN[x.mon-1]:"monatlich")+(x.day>0?", Zahltag am "+x.day+".":", automatisch")+'</small></div><input type="number" inputmode="decimal" value="'+x.amt+'" onchange="ui('+p[1]+',+this.value)"><button class="x" onclick="di('+p[1]+')" aria-label="Löschen">✕</button></div>'+(U.ed==x.id?pn(p[1]):"")}).join("")});
 return h+'</div><div class="card"><h2>Neue Ausgabe</h2><label>Bezeichnung</label><input id="nn" placeholder="z. B. Spotify"><div class="cr"><div><label>Kategorie</label><select id="nc" onchange="fs()">'+Object.keys(CC).filter(k=>k!="Auto"||carOn()).map(k=>'<option>'+k+'</option>').join("")+'</select></div><div><label>Betrag</label><input id="na" type="number" inputmode="decimal"></div><div id="nsw" style="display:none"><label>Unterkategorie</label><select id="ns"></select></div><div><label>Rhythmus</label><select id="nf" onchange="$(\'nm\').parentNode.style.display=this.value==\'y\'?\'\':\'none\'"><option value="m">monatlich</option><option value="y">jährlich</option></select></div><div><label>Zahltag (optional)</label><input id="nd" type="number" min="1" max="31" inputmode="numeric" placeholder="automatisch"></div></div><div style="display:none"><label>Monat der Zahlung</label><select id="nm">'+MN.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div><button class="btn" onclick="ai()">Hinzufügen</button></div>'}
function ai(){const n=$("nn").value.trim(),a=+$("na").value,k=$("nc").value;if(!n||!(a>0))return;D.items.push({id:"n"+Date.now(),name:n,cat:k,sub:SUBS[k]?$("ns").value:"",amt:a,freq:$("nf").value,day:+$("nd").value||0,mon:+$("nm").value,bal:0,rate:k=="Vorsorge"?2:5});sv();R()}
function ui(i,v){D.items[i].amt=v;sv();R()}
function di(i){D.items.splice(i,1);sv();R()}

function tChk(){
 const L=due(U.cy,U.cm),n=L.filter(l=>l.ok).length;
 return'<div class="card"><div class="mn"><button onclick="mv(-1)" aria-label="Voriger Monat">‹</button><h2>'+MN[U.cm]+' '+U.cy+'</h2><button onclick="mv(1)" aria-label="Nächster Monat">›</button></div>'+(L.length?'<p class="s" style="text-align:center">'+n+' von '+L.length+' erledigt</p><div class="pg"><i style="width:'+n/L.length*100+'%"></i></div>'+L.map(l=>{const s=st(l,U.cy,U.cm);return'<div class="rw'+(l.ok?" done":"")+'"><button class="o'+(l.ok?" on":"")+'" onclick="tg(\''+l.key+'\')" aria-label="Erledigt">'+(l.ok?"✓":"")+'</button><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[U.cm]+'</small></div><div class="r"><b>−'+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div><button class="x" onclick="calOne(\''+l.id+'\')" aria-label="Im Kalender speichern">'+ICAL+'</button></div>'}).join(""):'<p class="s" style="text-align:center">In diesem Monat gibt es keine Zahlungen mit Zahltag.</p>')+'</div><div class="card"><h2>Erinnerung</h2><p class="s">Hier erscheinen nur Zahlungen mit Zahltag. Bei Lastschrift oder Dauerauftrag lässt du den Zahltag leer, dann musst du nichts abhaken. Ab wie vielen Tagen vor der Fälligkeit soll eine Zahlung als „bald fällig“ erscheinen?</p><select onchange="D.lead=+this.value;sv();R()">'+[1,2,3,5,7].map(d=>'<option value="'+d+'"'+(D.lead==d?" selected":"")+'>'+d+' Tage vorher</option>').join("")+'</select></div>'+calCard()}
function tProg(){
 const c=calc(),inp=(oi,k,val,cl)=>'<input'+(cl?' class="sm"':'')+' type="number" step="0.1" inputmode="decimal" value="'+val+'" oninput="sw('+oi+',\''+k+'\',+this.value)">';
 const rows=D.items.map((x,i)=>[x,i]).filter(p=>SAV.includes(p[0].cat)).map(p=>{const x=p[0],m=x.freq=="y"?x.amt/12:x.amt;return'<div class="rw"><div>'+esc(x.name)+'<small>'+F(m)+' pro Monat</small></div>'+inp(p[1],"bal",x.bal||0)+inp(p[1],"rate",x.rate||0,1)+'</div>'}).join("");
 return'<div class="card"><h2>Anlagen und Vorsorge</h2><p class="s">Trag pro Anlage den heutigen Bestand und die erwartete Rendite pro Jahr ein. Die monatlichen Einzahlungen kommen aus deinen Ausgaben, beim Konto aus dem frei sparbaren Betrag.</p><div class="rw hd"><div></div><span>Bestand</span><span class="sm">Rendite %</span></div>'+rows+'<div class="rw"><div>Konto / Cash<small>'+F(c.free)+' pro Monat</small></div>'+inp(-1,"cash",D.cash)+inp(-1,"cashR",D.cashR,1)+'</div></div><div class="card"><h2>Zeitraum</h2><div class="chips" style="margin-top:8px">'+[1,5,10,20,30].map(y=>'<button class="'+(D.yrs==y?"on":"")+'" onclick="D.yrs='+y+';sv();R()">'+y+' J.</button>').join("")+'</div></div><div class="card" id="wc"></div>'+hchart()}
function sw(i,k,v){if(i<0)D[k]=v;else D.items[i][k]=v;sv();wc()}
function wc(){
 const{A,S}=proj(),n=D.yrs*12,end=S.reduce((s,o)=>s+o[n][0],0),inn=S.reduce((s,o)=>s+o[n][1],0),y=T0.getFullYear();
 $("wc").innerHTML='<h2>Vermögen in '+yl(D.yrs)+'</h2><b class="big2">'+F(end)+'</b><p class="s">Eingezahlt '+F(inn)+', erwartete Rendite '+F(end-inn)+'. Die Prognose ist eine Annahme und keine Garantie.</p>'+area(S)+'<div class="ax"><span>'+y+'</span><span>'+(y+D.yrs)+'</span></div>'+A.map((a,k)=>'<div class="lg"><span><u style="background:'+PC[k%PC.length]+'"></u>'+esc(a.n)+'<em>'+a.r+' % p. a.</em></span><b>'+F(S[k][n][0])+'</b></div>').join("")}
const IC={home:"M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",inc:"M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l11-4v4M16 14h2",exp:"M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",chk:"M4 5h16v14H4zM8 12l3 3 5-6",wea:"M3 17l6-6 4 4 8-8M15 7h6v6",tip:"M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"};
function R(){
 const T={home:tHome,inc:tInc,exp:tExp,chk:tChk,wea:tWea,tip:tTip};
 $("v").innerHTML=T[U.tab]();
 $("nv").innerHTML=[["home","Übersicht"],["inc","Einkommen"],["exp","Ausgaben"],["chk","Checkliste"],["wea","Vermögen"],["tip","Tipps"]].map(t=>'<button class="'+(U.tab==t[0]?"on":"")+'" onclick="tab(\''+t[0]+'\')"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+IC[t[0]]+'"/></svg><span>'+t[1]+'</span></button>').join("");
 if(U.tab=="inc")ires();
 if(U.tab=="exp"&&U.es!="ist")fs();
 if(U.tab=="wea"&&U.ws!="ziele")wc()}
function tab(t){U.tab=t;R();scrollTo(0,0)}


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

function pn(i){
 const x=D.items[i],sb=SUBS[x.cat];
 return'<div class="pn"><label>Bezeichnung</label><input value="'+esc(x.name)+'" onchange="ue('+i+',\'name\',this.value)">'+(sb?'<label>Unterkategorie</label><select onchange="ue('+i+',\'sub\',this.value)">'+sb.map(s=>'<option'+(subOf(x)==s?" selected":"")+'>'+s+'</option>').join("")+'</select>':"")+'<div class="cr"><div><label>Rhythmus</label><select onchange="ue('+i+',\'freq\',this.value)"><option value="m"'+(x.freq=="m"?" selected":"")+'>monatlich</option><option value="y"'+(x.freq=="y"?" selected":"")+'>jährlich</option></select></div><div><label>Zahltag (leer = automatisch)</label><input type="number" min="1" max="31" inputmode="numeric" value="'+(x.day>0?x.day:"")+'" onchange="ue('+i+',\'day\',+this.value||0)"></div></div>'+(x.freq=="y"?'<label>Monat der Zahlung</label><select onchange="ue('+i+',\'mon\',+this.value)">'+MN.map((m,k)=>'<option value="'+(k+1)+'"'+(x.mon==k+1?" selected":"")+'>'+m+'</option>').join("")+'</select>':"")+'<button class="btn ghost" onclick="te(null)">Fertig</button></div>'}
function te(id){U.ed=U.ed==id?null:id;R()}
function ue(i,k,v){D.items[i][k]=v;sv();R()}

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
const SUBS={Auto:["Tanken","Versicherung","Steuern","Service / Reparatur","Parkplatz / Leasing","Sonstiges"],Abos:["Handy","Internet / TV","Streaming","Musik","Sonstiges"],Mitgliedschaften:["Fitness","Verein","Sonstiges"],Versicherungen:["Risikolebensversicherung","Rechtsschutz","Haftpflicht / Hausrat","Unfall / Invalidität","Sonstiges"]};
const GU={Auto:[[/benzin|tank|diesel|laden/i,"Tanken"],[/versicher/i,"Versicherung"],[/steuer/i,"Steuern"],[/service|reparatur|garage|pneu/i,"Service / Reparatur"],[/park|leasing/i,"Parkplatz / Leasing"]],Abos:[[/handy|mobile|natel|swisscom|sunrise|salt|wingo|yallo/i,"Handy"],[/internet|wlan|glasfaser|fiber|\btv\b/i,"Internet / TV"],[/netflix|disney|prime|streaming|sky|teleclub|youtube|dazn/i,"Streaming"],[/spotify|deezer|apple music|musik|tidal/i,"Musik"]],Mitgliedschaften:[[/fitness|gym|yoga|sport|activ/i,"Fitness"],[/verein|club|tcs|sac/i,"Verein"]],Versicherungen:[[/risiko|leben/i,"Risikolebensversicherung"],[/rechts/i,"Rechtsschutz"],[/haftpflicht|hausrat/i,"Haftpflicht / Hausrat"],[/unfall|invalid|erwerbs/i,"Unfall / Invalidität"]]};
function subOf(x){if(x.sub)return x.sub;const g=GU[x.cat];if(g)for(const r of g)if(r[0].test(x.name))return r[1];return SUBS[x.cat]?"Sonstiges":""}
function fs(){const s=SUBS[$("nc").value];$("nsw").style.display=s?"":"none";$("ns").innerHTML=s?s.map(x=>"<option>"+x+"</option>").join(""):""}

const GT={haus:"Haus / Wohnung",reise:"Reise",auto:"Auto",anlage:"Investition",sonst:"Sonstiges"};
const hcost=(p,e)=>{const h=Math.max(p-e,0);return h*.05+p*.01+Math.max(h-p*2/3,0)/15};
function gc(g){
 const hs=g.type=="haus",need=hs?g.target*.2:g.target,left=Math.max(need-(g.have||0),0),r=g.rate||0;
 const mo=r>0?Math.ceil(left/r):0,md=g.date?(+g.date.slice(0,4))*12+(+g.date.slice(5,7))-1-(T0.getFullYear()*12+T0.getMonth()):null;
 return{hs,need,left,r,mo,md,req:md>0?left/md:null,done:new Date(T0.getFullYear(),T0.getMonth()+mo,1)}}
function dur(mo){const y=Math.floor(mo/12),m=mo%12;return(y?y+(y==1?" Jahr":" Jahre"):"")+(y&&m?" und ":"")+(m?m+(m==1?" Monat":" Monate"):"")||"weniger als ein Monat"}
function tGoals(){
 const c=calc(),G=c.gross>0?c.gross:c.net*1.15;let tot=0;
 const cards=D.goals.map((g,i)=>{
  const r=gc(g);if(r.left>0)tot+=r.r>0?r.r:(r.req||0);
  const pct=r.need>0?Math.min(100,Math.round((g.have||0)/r.need*100)):0,P=g.target;
  const f=(k,l,t,v)=>'<div><label>'+l+'</label><input type="'+t+'"'+(t=="number"?' inputmode="decimal"':'')+' value="'+v+'" onchange="ug('+i+',\''+k+'\','+(t=="number"?"+this.value":"this.value")+')"></div>';
  let h='<div class="card"><div class="lg"><b>'+esc(g.name)+'<em>'+GT[g.type]+'</em></b><button class="x" onclick="dg('+i+')" aria-label="Löschen">✕</button></div><div class="pg"><i style="width:'+pct+'%"></i></div><p class="s">'+F(g.have||0)+' von '+F(r.need)+' gespart ('+pct+' %)'+(r.hs?'. Das sind 20 % Eigenkapital vom Kaufpreis '+F(P):'')+'</p>';
  h+='<div class="cr">'+f("name","Name","text",esc(g.name))+f("target",r.hs?"Kaufpreis":"Zielbetrag","number",g.target)+f("have","Bereits gespart","number",g.have||0)+f("rate","Sparrate pro Monat","number",g.rate||"")+'</div><label>Zieldatum (optional)</label><input type="month" value="'+(g.date||"")+'" onchange="ug('+i+',\'date\',this.value)">';
  const t=x=>'<p class="s" style="color:var(--tx);margin:10px 0 0">'+x+'</p>';
  if(r.left<=0)h+=t("Ziel erreicht: Du hast den benötigten Betrag gespart.");
  else{
   if(r.r>0)h+=t("Mit "+F(r.r)+" pro Monat erreichst du das Ziel in "+dur(r.mo)+", also im "+MN[r.done.getMonth()]+" "+r.done.getFullYear()+".");
   if(r.md>0)h+=t("Bis "+MN[+g.date.slice(5,7)-1]+" "+g.date.slice(0,4)+" musst du "+F(r.req)+" pro Monat sparen.");
   else if(g.date)h+=t("Das Zieldatum liegt in der Vergangenheit.");
   if(!(r.r>0)&&!g.date)h+=t("Trag eine Sparrate oder ein Zieldatum ein, dann rechne ich die Dauer aus.")}
  if(r.hs&&P>0){
   const ek=P*.2,cost=hcost(P,ek),have=g.have||0,hi=have/.2;
   h+=t("Eigenkapital: mindestens "+F(ek)+", davon "+F(P*.1)+" aus eigenen Mitteln (Ersparnisse, Säule 3a), nicht aus der Pensionskasse. Die Hypothek beträgt dann rund "+F(P-ek)+".");
   h+=t("Tragbarkeit: Die Bank rechnet mit etwa "+F(cost)+" pro Jahr (5 % Zins, 1 % Unterhalt, Amortisation der 2. Hypothek in 15 Jahren). Das darf höchstens ein Drittel des Bruttoeinkommens sein, du brauchst also rund "+F(cost*3)+" pro Jahr."+(G>0?" Dein Bruttolohn von "+F(G)+" "+(cost<=G/3?"reicht dafür aus":"reicht dafür nicht aus")+" (Belastung "+Math.round(cost/G*100)+" %).":""));
   if(G>0&&have>0){let lo=0,up=hi;for(let k=0;k<40;k++){const m=(lo+up)/2;if(hcost(m,have)<=G/3)lo=m;else up=m}
    h+=t("Mit deinem Eigenkapital von "+F(have)+" und deinem Lohn wäre ein Kaufpreis bis rund "+F(Math.round(lo/1000)*1000)+" möglich, begrenzt durch "+(lo>=hi-1?"das Eigenkapital":"die Tragbarkeit")+".")}
   h+=t("Kaufnebenkosten (Notar, Grundbuch, je nach Kanton) kommen noch dazu. Jede Bank rechnet im Detail anders, das ist keine Finanzierungsberatung.")}
  return h+'</div>'}).join("");
 const top=D.goals.length?'<div class="card"><h2>Deine Sparziele</h2><p class="s" style="margin:0">Frei zum Sparen: '+F(c.free)+' pro Monat. Deine Ziele brauchen zusammen '+F(tot)+' pro Monat'+(tot>Math.max(c.free,0)?', das ist mehr, als du frei sparen kannst.':'.')+'</p></div>':'';
 return top+cards+'<div class="card"><h2>Neues Sparziel</h2><p class="s">Zum Beispiel Haus, Reise, neues Auto oder eine Investition.</p><label>Name</label><input id="gn" placeholder="z. B. Eigenheim"><div class="cr"><div><label>Art</label><select id="gt">'+Object.keys(GT).map(k=>'<option value="'+k+'">'+GT[k]+'</option>').join("")+'</select></div><div><label>Zielbetrag / Kaufpreis</label><input id="ga" type="number" inputmode="decimal"></div></div><button class="btn" onclick="ag()">Sparziel hinzufügen</button></div>'}
function ag(){const n=$("gn").value.trim(),a=+$("ga").value;if(!n||!(a>0))return;D.goals.push({id:"g"+Date.now(),name:n,type:$("gt").value,target:a,have:0,rate:0,date:""});sv();R()}
function ug(i,k,v){D.goals[i][k]=v;sv();R()}
function dg(i){if(confirm("Dieses Sparziel löschen?")){D.goals.splice(i,1);sv();R()}}
function tWea(){return'<div class="chips" style="margin-bottom:14px"><button class="'+(U.ws!="ziele"?"on":"")+'" onclick="U.ws=\'prog\';R()">Prognose</button><button class="'+(U.ws=="ziele"?"on":"")+'" onclick="U.ws=\'ziele\';R()">Sparziele</button></div>'+(U.ws=="ziele"?tGoals():tProg())}


/* ===== Ist-Vergleich (nur variable Posten, manuell eingetippt) ===== */
const ML=m=>MN[+m.slice(5)-1]+" "+m.slice(0,4);
const carOn=()=>!D.car.off;
const vcats=()=>VAR.concat(carOn()?["Auto"]:[]);
const lbl=k=>k=="Auto"?"Auto (Tanken, Service)":k;
function setCar(on){
 if(on&&D.car.off){D.items=D.items.concat(D.carStash);D.carStash=[];D.car.off=0}
 else if(!on&&!D.car.off){D.carStash=D.items.filter(x=>x.cat=="Auto");D.items=D.items.filter(x=>x.cat!="Auto");D.car.off=1}
 sv();R()}
function carSw(){return'<div class="card"><div class="rw" style="border:0;padding:0"><input type="checkbox" '+(carOn()?"checked":"")+' onchange="setCar(this.checked?1:0)" id="hc"><div><label for="hc" style="margin:0;color:var(--tx);font-size:15px">Ich besitze ein Auto</label><small>Ausgeschaltet verschwinden Auto-Kosten, Tipps und der Kilometerpreis aus der Rechnung. Deine Eingaben bleiben gespeichert.</small></div></div></div>'}
function dmon(m){if(!confirm("Die Ist-Werte von "+ML(m)+" löschen?"))return;delete D.ist[m];sv();R()}
function sIst(c,v){const m=U.im;v=Math.round((parseFloat(String(v).replace(",","."))||0)*100)/100;
 if(v>0){(D.ist[m]=D.ist[m]||{})[c]=v}else if(D.ist[m]){delete D.ist[m][c];if(!Object.keys(D.ist[m]).length)delete D.ist[m]}
 sv();R()}
function vorg(cat,m){
 return D.items.filter(x=>x.cat==cat&&(!VARSUB[cat]||VARSUB[cat].includes(subOf(x)))).reduce((s,x)=>s+(x.freq=="y"?(m?(+x.mon==+m.slice(5)?x.amt:0):x.amt/12):x.amt),0)}
function cmpRows(sel,use){
 return vcats().map(k=>{
  const its=D.items.filter(x=>x.cat==k),yr=its.length>0&&its.every(x=>x.freq=="y"),vor=vorg(k,sel);
  let ist=0;
  if(sel)ist=(D.ist[sel]||{})[k]||0;
  else{const v=use.map(m=>(D.ist[m]||{})[k]||0),n=v.filter(x=>x>0).length;ist=n?v.reduce((a,b)=>a+b,0)/(yr?use.length:n):0}
  return{k,vor,ist,d:ist-vor}}).filter(r=>r.ist>0)}
function stt(r){
 if(r.vor<=1)return["ohne Vorgabe","now"];
 if(r.ist<=r.vor*1.05)return[r.ist<r.vor*.7?"deutlich darunter":"eingehalten","ok"];
 if(r.ist<=r.vor*1.25)return["leicht darüber","soon"];
 return["deutlich darüber","late"]}
function recs(use){
 const L=[];
 cmpRows(null,use).forEach(r=>{const n=lbl(r.k);
  if(r.vor>1&&r.ist>r.vor*1.15)L.push(["warn",n+": Vorgabe oft überschritten","Du gibst im Schnitt "+F(r.ist)+" statt "+F(r.vor)+" pro Monat aus. Entweder passt du die Vorgabe auf rund "+F(r.ist)+" an oder du senkst die Ausgaben um etwa "+F(r.d)+" pro Monat.",F(r.d)+" / Mt."]);
  else if(r.vor>1&&r.ist<r.vor*.8)L.push(["good",n+": Vorgabe vermutlich zu hoch","Im Schnitt gibst du nur "+F(r.ist)+" statt "+F(r.vor)+" pro Monat aus. Mit einer Vorgabe von etwa "+F(r.ist)+" bleiben rund "+F(-r.d)+" pro Monat mehr zum Sparen.",F(-r.d)+" / Mt."]);
  else if(r.vor<=1&&r.ist>20)L.push(["info",n+": keine Vorgabe","Du gibst im Schnitt "+F(r.ist)+" pro Monat aus. Lege bei den Ausgaben eine Vorgabe fest.",F(r.ist)+" / Mt."])});
 return L}
function tIst(){
 const ms=Object.keys(D.ist).filter(m=>Object.keys(D.ist[m]).length).sort().reverse();
 const nowK=T0.getFullYear()+"-"+String(T0.getMonth()+1).padStart(2,"0"),pd=new Date(T0.getFullYear(),T0.getMonth()-1,1),prevK=pd.getFullYear()+"-"+String(pd.getMonth()+1).padStart(2,"0");
 const sel=/^\d{4}-\d{2}$/.test(U.im||"")?U.im:(ms[0]||prevK);U.im=sel;
 const cur=D.ist[sel]||{};
 let h='<div class="card"><h2>Ist-Werte eintragen</h2><p class="s">Nur Posten, die jeden Monat anders ausfallen. Fixe Beträge wie Miete, Abos, Versicherungen, Krankenkasse und Vorsorge sowie dein Lohn bleiben gleich und brauchen keinen Vergleich. Tippe die Monatssummen aus deinem E-Banking oder deiner Kreditkartenabrechnung ein. Es wird nichts hochgeladen.</p>'
  +'<label for="im">Monat</label><input id="im" type="month" value="'+sel+'" max="'+nowK+'" onchange="U.im=this.value||U.im;R()">'
  +(ms.length?'<div class="chips" style="flex-wrap:wrap;margin-top:10px">'+ms.slice(0,6).map(m=>'<button class="'+(sel==m?"on":"")+'" onclick="U.im=\''+m+'\';R()">'+MN[+m.slice(5)-1].slice(0,3)+' '+m.slice(2,4)+'</button>').join("")+'</div>':'')
  +'<div style="margin-top:8px">'+vcats().map(k=>{const v=vorg(k,sel);return'<div class="rw"><div><u style="background:'+(CC[k]||"#94a3b8")+';width:10px;height:10px;border-radius:3px;display:inline-block;margin-right:8px"></u>'+esc(lbl(k))+'<small>'+(v>1?"Vorgabe "+F(v):"noch keine Vorgabe")+'</small></div><input type="number" step="0.01" inputmode="decimal" value="'+(cur[k]||"")+'" onchange="sIst(\''+k+'\',this.value)"></div>'}).join("")+'</div></div>';
 const rows=cmpRows(sel,[sel]);
 if(!rows.length)return h+'<div class="card"><p class="s" style="margin:0">Noch keine Ist-Werte für '+ML(sel)+'. Trage oben die Summen ein, dann siehst du hier den Vergleich.</p></div>';
 const sv2=f=>rows.reduce((s,r)=>s+r[f],0);
 h+='<div class="card"><h2>'+ML(sel)+(sel==nowK?" (laufender Monat, unvollständig)":"")+'</h2><p class="s">Vorgabe aus deinem Budget, Ist aus deinen Eingaben. Jährliche Posten wie Ferien zählen in der Vorgabe nur im Monat der Fälligkeit.</p>'
  +'<div class="lg"><span>Variable Ausgaben<em>Vorgabe '+F(sv2("vor"))+'</em></span><b>'+F(sv2("ist"))+'</b></div>'
  +rows.map(r=>{const s=stt(r),over=r.vor>1&&r.ist>r.vor*1.05;return'<div class="rw"><div><u style="background:'+(CC[r.k]||"#94a3b8")+';width:10px;height:10px;border-radius:3px;display:inline-block;margin-right:8px"></u>'+esc(lbl(r.k))+'<small>Vorgabe '+F(r.vor)+', Ist '+F(r.ist)+'</small></div><div class="r"><b>'+(r.d>0?"+":"")+F(r.d)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div></div><div class="pg"><i style="width:'+Math.min(100,r.vor>1?r.ist/r.vor*100:100)+'%'+(over?';background:var(--neg)':'')+'"></i></div>'}).join("")
  +'<button class="btn ghost" onclick="dmon(\''+sel+'\')">Daten von '+ML(sel)+' löschen</button></div>';
 const use=ms.filter(m=>m<nowK).length?ms.filter(m=>m<nowK):ms,rc=recs(use);
 return h+'<div class="card"><h2>Empfehlungen</h2><p class="s">Auf Basis von '+use.length+(use.length==1?" Monat":" Monaten")+'.'+(use.length<3?' Mit wenigen Monaten sind die Aussagen unsicher, besonders bei Ferien oder Möbeln.':'')+'</p>'+(rc.length?rc.map(x=>'<div class="tp '+x[0]+'"><div><b>'+x[1]+'</b><small>'+x[2]+'</small></div><span class="chip">'+x[3]+'</span></div>').join(""):'<p class="s" style="margin:0">Alles im grünen Bereich, deine Vorgaben passen zu deinen Ausgaben.</p>')+'<button class="btn ghost" onclick="tab(\'chk\')">Monatliche Erinnerung im Kalender einrichten</button></div>'}
function tExp(){return'<div class="chips" style="margin-bottom:14px"><button class="'+(U.es!="ist"?"on":"")+'" onclick="U.es=\'bud\';R()">Budget</button><button class="'+(U.es=="ist"?"on":"")+'" onclick="U.es=\'ist\';R()">Ist-Vergleich</button></div>'+(U.es=="ist"?tIst():tBud())}

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

/* ===== Grafiken: Einnahmen und Ausgaben pro Monat, Vermögensverlauf ===== */
function mser(y){
 const c=calc(),S=[];
 for(let m=0;m<12;m++){
  const k=y+"-"+String(m+1).padStart(2,"0");let e=c.taxM,ist=0;
  D.items.forEach(x=>{if(SAV.includes(x.cat))return;e+=x.freq=="y"?(+x.mon==m+1?x.amt:0):x.amt});
  vcats().forEach(v=>{const a=(D.ist[k]||{})[v];if(a>0){e+=a-vorg(v,k);ist=1}});
  S.push({m,i:c.netM,e:Math.max(e,0),ist})}
 return S}
function mchart(){
 const y=U.by,S=mser(y),H=130,g=320/12,bw=9,mx=Math.max(...S.map(p=>Math.max(p.i,p.e)),1),Y=v=>H-v/mx*H,f=n=>n.toFixed(1);
 let s='<svg viewBox="0 0 320 150" style="width:100%;display:block;margin-top:8px">';
 [0,.5,1].forEach(q=>{s+='<line x1="0" x2="320" y1="'+f(H-q*H)+'" y2="'+f(H-q*H)+'" stroke="var(--ln)" stroke-width="1"/>'});
 S.forEach(p=>{const x=p.m*g+g/2;
  s+='<rect x="'+f(x-bw-1)+'" y="'+f(Y(p.i))+'" width="'+bw+'" height="'+f(H-Y(p.i))+'" rx="2" fill="var(--pos)"/><rect x="'+f(x+1)+'" y="'+f(Y(p.e))+'" width="'+bw+'" height="'+f(H-Y(p.e))+'" rx="2" fill="var(--neg)"/>';
  if(p.ist)s+='<circle cx="'+f(x+1+bw/2)+'" cy="'+f(Y(p.e)-5)+'" r="2.5" fill="var(--gold)"/>';
  s+='<text x="'+f(x)+'" y="145" class="t1" style="font-size:8px'+(p.m==T0.getMonth()&&y==T0.getFullYear()?';font-weight:800;fill:var(--tx)':'')+'">'+MN[p.m][0]+'</text>'});
 s+='</svg>';
 const ai=S.reduce((t,p)=>t+p.i,0)/12,ae=S.reduce((t,p)=>t+p.e,0)/12;
 return'<div class="card"><div class="mn"><button onclick="U.by--;R()" aria-label="Voriges Jahr">‹</button><h2>Einnahmen und Ausgaben '+y+'</h2><button onclick="U.by++;R()" aria-label="Nächstes Jahr">›</button></div>'+s
  +'<div class="lg"><span><u style="background:var(--pos)"></u>Einnahmen<em>Ø pro Monat</em></span><b>'+F(ai)+'</b></div><div class="lg"><span><u style="background:var(--neg)"></u>Ausgaben<em>Ø pro Monat</em></span><b>'+F(ae)+'</b></div>'
  +'<p class="s" style="margin:8px 0 0">Ausgaben inklusive geschätzter Steuern, ohne Vorsorge und Anlagen. Jährliche Zahlungen erscheinen im Monat der Fälligkeit. Wo du Ist-Werte eingetragen hast, ersetzen sie die Vorgabe (gelber Punkt).</p></div>'}
const wnow=()=>D.cash+D.items.filter(x=>SAV.includes(x.cat)).reduce((s,x)=>s+(+x.bal||0),0);
function snap(){const t=new Date(),k=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0"),v=Math.round(wnow());D.hist=D.hist||{};if(D.hist[k]!==v){D.hist[k]=v;return true}return false}
function rh(){if(confirm("Den Vermögensverlauf zurücksetzen? Der Verlauf beginnt dann neu mit dem heutigen Stand.")){D.hist={};snap();sv();R()}}
function hchart(){
 const ks=Object.keys(D.hist||{}).sort();if(!ks.length)return"";
 const v=ks.map(k=>D.hist[k]),a=ks[0],b=ks[ks.length-1],d=v[v.length-1]-v[0];
 let h='<div class="card"><h2>Reales Vermögen seit Beginn</h2>';
 if(ks.length<2)return h+'<b class="big2">'+F(v[0])+'</b><p class="s">Stand '+ML(a)+'. Die App merkt sich deinen Vermögensstand (Konto plus Bestände bei Anlagen und Vorsorge) einmal pro Monat. Aktualisiere die Bestände oben regelmässig, dann entsteht hier der Verlauf.</p><button class="btn ghost" onclick="rh()">Verlauf neu beginnen</button></div>';
 const idx=k=>(+k.slice(0,4))*12+(+k.slice(5)-1),i0=idx(a),span=Math.max(idx(b)-i0,1),mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.12||1,lo=mn-pad,hi=mx+pad,W=320,H=120,f=n=>n.toFixed(1);
 const P=ks.map((k,i)=>[(idx(k)-i0)/span*W,H-(v[i]-lo)/(hi-lo)*H]),pl=P.map(p=>f(p[0])+","+f(p[1])).join(" "),L=P[P.length-1];
 h+='<svg viewBox="0 0 330 130" style="width:100%;display:block;overflow:visible"><polygon points="0,'+H+' '+pl+' '+W+','+H+'" fill="var(--pri)" opacity=".12"/><polyline points="'+pl+'" fill="none" stroke="var(--pri)" stroke-width="2.5" stroke-linejoin="round"/>'+P.map(p=>'<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="2.5" fill="var(--pri)"/>').join("")+'<circle cx="'+f(L[0])+'" cy="'+f(L[1])+'" r="5" fill="var(--gold)"/></svg><div class="ax"><span>'+ML(a)+'</span><span>'+ML(b)+'</span></div>';
 h+='<div class="lg"><span>Start ('+ML(a)+')</span><b>'+F(v[0])+'</b></div><div class="lg"><span>Heute</span><b>'+F(v[v.length-1])+'</b></div><div class="lg"><span>Veränderung</span><b class="'+(d>=0?"pos":"")+'">'+(d>=0?"+":"")+F(d)+(v[0]>0?" ("+Math.round(d/v[0]*100)+" %)":"")+'</b></div>';
 return h+'<p class="s" style="margin:8px 0 0">Die Veränderung enthält deine Einzahlungen und die Rendite. Der Verlauf ist nur so genau wie deine eingetragenen Bestände. Passe sie regelmässig an die echten Kontostände an.</p><button class="btn ghost" onclick="rh()">Verlauf neu beginnen</button></div>'}

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
function calAll(){const L=D.items.filter(x=>x.day>0),ev=[];L.forEach(x=>payEv(x).forEach(l=>ev.push(l)));
 if(!ev.length){bn("Es gibt keine Zahlungen mit Zahltag.");setTimeout(()=>bn(""),3000);return}dlIcs("finanzplaner-zahlungen.ics",ev)}
function calRem(){
 const v=+$("rd").value,rr="FREQ=MONTHLY;BYMONTHDAY="+v;
 dlIcs("finanzplaner-erinnerung.ics",icsEv("monatlich","Finanzplaner: Daten nachtragen","Ist-Werte (Lebensmittel, Restaurant, Kleider usw.) und Kontostände (Konto, Säule 3a, Anlagen) nachtragen: "+APPURL,nextOcc(v<0?31:v,"m",0),"18",rr,["PT0M"]))}
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
   if(s.exists&&s.data().ct){ready=false;$("v").innerHTML='<div class="card"><h2>Verschlüsselte Daten</h2><p class="s">Deine gespeicherten Daten stammen aus einer verschlüsselten Testversion und können in dieser Version nicht gelesen werden. Du kannst leer neu starten. Die alten Daten werden dabei gelöscht.</p><button class="btn" onclick="resetEnc()">Leer neu starten</button></div>';return}
   if(s.exists){D=Object.assign(mk(),s.data());fix();ready=true;if(snap())sv();$("cu").value=D.cur;if(!typing())R()}
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
function signUp(){$("lerr").textContent="";$("lok").textContent="";if($("pw").value.length<10){$("lerr").textContent="Bitte wähle ein Passwort mit mindestens 10 Zeichen.";return}auth.createUserWithEmailAndPassword($("em").value.trim(),$("pw").value).catch(e=>$("lerr").textContent=errText(e))}
function reset(){
 const e=$("em").value.trim();$("lerr").textContent="";$("lok").textContent="";
 if(!e){$("lerr").textContent="Bitte zuerst deine E-Mail eintragen.";return}
 auth.sendPasswordResetEmail(e).then(()=>$("lok").textContent="Wir haben dir eine E-Mail zum Zurücksetzen geschickt.").catch(x=>$("lerr").textContent=errText(x))}
function konto(){
 return'<div class="card"><h2>Konto</h2><p class="s">Angemeldet als '+esc(auth.currentUser?auth.currentUser.email:"")+'. Deine Daten werden mit allen Geräten synchronisiert. Die Beispielwerte kannst du überschreiben oder ganz entfernen.</p><button class="btn ghost" onclick="auth.signOut()">Abmelden</button><button class="btn ghost" onclick="wipe()">Alle Einträge löschen und leer starten</button></div>'}
function resetEnc(){if(!confirm("Die verschlüsselten Daten endgültig löschen und leer starten?"))return;D=mk();D.items=[];D.inc.gross=0;D.cash=0;D.paid={};fix();ready=true;ref().set(JSON.parse(JSON.stringify(D))).then(()=>{$("cu").value=D.cur;R()})}
function wipe(){
 if(!confirm("Alle Einträge löschen und leer starten? Das lässt sich nicht rückgängig machen."))return;
 D=mk();D.items=[];D.inc.gross=0;D.cash=0;D.paid={};fix();sv();R()}

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

