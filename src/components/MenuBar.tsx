interface MenuBarProps {
  activeApp: string
}

export default function MenuBar({ activeApp }: MenuBarProps) {
  const currentDate = new Date()
  const timeString = currentDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  const dateString = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <header className="flex h-7 w-full items-center justify-between bg-white/20 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>
          skull
        </span>
        <span className="text-sm font-semibold text-white">{activeApp}</span>
        <nav className="hidden items-center gap-4 text-sm text-white/90 md:flex">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-sm text-white">
        <span>{dateString}</span>
        <span>{timeString}</span>
      </div>
    </header>
  )
}
