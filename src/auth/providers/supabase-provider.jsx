import { useEffect, useState } from 'react';
import { SupabaseAdapter } from '@/auth/adapters/supabase-adapter';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import { useLoginMutation } from "@/services/auth/authApi";


// Define the Supabase Auth Provider
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);


  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(currentUser?.is_admin === true);
  }, [currentUser]);

  const verify = async () => {
    if (auth) {
      try {
        const user = await getUser();

        console.log("got this current user: ", user);
        setCurrentUser(user || undefined);
        setAuth(user);
      } catch (error) {
        console.log(error);
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth?.token);
      authHelper.setUser(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email, password, recaptcha) => {
    try {
      const { data, status, message } = await loginMutation({ email, password, recaptcha }).unwrap();

      saveAuth(data);
      setCurrentUser(data || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const register = async (
    email,
    password,
    password_confirmation,
    firstName,
    lastName,
  ) => {
    try {
      const auth = await SupabaseAdapter.register(
        email,
        password,
        password_confirmation,
        firstName,
        lastName,
      );
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    await SupabaseAdapter.requestPasswordReset(email);
  };

  const resetPassword = async (password, password_confirmation) => {
    await SupabaseAdapter.resetPassword(password, password_confirmation);
  };

  const resendVerificationEmail = async (email) => {
    await SupabaseAdapter.resendVerificationEmail(email);
  };

  const getUser = async () => {
    return authHelper.getUser();
  };

  const updateProfile = async (userData) => {
    return await SupabaseAdapter.updateUserProfile(userData);
  };

  const logout = () => {
    SupabaseAdapter.logout();
    authHelper.removeAuth();
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
        getUser,
        updateProfile,
        logout,
        verify,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
