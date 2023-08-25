/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contracts'

describe('Testes da Funcionalidade Usuários', () => {

     let token
     before(()=>{
        cy.token('fulano@qa.com', 'teste').then(tkn =>{token = tkn})
    })

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response =>{
          return contrato.validateAsync(response.body)
      })
    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'
      }) 
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     let email = `ebac${Math.floor(Math.random() * 10000)}@gmail.com`
     cy.request({
       method: 'POST',
       url: 'usuarios',
       body: {
             "nome": 'Teste',
             "email": email,
             "password": "1234",
             "administrador": 'false'
       }
     }).then((response)=>{
         expect(response.status).to.equal(201)
         expect(response.body.message).to.equal('Cadastro realizado com sucesso')
     })
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarUsuario('teste','ebac6221@gmail.com', '1234', 'false').then((response)=>{
          expect(response.body.message).to.equal('Este email já está sendo usado')
          expect(response.status).to.equal(400)
     }) 
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     let email = `ebac${Math.floor(Math.random() * 10000)}@gmail.com`
     cy.cadastrarUsuario('teste', email, '1234', 'false')
     .then(response =>{
          let id = response.body._id
          cy.request({
              method: 'PUT',
              url: `usuarios/${id}`,
               body:{
                  "nome": 'teste2',
                  "email": email,
                  "password": '12345678',
                  "administrador": 'true'
              }
          }).then(response =>{
              expect(response.body.message).to.equal("Registro alterado com sucesso")
          })  
      })

    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let email = `ebac${Math.floor(Math.random() * 10000)}@gmail.com`
     cy.cadastrarUsuario('teste', email, '1234', 'false')
     .then(response =>{
          let id = response.body._id
          cy.request({
              method:'DELETE',
              url:`usuarios/${id}`
          }).then(response =>{
              expect(response.body.message).to.equal('Registro excluído com sucesso')
          })
     }) 
    });


});