const adminLogController = require("../DL/controllers/adminLog.controller.js");
const ApiMessages = require("../common/apiMessages.js");

const validActions = [
    'user_blocked', 'user_unblocked', // 'user_deleted',
    'recipe_approved', 'recipe_rejected', 'recipe_deleted',
    // 'comment_added', 'comment_deleted',
    // 'settings_updated'
];
const validTargetTypes = ['user', 'recipe', 'comment', 'system'];

// Create a new admin log entry
async function createLog(data) {
    if (!data.action || !data.targetType) {
        console.log("createLog: Missing required fields: action or targetType");
        return false;
    }
    if (
        typeof data.action !== 'string' ||
        !validActions.includes(data.action) ||
        typeof data.targetType !== 'string' ||
        !validTargetTypes.includes(data.targetType) ||
        (data.targetId && !data.targetId.match(/^[0-9a-fA-F]{24}$/))
    ) {
        console.log("createLog: Invalid data format or values provided");
        return false;
        
    }

    const result = await adminLogController.create(data);

    if (!result || !result._id) {
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return result._id;
}

// Get all logs (optional filters via query)
async function getAllLogs(filters = {}) {
    if (Object.keys(filters).includes('action')) {
        if (!validActions.includes(filters.action) || filters.action === '') {
            console.log(ApiMessages.errorMessages.invalidData);
            return false;
            
        }
    }
    if (Object.keys(filters).includes('targetType')) {
        if (!validTargetTypes.includes(filters.targetType) || filters.targetType === '') {
            console.log(ApiMessages.errorMessages.invalidData);
            return false;
            
        }
    }
    if (Object.keys(filters).includes('targetId') && !filters.targetId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const logs = await adminLogController.read(filters);

    if (!logs || logs.length === 0) {
        console.log(ApiMessages.errorMessages.notFound);
        return false;
    }
    return logs;
}

// Get logs by target type and target ID
async function getLogsByTarget(targetType, targetId) {
    if (targetType !== 'system') {
        if (!targetType || !targetId) {
            console.log(ApiMessages.errorMessages.missingRequiredFields);
            return false;
        }
        if (!targetId.match(/^[0-9a-fA-F]{24}$/) ||
            typeof targetType !== 'string' ||
            !validTargetTypes.includes(targetType)
        ) {
            console.log(ApiMessages.errorMessages.invalidData);
            return false;
        }
    }

    const logs = await adminLogController.read({ targetType, targetId });

    if (!logs || logs.length === 0) {
        console.log(ApiMessages.errorMessages.notFound);
        return false;
    }
    return logs;
}

module.exports = {
    createLog,
    getAllLogs,
    getLogsByTarget
};
