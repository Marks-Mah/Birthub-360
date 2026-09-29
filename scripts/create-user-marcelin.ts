import { auth } from '../src/lib/auth.js';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: 'marcelinmark@gmail.com',
        password: process.env.ADMIN_INITIAL_PASSWORD || '00000000',
        name: 'Marcelin Mark',
      },
    });
    console.log('User created:', res);
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
