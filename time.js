class Time
{
    constructor(nome, escudo)
    {
        this.nome = nome
        this.escudo = escudo
        this.pontos = 0
        this.gm = 0
        this.gs = 0
        this.saldo = this.gm - this.gs
    }

    fimJogo (timeVisitante, golsMarcados, golsSofridos) {
        if (this.foiEmpate(golsMarcados, golsSofridos)) {
            this.empate(golsMarcados, golsSofridos)
            return timeVisitante.empate(golsMarcados, golsSofridos)
        }

        if (this.foiVitoria(golsMarcados, golsSofridos)) {
            this.vitoria(golsMarcados, golsSofridos)
            return timeVisitante.derrota(golsSofridos, golsMarcados)
        }
        else {
            this.derrota(golsMarcados, golsSofridos)
            return timeVisitante.vitoria(golsSofridos, golsMarcados)
        }
    }

    foiEmpate (golsMarcados, golsSofridos) {
        return golsMarcados === golsSofridos
    }

    foiVitoria (golsMarcados, golsSofridos) {
        return golsMarcados > golsSofridos
    }

    derrota (golsMarcados, golsSofridos) {
        this.atualizarInfo(0, golsMarcados, golsSofridos)
    }

    vitoria (golsMarcados, golsSofridos) {
        this.atualizarInfo(3, golsMarcados, golsSofridos)
    }

    empate (golsMarcados, golsSofridos) {
        this.atualizarInfo(1, golsMarcados, golsSofridos)
    }

    atualizarInfo(pontos, golsMarcados, golsSofridos) {
        this.pontos += pontos
        this.gm += golsMarcados
        this.gs += golsSofridos
    }
}