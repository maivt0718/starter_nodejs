import pool from "../../db.js";
import { status } from "../../const.js";

const createUser = (req, res) => {
    let params = req.params
    let {id, hoten} = params

    res.send({id, hoten})
}

const getUser = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT *FROM users limit 1`)
        res.status(status.OK).json(data)
    } catch (error) {
        res.status(status.INTERNAL_SERVER).json({message: `${error}`})
    }
}

const deleteUser = async (req, res) => {
    try {
        let {user_id} = req.params
        const [data] = await pool.query(`DELETE FROM employees where user_id=${user_id}`)
        res.status(status.OK).json(data)
    } catch (error) {
        res.status(status.INTERNAL_SERVER).json({message: `${error}`})
    }
}


export {
    createUser, getUser, deleteUser
}

