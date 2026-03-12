"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  TrendingUp, 
  MapPin, 
  Users, 
  Calendar, 
  Filter,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Shield,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { name: "Toutes les publications", icon: Home, count: 245 },
  { name: "Signalements", icon: FileText, count: 89 },
  { name: "Événements", icon: Calendar, count: 34 },
  { name: "Urgences", icon: Shield, count: 12 },
  { name: "Projets", icon: TrendingUp, count: 56 },
]

const locations = [
  { name: "Abidjan", count: 89 },
  { name: "Yamoussoukro", count: 45 },
  { name: "Bouaké", count: 32 },
  { name: "San Pedro", count: 28 },
]

const filters = [
  { name: "Plus récents", icon: Clock },
  { name: "Plus populaires", icon: Star },
  { name: "Proximité", icon: MapPin },
]

export function FeedSidebarLeft() {
  const [expandedSection, setExpandedSection] = useState<string | null>("categories")
  const [selectedCategory, setSelectedCategory] = useState("Toutes les publications")
  const [selectedFilter, setSelectedFilter] = useState("Plus récents")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <Card className="w-full bg-card border border-border/50 shadow-lg sticky top-20">
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base sm:text-lg">Explorer</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("categories")}
            className="w-full justify-between h-8 px-2 font-medium"
          >
            <span className="flex items-center gap-2">
              {expandedSection === "categories" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Catégories
            </span>
          </Button>
          
          {expandedSection === "categories" && (
            <div className="space-y-1 pl-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "w-full justify-between h-8 px-2 text-sm",
                      selectedCategory === category.name && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{category.name}</span>
                    </span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs shrink-0">
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          )}
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("locations")}
            className="w-full justify-between h-8 px-2 font-medium"
          >
            <span className="flex items-center gap-2">
              {expandedSection === "locations" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Localisations
            </span>
          </Button>
          
          {expandedSection === "locations" && (
            <div className="space-y-1 pl-4">
              {locations.map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-8 px-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{location.name}</span>
                  </span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs shrink-0">
                    {location.count}
                  </Badge>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("filters")}
            className="w-full justify-between h-8 px-2 font-medium"
          >
            <span className="flex items-center gap-2">
              {expandedSection === "filters" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Filtres
            </span>
          </Button>
          
          {expandedSection === "filters" && (
            <div className="space-y-1 pl-4">
              {filters.map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.name}
                    variant={selectedFilter === filter.name ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.name)}
                    className={cn(
                      "w-full justify-start h-8 px-2 text-sm",
                      selectedFilter === filter.name && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{filter.name}</span>
                  </Button>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="pt-3 sm:pt-4 border-t border-border/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Utilisateurs actifs</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Publications aujourd'hui</span>
              <span className="font-medium">47</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
