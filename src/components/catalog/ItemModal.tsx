import { useEffect } from 'react'
import type { Item } from '@/types'

interface CodeBlock {
  label: string
  instruction: string
  code: string
}

const mockCodeBlocks: CodeBlock[] = [
  { label: 'HTML', instruction: 'Cole no widget HTML do Elementor', code: '<div class="hero-section">\n  <h1>Título aqui</h1>\n</div>' },
  { label: 'CSS', instruction: 'Cole no CSS personalizado do Elementor (Configurações > CSS)', code: '.hero-section {\n  background: linear-gradient(135deg, #1a1a2e, #16213e);\n  padding: 80px 40px;\n}' },
]

interface Props {
  item: Item
  onClose: () => void
}

export default function ItemModal({ item, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--color-dark-card)', borderRadius: '16px', width: '90%', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', padding: '30px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={item.preview_url}
            alt={item.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
          />
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>
            {item.title}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {mockCodeBlocks.map((block, index) => (
              <div key={index} style={{ background: 'var(--color-dark-lighter)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>{block.label}</span>
                  <button
                    onClick={() => copyToClipboard(block.code)}
                    style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'var(--color-purple)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Copiar
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  {block.instruction}
                </p>
                <pre style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflowX: 'auto', background: 'var(--color-dark)', borderRadius: '6px', padding: '10px', margin: 0 }}>
                  <code>{block.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
