import { useState } from "react"
import Terminal from "./Terminal"
import ResumeModal from "./ResumeModal"
import MenuBar from "./MenuBar"

interface DesktopIcon {
  icon: string
  label: string
  href?: string
}

interface DesktopProps {
  icons: DesktopIcon[]
  backgroundImage: string
  resumeContent?: string
}

export default function Desktop({ icons, backgroundImage, resumeContent = "" }: DesktopProps) {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalMinimized, setTerminalMinimized] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [resumeMinimized, setResumeMinimized] = useState(false)

  const handleIconClick = (icon: DesktopIcon) => {
    if (icon.label === "Terminal") {
      if (terminalMinimized) {
        setTerminalMinimized(false)
      } else {
        setTerminalOpen(true)
      }
    } else if (icon.label === "Resume.md") {
      if (resumeMinimized) {
        setResumeMinimized(false)
      } else {
        setResumeOpen(true)
      }
    }
  }

  const handleTerminalMinimize = () => {
    setTerminalMinimized(true)
  }

  const handleTerminalClose = () => {
    setTerminalOpen(false)
    setTerminalMinimized(false)
  }

  const handleResumeMinimize = () => {
    setResumeMinimized(true)
  }

  const handleResumeClose = () => {
    setResumeOpen(false)
    setResumeMinimized(false)
  }

  const getActiveApp = () => {
    if (terminalOpen && !terminalMinimized) return "Terminal"
    if (resumeOpen && !resumeMinimized) return "Resume.md"
    return "Finder"
  }

  return (
    <div
      className="flex h-full w-full flex-col bg-cover bg-left bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <MenuBar activeApp={getActiveApp()} />
      <main className="flex-1 p-4">
        <div
          className="flex flex-col flex-wrap content-end gap-2"
          style={{ height: "calc(100vh - 1.75rem - 2rem)" }}
        >
          {icons.map((item) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="flex w-24 cursor-pointer flex-col items-center gap-1 rounded-lg p-2 hover:bg-white/20 md:w-20"
              >
                <span className="material-symbols-outlined text-6xl text-white drop-shadow-lg md:text-5xl">
                  {item.icon}
                </span>
                <span className="text-center text-sm font-medium text-white drop-shadow-md md:text-xs">
                  {item.label}
                </span>
              </a>
            ) : (
              <button
                type="button"
                key={item.label}
                onClick={() => handleIconClick(item)}
                className="flex w-24 cursor-pointer flex-col items-center gap-1 rounded-lg p-2 hover:bg-white/20 md:w-20"
              >
                <span className="material-symbols-outlined text-6xl text-white drop-shadow-lg md:text-5xl">
                  {item.icon}
                </span>
                <span className="text-center text-sm font-medium text-white drop-shadow-md md:text-xs">
                  {item.label}
                </span>
              </button>
            )
          )}
        </div>

        {terminalOpen && !terminalMinimized && (
          <Terminal onClose={handleTerminalClose} onMinimize={handleTerminalMinimize} />
        )}

        {resumeOpen && !resumeMinimized && (
          <ResumeModal
            onClose={handleResumeClose}
            onMinimize={handleResumeMinimize}
            content={resumeContent}
          />
        )}
      </main>
    </div>
  )
}
