import { Router } from 'express';

// Modular child routers
import {
  authRouter,
  hashPassword,
  verifyHashedPassword,
  normalizeCompany,
  SCRYPT_PREFIX,
} from './routes/auth.routes.js';
import { systemRouter } from './routes/system.routes.js';
import { campaignsRouter } from './routes/campaigns.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { chatRouter } from './routes/chat.routes.js';
import { integrationsRouter } from './routes/integrations.routes.js';
import { leadsRouter } from './routes/leads.routes.js';

// Utilities & Services
import {
  formatLeadRow,
  validateChangedLeadFields,
  upsertMessageWithVersioning,
} from './utils/formatLead.js';
import {
  findLeads,
  enrichLeadWithApollo,
  resolveCnpjWithResilience,
  cleanDomain,
  cleanDomainForCache,
  slugify,
  normalizeLinkedInUrl,
  APOLLO_PREFERRED_TITLES,
} from './services/leadSearch.service.js';
import { attachUser } from './auth.js';

// Re-exports for backwards compatibility
export { formatLeadRow, validateChangedLeadFields, upsertMessageWithVersioning };
export {
  findLeads,
  enrichLeadWithApollo,
  resolveCnpjWithResilience,
  cleanDomain,
  cleanDomainForCache,
  slugify,
  normalizeLinkedInUrl,
  APOLLO_PREFERRED_TITLES,
};
export { hashPassword, verifyHashedPassword, normalizeCompany, SCRYPT_PREFIX };

export const apiRouter = Router();

// Auth & RBAC: popula req.outboundUser a partir do cookie de sessão assinado
apiRouter.use(attachUser);

// Mount modular sub-routers
apiRouter.use(authRouter);
apiRouter.use(systemRouter);
apiRouter.use(campaignsRouter);
apiRouter.use(tasksRouter);
apiRouter.use(chatRouter);
apiRouter.use(integrationsRouter);
apiRouter.use(leadsRouter);
