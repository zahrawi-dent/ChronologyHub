import { currentLocale, changeLocale, isRTL, type Locale } from "../i18n";
import { t } from "../i18n";

export default function LanguageSwitcher() {
  const toggleLanguage = () => {
    const newLocale: Locale = currentLocale() === "en" ? "ar" : "en";
    changeLocale(newLocale);

    // Update document direction for RTL support
    document.documentElement.dir = isRTL() ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  return (
    <button
      onClick={toggleLanguage}
      class={`fixed top-4 z-50 bg-primary/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-primary/40 transition-all duration-300 ${isRTL() ? 'left-4' : 'right-4'}`}
      aria-label="Switch language"
    >
      {currentLocale() === "en" ? t("language.arabic") : t("language.english")}
    </button>
  );
}