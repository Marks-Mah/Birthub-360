import { Pool } from 'pg';
import { hashPassword } from 'better-auth/crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  await client.query(`SELECT set_config('app.bypass_rls', 'on', FALSE);`);

  console.log('Buscando usuário...');
  const hash = await hashPassword('00000000');
  
  // Forçar verificação de email e reset de senha para TODAS as contas com esse email
  const updateRes = await client.query(
    `UPDATE "user" SET "emailVerified" = true, "passwordHash" = $1 WHERE email = 'marcelinmark@gmail.com'`,
    [hash]
  );
  console.log('Linhas atualizadas:', updateRes.rowCount);

  if (updateRes.rowCount === 0) {
     console.log('Usuário não encontrado, recriando...');
     // Recria caso não exista
     const { randomUUID } = await import('crypto');
     const orgId = randomUUID();
     await client.query(
       `INSERT INTO "Organization" (id, name, "createdAt", "updatedAt") VALUES ($1, 'Birth Hub 360 - Admin', NOW(), NOW())`,
       [orgId]
     );
     const userId = randomUUID();
     await client.query(
       `INSERT INTO "user" (id, email, name, "emailVerified", role, "passwordHash", "organizationId", "createdAt", "updatedAt")
        VALUES ($1, 'marcelinmark@gmail.com', 'Marcelin Mark', true, 'ADMIN', $2, $3, NOW(), NOW())`,
       [userId, hash, orgId]
     );
     console.log('Usuário criado do zero!');
  }

  const users = await client.query(`SELECT id, email, name, "emailVerified", role, "organizationId" FROM "user" WHERE email = 'marcelinmark@gmail.com'`);
  console.log('Status atual no banco:', users.rows);

  client.release();
  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
