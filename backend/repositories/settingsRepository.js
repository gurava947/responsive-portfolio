const TABLES = {
  theme: { table: "theme_settings", fields: ["mode", "primary_color", "secondary_color", "accent_color", "background_color", "text_color", "muted_color"] },
  cardUI: { table: "card_settings", fields: [
    "radius_top_left", "radius_top_right", "radius_bottom_right", "radius_bottom_left",
    "border_top", "border_right", "border_bottom", "border_left", "border_color", "border_top_color",
    "border_right_color", "border_bottom_color", "border_left_color", "background_color",
    "text_color", "font_family", "max_width", "min_height", "font_size", "font_weight", "hover_scale",
    "mobile_image_height", "tablet_image_height", "desktop_image_height",
    "hover_highlight", "transition_duration", "transition_easing",
  ] },
  animation: { table: "animation_settings", fields: ["entrance_mode", "scroll_reveal", "click_feedback", "preview_switch", "animation_intensity", "reduced_motion"] },
  preview: { table: "preview_settings", fields: ["small_width", "small_height", "medium_width", "medium_height", "large_width", "large_height"] },
};

function rowsToSettings(rows) {
  const theme = rows.theme;
  const card = rows.cardUI;
  const animation = rows.animation;
  const preview = rows.preview;
  const themeCardBackground = theme.mode === "dark" ? "#202822" : "#ffffff";
  const themeCardText = theme.mode === "dark" ? "#eef2e8" : "#18231d";
  const themeCardBorder = theme.mode === "dark" ? "#3a453b" : "#dfe8d9";
  const colorValue = (value, themeValue) => value === themeValue ? "theme" : value;
  return {
    theme: {
      mode: theme.mode,
      primary: theme.primary_color,
      secondary: theme.secondary_color,
      accent: theme.accent_color,
      background: theme.background_color,
      textColor: theme.text_color,
      mutedColor: theme.muted_color,
    },
    cardUI: {
      radius: card.radius_top_left,
      topLeftRadius: card.radius_top_left,
      topRightRadius: card.radius_top_right,
      bottomRightRadius: card.radius_bottom_right,
      bottomLeftRadius: card.radius_bottom_left,
      borderTopWidth: card.border_top,
      borderRightWidth: card.border_right,
      borderBottomWidth: card.border_bottom,
      borderLeftWidth: card.border_left,
      borderTopColor: colorValue(card.border_top_color, themeCardBorder),
      borderRightColor: colorValue(card.border_right_color, themeCardBorder),
      borderBottomColor: colorValue(card.border_bottom_color, themeCardBorder),
      borderLeftColor: colorValue(card.border_left_color, themeCardBorder),
      borderColor: colorValue(card.border_color, themeCardBorder),
      backgroundColor: colorValue(card.background_color, themeCardBackground),
      textColor: colorValue(card.text_color, themeCardText),
      fontFamily: card.font_family,
      maxWidth: card.max_width,
      minHeight: card.min_height,
      mobileImageHeight: card.mobile_image_height,
      tabletImageHeight: card.tablet_image_height,
      desktopImageHeight: card.desktop_image_height,
      fontSize: card.font_size,
      fontWeight: card.font_weight,
      hoverScale: card.hover_scale,
      hoverHighlight: card.hover_highlight,
      transitionDuration: card.transition_duration,
      transitionEasing: card.transition_easing,
    },
    animation: {
      entranceIntensity: animation.entrance_mode,
      scrollReveal: Boolean(animation.scroll_reveal),
      pressFeedback: Boolean(animation.click_feedback),
      deviceSwitchTransition: Boolean(animation.preview_switch),
      animationIntensity: animation.animation_intensity,
      reducedMotion: Boolean(animation.reduced_motion),
    },
    preview: {
      smallWidth: preview.small_width,
      smallHeight: preview.small_height,
      mediumWidth: preview.medium_width,
      mediumHeight: preview.medium_height,
      largeWidth: preview.large_width,
      largeHeight: preview.large_height,
    },
  };
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return (linear[0] * 0.2126) + (linear[1] * 0.7152) + (linear[2] * 0.0722);
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function createSettingsRepository(database) {
  const select = Object.fromEntries(Object.entries(TABLES).map(([key, value]) => [
    key,
    database.prepare(`SELECT * FROM ${value.table} WHERE id = 1`),
  ]));

  function readRows() {
    return Object.fromEntries(Object.entries(select).map(([key, statement]) => [key, statement.get()]));
  }

  function patchGroup(group, changes) {
    const config = TABLES[group];
    const entries = Object.entries(changes).filter(([key]) => config.fields.includes(key));
    if (entries.length === 0) return;
    const assignment = entries.map(([key]) => `${key} = ?`).join(", ");
    database.prepare(`UPDATE ${config.table} SET ${assignment} WHERE id = 1`)
      .run(...entries.map(([, value]) => value));
  }

  return {
    get() {
      return rowsToSettings(readRows());
    },
    update(validatedPatch) {
      database.exec("BEGIN IMMEDIATE");
      try {
        const groupPatch = { ...validatedPatch };
        if (groupPatch.theme?.mode) {
          const previousTheme = readRows().theme;
          const dark = groupPatch.theme.mode === "dark";
          if (previousTheme.mode !== groupPatch.theme.mode) {
            const previousPalette = previousTheme.mode === "dark"
              ? { background_color: "#202822", text_color: "#eef2e8", border_color: "#3a453b" }
              : { background_color: "#ffffff", text_color: "#18231d", border_color: "#dfe8d9" };
            const nextPalette = dark
              ? { background_color: "#202822", text_color: "#eef2e8", border_color: "#3a453b" }
              : { background_color: "#ffffff", text_color: "#18231d", border_color: "#dfe8d9" };
            const existingCard = readRows().cardUI;
            const themeCardChanges = {};
            ["background_color", "text_color", "border_color", "border_top_color", "border_right_color", "border_bottom_color", "border_left_color"].forEach((key) => {
              const priorToken = key.includes("border") ? previousPalette.border_color : previousPalette[key];
              if (existingCard[key] === priorToken) themeCardChanges[key] = key.includes("border") ? nextPalette.border_color : nextPalette[key];
            });
            if (Object.keys(themeCardChanges).length) {
              groupPatch.cardUI = { ...themeCardChanges, ...groupPatch.cardUI };
            }
          }
          groupPatch.theme = {
            ...groupPatch.theme,
            primary_color: groupPatch.theme.primary_color ?? (dark ? "#8b5cf6" : "#6d5ce8"),
            secondary_color: groupPatch.theme.secondary_color ?? (dark ? "#22d3ee" : "#0891b2"),
            accent_color: groupPatch.theme.accent_color ?? (dark ? "#f472b6" : "#db2777"),
            background_color: groupPatch.theme.background_color ?? (dark ? "#070b14" : "#f1f5fb"),
            text_color: groupPatch.theme.text_color ?? (dark ? "#f8fafc" : "#172033"),
            muted_color: groupPatch.theme.muted_color ?? (dark ? "#bac8da" : "#526176"),
          };
        }
        if (groupPatch.cardUI) {
          const theme = readRows().theme;
          const dark = (groupPatch.theme?.mode || theme.mode) === "dark";
          const defaultBackground = dark ? "#202822" : "#ffffff";
          const defaultText = dark ? "#eef2e8" : "#18231d";
          const defaultBorder = dark ? "#3a453b" : "#dfe8d9";
          groupPatch.cardUI = Object.fromEntries(Object.entries(groupPatch.cardUI).map(([key, value]) => {
            if (value === "theme" && key === "background_color") return [key, defaultBackground];
            if (value === "theme" && key === "text_color") return [key, defaultText];
            if (value === "theme" && ["border_color", "border_top_color", "border_right_color", "border_bottom_color", "border_left_color"].includes(key)) return [key, defaultBorder];
            return [key, value];
          }));
          const effective = { ...readRows().cardUI, ...groupPatch.cardUI };
          const background = effective.background_color;
          const text = effective.text_color;
          if (contrastRatio(text, background) < 4.5) {
            throw Object.assign(new Error("Card text and background colors must meet WCAG AA contrast (4.5:1)."), { status: 400 });
          }
        }
        Object.entries(groupPatch).forEach(([group, changes]) => patchGroup(group, changes));
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }
      return this.get();
    },
  };
}
