'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const auth_1 = __importDefault(require('../middleware/auth'));
const admin_1 = __importDefault(require('../middleware/admin'));
const team_1 = require('../controllers/team');
const router = express_1.Router();
router
  .get('/', auth_1.default, team_1.viewTeams)
  .post('/', auth_1.default, admin_1.default, team_1.addTeam)
  .put('/:id', [auth_1.default, admin_1.default], team_1.editTeam)
  .delete('/:id', [auth_1.default, admin_1.default], team_1.removeTeam)
  .get('/search', team_1.searchTeam);
exports.default = router;
//# sourceMappingURL=teams.js.map
