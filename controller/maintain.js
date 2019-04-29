/**
 * Created by GFY on 2019-04-20.
 * 维修单接口
 */
const express = require('express')
const router  = express.Router()

const maintainModel = require('../model/maintain')
const repairModel = require('../model/repair')
let {getTimeNum} = require('../utils/public')

/**
 * 接单
 */
router.post('/takeOrder', async (req, res, next) => {
    try {
        let {user, id} = req.body
        let repair = await repairModel.findOne({_id: id})
        if (repair.status === 3) {
            res.json({
                code: 200,
                msg: '来晚了一步，订单已被接收',
            })
        } else {
            let timeNum = getTimeNum()
            let count = await maintainModel.find().count()
            count = count < 10 ? `00${count}` : (count < 100 ? `0${count}` : count)
            let code = `WX${timeNum}${count}`
            await repairModel.update({_id: id},{status: 3, maintainCode: code})
            let maintain = await maintainModel.create({code,user,repairsId: id})
            res.json({
                code: 200,
                msg: '接单成功',
                data: maintain
            })
        }
    } catch (e) {
        next(e)
    }
})
/**
 * 获取维修单
 */

module.exports = router