// provider.tsx

export function Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // HeroUIProvider sẽ được inject sau RouterProvider
}
