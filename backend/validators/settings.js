const colorPattern = /^#[\da-f]{6}$/i;
const settingsKeys = new Set(["theme", "cardUI", "animation", "preview"]);
const ranges = {
  radius_top_left: [0, 40],
  radius_top_right: [0, 40],
  radius_bottom_right: [0, 40],
  radius_bottom_left: [0, 40],
  border_top: [0, 8],
  border_right: [0, 8],
  border_bottom: [0, 8],
  border_left: [0, 8],
  max_width: [240, 520],
  min_height: [0, 600],
  mobile_image_height: [120, 240],
  tablet_image_height: [140, 280],
  desktop_image_height: [160, 320],
  font_size: [12, 24],
  font_weight: [300, 800],
  hover_scale: [1, 1.04],
  transition_duration: [0, 600],
  small_width: [240, 480],
  small_height: [320, 960],
  medium_width: [480, 1024],
  medium_height: [600, 1400],
  large_width: [800, 1920],
  large_height: [500, 1200],
};
const enumValues = {
  mode: ["light", "dark"],
  font_family: ["theme", "system", "arial", "georgia", "monospace"],
  hover_highlight: ["none", "subtle", "medium"],
  transition_easing: ["smooth", "standard"],
  entrance_mode: ["none", "subtle", "medium"],
  animation_intensity: ["none", "subtle", "smooth", "expressive"],
};
const booleanKeys = new Set(["scroll_reveal", "click_feedback", "preview_switch", "reduced_motion"]);
const colorKeys = new Set([
  "primary_color", "secondary_color", "accent_color", "background_color", "text_color", "muted_color",
  "border_color", "card_background_color", "card_text_color",
  "border_top_color", "border_right_color", "border_bottom_color", "border_left_color",
]);

function validateGroup(group, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw Object.assign(new Error(`${group} settings must be an object.`), { status: 400 });
  }
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (group === "theme" && key === "mode") {
      if (!enumValues.mode.includes(value)) throw Object.assign(new Error("Invalid theme mode."), { status: 400 });
      output.mode = value;
      continue;
    }
    if (group === "cardUI" && key === "radius") {
      const number = Number(value);
      if (!Number.isFinite(number) || number < 0 || number > 40) {
        throw Object.assign(new Error("radius must be between 0 and 40."), { status: 400 });
      }
      output.radius_top_left = number;
      output.radius_top_right = number;
      output.radius_bottom_right = number;
      output.radius_bottom_left = number;
      continue;
    }

    let normalizedKey = ({
      primary: "primary_color",
      secondary: "secondary_color",
      accent: "accent_color",
      background: "background_color",
      mutedColor: "muted_color",
      maxWidth: "max_width",
      minHeight: "min_height",
      mobileImageHeight: "mobile_image_height",
      tabletImageHeight: "tablet_image_height",
      desktopImageHeight: "desktop_image_height",
      fontSize: "font_size",
      fontWeight: "font_weight",
      hoverScale: "hover_scale",
      hoverHighlight: "hover_highlight",
      transitionDuration: "transition_duration",
      transitionEasing: "transition_easing",
      fontFamily: "font_family",
      topLeftRadius: "radius_top_left",
      topRightRadius: "radius_top_right",
      bottomRightRadius: "radius_bottom_right",
      bottomLeftRadius: "radius_bottom_left",
      borderTopWidth: "border_top",
      borderRightWidth: "border_right",
      borderBottomWidth: "border_bottom",
      borderLeftWidth: "border_left",
      borderTopColor: "border_top_color",
      borderRightColor: "border_right_color",
      borderBottomColor: "border_bottom_color",
      borderLeftColor: "border_left_color",
      backgroundColor: group === "cardUI" ? "card_background_color" : "background_color",
      textColor: group === "cardUI" ? "card_text_color" : "text_color",
      borderColor: "border_color",
      scrollReveal: "scroll_reveal",
      pressFeedback: "click_feedback",
      deviceSwitchTransition: "preview_switch",
      entranceIntensity: "entrance_mode",
      animationIntensity: "animation_intensity",
      reducedMotion: "reduced_motion",
      smallWidth: "small_width",
      smallHeight: "small_height",
      mediumWidth: "medium_width",
      mediumHeight: "medium_height",
      largeWidth: "large_width",
      largeHeight: "large_height",
    })[key] || key;
    if (group === "cardUI" && normalizedKey === "card_background_color") normalizedKey = "background_color";
    if (group === "cardUI" && normalizedKey === "card_text_color") normalizedKey = "text_color";

    if (ranges[normalizedKey]) {
      const number = Number(value);
      const [min, max] = ranges[normalizedKey];
      if (!Number.isFinite(number) || number < min || number > max) {
        throw Object.assign(new Error(`${key} must be between ${min} and ${max}.`), { status: 400 });
      }
      output[normalizedKey] = number;
    } else if (enumValues[normalizedKey]) {
      if (!enumValues[normalizedKey].includes(value)) {
        throw Object.assign(new Error(`Invalid value for ${key}.`), { status: 400 });
      }
      output[normalizedKey] = value;
    } else if (booleanKeys.has(normalizedKey)) {
      if (typeof value !== "boolean") throw Object.assign(new Error(`${key} must be boolean.`), { status: 400 });
      output[normalizedKey] = Number(value);
    } else if (colorKeys.has(normalizedKey)) {
      if (group === "cardUI" && ["background_color", "text_color", "border_color", "border_top_color", "border_right_color", "border_bottom_color", "border_left_color"].includes(normalizedKey) && value === "theme") {
        output[normalizedKey] = value;
        continue;
      }
      if (typeof value !== "string" || !colorPattern.test(value)) {
        throw Object.assign(new Error(`${key} must be a six-digit hex color.`), { status: 400 });
      }
      output[normalizedKey] = value.toLowerCase();
    } else {
      throw Object.assign(new Error(`Unsupported ${group} setting: ${key}.`), { status: 400 });
    }
  }
  return output;
}

export function validateSettingsPatch(input) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length === 0) {
    throw Object.assign(new Error("Settings patch must be a non-empty object."), { status: 400 });
  }
  const result = {};
  for (const [group, values] of Object.entries(input)) {
    if (!settingsKeys.has(group)) throw Object.assign(new Error(`Unsupported settings group: ${group}.`), { status: 400 });
    result[group] = validateGroup(group, values);
    if (Object.keys(result[group]).length === 0) {
      throw Object.assign(new Error(`${group} settings patch must include a supported setting.`), { status: 400 });
    }
  }
  return result;
}
