        let conquistas = JSON.parse(localStorage.getItem("conquistas")) || [];
        let ranking = parseInt(localStorage.getItem("ranking")) || 0;
        let xp = parseInt(localStorage.getItem("xp")) || 0;
        let nivel = parseInt(localStorage.getItem("nivel")) || 1;
        let vitoriasSeguidas = 0;
        let modoHardcore = localStorage.getItem("modoHardcore") === "true";
        let escolhasPar = parseInt(localStorage.getItem("escolhasPar")) || 0;
        let escolhasImpar = parseInt(localStorage.getItem("escolhasImpar")) || 0;
        let totalPartidas = parseInt(localStorage.getItem("totalPartidas")) || 0;
        let totalVitorias = parseInt(localStorage.getItem("totalVitorias")) || 0;
        let maiorSequencia = parseInt(localStorage.getItem("maiorSequencia")) || 0;
        let somVitoria = new Audio("sounds/win.mp3");
        let somDerrota = new Audio("sounds/lose.mp3");
        let somNivelUp = new Audio("sounds/levelup.mp3");
        let somClick = new Audio("sounds/click.mp3");
        // escolher faixa inicial conforme modoHardcore salvo
        let musicaFundo = new Audio(modoHardcore ? "sounds/musicadefundo2.mp3" : "sounds/musicadefundo1.mp3");
        musicaFundo.loop = true;
        musicaFundo.volume = 0.3;
        // estado da música (persistido)
        let musicaAtiva = localStorage.getItem("musicaAtiva") !== "false";
document.getElementById("ranking").innerText = ranking;
document.getElementById("xp").innerText = xp;
document.getElementById("nivel").innerText = nivel;

function desbloquearConquista(nome) {
    if (!conquistas.includes(nome)) {
        conquistas.push(nome);
        localStorage.setItem("conquistas", JSON.stringify(conquistas));
    alert("🏆 Conquista Desbloqueada: " + nome);
    }
}
function toggleHardcore() {
    modoHardcore = !modoHardcore;

    localStorage.setItem("modoHardcore", modoHardcore);

    // trocar faixa de fundo conforme modo
    try {
        musicaFundo.src = modoHardcore ? "sounds/musicadefundo2.mp3" : "sounds/musicadefundo1.mp3";
        // se música ativa, reiniciar e tocar nova faixa
        if (musicaAtiva) {
            musicaFundo.pause();
            musicaFundo.currentTime = 0;
            musicaFundo.play();
        }
    } catch (e) {}

    atualizarBotaoHardcore();
}
function atualizarBotaoHardcore() {
    let botao = document.getElementById("botaoHardcore");

    if (modoHardcore) {
        botao.innerText = "🔥 Hardcore: ON";
    } else {
        botao.innerText = "😌 Hardcore: OFF";
    }
}
atualizarBotaoHardcore();

function atualizarBarraXP() {
    let xpMaximo = nivel * 50;
    let porcentagem = (xp / xpMaximo) * 100;
    if (porcentagem > 100) porcentagem = 100;
    document.getElementById("barra-xp").style.width = porcentagem + "%";
}

