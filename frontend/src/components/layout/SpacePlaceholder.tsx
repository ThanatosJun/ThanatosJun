interface Props {
  spaceName: string
}

export default function SpacePlaceholder({ spaceName }: Props) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center opacity-40">
        <h1 className="text-4xl font-bold mb-4">{spaceName}</h1>
        <p>空間建構中，敬請期待</p>
      </div>
    </main>
  )
}
