let interval
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// Função para redimensionar o canvas conforme a tela
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

// Recarregar o canvas ao carregar a página e redimensionar a tela
window.onload = () => {
    resizeCanvas()
    start()
}

window.onresize = resizeCanvas

// Classe GameObject
function GameObject(x, y, img, width, height) {
    this.x = x
    this.y = y
    this.img = img
    this.active = true
    this.width = width
    this.height = height
}

GameObject.prototype.draw = function(ctx) {
    if (this.active) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

GameObject.prototype.move = function(dx, dy) {
    this.x += dx
    this.y += dy
}

GameObject.prototype.fire = function(dy) {
    return new Shot(this.x + this.width / 2, this.y + this.height / 2, dy)
}

GameObject.prototype.isHitBy = function(shot) {
    const between = (x, a, b) => a < x && x < b
    return (
        this.active &&
        between(shot.x, this.x, this.x + this.width) &&
        between(shot.y + 10, this.y, this.y + this.height)
    )
}

// Classe Shot
function Shot(x, y, dy) {
    this.x = x
    this.y = y
    this.dy = dy
}

Shot.prototype.move = function() {
    this.y += this.dy
    return this.y > 0 && this.y < canvas.height
}

Shot.prototype.draw = function(ctx) {
    const shotWidth = canvas.width * 0.006 // 0.6% da largura do canvas
    const shotHeight = canvas.height * 0.03 // 3% da altura do canvas
    ctx.fillStyle = '#fff'
    ctx.fillRect(this.x - shotWidth / 2, this.y, shotWidth, shotHeight)
}

// Variáveis globais
let invaderDx = -5
let invaders = []
let cannonShot, invaderShot
let cannonWidth, cannonHeight, invaderWidth, invaderHeight

// Inicializar o jogo
function init() {
    const img = document.getElementById("invader")

    // Usar porcentagem para o tamanho do canhão para que acompanhe o canvas
    cannonWidth = 20
    cannonHeight = 20
    invaderWidth = 20
    invaderHeight = 20

    // Posição inicial do canhão
    const cannon = new GameObject(
        canvas.width / 2 - cannonWidth / 2,
        canvas.height - cannonHeight - 20,
        document.getElementById("cannon"),
        cannonWidth,
        cannonHeight
    )

    // Criar invasores como meteoros, surgindo em posições horizontais aleatórias
    invaders = []
    for (let i = 0; i < 8; i++) {
        let randomX = Math.random() * (canvas.width - invaderWidth)  // Posição X aleatória
        invaders.push(
            new GameObject(
                randomX,   // Posição horizontal aleatória
                -invaderHeight,  // Começam fora da tela, no topo
                img,
                invaderWidth,
                invaderHeight
            )
        )
    }

    return cannon
}

// Desenhar na tela
function draw(cannon) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    invaders.forEach(inv => inv.draw(ctx))
    cannon.draw(ctx)
    invaderShot && invaderShot.draw(ctx)
    cannonShot && cannonShot.draw(ctx)
}

// Mover os objetos
function move(cannon) {
    invaders.forEach(inv => {
        inv.move(0, 1)  // Move os invasores para baixo verticalmente
        if (inv.y > canvas.height) {
            // Se o invasor sair da tela, reposicioná-lo no topo com uma nova posição aleatória
            inv.x = Math.random() * (canvas.width - invaderWidth)
            inv.y = -invaderHeight
        }
    })

    if (invaderShot && !invaderShot.move()) {
        invaderShot = null
    }

    if (!invaderShot) {
        let active = invaders.filter(i => i.active)
        let r = active[Math.floor(Math.random() * active.length)]
        invaderShot = r.fire(20)
    }

    if (cannonShot) {
        let hit = invaders.find(inv => inv.isHitBy(cannonShot))
        if (hit) {
            hit.active = false
            cannonShot = null
        } else {
            if (!cannonShot.move()) cannonShot = null
        }
    }
}

// Verificar se o jogo acabou
function isGameOver(cannon) {
    const lost = cannon.isHitBy(invaderShot) || 
                 invaders.some(inv => inv.active && inv.y > canvas.height - cannonHeight - 20)
    const won = invaders.every(inv => !inv.active)
    return { lost, won }
}

// Reiniciar o jogo
function restartGame() {
    clearInterval(interval)  // Parar o jogo atual
    invaders = []  // Limpar lista de invasores
    start()  // Reiniciar o jogo
}

// Função principal do jogo
function game(cannon) {
    move(cannon)
    draw(cannon)
    
    const { lost, won } = isGameOver(cannon)
    if (lost || won) {
        clearInterval(interval)
        restartGame()
    }
}

// Iniciar o jogo
function start() {
    let cannon = init()

    // Controlar o canhão com o mouse
    document.addEventListener("mousemove", function(e) {
        const mouseX = e.clientX
        const moveAmount = mouseX - cannonWidth / 2
        if (moveAmount >= 0 && moveAmount + cannonWidth <= canvas.width) {
            cannon.x = moveAmount
        }
    })

    // Atirar com clique
    document.addEventListener("click", function() {
        if (!cannonShot) {
            cannonShot = cannon.fire(-30)
        }
    })

    interval = setInterval(() => game(cannon), 50)
}
