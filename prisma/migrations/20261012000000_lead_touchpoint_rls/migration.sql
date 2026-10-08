-- RLS for LeadTouchpoint
ALTER TABLE "LeadTouchpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadTouchpoint" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "LeadTouchpoint" AS PERMISSIVE FOR ALL TO public
    USING ("organizationId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("organizationId" = current_setting('app.current_tenant_id', true));
