import { validateTeam } from '../validators/validateTeam';
import { Request, Response } from 'express';
import { Team } from '../models/Team';

export const viewTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const addTeam = async (req: Request, res: Response) => {
  const { error } = validateTeam(req.body);
  if (error)
    return res
      .status(401)
      .send({ error: error.details[0].message.replace(/\"/g, '') });

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
    });
    await newTeam.save();
    return res.status(200).json({ success: true, data: newTeam });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const editTeam = async (req: Request, res: Response) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    return res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const removeTeam = async (req: Request, res: Response) => {
  try {
    const removedTeam = await Team.findById({ _id: req.params.id });
    if (!removedTeam)
      return res.status(400).json({ success: false, message: 'No such team' });

    removedTeam.isDeleted = true;
    await removedTeam.save();
    return res.status(200).json({
      success: true,
      message: `${removedTeam.name} has been successfully removed`,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const searchTeam = async (req: Request, res: Response) => {
  const query = req.query;

  try {
    const key = Object.keys(query)[0];
    const value = Object.values(query)[0];

    if (key === 'founded' || key === 'stadium_capacity')
      return res.status(400).json({
        success: false,
        message: 'please you cannot search by founded or stadium capacity',
      });

    const team = await Team.find({
      [key]: { $regex: new RegExp(`${value}`), $options: 'i' },
      isDeleted: false,
    });

    if (!team.length)
      return res
        .status(400)
        .json({ success: false, message: 'No match found' });
    return res.status(200).json({ success: true, data: team });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
