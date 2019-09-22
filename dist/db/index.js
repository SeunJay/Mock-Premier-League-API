'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const users_1 = __importDefault(require('./seed/users'));
const teams_1 = __importDefault(require('./seed/teams'));
const fixtures_1 = __importDefault(require('./seed/fixtures'));
const User_1 = require('../models/User');
const Team_1 = require('../models/Team');
const Fixture_1 = require('../models/Fixture');
const bcrypt_1 = __importDefault(require('bcrypt'));
const cleanDb = async () => {
  try {
    await User_1.User.deleteMany({});
    await Team_1.Team.deleteMany({});
    await Fixture_1.Fixture.deleteMany({});
    console.log('Db successfuly cleared');
  } catch (error) {
    console.log('Error :', error);
    return error;
  }
};
const seedUser = async () => {
  try {
    const Users = await users_1.default.map(async user => {
      const salt = await bcrypt_1.default.genSalt(10);
      user.password = await bcrypt_1.default.hash(user.password, salt);
      const newUser = await User_1.User.create(user);
      return newUser.save();
    });
    const res = await Promise.all(Users);
    return res;
  } catch (error) {
    console.log('Error :', error);
    return error;
  }
};
const seedTeam = async () => {
  try {
    const Teams = await teams_1.default.map(async team => {
      const newTeam = await Team_1.Team.create(team);
      return newTeam.save();
    });
    const res = await Promise.all(Teams);
    return res;
  } catch (error) {
    console.log('Error :', error);
    return error;
  }
};
const seedFixture = async () => {
  try {
    const allfixtures = fixtures_1.default.map(async fixture => {
      const hometeam = await Team_1.Team.findOne({
        name: fixture.homeTeam,
      }).exec();
      const awayteam = await Team_1.Team.findOne({
        name: fixture.awayTeam,
      }).exec();
      const newFixtures = await new Fixture_1.Fixture(
        Object.assign({}, fixture, {
          //@ts-ignore
          homeTeam: hometeam.id,
          //@ts-ignore
          awayTeam: awayteam.id,
        }),
      );
      await newFixtures.save();
    });
    const res = await Promise.all(allfixtures);
    return res;
  } catch (error) {
    console.log('Error :', error);
    return error;
  }
};
const seed = async () => {
  return await cleanDb()
    .then(async () => {
      await seedTeam();
      await seedUser();
      await seedFixture();
    })
    .then(() => console.log(`Database has been successfully seeded`))
    .catch(error => {
      console.log('Error :', error);
      return error;
    });
};
exports.default = seed;
//# sourceMappingURL=index.js.map
