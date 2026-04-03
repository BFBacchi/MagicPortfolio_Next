'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Flex, 
  Text, 
  Column, 
  Input, 
  Line, 
  Icon, 
  Dialog,
  Heading,
  Feedback,
  Kbd
} from '@once-ui-system/core';
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
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;

    setEmailError(
      isEmailValid || email === "" ? null : t("auth.email_invalid")
    );
    setPasswordError(
      isPasswordValid || password === "" ? null : t("auth.password_min")
    );
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password, language, t]);

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
        if (event === "SIGNED_IN") {
          setShowLogin(false);
          setError(null);
          setSuccess(t("auth.welcome"));
          // Limpiar formulario
          setEmail('');
          setPassword('');
          setEmailError(null);
          setPasswordError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [t]);

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
    if (!isFormValid) {
      setError(t("auth.fix_form"));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Mejorar mensajes de error
        if (error.message.includes("Invalid login credentials")) {
          setError(t("auth.invalid_credentials"));
        } else if (error.message.includes("Email not confirmed")) {
          setError(t("auth.confirm_email"));
        } else {
          setError(error.message);
        }
      }
    } catch {
      setError(t("auth.connection_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleLogin();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setShowUserMenu(false);
    try {
      await supabase.auth.signOut();
      setSuccess(t("logout_success"));
    } catch {
      setError(t("auth.logout_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowLogin(false);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setEmailError(null);
    setPasswordError(null);
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
          <Flex gap="xs" vertical="center">
            <Icon name="login" size="s" />
            {t('login')}
          </Flex>
        </Button>
      )}

      {/* Login Modal */}
      <Dialog
        isOpen={showLogin}
        onClose={handleCloseModal}
        title={t("auth.dialog_title")}
        description={t("auth.dialog_desc")}
      >
        <Column gap="l" padding="l">
          {/* Mensajes de estado */}
          {error && (
            <Feedback variant="danger" title={t("auth.error_title")}>
              {error}
            </Feedback>
          )}

          {success && (
            <Feedback variant="success" title={t("auth.success_title")}>
              {success}
            </Feedback>
          )}

          {/* Formulario */}
          <Column gap="m">
            <Input
              id="email"
              label={t("email")}
              type="email"
              description="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              errorMessage={emailError}
              disabled={loading}
              required
            />
            
            <Input
              id="password"
              label={t("password")}
              type="password"
              description={t("auth.password_desc")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              errorMessage={passwordError}
              disabled={loading}
              required
            />
          </Column>

          {/* Botones */}
          <Flex gap="s" fillWidth>
            <Button
              variant="primary"
              onClick={handleLogin}
              disabled={!isFormValid || loading}
              fillWidth
            >
              {loading ? (
                <Flex gap="xs" vertical="center">
                  <Icon name="loader" size="s" />
                  {t("auth.signing_in")}
                </Flex>
              ) : (
                <Flex gap="xs" vertical="center">
                  <Icon name="login" size="s" />
                  {t("auth.sign_in")}
                </Flex>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
          </Flex>

          {/* Atajos de teclado */}
          <Flex gap="xs" vertical="center" horizontal="center">
            <Text variant="body-default-xs" onBackground="neutral-medium">
              {t("auth.press")}
            </Text>
            <Kbd>Enter</Kbd>
            <Text variant="body-default-xs" onBackground="neutral-medium">
              {t("auth.enter_hint")}
            </Text>
          </Flex>
        </Column>
      </Dialog>
    </Flex>
  );
}; 