import pool from "../../db.js";
import { status } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize"; // AND, IN, LIKe, Or

const models = initModels(sequelize);

const createUser = async (req, res) => {
  // let params = req.params
  // let {id, hoten} = params

  // res.send({id, hoten})
  try {
    const { full_name, email, pass_word } = req.body;
    let newUser = await models.users.create({
      full_name,
      email,
      pass_word,
    });
    res.status(status.OK).json(newUser);
  } catch (error) {
    res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const getUser = async (req, res) => {
  try {
    // const [data] = await pool.query(`SELECT *FROM users limit 1`)
    let { full_name = "" } = req.query;
    let data = await models.users.findAll({
      where: {
        full_name: {
          [Op.like]: `%${full_name}%`,
        },
      },
      include: [
        {
          model: models.video,
          as: "videos",
          attributes: ["video_name", "description"],
          required: true,
          include: [
            {
              model: models.video_comment,
              as: "video_comments",
              attributes: ["content"],
            },
          ],
        },
      ],
    });
    res.status(status.OK).json(data);
  } catch (error) {
    res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    let { user_id } = req.params;
    // const [data] = await pool.query(
    //   `DELETE FROM employees where user_id=${user_id}`
    // );

    let user = await models.users.findOne({
      where: { user_id },
    });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "User not found" });
    } else {
      user.destroy();
      return res.status(status.OK).json({ message: "User deleted" });
    }
  } catch (error) {
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    let user = await models.users.findOne({
      where: { user_id },
    });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "User not found" });
    }

    // let data = await models.users.update(
    //   { full_name, pass_word },
    //   {
    //     where: { user_id },
    //   }
    // );

    const { full_name, pass_word } = req.body;

    user.full_name = full_name || user.full_name
    user.pass_word = pass_word || user.pass_word
    await user.save()
    return res.status(status.OK).json(user);
  } catch (error) {
    return res.status(status.INTERNAL_SERVER).json({ message: `${error}` });
  }
};

export { createUser, getUser, deleteUser, updateUser };
