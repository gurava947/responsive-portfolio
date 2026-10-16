import { useEffect, useRef, useState } from "react";

export const THEME_STORAGE_KEY = "portfolio-theme-settings";
export const THEME_MODES = ["dark", "light"];

export const DEFAULT_CARD_UI_SETTINGS = {
  radius: 20,
  topLeftRadius: 20,
  topRightRadius: 20,
  bottomRightRadius: 20,
  bottomLeftRadius: 20,
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderTopColor: "theme",
  borderRightColor: "theme",
  borderBottomColor: "theme",
  borderLeftColor: "theme",
  backgroundColor: "theme",
  borderColor: "theme",
  maxWidth: 520,
  minHeight: 0,
  mobileImageHeight: 150,
  tabletImageHeight: 175,
  desktopImageHeight: 190,
  fontFamily: "theme",
  fontSize: 16,
  fontWeight: 600,
  textColor: "theme",
  hoverScale: 1.02,
  hoverHighlight: "subtle",
  transitionDuration: 250,
  transitionEasing: "smooth",
  entranceIntensity: "none",
  scrollReveal: false,
  pressFeedback: true,
  deviceSwitchTransition: true,
};

const CARD_COLOR_RE = /^#[\da-f]{6}$/i;
const CARD_FONT_FAMILIES = ["theme", "system", "arial", "georgia", "monospace"];
const CARD_HIGHLIGHTS = ["none", "subtle", "medium"];
const CARD_EASINGS = ["smooth", "standard"];
const CARD_ENTRANCE_INTENSITIES = ["none", "subtle", "medium"];
const CARD_NUMBER_RANGES = {
  radius: [0, 40],
  topLeftRadius: [0, 40],
  topRightRadius: [0, 40],
  bottomRightRadius: [0, 40],
  bottomLeftRadius: [0, 40],
  borderTopWidth: [0, 8],
  borderRightWidth: [0, 8],
  borderBottomWidth: [0, 8],
  borderLeftWidth: [0, 8],
  maxWidth: [240, 520],
  minHeight: [0, 600],
  fontSize: [12, 24],
  fontWeight: [300, 800],
  hoverScale: [1, 1.04],
  transitionDuration: [0, 600],
};
const CARD_IMAGE_HEIGHT_RANGES = {
  mobileImageHeight: [120, 240],
  tabletImageHeight: [140, 280],
  desktopImageHeight: [160, 320],
};

export function normalizeCardUISettings(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const normalized = { ...DEFAULT_CARD_UI_SETTINGS };

  Object.entries(CARD_NUMBER_RANGES).forEach(([key, [min, max]]) => {
    const number = Number(source[key]);
    if (Number.isFinite(number)) normalized[key] = Math.min(max, Math.max(min, number));
  });
  Object.entries(CARD_IMAGE_HEIGHT_RANGES).forEach(([key, [min, max]]) => {
    const number = source[key];
    if (typeof number === "number" && Number.isFinite(number) && number >= min && number <= max) {
      normalized[key] = number;
    }
  });

  ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"].forEach((key) => {
    if (source[key] === "theme" || (typeof source[key] === "string" && CARD_COLOR_RE.test(source[key]))) {
      normalized[key] = source[key] === "theme" ? "theme" : source[key].toLowerCase();
    }
  });
  ["backgroundColor", "borderColor", "textColor"].forEach((key) => {
    if (source[key] === "theme" || (typeof source[key] === "string" && CARD_COLOR_RE.test(source[key]))) {
      normalized[key] = source[key] === "theme" ? "theme" : source[key].toLowerCase();
    }
  });

  if (CARD_FONT_FAMILIES.includes(source.fontFamily)) normalized.fontFamily = source.fontFamily;
  if (CARD_HIGHLIGHTS.includes(source.hoverHighlight)) normalized.hoverHighlight = source.hoverHighlight;
  if (CARD_EASINGS.includes(source.transitionEasing)) normalized.transitionEasing = source.transitionEasing;
  if (CARD_ENTRANCE_INTENSITIES.includes(source.entranceIntensity)) normalized.entranceIntensity = source.entranceIntensity;
  ["scrollReveal", "pressFeedback", "deviceSwitchTransition"].forEach((key) => {
    if (typeof source[key] === "boolean") normalized[key] = source[key];
  });

  return normalized;
}

