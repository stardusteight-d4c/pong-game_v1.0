const tela = document.querySelector('canvas')
const ctx = tela.getContext('2d')

// coordenadas da tela
const eixoZero = 0
const maxWidth = 700
const maxHeight = 400
const meioTela = 350

// key codes
const setaCima = 38
const teclaW = 87
const setaBaixo = 40
const teclaS = 83

// raquetes
let raqueteEspessura = 5
let raqueteComprimento = 50

const xRaquete1 = 8
var yRaquete1 = 180
var velocidadeRaquete1 = 10

const xRaquete2 = 688
var yRaquete2 = 180
var velocidadeRaquete2 = 10

// bola
let bolaDiametro = 6
let bolaRaio = bolaDiametro / 2
let xBola = 350
let yBola = 195

let xMovimentoBola = 5
let yMovimentoBola = 5

// pontuaçao
let score1 = 0
let score2 = 0

// sons
const hit = new Audio('sounds/hitExplosion.mp3')
const raquetada1 = new Audio('sounds/raquetada1.mp3')
const raquetada2 = new Audio('sounds/raquetada2.mp3')
const colisao = new Audio('sounds/colisaoBorda.mp3')
const backgroundMusic = new Audio('sounds/bensound-psychedelic.mp3')

var grd = ctx.createLinearGradient(350, 0, 180, 0)
grd.addColorStop(0, '#2B32B2')
grd.addColorStop(1, '#3F00E1')

function desenhaBorda(yLocation, yEspessura) {
  ctx.fillStyle = grd
  ctx.fillRect(eixoZero, yLocation, maxWidth, yEspessura)
}

function desenhaRede(yLocation, xEspessura) {
  ctx.fillStyle = grd
  ctx.fillRect(meioTela, yLocation, xEspessura, maxHeight - yLocation - 10)
}

function desenhaMesa() {
  ctx.fillStyle = 'transparent'
  ctx.fillRect(eixoZero, eixoZero, maxWidth, maxHeight)
  desenhaBorda(0, 20)
  desenhaRede(10, 10)
  desenhaBorda(380, 20)
}

function desenhaRaquete(x, y) {
  ctx.fillStyle = 'white'
  ctx.fillRect(x, y, raqueteEspessura, raqueteComprimento)
  ctx.fill()
}

function desenhaBola(x, y) {
  ctx.beginPath()
  ctx.arc(x, y, bolaDiametro, 0, 2 * Math.PI)
}

function movimentaBola(x, y) {
  xBola = x
  yBola = y
  xBola += xMovimentoBola
  yBola += yMovimentoBola
}

function colisaoBorda(xBola, yBola) {
  if (xBola > maxWidth - 8 || xBola < 2) {
    xMovimentoBola *= -1
  } else if (yBola > maxHeight - 27 || yBola < 27) {
    yMovimentoBola *= -1
  }
}

function colisaoBolaRaquete(x, y, raquete2 = false) {
  if (raquete2 == false) {
    if (
      xBola < x + 10 &&
      yBola < y + raqueteComprimento &&
      yBola > y - bolaDiametro
    ) {
      xMovimentoBola *= -1
      raquetada1.play()
    }
  }
  if (raquete2 == true) {
    if (
      xBola > x - bolaDiametro &&
      yBola > y - bolaDiametro &&
      yBola < y + raqueteComprimento
    ) {
      xMovimentoBola *= -1
      raquetada2.play()
    }
  }
}

function moveRaquetes(evento) {
  if (evento.keyCode == teclaW) {
    if (yRaquete1 > 5) {
      yRaquete1 -= velocidadeRaquete1
    }
  } else if (evento.keyCode == teclaS) {
    if (yRaquete1 < 350) {
      yRaquete1 += velocidadeRaquete1
    }
  }
  if (evento.keyCode == setaCima) {
    if (yRaquete2 > 5) {
      yRaquete2 -= velocidadeRaquete2
    }
  } else if (evento.keyCode == setaBaixo) {
    if (yRaquete2 < 350) {
      yRaquete2 += velocidadeRaquete2
    }
  }
}

function limpaTela() {
  ctx.clearRect(0, 0, 700, 400)
}

function calculaScore() {
  if (xBola < 1) {
    score2 += 1
    hit.play()
    restauraPartida()
    xMovimentoBola *= -1
  }
  if (xBola > 690) {
    score1 += 1
    hit.play()
    restauraPartida()
    xMovimentoBola *= -1
  }
}

function restauraPartida() {
  xBola = 350
  yBola = 195
}

function exibeScore(x, y, score) {
  ctx.font = 'lighter 50px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText(score, x, y)
}

function atualizaJogo() {
  limpaTela()
  desenhaMesa()
  desenhaRaquete(xRaquete1, yRaquete1)
  desenhaRaquete(xRaquete2, yRaquete2)
  desenhaBola(xBola, yBola)
  movimentaBola(xBola, yBola)
  colisaoBorda(xBola, yBola)
  colisaoBolaRaquete(xRaquete1, yRaquete1, false)
  colisaoBolaRaquete(xRaquete2, yRaquete2, true)
  calculaScore()
  exibeScore(285, 70, score1)
  exibeScore(390, 70, score2)
}

document.onkeydown = moveRaquetes
setInterval(atualizaJogo, 15)
