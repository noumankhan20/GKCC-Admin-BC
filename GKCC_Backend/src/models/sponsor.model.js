import mongoose from "mongoose";


const sponsorSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  logo: { type: String },
  brochure: { type: String },
  websitelink: { type: String },
  sponsorsTypes: {
    type: String,
    enum: ["Homepopup", "Sponsorpage", "Section"],
    required: true,
  },
  sections: [
    {
      sectionName: {
        type: String,
        // required: true,
        enum: ["section 1", "section 2", "section 3", "section 4"],
        validate: {
          validator: function (value) {
              if (!this.sections) return true;
            const duplicateSections = this.sections.filter(
              (section) => section.sectionName === value
            );
            return duplicateSections.length <= 1;
          },
          message: "Duplicate sectionName not allowed within the same sponsor.",
        },
      },
      selectedOption: {
        type: String,
        enum: ["brochure", "websitelink"],
        // required: true,
      },
    },
  ],
});


const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
