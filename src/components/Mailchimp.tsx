"use client";

import { mailchimp, newsletter as newsletterDefaults } from "@/resources";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Background,
  Column,
  Textarea,
} from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type MailchimpProps = {
  /** Si no se pasa, se usa `newsletter.display` de resources */
  display?: boolean;
};

export const Mailchimp = ({
  display = newsletterDefaults.display,
}: MailchimpProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    if (email === "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "email" && value && !validateEmail(value)) {
      setError(t("mailchimp.email_invalid"));
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (!validateEmail(formData.email)) {
      setError(t("mailchimp.email_invalid"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError(t("mailchimp.fields_required"));
      return;
    }

    if (!validateEmail(formData.email)) {
      setError(t("mailchimp.email_invalid"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("mailchimp.send_error"));
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("mailchimp.send_error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!display) return null;

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
          cursor: mailchimp.effects.mask.cursor,
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
      <Heading
        style={{ position: "relative" }}
        marginBottom="s"
        variant="display-strong-xs"
      >
        {t("mailchimp.title")}
      </Heading>
      <Text
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
          whiteSpace: "pre-line",
        }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {t("mailchimp.description")}
      </Text>
      {isSuccess ? (
        <Column
          fillWidth
          maxWidth={24}
          gap="m"
          padding="l"
          background="success-weak"
          border="success-medium"
          radius="m"
          align="center"
        >
          <Text variant="body-strong-m" onBackground="success-strong">
            ✅ {t("mailchimp.success_title")}
          </Text>
          <Text variant="body-default-s" onBackground="success-medium">
            {t("mailchimp.success_body")}
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
                message: "",
              });
              setError("");
              setTouched(false);
            }}
          >
            {t("mailchimp.send_another")}
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
                label={t("mailchimp.name")}
                description={t("mailchimp.name_hint")}
                value={formData.name}
                required
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                id="contact-email"
                name="email"
                type="email"
                label={t("email")}
                description="tu@email.com"
                value={formData.email}
                required
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={handleBlur}
                errorMessage={touched || formData.email ? error : undefined}
              />
            </Flex>

            <Input
              id="contact-subject"
              name="subject"
              type="text"
              label={t("mailchimp.subject")}
              description={t("mailchimp.subject_hint")}
              value={formData.subject}
              required
              disabled={isSubmitting}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />

            <Textarea
              id="contact-message"
              name="message"
              label={t("mailchimp.message")}
              description={t("mailchimp.message_hint")}
              value={formData.message}
              required
              disabled={isSubmitting}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={5}
            />
            <Flex height="48" vertical="center">
              <Button
                type="submit"
                variant="primary"
                size="m"
                fillWidth
                disabled={
                  !!error ||
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  !formData.subject.trim() ||
                  !formData.message.trim() ||
                  isSubmitting
                }
              >
                {isSubmitting
                  ? t("mailchimp.submitting")
                  : t("mailchimp.submit")}
              </Button>
            </Flex>
          </Column>
        </form>
      )}
    </Column>
  );
};
