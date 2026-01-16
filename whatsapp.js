const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const qrcode = require('qrcode-terminal')

async function startWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false // ❌ deprecated option بند
  })

  // creds save
  sock.ev.on('creds.update', saveCreds)

  // connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update

    // ✅ QR TERMINAL ME SHOW
    if (qr) {
      console.log('\n📲 Scan this QR from WhatsApp → Linked Devices\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp CONNECTED & LINKED')
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log('❌ Disconnected. Reconnecting...', reason)
      startWhatsApp()
    }
  })
}

startWhatsApp()
