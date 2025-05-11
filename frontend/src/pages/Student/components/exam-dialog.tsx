"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertTriangle, Clock, HelpCircle, Info } from "lucide-react"

interface ExamDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  type?: "success" | "warning" | "info" | "time" | "help"
}

export function ExamDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText = "Continue",
  cancelText = "Cancel",
  showCancel = false,
  type = "info",
}: ExamDialogProps) {
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (open) {
      setAnimateIn(true)
    }
  }, [open])

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          headerClass: "",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        }
      case "warning":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-amber-500" />,
          headerClass: "",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        }
      case "time":
        return {
          icon: <Clock className="h-12 w-12 text-blue-500" />,
          headerClass: "",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        }
      case "help":
        return {
          icon: <HelpCircle className="h-12 w-12 text-purple-500" />,
          headerClass: "",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        }
      case "info":
      default:
        return {
          icon: <Info className="h-12 w-12 text-blue-500" />,
          headerClass: "",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        }
    }
  }

  const { icon, buttonClass } = getIconAndColors()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-lg shadow-xl bg-white">
        <DialogHeader className={`p-6 flex flex-row items-center gap-4`}>
          <div className={`${animateIn ? "animate-bounce-once" : ""}`}>{icon}</div>
          <div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="mt-1 text-base">{description}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-2">
          {showCancel && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              if (onConfirm) onConfirm()
              onOpenChange(false)
            }}
            className={`w-full sm:w-auto ${buttonClass}`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
