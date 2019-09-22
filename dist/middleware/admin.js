'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
//@ts-ignore
function admin(req, res, next) {
  //@ts-ignore
  if (!req['user'].isAdmin) {
    return res.status(403).send({
      data: { message: 'You do not have permission to perform this action' },
    });
  }
  next();
}
exports.default = admin;
//# sourceMappingURL=admin.js.map
