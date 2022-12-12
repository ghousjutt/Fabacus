const { TaskService } = require("../../services");

module.exports = async (req, res) => {
    return await TaskService.updateTask(req, res)
}