import { defineStore } from 'pinia'
import { supabase, isRealSupabaseConfigured, mockClient } from '../utils/supabase'
import { PLAN_TIERS, PLAN_LIMITS } from '../utils/planLimits'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    isMockMode: !isRealSupabaseConfigured,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    planType: () => PLAN_TIERS.PRO,
    isPro: () => true,
    isUltimate: () => true,
    planDetails: () => PLAN_LIMITS[PLAN_TIERS.PRO],
    usedStorage: (state) => state.profile?.used_storage || 0,
    isBetaTrial: () => false,
    trialDaysRemaining: () => 0,
  },

  actions: {
    async initAuth() {
      this.loading = true
      try {
        if (isRealSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            this.user = session.user
            await this.fetchProfile(session.user.id)
          } else {
            const mockProfile = mockClient.getProfile()
            this.user = {
              id: mockProfile.id || 'owner-001',
              email: mockProfile.email || 'me@workspace.local',
            }
            this.profile = mockProfile
          }
        } else {
          // Initialize default local user
          const mockProfile = mockClient.getProfile()
          this.user = {
            id: mockProfile.id || 'owner-001',
            email: mockProfile.email || 'me@workspace.local',
          }
          this.profile = mockProfile
        }
      } catch (err) {
        console.error('Failed to init auth:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchProfile(userId) {
      if (isRealSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (data) {
          this.profile = data
        } else if (error) {
          console.error('Error fetching profile:', error)
        }
      } else {
        this.profile = mockClient.getProfile()
      }
    },

    async updateStorageUsage(deltaBytes) {
      if (!this.profile) return
      const current = this.profile.used_storage || 0
      const newStorage = Math.max(0, current + deltaBytes)
      this.profile.used_storage = newStorage

      if (isRealSupabaseConfigured && supabase && this.user) {
        await supabase
          .from('profiles')
          .update({ used_storage: newStorage })
          .eq('id', this.user.id)
      } else {
        mockClient.setProfile(this.profile)
      }
    },

    async signIn(email, password) {
      this.loading = true
      try {
        if (isRealSupabaseConfigured && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          this.user = data.user
          await this.fetchProfile(data.user.id)
          return { success: true }
        } else {
          // Local/Mock login
          this.user = { id: 'owner-001', email }
          this.profile = {
            ...mockClient.getProfile(),
            email,
          }
          mockClient.setProfile(this.profile)
          return { success: true }
        }
      } catch (err) {
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async signInWithMock(email = 'me@workspace.local') {
      this.loading = true
      try {
        this.user = { id: 'owner-001', email }
        this.profile = {
          ...mockClient.getProfile(),
          id: 'owner-001',
          email,
          plan_type: 'pro',
          subscription_status: 'active',
        }
        mockClient.setProfile(this.profile)
        return { success: true }
      } finally {
        this.loading = false
      }
    },

    async signUp(email, password) {
      this.loading = true
      try {
        if (isRealSupabaseConfigured && supabase) {
          const { data, error } = await supabase.auth.signUp({ email, password })
          if (error) throw error
          this.user = data.user
          await this.fetchProfile(data.user.id)
          return { success: true }
        } else {
          // Local registration
          this.user = { id: `user_${Date.now()}`, email }
          this.profile = {
            id: this.user.id,
            email,
            plan_type: 'pro',
            subscription_status: 'active',
            used_storage: 0,
            created_at: new Date().toISOString(),
          }
          mockClient.setProfile(this.profile)
          return { success: true }
        }
      } catch (err) {
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      if (isRealSupabaseConfigured && supabase) {
        await supabase.auth.signOut()
      }
      this.user = null
      this.profile = null
    }
  },
})
