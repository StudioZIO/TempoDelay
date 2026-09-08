import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

const CONSENT_KEY = 'studiozio-consent';
type ConsentValue = 'granted' | 'denied';

type GtagWindow = Window & {
  gtag?: (command: 'consent', action: 'update', values: Record<string, ConsentValue>) => void;
};

type CookieConsentContextValue = {
  toggle: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue>({
  toggle: () => undefined,
});

const updateConsent = (value: ConsentValue): void => {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage can be unavailable in private browsing; the current choice still applies.
  }

  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  }
};

export const useCookieConsent = (): CookieConsentContextValue => useContext(CookieConsentContext);

export const CookieConsentProvider = ({ children }: PropsWithChildren) => {
  const [bannerOpen, setBannerOpen] = useState(false);
  const restoreFocus = useRef(false);
  const declineButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      // A blocked storage area is equivalent to no saved choice.
    }

    if (stored === 'granted' || stored === 'denied') {
      setBannerOpen(false);
    } else {
      setBannerOpen(true);
    }
  }, []);

  useEffect(() => {
    if (bannerOpen && restoreFocus.current) {
      declineButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [bannerOpen]);

  const decide = (value: ConsentValue): void => {
    updateConsent(value);
    setBannerOpen(false);
  };

  const toggle = (): void => {
    if (bannerOpen) {
      setBannerOpen(false);
      return;
    }
    restoreFocus.current = true;
    setBannerOpen(true);
  };

  return (
    <CookieConsentContext.Provider value={{ toggle }}>
      {children}
      {bannerOpen && (
        <div className="consent-banner" role="region" aria-label="Cookie preference">
          <div className="consent-inner">
            <p className="consent-text">
              This site uses Google Analytics to count visits and to measure which ads bring
              people here. You are not added to an advertising audience, and no profile is
              built about you.
            </p>
            <div className="consent-actions">
              <button
                ref={declineButton}
                type="button"
                className="btn consent-btn"
                onClick={() => decide('denied')}
              >
                Decline
              </button>
              <button type="button" className="btn btn-primary consent-btn" onClick={() => decide('granted')}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
};
