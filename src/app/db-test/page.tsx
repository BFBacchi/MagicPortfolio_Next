'use client';

import { useState } from 'react';
import { Column, Text, Button, Heading } from '@once-ui-system/core';
import { useLanguage } from "@/contexts/LanguageContext";

interface DbStatus {
  status: 'connected' | 'error' | 'loading' | 'idle';
  message?: string;
  timestamp?: string;
  connectionInfo?: {
    host: string;
    database: string;
    ssl: string;
  };
  
  error?: {
    code: string;
    message: string;
    syscall: string;
    address: string;
    port: number;
  };
  suggestions?: string[];
}

export default function DBTestPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<DbStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus({ status: 'loading' });

    try {
      const response = await fetch('/api/db-status');
      const data = await response.json();
      
      setStatus({
        status: response.ok ? 'connected' : 'error',
        ...data
      });
    } catch (error: any) {
      setStatus({
        status: 'error',
        message: t("db.api_error"),
        error: {
          code: 'FETCH_ERROR',
          message: error.message,
          syscall: 'fetch',
          address: 'localhost:3000',
          port: 3000
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Column maxWidth="m" padding="xl" gap="l">
      <Heading>{t('db_test')}</Heading>
      
      <Text variant="body-default-m">
        {t('db_test_description')}
      </Text>

      <Button 
        onClick={testConnection} 
        disabled={isLoading}
        variant="primary"
      >
        {isLoading ? t("db.testing") : t("db.test_connection")}
      </Button>

      {status.status === 'loading' && (
        <Column gap="s" padding="l" background="neutral-alpha-weak">
          <Text variant="body-default-s">🔄 {t("db.testing")}</Text>
        </Column>
      )}

      {status.status === 'connected' && (
        <Column gap="s" padding="l" background="success-weak">
          <Text variant="body-default-s" onBackground="success-strong">
            ✅ {t("db.ok")}
          </Text>
          <Text variant="body-default-s">
            <strong>{t("db.message")}:</strong> {status.message}
          </Text>
          {status.timestamp && (
            <Text variant="body-default-s">
              <strong>{t("db.timestamp")}:</strong> {status.timestamp}
            </Text>
          )}
          {status.connectionInfo && (
            <Column gap="xs">
              <Text variant="body-default-s">
                <strong>{t("db.host")}:</strong> {status.connectionInfo.host}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.database")}:</strong> {status.connectionInfo.database}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.ssl")}:</strong> {status.connectionInfo.ssl}
              </Text>
            </Column>
          )}
        </Column>
      )}

      {status.status === 'error' && (
        <Column gap="s" padding="l" background="danger-weak">
          <Text variant="body-default-s" onBackground="danger-strong">
            ❌ {t("db.error")}
          </Text>
          <Text variant="body-default-s">
            <strong>{t("db.message")}:</strong> {status.message}
          </Text>
          
          {status.error && (
            <Column gap="xs">
              <Text variant="body-default-s">
                <strong>{t("db.code")}:</strong> {status.error.code}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.error_detail")}:</strong> {status.error.message}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.syscall")}:</strong> {status.error.syscall}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.address")}:</strong> {status.error.address}
              </Text>
              <Text variant="body-default-s">
                <strong>{t("db.port")}:</strong> {status.error.port}
              </Text>
            </Column>
          )}

          {status.suggestions && (
            <Column gap="xs">
              <Text variant="body-default-s" onBackground="neutral-strong">
                <strong>{t("db.suggestions")}:</strong>
              </Text>
              {status.suggestions.map((suggestion, index) => (
                <Text key={index} variant="body-default-s">
                  • {suggestion}
                </Text>
              ))}
            </Column>
          )}
        </Column>
      )}
    </Column>
  );
} 