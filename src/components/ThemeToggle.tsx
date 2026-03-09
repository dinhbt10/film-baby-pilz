import type { ComponentType } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

const options: { value: "light" | "dark" | "system"; icon: ComponentType<{ className?: string }> }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors touch-manipulation",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={value === "light" ? "Sáng" : value === "dark" ? "Tối" : "Theo hệ thống"}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
