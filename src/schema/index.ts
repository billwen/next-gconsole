import * as z from 'zod';

export const RouteSettingSchema = z.object({
  /**
   * The default redirect path after a successful login.
   * @type {string}
   */
  defaultLoginRedirectUrl: z.string().default("/")
});

export type RouteSettings = z.infer<typeof RouteSettingSchema>;

export const SettingSchema = z.object({
  route: RouteSettingSchema
});

export type Settings = z.infer<typeof SettingSchema>;
