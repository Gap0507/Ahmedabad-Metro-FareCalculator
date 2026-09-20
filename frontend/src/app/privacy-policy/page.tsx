"use client";

import LegalPage from '../../components/LegalPage';
import { ThemeProvider } from '../../theme';
import { I18nProvider } from '../../i18n';

export default function PrivacyPolicyPage() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <LegalPage kind="privacy" />
      </I18nProvider>
    </ThemeProvider>
  );
}
