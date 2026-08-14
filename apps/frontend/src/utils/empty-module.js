module.exports = {};
module.exports.fetch = typeof fetch !== 'undefined' ? fetch : () => {};
module.exports.Headers = typeof Headers !== 'undefined' ? Headers : class {};
module.exports.Request = typeof Request !== 'undefined' ? Request : class {};
module.exports.Response = typeof Response !== 'undefined' ? Response : class {};
