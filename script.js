Vue.filter('ucwords', function (valor) {
    return valor.charAt(0).toUpperCase() + valor.slice(1)
})


Vue.component('my-app', {
    template: `
    <div class="container">
        <titulo></titulo>
        <div class="row">
            <div class="col-md-12">
                <novo-jogo @novo-jogo="showPlacar($event)" :times="times"></novo-jogo>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12" v-show="visao!='tabela'">
                <placar :time-casa="timeCasa" :time-fora="timeFora"
                    @fim-jogo="showTabela($event)">
                </placar>
            </div>
            <div class="col-md-12" v-show="visao === 'tabela'">
                <tabela-classificacao :times="times"></tabela-classificacao>               
            </div>
        </div>
    </div>
    `,
    data () {
        return {
        
            times: [
                new Time('América-MG', 'assets/america_mg_60x60.png'),
                new Time('Atlético-MG', 'assets/atletico_mg_60x60.png'),
                new Time('Atlético-PR', 'assets/atletico_pr_60x60.png'),
                new Time('Bahia', 'assets/bahia_60x60.png'),
                new Time('Botafogo', 'assets/botafogo_60x60.png'),
                new Time('Ceará', 'assets/ceara_60x60.png'),
                new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
                new Time('Corinthians', 'assets/corinthians_60x60.png'),
                new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
                new Time('flamengo', 'assets/flamengo_60x60.png'),
                new Time('Fluminense', 'assets/fluminense_60x60.png'),
                new Time('Grêmio', 'assets/gremio_60x60.png'),
                new Time('Internacional', 'assets/internacional_60x60.png'),
                new Time('Palmeiras', 'assets/palmeiras_60x60.png'),
                new Time('Parana', 'assets/parana_60x60.png'),
                new Time('Santos', 'assets/santos_60x60.png'),
                new Time('São Paulo', 'assets/sao_paulo_60x60.png'),
                new Time('Sport', 'assets/sport_60x60.png'),
                new Time('Vasco', 'assets/vasco_60x60.png'),
                new Time('Vitória', 'assets/vitoria_60x60.png'),
            ],
            timeCasa: null,
            timeFora: null,
            visao: 'tabela'
        }
    },
    methods: {
        showTabela (event) {
            this.visao = 'tabela'
        },
        showPlacar ({timeCasa, timeFora}) {
            this.timeCasa = timeCasa
            this.timeFora = timeFora
            this.visao = 'placar'
        }
    }
})

Vue.component('clube', {
    props: ['time', 'invertido'],
    template: `
    <div style="display: flex; flex-direction: row">
        <img :src="time.escudo" class="escudo" alt="time.nome" :style="{order: invertido == 'true' ? 2 : 1}">
        <span :style="{order: invertido == 'true' ? 1 : 2}">{{time.nome | ucwords}}</span>
    </div>
    `
})

Vue.component('clubes-libertadores', {
    props: ['times'],
    template: `
    <div>
        <h3>Classificados para a Libertadores</h3>
        <ul>
            <li v-for="time in timesLibertadores">
                <clube :time="time"></clube>
            </li>
        </ul>
    </div>
    `,
    computed: {
        timesLibertadores () {
            return this.times.slice(0, 6)
        }
    }
})

Vue.component('clubes-rebaixados', {
    props: ['times'],
    template: `
    <div>
        <h3>Zona de rebaixamento:</h3>
        <ul>
            <li v-for="time in timesRebaixamento">
                <clube :time="time"></clube>
            </li>
        </ul>
    </div>
    `,
    computed: {
        timesRebaixamento () {
            return this.times.slice(16, 20)
        }
    }
})

Vue.component('tabela-classificacao', {
    props: ['times'],
    data () {
        return {
            busca: '',
            ordem: {
                colunas: ['pontos', 'gm', 'gs', 'saldo'],
                ordenacao: ['desc', 'desc', 'asc', 'desc']
            }
        }
    },
    template: `
    <div>
        <input type="text" class="form-control" v-model="busca">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th v-for="(coluna, indice) in ordem.colunas">
                        <a href="#" @click.prevent="ordenar(indice)">
                            {{coluna | ucwords}}
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(time, indice) in timesFiltrados" 
                    :class="{'table-success': indice < 6}" 
                    :style="{'font-size' : indice < 6 ? '14px' : '12px',
                        'font-weight' : indice < 6 ? 'bold' : 'normal'}">
                    <td>
                        <clube :time="time"></clube>
                    </td>
                    <td>{{time.pontos}}</td>
                    <td>{{time.gm}}</td>
                    <td>{{time.gs}}</td>
                    <td>{{time.saldo}}</td>
                </tr>
            </tbody>
        </table>
        <clubes-libertadores :times="timeOrdenado"></clubes-libertadores>
        <clubes-rebaixados :times="timeOrdenado"></clubes-rebaixados>
    </div>
    `,
    computed: {
        timesFiltrados () {
            let self = this
            return _.filter(this.timeOrdenado, function(time) {
                var busca = self.busca.toLowerCase()
                return time.nome.toLowerCase().indexOf(busca) >= 0 
            })
        },
        timeOrdenado () {
            return _.orderBy(this.times, this.ordem.colunas, this.ordem.ordenacao)
        }
    },
    methods: {
        ordenar (indice) {
            this.$set(this.ordem.ordenacao, indice, this.ordem.ordenacao[indice] == 'desc' ? 'asc' : 'desc')
        }
    }
})

Vue.component('novo-jogo', {
    props: ['times', ],
    template: `
    <div>
        <button class="btn btn-primary" @click="criarNovoJogo">
            Novo Jogo!
        </button>
    </div>
    `,
    methods: {
        criarNovoJogo () {
            let indiceCasa = Math.floor(Math.random() * 20)
            let indiceFora = Math.floor(Math.random() * 20)
            let timeCasa = this.times[indiceCasa]
            let timeFora = this.times[indiceFora]
            this.$emit('novo-jogo', {timeCasa, timeFora})
        }
    }
})

Vue.component('placar', {
    props: ['timeCasa', 'timeFora'],
    data () {
        return {
            golsCasa: 0,
            golsFora: 0
        }
    },
    template: `
    <form class="form-inline">
        <clube :time="timeCasa" invertido="true" v-if="timeCasa"></clube>
        <input type="text" class="form-control placarNumero" v-model="golsCasa">
        <span class="col-md-1 text-center">X</span>
        <input type="text" class="form-control placarNumero" v-model="golsFora">
        <clube :time="timeFora" v-if="timeFora"></clube>
        <button type="button" class="btn btn-primary" @click="fimJogo">Fim de Jogo</button>
    </form>
    `,
    methods: {
        fimJogo () {
            const golsMarcados = parseInt(this.golsCasa)
            const golsSofridos = parseInt(this.golsFora)
            this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos)
            this.$emit('fim-jogo', { golsCasa: + this.golsCasa, golsFora: + this.golsFora})
            this.golsCasa = 0
            this.golsFora = 0
        }
    }
})


Vue.component('titulo', {
    template: `
    <div  class="row">
        <h1 @click="showVisao()">Campeonato Brasileiro - Série A - 2020 - {{$parent.visao | ucwords}}</h1>
    </div>
    `,
    methods: {
        showVisao () {
            console.log(this.$parent.$parent)
            // console.log(this.$parent.visao)
        }
    }
})

new Vue ({
    el: '#app',
    data: {
        param1: 'teste'
    }
    //template: '<my-app></my-app>'
})