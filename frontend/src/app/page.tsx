"use client";

import dynamic from 'next/dynamic'
import { LazyBoundary } from '../components/LazyComponent'
import { I18nProvider } from '../i18n'
import { usePathname } from '../store/locationStore'
import { ThemeProvider } from '../theme'
import { createLazyComponent } from '../utils/lazyComponent'

const MetroMapStage = dynamic(() => import('../components/Stage'), {
  ssr: false,
  loading: () => <div className="min-h-svh bg-[#f4f0e8] dark:bg-zinc-950" />,
});

const StationPage = createLazyComponent(() => import('../components/StationPage'));
const LegalPage = createLazyComponent(() => import('../components/LegalPage'));

const stationSlugFromPathname = (pathname: string) => {
  const match = pathname.match(/^\/stations\/([^/]+)\/?$/);
  return match?.[1] || null;
};

function AppContent() {
  const pathname = usePathname();
  const stationSlug = stationSlugFromPathname(pathname);
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';

  if (stationSlug) {
    return (
      <LazyBoundary fallback={<div className="min-h-svh bg-[#f4f0e8] dark:bg-zinc-950" />}>
        <StationPage slug={stationSlug} />
      </LazyBoundary>
    );
  }

  if (normalizedPathname === '/privacy-policy' || normalizedPathname === '/privacy_policy') {
    return (
      <LazyBoundary fallback={<div className="min-h-svh bg-[#f4f0e8] dark:bg-zinc-950" />}>
        <LegalPage kind="privacy" />
      </LazyBoundary>
    );
  }

  if (
    normalizedPathname === '/terms-and-conditions' ||
    normalizedPathname === '/termsn-and-condition' ||
    normalizedPathname === '/terms'
  ) {
    return (
      <LazyBoundary fallback={<div className="min-h-svh bg-[#f4f0e8] dark:bg-zinc-950" />}>
        <LegalPage kind="terms" />
      </LazyBoundary>
    );
  }

  return <MetroMapStage />;
}

export default function Home() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div>
          <AppContent />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}
