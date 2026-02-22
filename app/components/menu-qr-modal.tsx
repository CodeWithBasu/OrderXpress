"use client"

import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react"
import { QrCode, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MenuQRCodeModal() {
  const [menuUrl, setMenuUrl] = useState("")

  useEffect(() => {
    // Generate the exact URL based on where the app is hosted
    setMenuUrl(`${window.location.origin}/menu`)
  }, [])

  const handleDownloadQR = () => {
    const svg = document.getElementById("pos-menu-qr")
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width + 40
      canvas.height = img.height + 40
      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 20, 20)
      }
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "OrderXpress-Menu.png"
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 dark:hover:bg-indigo-500/20">
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Menu QR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Menu Access</DialogTitle>
          <DialogDescription>
            Customers can scan this QR code to view the live menu on their own devices.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-slate-200 aspect-square">
            {menuUrl ? (
              <QRCodeSVG 
                id="pos-menu-qr" 
                value={menuUrl} 
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#0f172a"
              />
            ) : (
              <div className="w-[220px] h-[220px] bg-slate-100 rounded-2xl animate-pulse" />
            )}
          </div>
          <Button onClick={handleDownloadQR} className="w-full max-w-xs gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
