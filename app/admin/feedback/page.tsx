"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Star, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeedbackItem {
  _id: string
  name: string
  rating: number
  comments: string
  source: string
  createdAt: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      try {
        const res = await fetch("/api/feedback")
        if (res.ok) {
          const data = await res.json()
          setFeedbacks(data)
        }
      } catch (e) {
        console.error("Failed to load feedback", e)
      } finally {
        setLoading(false)
      }
    }
    loadFeedback()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Customer Feedback</h1>
          <p className="text-muted-foreground">View and analyze feedback from your customers.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
           <p className="text-muted-foreground">Loading feedback...</p>
        ) : feedbacks.length === 0 ? (
           <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
             <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
             <p className="text-muted-foreground">No feedback received yet.</p>
           </div>
        ) : (
          feedbacks.map((item) => (
            <Card key={item._id} className="shadow-xs hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Badge variant={item.source === "menu" ? "secondary" : "default"} className="capitalize">
                    {item.source}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= item.rating ? "fill-orange-400 text-orange-400" : "text-slate-200 dark:text-slate-700"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {item.rating}.0
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{item.comments}"</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
