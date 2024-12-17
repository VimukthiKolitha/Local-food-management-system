import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, massage: "User Doesn't exit" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, massage: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, massage: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//regiter user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checking is user already exits
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, massage: "User Already Exists" });
    }

    //validate email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        massage: "Please Enter a Valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        massage: "Please Enter Strong Password",
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hasedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, massage: "Error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export { loginUser, registerUser, getUserById };
