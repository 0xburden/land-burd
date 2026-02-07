import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import Markdown from "react-markdown"

gsap.registerPlugin(Draggable)

type ResizeDirection = "nw" | "ne" | "sw" | "se" | null

interface ResumeModalProps {
  onClose: () => void
  onMinimize: () => void
  content: string
}

export default function ResumeModal({ onClose, onMinimize, content }: ResumeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isMobileInitial = typeof window !== "undefined" && window.innerWidth < 768
  const [width, setWidth] = useState(isMobileInitial ? 100 : 60)
  const [height, setHeight] = useState(isMobileInitial ? 60 : 70)
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [prevSize, setPrevSize] = useState({ width: isMobileInitial ? 100 : 60, height: isMobileInitial ? 60 : 70 })

  useEffect(() => {
    if (modalRef.current && headerRef.current) {
      Draggable.create(modalRef.current, {
        trigger: headerRef.current,
        bounds: "body",
        inertia: true,
      })
    }
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
      const maxWidth = isMobile ? 100 : 80
      setWidth(Math.min(maxWidth, Math.max(30, newWidth)))
      setHeight(Math.min(85, Math.max(30, newHeight)))
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setWidth(prevSize.width)
      setHeight(prevSize.height)
      setIsMaximized(false)
    } else {
      setPrevSize({ width, height })
      const isMobile = window.innerWidth < 768
      setWidth(isMobile ? 100 : 80)
      setHeight(85)
      setIsMaximized(true)
    }
  }

  const resizeHandleClass = "absolute h-4 w-4 border-0"

  return (
    <div
      ref={modalRef}
      className={`absolute flex flex-col overflow-hidden rounded-lg ${isMaximized ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
      style={{
        width: `${width}vw`,
        height: `${height}vh`,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Title bar */}
      <div
        ref={headerRef}
        className="flex h-8 shrink-0 cursor-grab items-center justify-between bg-[#3c3c3c]/90 px-3 backdrop-blur-sm active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
            aria-label="Close resume"
          />
          <button
            type="button"
            onClick={onMinimize}
            className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80"
            aria-label="Minimize resume"
          />
          <button
            type="button"
            onClick={handleMaximize}
            className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-80"
            aria-label="Maximize resume"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-gray-400">description</span>
          <span className="text-sm text-gray-300">Resume.md</span>
        </div>
        <div className="w-14" />
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col bg-[#1e1e1e]/95 backdrop-blur-sm">
        {/* Toolbar */}
        <div className="flex h-8 items-center gap-2 border-b border-gray-700/50 bg-[#2d2d2d]/50 px-3">
          <span className="text-xs text-gray-500">Markdown</span>
          <span className="text-gray-600">|</span>
          <span className="text-xs text-gray-400">Preview</span>
        </div>

        {/* Markdown content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="prose prose-invert prose-sm max-w-none font-mono">
            <Markdown
              components={{
                h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold text-gray-100">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-semibold text-gray-200">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-300">{children}</h3>,
                p: ({ children }) => <p className="mb-2 text-gray-300">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-gray-200">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                ul: ({ children }) => <ul className="mb-4 list-inside list-disc">{children}</ul>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                hr: () => <hr className="my-4 border-gray-600" />,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>

      {/* Resize handles - all corners */}
      {!isMaximized && (
        <>
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("nw")}
            className={`${resizeHandleClass} left-0 top-0 cursor-nw-resize ${isResizing === "nw" ? "bg-white/20" : ""}`}
            aria-label="Resize from top-left"
          />
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("ne")}
            className={`${resizeHandleClass} right-0 top-0 cursor-ne-resize ${isResizing === "ne" ? "bg-white/20" : ""}`}
            aria-label="Resize from top-right"
          />
          <button
            type="button"
            onMouseDown={handleResizeMouseDown("sw")}
            className={`${resizeHandleClass} bottom-0 left-0 cursor-sw-resize ${isResizing === "sw" ? "bg-white/20" : ""}`}
            aria-label="Resize from bottom-left"
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
            aria-label="Resize from bottom-right"
          />
        </>
      )}
    </div>
  )
}
