// app/api/users/init/route.ts
import { NextResponse } from 'next/server';
import { user } from '@/lib/db/schema'; // Your updated schema with wallet_address
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { walletAddress, timestamp } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // First, check if user exists
    const existingUsers = await db
      .select()
      .from(user)
      .where(eq(user.wallet_address, walletAddress));
    
    // User exists
    if (existingUsers.length > 0) {
      // Update last login time
      await db
        .update(user)
        .set({ last_login: new Date(timestamp) })
        .where(eq(user.wallet_address, walletAddress));
      
      return NextResponse.json({
        message: 'User login recorded',
        userId: existingUsers[0].id,
        isNewUser: false
      });
    }
    
    // New user - create with wallet address
    const userId = uuidv4();
    await db.insert(user).values({
      id: userId,
      wallet_address: walletAddress,
      created_at: new Date(timestamp),
      last_login: new Date(timestamp),
    });
    
    return NextResponse.json({
      message: 'New user registered with wallet',
      userId: userId,
      isNewUser: true
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}