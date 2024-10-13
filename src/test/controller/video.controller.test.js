import sinon from "sinon";
import { expect } from "chai";
import initModels from "../../models/init-models.js";
import sequelize from "../../models/connect.js";
import { video } from "../../controllers/video.controller.js";

const model = initModels(sequelize)


describe(`getvideos`, () => {
    let req, res, findAllStub
    beforeEach(() =>{
        req =  {

        }
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }
        findAllStub = sinon.stub(model.video, 'findAll')
    })

    afterEach(() => {
        sinon.restore()
    })
    it(`return 200 and video lists`, async () => {
        const videos = [
            {
                "video_id": 1,
                "video_name": "Introduction to Coding",
                "thumbnail": "deadpool.jpg",
                "description": "Learn the basics of coding",
                "views": 1500,
                "source": "youtube.com",
                "user_id": 1,
                "type_id": 2
            },
            {
                "video_id": 2,
                "video_name": "Music Concert Highlights",
                "thumbnail": "deadpool.jpg",
                "description": "Highlights from a live music concert",
                "views": 800,
                "source": "vimeo.com",
                "user_id": 2,
                "type_id": 3
            },
            {
                "video_id": 3,
                "video_name": "Gaming Adventure Episode 1",
                "thumbnail": "deadpool.jpg",
                "description": "First episode of a gaming adventure",
                "views": 2500,
                "source": "twitch.tv",
                "user_id": 3,
                "type_id": 5
            },
            {
                "video_id": 4,
                "video_name": "Fashion Trends for Spring",
                "thumbnail": "deadpool.jpg",
                "description": "Latest fashion trends for the spring season",
                "views": 1200,
                "source": "instagram.com",
                "user_id": 4,
                "type_id": 7
            },
            {
                "video_id": 5,
                "video_name": "Introduction to Cryptocurrency",
                "thumbnail": "deadpool.jpg",
                "description": "Understanding the basics of cryptocurrency",
                "views": 300,
                "source": "youtube.com",
                "user_id": 5,
                "type_id": 9
            },
            {
                "video_id": 6,
                "video_name": "Full Stack Web Development Tutorial",
                "thumbnail": "http://res.cloudinary.com/dghvdbogx/image/upload/v1722343917/node43/qos3uy7t4tbdp5vknys0.jpg",
                "description": "Complete guide to full stack web development",
                "views": 1200,
                "source": "youtube.com",
                "user_id": 1,
                "type_id": 2
            },
            {
                "video_id": 7,
                "video_name": "Acoustic Guitar Performance",
                "thumbnail": "",
                "description": "Soulful acoustic guitar performance",
                "views": 650,
                "source": "vimeo.com",
                "user_id": 2,
                "type_id": 3
            },
            {
                "video_id": 8,
                "video_name": "Epic Gaming Moments Compilation",
                "thumbnail": "gaming_compilation.jpg",
                "description": "Compilation of epic gaming moments",
                "views": 3500,
                "source": "twitch.tv",
                "user_id": 3,
                "type_id": 5
            },
            {
                "video_id": 9,
                "video_name": "Fitness Workout Routine",
                "thumbnail": "fitness_workout.jpg",
                "description": "Effective fitness workout routine",
                "views": 900,
                "source": "instagram.com",
                "user_id": 4,
                "type_id": 8
            },
            {
                "video_id": 10,
                "video_name": "Understanding Blockchain",
                "thumbnail": "blockchain_technology.jpg",
                "description": "Exploring the concepts of blockchain",
                "views": 500,
                "source": "https://www.youtube.com/watch?v=CzXWhBjtRnU",
                "user_id": 5,
                "type_id": 9
            }
        ]

        findAllStub.resolves(videos)

        await video.getListVideo(req, res)
        expect(res.status.calledWith(200)).to.be.true
        expect(res.json.calledWith(videos)).to.be.true
    })
})