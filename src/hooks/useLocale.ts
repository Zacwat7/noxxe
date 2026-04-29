/**
 * useLocale — detects whether the visitor is in the United States.
 *
 * Strategy (cheapest-first, no network call):
 * 1. navigator.language starts with "en-US"
 * 2. Intl.DateTimeFormat resolvedOptions().timeZone is an American TZ
 * 3. Falls back to false (GBP / UK copy)
 */

const US_TIMEZONES = new Set([
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Adak',
  'Pacific/Honolulu',
  'America/Indiana/Indianapolis',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Tell_City',
  'America/Indiana/Vevay',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Detroit',
  'America/Boise',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
]);

function detectUS(): boolean {
  try {
    const lang = navigator.language || '';
    if (lang.startsWith('en-US')) return true;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (US_TIMEZONES.has(tz)) return true;
  } catch {
    // Intl not available — default to false
  }
  return false;
}

// Compute once and cache — locale won't change mid-session
const IS_US = detectUS();

export type LocaleInfo = {
  isUS: boolean;
  /** Format a price: £1,500 → "$1,500" for US, "£1,500" for UK */
  price: (gbpAmount: string) => string;
  /** "USD" | "GBP" */
  currency: 'USD' | 'GBP';
};

export function useLocale(): LocaleInfo {
  const isUS = IS_US;

  const price = (gbpAmount: string): string => {
    if (!isUS) return gbpAmount;
    // Replace leading £ with $, leave the number unchanged
    return gbpAmount.replace(/^£/, '$');
  };

  return { isUS, price, currency: isUS ? 'USD' : 'GBP' };
}