atualizarBarraXP();
// Ajustar botão de música conforme estado salvo
try {
    document.getElementById("botaoMusica").innerText = musicaAtiva ? "🎵 Música: ON" : "🔇 Música: OFF";
} catch (e) {}
function toggleMusica() {
    musicaAtiva = !musicaAtiva;
    localStorage.setItem("musicaAtiva", musicaAtiva);

    if (musicaAtiva) {
        musicaFundo.play();
        document.getElementById("botaoMusica").innerText = "🎵 Música: ON";
    } else {
        musicaFundo.pause();
        document.getElementById("botaoMusica").innerText = "🔇 Música: OFF";
    }
}
function resetar() {
    localStorage.clear();
    location.reload();
}    
function tituloPorNivel() {
    if (nivel < 3) return "🐣 Iniciante";
    if (nivel < 5) return "⚔️ Aprendiz";
    if (nivel < 8) return "🔥 Veterano";
    return "👑 Lenda";
}
function tocarClick() {
    somClick.play();
}    
function jogar() {
    somClick.play();
    if (typeof musicaAtiva === 'undefined' || musicaAtiva) {
        if (musicaFundo.paused) musicaFundo.play();
    }

    let escolhaUsuario = document.getElementById("escolha").value;
        if (escolhaUsuario === "par") {
            escolhasPar++;
            localStorage.setItem("escolhasPar", escolhasPar);
        } else {
            escolhasImpar++;
            localStorage.setItem("escolhasImpar", escolhasImpar);
        }
    let numeroUsuario = parseInt(document.getElementById("numero").value);

    if (isNaN(numeroUsuario) || numeroUsuario < 0 || numeroUsuario > 100) {
        document.getElementById("resultado").innerText =
            "Digite número entre 0 e 100.";
        return;
    }

    if (escolhaUsuario === "par" && numeroUsuario % 2 !== 0) {
        document.getElementById("resultado").innerText =
            "Escolheu PAR, digite número PAR.";
        return;
    }

    if (escolhaUsuario === "impar" && numeroUsuario % 2 === 0) {
        document.getElementById("resultado").innerText =
            "Escolheu ÍMPAR, digite número ÍMPAR.";
        return;
    }

    let chanceDeSabotagem = nivel >= 5 ? 0.7 : 0.3;
    let numeroComputador;
    
    if (Math.random() < chanceDeSabotagem) {

    // IA analisa padrão do jogador
    let tendencia;

    if (escolhasPar > escolhasImpar) {
        tendencia = "par";
    } else if (escolhasImpar > escolhasPar) {
        tendencia = "impar";
    } else {
        tendencia = escolhaUsuario; // empate → usa escolha atual
    }

    // IA tenta inverter a tendência detectada
    if (tendencia === "par") {
        numeroComputador = (numeroUsuario % 2 === 0) ? 1 : 0;
    } else {
        numeroComputador = (numeroUsuario % 2 === 0) ? 0 : 1;
    }

} else {

    // PC joga aleatório
    numeroComputador = Math.floor(Math.random() * 101);

}
    let soma = numeroUsuario + numeroComputador;
    let resultado = (soma % 2 === 0) ? "par" : "impar";
    
    let ganhou = false;
   
    if (escolhaUsuario === resultado) {
        ganhou = true;
        vitoriasSeguidas++;
        xp += 10;
        ranking++;

        document.getElementById("resultado").innerText =
            `🔥 Você ganhou! PC: ${numeroComputador} | Soma: ${soma} (${resultado})`;
        try { somVitoria.play(); } catch (e) {}

    } else {

        vitoriasSeguidas = 0;

        xp -= modoHardcore ? 20 : 5;
        if (xp < 0) xp = 0;

        document.getElementById("resultado").innerText =
            `💀 Você perdeu! PC: ${numeroComputador} | Soma: ${soma} (${resultado})`;
        try { somDerrota.play(); } catch (e) {}
    }

    if (xp >= nivel * 50) {
        xp -= nivel * 50;  // Reseta XP, mantendo o excedente
        nivel++;
        document.getElementById("mensagemNivel").innerText =
            "🚀 SUBIU DE NÍVEL!";
        try { somNivelUp.play(); } catch (e) {}
    }
    if (vitoriasSeguidas >= 5) {
    desbloquearConquista("🥇 5 Vitórias Seguidas");
}

    if (xp >= 100) {
    desbloquearConquista("🔥 100 XP Acumulado");
}

    if (nivel >= 3 && escolhaUsuario === resultado) {
    desbloquearConquista("💀 Venceu o Boss");
}

    if (nivel >= 10 && escolhaUsuario === resultado) {
    desbloquearConquista("👑 Derrotou o Rei");
}

    if (chanceDeSabotagem > 0.5 && escolhaUsuario === resultado) {
    desbloquearConquista("🧠 Enganou a IA");
}
// musicaAtiva inicializada acima a partir do localStorage

    // Atualizar estatísticas
    totalPartidas++;
    if (ganhou) {
        totalVitorias++;
    }
    if (vitoriasSeguidas > maiorSequencia) {
        maiorSequencia = vitoriasSeguidas;
    }
    let taxaVitoria = totalPartidas > 0
        ? ((totalVitorias / totalPartidas) * 100).toFixed(1) : 0;
    
            console.log({
                nivel,
                xp,
                chanceDeSabotagem,
                numeroUsuario,
                numeroComputador,
                soma,
                resultado,                
                vitoriasSeguidas,
});
    document.getElementById("xp").innerText = xp;
    document.getElementById("nivel").innerText = nivel;
    document.getElementById("streak").innerText = vitoriasSeguidas;
    document.getElementById("ranking").innerText = ranking;
    document.getElementById("titulo").innerText = tituloPorNivel();
    document.getElementById("maiorSequencia").innerText = maiorSequencia;
    document.getElementById("totalPartidas").innerText = totalPartidas;
    document.getElementById("totalVitoria").innerText = totalVitorias;
    document.getElementById("taxaVitoria").innerText = taxaVitoria + "%";
    document.getElementById("statPar").innerText = escolhasPar;
    document.getElementById("statImpar").innerText = escolhasImpar;


    atualizarBarraXP();

    localStorage.setItem("ranking", ranking);
    localStorage.setItem("xp", xp);
    localStorage.setItem("nivel", nivel);
    localStorage.setItem("escolhasPar", escolhasPar);
    localStorage.setItem("escolhasImpar", escolhasImpar);
    localStorage.setItem("totalPartidas", totalPartidas);
    localStorage.setItem("totalVitorias", totalVitorias);
    localStorage.setItem("maiorSequencia", maiorSequencia);
}
