import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Subir() {
  const router = useRouter()
  const [subiendo, setSubiendo] = useState(false)
  const [tipoAporte, setTipoAporte] = useState('documento') // 'documento' o 'video'

  async function handleSubmit(e) {
    e.preventDefault()
    setSubiendo(true)

    const form = e.target
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/subir', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        alert('¡Gracias maje! Tu aporte ya está en el repositorio.')
        router.push('/')
      } else {
        const errorData = await res.json()
        alert('Error: ' + (errorData.error || 'No se pudo subir. El archivo puede ser muy grande.'))
      }
    } catch (error) {
      alert('Error de conexión con el servidor')
    }
    setSubiendo(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Subir Aporte 📤</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">¿Qué vas a subir?</label>
            <div className="flex rounded-lg border p-1">
              <button type="button" onClick={() => setTipoAporte('documento')} className={`w-1/2 p-2 rounded ${tipoAporte === 'documento' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Documento</button>
              <button type="button" onClick={() => setTipoAporte('video')} className={`w-1/2 p-2 rounded ${tipoAporte === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Video de YouTube</button>
            </div>
            <input type="hidden" name="es_video" value={tipoAporte === 'video'} />
          </div>

          <input name="titulo" required type="text" placeholder="Nombre del Archivo (Ej: Pauta Examen I)" className="w-full p-3 border rounded-lg text-gray-900 bg-white" />
          <div className="grid grid-cols-2 gap-4">
            <input name="clase" required type="text" placeholder="Código Clase (Ej: MM110)" className="w-full p-3 border rounded-lg uppercase text-gray-900 bg-white" />
            <select name="facultad" className="w-full p-3 border rounded-lg text-gray-900 bg-white">
              <option value="Generales">Generales</option>
              <option value="Ingenieria">Ingeniería</option>
              <option value="Salud">Salud</option>
              <option value="Economicas">Económicas</option>
              <option value="Sociales">Sociales</option>
              <option value="Humanidades">Humanidades</option>
            </select>
          </div>

          {tipoAporte === 'video' ? (
            <input name="public_link" required type="url" placeholder="Pega el link de YouTube aquí..." className="w-full p-3 border rounded-lg text-gray-900 bg-white" />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" name="file" required className="w-full text-sm text-gray-500" />
            </div>
          )}

          <button type="submit" disabled={subiendo} className={`w-full py-3 rounded-lg font-bold text-white transition ${subiendo ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-800'}`}>
            {subiendo ? 'Subiendo...' : 'ENVIAR APORTE 🚀'}
          </button>
          <Link href="/" className="block text-center text-gray-500 text-sm hover:underline">Volver al inicio</Link>
        </form>
      </div>
    </div>
  )
}