export const DEFAULT_THEME_SETTINGS = {
  mode: "light",
  primary: "#6d5ce8",
  secondary: "#0891b2",
  accent: "#db2777",
  background: "#f1f5fb",
  cardOpacity: 14,
  blur: 24,
  borderOpacity: 20,
  shadowIntensity: 25,
  radius: 24,
  animationIntensity: "smooth",
  hoverGlow: true,
  cursorSpotlight: true,
  cardTilt: true,
  animatedBlobs: true,
  reducedMotion: false,
  cardUI: DEFAULT_CARD_UI_SETTINGS,
};

const themePresets = {
  dark: { primary: "#8b5cf6", secondary: "#22d3ee", accent: "#f472b6", background: "#070b14" },
  light: { primary: "#6d5ce8", secondary: "#0891b2", accent: "#db2777", background: "#f1f5fb" },
};

function normalizeMode(value) {
  return value === "dark" ? "dark" : "light";
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.match(/[\da-f]{2}/gi).map((channel) => parseInt(channel, 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return (linear[0] * 0.2126) + (linear[1] * 0.7152) + (linear[2] * 0.0722);
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function ensureCardTextContrast(cardUI, mode) {
  const themeBackground = mode === "dark" ? "#202822" : "#ffffff";
  const themeText = mode === "dark" ? "#eef2e8" : "#18231d";
  const background = cardUI.backgroundColor === "theme" ? themeBackground : cardUI.backgroundColor;
  const text = cardUI.textColor === "theme" ? themeText : cardUI.textColor;
  if (contrastRatio(text, background) >= 4.5) return cardUI;
  return { ...cardUI, backgroundColor: "theme", textColor: "theme" };
}

function getInitialSettings() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const mode = normalizeMode(parsed?.mode);
      return {
        ...DEFAULT_THEME_SETTINGS,
        ...themePresets[mode],
        mode,
        cardUI: ensureCardTextContrast(normalizeCardUISettings(parsed?.cardUI), mode),
      };
    }
    if (window.localStorage.getItem("portfolio-theme") === "dark") {
      return { ...DEFAULT_THEME_SETTINGS, ...themePresets.dark, mode: "dark" };
    }
  } catch (error) {
    try {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (storageError) {
      console.warn("Unable to clear saved theme settings.", storageError);
    }
    console.warn("Unable to load saved theme settings; using defaults.", error);
  }
  return DEFAULT_THEME_SETTINGS;
}

export function useTheme() {
  const [settings, setSettings] = useState(getInitialSettings);
  const apiSyncStarted = useRef(false);
  const userChangedSettings = useRef(false);

  useEffect(() => {
    let hasStoredSettings = false;
    try {
      hasStoredSettings = window.localStorage.getItem(THEME_STORAGE_KEY) !== null;
    } catch {
      hasStoredSettings = false;
    }
    const root = document.documentElement;
    const mode = normalizeMode(settings.mode);
    root.dataset.theme = mode;
    root.dataset.animation = settings.reducedMotion ? "none" : settings.animationIntensity;
    root.dataset.reducedMotion = String(settings.reducedMotion);
    root.dataset.animatedBlobs = String(settings.animatedBlobs);
    root.style.setProperty("--theme-primary", settings.primary);
    root.style.setProperty("--theme-secondary", settings.secondary);
    root.style.setProperty("--theme-accent", settings.accent);
    root.style.setProperty("--theme-background", settings.background);
    root.style.setProperty("--theme-card-opacity", `${settings.cardOpacity}%`);
    root.style.setProperty("--theme-blur", `${settings.blur}px`);
    root.style.setProperty("--theme-border-opacity", `${settings.borderOpacity}%`);
    root.style.setProperty("--theme-shadow-opacity", `${settings.shadowIntensity}%`);
    root.style.setProperty("--theme-radius", `${settings.radius}px`);
    root.style.setProperty("--theme-transition", "240ms ease");
    const cardUI = ensureCardTextContrast(normalizeCardUISettings(settings.cardUI), mode);
    root.style.setProperty("--portfolio-card-radius", `${cardUI.radius}px`);
    root.style.setProperty("--portfolio-card-radius-top-left", `${cardUI.topLeftRadius}px`);
    root.style.setProperty("--portfolio-card-radius-top-right", `${cardUI.topRightRadius}px`);
    root.style.setProperty("--portfolio-card-radius-bottom-right", `${cardUI.bottomRightRadius}px`);
    root.style.setProperty("--portfolio-card-radius-bottom-left", `${cardUI.bottomLeftRadius}px`);
    root.style.setProperty("--portfolio-card-image-radius-top-left", `${cardUI.topLeftRadius * 0.8}px`);
    root.style.setProperty("--portfolio-card-image-radius-top-right", `${cardUI.topRightRadius * 0.8}px`);
    ["top", "right", "bottom", "left"].forEach((side) => {
      const title = side[0].toUpperCase() + side.slice(1);
      root.style.setProperty(`--portfolio-card-border-${side}-width`, `${cardUI[`border${title}Width`]}px`);
      root.style.setProperty(
        `--portfolio-card-border-${side}-color`,
        cardUI[`border${title}Color`] === "theme"
          ? "var(--portfolio-card-border-color, var(--theme-card-border))"
          : cardUI[`border${title}Color`]
      );
    });
    root.style.setProperty("--portfolio-card-background", cardUI.backgroundColor === "theme" ? "var(--theme-card-bg)" : cardUI.backgroundColor);
    root.style.setProperty("--portfolio-card-border-color", cardUI.borderColor === "theme" ? "var(--theme-card-border)" : cardUI.borderColor);
    root.style.setProperty("--portfolio-card-max-width", `${cardUI.maxWidth}px`);
    root.style.setProperty("--portfolio-card-min-height", `${cardUI.minHeight}px`);
    root.style.setProperty("--portfolio-card-image-height-mobile", `${cardUI.mobileImageHeight}px`);
    root.style.setProperty("--portfolio-card-image-height-tablet", `${cardUI.tabletImageHeight}px`);
    root.style.setProperty("--portfolio-card-image-height-desktop", `${cardUI.desktopImageHeight}px`);
    root.style.setProperty("--portfolio-card-font-family", {
      theme: "inherit",
      system: "system-ui, sans-serif",
      arial: "Arial, sans-serif",
      georgia: "Georgia, serif",
      monospace: "ui-monospace, SFMono-Regular, Consolas, monospace",
    }[cardUI.fontFamily]);
    root.style.setProperty("--portfolio-card-title-font-family", cardUI.fontFamily === "theme"
      ? "'Space Grotesk', sans-serif"
      : {
        system: "system-ui, sans-serif",
        arial: "Arial, sans-serif",
        georgia: "Georgia, serif",
        monospace: "ui-monospace, SFMono-Regular, Consolas, monospace",
      }[cardUI.fontFamily]);
    root.style.setProperty("--portfolio-card-font-size", `${cardUI.fontSize}px`);
    root.style.setProperty("--portfolio-card-font-scale", String(cardUI.fontSize / 16));
    root.style.setProperty("--portfolio-card-font-weight", String(cardUI.fontWeight));
    if (cardUI.textColor === "theme") root.style.removeProperty("--portfolio-card-custom-text-color");
    else root.style.setProperty("--portfolio-card-custom-text-color", cardUI.textColor);
    root.style.setProperty("--portfolio-card-hover-scale", String(cardUI.hoverScale));
    root.style.setProperty("--portfolio-card-hover-shadow", {
      none: "0 10px 26px rgb(24 35 29 / 9%)",
      subtle: "0 14px 30px rgb(24 35 29 / 13%)",
      medium: "0 18px 36px rgb(24 35 29 / 18%)",
    }[cardUI.hoverHighlight]);
    root.style.setProperty("--portfolio-card-transition-duration", `${cardUI.transitionDuration}ms`);
    root.style.setProperty("--portfolio-card-transition-easing", cardUI.transitionEasing === "standard" ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0.2, 0.75, 0.3, 1)");
    root.style.setProperty("--portfolio-card-entrance-duration", cardUI.entranceIntensity === "medium" ? "420ms" : "280ms");
    root.style.setProperty("--portfolio-card-entrance-offset", cardUI.entranceIntensity === "medium" ? "14px" : "7px");
    root.style.setProperty("--portfolio-card-press-scale", cardUI.pressFeedback ? "0.985" : "1");
    root.style.setProperty("--portfolio-device-transition-duration", cardUI.deviceSwitchTransition ? "360ms" : "0ms");

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode, cardUI }));
      window.localStorage.setItem("portfolio-theme", mode);
    } catch (error) {
      console.error("Unable to persist theme mode.", error);
    }

    if (import.meta.env.MODE === "vercel") return;
    if (import.meta.env.MODE === "test" && !globalThis.__ENABLE_LOCAL_API_TESTS__) return;

    const syncSettings = async (method, body) => {
      const response = await fetch("/api/settings", {
        method,
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || `Settings API returned HTTP ${response.status}.`);
      return result?.data;
    };

    const currentSettingsPatch = {
      theme: {
        mode,
        primary: settings.primary,
        secondary: settings.secondary,
        accent: settings.accent,
        background: settings.background,
        textColor: mode === "dark" ? "#f8fafc" : "#172033",
        mutedColor: mode === "dark" ? "#bac8da" : "#526176",
      },
      cardUI,
      animation: {
        entranceIntensity: cardUI.entranceIntensity,
        scrollReveal: cardUI.scrollReveal,
        pressFeedback: cardUI.pressFeedback,
        deviceSwitchTransition: cardUI.deviceSwitchTransition,
        animationIntensity: settings.animationIntensity,
        reducedMotion: settings.reducedMotion,
      },
    };

    const patchCurrent = () => syncSettings("PATCH", currentSettingsPatch)
      .catch((error) => console.error("Unable to synchronize settings with the local API.", error));

    if (!apiSyncStarted.current) {
      apiSyncStarted.current = true;
      if (hasStoredSettings) {
        patchCurrent();
      } else {
        syncSettings("GET")
          .then((saved) => {
            if (!saved || userChangedSettings.current) return;
            const savedMode = normalizeMode(saved.theme?.mode);
            setSettings((current) => ({
              ...current,
              ...themePresets[savedMode],
              ...saved.theme,
              mode: savedMode,
              cardUI: ensureCardTextContrast(normalizeCardUISettings(saved.cardUI), savedMode),
              ...(saved.animation || {}),
            }));
          })
          .catch((error) => console.error("Unable to load settings from the local API.", error));
      }
      return;
    }
    const syncTimer = window.setTimeout(patchCurrent, 250);
    return () => window.clearTimeout(syncTimer);
  }, [settings]);

  const updateSettings = (changes) => {
    userChangedSettings.current = true;
    setSettings((current) => {
      if (!Object.prototype.hasOwnProperty.call(changes, "mode")) return { ...current, ...changes };
      const mode = normalizeMode(changes.mode);
      return {
        ...current,
        ...themePresets[mode],
        mode,
        cardUI: ensureCardTextContrast(normalizeCardUISettings(current.cardUI), mode),
      };
    });
  };
  const updateCardUISettings = (changes) => {
    userChangedSettings.current = true;
    setSettings((current) => ({
      ...current,
      cardUI: ensureCardTextContrast(normalizeCardUISettings({ ...current.cardUI, ...changes }), current.mode),
    }));
  };
  const resetCardUISettings = () => {
    userChangedSettings.current = true;
    setSettings((current) => ({ ...current, cardUI: DEFAULT_CARD_UI_SETTINGS }));
  };

  return { settings, updateSettings, updateCardUISettings, resetCardUISettings };
}
