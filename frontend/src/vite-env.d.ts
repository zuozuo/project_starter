/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 服务地址 */
  readonly VITE_API_URL: string
  /** 应用名称 */
  readonly VITE_APP_NAME?: string
  /** 是否启用 AI 功能 */
  readonly VITE_ENABLE_AI_FEATURES?: string
  /** 环境标识 */
  readonly MODE: string
  /** 是否为开发环境 */
  readonly DEV: boolean
  /** 是否为生产环境 */
  readonly PROD: boolean
  /** 是否为 SSR 模式 */
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
