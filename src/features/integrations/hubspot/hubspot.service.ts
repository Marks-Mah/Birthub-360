/**
 * HubSpot Integration Service
 *
 * Stub para gerenciar:
 * 1. OAuth 2.0 flow (geração de URL de consentimento, troca de código por token, refresh).
 * 2. Mapeamento de funil (deal stages, pipelines).
 * 3. Writeback (atualizar Birth Hub a partir de webhooks do HubSpot).
 */

import { logger } from '../../../lib/logger.js';
import { prisma } from '../../../lib/prisma.js';

export interface HubSpotOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export const HubspotService = {
  /**
   * Gera a URL de autorização OAuth para o usuário conectar o HubSpot.
   */
  getOAuthConsentUrl(organizationId: string): string {
    logger.info({ organizationId }, '[hubspot] Gerando URL de consentimento OAuth');

    const clientId = process.env.HUBSPOT_CLIENT_ID || 'STUB_CLIENT_ID';
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI || 'STUB_REDIRECT_URI';
    const scope = encodeURIComponent(
      'crm.objects.contacts.read crm.objects.contacts.write crm.objects.deals.read crm.objects.deals.write',
    );
    const state = encodeURIComponent(JSON.stringify({ organizationId }));

    return `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  },

  /**
   * Troca o auth code do callback por access e refresh tokens.
   */
  async exchangeCodeForTokens(organizationId: string, code: string): Promise<void> {
    logger.info({ organizationId, code }, '[hubspot] Trocando auth code por tokens');

    const clientId = process.env.HUBSPOT_CLIENT_ID || 'STUB_CLIENT_ID';
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET || 'STUB_CLIENT_SECRET';
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI || 'STUB_REDIRECT_URI';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro ao trocar código por token HubSpot: ${err}`);
    }

    const data = await response.json();

    const config = JSON.stringify({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    });

    const existing = await prisma.externalCrmConnection.findFirst({
      where: { organizationId, provider: 'hubspot' },
    });

    if (existing) {
      await prisma.externalCrmConnection.update({
        where: { id: existing.id },
        data: { config },
      });
    } else {
      await prisma.externalCrmConnection.create({
        data: {
          organizationId,
          provider: 'hubspot',
          label: 'HubSpot',
          config,
        },
      });
    }
  },

  /**
   * Mapeamento de funil: recupera pipelines e stages para mapear com o Birth Hub.
   */
  async getPipelinesAndStages(connectionId: string): Promise<any[]> {
    logger.info({ connectionId }, '[hubspot] Recuperando pipelines e stages');

    const connection = await prisma.externalCrmConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Conexão HubSpot não encontrada');
    }

    const config = JSON.parse(connection.config);
    if (!config.accessToken) {
      throw new Error('Conexão HubSpot sem accessToken');
    }

    const response = await fetch('https://api.hubapi.com/crm/v3/pipelines/deals', {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro ao buscar pipelines do HubSpot: ${err}`);
    }

    const data = await response.json();
    return data.results || [];
  },

  /**
   * Writeback: processa payload de webhook do HubSpot.
   */
  async handleWebhookWriteback(payload: any): Promise<void> {
    logger.info({ payload }, '[hubspot] Recebido webhook do HubSpot');

    if (Array.isArray(payload)) {
      for (const event of payload) {
        logger.info(
          { eventId: event.eventId, type: event.subscriptionType },
          '[hubspot] Processando evento webhook',
        );
        // A lógica específica de mapeamento de dealstage ou contato vai aqui
      }
    }
  },

  /**
   * Sincroniza um Lead do Birth Hub como um Deal no HubSpot (v3 API).
   */
  async syncLeadToDeal(
    connectionId: string,
    leadData: {
      dealname: string;
      amount?: number;
      pipeline: string;
      dealstage: string;
      contactId?: string;
    },
  ): Promise<any> {
    logger.info(
      { connectionId, dealname: leadData.dealname },
      '[hubspot] Sincronizando Lead como Deal no HubSpot',
    );

    const connection = await prisma.externalCrmConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new Error('Conexão HubSpot não encontrada');
    }

    const config = JSON.parse(connection.config);
    if (!config.accessToken) {
      throw new Error('Conexão HubSpot sem accessToken');
    }

    const properties: any = {
      dealname: leadData.dealname,
      pipeline: leadData.pipeline,
      dealstage: leadData.dealstage,
    };

    if (leadData.amount !== undefined) {
      properties.amount = leadData.amount.toString();
    }

    const payload: any = {
      properties,
    };

    // Associa ao contato se o contactId for fornecido
    if (leadData.contactId) {
      payload.associations = [
        {
          to: { id: leadData.contactId },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 3, // 3 is usually deal_to_contact
            },
          ],
        },
      ];
    }

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      logger.error({ err }, '[hubspot] Erro ao criar Deal no HubSpot');
      throw new Error(`Erro ao criar Deal no HubSpot: ${err}`);
    }

    const data = await response.json();
    return data;
  },
};
