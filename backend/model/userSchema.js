import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// We are hashing the password
userSchema.pre("save", async function (next) {
  console.log("Hi from inside");
  // this function is called when password is only modified or get input before save to the database
  if (this.isModified("password")) {
    // after getting the password hash the password with 12 digit, max digit is strong password
    this.password = await bcrypt.hash(this.password, 12);
    // same with the confirm password
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// we are generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    // pass the id and secret to generate token
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // then save the token in schema
    this.tokens = this.tokens.concat({ token: token });
    // then save this token
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// Stored the message
// call the add Message in contact us page while add the message to schema

userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    // Messages is instances of message see schema
    this.messages = this.messages.concat({ name, email, phone, message });
    // then save this
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

// Collection creation
const User = mongoose.model("user", userSchema);

export default User;
