import { defineStore } from 'pinia'
import { ref } from 'vue'

export const THEME_CONFIGS = {
  spruce: {
    id: 'spruce',
    name: '鼠尾草松针绿',
    nameEn: 'Sage & Nordic Spruce',
    icon: '🌿',
    bg: '#f5f8f6',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    accent: '#d97706',
    success: '#10b981',
    border: '#0f172a',
    shadowColor: '#0d9488',
    tagBg: '#f0fdfa',
    tagText: '#0d9488',
    bgStyle: {
      backgroundColor: '#f5f8f6',
      backgroundImage: 'radial-gradient(rgba(13, 148, 136, 0.045) 1px, transparent 1px), linear-gradient(to right, rgba(13, 148, 136, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 148, 136, 0.015) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
    desc: '北欧极简森系，视网膜极度放松，无蓝光反光'
  },
  bonepaper: {
    id: 'bonepaper',
    name: '温润骨白纸手账',
    nameEn: 'Warm Bone Paper & Charcoal',
    icon: '📜',
    bg: '#f4f1ea',
    primary: '#334155',
    primaryHover: '#1e293b',
    accent: '#d97706',
    success: '#059669',
    border: '#1e293b',
    shadowColor: '#d97706',
    tagBg: '#fef3c7',
    tagText: '#92400e',
    bgStyle: {
      backgroundColor: '#f4f1ea',
      backgroundImage: 'radial-gradient(rgba(60, 64, 67, 0.04) 1px, transparent 1px), linear-gradient(to right, rgba(60, 64, 67, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(60, 64, 67, 0.015) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
    desc: '经典 Moleskine 骨白纸手账本质感，暖光零蓝光，复古沉静'
  },
  prussian: {
    id: 'prussian',
    name: '沉静深海黛蓝',
    nameEn: 'Prussian Navy & Slate',
    icon: '🌊',
    bg: '#f8fafc',
    primary: '#1e40af',
    primaryHover: '#1d4ed8',
    accent: '#d97706',
    success: '#059669',
    border: '#0f172a',
    shadowColor: '#1e40af',
    tagBg: '#eff6ff',
    tagText: '#1e40af',
    bgStyle: {
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(rgba(30, 64, 175, 0.04) 1px, transparent 1px), linear-gradient(to right, rgba(30, 64, 175, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 64, 175, 0.015) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
    desc: '严谨理工工程图纸感，低饱和不刺眼'
  }
}

export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem('ontime_theme') || 'spruce'
  const currentThemeId = ref(saved)

  const setTheme = (themeId) => {
    if (THEME_CONFIGS[themeId]) {
      currentThemeId.value = themeId
      localStorage.setItem('ontime_theme', themeId)
      applyThemeToDocument(themeId)
    }
  }

  const applyThemeToDocument = (themeId) => {
    const config = THEME_CONFIGS[themeId] || THEME_CONFIGS.spruce
    document.documentElement.style.setProperty('--brand-primary', config.primary)
    document.documentElement.style.setProperty('--brand-bg', config.bg)
    document.documentElement.style.setProperty('--brand-shadow', config.shadowColor)
  }

  // Initial call
  applyThemeToDocument(currentThemeId.value)

  return {
    currentThemeId,
    currentConfig: THEME_CONFIGS[currentThemeId.value] || THEME_CONFIGS.spruce,
    themes: THEME_CONFIGS,
    setTheme
  }
})
