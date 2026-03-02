"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoggingIn, loginError, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      await login({ email, password })
      const { role } = user!
      // On attend que le hook useAuth mette à jour user
      setTimeout(() => {
        if (role === "agent") {
          router.replace("/agent")
        } else if (role === "admin") {
          router.replace("/admin")
        } else {
          router.replace("/feed")
        }
      }, 300)
      // Note : ce timeout est un contournement simple pour attendre le refresh du user dans le hook. Pour une vraie solution, il faudrait améliorer le hook pour retourner le user après login.
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.detail || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image src="/logo/logo_civix.png" alt="logo_civix" className="rounded-xl" width={40} height={40}/>
              <span className="text-xl font-bold">CIVIX</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Bienvenue sur CIVIX</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="/reset-password" className="text-sm text-primary hover:underline">
                    Mot de passe oublié?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

              <Button className="w-full mt-2" size="lg" disabled={isLoggingIn}>
                {isLoggingIn ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Vous n&apos;avez pas encore de compte?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
