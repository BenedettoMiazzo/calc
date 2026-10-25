const n1Elem = document.getElementById("n1");
const n2Elem = document.getElementById("n2");
const calcolBtn = document.getElementById("calcolaBtn");
const sumBtn = document.getElementById("Btn+");
const difBtn = document.getElementById("Btn-");
const divBtn = document.getElementById("Btn/");
const elevationBtn = document.getElementById("Btn**");
const maxBtn = document.getElementById("BtnMax");
const minBtn = document.getElementById("BtnMin");
const avgBtn = document.getElementById("BtnAvg");
//ES9
const aiutoElem = document.getElementById("aiuto")
//ES13
const calcLentoBtn = document.getElementById("calcolaLento")
//ES14
const avviaBtn = document.getElementById("avvia")
const fermaBtn = document.getElementById("ferma")
const aggiungi1Btn = document.getElementById("aggiungi1")



const op = document.getElementById("operation");
const resElem = document.getElementById("result");
const messageElem = document.getElementById("messaggio");
const maxNumberAccepted = 1000000;


let interval;
let timeOut;
let result;
let calcInCorso = false;
let x = null;

//ES9
const aiuti = {
    n1: "Inserisci il primo numero",
    n2: "Inserisci il secondo numero",
    calcolaBtn: "Calcola (indovina un po'...)"
}

const descrizioni = {
    "Btn+": "somma",
    "Btn-": "differenza",

}

//ES11
const azioni = {
    result: () => {
        if(resElem.textContent){
            n1Elem.value = result;
            n2Elem.value = ""
        }
    }
}

//ES 4
const regole = [
    (t1, t2)=> {
        if(t1===""||t2===""){
            throw new Error("Inserisci entrambi i numeri");
        }
    },
    (t1, t2) => {
        if(Math.abs(t1)>maxNumberAccepted||Math.abs(t2)>maxNumberAccepted){
            throw new Error("Numero/i troppo grande/i");
        }
    },
    (t1, t2)=> {
        if(t1<-10000000||t2<-10000000){
            throw new Error("Numeri troppo piccoli");
        }
    }
];

//ES8
const mappingTasti = {
    Enter: () => aggiorna()(),
    Escape: () => {
        resElem.textContent = "";
        messageElem.textContent = "";
        n1Elem.value = "";
        n2Elem.value = "";
    },
    ArrowUp: () => {
        n1Elem.value++;
        n2Elem.value++;
        aggiorna()();
    }

}



//JS OBJ = hashmap -> K,V
//ES1 & 2
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => {
        if (b === 0) throw new Error("Denominator is zero.")
        return a / b
    },
    '**': (a, b) => a ** b,
    'max': (a, b) => a > b ? a : b,
    'min': (a, b) => a > b ? b : a,
    'avg': (a, b) => (a+b)/2,
}

//ES 3
function scegliOperazione(simbolo){
    let myFunction = operations[simbolo];
    if(typeof myFunction!=='function'){
        throw new Error("Operazione non supportata"+ simbolo);
    }else{
        return myFunction;
    }
}



//ES5 + 6
function perOperazione(simbolo){
    let getOperation, getSimbolo;
    if(simbolo){
        const opFissa = scegliOperazione(simbolo);
        getSimbolo = () => simbolo;
        getOperation = () => opFissa;
    }else{
        getSimbolo = () => op.value;
        getOperation = () => scegliOperazione(op.value);
    }
    return function () {
        let a = n1Elem.value;
        let b = n2Elem.value;
        resElem.textContent = "";
        messageElem.textContent = "";

        try {
            valida(regole, a, b);
            //prendere primo numero
            a = Number(a);
            b = Number(b);
            const simboloCorrente = getSimbolo();
            const operazioneCorrente = getOperation();
            const res = compute(operazioneCorrente, a, b);
            result=res;
            resElem.textContent = formatta(a, simboloCorrente, b, res);
        } catch (err) {
            messageElem.textContent = err.message
        }
    }
}

//ES 4
function valida(reg, t1, t2){
    for(let x=0;x<reg.length;x++){
        reg[x](t1,t2);
    }
}

function compute(f, a, b) {
    return f(a, b)
}

//ES 6
function formatta(a, simbolo, b, res){
    return "" + a + " " + simbolo + " " + b + " = " + res;
}

//ES7
function aggiorna() {
    return perOperazione("");
}

