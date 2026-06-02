import { NextResponse } from 'next/server';
import { createServerSupabase, createUserSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
 try {
 const { password } = await request.json();
 
 if (!password || password.length < 6) {
 return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
 }

 // 1. Get the access token from Authorization header
 const authHeader = request.headers.get('Authorization');
 if (!authHeader || !authHeader.startsWith('Bearer ')) {
 return NextResponse.json({ error: 'Unauthorized: Missing or invalid access token.' }, { status: 401 });
 }
 const accessToken = authHeader.substring(7);

 // 2. Verify the access token by fetching the user
 const userClient = createUserSupabase(accessToken);
 const { data: { user }, error: userError } = await userClient.auth.getUser();

 if (userError || !user) {
 return NextResponse.json({ error: userError?.message || 'Unauthorized: Invalid access token.' }, { status: 401 });
 }

 const adminClient = createServerSupabase();

 // 3. Update password in Supabase Auth (via admin API)
 const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(user.id, {
 password: password
 });

 if (authUpdateError) {
 let errorMsg = authUpdateError.message;
 if (errorMsg.toLowerCase().includes("should be different")) {
 errorMsg = "Your new password must be different from your old password.";
 }
 return NextResponse.json({ error: errorMsg }, { status: 400 });
 }

 // 4. Update password in public.users table
 const { error: dbError } = await adminClient
 .from('users')
 .update({ password: password })
 .eq('id', user.id);

 if (dbError) {
 console.error('Failed to update password in public.users table:', dbError);
 }

 return NextResponse.json({ success: true, message: 'Password updated successfully!' });

 } catch (error: any) {
 console.error('Update password API error:', error);
 return NextResponse.json({ error: error?.message || 'Failed to update password.' }, { status: 500 });
 }
}
