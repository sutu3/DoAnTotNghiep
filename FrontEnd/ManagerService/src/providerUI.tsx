// provider.tsx

export function ProviderUI({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // HeroUIProvider sẽ được inject sau RouterProvider
}
