import { Router } from 'express';
import { requireAuth } from '../../../shared/middlewares/requireAuth.js';
import { requireRole } from '../../../shared/middlewares/requireRole.js';
import { organizationModulesService } from '../services/organizationModules.service.js';
import type { ProductModuleKey } from '../../../config/product-modules.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// GET /api/organization-modules/active
router.get('/active', async (req, res, next) => {
  try {
    const orgId = req.user!.organizationId;
    const modules = await organizationModulesService.listActiveModules(orgId);
    res.json({ activeModules: modules });
  } catch (error) {
    next(error);
  }
});

// GET /api/organization-modules/onboarding/status
router.get('/onboarding/status', async (req, res, next) => {
  try {
    const orgId = req.user!.organizationId;
    const pending = await organizationModulesService.isOnboardingPending(orgId);
    res.json({ status: pending ? 'pending' : 'completed' });
  } catch (error) {
    next(error);
  }
});

// Daqui em diante, apenas ADMIN
router.use(requireRole(['ADMIN']));

// POST /api/organization-modules/onboarding/complete
router.post('/onboarding/complete', async (req, res, next) => {
  try {
    const orgId = req.user!.organizationId;
    await organizationModulesService.completeOnboarding(orgId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /api/organization-modules/:key
router.post('/:key', async (req, res, next) => {
  try {
    const orgId = req.user!.organizationId;
    const adminId = req.user!.id;
    const moduleKey = req.params.key as ProductModuleKey;

    await organizationModulesService.activateModule(orgId, moduleKey, adminId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/organization-modules/:key
router.delete('/:key', async (req, res, next) => {
  try {
    const orgId = req.user!.organizationId;
    const moduleKey = req.params.key as ProductModuleKey;

    await organizationModulesService.deactivateModule(orgId, moduleKey);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { router as organizationModulesRoutes };
