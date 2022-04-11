const tela = document.querySelector('canvas');
const pincel = tela.getContext('2d');

// coordenadas da tela
const eixoZero = 0;
const maxWidth = 700;
const maxHeight = 400;
const meioTela = 350;

// key codes 
const setaCima = 38;
const teclaW = 87;
const setaBaixo = 40;
const teclaS = 83;

// raquetes
let raqueteEspessura = 10;
let raqueteComprimento = 40;

const xRaquete1 = 10;
var yRaquete1 = 180;
var velocidadeRaquete1 = 10;  

const xRaquete2 = 680;
var yRaquete2 = 180;
var velocidadeRaquete2 = 10;

// bola
let bolaDiametro = 10;
let bolaRaio = bolaDiametro / 2;
let xBola = 350;
let yBola = 195;

let xMovimentoBola = 5; 
let yMovimentoBola = 5;

// pontuaçao
let score1 = 0;
let score2 = 0;

// sons
const hit = new Audio('sounds/hitExplosion.mp3');
const raquetada1 = new Audio('sounds/raquetada1.mp3');
const raquetada2 = new Audio('sounds/raquetada2.mp3');
const colisao = new Audio('sounds/colisaoBorda.mp3');
const backgroundMusic = new Audio('sounds/bensound-psychedelic.mp3')

function desenhaBorda(yLocation, yEspessura) {
    pincel.fillStyle = 'white';
    pincel.fillRect(eixoZero, yLocation, maxWidth, yEspessura); 
}

function desenhaRede(yLocation, xEspessura) {
    pincel.fillStyle = 'white';
    pincel.fillRect(meioTela, yLocation, xEspessura, maxHeight - yLocation - 10);
}

function desenhaMesa() {
    pincel.fillStyle = 'black';
    pincel.fillRect(eixoZero, eixoZero, maxWidth, maxHeight);
    desenhaBorda(10, 10);
    desenhaRede(10, 8);
    desenhaBorda(380, 10);
}

function desenhaRaquete(x, y) {
    pincel.fillStyle = 'white';
    pincel.fillRect(x, y, raqueteEspessura, raqueteComprimento);
    pincel.fill();
}

function desenhaBola(x, y) {
    pincel.fillStyle = 'white';
    pincel.fillRect(x, y, bolaDiametro, bolaDiametro);
    pincel.fill();
}

function movimentaBola(x, y) {
    xBola = x;
    yBola = y;
    xBola += xMovimentoBola;
    yBola += yMovimentoBola;
}

function colisaoBorda(xBola, yBola) {
    if (xBola > maxWidth - 10 || xBola < 0 + 1) {
        xMovimentoBola *= -1;
    } else if (yBola > maxHeight - 27 || yBola < 17) {
        yMovimentoBola *= -1;
    }
}

function colisaoBolaRaquete(x, y, raquete2=false) {
    if (raquete2 == false) {
        if (xBola < x + bolaDiametro && 
        yBola < y + raqueteComprimento && 
        yBola > y - bolaDiametro) {
            xMovimentoBola *= -1;
            raquetada1.play();
        }
    } if (raquete2 == true) {
        if (xBola > x - bolaDiametro &&
            yBola > y - bolaDiametro &&
            yBola < y + raqueteComprimento) {
            xMovimentoBola *= -1;
            raquetada2.play();
        }
    }
}

function moveRaquetes(evento) {
    if (evento.keyCode == teclaW) {
        if (yRaquete1 > 10) {
            yRaquete1 -= velocidadeRaquete1;
        }
    } else if (evento.keyCode == teclaS) {
        if (yRaquete1 < 350) {
            yRaquete1 += velocidadeRaquete1;
        }
    } if (evento.keyCode == setaCima){
        if (yRaquete2 > 10) {
            yRaquete2 -= velocidadeRaquete2;
        }
    } else if (evento.keyCode == setaBaixo){
        if (yRaquete2 < 350) {
            yRaquete2 += velocidadeRaquete2;
        }
    }
}

/*function moveRaquete2() {
    if (yRaquete2 > 10) {
        yRaquete2 = yBola;
    } 
    if (yRaquete2 < 350) {
        yRaquete2 = yBola - 15;
    }
}*/

function limpaTela() {
    pincel.clearRect(0, 0, 700, 400);
}  

function calculaScore() {
    if (xBola < 1) {
        score2 += 1;
        hit.play();
        restauraPartida();
        xMovimentoBola *= -1;
    } 
    if (xBola > 690) {
        score1 += 1;
        hit.play();
        restauraPartida();
        xMovimentoBola *= -1;
    }
}

function restauraPartida() {
    xBola = 350;
    yBola = 195;
}

function exibeScore(x, y, score) {
    pincel.font='50px Georgia';
    pincel.fillStyle='white';
    pincel.fillText(score, x, y);    
}

function atualizaJogo() {
    backgroundMusic.play();
    backgroundMusic.loop = true;
    limpaTela();
    desenhaRaquete(xRaquete1, yRaquete1);
    desenhaRaquete(xRaquete2, yRaquete2);
    desenhaBola(xBola, yBola);
    movimentaBola(xBola, yBola);
    colisaoBorda(xBola, yBola);
    colisaoBolaRaquete(xRaquete1, yRaquete1, false);
    colisaoBolaRaquete(xRaquete2, yRaquete2, true);
    calculaScore();
    exibeScore(285, 70, score1);
    exibeScore(390, 70, score2);
}

document.onkeydown = moveRaquetes;
setInterval(atualizaJogo, 20);
