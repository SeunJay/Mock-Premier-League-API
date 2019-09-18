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
