const { TaskService } = require("../../services");

module.exports = async (req, res) => {
    return await TaskService.createTask(req, res)
}