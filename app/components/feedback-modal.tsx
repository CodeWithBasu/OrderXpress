"use client"

import { useState } from "react"
import { MessageSquare, Star, SmilePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function FeedbackModal({ source = "menu" }: { source?: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [name, setName] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !comments) {
      toast.error("Please fill in all fields.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comments, source }),
      })
      
      if (res.ok) {
        toast.success("Thank you for your feedback!")
        setOpen(false)
        setName("")
        setComments("")
        setRating(5)
      } else {
        toast.error("Failed to submit feedback. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0 bg-white/80 dark:bg-slate-900 border-orange-200 text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 dark:border-orange-500/30 dark:text-orange-400">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SmilePlus className="h-5 w-5 text-orange-500" />
            We Value Your Feedback
          </DialogTitle>
          <DialogDescription>
            Tell us about your experience so we can improve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <Label>How was your experience?</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? "fill-orange-400 text-orange-400" : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                placeholder="What did you love? What can we do better?"
                className="resize-none min-h-[100px]"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
