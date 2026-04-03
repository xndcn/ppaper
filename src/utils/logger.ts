/* eslint-disable no-console */
/**
 * 日志工具 — 生产环境静默，开发环境输出到控制台。
 *
 * 这是项目中唯一允许使用 console.* 的地方，
 * ESLint 的 `no-console: error` 规则在其他业务文件中生效。
 */

interface Logger {
  log: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const isDev = import.meta.env.DEV;

const noopLogger: Logger = {
  log: () => undefined,
  debug: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

const devLogger: Logger = {
  log: (...args: unknown[]): void => {
    console.log('[PPaper]', ...args);
  },
  debug: (...args: unknown[]): void => {
    console.debug('[PPaper][DEBUG]', ...args);
  },
  warn: (...args: unknown[]): void => {
    console.warn('[PPaper][WARN]', ...args);
  },
  error: (...args: unknown[]): void => {
    console.error('[PPaper][ERROR]', ...args);
  },
};

export const logger: Logger = isDev ? devLogger : noopLogger;
