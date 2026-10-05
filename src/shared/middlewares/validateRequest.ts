import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

export interface RequestValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Universal Request Validator Middleware (Zod)
 *
 * Supports both legacy single-schema validation on `req.body`:
 *   `validateRequest(myBodySchema)`
 *
 * And multi-segment schema validation across body, query and route params:
 *   `validateRequest({ body: myBodySchema, query: myQuerySchema, params: myParamSchema })`
 *
 * Sanitizes and replaces `req.body`, `req.query`, `req.params` with parsed/coerced values.
 */
export const validateRequest = (schemaOrConfig: ZodTypeAny | RequestValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (isZodSchema(schemaOrConfig)) {
        req.body = await schemaOrConfig.parseAsync(req.body);
      } else {
        const config = schemaOrConfig as RequestValidationSchema;
        if (config.params) {
          req.params = (await config.params.parseAsync(req.params)) as any;
        }
        if (config.query) {
          req.query = (await config.query.parseAsync(req.query)) as any;
        }
        if (config.body) {
          req.body = await config.body.parseAsync(req.body);
        }
      }
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};

function isZodSchema(target: unknown): target is ZodTypeAny {
  return (
    typeof target === 'object' &&
    target !== null &&
    ('safeParse' in target || 'parseAsync' in target)
  );
}
