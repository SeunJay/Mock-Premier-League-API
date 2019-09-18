import { Fixture } from '../models/Fixture';
import { Team } from '../models/Team';
import { Request, Response } from 'express';
import {
  validateFixture,
  validateUpdateFixture,
} from '../validators/validateFixture';

export const viewFixtures = async (_req: Request, res: Response) => {
  try {
    const fixtures = await Fixture.find().populate(
      'homeTeam awayTeam',
      'name coach -_id',
    );
    return res.status(200).json({ success: true, data: fixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const viewPendingFixtures = async (_req: Request, res: Response) => {
  try {
    const pendingFixtures = await Fixture.find({ played: false }).populate(
      'homeTeam awayTeam',
      'name coach -_id',
    );
    return res.status(200).json({ success: true, data: pendingFixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const viewCompletedFixtures = async (_req: Request, res: Response) => {
  try {
    const completedFixtures = await Fixture.find({ played: true }).populate(
      'homeTeam awayTeam',
      'name coach -_id',
    );
    return res.status(200).json({ success: true, data: completedFixtures });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const addFixture = async (req: Request, res: Response) => {
  const { error } = validateFixture(req.body);
  if (error) return res.status(401).send({ error: error.details[0].message });

  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    time,
    stadium,
    played,
  } = req.body;

  const home = await Team.findById(homeTeam);
  if (!home)
    return res
      .status(400)
      .json({ success: true, message: 'Team does not exist' });

  const away = await Team.findById(awayTeam);
  if (!away)
    return res
      .status(400)
      .json({ success: true, message: 'Team does not exist' });

  try {
    const newFixture = await new Fixture({
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
