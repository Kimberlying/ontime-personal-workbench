// Self-hosted / Unrestricted Configuration

export const PLAN_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ULTIMATE: 'ultimate',
}

export const PLAN_LIMITS = {
  [PLAN_TIERS.FREE]: {
    name: '个人工作台',
    maxActiveProjects: Infinity,
    maxDailyDecompositions: Infinity,
    maxCollaborators: Infinity,
    maxAttachmentSize: 50 * 1024 * 1024, // 50 MB
    maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50 GB
    allowCsvExport: true,
  },
  [PLAN_TIERS.PRO]: {
    name: '个人工作台',
    maxActiveProjects: Infinity,
    maxDailyDecompositions: Infinity,
    maxCollaborators: Infinity,
    maxAttachmentSize: 50 * 1024 * 1024,
    maxStorageBytes: 50 * 1024 * 1024 * 1024,
    allowCsvExport: true,
  },
  [PLAN_TIERS.ULTIMATE]: {
    name: '个人工作台',
    maxActiveProjects: Infinity,
    maxDailyDecompositions: Infinity,
    maxCollaborators: Infinity,
    maxAttachmentSize: 100 * 1024 * 1024,
    maxStorageBytes: 100 * 1024 * 1024 * 1024,
    allowCsvExport: true,
  },
}

/**
 * Format bytes to readable string (KB, MB, GB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function canCreateProject() {
  return true
}

export function canDecomposeTasks() {
  return true
}

export function checkAttachmentLimit(fileSize) {
  const maxAttachmentSize = 50 * 1024 * 1024
  if (fileSize > maxAttachmentSize) {
    return {
      allowed: false,
      reason: `该文件大小 (${formatBytes(fileSize)}) 超出单文件上限 50MB`,
    }
  }
  return { allowed: true }
}

export function canInviteMembers() {
  return { allowed: true }
}
