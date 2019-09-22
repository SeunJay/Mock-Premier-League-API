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
const fixture_1 = require('../controllers/fixture');
const router = express_1.Router();
router.get('/search', fixture_1.searchFixture);
router.get('/', auth_1.default, fixture_1.viewFixtures);
router.get('/pending', auth_1.default, fixture_1.viewPendingFixtures);
router.get('/completed', auth_1.default, fixture_1.viewCompletedFixtures);
router.get('/:id', auth_1.default, fixture_1.getFixture);
router.post('/', [auth_1.default, admin_1.default], fixture_1.addFixture);
router.put('/:id', [auth_1.default, admin_1.default], fixture_1.editFixture);
router.delete(
  '/:id',
  [auth_1.default, admin_1.default],
  fixture_1.removeFixture,
);
exports.default = router;
//# sourceMappingURL=fixtures.js.map
