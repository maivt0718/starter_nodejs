import pool from "../../db.js";
import { status } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize"; // AND, IN, LIKe, OR
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { text } from "express";
import transporter from "../../config/transporter.js";
import { createToken } from "../../config/jwt.js";

const models = initModels(sequelize);

const authRegister = async (req, res, next) => {
  try {
    let { fullname, email, pass } = req.body;

    let user = await models.users.findOne({
      where: { email },
    });

    if (user) {
      return res.status(status.FOUND).json(`User found`);
    }

    const newUser = await models.users.create({
      fullname: fullname,
      email: email,
      pass_word: bcrypt.hashSync(pass, 10),
    });
    const mailOption = {
        from: 'maivt0718@gmail.com',
        to: email,
        subject: 'welcome to our services',
        text: `Hello ${fullname}`,
        html: `<h1>Ahhhihihihihihi</h1>`
    }

    transporter.sendMail(mailOption, (err, info) => {
        if(err){
            return res.status(status.INTERNAL_SERVER).json({ message: `${err}` });
        }
        return res.status(status.OK).json({ message: `Success`, data: newUser });
    })
  } catch (error) {
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const authLogin = async (req, res, next) => {
  try {
    let { email, pass_word } = req.body;
    let user = await models.users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(status.CLIENT_ERR).json({ message: `Email is wrong` });
    }
    let checkPass = bcrypt.compareSync(pass_word, user.pass_word);

    if (!checkPass) {
      return res
        .status(status.CLIENT_ERR)
        .json({ message: `Password is wrong` });
    }

    let payload = {
      userID: user.user_id,
    };
    let accessToken = createToken(payload)
    return res.status(status.OK).json({
      message: `Log in succeed`,
      data: accessToken,
    });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const authLoginFB = async (req, res, nex) => {
  try {
    let { id, email, name } = req.body;
    let user = await models.users.findOne({
      where: {
        face_app_id: id,
      },
    });
    if (!user) {
      let newUser = {
        fullname: name,
        email,
        face_app_id: id,
      };
      user = await models.users.create(newUser);
    }
    let accessToken = createToken({userID: user.user_id})
    return res.status(status.OK).json({
        message: `Login successfully`,
        data: accessToken
    })
  } catch (error) {
    console.log(error);
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

export { authRegister, authLogin, authLoginFB };
