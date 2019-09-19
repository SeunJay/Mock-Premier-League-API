import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
// import { Team } from '../models/Team';
// import auth from '../middleware/auth';
// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
import seed from '../db';

//let token: string;
// let adminToken: string;
// let teamA: any;
// let teamB: any;
// let fixturesId: string;
// let fixtureLink: string;
// let session: object;

beforeAll(async () => {
  await User.deleteMany({});

  const user = await request(app)
    .post('/api/v1/users/signup')
    .send({
      name: 'Michael',
      email: 'wakkojack@gmail.com',
      password: 'test1234',
    });

  let token = user.body.data.token;
  token;
  await seed();

  // teamA = await Team.findOne({ name: 'Brimingham City' });
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
  it('a user should be able to login', () => {
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
});
