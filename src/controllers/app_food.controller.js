import initModelsAppFood from "../models/app_food/init-models.js";
import sequelizeAppFood from "../models/app_food/connect.js";
import like_res from "../models/app_food/like_res.js";
import { status } from "../../const.js";
import { DataTypes } from "sequelize";
import rate_res from "../models/app_food/rate_res.js";

const models = initModelsAppFood(sequelizeAppFood);

export const app_food_controller = {
  likeProcessingByRestaurant: async (req, res, next) => {
    try {
      let res_list = await models.restarant.findAll({
        attributes: {
          include: [
            [
              sequelizeAppFood.fn(
                "COUNT",
                sequelizeAppFood.col("like_res.res_id")
              ),
              "like_count",
            ],
          ],
        },
        include: [
          {
            model: like_res,
            as: "like_res",
            attributes: [],
            required: true,
          },
        ],
        group: ["restarant.res_id"],
      });
      return res.status(status.OK).json({ res_list });
    } catch (err) {
      return res.status(status.INTERNAL_SERVER).json({ message: err });
    }
  },

  likeProcessingByUser: async (req, res, next) => {
    try {
      let user_list = await models.users.findAll({
        attributes: {
          include: [
            [
              sequelizeAppFood.fn(
                "COUNT",
                sequelizeAppFood.col("like_res.user_id")
              ),
              "like_count",
            ],
          ],
        },
        include: [
          {
            model: like_res,
            attributes: [],
            required: true,
            as: "like_res",
          },
        ],
        group: ["users.user_id"],
      });
      return res.status(status.OK).json({ user_list });
    } catch (err) {
      return res.status(status.INTERNAL_SERVER).json({ message: err });
    }
  },
  DislikeByUser: async (req, res, next) => {
    try {
      let users = await models.users.findAll({
        include: [
          {
            model: like_res,
            required: false,
            as: "like_res",
          },
        ],
        where: {
          "$like_res.user_id$": null,
        },
      });
      return res.status(status.OK).json({ users });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER).json({ message: error });
    }
  },
  updateFeedback: async (req, res, next) => {
    let { user_id, res_id } = req.body;

    // sequelizeAppFood
    //   .getQueryInterface()
    //   .describeTable("rate_res")
    //   .then((res) => {
    //     if (!res["feedback"]) {
    //       sequelizeAppFood
    //         .getQueryInterface()
    //         .addColumn("rate_res", "feedback", {
    //           type: DataTypes.STRING,
    //           allowNull: true,
    //           defaultValue: ''
    //         });

    //         sequelizeAppFood.sync()
    //     }
    //   })
    //   .catch((err) => {
    //     return res.status(status.INTERNAL_SERVER).json({ message: err });
    //   });

    let check = await models.rate_res.findOne({
      where: {
        user_id,
        res_id,
      },
    });

    if (check) {
      try {
        await models.rate_res.update(
          {
            amount: check.amount + 1,
          },
          {
            where: {
              rate_res_id: check.rate_res_id,
            },
          }
        );

        return res.status(status.OK).json({ message: "Succeed" });
      } catch (error) {
        return res.status(status.INTERNAL_SERVER).json({ message: error });
      }
    } else {
      try {
        let update_feedback = await models.rate_res.create({
          user_id,
          res_id,
          amount: 1,
        });
        return res.status(status.OK).json({ update_feedback });
      } catch (error) {
        return res.status(status.INTERNAL_SERVER).json({ message: error });
      }
    }
  },
  getListResRate: async (req, res, next) => {
    try {
      let res_list = await models.restarant.findAll({
        attributes: {
          include: [
            [
              sequelizeAppFood.fn(
                "COUNT",
                sequelizeAppFood.col("rate_res.user_id")
              ),
              "rate_count",
            ],
          ],
        },
        include: [
          {
            model: rate_res,
            attributes: [],
            required: true,
            as: "rate_res",
          },
        ],
        group: ["restarant.res_id"],
      });
      return res.status(status.OK).json({ res_list });
    } catch (err) {
      return res.status(status.INTERNAL_SERVER).json({ message: err });
    }
  },
  getListRatebyUser: async (req, res, next) => {
    try {
      let user_list = await models.users.findAll({
        attributes: {
          include: [
            [
              sequelizeAppFood.fn(
                "COUNT",
                sequelizeAppFood.col("rate_res.user_id")
              ),
              "rate_count",
            ],
          ],
        },
        include: [
          {
            model: rate_res,
            attributes: [],
            required: true,
            as: "rate_res",
          },
        ],
        group: ["users.user_id"],
      });
      return res.status(status.OK).json({ user_list });
    } catch (err) {
      return res.status(status.INTERNAL_SERVER).json({ message: err });
    }
  },
  addFood: async (req, res, next) => {
    let { user_id, food_id, sub_id } = req.body;

    let checkOrder = await models.orders.findOne({
      where: {
        user_id,
        food_id,
      },
    });

    if (checkOrder) {
      let amount_incr = 0;
      let arr_sub_id_list = checkOrder.arr_sub_id.split(",");

      sub_id.map((food_id) => {
        if (food_id != checkOrder.food_id) {
          arr_sub_id_list.push(food_id);
        } else {
          amount_incr += 1;
        }
      });
      try {
        await models.orders.update(
          {
            amount: checkOrder.amount + amount_incr,
            arr_sub_id: arr_sub_id_list.toString(),
          },
          {
            where: {
              order_id: checkOrder.order_id,
            },
          }
        );
        return res.status(status.OK).json({ message: "Succeed" });
      } catch (error) {
        return res.status(status.INTERNAL_SERVER).json({ message: error });
      }
    } else {
      try {
        await models.orders.create({
          user_id,
          food_id,
          amount: 1,
          arr_sub_id: sub_id.toString(),
        });
        return res.status(status.OK).json({ message: "Succeed" });
      } catch (error) {
        return res.status(status.INTERNAL_SERVER).json({ message: error });
      }
    }
  },
};
