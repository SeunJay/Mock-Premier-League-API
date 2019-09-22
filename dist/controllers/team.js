'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const validateTeam_1 = require('../validators/validateTeam');
const Team_1 = require('../models/Team');
exports.viewTeams = async (_req, res) => {
  try {
    const teams = await Team_1.Team.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.addTeam = async (req, res) => {
  const { error } = validateTeam_1.validateTeam(req.body);
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
    const teamCheck = await Team_1.Team.findOne({ email });
    if (teamCheck)
      return res.status(400).json({
        success: false,
        message: 'A user with this team already exists!',
      });
    const newTeam = await new Team_1.Team({
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
exports.editTeam = async (req, res) => {
  try {
    const updatedTeam = await Team_1.Team.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    return res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.removeTeam = async (req, res) => {
  try {
    const removedTeam = await Team_1.Team.findById({ _id: req.params.id });
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
exports.searchTeam = async (req, res) => {
  const query = req.query;
  try {
    const key = Object.keys(query)[0];
    const value = Object.values(query)[0];
    if (key === 'founded' || key === 'stadium_capacity')
      return res.status(400).json({
        success: false,
        message: 'please you cannot search by founded or stadium capacity',
      });
    const team = await Team_1.Team.find({
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
//# sourceMappingURL=team.js.map
