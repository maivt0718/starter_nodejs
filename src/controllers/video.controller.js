import pool from "../../db.js";
import { status } from "../../const.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op, where } from "sequelize"; // AND, IN, LIKe, OR

const models = initModels(sequelize);

const video = {
    getListVideo: async(req, res) => {
        try {
            let data = await models.video.findAll()
            return res.status(status.OK).json(data)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER).json({message: `${error}`})
        }
    },

    getvideoType: async (req, res) => {
        try {
            let data = await models.video_type.findAll()
            return res.status(status.OK).json(data)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER).json({message: `${error}`})
        }
    },
    getListVideoByID: async (req, res) =>{
        try {
            let {typeId} = req.params
            let data = await models.video.findAll({
                where:{
                    type_id: typeId
                }
            })
            return res.status(status.OK).json(data)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER).json({message: `${error}`})
        }
    },
    getVideoPage: async(req, res) => {
        try {
            let {page, size} = req.params
            page = parseInt(page, 10)
            size = parseInt(size, 10)

            if (isNaN(page) || page<0 || isNaN(size) || size<0){
                return res.status(400).json({message: `Page or size is wrong`})
            }

            let index = (page - 1) *size
            let data = await models.video.findAll({
                offset: index,
                limit: size
            })
            return res.status(status.OK).json(data)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER).json({message: `${error}`})
        }
    }
}

export {video}