//ES8
function gestoreTasti(mappa) {
    return (e) => {
        let myFunction = mappa[e.key];
        if(typeof myFunction!=='function'){
        console.log("tasto non supportato");
        }else{
            myFunction();
        }
    }
}

//ES9+10
function chiaveDi(e) {
    return e.target.id;
}

function chiaveDi2(e) {
    e.preventDefault();
    return e.target.id;
}

//ES9
function mostra(x) {
    aiutoElem.textContent = x;
}



//ES9
function gestoreTesto(mappa, chiaveDi, mostra){
    return (e) => {
        let y = mappa[chiaveDi(e)];
        if(y){
            mostra(y);
        }else{
            mostra("");
        }
    }
}

//11
function gestoreEventi(mappa, chiaveDi){
    return (e) => {
        let y = mappa[chiaveDi(e)];
        if(y){
            y();
        }
    }    
}

//ES12
function creaMsg(elem, ms) {
    return (msg) => {
        clearTimeout(timeOut);
        elem.textContent = msg;
        timeOut = setTimeout((() => {elem.textContent=""}),ms)
    }
}

//ES 13 viene riportato il valore contenuto nella label n2 quando scade il timer
function creaRitardatore(ms) {
    return function (f) {
        if (calcInCorso) {
            return;
        }

        calcInCorso = true;

        setTimeout(() => {
            try {
                f();
            } finally {
                calcInCorso = false;
            }
        }, ms);
    };
}

//ES13
const calcolaLento = creaRitardatore(2000);

function creaRipetitore(f, ms) {
    let intervalId = null;
    return {
        avvia() {
            if (intervalId === null) {
                intervalId = setInterval(() => {
                    try{
                        f();
                    }catch (err){
                        ripetitore.ferma();
                    }
                }, ms);
            }
        },
        ferma() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    };
}

//ES15
function quandoSmetti(f, ms){
    return () => {
        if(x !== null){
            clearTimeout(x);
        } 
        x=setTimeout(f, ms)
    }
}

const ripetitore = creaRipetitore(() => {
    aggiorna()();
    n1Elem.value = result;

}, 1000)

const ripetitore2 = creaRipetitore(() => {
    n1Elem.value ++;
}, 100)

const ritardatore = quandoSmetti(aggiorna(),500)

//ES14
avviaBtn.addEventListener("click", ripetitore.avvia);
fermaBtn.addEventListener("click", ripetitore.ferma);
aggiungi1Btn.addEventListener("mousedown", ripetitore2.avvia);
aggiungi1Btn.addEventListener("mouseup", ripetitore2.ferma);
aggiungi1Btn.addEventListener("mouseleave", ripetitore2.ferma);

//ES13
calcLentoBtn.addEventListener("click", () => {
    calcolaLento(aggiorna());
});

//ES11
document.addEventListener("dblclick", gestoreEventi(azioni,chiaveDi));
//ES9
document.addEventListener("focusin", gestoreTesto(aiuti,chiaveDi,mostra))
//ES10
document.addEventListener("contextmenu", (e) => {
        let y = descrizioni[chiaveDi(e)];
        if(y){
            creaMsg(aiutoElem,5000)(y);
        }else{
            mostra("");
        }
    })

//ES8
document.addEventListener("keydown", gestoreTasti(mappingTasti));

//Come controllo il btn? AEL
calcolBtn.addEventListener("click", aggiorna())

//ES7
n1Elem.addEventListener("input", ritardatore);
n2Elem.addEventListener("input", ritardatore);
op.addEventListener("change", aggiorna());


//ES 5
sumBtn.addEventListener("click",perOperazione('+'));
difBtn.addEventListener("click",perOperazione('-'));
divBtn.addEventListener("click",perOperazione('/'));
elevationBtn.addEventListener("click",perOperazione('**'));
maxBtn.addEventListener("click",perOperazione('max'));
minBtn.addEventListener("click",perOperazione('min'));
avgBtn.addEventListener("click",perOperazione('avg'));

//Eseguo quando HTML è renderizzato
document.addEventListener("DOMContentLoaded", () => {
    //setTimeout setInterval
    let i = 0

    setTimeout(() => console.log("qui"), 2000)
    //interval = setInterval(() => console.log("repetion"), 500)
})

n1Elem.addEventListener("input", (e) => {
    let v = e.target.value
    if (v.length >= 10) {
        //n1Elem.disabled = true
        //n1Elem.readOnly = true
        n1Elem.value = v.slice(0, 10)
    }
})