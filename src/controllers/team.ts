import { validateTeam } from '../validators/validateTeam';
import { Request, Response } from 'express';
import { Team } from '../models/Team';

export const viewTeam = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(401).send({ error: error.details[0].message });

  try {
    const {
      name,
      email,
      coach,
      country,
      founded,
      stadium_name,
      stadium_capacity,
    } = req.body;

    const teamCheck = await Team.findOne({ email });
    if (teamCheck)
      return res.status(400).json({
        success: false,
        message: 'A user with this team already exists!',
      });

    const newTeam = await new Team({
      name,
      email,
      coach,
      country,
      founded,
      stadium_name,
      stadium_capacity,
    }).save();
    return res.status(200).json({ success: true, data: newTeam });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
