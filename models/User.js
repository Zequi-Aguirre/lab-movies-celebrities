const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    likedMovies: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Movie",
          // the ref makes it so .populate knows which model to look at
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
