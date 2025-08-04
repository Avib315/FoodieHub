const adminLogController = require("../DL/controllers/adminLog.controller.js");
const ApiMessages = require("../common/apiMessages.js");

// Create a new admin log entry
async function createLog(data) {
    try {
        if (!data.adminId || !data.action || !data.targetType) {
            return { success: false, message: ApiMessages.errorMessages.requiredField };
        }
        const result = await adminLogController.create(data);
        return { success: true, data: result };
    } catch (error) {
        console.error("Service - createLog error:", error);
        throw error;
    }
}

// Get all logs (optional filters via query)
async function getAllLogs(filters = {}) {
    try {
        const logs = await adminLogController.read(filters);
        return { success: true, data: logs };
    } catch (error) {
        console.error("Service - getAllLogs error:", error);
        throw error;
    }
}

// Get logs by adminId
async function getLogsByAdminId(adminId) {
    try {
        if (!adminId.match(/^[0-9a-fA-F]{24}$/)) {
            return { success: false, message: ApiMessages.errorMessages.badRequest };
        }

        const logs = await adminLogController.read({ adminId });
        return { success: true, data: logs };
    } catch (error) {
        console.error("Service - getLogsByAdminId error:", error);
        throw error;
    }
}

// Get logs by target type and target ID
async function getLogsByTarget(targetType, targetId) {
    try {
        if (!targetId.match(/^[0-9a-fA-F]{24}$/)) {
            return { success: false, message: ApiMessages.errorMessages.badRequest };
        }

        const logs = await adminLogController.read({ targetType, targetId });
        return { success: true, data: logs };
    } catch (error) {
        console.error("Service - getLogsByTarget error:", error);
        throw error;
    }
}

module.exports = {
    createLog,
    getAllLogs,
    getLogsByAdminId,
    getLogsByTarget
};
