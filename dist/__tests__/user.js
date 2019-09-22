'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const mongoose_1 = __importDefault(require('mongoose'));
const app_1 = __importDefault(require('../app'));
const User_1 = require('../models/User');
const Team_1 = require('../models/Team');
// import auth from '../middleware/auth';
// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
const db_1 = __importDefault(require('../db'));
let token;
let adminToken;
let teamA;
let teamB;
//@ts-ignore
let fixturesId;
let fixtureLink;
// let session: object;
beforeAll(async () => {
  await User_1.User.deleteMany({});
  await db_1.default();
  const user = await supertest_1
    .default(app_1.default)
    .post('/api/v1/users/signup')
    .send({
      name: 'Michael',
      email: 'wakkojack@gmail.com',
      password: 'test1234',
    });
  token = user.body.data;
  //console.log(token, user );
  teamA = await Team_1.Team.findOne({ name: 'Brimingham City' });
  teamB = await Team_1.Team.findOne({ name: 'Fulham' });
});
afterAll(async () => {
  await mongoose_1.default.connection.close();
});
describe('Tests for signing up a user', () => {
  it('a user should be able to sign up', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/signup')
      .send({
        name: 'Angel',
        email: 'angel@gmail.com',
        password: 'test1234',
      })
      .expect(res => {
        expect(Object.keys(res.body.user)).toContain('name');
        expect(Object.keys(res.body.user)).toContain('email');
      });
  });
  it('should return an error if name field is empty', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/signup')
      .send({
        name: '',
        email: 'angel@gmail.com',
        password: 'test1234',
      })
      .expect(res => {
        expect(res.body.error).toBe('name is not allowed to be empty');
      });
  });
  it('should return an error if email field is empty', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/signup')
      .send({
        name: 'Angel',
        email: '',
        password: 'test1234',
      })
      .expect(res => {
        expect(res.body.error).toBe('email is not allowed to be empty');
      });
  });
  it('should return an error if password field is empty', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/signup')
      .send({
        name: 'Angel',
        email: 'angel@gmail.com',
        password: '',
      })
      .expect(res => {
        expect(res.body.error).toBe('password is not allowed to be empty');
      });
  });
  it('should return an error if same user tries to sign up again', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/signup')
      .send({
        name: 'Angel',
        email: 'angel@gmail.com',
        password: 'test1234',
      })
      .expect(res => {
        expect(res.body.message).toBe('User already exists!');
      });
  });
});
describe('Tests for login in a user', () => {
  it('a regular user should be able to login', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/login')
      .send({
        email: 'angel@gmail.com',
        password: 'test1234',
      })
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
  it('should return an error if password is wrong', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/login')
      .send({
        email: 'angel@gmail.com',
        password: 'test12345',
      })
      .expect(res => {
        expect(res.body.message).toBe('Invalid Credentials!');
      });
  });
  it('should return an error if email is wrong', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/login')
      .send({
        email: 'angel1@gmail.com',
        password: 'test12345',
      })
      .expect(res => {
        expect(res.body.message).toBe('Invalid Credentials!');
      });
  });
  it('an admin user should be able to login', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/users/login')
      .send({
        email: 'seunjay@gmail.com',
        password: 'test1234',
      })
      .expect(res => {
        adminToken = res.body.data;
        expect(res.body.success).toBe(true);
      });
  });
});
// jest.mock('../middleware/auth');
// const mockedAuth = auth as jest.Mocked<any>;
// mockedAuth.mockImplementation(
//   //@ts-ignore
//   async (req: Request, res: Response, next: NextFunction) => {
//     //supertest sees req.session as undefined so had to mock it
//     //session store
//     session = {};
//     let token;
//     try {
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//       ) {
//         token = req.headers.authorization.split(' ')[1];
//       }
//       if (!token) {
//         return res.status(401).send({
//           data: {
//             message: 'You are not logged in! Please log in to get access.',
//           },
//         });
//       }
//       const decoded: any = jwt.verify(token, <any>process.env.JWT_PRIVATE_KEY);
//       //@ts-ignore
//       session[decoded._id] = { token: token };
//       if (decoded) {
//         //@ts-ignore
//         if (!session[decoded._id]) {
//           return res.status(401).send({
//             data: { message: 'Session over, Pls login...' },
//           });
//         }
//         //@ts-ignore
//         if (token !== session[decoded._id].token) {
//           return res.status(401).send({
//             data: { message: 'Invalid Token' },
//           });
//         }
//         //@ts-ignore
//         req['checkUser'] = decoded;
//         next();
//       } else {
//         res.status(401).send({ data: { message: 'user does not exist' } });
//       }
//     } catch (error) {
//       return res.status(400).send({ data: { error } });
//     }
//   },
// );
describe('Tests for team routes', () => {
  it('Users should view teams', () => {
    return supertest_1
      .default(app_1.default)
      .get(`/api/v1/teams`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data[0]).toHaveProperty('wins');
        expect(res.body.data[0]).toHaveProperty('losses');
        expect(res.body.data[0]).toHaveProperty('name');
        expect(res.body.data[0]).toHaveProperty('email');
      });
  });
  it('a regular user should not be able to create a team', () => {
    return supertest_1
      .default(app_1.default)
      .post(`/api/v1/teams`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'SeunJay FC',
        email: 'forestgreen@email.com',
        coach: 'Tob Jay',
        country: 'England',
        founded: 2000,
        stadium_name: 'Well Sparks',
        wins: 2,
        losses: 0,
        goals: 8,
        stadium_capacity: '60000m',
      })
      .expect(res => {
        // console.log(res)
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });
  it('an admin user should be able to create a team', () => {
    return supertest_1
      .default(app_1.default)
      .post(`/api/v1/teams`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'SeunJay FC',
        email: 'forestgreen@email.com',
        coach: 'Tob Jay',
        country: 'England',
        founded: 2000,
        stadium_name: 'Well Sparks',
        wins: 2,
        losses: 0,
        goals: 8,
        stadium_capacity: '60000m',
      })
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
  it('an admin user should be able to edit a team', () => {
    return supertest_1
      .default(app_1.default)
      .put(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'SeunJay FC',
        email: 'forestgreen@email.com',
        coach: 'Tob Jay',
        country: 'England',
        founded: 2000,
      })
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
  it('an regular user should not be able to edit a team', () => {
    return supertest_1
      .default(app_1.default)
      .put(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'SeunJay FC',
        email: 'forestgreen@email.com',
        coach: 'Tob Jay',
        country: 'England',
        founded: 2000,
      })
      .expect(res => {
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });
  it('an regular user should not be able to remove a team', () => {
    return supertest_1
      .default(app_1.default)
      .delete(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });
  it('an admin user should be able to remove a team', () => {
    return supertest_1
      .default(app_1.default)
      .delete(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
  // it('an admin user should be able to remove a team', () => {
  //   return request(app)
  //     .delete(`/api/v1/teams/${teamA._id}wer`)
  //     .set('Authorization', `Bearer ${adminToken}`)
  //     .expect(res => {
  //       console.log(res.body.success);
  //       expect(res.body.success).toBe(false);
  //     });
  // });
});
describe('Tests for fixture routes', () => {
  it('UnAuthenticated users should not see fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .get('/api/v1/fixtures')
      .set('Authorization', `Bearer ${'aaa'}`)
      .expect(res => {
        expect(res.body.data.error.message).toBe('jwt malformed');
      });
  });
  it('Authenticated users should see fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .get('/api/v1/fixtures')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data).toHaveLength(12);
      });
  });
  it('Authenticated users should see pending fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .get('/api/v1/fixtures/pending')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data).toHaveLength(5);
      });
  });
  it('Authenticated users should see completed fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .get('/api/v1/fixtures/completed')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data).toHaveLength(7);
      });
  });
  it('Admin should create fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/fixtures')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        homeTeam: teamA._id,
        awayTeam: teamB._id,
        time: '7:00pm',
        homeScore: 0,
        awayScore: 0,
        stadium: 'boltonfield',
        played: false,
      })
      .expect(res => {
        //assign fixtures properties
        fixturesId = res.body.data._id;
        fixtureLink = res.body.data.link;
        expect(res.body.data).toMatchObject({
          homeScore: 0,
          awayScore: 0,
          stadium: 'boltonfield',
          played: false,
        });
      });
  });
  it('Users should see a fixtures by link', () => {
    let link = fixtureLink.split('/');
    let mainLink = link[link.length - 1];
    return supertest_1
      .default(app_1.default)
      .get(`/api/v1/fixtures/${mainLink}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.fixture).toMatchObject({
          homeScore: 0,
          awayScore: 0,
          stadium: 'boltonfield',
          homeTeam: { name: 'SeunJay FC', coach: 'Tob Jay' },
          awayTeam: { name: 'Fulham', coach: 'Van gwart' },
          time: '7:00pm',
          played: false,
        });
      });
  });
  it('a regular user should not be able to create fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .post('/api/v1/fixtures')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeTeam: teamA._id,
        awayTeam: teamB._id,
        time: '7:00pm',
        homeScore: 0,
        awayScore: 0,
        stadium: 'shellfield',
        played: false,
      })
      .expect(res => {
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });
  it('Admin should update fixtures', () => {
    return supertest_1
      .default(app_1.default)
      .put(`/api/v1/fixtures/${fixturesId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        homeScore: 4,
        awayScore: 2,
        played: true,
      })
      .expect(res => {
        expect(res.body.data.message).toBe(
          `Fixture ${fixturesId} updated successfully`,
        );
      });
  });
  it('Admin should remove a fixture', () => {
    return supertest_1
      .default(app_1.default)
      .delete(`/api/v1/fixtures/${fixturesId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(res => {
        expect(res.body.data.message).toBe(`Fixture deleted successfully`);
      });
  });
  it('a regular user should not be able to remove a fixture', () => {
    return supertest_1
      .default(app_1.default)
      .delete(`/api/v1/fixtures/${fixturesId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });
});
describe('Public routes', () => {
  it('a user should be able to search for teams', () => {
    let key = 'England';
    return supertest_1
      .default(app_1.default)
      .get(`/api/v1/teams/search?country=${key}`)
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
  it('should return an error if search key is founded or stadium capacity', () => {
    let key = 'England';
    return supertest_1
      .default(app_1.default)
      .get(`/api/v1/teams/search?founded=${key}`)
      .expect(res => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe(
          'please you cannot search by founded or stadium capacity',
        );
      });
  });
  it('a user should be able to search for fixtures', () => {
    let key = 'shellfield';
    return supertest_1
      .default(app_1.default)
      .get(`/api/v1/fixtures/search?stadium=${key}`)
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
});
//# sourceMappingURL=user.js.map
