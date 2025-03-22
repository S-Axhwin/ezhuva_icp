import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {theme === "dark" ? (
        <Button
          onClick={() => setTheme("light")}
          variant={"secondary"}
          title="Switch to light mode"
          aria-label="Switch to light mode"
        >
          <Sun />
        </Button>
      ) : (
        <Button
          onClick={() => setTheme("dark")}
          variant={"secondary"}
          title="Switch to dark mode"
          aria-label="Switch to dark mode"
        >
          <Moon />
        </Button>
      )}
    </>
  )
}
