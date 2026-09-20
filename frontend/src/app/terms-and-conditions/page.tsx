"use client";

import LegalPage from '../../components/LegalPage';
import { ThemeProvider } from '../../theme';
import { I18nProvider } from '../../i18n';

export default function TermsAndConditionsPage() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <LegalPage kind="terms" />
      </I18nProvider>
    </ThemeProvider>
  );
}
