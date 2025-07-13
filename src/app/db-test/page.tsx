'use client';

import { useState } from 'react';
import { Column, Text, Button, Heading } from '@once-ui-system/core';

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

export default function DbTestPage() {
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
        message: 'Error al conectar con la API',
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
      <Heading variant="display-default-l">Diagnóstico de Base de Datos</Heading>
      
      <Text variant="body-default-m">
        Esta página te permite verificar la conexión con Supabase y diagnosticar problemas de conectividad.
      </Text>

      <Button 
        onClick={testConnection} 
        disabled={isLoading}
        variant="solid"
      >
        {isLoading ? 'Probando conexión...' : 'Probar Conexión'}
      </Button>

      {status.status === 'loading' && (
        <Column gap="s" padding="l" background="surface-weak">
          <Text variant="body-default-s">🔄 Probando conexión...</Text>
        </Column>
      )}

      {status.status === 'connected' && (
        <Column gap="s" padding="l" background="success-background-weak">
          <Text variant="body-default-s" onBackground="success-strong">
            ✅ Conexión exitosa
          </Text>
          <Text variant="body-default-s">
            <strong>Mensaje:</strong> {status.message}
          </Text>
          {status.timestamp && (
            <Text variant="body-default-s">
              <strong>Timestamp:</strong> {status.timestamp}
            </Text>
          )}
          {status.connectionInfo && (
            <Column gap="xs">
              <Text variant="body-default-s">
                <strong>Host:</strong> {status.connectionInfo.host}
              </Text>
              <Text variant="body-default-s">
                <strong>Base de datos:</strong> {status.connectionInfo.database}
              </Text>
              <Text variant="body-default-s">
                <strong>SSL:</strong> {status.connectionInfo.ssl}
              </Text>
            </Column>
          )}
        </Column>
      )}

      {status.status === 'error' && (
        <Column gap="s" padding="l" background="error-background-weak">
          <Text variant="body-default-s" onBackground="error-strong">
            ❌ Error de conexión
          </Text>
          <Text variant="body-default-s">
            <strong>Mensaje:</strong> {status.message}
          </Text>
          
          {status.error && (
            <Column gap="xs">
              <Text variant="body-default-s">
                <strong>Código:</strong> {status.error.code}
              </Text>
              <Text variant="body-default-s">
                <strong>Error:</strong> {status.error.message}
              </Text>
              <Text variant="body-default-s">
                <strong>Syscall:</strong> {status.error.syscall}
              </Text>
              <Text variant="body-default-s">
                <strong>Dirección:</strong> {status.error.address}
              </Text>
              <Text variant="body-default-s">
                <strong>Puerto:</strong> {status.error.port}
              </Text>
            </Column>
          )}

          {status.suggestions && (
            <Column gap="xs">
              <Text variant="body-default-s" onBackground="neutral-strong">
                <strong>Sugerencias:</strong>
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