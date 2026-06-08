import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Item, Category } from '@/types'

interface Props {
  item: Item
  onBack: () => void
  onSave: () => void
}

interface CodeBlock {
  id: string
  label: string
  instruction: string
  code: string
}

export default function AdminEditItem({ item, onBack, onSave }: Props) {
  const [form, setForm] = useState({
    title: item.title,
    description: item.description,
    preview_url: item.preview_url,
    category_id: item.category_id,
  })
  const [previewMode, setPreviewMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { id: '1', label: '', instruction: '', code: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
    fetchCodes()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data) setCategories(data)
  }

  async function fetchCodes() {
    const { data } = await supabase
      .from('codes')
      .select('*')
      .eq('parent_item_id', item.id)

    if (data && data.length > 0) {
      setCodeBlocks(data.map((c) => ({
        id: c.id,
        label: c.label || '',
        instruction: c.instruction || '',
        code: c.code || '',
      })))
    }
  }

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

  async function handleSave() {
    if (!form.title || !form.category_id) {
      alert('Preencha o nome e selecione uma categoria.')
      return
    }

    setSaving(true)
    try {
      // Atualizar item
      const { error: itemError } = await supabase
        .from('items')
        .update({
          title: form.title,
          description: form.description,
          preview_url: form.preview_url,
          category_id: form.category_id,
        })
        .eq('id', item.id)

      if (itemError) throw itemError

      // Deletar códigos antigos
      await supabase.from('codes').delete().eq('parent_item_id', item.id)

      // Inserir novos códigos
      const validCodeBlocks = codeBlocks.filter((b) => b.code.trim())
      if (validCodeBlocks.length > 0) {
        const codesToInsert = validCodeBlocks.map((b) => ({
          parent_item_id: item.id,
          label: b.label,
          instruction: b.instruction,
          code: b.code,
        }))

        await supabase.from('codes').insert(codesToInsert)
      }

      alert('Item atualizado com sucesso!')
      onSave()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao atualizar item. Verifique o console.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este item?')) return

    try {
      await supabase.from('codes').delete().eq('parent_item_id', item.id)
      await supabase.from('items').delete().eq('id', item.id)
      alert('Item excluído!')
      onSave()
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir item.')
    }
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem.')
      return
    }

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setForm({ ...form, preview_url: result })
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem.')
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--color-dark-lighter)', color: 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
        >
          ← Voltar
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>
          Editar Item
        </h2>
      </div>

      <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Nome</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
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
              {categories.filter((c) => c.parent_id !== null).map((cat) => (
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
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Imagem de Preview</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={() => { setPreviewMode('url'); setForm({ ...form, preview_url: '' }) }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: previewMode === 'url' ? 'var(--color-purple)' : 'var(--color-dark-lighter)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              URL
            </button>
            <button
              onClick={() => { setPreviewMode('upload'); setForm({ ...form, preview_url: '' }) }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: previewMode === 'upload' ? 'var(--color-purple)' : 'var(--color-dark-lighter)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Upload
            </button>
          </div>

          {previewMode === 'url' ? (
            <input
              type="text"
              value={form.preview_url}
              onChange={(e) => setForm({ ...form, preview_url: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
              placeholder="https://..."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px dashed var(--color-border)',
                  background: 'var(--color-dark-lighter)',
                  color: 'var(--color-text-muted)',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {uploading ? 'Enviando...' : form.preview_url ? '✓ Imagem carregada - clique para trocar' : '📁 Clique para selecionar imagem'}
              </button>
              {form.preview_url && (
                <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={form.preview_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}
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
            disabled={saving}
            style={{ padding: '10px 20px', borderRadius: '8px', background: saving ? '#6b7280' : 'var(--color-purple)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            onClick={handleDelete}
            style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            Excluir Item
          </button>
        </div>
      </div>
    </div>
  )
}