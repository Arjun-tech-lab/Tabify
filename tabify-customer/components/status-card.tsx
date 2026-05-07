"use client"

import { motion } from "framer-motion"

interface StatusCardProps {
  step: number
  title: string
  icon: string
  completed: boolean
}

export default function StatusCard({ step, title, icon, completed }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
        completed ? "bg-primary/5 border-primary" : "bg-muted/30 border-border"
      }`}
    >
      <motion.div
        animate={completed ? { scale: 1 } : { scale: 1 }}
        className={`text-4xl flex-shrink-0 ${completed ? "opacity-100" : "opacity-60"}`}
      >
        {icon}
      </motion.div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Step {step}</p>
        <p className="font-semibold text-foreground">{title}</p>
      </div>
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm"
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  )
}
