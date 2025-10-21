"use client";

import { mailchimp } from "@/resources";
import { Button, Flex, Heading, Input, Text, Background, Column, Textarea } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

type NewsletterProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);


  const validateEmail = (email: string): boolean => {
    if (email === "") {
      return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validar email en tiempo real
    if (field === 'email' && value && !validateEmail(value)) {
      setError("Por favor ingresa un email válido.");
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (!validateEmail(formData.email)) {
      setError("Por favor ingresa un email válido.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Todos los campos son requeridos.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Por favor ingresa un email válido.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {newsletter.title}
      </Heading>
      <Text
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
        }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {newsletter.description}
      </Text>
      {isSuccess ? (
        <Column
          fillWidth
          maxWidth={24}
          gap="m"
          padding="l"
          background="success-subtle"
          border="success-medium"
          radius="m"
          align="center"
        >
          <Text variant="body-strong-m" onBackground="success-strong">
            ✅ ¡Mensaje enviado correctamente!
          </Text>
          <Text variant="body-default-s" onBackground="success-medium">
            Gracias por contactarme. Te responderé en menos de 24 horas.
          </Text>
          <Button
            variant="tertiary"
            size="s"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
              });
              setError("");
              setTouched(false);
            }}
          >
            Enviar otro mensaje
          </Button>
        </Column>
      ) : (
        <form
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onSubmit={handleSubmit}
        >
        <Column fillWidth maxWidth={24} gap="m">
          <Flex fillWidth gap="s" mobileDirection="column">
            <Input
              id="contact-name"
              name="name"
              type="text"
              label="Nombre"
              description="Tu nombre completo"
              value={formData.name}
              required
              disabled={isSubmitting}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <Input
              id="contact-email"
              name="email"
              type="email"
              label="Email"
              description="tu@email.com"
              value={formData.email}
              required
              disabled={isSubmitting}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={handleBlur}
              errorMessage={error}
            />
          </Flex>
          
          <Input
            id="contact-subject"
            name="subject"
            type="text"
            label="Asunto"
            description="¿En qué puedo ayudarte?"
            value={formData.subject}
            required
            disabled={isSubmitting}
            onChange={(e) => handleInputChange('subject', e.target.value)}
          />
          
          <Textarea
            id="contact-message"
            name="message"
            label="Mensaje"
            description="Cuéntame sobre tu proyecto, idea o consulta..."
            value={formData.message}
            required
            disabled={isSubmitting}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={5}
          />
          <Flex height="48" vertical="center">
            <Button 
              type="submit"
              variant="primary"
              size="m" 
              fillWidth
              disabled={!!error || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim() || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "📧 Enviar mensaje"}
            </Button>
          </Flex>
        </Column>
      </form>
      )}
    </Column>
  );
};
