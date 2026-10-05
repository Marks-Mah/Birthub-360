import { auth } from '../src/lib/auth.js';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  try {
    const email = `audit-temp-${Date.now()}@birthhub360.internal`;
    const password = 'AuditTemp123!';

    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: 'Audit Temp User',
      },
    });

    console.log('User created:', JSON.stringify({ email, password }, null, 2));
    console.log('COPY THESE CREDENTIALS FOR THE AUDIT:');
    console.log(`EMAIL: ${email}`);
    console.log(`PASSWORD: ${password}`);
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
