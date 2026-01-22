import { loadEnv, type Plugin, type UserConfig } from "vite";

/**
 * Plugin for Vite to configure the server for Code Server.
 * Automatically detects if it is running in Code Server and configures the server for HMR and allowed hosts accordingly.
 *
 * @param options - The options for the plugin. Defaults to the environment variables.
 * @returns The plugin.
 */

//#region types
type HmrConfig = Exclude<NonNullable<UserConfig["server"]>["hmr"], boolean>;
interface CustomServerConfigPluginOptions {
  coderAgentUrl: string | undefined;
  viteHmrConfigOverrides?: Partial<HmrConfig> & { base?: string };
}
//#endregion

//#region env
const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "development", process.cwd(), ""),
};
const runningInCodeServer =
  env.RUNNING_IN_CODE_SERVER === "true" || env.PATH?.includes("/code-server");
//#endregion

/**
 * Plugin for Vite to configure the server for Code Server.
 * Automatically detects if it is running in Code Server and configures the server for HMR and allowed hosts accordingly.
 *
 * @param {Object} options - The options for the plugin. Defaults to the environment variables.
 * @param {string} options.coderAgentUrl - The URL of the coder agent. Defaults to the environment variable CODER_AGENT_URL.
 * @param {Object} options.viteHmrConfigOverrides - The overrides for the Vite HMR config. Defaults to the environment variables.
 * @param {string} options.viteHmrConfigOverrides.protocol - The protocol for the HMR. Defaults to "wss".
 * @param {number} options.viteHmrConfigOverrides.port - The port for the HMR. Defaults to 3040.
 * @param {number} options.viteHmrConfigOverrides.clientPort - The client port for the HMR. Defaults to 443.
 * @param {string} options.viteHmrConfigOverrides.base - The base path for the HMR. Defaults to the environment variable ABS_PROXY_BASE_PATH.
 * @returns The plugin.
 */
export function codeServerVitePlugin(
  options?: CustomServerConfigPluginOptions
): Plugin | undefined {
  if (!runningInCodeServer) return;

  //default values
  options = {
    coderAgentUrl:
      options?.coderAgentUrl || isString(env.CODER_AGENT_URL)
        ? new URL(env.CODER_AGENT_URL as string).hostname
        : undefined,
    viteHmrConfigOverrides: {
      protocol: "wss",
      port: 3040,
      clientPort: 443,
      base: `${env.ABS_PROXY_BASE_PATH}/absproxy/${env.VITE_HMR_PORT || "3040"}/vite-dev`,
      ...(options?.viteHmrConfigOverrides || {}),
    },
  };

  if (!isString(options.coderAgentUrl)) {
    throw new Error("coderAgentUrl must be a string");
  }

  // Narrow the type after validation
  const coderAgentUrl: string = options.coderAgentUrl;

  return {
    name: "custom-server-config",
    config: (config: UserConfig): Partial<UserConfig> | void => {
      // Merge into existing server config (if any)
      return {
        server: {
          ...config.server,
          strictPort: true,
          hmr: applyHmrConfig(
            config.server?.hmr,
            options.viteHmrConfigOverrides
          ),
          allowedHosts: [
            ...(Array.isArray(config.server?.allowedHosts)
              ? config.server.allowedHosts
              : []),
            coderAgentUrl,
          ],
        },
      };
    },
    transform(code: string, id: string) {
      if (id.endsWith("client/client.mjs") || id.endsWith("client/env.mjs")) {
        code = code.replace(
          "__HMR_BASE__",
          `"${options.viteHmrConfigOverrides?.base}"`
        );

        return code;
      }

      return code;
    },
  };
}

//#region helpers
function applyHmrConfig(
  configHmr?: NonNullable<UserConfig["server"]>["hmr"],
  hmrOverrides?: NonNullable<UserConfig["server"]>["hmr"]
): NonNullable<UserConfig["server"]>["hmr"] {
  switch (true) {
    case typeof configHmr === "object" && typeof hmrOverrides === "object":
      return {
        ...configHmr,
        ...hmrOverrides,
      };
    case typeof configHmr === "object":
      return configHmr;
    case typeof hmrOverrides === "object":
      return hmrOverrides;
    default:
      return configHmr;
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
//#endregion
