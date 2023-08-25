///<reference types="cypress"/>
import contrato from '../contracts/produtos.contracts'


describe('Teste da Funcionalidade Produtos', ()=>{
    let token
    before(()=>{
        cy.token('fulano@qa.com', 'teste').then(tkn =>{token = tkn})
    })

    it.only('deve validar contrato de produtos', ()=>{
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })

    })

    it('Listar Produtos', ()=>{
        cy.request({
            method: 'GET',
            url: 'produtos'
        })
    })

    it('Cadastrar Produto', ()=>{
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000)}`
        cy.request({
          method: 'POST',
          url: 'produtos',
          body: {
                "nome": produto,
                "preco": 10,
                "descricao": "Teclado",
                "quantidade": 50
          },
          headers: {authorization: token}
        }).then((response)=>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    })

    it('Validar mensagem de erro para cadastro repetido',()=>{
        cy.cadastrarProduto(token,'Produto EBAC 670', 70, 'Descricao do produto', 160).then((response)=>{
            expect(response.body.message).to.equal('Já existe produto com esse nome')
            expect(response.status).to.equal(400)
        })

    })

    it('editar um produto cadastrado', ()=>{
        cy.request('produtos').then(response =>{
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization : token},
                body:{
                    "nome": "Produtos novo",
                    "preco": 103,
                    "descricao": "Mudou",
                    "quantidade": 20
                }
            }).then(response =>{
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    })

    it('deve editar um produto cadastrado previamente', ()=>{
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000)}`
        cy.cadastrarProduto(token, produto, 70, 'Descricao do produto', 160)
        .then(response =>{
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization : token},
                body:{
                    "nome": produto,
                    "preco": 150,
                    "descricao": "Mudou",
                    "quantidade": 300
                }
            }).then(response =>{
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })  
        })
    })

    it('deve deletar um produto previamente cadastrado', ()=>{
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000)}`
        cy.cadastrarProduto(token, produto, 70, 'Descricao do produto', 160)
        .then(response =>{
            let id = response.body._id
            cy.request({
                method:'DELETE',
                url:`produtos/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
        

    })
})