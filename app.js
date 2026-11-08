/* ============================================================
   FUNKTIONEN: Hier änderst du, was die App kann.
   ============================================================ */

/* ----- Deine Firebase-Daten (nicht verändern) ----- */
var firebaseConfig = {
  apiKey: "AIzaSyApm_qGr0MC00JMIEZATQLYvDyX7ZubW7Q",
  authDomain: "finanzplaner-da1de.firebaseapp.com",
  projectId: "finanzplaner-da1de",
  storageBucket: "finanzplaner-da1de.firebasestorage.app",
  messagingSenderId: "246005064676",
  appId: "1:246005064676:web:f6562a1aeaa1a581f09df1"
};

/* ----- Kategorien: hier kannst du Einträge ändern oder ergänzen ----- */
var CATS = {
  Ausgabe: ["Wohnen", "Lebensmittel", "Mobilität", "Freizeit", "Gesundheit", "Sonstiges"],
  Einnahme: ["Gehalt", "Nebenjob", "Sonstiges"]
};

/* ----- Zustand der App ----- */
var type = "Ausgabe", items = [], uid = null, unsub = null;
var today = new Date().toISOString().slice(0, 10);
var month = today.slice(0, 7);
var fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function $(id) { return document.getElementById(id); }
function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

/* ----- Firebase starten ----- */
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();
// Daten auch offline lesen und schreiben; sie werden später automatisch synchronisiert.
db.enablePersistence({ synchronizeTabs: true }).catch(function () {});

function col() { return db.collection("users").doc(uid).collection("items"); }

auth.onAuthStateChanged(function (u) {
  if (unsub) { unsub(); unsub = null; }
  if (u) {
    uid = u.uid;
    $("login").className = "hide";
    $("app").className = "";
    unsub = col().onSnapshot(function (s) {
      items = s.docs.map(function (d) { var x = d.data(); x.id = d.id; return x; });
      render();
    }, function (e) { $("aerr").textContent = "Fehler beim Laden: " + e.message; });
  } else {
    uid = null; items = [];
    $("app").className = "hide";
    $("login").className = "";
  }
});

/* ----- Anmeldung ----- */
function errText(e) {
  var m = {
    "auth/invalid-credential": "E-Mail oder Passwort falsch.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/email-already-in-use": "Diese E-Mail ist schon registriert.",
    "auth/weak-password": "Das Passwort ist zu kurz (mind. 6 Zeichen).",
    "auth/missing-password": "Bitte Passwort eingeben.",
    "auth/network-request-failed": "Keine Internetverbindung.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte später erneut probieren."
  };
  return m[e.code] || e.message;
}
function signIn() {
  $("lerr").textContent = "";
  auth.signInWithEmailAndPassword($("em").value.trim(), $("pw").value)
    .catch(function (e) { $("lerr").textContent = errText(e); });
}
function signUp() {
  $("lerr").textContent = "";
  auth.createUserWithEmailAndPassword($("em").value.trim(), $("pw").value)
    .catch(function (e) { $("lerr").textContent = errText(e); });
}

/* ----- Eingabe ----- */
function setType(t) {
  type = t;
  $("bEx").className = t === "Ausgabe" ? "on" : "";
  $("bIn").className = t === "Einnahme" ? "on" : "";
  fillCats();
}
function fillCats() {
  $("cat").innerHTML = CATS[type].map(function (c) { return "<option>" + c + "</option>"; }).join("");
}
function shift(n) {
  var p = month.split("-"), d = new Date(+p[0], +p[1] - 1 + n, 1);
  month = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  render();
}
function add() {
  $("aerr").textContent = "";
  var v = parseFloat($("amt").value.replace(",", "."));
  if (!(v > 0)) { $("amt").focus(); return; }
  var d = $("dat").value || today;
  col().add({ type: type, amount: v, cat: $("cat").value, date: d, note: $("note").value.trim(), ts: Date.now() })
    .catch(function (e) { $("aerr").textContent = "Speichern fehlgeschlagen: " + e.message; });
  $("amt").value = ""; $("note").value = "";
  month = d.slice(0, 7);
  render();
}
function del(id) {
  col().doc(id).delete()
    .catch(function (e) { $("aerr").textContent = "Löschen fehlgeschlagen: " + e.message; });
}

/* ----- Anzeige ----- */
function render() {
  var p = month.split("-");
  $("mlabel").textContent = new Date(+p[0], +p[1] - 1, 1).toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  var m = items
    .filter(function (i) { return i.date.slice(0, 7) === month; })
    .sort(function (a, b) { return b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0); });

  var inc = 0, exp = 0, by = {};
  m.forEach(function (i) {
    if (i.type === "Einnahme") inc += i.amount;
    else { exp += i.amount; by[i.cat] = (by[i.cat] || 0) + i.amount; }
  });

  $("sin").textContent = fmt.format(inc);
  $("sex").textContent = fmt.format(exp);
  var b = inc - exp;
  $("sbal").textContent = fmt.format(b);
  $("sbal").className = b >= 0 ? "in" : "ex";

  var keys = Object.keys(by).sort(function (a, c) { return by[c] - by[a]; });
  $("cats").innerHTML = keys.length
    ? keys.map(function (k) {
        return '<div class="cat"><span>' + esc(k) + '</span><span>' + fmt.format(by[k]) + '</span></div>' +
               '<div class="bar"><i style="width:' + Math.round(by[k] / exp * 100) + '%"></i></div>';
      }).join("")
    : '<div class="empty">Noch keine Ausgaben in diesem Monat.</div>';

  $("list").innerHTML = m.length
    ? m.map(function (i) {
        var s = i.type === "Einnahme";
        return '<div class="row"><div>' + esc(i.cat) + '<small>' +
          new Date(i.date).toLocaleDateString("de-DE") + (i.note ? " · " + esc(i.note) : "") +
          '</small></div><div><b class="' + (s ? "in" : "ex") + '">' + (s ? "+" : "−") + fmt.format(i.amount) +
          '</b> <button onclick="del(\'' + i.id + '\')" aria-label="Löschen">✕</button></div></div>';
      }).join("")
    : '<div class="empty">Noch keine Buchungen in diesem Monat.</div>';
}

/* ----- Start ----- */
fillCats();
$("dat").value = today;

// App installierbar machen (Service Worker)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
