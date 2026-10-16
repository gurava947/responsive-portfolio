import { validateSettingsPatch } from "../validators/settings.js";

export function createSettingsService(repository) {
  return {
    get() {
      return repository.get();
    },
    update(payload) {
      return repository.update(validateSettingsPatch(payload));
    },
  };
}
