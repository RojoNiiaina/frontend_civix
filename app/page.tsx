import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, Shield, MessageSquare, BarChart3 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CIVIX</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#impact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Impact
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              À propos
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
            Votre voix, votre ville
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Connectez-vous, signalez, transformez votre communauté
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
            CIVIX est une plateforme sociale civique qui permet aux citoyens de signaler des problèmes, de s'engager avec leur communauté et de créer un réel changement ensemble.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Rejoindre CIVIX
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Explorer le fil
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="border-y border-border bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">12.5K+</div>
              <div className="text-sm text-muted-foreground">Problèmes signalés</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">8.2K</div>
              <div className="text-sm text-muted-foreground">Problèmes résolus</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">25K+</div>
              <div className="text-sm text-muted-foreground">Citoyens actifs</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">94%</div>
              <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Tout ce dont vous avez besoin pour l'engagement civique
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Des fonctionnalités puissantes conçues pour rendre la participation civique facile, engageante et impactante
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fil social</h3>
              <p className="text-muted-foreground">
                Restez connecté avec votre communauté grâce à un fil social en temps réel des problèmes civiques et des mises à jour
              </p>
            </CardContent>
          </Card>

          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Signalement intelligent</h3>
              <p className="text-muted-foreground">
                Signalez des problèmes avec des photos, une localisation GPS et un étiquetage par catégorie pour une résolution plus rapide
              </p>
            </CardContent>
          </Card>

          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Vote communautaire</h3>
              <p className="text-muted-foreground">
                Soutenez les problèmes qui vous importent et aidez à prioriser ce qui est traité en premier
              </p>
            </CardContent>
          </Card>

          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Réponses officielles</h3>
              <p className="text-muted-foreground">
                Obtenez des mises à jour directes des agents municipaux travaillant à résoudre les problèmes signalés
              </p>
            </CardContent>
          </Card>

          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Suivre les progrès</h3>
              <p className="text-muted-foreground">
                Surveillez le statut des problèmes de en attente à en cours à résolu avec des mises à jour en temps réel
              </p>
            </CardContent>
          </Card>

          <Card className="border-border transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Analyse d'impact</h3>
              <p className="text-muted-foreground">
                Consultez des analyses détaillées sur l'engagement communautaire et les temps de réponse municipaux
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Prêt à faire une différence ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90 text-pretty">
            Rejoignez des milliers de citoyens engagés qui améliorent leurs communautés, un rapport à la fois
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Créer votre compte
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-bold">CIVIX</span>
              </div>
              <p className="text-sm text-muted-foreground">Autonomiser les communautés grâce à l'engagement civique</p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Plateforme</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/feed" className="hover:text-foreground transition-colors">
                    Fil
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-foreground transition-colors">
                    Carte
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-foreground transition-colors">
                    Directives
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CIVIX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
