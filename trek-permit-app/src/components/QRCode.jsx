import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function PermitQRCode({ url, size = 200 }) {
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(url, { width: size, margin: 1, color: { dark: '#20241F', light: '#FBFAF4' } })
      .then((d) => !cancelled && setDataUrl(d))
      .catch(() => !cancelled && setDataUrl(null))
    return () => {
      cancelled = true
    }
  }, [url, size])

  if (!dataUrl) {
    return <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-canvas" />
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={dataUrl} alt={`QR code linking to ${url}`} width={size} height={size} className="rounded-lg" />
      <a href={dataUrl} download="permit-qr.png" className="text-xs font-medium text-moss-dark underline">
        Download QR
      </a>
    </div>
  )
}
