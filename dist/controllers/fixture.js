'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Fixture_1 = require('../models/Fixture');
const Team_1 = require('../models/Team');
const validateFixture_1 = require('../validators/validateFixture');
exports.viewFixtures = async (_req, res) => {
  try {
    const fixtures = await Fixture_1.Fixture.find().populate(
      'homeTeam awayTeam',
      'name coach -_id',
    );
    return res.status(200).json({ success: true, data: fixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.viewPendingFixtures = async (_req, res) => {
  try {
    const pendingFixtures = await Fixture_1.Fixture.find({
      played: false,
    }).populate('homeTeam awayTeam', 'name coach -_id');
    return res.status(200).json({ success: true, data: pendingFixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.viewCompletedFixtures = async (_req, res) => {
  try {
    const completedFixtures = await Fixture_1.Fixture.find({
      played: true,
    }).populate('homeTeam awayTeam', 'name coach -_id');
    return res.status(200).json({ success: true, data: completedFixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.addFixture = async (req, res) => {
  const { error } = validateFixture_1.validateFixture(req.body);
  if (error)
    return res
      .status(401)
      .send({ error: error.details[0].message.replace(/\"/g, '') });
  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    time,
    stadium,
    played,
  } = req.body;
  const home = await Team_1.Team.findById(homeTeam);
  if (!home)
    return res
      .status(400)
      .json({ success: false, message: 'Team does not exist' });
  const away = await Team_1.Team.findById(awayTeam);
  if (!away)
    return res
      .status(400)
      .json({ success: false, message: 'Team does not exist' });
  try {
    const newFixture = await new Fixture_1.Fixture({
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      time,
      stadium,
      played,
    }).save();
    return res.status(200).json({ success: true, data: newFixture });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
//@ts-ignore
exports.editFixture = async (req, res) => {
  const { error } = validateFixture_1.validateUpdateFixture(req.body);
  if (error)
    return res.status(400).json(error.details[0].message.replace(/\"/g, ''));
  const { homeScore, awayScore, played } = req.body;
  try {
    const {
      homeTeam,
      awayTeam,
      time,
      stadium,
      _id,
    } = await Fixture_1.Fixture.findById({
      _id: req.params.id,
    });
    const updateFixture = await Fixture_1.Fixture.findByIdAndUpdate(_id, {
      homeTeam,
      awayTeam,
      time,
      stadium,
      homeScore,
      awayScore,
      played,
    });
    if (!updateFixture) {
      return 'Fixture does not exist';
    }
    await updateFixture.save();
    const home = await Team_1.Team.findById(homeTeam);
    const away = await Team_1.Team.findById(awayTeam);
    if (!home) {
      return;
    }
    if (!away) {
      return;
    }
    // update the wins and losses if played is true
    if (played) {
      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.goals += homeScore;
        away.goals += awayScore;
      } else if (homeScore < awayScore) {
        home.losses += 1;
        away.wins += 1;
        away.goals += awayScore;
        home.goals += homeScore;
      } else {
        away.goals += awayScore;
        home.goals += homeScore;
      }
      await home.save();
      await away.save();
    }
    res.status(200).json({
      data: {
        message: `Fixture ${_id} updated successfully`,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.removeFixture = async (req, res) => {
  try {
    await Fixture_1.Fixture.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({
      data: {
        message: `Fixture deleted successfully`,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.searchFixture = async (req, res) => {
  const query = req.query;
  try {
    const key = Object.keys(query)[0];
    const value = Object.values(query)[0];
    if (key !== 'played' && key !== 'time' && key !== 'stadium')
      return res.status(400).json({
        success: false,
        message:
          'please you can only search by played status, time, and stadium',
      });
    const fixtures = await Fixture_1.Fixture.find({
      [key]: { $regex: new RegExp(`${value}`), $options: 'i' },
      played: false,
    });
    if (!fixtures.length)
      return res
        .status(400)
        .json({ success: false, message: 'No match found' });
    return res.status(200).json({ success: true, data: fixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.getFixture = async (req, res) => {
  const { id } = req.params;
  try {
    const fixture = await Fixture_1.Fixture.findOne({
      link: `http://localhost:${process.env.PORT}/api/v1/fixtures/${id}`,
    })
      .populate('homeTeam awayTeam', 'name coach -_id')
      .select('-_id');
    console.log(fixture);
    if (!fixture)
      return res
        .status(400)
        .json({ success: false, message: 'Link not available' });
    return res.status(200).json({ success: true, fixture });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
//# sourceMappingURL=fixture.js.map
