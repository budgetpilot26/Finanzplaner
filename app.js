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
const mk0=()=>({cur:"CHF",cash:10000,cashR:.5,yrs:10,lead:3,paid:{},extra:[],
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
function fix(){D.items.forEach((x,i)=>{if(!x.id)x.id="i"+i});D.extra=D.extra||[];D.extra.forEach((x,i)=>{if(!x.id)x.id="e"+i});D.paid=D.paid||{}}
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
 return h+'<div class="card"><h2>Ausgaben nach Kategorie</h2>'+donut(c.by,keys,tot)+keys.map(k=>'<div class="lg"><span><u style="background:'+CC[k]+'"></u>'+k+'<em>'+Math.round(c.by[k]/tot*100)+' %</em></span><b>'+F(c.by[k])+'</b></div>').join("")+'</div>'+konto()}
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
function tExp(){
 const c=calc();
 let h='<div class="card"><h2>Fixe Ausgaben, Vorsorge und Anlagen</h2><p class="s">Pro Monat: '+F(c.exp+c.sav)+', davon Vorsorge und Anlagen '+F(c.sav)+'. Tippe auf einen Namen, um Rhythmus und Zahltag zu ändern. Ohne Zahltag läuft die Zahlung automatisch (Lastschrift oder Dauerauftrag).</p>';
 Object.keys(CC).forEach(k=>{
  const L=D.items.map((x,i)=>[x,i]).filter(p=>p[0].cat==k);if(!L.length)return;
  h+='<div class="lg" style="margin-top:12px"><b><u style="background:'+CC[k]+'"></u>'+k+'</b><b>'+F(c.by[k])+'</b></div>'+L.map(p=>{const x=p[0];
   return'<div class="rw"><div class="ed" onclick="te(\''+x.id+'\')">'+esc(x.name)+'<small>'+(x.freq=="y"?"jährlich im "+MN[x.mon-1]:"monatlich")+(x.day>0?", Zahltag am "+x.day+".":", automatisch")+'</small></div><input type="number" inputmode="decimal" value="'+x.amt+'" onchange="ui('+p[1]+',+this.value)"><button class="x" onclick="di('+p[1]+')" aria-label="Löschen">✕</button></div>'+(U.ed==x.id?pn(p[1]):"")}).join("")});
 return h+'</div><div class="card"><h2>Neue Ausgabe</h2><label>Bezeichnung</label><input id="nn" placeholder="z. B. Spotify"><div class="cr"><div><label>Kategorie</label><select id="nc">'+Object.keys(CC).map(k=>'<option>'+k+'</option>').join("")+'</select></div><div><label>Betrag</label><input id="na" type="number" inputmode="decimal"></div><div><label>Rhythmus</label><select id="nf" onchange="$(\'nm\').parentNode.style.display=this.value==\'y\'?\'\':\'none\'"><option value="m">monatlich</option><option value="y">jährlich</option></select></div><div><label>Zahltag (optional)</label><input id="nd" type="number" min="1" max="31" inputmode="numeric" placeholder="automatisch"></div></div><div style="display:none"><label>Monat der Zahlung</label><select id="nm">'+MN.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("")+'</select></div><button class="btn" onclick="ai()">Hinzufügen</button></div>'}
function ai(){const n=$("nn").value.trim(),a=+$("na").value,k=$("nc").value;if(!n||!(a>0))return;D.items.push({id:"n"+Date.now(),name:n,cat:k,amt:a,freq:$("nf").value,day:+$("nd").value||0,mon:+$("nm").value,bal:0,rate:k=="Vorsorge"?2:5});sv();R()}
function ui(i,v){D.items[i].amt=v;sv();R()}
function di(i){D.items.splice(i,1);sv();R()}

function tChk(){
 const L=due(U.cy,U.cm),n=L.filter(l=>l.ok).length;
 return'<div class="card"><div class="mn"><button onclick="mv(-1)" aria-label="Voriger Monat">‹</button><h2>'+MN[U.cm]+' '+U.cy+'</h2><button onclick="mv(1)" aria-label="Nächster Monat">›</button></div>'+(L.length?'<p class="s" style="text-align:center">'+n+' von '+L.length+' erledigt</p><div class="pg"><i style="width:'+n/L.length*100+'%"></i></div>'+L.map(l=>{const s=st(l,U.cy,U.cm);return'<div class="rw'+(l.ok?" done":"")+'"><button class="o'+(l.ok?" on":"")+'" onclick="tg(\''+l.key+'\')" aria-label="Erledigt">'+(l.ok?"✓":"")+'</button><div>'+esc(l.n)+'<small>am '+l.d+'. '+MN[U.cm]+'</small></div><div class="r"><b>−'+Fd(l.v)+'</b><span class="tg '+s[1]+'">'+s[0]+'</span></div></div>'}).join(""):'<p class="s" style="text-align:center">In diesem Monat gibt es keine Zahlungen mit Zahltag.</p>')+'</div><div class="card"><h2>Erinnerung</h2><p class="s">Hier erscheinen nur Zahlungen mit Zahltag. Bei Lastschrift oder Dauerauftrag lässt du den Zahltag leer, dann musst du nichts abhaken. Ab wie vielen Tagen vor der Fälligkeit soll eine Zahlung als „bald fällig“ erscheinen?</p><select onchange="D.lead=+this.value;sv();R()">'+[1,2,3,5,7].map(d=>'<option value="'+d+'"'+(D.lead==d?" selected":"")+'>'+d+' Tage vorher</option>').join("")+'</select></div>'}
function tWea(){
 const c=calc(),inp=(oi,k,val,cl)=>'<input'+(cl?' class="sm"':'')+' type="number" step="0.1" inputmode="decimal" value="'+val+'" oninput="sw('+oi+',\''+k+'\',+this.value)">';
 const rows=D.items.map((x,i)=>[x,i]).filter(p=>SAV.includes(p[0].cat)).map(p=>{const x=p[0],m=x.freq=="y"?x.amt/12:x.amt;return'<div class="rw"><div>'+esc(x.name)+'<small>'+F(m)+' pro Monat</small></div>'+inp(p[1],"bal",x.bal||0)+inp(p[1],"rate",x.rate||0,1)+'</div>'}).join("");
 return'<div class="card"><h2>Anlagen und Vorsorge</h2><p class="s">Trag pro Anlage den heutigen Bestand und die erwartete Rendite pro Jahr ein. Die monatlichen Einzahlungen kommen aus deinen Ausgaben, beim Konto aus dem frei sparbaren Betrag.</p><div class="rw hd"><div></div><span>Bestand</span><span class="sm">Rendite %</span></div>'+rows+'<div class="rw"><div>Konto / Cash<small>'+F(c.free)+' pro Monat</small></div>'+inp(-1,"cash",D.cash)+inp(-1,"cashR",D.cashR,1)+'</div></div><div class="card"><h2>Zeitraum</h2><div class="chips" style="margin-top:8px">'+[1,5,10,20,30].map(y=>'<button class="'+(D.yrs==y?"on":"")+'" onclick="D.yrs='+y+';sv();R()">'+y+' J.</button>').join("")+'</div></div><div class="card" id="wc"></div>'}
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
 if(U.tab=="wea")wc()}
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
 const x=D.items[i];
 return'<div class="pn"><label>Bezeichnung</label><input value="'+esc(x.name)+'" onchange="ue('+i+',\'name\',this.value)"><div class="cr"><div><label>Rhythmus</label><select onchange="ue('+i+',\'freq\',this.value)"><option value="m"'+(x.freq=="m"?" selected":"")+'>monatlich</option><option value="y"'+(x.freq=="y"?" selected":"")+'>jährlich</option></select></div><div><label>Zahltag (leer = automatisch)</label><input type="number" min="1" max="31" inputmode="numeric" value="'+(x.day>0?x.day:"")+'" onchange="ue('+i+',\'day\',+this.value||0)"></div></div>'+(x.freq=="y"?'<label>Monat der Zahlung</label><select onchange="ue('+i+',\'mon\',+this.value)">'+MN.map((m,k)=>'<option value="'+(k+1)+'"'+(x.mon==k+1?" selected":"")+'>'+m+'</option>').join("")+'</select>':"")+'<button class="btn ghost" onclick="te(null)">Fertig</button></div>'}
