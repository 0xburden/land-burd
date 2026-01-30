import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(Draggable)

const ASCII_ART = `
 ██████╗ ██╗  ██╗██████╗ ██╗   ██╗██████╗ ██████╗ ███████╗███╗   ██╗
██╔═████╗╚██╗██╔╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔════╝████╗  ██║
██║██╔██║ ╚███╔╝ ██████╔╝██║   ██║██████╔╝██║  ██║█████╗  ██╔██╗ ██║
████╔╝██║ ██╔██╗ ██╔══██╗██║   ██║██╔══██╗██║  ██║██╔══╝  ██║╚██╗██║
╚██████╔╝██╔╝ ██╗██████╔╝╚██████╔╝██║  ██║██████╔╝███████╗██║ ╚████║
 ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═══╝
`

type ResizeDirection = "nw" | "ne" | "sw" | "se" | null

interface TerminalProps {
  onClose: () => void
  onMinimize: () => void
}

export default function Terminal({ onClose, onMinimize }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobileInitial = typeof window !== "undefined" && window.innerWidth < 768
  const [width, setWidth] = useState(isMobileInitial ? 100 : 50)
  const [height, setHeight] = useState(isMobileInitial ? 50 : 50)
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null)
  const [input, setInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [prevSize, setPrevSize] = useState({ width: isMobileInitial ? 100 : 50, height: 50 })

  useEffect(() => {
    if (terminalRef.current && headerRef.current) {
      Draggable.create(terminalRef.current, {
        trigger: headerRef.current,
        bounds: "body",
        inertia: true,
      })
    }
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleResizeMouseDown = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    if (isMaximized) return
    e.preventDefault()
    setIsResizing(direction)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = width
    const startHeight = height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      if (direction === "se" || direction === "ne") {
        newWidth = startWidth + (deltaX / window.innerWidth) * 100
      } else if (direction === "sw" || direction === "nw") {
        newWidth = startWidth - (deltaX / window.innerWidth) * 100
      }

      if (direction === "se" || direction === "sw") {
        newHeight = startHeight + (deltaY / window.innerHeight) * 100
      } else if (direction === "ne" || direction === "nw") {
        newHeight = startHeight - (deltaY / window.innerHeight) * 100
      }

      const isMobile = window.innerWidth < 768
      const maxWidth = isMobile ? 100 : 75
      setWidth(Math.min(maxWidth, Math.max(25, newWidth)))
      setHeight(Math.min(80, Math.max(25, newHeight)))
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim().toLowerCase() === "exit") {
        onClose()
      }
      setInput("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setInput(e.target.value)
    }
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setWidth(prevSize.width)
      setHeight(prevSize.height)
      setIsMaximized(false)
    } else {
      setPrevSize({ width, height })
      const isMobile = window.innerWidth < 768
      setWidth(isMobile ? 100 : 75)
      setHeight(80)
      setIsMaximized(true)
    }
  }

  const resizeHandleClass = "absolute h-4 w-4 border-0"

  return (
    <div
      ref={terminalRef}
      className={`absolute flex flex-col overflow-hidden rounded-lg ${isMaximized ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
      style={{
        width: `${width}vw`,
        height: `${height}vh`,
        fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Title bar */}
      <div
        ref={headerRef}
        className="flex h-7 shrink-0 cursor-grab items-center justify-between bg-[#3c3c3c]/90 px-3 backdrop-blur-sm active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
            aria-label="Close terminal"
          />
          <button
            type="button"
            onClick={onMinimize}
            className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80"
            aria-label="Minimize terminal"
          />
          <button
            type="button"
            onClick={handleMaximize}
            className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-80"
            aria-label="Maximize terminal"
          />
        </div>
        <span className="text-xs text-gray-400">0xburden — zsh</span>
        <div className="w-14" />
      </div>

      {/* Terminal content */}
      <label className="flex flex-1 cursor-text flex-col overflow-auto bg-[#1e1e1e]/50 p-4 text-green-400 backdrop-blur-sm">
        <pre className="overflow-x-auto text-[0.5rem] leading-tight sm:text-xs md:text-sm">
          {ASCII_ART}
        </pre>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-purple-400">~</span>
          <span className="text-white">$</span>
          <span className="text-green-400">{input}</span>
          <span className="animate-pulse">▋</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="sr-only"
          maxLength={100}
          aria-label="Terminal input"
        />
      </label>

      {/* Resize handles - all corners */}
      {!isMaximized && (
        <>
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("nw")}
            className={`${resizeHandleClass} left-0 top-0 cursor-nw-resize ${isResizing === "nw" ? "bg-white/20" : ""}`}
            aria-label="Resize terminal from top-left"
          />
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("ne")}
            className={`${resizeHandleClass} right-0 top-0 cursor-ne-resize ${isResizing === "ne" ? "bg-white/20" : ""}`}
            aria-label="Resize terminal from top-right"
          />
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("sw")}
            className={`${resizeHandleClass} bottom-0 left-0 cursor-sw-resize ${isResizing === "sw" ? "bg-white/20" : ""}`}
            aria-label="Resize terminal from bottom-left"
          />
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("se")}
            className={`${resizeHandleClass} bottom-0 right-0 cursor-se-resize ${isResizing === "se" ? "bg-white/20" : ""}`}
            style={{
              background: isResizing === "se"
                ? undefined
                : "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%)",
            }}
            aria-label="Resize terminal from bottom-right"
          />
        </>
      )}
    </div>
  )
}
