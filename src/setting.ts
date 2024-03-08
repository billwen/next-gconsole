import {SettingSchema} from "@/schema";


const loadSystemSettings = (fromFile?: string) => {
  const s = SettingSchema.parse({
    route: {}
  });

  return s;
};

export const settings = loadSystemSettings();