function te(id){U.ed=U.ed==id?null:id;R()}
function ue(i,k,v){D.items[i][k]=v;sv();R()}

function tipsList(){
 const c=calc(),T=[],g=c.gross>0?c.gross/12:c.netM,pc=(v,b)=>b>0?Math.round(v/b*100):0;
 const W=c.by.Wohnen||0,wp=pc(W,g);
 if(W>0)T.push([wp>33?"warn":wp>25?"info":"good","Wohnen: "+wp+" % vom Bruttolohn",wp>33?"Die Drittelregel empfiehlt höchstens etwa "+F(g/3)+" pro Monat für Wohnkosten. Du liegst darüber, das schränkt dein Sparen ein.":wp>25?"Im oberen Bereich der üblichen Faustregel von etwa einem Drittel des Bruttolohns (bis "+F(g/3)+").":"Unter einem Viertel deines Bruttolohns, das ist komfortabel.",wp+" %"]);
 const A=c.by.Auto||0,cp=pc(A,c.netM);
 if(A>0)T.push([cp>15?"warn":cp>10?"info":"good","Auto: "+cp+" % vom Nettoeinkommen","Grobe Orientierung: Rund 10 % des Nettoeinkommens sind für ein Auto vertretbar. Du zahlst "+F(A*12)+" pro Jahr. Prüfe Versicherung, Steuern und wie oft du das Auto wirklich brauchst.",cp+" %"]);
 const Rs=c.by.Restaurant||0,Lm=c.by.Lebensmittel||0;
 if(Rs>=100&&Rs>.4*Lm)T.push(["info","Auswärts essen: "+F(Rs)+" pro Monat","Das sind "+pc(Rs,Lm)+" % deines Lebensmittelbudgets. Halbierst du es, sparst du etwa "+F(Rs/2*12)+" pro Jahr.",F(Rs)]);
 const B=c.by.Abos||0,nb=D.items.filter(x=>x.cat=="Abos").length;
 if(nb>1&&B>0)T.push(["info",nb+" Abos kosten "+F(B*12)+" pro Jahr","Prüfe, ob du alle noch nutzt. Jedes gekündigte Abo spart Geld, ohne dass du viel merkst.",F(B)+" / Mt."]);
 const K=c.by.Krankenkasse||0;
 if(K>0){const m=T0.getMonth(),dd=new Date(T0.getFullYear(),10,30)-new Date(T0.getFullYear(),m,T0.getDate()),w=m>=9&&m<=10&&dd>=0;
  T.push([w?"warn":"info","Krankenkasse: Prämien vergleichen",(w?"Für einen Wechsel der Grundversicherung per 1. Januar muss die Kündigung bis zum 30. November bei der Kasse eintreffen (noch "+Math.round(dd/864e5)+" Tage). ":"")+"Du zahlst "+F(K*12)+" pro Jahr. Ein Vergleich von Prämie, Franchise und Modell lohnt sich jedes Jahr.",F(K)+" / Mt."])}
 const p3=D.items.filter(x=>/3a/i.test(x.name)).reduce((s,x)=>s+(x.freq=="y"?x.amt:x.amt*12),0),mx=D.ab[2].on?7258:Math.min(c.net*.2,36288),left=Math.max(mx-p3,0),s3=left*D.inc.tax/100;
 if(c.net>0){
  if(p3<=0)T.push(["warn","Säule 3a: Steuern sparen",(c.gross>=80000?"Bei deinem Einkommen lohnt sich die Säule 3a besonders. ":"")+"Du zahlst nichts in die Säule 3a ein. Mit dem Maximalbetrag von "+F(mx)+" pro Jahr sparst du bei deinem Steuersatz rund "+F(s3)+" Steuern, oft mehr, weil der Grenzsteuersatz höher liegt. Das Geld muss bis zum 31. Dezember auf dem 3a-Konto sein.",F(s3)]);
  else if(left>0)T.push(["info","Säule 3a: noch "+F(left)+" möglich","Du zahlst "+F(p3)+" von höchstens "+F(mx)+" pro Jahr ein. Mit dem Rest sparst du rund "+F(s3)+" Steuern. Einzahlen bis 31. Dezember.",F(s3)]);
  else T.push(["good","Säule 3a: Maximum ausgeschöpft","Du zahlst den Höchstbetrag von "+F(mx)+" pro Jahr ein, das senkt deine Steuern."])}
 const q=c.netM>0?Math.round((c.free+c.sav)/c.netM*100):0;
 if(c.netM>0)T.push([c.free<0||q<10?"warn":q<20?"info":"good","Sparquote: "+q+" %",c.free<0?"Deine Ausgaben übersteigen das Einkommen. Prüfe zuerst die grössten Posten.":q<20?"Als Richtwert gelten rund 20 % des Einkommens fürs Sparen und Investieren. Dir fehlen etwa "+F(c.netM*.2-(c.free+c.sav))+" pro Monat bis dahin.":"Du erreichst den Richtwert von 20 %. Gut gemacht.",q+" %"]);
 if(c.exp>0&&D.cash<3*c.exp)T.push(["info","Notgroschen aufbauen","Ein Richtwert sind drei bis sechs Monatsausgaben auf dem Konto, bei dir "+F(3*c.exp)+" bis "+F(6*c.exp)+". Eingetragen sind "+F(D.cash)+" bei Konto / Cash.",F(D.cash)]);
 const o={warn:0,info:1,good:2};return T.sort((a,b)=>o[a[0]]-o[b[0]])}
const tipHtml=t=>'<div class="tp '+t[0]+'"><div><b>'+t[1]+'</b><small>'+t[2]+'</small></div>'+(t[3]?'<span class="chip">'+t[3]+'</span>':'')+'</div>';
function tTip(){const T=tipsList();return'<div class="card"><h2>Sparpotenzial und Tipps</h2><p class="s">Auswertung deiner Eingaben mit groben Richtwerten. Das ist keine Steuer- oder Anlageberatung.</p>'+(T.length?T.map(tipHtml).join(""):'<p class="s">Trag zuerst Einkommen und Ausgaben ein, dann erscheinen hier Tipps.</p>')+'</div>'}

let TH="auto";try{TH=localStorage.getItem("fp_theme")||"auto"}catch(e){}
function applyTheme(){const r=document.documentElement;if(TH=="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",TH);const b=$("th");if(b){b.textContent={auto:"◐",light:"☀",dark:"☾"}[TH];b.title="Darstellung: "+{auto:"automatisch",light:"hell",dark:"dunkel"}[TH]}}
function cycleTheme(){TH={auto:"light",light:"dark",dark:"auto"}[TH];try{localStorage.setItem("fp_theme",TH)}catch(e){}applyTheme()}
applyTheme();

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

