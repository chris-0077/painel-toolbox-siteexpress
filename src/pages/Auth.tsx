import { useState } from 'react'
import logo from '@/assets/logo.png'

type AuthMode = 'login' | 'register' | 'reset'

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}

    if (!form.email.trim()) {
      errs.email = 'Email obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Email inválido'
    }

    if (mode === 'register') {
      if (!form.name.trim()) errs.name = 'Nome obrigatório'
      if (!form.password) {
        errs.password = 'Senha obrigatória'
      } else if (form.password.length < 8) {
        errs.password = 'Mínimo 8 caracteres'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        errs.password = 'Use maiúscula, minúscula e número'
      }
      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Senhas não coincidem'
      }
    }

    if (mode === 'login') {
      if (!form.password) errs.password = 'Senha obrigatória'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    alert(`${mode} (mock) — email: ${form.email}`)
  }

  function switchMode(newMode: AuthMode) {
    setMode(newMode)
    setErrors({})
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
  }

  const titles: Record<AuthMode, string> = {
    login: 'Entrar',
    register: 'Criar conta',
    reset: 'Redefinir senha',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="Site Express" style={{ width: '160px', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>{titles[mode]}</h1>
          {mode === 'reset' && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Informe seu email para receber o link de redefinição
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.name ? '#f87171' : 'var(--color-border)'}`, background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
                placeholder="Seu nome"
              />
              {errors.name && <span style={{ fontSize: '11px', color: '#f87171' }}>{errors.name}</span>}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.email ? '#f87171' : 'var(--color-border)'}`, background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
              placeholder="seu@email.com"
            />
            {errors.email && <span style={{ fontSize: '11px', color: '#f87171' }}>{errors.email}</span>}
          </div>

          {mode !== 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '8px', border: `1px solid ${errors.password ? '#f87171' : 'var(--color-border)'}`, background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '13px' }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '11px', color: '#f87171' }}>{errors.password}</span>}
            </div>
          )}

          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Confirmar senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                autoComplete="new-password"
                style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.confirmPassword ? '#f87171' : 'var(--color-border)'}`, background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span style={{ fontSize: '11px', color: '#f87171' }}>{errors.confirmPassword}</span>}
            </div>
          )}

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('reset')}
              style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--color-purple-light)', fontSize: '12px', cursor: 'pointer', marginTop: '-8px' }}
            >
              Esqueceu a senha?
            </button>
          )}

          <button
            type="submit"
            style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-purple)', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s' }}
          >
            {titles[mode]}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {mode === 'login' && (
            <>
              Não tem conta?{' '}
              <button onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: 'var(--color-purple-light)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                Criar conta
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              Já tem conta?{' '}
              <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--color-purple-light)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                Entrar
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--color-purple-light)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
              Voltar ao login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
