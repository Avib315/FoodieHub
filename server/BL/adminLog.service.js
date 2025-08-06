const adminLogController = require("../DL/controllers/adminLog.controller.js");
const ApiMessages = require("../common/apiMessages.js");

const validActions = [
    'user_blocked', 'user_unblocked', // 'user_deleted',
    'recipe_approved', 'recipe_rejected', 'recipe_deleted',
    'comment_added', 'comment_deleted',
    'settings_updated'
];
const validTargetTypes = ['user', 'recipe', 'comment', 'system'];

// Create a new admin log entry
async function createLog(data) {
    if (!data.action || !data.targetType) {
        return false;
        console.log(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (
        typeof data.action !== 'string' ||
        !validActions.includes(data.action) ||
        typeof data.targetType !== 'string' ||
        !validTargetTypes.includes(data.targetType) ||
        (data.targetId && !data.targetId.match(/^[0-9a-fA-F]{24}$/))
    ) {
        return false;
        console.log(ApiMessages.errorMessages.invalidData);
    }

    const result = await adminLogController.create(data);

    if (!result || !result._id) {
        return false;
        console.log(ApiMessages.errorMessages.creationFailed);
    }
    return result._id;
}

// Get all logs (optional filters via query)
async function getAllLogs(filters = {}) {
    if (Object.keys(filters).includes('action')) {
        if (!validActions.includes(filters.action) || filters.action === '') {
            return false;
            console.log(ApiMessages.errorMessages.invalidData);
        }
    }
    if (Object.keys(filters).includes('targetType')) {
        if (!validTargetTypes.includes(filters.targetType) || filters.targetType === '') {
            return false;
            console.log(ApiMessages.errorMessages.invalidData);
        }
    }
    if (Object.keys(filters).includes('targetId') && !filters.targetId.match(/^[0-9a-fA-F]{24}$/)) {
        return false;
        console.log(ApiMessages.errorMessages.invalidData);
    }

    const logs = await adminLogController.read(filters);

    if (!logs || logs.length === 0) {
        return false;
        console.log(ApiMessages.errorMessages.notFound);
    }
    return logs;
}

// Get logs by target type and target ID
async function getLogsByTarget(targetType, targetId) {
    if (targetType !== 'system') {
        if (!targetType || !targetId) {
            return false;
            console.log(ApiMessages.errorMessages.missingRequiredFields);
        }
        if (!targetId.match(/^[0-9a-fA-F]{24}$/) ||
            typeof targetType !== 'string' ||
            !validTargetTypes.includes(targetType)
        ) {
            return false;
            console.log(ApiMessages.errorMessages.invalidData);
        }
    }

    const logs = await adminLogController.read({ targetType, targetId });

    if (!logs || logs.length === 0) {
        return false;
        console.log(ApiMessages.errorMessages.notFound);
    }
    return logs;
}

module.exports = {
    createLog,
    getAllLogs,
    getLogsByTarget
};
