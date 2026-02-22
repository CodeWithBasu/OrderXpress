"use client"

import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react"
import { QrCode, Link as LinkIcon, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [menuUrl, setMenuUrl] = useState("")

  useEffect(() => {
    // Generate the exact URL based on where the app is hosted
    setMenuUrl(`${window.location.origin}/menu`)
  }, [])

  const handleDownloadQR = () => {
    const svg = document.getElementById("menu-qr-code")
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
      downloadLink.download = "OrderXpress-Menu-QRCode.png"
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your POS system and generate access points.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-orange-200/50 dark:border-orange-900/20 shadow-xs">
          <CardHeader className="bg-orange-50/50 dark:bg-orange-900/10 rounded-t-xl border-b border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              <CardTitle className="text-lg">Digital Menu QR Code</CardTitle>
            </div>
            <CardDescription>
              Print this QR code and place it on your tables so customers can browse your live menu from their phones.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                {menuUrl ? (
                  <QRCodeSVG 
                    id="menu-qr-code" 
                    value={menuUrl} 
                    size={200}
                    level="H"
                    includeMargin={false}
                    fgColor="#0f172a"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-slate-100 flex items-center justify-center rounded-xl animate-pulse" />
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button 
                  onClick={handleDownloadQR} 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(menuUrl, '_blank')}
                  className="w-full border-slate-300"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>General settings for the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-sm font-medium text-slate-500">More settings coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
