class Despesa{
    constructor(Ano, Mes, Dia, Tipo, Descricao, Valor){
        this.Ano = Ano
        this.Mes = Mes
        this.Dia = Dia
        this.Tipo = Tipo
        this.Descricao = Descricao
        this.Valor = "R$ " + Valor

    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == "" || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1

    }

    registro(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarRegistro(){

        let despesas = Array()


        let id = localStorage.getItem('id') 

        for(let i = 1; i <= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)


        }

        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistro()

        if(despesa.Ano !=''){
           despesasFiltradas = despesasFiltradas.filter(d => d.Ano == despesa.Ano)

        }

        if(despesa.Mes !=''){
            despesasFiltradas = despesasFiltradas.filter(d => d.Mes == despesa.Mes)
 
         }

         if(despesa.Dia !=''){
            despesasFiltradas = despesasFiltradas.filter(d => d.Dia == despesa.Dia)
 
         }

         if(despesa.Tipo !=''){
            despesasFiltradas = despesasFiltradas.filter(d => d.Tipo == despesa.Tipo)
 
         }

         if(despesa.Descricao !=''){
            despesasFiltradas = despesasFiltradas.filter(d => d.Descricao == despesa.Descricao)
 
         }

         if(despesa.Valor !=''){
            despesasFiltradas = despesasFiltradas.filter(d => d.Valor == despesa.Valor)
 
         }

         return despesasFiltradas
    }

    apagarRegistro(id){
        localStorage.removeItem(id)
            
    }
}

let bd = new Bd()


function cadastrarDespesa() {

  let ano = document.getElementById('Ano')
  let mes = document.getElementById('Mes')
  let dia = document.getElementById('Dia')
  let tipo = document.getElementById('Tipo')
  let descricao = document.getElementById('Descricao')
  let valor = document.getElementById('Valor')

  console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

  let despesa = new Despesa (
    Ano.value,
    Mes.value,
    Dia.value,
    Tipo.value,
    Descricao.value,
    Valor.value
    )

    console.log(despesa)
    
    if(despesa.validarDados()){
        bd.registro(despesa)
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('cabecalho').className = 'modal-header text-success'
        document.getElementById('modal_resposta').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_botao').className = 'btn btn-success'
        document.getElementById('modal_botao').innerHTML = 'Voltar'
        $('#modalRegistraDespesa').modal('show')

        Ano.value = ''
        Mes.value = ''
        Dia.value = ''
        Tipo.value = ''
        Descricao.value = ''
        Valor.value = ''

    }else{
        document.getElementById('modal_titulo').innerHTML = 'Erro no registro'
        document.getElementById('cabecalho').className = 'modal-header text-danger'
        document.getElementById('modal_resposta').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos!'
        document.getElementById('modal_botao').className = 'btn btn-danger'
        document.getElementById('modal_botao').innerHTML = 'Voltar e corrigir'
        $('#modalRegistraDespesa').modal('show')
    }

}

function carregarDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarRegistro()

    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.Dia}/${d.Mes}/${d.Ano}`

        switch(d.Tipo){
            case '1': d.Tipo = 'Alimentação'
            break
            case '2': d.Tipo = 'Educação'
            break
            case '3': d.Tipo = 'Lazer'
            break
            case '4': d.Tipo = 'Saúde'
            break
            case '5': d.Tipo = 'Transporte'
            break

        }

        linha.insertCell(1).innerHTML = d.Tipo
        linha.insertCell(2).innerHTML = d.Descricao
        linha.insertCell(3).innerHTML = d.Valor
        
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.apagarRegistro(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)

    })

}

function pesquisaDespesa(){
    let ano = document.getElementById('Ano').value
    let mes = document.getElementById('Mes').value
    let dia = document.getElementById('Dia').value
    let tipo = document.getElementById('Tipo').value
    let descricao = document.getElementById('Descricao').value
    let valor = document.getElementById('Valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

    let despesas = bd.pesquisar(despesa)
    carregarDespesas(despesas, true)


}
