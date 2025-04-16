
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Profile = {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, username: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log("Auth state changed:", event, currentSession?.user?.id);
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Fetch profile data if user is authenticated
          if (currentSession?.user) {
            setTimeout(() => fetchProfile(currentSession.user.id), 0);
          } else {
            setProfile(null);
          }
        }
      );
      
      // THEN check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data as Profile);
    } catch (error) {
      console.error('Exception fetching profile:', error);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error('Sign in error:', response.error);
        toast(`خطأ في تسجيل الدخول: ${response.error.message}`);
      } else if (response.data.user) {
        toast(`تم تسجيل الدخول بنجاح! مرحباً بك`);
      }
      
      return response;
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      toast(`خطأ غير متوقع: ${error.message}`);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, username: string) => {
    try {
      // First, create the auth user
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            first_name: null,
            last_name: null,
            avatar_url: null
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (response.error) {
        console.error('Sign up error:', response.error);
        toast(`خطأ في إنشاء الحساب: ${response.error.message}`);
        return response;
      }
      
      if (response.data.user) {
        console.log('User created successfully, creating profile');
        
        // Manually create a profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: response.data.user.id,
              username: username,
              first_name: null,
              last_name: null,
              avatar_url: null,
              is_admin: false
            }
          ]);
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast(`تم إنشاء الحساب ولكن حدث خطأ في إنشاء الملف الشخصي: ${profileError.message}`);
        } else {
          console.log('Profile created successfully');
          toast(`تم إنشاء الحساب بنجاح!`);
          
          // Sign in the user immediately after successful registration
          await signIn(email, password);
        }
      }
      
      return response;
    } catch (error: any) {
      console.error('Exception during sign up:', error);
      toast(`خطأ غير متوقع: ${error.message}`);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast(`تم تسجيل الخروج بنجاح`);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast(`خطأ في تسجيل الخروج: ${error.message}`);
    }
  };
  
  const value = {
    session,
    user,
    profile,
    isAdmin: profile?.is_admin || false,
    isLoading,
    signIn,
    signUp,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
