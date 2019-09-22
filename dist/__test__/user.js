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
const db_1 = __importDefault(require('../db'));
let token;
let adminToken;
let teamA;
let teamB;
let fixturesId;
let fixtureLink;
let session;
beforeAll(async () => {
  await User_1.User.deleteMany({});
  const user = await supertest_1
    .default(app_1.default)
    .post('/api/v1/users/signup')
    .send({
      name: 'Michael',
      email: 'wakkojack@gmail.com',
      password: 'test1234',
    });
  token = user.body.data.token;
  await db_1.default();
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
        expect(Object.keys(res.body.data.user)).toContain('name');
        expect(Object.keys(res.body.data.user)).toContain('email');
      });
  });
});
//# sourceMappingURL=user.js.map
