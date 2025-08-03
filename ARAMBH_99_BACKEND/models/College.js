const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema({
  name: { type: String },
  administrator: { type: String },
  information: { type: String },
  address: { type: String },
  contact: [
    {
      person: { type: String },
      phone: { type: String },
      email: { type: String },
    },
  ],
  websites: [
    {
      name: { type: String },
      link: { type: String },
    },
  ],
  infrastructure: {
    library: { type: String },
    hostel: { type: String },
    canteen: { type: String },
    sports: { type: String },
    labs: { type: String },
    classrooms: { type: String },
    other: { type: String }
  },
  courses: [
    {
      name: { type: String },
      seats: { type: String },
      fees: { type: String },
      eligibility: { type: String },
    },
  ],
  admission_process: { type: String },
  cutoff: { type: String },
  placement: {
    topRecruiters: { type: String },
    statistics: { type: String },
    averagePackages: { type: String },
    other: { type: String }
  },
  alumni: { type: String },
  events_activities: { type: String },
  governance: { type: String },
  committees: { type: String },
  other: { type: String }
});

module.exports = mongoose.model("College", CollegeSchema);
