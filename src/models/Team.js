const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: [true, "A club must have a name!"],
      trim: true
    },
    founded: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: [true, "A club must have a country!"],
      trim: true
    },
    stadium: {
      type: String,
      required: [true, "Please provide the name of the club's stadium!"],
      trim: true
    },
    stadiumCapacity: {
      type: Number,
      required: true,
      trim: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamp: true }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
