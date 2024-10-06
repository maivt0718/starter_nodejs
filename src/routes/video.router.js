import express from 'express'
import { video } from '../controllers/video.controller.js'
import { middlewareToken, middlewareTokenAsyncKey } from '../../config/jwt.js'

const videoRouter = express.Router()
videoRouter.get("/getAllVideos", video.getListVideo)
videoRouter.get("/getListVideos/:typeId", video.getListVideoByID)
videoRouter.get("/getVideosType/",middlewareTokenAsyncKey, video.getvideoType)
videoRouter.get(`/getVideoPage/:page/:size`, video.getVideoPage)

export default videoRouter