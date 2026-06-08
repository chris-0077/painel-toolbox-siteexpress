import { useEffect, useState } from 'react'
import type { Item, ItemCode } from '@/types'

interface Props {
  item: Item
  codes: ItemCode[]
  onClose: () => void
}

export default function ItemModal({ item, codes, onClose }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'relative'
    document.body.style.top = '0'
    document.body.style.width = '100vw'
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.body.style.height = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.currentTarget === e.target) {
      onClose()
    }
  }

  async function copyToClipboard(text: string, codeId: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(codeId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        padding: '40px 20px',
        overflowY: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'var(--color-dark-card)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          border: '1px solid var(--color-border)',
          padding: '30px',
          marginBottom: '40px',
        }}
      >
        <div style={{ position: 'relative' }}>
          {item.preview_url ? (
            <img
              src={item.preview_url}
              alt={item.title}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--color-dark-lighter)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              Sem imagem
            </div>
          )}
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
            {codes.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>
                Nenhum código adicionado a este item.
              </p>
            ) : (
              codes.map((block) => (
                <div key={block.id} style={{ background: 'var(--color-dark-lighter)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>{block.label || 'Código'}</span>
                    <button
                      onClick={() => copyToClipboard(block.code, block.id)}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: copiedId === block.id ? '#22c55e' : 'var(--color-purple)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copiedId === block.id ? (
                        <>
                          <span>✓</span> Copiado!
                        </>
                      ) : (
                        'Copiar'
                      )}
                    </button>
                  </div>
                  {block.instruction && (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      {block.instruction}
                    </p>
                  )}
                  <pre style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflowX: 'auto', background: 'var(--color-dark)', borderRadius: '6px', padding: '10px', margin: 0 }}>
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}