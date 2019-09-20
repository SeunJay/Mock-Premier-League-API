import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Team } from '../models/Team';
// import auth from '../middleware/auth';
// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
import seed from '../db';

let token: string;
let adminToken: string;
let teamA: any;
//let teamB: any;
// let fixturesId: string;
// let fixtureLink: string;
// let session: object;

beforeAll(async () => {
  await User.deleteMany({});
  await seed();

  const user = await request(app)
    .post('/api/v1/users/signup')
    .send({
      name: 'Michael',
      email: 'wakkojack@gmail.com',
      password: 'test1234',
    });

  token = user.body.data;
  //console.log(token, user );

  teamA = await Team.findOne({ name: 'Brimingham City' });
  // teamB = await Team.findOne({ name: 'Fulham' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Tests for signing up a user', () => {
  it('a user should be able to sign up', () => {
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    return request(app)
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
    console.log(token, 'gere');
    return request(app)
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
    console.log(adminToken);
    return request(app)
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
    console.log(adminToken);
    return request(app)
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
    return request(app)
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
    return request(app)
      .delete(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.body.data.message).toBe(
          'You do not have permission to perform this action',
        );
      });
  });

  it('an admin user should be able to remove a team', () => {
    return request(app)
      .delete(`/api/v1/teams/${teamA._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });
});

describe('Tests for fixture routes', () => {
  it('UnAuthenticated users should not see fixtures', () => {
    return request(app)
      .get('/api/v1/fixtures')
      .set('Authorization', `Bearer ${'aaa'}`)
      .expect(res => {
        expect(res.body.data.error.message).toBe('jwt malformed');
      });
  });
});
