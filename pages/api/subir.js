import { IncomingForm } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import http from 'http'
import https from 'https'
import { supabase } from '../../lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const metadata = data.fields

  try {
    // Si es un video, solo guardamos el link y ya
    if (metadata.es_video[0] === 'true') {
      const { error } = await supabase.from('archivos').insert([{
        titulo: metadata.titulo[0],
        clase: metadata.clase[0].toUpperCase(),
        facultad: metadata.facultad[0],
        public_link: metadata.public_link[0],
        es_video: true
      }])
      if (error) throw error
      return res.status(200).json({ success: true })
    }

    // Si es un archivo, hacemos el proceso de Telegram
    const archivo = data.files.file[0]
    const stream = fs.createReadStream(archivo.filepath)
    const formData = new FormData()
    formData.append('document', stream)

    const telegramRes = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument?chat_id=${process.env.TELEGRAM_CHANNEL_ID}`,
      formData,
      {
        headers: formData.getHeaders(),
        httpsAgent: new https.Agent({ family: 4 }),
        httpAgent: new http.Agent({ family: 4 }),
      }
    )

    const messageId = telegramRes.data.result.message_id
    const channelUsername = "Reporte_Unah_files"
    const publicLink = `https://t.me/${channelUsername}/${messageId}`

    const { error } = await supabase.from('archivos').insert([{
      titulo: metadata.titulo[0],
      clase: metadata.clase[0].toUpperCase(),
      facultad: metadata.facultad[0],
      public_link: publicLink,
      file_id: telegramRes.data.result.document.file_id,
      es_video: false
    }])
    if (error) throw error

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('Error en API:', error.response?.data || error.message)
    return res.status(500).json({ error: 'Error interno en el servidor' })
  }
}