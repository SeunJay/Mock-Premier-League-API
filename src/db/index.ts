import users from './seed/users';
import teams from './seed/teams';
import fixtures from './seed/fixtures';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Fixture } from '../models/Fixture';
import bcrypt from 'bcrypt';
import { promises } from 'fs';

const cleanDb = async () => {
  try {
    await User.deleteMany({});
    await Team.deleteMany({});
    await Fixture.deleteMany({});
    console.log('Db successfuly cleared');
  } catch (error) {
    console.log('Error :', error);
    return error;
  }
};

const seedUser = async () => {
  try {
    const Users = await users.map(async user => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await User.create(user);
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
    const Teams = await teams.map(async team => {
      const newTeam = await Team.create(team);
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
    const allfixtures = fixtures.map(async fixture => {
      const hometeam = await Team.findOne({ name: fixture.homeTeam }).exec();
      const awayteam = await Team.findOne({ name: fixture.awayTeam }).exec();
      const newFixtures = await new Fixture({
        ...fixture,
        homeTeam: hometeam.id,
        awayTeam: awayteam.id,
      });
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

export default seed;
