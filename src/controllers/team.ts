import { validateTeam } from '../validators/validateTeam';
import { Request, Response } from 'express';
import { Team } from '../models/Team';

export const viewteam = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find({ isDeleted: false });
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
