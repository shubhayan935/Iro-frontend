export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-30"
        style={{
          backgroundImage: `/background-red.png`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}

