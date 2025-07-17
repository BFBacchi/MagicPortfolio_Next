'use client';

import { useState, useEffect } from 'react';
import { Button, Flex, Text, Column, Input, Line } from '@once-ui-system/core';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthButtonProps {
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  onLanguageChange, 
  currentLanguage = 'es' 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          setShowLogin(false);
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    onLanguageChange?.(language);
  };

  return (
    <Flex gap="s" vertical="center">
      {/* Language Selector */}
      <Flex gap="xs" vertical="center">
        <Button
          variant={language === 'es' ? 'primary' : 'secondary'}
          size="s"
          onClick={() => setLanguage('es')}
          disabled={loading}
        >
          ES
        </Button>
        <Button
          variant={language === 'en' ? 'primary' : 'secondary'}
          size="s"
          onClick={() => setLanguage('en')}
          disabled={loading}
        >
          EN
        </Button>
      </Flex>

      <Line background="neutral-alpha-medium" vert maxHeight="24" />

      {/* Auth Button */}
      {user ? (
        <Flex gap="s" vertical="center">
          <Text variant="body-default-s" onBackground="neutral-strong">
            {user.email}
          </Text>
          <Button
            variant="secondary"
            size="s"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? '...' : t('logout')}
          </Button>
        </Flex>
      ) : (
        <Button
          variant="primary"
          size="s"
          onClick={() => setShowLogin(!showLogin)}
          disabled={loading}
        >
          {t('login')}
        </Button>
      )}

      {/* Login Modal */}
      {showLogin && (
        <>
          {/* Fondo semitransparente */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowLogin(false)}
          />
          {/* Modal centrado */}
          <Column
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Column
              background="surface"
              border="neutral-alpha-weak"
              radius="m"
              shadow="l"
              padding="xl"
              gap="l"
              minWidth={0}
              maxWidth={216}
              style={{ pointerEvents: 'auto', boxSizing: 'border-box', width: '54vw' }}
              onClick={e => e.stopPropagation()}
            >
              <Text variant="body-default-m" onBackground="neutral-strong">
                {t('login')}
              </Text>
              <Column gap="s">
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  errorMessage={error}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Column>
              <Button
                variant="primary"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? t('loading') : t('login')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowLogin(false)}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
            </Column>
          </Column>
        </>
      )}
    </Flex>
  );
}; 