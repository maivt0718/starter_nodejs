import { status } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op, where } from "sequelize"; // AND, IN, LIKe, OR
import bcrypt from "bcrypt";
import transporter from "../../config/transporter.js";
import crypto from "crypto";
import speakeasy from "speakeasy";
import {
  createRefToken,
  createRefTokenAsyncKey,
  createToken,
  createTokenAsyncKey,
} from "../../config/jwt.js";
import { PrismaClient } from "@prisma/client";

const models = initModels(sequelize);
const prisma = new PrismaClient();

const authRegister = async (req, res, next) => {
  try {
    let { fullname, email, pass } = req.body;

    let user = await prisma.users.findFirst({
      where: { email },
    });

    if (user) {
      return res.status(status.FOUND).json(`User found`);
    }

    // create secret for 2MFA
    const secret = speakeasy.generateSecret({ length: 15 });

    const newUser = await prisma.users.create({
      data: {
        full_name: fullname,
        email: email,
        pass_word: bcrypt.hashSync(pass, 10),
        secret: secret.base32,
      },
    });
    // const mailOption = {
    //   from: "maivt0718@gmail.com",
    //   to: email,
    //   subject: "welcome to our services",
    //   text: `Hello ${fullname}`,
    //   html: `<h1>Ahhhihihihihihi</h1>`,
    // };

    // transporter.sendMail(mailOption, (err, info) => {
    //   if (err) {
    //     return res.status(status.INTERNAL_SERVER).json({ message: `${err}` });
    //   }
    //   return res.status(status.OK).json({ message: `Success`, data: newUser });
    // });
    return res.status(status.OK).json({ message: `Success`, data: newUser });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const authLogin = async (req, res, next) => {
  try {
    let { email, pass_word, code } = req.body;
    let user = await prisma.users.findFirst({
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

    const verified = speakeasy.totp.verify({
      secret : user.secret,
      encoding: 'base32',
      token: code,

    })

    if(!verified){
      return res
      .status(status.CLIENT_ERR)
      .json({ message: `Invalid 2FA` });
    }

    let payload = {
      userID: user.user_id,
    };

    let accessToken = createToken(payload);
    let refreshToken = createRefToken(payload);

    await prisma.users.update({
      data: {
        refresh_token: refreshToken,
      },
      where: {
        user_id: user.user_id,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cookie không thể truy cập từ javascript
      secure: false, // để chạy dưới localhost
      sameSite: "Lax", // để đảm bảo cookie được gửi trong các domain khác nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, //thời gian tồn tại cookie trong browser
    });
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
    let accessToken = createToken({ userID: user.user_id });
    return res.status(status.OK).json({
      message: `Login successfully`,
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const extendToken = async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(status.NOT_AUTHORISE).json({ message: `Unauthorised` });
  }

  let user = await models.users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) {
    return res.status(status.NOT_AUTHORISE).json({ message: `Unauthorised` });
  }

  // const newToken = createToken({ userId: user.user_id });

  const newToken = createTokenAsyncKey({ userId: user.user_id });
  return res.status(status.OK).json({ message: "Success", data: newToken });
};

const authAsyncKey = async (req, res, next) => {
  try {
    let { email, pass_word } = req.body;

    let user = await models.users.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is wrong" });
    }

    let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
    if (!checkPass) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    let payload = {
      userId: user.user_id,
    };
    // create async token
    // function sign jwt
    // param 1: create payload and attach into key
    // param 2: key to create token
    // param 3: setting lifetime  and its algorithm to create token
    let accessToken = createTokenAsyncKey(payload);
    // create refresh token và save to db
    let refreshToken = createRefTokenAsyncKey(payload);
    await models.users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: { user_id: user.user_id },
      }
    );

    // save refresh token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cookie cant be access by javascript
      secure: false, // to run with localhost
      sameSite: "Lax", // ensure to send in different domains
      maxAge: 7 * 24 * 60 * 60 * 1000, //lifetime of cookie in browser
    });

    return res.status(200).json({
      message: "Login successfully",
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    console.log(email);
    let checkEmail = await models.users.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      return res
        .status(status.CLIENT_ERR)
        .json({ message: `Wrong email: ${error}` });
    }

    let randomCode = crypto.randomBytes(5).toString("hex");
    await models.code.create({
      code: randomCode,
      expired: new Date(new Date().getTime() + 1 * 60 * 3600 * 1000),
    });

    const mailOption = {
      from: "maivt0718@gmail.com",
      to: email,
      subject: "Forget Password",
      text: `Your code to reset password`,
      html: `<h1>${randomCode}</h1>`,
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res
          .status(status.INTERNAL_SERVER)
          .json({ message: `Error sending email: ${err}` });
      }
      return res.status(status.OK).json({ message: `Please check your email` });
    });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER)
      .json({ message: `Error forgot password: ${error}` });
  }
};

const renewPassword = async (req, res, next) => {
  try {
    let { email, code, newPassword } = req.body;
    console.log(newPassword);
    let checkEmail = await models.users.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      return res
        .status(status.CLIENT_ERR)
        .json({ message: `Wrong email: ${error}` });
    }

    let checkCode = await models.code.findOne({
      where: {
        code,
      },
    });

    if (!checkCode) {
      return res.status(status.CLIENT_ERR).json({ message: `Wrong code` });
    }

    let checkExpire =
      new Date().getTime() - checkCode.expired < 1 * 60 * 3600 * 1000;

    if (checkExpire) {
      await models.code.destroy({
        where: {
          code,
        },
      });

      await models.users.update(
        {
          pass_word: await bcrypt.hash(newPassword, 10),
        },
        {
          where: {
            email: checkEmail.email,
          },
        }
      );
      return res.status(status.OK).json({ message: `Password changed` });
    }
  } catch (err) {
    return res
      .status(status.INTERNAL_SERVER)
      .json({ message: `Error renew password: ${err}` });
  }
};

export {
  authRegister,
  authLogin,
  authLoginFB,
  authAsyncKey,
  extendToken,
  forgotPassword,
  renewPassword,
};
