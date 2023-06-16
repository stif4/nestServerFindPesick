import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose, { disconnect } from 'mongoose';

const testCreateUserDTO = {
  login: 'test13231',
  email: 'test41123321@gmail.com',
  password: 'Sdd1223!',
  confirm: 'Sdd1223!',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdTestUserDTOId: string;
  let accesstoken: string;
  let idCreatedDog: string;
  let idCreatedCat: string;

  const updateData = {
    login: 'test13231',
    email: 'test41123321@gmail.com',
    isAdmin: false,
    phone: '',
    usernameTg: '',
    comment: '',
    block: false,
  };

  const createCat = {
    userId: undefined,
    coords: [-73.9938, 40.7133],
    breed: '6404af517618b944875650b3',
    sex: 1,
    type: 0,
    color: '6404afaf7618b94487565115',
    date: '2023-01-26',
    phone: '89500561453',
    usernameTg: 'LacostAdiddasovoch',
    streetName: 'Первомайская 21 д',
    photo: 'https/propalPesick.surce.ru',
    comment: 'Потерялся песик Бос, ну а я его Дидос!',
  };

  const updateCat = {
    userId: undefined,
    coords: [-73.9938, 40.7133],
    breed: '6404af517618b944875650b3',
    sex: 0,
    type: 1,
    color: '6404afaf7618b94487565115',
    date: '2023-01-23',
    phone: '89500561453',
    usernameTg: 'LacostAdiddasovoch',
    streetName: 'Первомайская 11 д',
    photo: 'https/propalPesick.surce.ru',
    comment: 'Потерялся песик Бос, ну а я его Дидос!',
  };

  const createDog = {
    userId: undefined,
    coords: [-73.9928, 40.7193],
    breed: '6404aecb7618b94487564f0b',
    sex: 1,
    type: 2,
    color: '6404afee7618b9448756512d',
    date: '2023-01-26',
    phone: '89500561453',
    usernameTg: 'LacostAdiddasovoch',
    streetName: 'Первомайская 21 д',
    photo: 'https/propalPesick.surce.ru',
    comment: 'Потерялся песик Бос, ну а я его Дидос!',
  };

  const updateDog = {
    userId: undefined,
    coords: [-73.9928, 40.7193],
    breed: '6404aecb7618b94487564f0b',
    sex: 0,
    type: 2,
    color: '6404afee7618b9448756512d',
    date: '2023-01-22',
    phone: '89500561453',
    usernameTg: 'LacostAdiddasovoch',
    streetName: 'Первомайская 21 д',
    photo: 'https/propalPesick.surce.ru',
    comment: 'Потерялся песик Бос, ну а я его Дидос!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testCreateUserDTO)
        .expect(200);
      createdTestUserDTOId = req.body.user._id;
      expect(createdTestUserDTOId).toBeDefined();
      accesstoken = req.body.accessToken;
      expect(accesstoken).toBeDefined();
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/auth/register (POST) - faild', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testCreateUserDTO, confirm: 123 })
        .expect(400);
      expect(req.text).toMatch('Bad Request');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/user/:id (Get) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .get(`/user/${createdTestUserDTOId}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/user/:id (Get) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .get(`/user/${createdTestUserDTOId + '1'}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(400);
      expect(req.text).toMatch('Invalid format Id');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/user/:id (PUT) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .put(`/user/${createdTestUserDTOId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/user/:id (PUT) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .put(`/user/${createdTestUserDTOId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${accesstoken + '1'}`)
        .expect(401);
      expect(req.text).toMatch('Unauthorized');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (POST) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post(`/posts-dog/`)
        .send({ ...createDog, userId: createdTestUserDTOId })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
      idCreatedDog = req.body._id;
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (POST) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post(`/posts-dog/`)
        .send({ ...createDog, userId: createdTestUserDTOId, date: '' })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(400);
      expect(req.text).toMatch('date must be a valid ISO 8601 date string');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (PUT) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .put(`/posts-dog/` + idCreatedDog)
        .send({ ...updateDog, userId: createdTestUserDTOId })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
      idCreatedDog = req.body._id;
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (PUT) - faild', async () => {
    try {
      const newData = { ...updateDog, userId: createdTestUserDTOId };
      const req = await request(app.getHttpServer())
        .put(`/posts-dog/` + idCreatedDog)
        .send({ ...newData, coords: '' })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(400);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (POST) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post(`/posts-cat/`)
        .send({ ...createCat, userId: createdTestUserDTOId })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
      idCreatedCat = req.body._id;
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (POST) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .post(`/posts-cat/`)
        .send({
          ...createCat,
          userId: createdTestUserDTOId,
          breed: '6404afee7618b9448756512d',
        })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(404);
      expect(req.text).toMatch('Breed is not found');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (PUT) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .put(`/posts-cat/` + idCreatedCat)
        .send({ ...updateCat, userId: createdTestUserDTOId })
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
      idCreatedCat = req.body._id;
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (GET) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .get(`/posts-cat/${idCreatedCat}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (GET) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .get(`/posts-cat/${idCreatedCat + '123'}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(400);
      expect(req.text).toMatch('Bad Request');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (GET) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .get(`/posts-dog/` + idCreatedDog)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (DELETE) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .delete(`/posts-dog/` + idCreatedDog)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-dog/ (DELETE) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .delete(`/posts-dog/` + idCreatedDog + '123123')
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(400);
      expect(req.text).toMatch('Bad Request');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (DELETE) - success', async () => {
    try {
      const req = await request(app.getHttpServer())
        .delete(`/posts-cat/${idCreatedCat}`)
        .set('Authorization', `Bearer ${accesstoken}`)
        .expect(200);
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  it('/posts-cat/ (DELETE) - fail', async () => {
    try {
      const req = await request(app.getHttpServer())
        .delete(`/posts-cat/${idCreatedCat}`)
        .set('Authorization', `Bearer ${accesstoken + '123'}`)
        .expect(401);
      expect(req.text).toMatch('Unauthorized');
    } catch (error) {
      expect(error).toMatch('Error');
      return error;
    }
  });

  // it('/user/:id (DELETE) - faild', async () => {
  //   try {
  //     const req = await request(app.getHttpServer())
  //       .delete(`/user/${createdTestUserDTOId}`)
  //       .set('Authorization', `Bearer ${accesstoken}`)
  //       .expect(403);
  //     console.log(req.body);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });
});
