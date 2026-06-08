import { useState } from 'react'
import { mockCategories } from '@/data/mock'

interface CodeBlock {
  id: string
  label: string
  instruction: string
  code: string
}

export default function AdminNewItem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    preview_url: '',
    category_id: '',
  })
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { id: '1', label: '', instruction: '', code: '' },
  ])

  function addCodeBlock() {
    setCodeBlocks([...codeBlocks, { id: Date.now().toString(), label: '', instruction: '', code: '' }])
  }

  function removeCodeBlock(id: string) {
    if (codeBlocks.length === 1) return
    setCodeBlocks(codeBlocks.filter((b) => b.id !== id))
  }

  function updateCodeBlock(id: string, field: 'label' | 'instruction' | 'code', value: string) {
    setCodeBlocks(codeBlocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  function handleSave() {
    alert('Item salvo (mock)')
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '24px' }}>
        Novo Item
      </h2>

      <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Nome</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
              placeholder="Nome do template"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Categoria</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
            >
              <option value="">Selecione...</option>
              {mockCategories.filter((c) => c.parent_id !== null).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Descrição</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
            placeholder="Descrição curta do item"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>URL da Preview (imagem)</label>
          <input
            type="text"
            value={form.preview_url}
            onChange={(e) => setForm({ ...form, preview_url: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
            placeholder="https://..."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Códigos</label>
            <button
              onClick={addCodeBlock}
              style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', background: 'var(--color-dark-lighter)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', cursor: 'pointer', fontWeight: 500 }}
            >
              + Adicionar código
            </button>
          </div>
          {codeBlocks.map((block, index) => (
            <div key={block.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--color-dark-lighter)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace', width: '20px' }}>#{index + 1}</span>
                <input
                  type="text"
                  value={block.label}
                  onChange={(e) => updateCodeBlock(block.id, 'label', e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-card)', fontSize: '14px', color: 'var(--color-text)' }}
                  placeholder="Label (ex: HTML, CSS, JS...)"
                />
                <button
                  onClick={() => copyToClipboard(block.code)}
                  style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '8px', background: 'var(--color-purple)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  Copiar
                </button>
                {codeBlocks.length > 1 && (
                  <button
                    onClick={() => removeCodeBlock(block.id)}
                    style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Remover
                  </button>
                )}
              </div>
              <input
                type="text"
                value={block.instruction}
                onChange={(e) => updateCodeBlock(block.id, 'instruction', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-card)', fontSize: '14px', color: 'var(--color-text)' }}
                placeholder="Instrução (ex: Cole no CSS do Elementor)"
              />
              <textarea
                value={block.code}
                onChange={(e) => updateCodeBlock(block.id, 'code', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-card)', fontSize: '12px', color: 'var(--color-text)', fontFamily: 'monospace', minHeight: '100px', resize: 'vertical' }}
                placeholder="Cole o código aqui..."
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
          <button
            onClick={handleSave}
            style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--color-purple)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            Salvar Item
          </button>
        </div>
      </div>
    </div>
  )
}
