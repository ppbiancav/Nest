import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {

  let token: any;
  let usuarioId: any; 
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db_blogpessoal_test.db',
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true, 
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); 
  }) 

  it("01 - Deve cadastrar um novo usuário", async () => {
    const resposta = await request (app.getHttpServer())
    .post('/usuarios/cadastrar') //url, endereço 
    .send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '-'
    })
    .expect(201)

    usuarioId = resposta.body.id; 
  })

  it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400)

  });

  it("03 - Deve Autenticar o Usuário (Login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
      usuario: 'root@root.com',
      senha: 'rootroot',
    })
    .expect(200)

    token = resposta.body.token;

    console.log("Token: " + token);

  })

  it("04 - Deve Listar todos os Usuários", async () => {
    return request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  })

  it("05 - Deve Atualizar um Usuário", async () => {
    return request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', `${token}`)
    .send({
      id: usuarioId,
      nome: 'Bianca',
      usuario: 'root@root.com',
      senha: 'bianca123',
      foto: '-',
    })
    .expect(200)
    .then( resposta => {
      expect("Bianca").toEqual(resposta.body.nome);
    })

  })
  
  it("06 - Deve Buscar Usuário por Id", async () =>{
    const userId = 1;

    return request(app.getHttpServer())
    .get(`/usuarios/${userId}`)
    .set('Authorization', `${token}`)
    .expect(200)
    .then( resposta => {
      expect(resposta.body.id).toEqual(userId); 
    })

  }) 

});
