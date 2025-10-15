'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Flex, Text, Column, Input, Line, Icon } from '@once-ui-system/core';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './AuthButton.module.scss';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
    setShowUserMenu(false);
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
          className="auth-button"
        >
          ES
        </Button>
        <Button
          variant={language === 'en' ? 'primary' : 'secondary'}
          size="s"
          onClick={() => setLanguage('en')}
          disabled={loading}
          className="auth-button"
        >
          EN
        </Button>
      </Flex>

      <Line background="neutral-alpha-medium" vert maxHeight="24" />

      {/* Auth Button */}
      {user ? (
        <div ref={userMenuRef} className={styles.userMenuContainer}>
          <Button
            variant="secondary"
            size="s"
            onClick={() => setShowUserMenu(!showUserMenu)}
            disabled={loading}
            className={styles.userButton}
          >
            <Text variant="body-default-s" onBackground="neutral-strong">
              {user.email}
            </Text>
            <Icon 
              name={showUserMenu ? "chevron-up" : "chevron-down"} 
              size="s" 
              onBackground="neutral-strong" 
            />
          </Button>
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <Column
              className={styles.dropdownMenu}
              background="surface"
              border="neutral-alpha-weak"
              radius="m"
              shadow="l"
              padding="s"
              gap="xs"
            >
              <Button
                variant="tertiary"
                size="s"
                onClick={handleLogout}
                disabled={loading}
                className={styles.logoutButton}
              >
                <Icon name="logout" size="s" />
                {loading ? '...' : t('logout')}
              </Button>
            </Column>
          )}
        </div>
      ) : (
        <Button
          variant="primary"
          size="s"
          onClick={() => setShowLogin(!showLogin)}
          disabled={loading}
          className="auth-button"
        >
          {t('login')}
        </Button>
      )}

      {/* Login Modal */}
      {showLogin && (
        <>
          {/* Fondo semitransparente */}
          <div
            className={styles.modalOverlay}
            onClick={() => setShowLogin(false)}
          />
          {/* Modal centrado */}
          <Column className={styles.modalContainer}>
            <Column
              background="surface"
              border="neutral-alpha-weak"
              radius="m"
              shadow="l"
              padding="xl"
              gap="l"
              minWidth={0}
              maxWidth={216}
              className={styles.modalContent}
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