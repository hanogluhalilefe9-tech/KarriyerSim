"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Trophy, Calendar, Home, Target, Award, Menu } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Data Models
interface Player {
  id: string
  name: string
  position: "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "LW" | "RW" | "ST"
  value: number
  rating: number
  stats: {
    pace: number
    shooting: number
    passing: number
    defending: number
    dribbling: number
    physical: number
  }
  goals: number
  assists: number
  teamId: string
}

interface Team {
  id: string
  name: string
  players: Player[]
  points: number
  goalsFor: number
  goalsAgainst: number
  wins: number
  draws: number
  losses: number
  goalDifference: number
  recentForm: ("W" | "D" | "L")[]
  averageRating: number
  preferredFormation: string
  startingXI: string[]
  substitutes: string[]
  played: number
}

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  week: number
  homeScore?: number
  awayScore?: number
  played: boolean
  goalScorers?: { playerId: string; playerName: string; minute: number }[]
}

interface GameState {
  initialized: boolean
  managerName: string
  selectedTeam: string
  currentWeek: number
  teams: Team[]
  fixtures: Match[]
  topScorers: { playerId: string; playerName: string; teamName: string; goals: number }[]
  topAssists: { playerId: string; playerName: string; teamName: string; assists: number }[]
  gameStarted: boolean
}

// Real Süper Lig Teams Data
const superLigTeams = [
  "Fenerbahçe",
  "Galatasaray",
  "Beşiktaş",
  "Trabzonspor",
  "Başakşehir",
  "Antalyaspor",
  "Alanyaspor",
  "Adana Demirspor",
  "Bodrum FK",
  "Eyüpspor",
  "Gaziantep FK",
  "Göztepe",
  "Hatayspor",
  "Kasımpaşa",
  "Kayserispor",
  "Konyaspor",
  "Rizespor",
  "Samsunspor",
  "Sivasspor",
]

const realPlayersData: Record<string, Omit<Player, "teamId">[]> = {
  Fenerbahçe: [
    // Goalkeepers
    {
      id: "fb-1",
      name: "Dominik Livakovic",
      position: "GK",
      value: 12000000,
      rating: 85,
      stats: { pace: 45, shooting: 15, passing: 70, defending: 85, dribbling: 40, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-2",
      name: "İrfan Can Eğribayat",
      position: "GK",
      value: 8000000,
      rating: 82,
      stats: { pace: 40, shooting: 10, passing: 65, defending: 82, dribbling: 35, physical: 78 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-3",
      name: "Osman Çetin",
      position: "GK",
      value: 2000000,
      rating: 75,
      stats: { pace: 35, shooting: 10, passing: 60, defending: 75, dribbling: 30, physical: 70 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-4",
      name: "Engin Biterge",
      position: "GK",
      value: 1000000,
      rating: 70,
      stats: { pace: 30, shooting: 10, passing: 55, defending: 70, dribbling: 25, physical: 65 },
      goals: 0,
      assists: 0,
    },

    // Defenders
    {
      id: "fb-5",
      name: "Alexander Djiku",
      position: "CB",
      value: 15000000,
      rating: 84,
      stats: { pace: 65, shooting: 25, passing: 75, defending: 88, dribbling: 60, physical: 85 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-6",
      name: "Çağlar Söyüncü",
      position: "CB",
      value: 14000000,
      rating: 83,
      stats: { pace: 70, shooting: 30, passing: 78, defending: 86, dribbling: 65, physical: 82 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-7",
      name: "Rodrigo Becão",
      position: "CB",
      value: 13000000,
      rating: 82,
      stats: { pace: 68, shooting: 28, passing: 76, defending: 85, dribbling: 62, physical: 84 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-8",
      name: "Milan Skriniar",
      position: "CB",
      value: 16000000,
      rating: 86,
      stats: { pace: 72, shooting: 32, passing: 80, defending: 90, dribbling: 68, physical: 86 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-9",
      name: "Serdar Aziz",
      position: "CB",
      value: 3000000,
      rating: 78,
      stats: { pace: 60, shooting: 25, passing: 70, defending: 80, dribbling: 55, physical: 78 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-10",
      name: "Bright Osayi-Samuel",
      position: "RB",
      value: 8000000,
      rating: 80,
      stats: { pace: 85, shooting: 45, passing: 72, defending: 78, dribbling: 75, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-11",
      name: "Mert Müldür",
      position: "RB",
      value: 7000000,
      rating: 79,
      stats: { pace: 82, shooting: 42, passing: 70, defending: 76, dribbling: 72, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-12",
      name: "Jayden Oosterwolde",
      position: "LB",
      value: 6000000,
      rating: 77,
      stats: { pace: 80, shooting: 40, passing: 68, defending: 74, dribbling: 70, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-13",
      name: "Filip Kostić",
      position: "LB",
      value: 10000000,
      rating: 81,
      stats: { pace: 78, shooting: 50, passing: 82, defending: 72, dribbling: 78, physical: 75 },
      goals: 0,
      assists: 0,
    },

    // Midfielders
    {
      id: "fb-14",
      name: "Fred",
      position: "CDM",
      value: 17000000,
      rating: 85,
      stats: { pace: 70, shooting: 65, passing: 88, defending: 82, dribbling: 80, physical: 78 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-15",
      name: "Sofyan Amrabat",
      position: "CDM",
      value: 18000000,
      rating: 86,
      stats: { pace: 72, shooting: 60, passing: 90, defending: 85, dribbling: 82, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-16",
      name: "İsmail Yüksek",
      position: "CM",
      value: 5000000,
      rating: 76,
      stats: { pace: 68, shooting: 55, passing: 75, defending: 72, dribbling: 70, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-17",
      name: "Mert Yandaş",
      position: "CM",
      value: 4000000,
      rating: 75,
      stats: { pace: 65, shooting: 52, passing: 73, defending: 70, dribbling: 68, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-18",
      name: "Sebastian Szymanski",
      position: "CAM",
      value: 19000000,
      rating: 87,
      stats: { pace: 75, shooting: 82, passing: 90, defending: 55, dribbling: 88, physical: 70 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-19",
      name: "İrfan Can Kahveci",
      position: "CAM",
      value: 8000000,
      rating: 80,
      stats: { pace: 72, shooting: 78, passing: 85, defending: 50, dribbling: 82, physical: 68 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-20",
      name: "Anderson Talisca",
      position: "CAM",
      value: 12000000,
      rating: 83,
      stats: { pace: 70, shooting: 85, passing: 82, defending: 45, dribbling: 80, physical: 78 },
      goals: 0,
      assists: 0,
    },

    // Forwards
    {
      id: "fb-21",
      name: "Edin Džeko",
      position: "ST",
      value: 8000000,
      rating: 82,
      stats: { pace: 60, shooting: 88, passing: 75, defending: 40, dribbling: 72, physical: 85 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-22",
      name: "Youssef En-Nesyri",
      position: "ST",
      value: 16000000,
      rating: 84,
      stats: { pace: 78, shooting: 86, passing: 65, defending: 35, dribbling: 75, physical: 88 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-23",
      name: "Cenk Tosun",
      position: "ST",
      value: 3000000,
      rating: 76,
      stats: { pace: 65, shooting: 80, passing: 60, defending: 30, dribbling: 68, physical: 82 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-24",
      name: "Allan Saint-Maximin",
      position: "LW",
      value: 15000000,
      rating: 83,
      stats: { pace: 92, shooting: 70, passing: 72, defending: 35, dribbling: 90, physical: 68 },
      goals: 0,
      assists: 0,
    },
    {
      id: "fb-25",
      name: "Dusan Tadic",
      position: "RW",
      value: 6000000,
      rating: 79,
      stats: { pace: 68, shooting: 75, passing: 88, defending: 45, dribbling: 85, physical: 65 },
      goals: 0,
      assists: 0,
    },
  ],

  Galatasaray: [
    // Goalkeepers
    {
      id: "gs-1",
      name: "Fernando Muslera",
      position: "GK",
      value: 8000000,
      rating: 84,
      stats: { pace: 40, shooting: 15, passing: 75, defending: 84, dribbling: 45, physical: 78 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-2",
      name: "Günay Güvenç",
      position: "GK",
      value: 3000000,
      rating: 76,
      stats: { pace: 35, shooting: 10, passing: 65, defending: 76, dribbling: 35, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-3",
      name: "Atakan Ordu",
      position: "GK",
      value: 1000000,
      rating: 70,
      stats: { pace: 30, shooting: 10, passing: 60, defending: 70, dribbling: 30, physical: 68 },
      goals: 0,
      assists: 0,
    },

    // Defenders
    {
      id: "gs-4",
      name: "Davinson Sánchez",
      position: "CB",
      value: 17000000,
      rating: 85,
      stats: { pace: 78, shooting: 30, passing: 76, defending: 88, dribbling: 65, physical: 86 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-5",
      name: "Abdülkerim Bardakcı",
      position: "CB",
      value: 8000000,
      rating: 80,
      stats: { pace: 68, shooting: 25, passing: 72, defending: 82, dribbling: 60, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-6",
      name: "Kaan Ayhan",
      position: "CB",
      value: 6000000,
      rating: 78,
      stats: { pace: 65, shooting: 28, passing: 70, defending: 80, dribbling: 58, physical: 78 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-7",
      name: "Elias Jelert",
      position: "RB",
      value: 5000000,
      rating: 77,
      stats: { pace: 82, shooting: 40, passing: 68, defending: 74, dribbling: 70, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-8",
      name: "İsmail Jakobs",
      position: "LB",
      value: 7000000,
      rating: 79,
      stats: { pace: 85, shooting: 45, passing: 72, defending: 76, dribbling: 75, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-9",
      name: "Eren Elmalı",
      position: "LB",
      value: 4000000,
      rating: 75,
      stats: { pace: 80, shooting: 38, passing: 65, defending: 72, dribbling: 68, physical: 70 },
      goals: 0,
      assists: 0,
    },

    // Midfielders
    {
      id: "gs-10",
      name: "Lucas Torreira",
      position: "CDM",
      value: 15000000,
      rating: 84,
      stats: { pace: 70, shooting: 62, passing: 86, defending: 85, dribbling: 78, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-11",
      name: "Gabriel Sara",
      position: "CM",
      value: 15000000,
      rating: 83,
      stats: { pace: 72, shooting: 75, passing: 88, defending: 65, dribbling: 82, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-12",
      name: "Kerem Demirbay",
      position: "CM",
      value: 8000000,
      rating: 80,
      stats: { pace: 68, shooting: 70, passing: 85, defending: 60, dribbling: 78, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-13",
      name: "Berkan Kutlu",
      position: "CM",
      value: 5000000,
      rating: 76,
      stats: { pace: 65, shooting: 58, passing: 75, defending: 70, dribbling: 70, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-14",
      name: "Dries Mertens",
      position: "CAM",
      value: 6000000,
      rating: 81,
      stats: { pace: 70, shooting: 82, passing: 88, defending: 40, dribbling: 86, physical: 60 },
      goals: 0,
      assists: 0,
    },

    // Forwards
    {
      id: "gs-15",
      name: "Victor Osimhen",
      position: "ST",
      value: 80000000,
      rating: 92,
      stats: { pace: 95, shooting: 92, passing: 70, defending: 40, dribbling: 85, physical: 90 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-16",
      name: "Mauro Icardi",
      position: "ST",
      value: 17000000,
      rating: 85,
      stats: { pace: 72, shooting: 90, passing: 68, defending: 35, dribbling: 78, physical: 82 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-17",
      name: "Álvaro Morata",
      position: "ST",
      value: 12000000,
      rating: 83,
      stats: { pace: 75, shooting: 85, passing: 72, defending: 45, dribbling: 76, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-18",
      name: "Barış Alper Yılmaz",
      position: "RW",
      value: 17000000,
      rating: 84,
      stats: { pace: 88, shooting: 78, passing: 75, defending: 40, dribbling: 86, physical: 70 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-19",
      name: "Roland Sallai",
      position: "LW",
      value: 10000000,
      rating: 81,
      stats: { pace: 85, shooting: 76, passing: 78, defending: 45, dribbling: 82, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-20",
      name: "Yunus Akgün",
      position: "RW",
      value: 8000000,
      rating: 79,
      stats: { pace: 82, shooting: 72, passing: 70, defending: 35, dribbling: 80, physical: 68 },
      goals: 0,
      assists: 0,
    },
    {
      id: "gs-21",
      name: "Yusuf Demir",
      position: "LW",
      value: 6000000,
      rating: 77,
      stats: { pace: 80, shooting: 68, passing: 72, defending: 30, dribbling: 78, physical: 65 },
      goals: 0,
      assists: 0,
    },
  ],

  Beşiktaş: [
    // Goalkeepers
    {
      id: "bjk-1",
      name: "Mert Günok",
      position: "GK",
      value: 10000000,
      rating: 83,
      stats: { pace: 42, shooting: 15, passing: 72, defending: 83, dribbling: 40, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-2",
      name: "Ersin Destanoğlu",
      position: "GK",
      value: 8000000,
      rating: 81,
      stats: { pace: 38, shooting: 12, passing: 68, defending: 81, dribbling: 35, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-3",
      name: "Göktuğ Baytekin",
      position: "GK",
      value: 2000000,
      rating: 74,
      stats: { pace: 32, shooting: 10, passing: 62, defending: 74, dribbling: 30, physical: 70 },
      goals: 0,
      assists: 0,
    },

    // Defenders
    {
      id: "bjk-4",
      name: "Gabriel Paulista",
      position: "CB",
      value: 8000000,
      rating: 81,
      stats: { pace: 68, shooting: 28, passing: 74, defending: 84, dribbling: 62, physical: 82 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-5",
      name: "Felix Uduokhai",
      position: "CB",
      value: 7000000,
      rating: 79,
      stats: { pace: 70, shooting: 30, passing: 72, defending: 82, dribbling: 65, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-6",
      name: "Tayyip Sanuç",
      position: "CB",
      value: 4000000,
      rating: 76,
      stats: { pace: 65, shooting: 25, passing: 68, defending: 78, dribbling: 58, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-7",
      name: "Jonas Svensson",
      position: "RB",
      value: 6000000,
      rating: 78,
      stats: { pace: 78, shooting: 42, passing: 70, defending: 76, dribbling: 72, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-8",
      name: "Onur Bulut",
      position: "RB",
      value: 3000000,
      rating: 74,
      stats: { pace: 75, shooting: 38, passing: 65, defending: 72, dribbling: 68, physical: 70 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-9",
      name: "Arthur Masuaku",
      position: "LB",
      value: 5000000,
      rating: 77,
      stats: { pace: 80, shooting: 45, passing: 72, defending: 74, dribbling: 75, physical: 72 },
      goals: 0,
      assists: 0,
    },

    // Midfielders
    {
      id: "bjk-10",
      name: "Gedson Fernandes",
      position: "CDM",
      value: 15000000,
      rating: 82,
      stats: { pace: 72, shooting: 65, passing: 82, defending: 78, dribbling: 76, physical: 80 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-11",
      name: "João Mário",
      position: "CM",
      value: 8000000,
      rating: 80,
      stats: { pace: 68, shooting: 70, passing: 85, defending: 65, dribbling: 78, physical: 72 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-12",
      name: "Alex Oxlade-Chamberlain",
      position: "CM",
      value: 6000000,
      rating: 78,
      stats: { pace: 75, shooting: 75, passing: 80, defending: 60, dribbling: 80, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-13",
      name: "Salih Uçan",
      position: "CM",
      value: 4000000,
      rating: 75,
      stats: { pace: 65, shooting: 62, passing: 75, defending: 68, dribbling: 70, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-14",
      name: "Ernest Muçi",
      position: "CAM",
      value: 7000000,
      rating: 79,
      stats: { pace: 78, shooting: 72, passing: 82, defending: 45, dribbling: 85, physical: 68 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-15",
      name: "Milot Rashica",
      position: "LW",
      value: 8000000,
      rating: 80,
      stats: { pace: 85, shooting: 75, passing: 75, defending: 40, dribbling: 82, physical: 70 },
      goals: 0,
      assists: 0,
    },

    // Forwards
    {
      id: "bjk-16",
      name: "Ciro Immobile",
      position: "ST",
      value: 12000000,
      rating: 84,
      stats: { pace: 70, shooting: 88, passing: 72, defending: 35, dribbling: 76, physical: 82 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-17",
      name: "Semih Kılıçsoy",
      position: "ST",
      value: 8000000,
      rating: 78,
      stats: { pace: 82, shooting: 76, passing: 65, defending: 30, dribbling: 78, physical: 74 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-18",
      name: "Rafa Silva",
      position: "RW",
      value: 10000000,
      rating: 81,
      stats: { pace: 88, shooting: 74, passing: 78, defending: 42, dribbling: 86, physical: 68 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-19",
      name: "Mustafa Hekimoğlu",
      position: "ST",
      value: 2000000,
      rating: 72,
      stats: { pace: 75, shooting: 70, passing: 58, defending: 25, dribbling: 68, physical: 76 },
      goals: 0,
      assists: 0,
    },
    {
      id: "bjk-20",
      name: "Necip Uysal",
      position: "CM",
      value: 1000000,
      rating: 70,
      stats: { pace: 60, shooting: 55, passing: 70, defending: 65, dribbling: 62, physical: 68 },
      goals: 0,
      assists: 0,
    },
  ],
}

// Generate realistic squad
const generateRealisticSquad = (teamName: string): Omit<Player, "teamId">[] => {
  const positions = [
    { pos: "GK" as const, count: 3 },
    { pos: "CB" as const, count: 4 },
    { pos: "LB" as const, count: 2 },
    { pos: "RB" as const, count: 2 },
    { pos: "CDM" as const, count: 2 },
    { pos: "CM" as const, count: 3 },
    { pos: "CAM" as const, count: 2 },
    { pos: "LW" as const, count: 2 },
    { pos: "RW" as const, count: 2 },
    { pos: "ST" as const, count: 3 },
  ]

  const turkishNames = [
    "Ahmet",
    "Mehmet",
    "Mustafa",
    "Ali",
    "Hasan",
    "Hüseyin",
    "İbrahim",
    "İsmail",
    "Murat",
    "Ömer",
    "Emre",
    "Burak",
    "Serkan",
    "Tolga",
    "Volkan",
    "Gökhan",
    "Oğuzhan",
    "Selçuk",
    "Kerem",
    "Arda",
  ]

  const turkishSurnames = [
    "Yılmaz",
    "Kaya",
    "Demir",
    "Şahin",
    "Çelik",
    "Yıldız",
    "Yıldırım",
    "Öztürk",
    "Aydin",
    "Özkan",
    "Arslan",
    "Doğan",
    "Aslan",
    "Çetin",
    "Kara",
    "Koç",
    "Kurt",
    "Özdemir",
    "Şen",
    "Aktaş",
  ]

  let playerId = 1
  const squad: Omit<Player, "teamId">[] = []

  positions.forEach(({ pos, count }) => {
    for (let i = 0; i < count; i++) {
      const firstName = turkishNames[Math.floor(Math.random() * turkishNames.length)]
      const lastName = turkishSurnames[Math.floor(Math.random() * turkishSurnames.length)]

      let baseRating = 70
      if (pos === "GK") baseRating = 72
      else if (["CB", "CDM"].includes(pos)) baseRating = 71
      else if (["ST", "CAM"].includes(pos)) baseRating = 73

      const rating = baseRating + Math.floor(Math.random() * 10)

      squad.push({
        id: `${teamName.toLowerCase().replace(/\s+/g, "")}_${playerId}`,
        name: `${firstName} ${lastName}`,
        position: pos,
        value: Math.floor(Math.random() * 8000000) + 1000000,
        rating,
        stats: {
          pace: Math.floor(Math.random() * 25) + 65,
          shooting: pos === "GK" ? Math.floor(Math.random() * 20) + 20 : Math.floor(Math.random() * 25) + 65,
          passing: Math.floor(Math.random() * 25) + 65,
          defending: pos === "GK" ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 25) + 65,
          dribbling: pos === "GK" ? Math.floor(Math.random() * 20) + 30 : Math.floor(Math.random() * 25) + 65,
          physical: Math.floor(Math.random() * 25) + 65,
        },
        goals: 0,
        assists: 0,
      })
      playerId++
    }
  })

  return squad
}

const generateFixtures = (teams: Team[]): Match[] => {
  const fixtures: Match[] = []
  let matchId = 1
  const teamNames = teams.map((t) => t.name)

  // First half of season (each team plays each other once)
  for (let round = 0; round < teamNames.length - 1; round++) {
    const week = round + 1
    const roundMatches: Match[] = []

    for (let match = 0; match < Math.floor(teamNames.length / 2); match++) {
      const home = (round + match) % (teamNames.length - 1)
      let away = (teamNames.length - 1 - match + round) % (teamNames.length - 1)

      if (match === 0) {
        away = teamNames.length - 1
      }

      roundMatches.push({
        id: `match${matchId++}`,
        homeTeam: teamNames[home],
        awayTeam: teamNames[away],
        week,
        played: false,
      })
    }

    fixtures.push(...roundMatches)
  }

  // Second half of season (reverse fixtures)
  const firstHalfFixtures = [...fixtures]
  firstHalfFixtures.forEach((match) => {
    fixtures.push({
      id: `match${matchId++}`,
      homeTeam: match.awayTeam, // Swap home and away
      awayTeam: match.homeTeam,
      week: match.week + (teamNames.length - 1), // Add to second half
      played: false,
    })
  })

  return fixtures
}

const calculateTeamRating = (team: Team): number => {
  const startingPlayers = team.players.filter((p) => team.startingXI.includes(p.id))
  if (startingPlayers.length === 0) return team.averageRating

  const totalRating = startingPlayers.reduce((sum, player) => sum + player.rating, 0)
  return Math.round(totalRating / startingPlayers.length)
}

const setupDefaultFormation = (players: Player[]): { startingXI: string[]; substitutes: string[] } => {
  const gk = players.filter((p) => p.position === "GK").slice(0, 1)
  const cb = players.filter((p) => p.position === "CB").slice(0, 2)
  const rb = players.filter((p) => p.position === "RB").slice(0, 1)
  const lb = players.filter((p) => p.position === "LB").slice(0, 1)
  const cm = players.filter((p) => ["CDM", "CM", "CAM"].includes(p.position)).slice(0, 3)
  const wingers = players.filter((p) => ["LW", "RW"].includes(p.position)).slice(0, 2)
  const st = players.filter((p) => p.position === "ST").slice(0, 1)

  const startingXI = [
    ...gk.map((p) => p.id),
    ...cb.map((p) => p.id),
    ...rb.map((p) => p.id),
    ...lb.map((p) => p.id),
    ...cm.map((p) => p.id),
    ...wingers.map((p) => p.id),
    ...st.map((p) => p.id),
  ].filter(Boolean)

  // Fill remaining spots if needed
  const remainingPlayers = players.filter((p) => !startingXI.includes(p.id) && p.position !== "GK")
  while (startingXI.length < 11 && remainingPlayers.length > 0) {
    startingXI.push(remainingPlayers.shift()!.id)
  }

  const substitutes = players
    .filter((p) => !startingXI.includes(p.id))
    .slice(0, 10)
    .map((p) => p.id)

  return { startingXI, substitutes }
}

const calculateMatchProbability = (team1Rating: number, team2Rating: number, isTeam1Home = false) => {
  const homeAdvantage = isTeam1Home ? 3 : 0
  const adjustedTeam1Rating = team1Rating + homeAdvantage
  const ratingDiff = adjustedTeam1Rating - team2Rating

  // Base probability calculation
  let team1WinChance = 0.5

  if (Math.abs(ratingDiff) <= 2) {
    // Equal teams: 50-50
    team1WinChance = 0.5
  } else if (Math.abs(ratingDiff) >= 6) {
    // Large difference (like 82 vs 76): 80% for stronger team
    team1WinChance = ratingDiff > 0 ? 0.8 : 0.2
  } else if (Math.abs(ratingDiff) >= 2 && Math.abs(ratingDiff) < 6) {
    // Medium difference (like 82 vs 80): 65% for stronger team
    team1WinChance = ratingDiff > 0 ? 0.65 : 0.35
  }

  return {
    team1Win: team1WinChance,
    draw: 0.25,
    team2Win: 1 - team1WinChance - 0.25,
  }
}

const simulateMatch = (team1: Team, team2: Team, isTeam1Home = false) => {
  const team1Rating = calculateTeamRating(team1)
  const team2Rating = calculateTeamRating(team2)
  const probabilities = calculateMatchProbability(team1Rating, team2Rating, isTeam1Home)

  const random = Math.random()
  let team1Score = 0
  let team2Score = 0

  if (random < probabilities.team1Win) {
    // Team 1 wins
    team1Score = Math.floor(Math.random() * 3) + 1 // 1-3 goals
    team2Score = Math.floor(Math.random() * 2) // 0-1 goals
  } else if (random < probabilities.team1Win + probabilities.draw) {
    // Draw
    const goals = Math.floor(Math.random() * 4) // 0-3 goals each
    team1Score = goals
    team2Score = goals
  } else {
    // Team 2 wins
    team2Score = Math.floor(Math.random() * 3) + 1 // 1-3 goals
    team1Score = Math.floor(Math.random() * 2) // 0-1 goals
  }

  return { team1Score, team2Score }
}

export default function Page() {
  const [gameState, setGameState] = useState<GameState>({
    initialized: false,
    managerName: "",
    selectedTeam: "",
    currentWeek: 1,
    teams: [],
    fixtures: [],
    topScorers: [],
    topAssists: [],
    gameStarted: false,
  })

  const [savedGames, setSavedGames] = useState<
    {
      id: string
      managerName: string
      selectedTeam: string
      currentWeek: number
    }[]
  >([])
  const [showLoadGame, setShowLoadGame] = useState(false)

  useEffect(() => {
    // Load saved games from localStorage
    const saved = localStorage.getItem("footballCareerSaves")
    if (saved) {
      try {
        const saveNames = JSON.parse(saved) as string[]
        const saves = saveNames.map((saveName) => {
          const saveData = localStorage.getItem(`footballCareer_${saveName}`)
          if (saveData) {
            const parsed = JSON.parse(saveData) as { gameState: GameState }
            return {
              id: saveName,
              managerName: parsed.gameState.managerName,
              selectedTeam: parsed.gameState.selectedTeam,
              currentWeek: parsed.gameState.currentWeek,
            }
          }
          return null
        })
        setSavedGames(saves.filter(Boolean) as any)
      } catch (e) {
        console.error("Error loading saved games:", e)
      }
    }
  }, [])

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState("home")
  const [formationDialogOpen, setFormationDialogOpen] = useState(false)

  const initializeCareer = () => {
    const teams = superLigTeams.map((teamName) => {
      let teamPlayers: Omit<Player, "teamId">[]

      if (realPlayersData[teamName]) {
        // Use real player data for major teams
        teamPlayers = realPlayersData[teamName].map((player) => ({ ...player, teamId: teamName }))
      } else {
        // Generate realistic squad for other teams (minimum 22 players)
        teamPlayers = generateRealisticSquad(teamName).map((player) => ({ ...player, teamId: teamName }))
      }

      const { startingXI, substitutes } = setupDefaultFormation(teamPlayers)

      const startingPlayers = teamPlayers.filter((p) => startingXI.includes(p.id))
      const avgRating = calculateTeamRating({
        players: teamPlayers,
        startingXI,
        averageRating: 0,
      } as Team)

      return {
        id: teamName,
        name: teamName,
        players: teamPlayers,
        points: 0, // Start with 0 points as requested
        goalsFor: 0,
        goalsAgainst: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalDifference: 0,
        recentForm: [],
        averageRating: avgRating,
        preferredFormation: "4-3-3",
        startingXI,
        substitutes,
        played: 0,
      }
    })

    const initialGameState: GameState = {
      initialized: true,
      managerName: gameState.managerName,
      selectedTeam: gameState.selectedTeam,
      currentWeek: 1,
      teams,
      fixtures: generateFixtures(teams),
      topScorers: [], // Empty since no matches played yet
      topAssists: [], // Empty since no matches played yet
      gameStarted: true,
    }

    setGameState(initialGameState)
  }

  // Initialize game data
  const initializeGame = () => {
    if (!gameState.managerName || !gameState.selectedTeam) return

    initializeCareer()
  }

  const saveCareer = () => {
    const saveData = {
      gameState,
      timestamp: new Date().toISOString(),
    }
    const saveName = `${gameState.managerName}-Hafta${gameState.currentWeek}`
    localStorage.setItem(`footballCareer_${saveName}`, JSON.stringify(saveData))

    // Update saved games list
    const currentSaves = JSON.parse(localStorage.getItem("footballCareerSaves") || "[]")
    if (!currentSaves.includes(saveName)) {
      currentSaves.push(saveName)
      localStorage.setItem("footballCareerSaves", JSON.stringify(currentSaves))
      setSavedGames(currentSaves)
    }

    alert("Kariyer kaydedildi!")
  }

  const loadCareer = (saveName: string) => {
    try {
      const saveData = localStorage.getItem(`footballCareer_${saveName}`)
      if (saveData) {
        const parsed = JSON.parse(saveData)
        setGameState(parsed.gameState)
        setShowLoadGame(false)
      }
    } catch (e) {
      console.error("Error loading career:", e)
      alert("Kariyer yüklenirken hata oluştu!")
    }
  }

  const deleteSave = (saveName: string) => {
    localStorage.removeItem(`footballCareer_${saveName}`)
    const currentSaves = savedGames.filter((name) => name !== saveName)
    localStorage.setItem("footballCareerSaves", JSON.stringify(currentSaves))
    setSavedGames(currentSaves)
  }

  const deleteSavedGame = (saveId: string) => {
    localStorage.removeItem(`footballCareer_${saveId}`)
    const updatedSavedGames = savedGames.filter((game) => game.id !== saveId)
    setSavedGames(updatedSavedGames)

    const savedGameIds = updatedSavedGames.map((game) => game.id)
    localStorage.setItem("footballCareerSaves", JSON.stringify(savedGameIds))
  }

  const simulateAllMatches = (userScore: number, opponentScore: number) => {
    const userMatch = gameState.fixtures.find(
      (f) =>
        f.week === gameState.currentWeek &&
        (f.homeTeam === gameState.selectedTeam || f.awayTeam === gameState.selectedTeam),
    )

    if (!userMatch) return

    const weekMatches = gameState.fixtures.filter((f) => f.week === gameState.currentWeek)
    const matchResults = new Map<string, { homeScore: number; awayScore: number }>()

    // First, simulate all matches and store results
    weekMatches.forEach((match) => {
      if (match.id === userMatch.id) {
        // User's match - use provided scores
        const isUserHome = match.homeTeam === gameState.selectedTeam
        matchResults.set(match.id, {
          homeScore: isUserHome ? userScore : opponentScore,
          awayScore: isUserHome ? opponentScore : userScore,
        })
      } else {
        // Simulate other matches
        const homeTeam = gameState.teams.find((t) => t.name === match.homeTeam)
        const awayTeam = gameState.teams.find((t) => t.name === match.awayTeam)

        if (homeTeam && awayTeam) {
          const result = simulateMatch(homeTeam, awayTeam, true)
          matchResults.set(match.id, {
            homeScore: result.team1Score,
            awayScore: result.team2Score,
          })
        }
      }
    })

    // Now update team stats based on match results
    const updatedTeams = gameState.teams.map((team) => {
      const teamMatches = weekMatches.filter((f) => f.homeTeam === team.name || f.awayTeam === team.name)

      if (teamMatches.length === 0) return { ...team } // Bye week

      let newWins = team.wins
      let newDraws = team.draws
      let newLosses = team.losses
      let newGoalsFor = team.goalsFor
      let newGoalsAgainst = team.goalsAgainst
      let newPlayed = team.played

      const updatedPlayers = team.players.map((player) => {
        let newGoals = player.goals
        let newAssists = player.assists

        // Only starting XI players can score/assist
        if (team.startingXI.includes(player.id)) {
          teamMatches.forEach((match) => {
            const matchResult = matchResults.get(match.id)
            if (!matchResult) return

            const isHome = match.homeTeam === team.name
            const teamScore = isHome ? matchResult.homeScore : matchResult.awayScore
            const opponentScore = isHome ? matchResult.awayScore : matchResult.homeScore

            // Distribute goals and assists for this match
            for (let i = 0; i < teamScore; i++) {
              if (Math.random() < 0.7) {
                // 70% chance this player is involved in a goal
                if (player.position === "ST") {
                  if (Math.random() < 0.4) newGoals += 1
                } else if (["CM", "CAM", "CDM"].includes(player.position)) {
                  if (Math.random() < 0.25) newGoals += 1
                  if (Math.random() < 0.475) newAssists += 1
                } else if (["CB", "LB", "RB"].includes(player.position)) {
                  if (Math.random() < 0.1) newGoals += 1
                  if (Math.random() < 0.275) newAssists += 1
                } else if (["LW", "RW"].includes(player.position)) {
                  if (Math.random() < 0.3) newGoals += 1
                  if (Math.random() < 0.375) newAssists += 1
                }
              }
            }
          })
        }

        return { ...player, goals: newGoals, assists: newAssists }
      })

      // Update team stats - only count each match once per team
      teamMatches.forEach((match) => {
        const matchResult = matchResults.get(match.id)
        if (!matchResult) return

        const isHome = match.homeTeam === team.name
        const teamScore = isHome ? matchResult.homeScore : matchResult.awayScore
        const opponentScore = isHome ? matchResult.awayScore : matchResult.homeScore

        // Only increment if this match hasn't been counted for this team yet
        newPlayed += 1
        newGoalsFor += teamScore
        newGoalsAgainst += opponentScore

        if (teamScore > opponentScore) {
          newWins += 1
        } else if (teamScore === opponentScore) {
          newDraws += 1
        } else {
          newLosses += 1
        }
      })

      return {
        ...team,
        players: updatedPlayers,
        wins: newWins,
        draws: newDraws,
        losses: newLosses,
        goalsFor: newGoalsFor,
        goalsAgainst: newGoalsAgainst,
        played: newPlayed,
        points: newWins * 3 + newDraws,
        goalDifference: newGoalsFor - newGoalsAgainst,
      }
    })

    const nextWeek = gameState.currentWeek + 1
    const maxWeeks = (gameState.teams.length - 1) * 2

    const updatedFixtures = gameState.fixtures.map((fixture) => {
      const result = matchResults.get(fixture.id)
      if (result) {
        return {
          ...fixture,
          homeScore: result.homeScore,
          awayScore: result.awayScore,
          played: true,
        }
      }
      return fixture
    })

    setGameState((prev) => ({
      ...prev,
      teams: updatedTeams,
      fixtures: updatedFixtures,
      currentWeek: nextWeek <= maxWeeks ? nextWeek : prev.currentWeek,
    }))
  }

  const simulateUserMatch = () => {
    const userTeam = gameState.teams.find((t) => t.name === gameState.selectedTeam)
    const userMatch = gameState.fixtures.find(
      (f) =>
        !f.played &&
        f.week === gameState.currentWeek &&
        (f.homeTeam === gameState.selectedTeam || f.awayTeam === gameState.selectedTeam),
    )

    if (!userMatch) {
      const nextWeek = gameState.currentWeek + 1
      const maxWeeks = (gameState.teams.length - 1) * 2 // 38 weeks for 19 teams

      if (nextWeek <= maxWeeks) {
        setGameState((prev) => ({ ...prev, currentWeek: nextWeek }))
        return
      } else {
        alert("Sezon tamamlandı!")
        return
      }
    }

    if (!userTeam || !userMatch) return

    const opponentTeam = gameState.teams.find(
      (t) => t.name === (userMatch.homeTeam === gameState.selectedTeam ? userMatch.awayTeam : userMatch.homeTeam),
    )

    if (!opponentTeam) return

    const isUserHome = userMatch.homeTeam === gameState.selectedTeam
    const matchResult = simulateMatch(userTeam, opponentTeam, isUserHome)
    const userScore = isUserHome ? matchResult.team1Score : matchResult.team2Score
    const opponentScore = isUserHome ? matchResult.team2Score : matchResult.team1Score

    const weekMatches = gameState.fixtures.filter((f) => f.week === gameState.currentWeek)
    const matchResults = new Map<string, { homeScore: number; awayScore: number }>()

    const updatedTeams = gameState.teams.map((team) => {
      const teamWeekMatches = weekMatches.filter((f) => f.homeTeam === team.name || f.awayTeam === team.name)

      if (teamWeekMatches.length === 0) return { ...team }

      let newWins = team.wins
      let newDraws = team.draws
      let newLosses = team.losses
      let newGoalsFor = team.goalsFor
      let newGoalsAgainst = team.goalsAgainst
      let newPlayed = team.played

      const updatedPlayers = team.players.map((player) => {
        let newGoals = player.goals
        let newAssists = player.assists

        if (team.startingXI.includes(player.id)) {
          teamWeekMatches.forEach((match) => {
            const isHome = match.homeTeam === team.name
            let teamScore = 0
            let opponentScore = 0

            if (match.id === userMatch.id) {
              teamScore = team.name === gameState.selectedTeam ? userScore : opponentScore
              opponentScore = team.name === gameState.selectedTeam ? opponentScore : userScore
            } else {
              const opponent = gameState.teams.find((t) => t.name === (isHome ? match.awayTeam : match.homeTeam))
              if (opponent) {
                const result = simulateMatch(team, opponent, isHome)
                teamScore = result.team1Score
                opponentScore = result.team2Score
              }
            }

            matchResults.set(match.id, {
              homeScore: isHome ? teamScore : opponentScore,
              awayScore: isHome ? opponentScore : teamScore,
            })

            if (!match.played) {
              newPlayed += 1
            }
            newGoalsFor += teamScore
            newGoalsAgainst += opponentScore

            if (teamScore > opponentScore) {
              newWins += 1
            } else if (teamScore === opponentScore) {
              newDraws += 1
            } else {
              newLosses += 1
            }

            for (let i = 0; i < teamScore; i++) {
              if (Math.random() < 0.7) {
                if (player.position === "ST") {
                  if (Math.random() < 0.4) newGoals += 1
                } else if (["CM", "CAM", "CDM"].includes(player.position)) {
                  if (Math.random() < 0.25) newGoals += 1
                  if (Math.random() < 0.475) newAssists += 1 // Reduced from 0.5 to 0.475
                } else if (["CB", "LB", "RB"].includes(player.position)) {
                  if (Math.random() < 0.1) newGoals += 1
                  if (Math.random() < 0.275) newAssists += 1 // Reduced from 0.3 to 0.275
                } else if (["LW", "RW"].includes(player.position)) {
                  if (Math.random() < 0.3) newGoals += 1
                  if (Math.random() < 0.375) newAssists += 1 // Reduced from 0.4 to 0.375
                }
              }
            }
          })
        }

        return { ...player, goals: newGoals, assists: newAssists }
      })

      return {
        ...team,
        players: updatedPlayers,
        wins: newWins,
        draws: newDraws,
        losses: newLosses,
        goalsFor: newGoalsFor,
        goalsAgainst: newGoalsAgainst,
        played: newPlayed,
        points: newWins * 3 + newDraws, // Ensured 3 points for win, 1 for draw
        goalDifference: newGoalsFor - newGoalsAgainst,
      }
    })

    const nextWeek = gameState.currentWeek + 1
    const maxWeeks = (gameState.teams.length - 1) * 2

    const updatedFixtures = gameState.fixtures.map((fixture) => {
      const result = matchResults.get(fixture.id)
      if (result) {
        return {
          ...fixture,
          homeScore: result.homeScore,
          awayScore: result.awayScore,
          played: true,
        }
      }
      return fixture
    })

    setGameState((prev) => ({
      ...prev,
      teams: updatedTeams,
      fixtures: updatedFixtures,
      currentWeek: nextWeek <= maxWeeks ? nextWeek : prev.currentWeek,
    }))
  }

  const swapPlayers = () => {
    if (selectedPlayers.length !== 2) return

    const [player1Id, player2Id] = selectedPlayers
    const updatedTeams = gameState.teams.map((team) => {
      if (team.id === gameState.selectedTeam) {
        const newStartingXI = [...team.startingXI]
        const newSubstitutes = [...team.substitutes]

        const player1InStarting = newStartingXI.includes(player1Id)
        const player2InStarting = newStartingXI.includes(player2Id)

        if (player1InStarting && player2InStarting) {
          // Both in starting XI - swap positions
          const index1 = newStartingXI.indexOf(player1Id)
          const index2 = newStartingXI.indexOf(player2Id)
          newStartingXI[index1] = player2Id
          newStartingXI[index2] = player1Id
        } else if (!player1InStarting && !player2InStarting) {
          // Both in substitutes - swap positions
          const index1 = newSubstitutes.indexOf(player1Id)
          const index2 = newSubstitutes.indexOf(player2Id)
          newSubstitutes[index1] = player2Id
          newSubstitutes[index2] = player1Id
        } else {
          // One in starting XI, one in substitutes - swap lists
          if (player1InStarting) {
            const startingIndex = newStartingXI.indexOf(player1Id)
            const subIndex = newSubstitutes.indexOf(player2Id)
            newStartingXI[startingIndex] = player2Id
            newSubstitutes[subIndex] = player1Id
          } else {
            const startingIndex = newStartingXI.indexOf(player2Id)
            const subIndex = newSubstitutes.indexOf(player1Id)
            newStartingXI[startingIndex] = player1Id
            newSubstitutes[subIndex] = player2Id
          }
        }

        return { ...team, startingXI: newStartingXI, substitutes: newSubstitutes }
      }
      return team
    })

    setGameState({ ...gameState, teams: updatedTeams })
    setSelectedPlayers([])
  }

  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, playerId])
    }
  }

  const getFormColor = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W":
        return "bg-green-500"
      case "D":
        return "bg-orange-500"
      case "L":
        return "bg-red-500"
    }
  }

  const getFormLetter = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W":
        return "G"
      case "D":
        return "B"
      case "L":
        return "M"
    }
  }

  // Navigation items for initialized game
  const navItems = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "myteam", label: "Takımım", icon: Users },
    { id: "standings", label: "Puan Durumu", icon: Trophy },
    { id: "fixtures", label: "Fikstür", icon: Calendar },
    { id: "topscorers", label: "Gol Krallığı", icon: Target },
    { id: "topassists", label: "Asist Krallığı", icon: Award },
  ]

  const getTeamAverageRating = (teamName: string) => {
    const team = gameState.teams.find((t) => t.name === teamName)
    return team ? team.averageRating : 0
  }

  const getTeamRecentForm = (teamName: string) => {
    const team = gameState.teams.find((t) => t.name === teamName)
    return team ? team.recentForm.map((r) => (r === "W" ? "G" : r === "D" ? "B" : "M")) : []
  }

  const currentWeekFixtures = gameState.fixtures
    .filter((match) => match.week === gameState.currentWeek)
    .map((match) => ({
      home: match.homeTeam,
      away: match.awayTeam,
      result: match.played ? { homeGoals: match.homeScore || 0, awayGoals: match.awayScore || 0 } : null,
    }))

  const topScorers = gameState.teams
    .flatMap((team) => team.players.map((player) => ({ ...player, team: team.name })))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)
    .map((player) => ({ name: player.name, team: player.team, goals: player.goals }))

  const topAssists = gameState.teams
    .flatMap((team) => team.players.map((player) => ({ ...player, team: team.name })))
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10)
    .map((player) => ({ name: player.name, team: player.team, assists: player.assists }))

  const userTeam = gameState.teams.find((t) => t.name === gameState.selectedTeam)

  // Team Selection Screen
  if (!gameState.initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-600">KariyerSim</CardTitle>
            <CardDescription>Futbol Kariyer Simülasyonu</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={showLoadGame ? "load" : "new"} onValueChange={(value) => setShowLoadGame(value === "load")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">Yeni Kariyer</TabsTrigger>
                <TabsTrigger value="load">Kariyer Yükle</TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>Menajer Adı</Label>
                  <Input
                    placeholder="Adınızı ve soyadınızı girin"
                    value={gameState.managerName}
                    onChange={(e) => setGameState((prev) => ({ ...prev, managerName: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Takım Seçin</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {superLigTeams.map((team) => (
                      <Button
                        key={team}
                        variant={gameState.selectedTeam === team ? "default" : "outline"}
                        onClick={() => setGameState((prev) => ({ ...prev, selectedTeam: team }))}
                        className="text-left justify-start text-sm"
                      >
                        {team}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={initializeGame}
                  disabled={!gameState.managerName.trim() || !gameState.selectedTeam}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Kariyere Başla
                </Button>
              </TabsContent>

              <TabsContent value="load" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Label>Kayıtlı Kariyerler</Label>
                  {savedGames.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Henüz kayıtlı kariyer bulunmuyor.</p>
                      <p className="text-sm mt-2">Yeni bir kariyer başlatın ve ilerledikçe kaydedin.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {savedGames.map((save) => (
                        <div key={save.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{save.managerName}</p>
                            <p className="text-sm text-muted-foreground">{save.selectedTeam}</p>
                            <p className="text-xs text-muted-foreground">{save.currentWeek}. Hafta</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => loadCareer(save.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Yükle
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteSavedGame(save.id)}>
                              Sil
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <h1 className="text-lg md:text-2xl font-bold text-primary">KariyerSim</h1>
              <div className="hidden sm:flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {gameState.managerName}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {gameState.selectedTeam}
                </Badge>
              </div>
            </div>

            <div className="md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Menü</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? "default" : "outline"}
                          onClick={() => {
                            setActiveSection(item.id)
                          }}
                          className="justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      )
                    })}
                    <Button variant="outline" onClick={saveCareer} className="justify-start bg-transparent">
                      Kaydet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
              <button
                onClick={saveCareer}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Home Section */}
        {activeSection === "home" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">KariyerSim</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {gameState.managerName} - {gameState.selectedTeam} ({gameState.currentWeek}. Hafta)
              </p>
            </div>

            {/* User Match Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sıradaki Maçın</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const userMatch = gameState.fixtures.find(
                    (f) =>
                      !f.played &&
                      f.week === gameState.currentWeek &&
                      (f.homeTeam === gameState.selectedTeam || f.awayTeam === gameState.selectedTeam),
                  )

                  if (!userMatch) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Bu hafta maçın yok (Bay)</p>
                        <Button onClick={simulateUserMatch} className="w-full sm:w-auto">
                          Sonraki Haftaya Geç
                        </Button>
                      </div>
                    )
                  }

                  const isHome = userMatch.homeTeam === gameState.selectedTeam
                  const opponent = isHome ? userMatch.awayTeam : userMatch.homeTeam
                  const userTeam = gameState.teams.find((t) => t.name === gameState.selectedTeam)
                  const opponentTeam = gameState.teams.find((t) => t.name === opponent)

                  if (!userTeam || !opponentTeam) return null

                  const userRating = calculateTeamRating(userTeam)
                  const opponentRating = calculateTeamRating(opponentTeam)

                  const getUserLastMatches = (teamName: string) => {
                    return gameState.fixtures
                      .filter((f) => f.played && (f.homeTeam === teamName || f.awayTeam === teamName))
                      .slice(-5)
                      .map((match) => {
                        const isTeamHome = match.homeTeam === teamName
                        const teamScore = isTeamHome ? match.homeScore! : match.awayScore!
                        const opponentScore = isTeamHome ? match.awayScore! : match.homeScore!

                        if (teamScore > opponentScore) return { result: "G", color: "bg-green-500" }
                        if (teamScore < opponentScore) return { result: "M", color: "bg-red-500" }
                        return { result: "B", color: "bg-orange-500" }
                      })
                  }

                  const userLastMatches = getUserLastMatches(gameState.selectedTeam)
                  const opponentLastMatches = getUserLastMatches(opponent)

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* User Team */}
                        <div className="text-center space-y-2">
                          <h3 className="font-bold text-lg">{gameState.selectedTeam}</h3>
                          <p className="text-sm text-muted-foreground">Ortalama: {userRating.toFixed(1)}</p>
                          <div className="flex justify-center gap-1">
                            {userLastMatches.map((match, index) => (
                              <div
                                key={index}
                                className={`w-6 h-6 rounded-full ${match.color} text-white text-xs flex items-center justify-center font-bold`}
                              >
                                {match.result}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* VS */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-muted-foreground">VS</div>
                          <div className="text-sm text-muted-foreground mt-2">{isHome ? "Ev Sahibi" : "Deplasman"}</div>
                        </div>

                        {/* Opponent Team */}
                        <div className="text-center space-y-2">
                          <h3 className="font-bold text-lg">{opponent}</h3>
                          <p className="text-sm text-muted-foreground">Ortalama: {opponentRating.toFixed(1)}</p>
                          <div className="flex justify-center gap-1">
                            {opponentLastMatches.map((match, index) => (
                              <div
                                key={index}
                                className={`w-6 h-6 rounded-full ${match.color} text-white text-xs flex items-center justify-center font-bold`}
                              >
                                {match.result}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button onClick={simulateUserMatch} className="w-full" size="lg">
                        Maçı Simüle Et
                      </Button>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Henüz aktivite yok.</p>
              </CardContent>
            </Card> */}
          </div>
        )}

        {/* My Team Section */}
        {activeSection === "myteam" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Takımım</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>İlk 11'i Düzenle</Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>İlk 11 Düzenle</DialogTitle>
                    <DialogDescription>
                      Oyuncuları seçin ve "Değiştir" butonuna basarak pozisyonlarını değiştirin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">İlk 11</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {userTeam &&
                          userTeam.startingXI.map((playerId) => {
                            const player = userTeam.players.find((p) => p.id === playerId)
                            const isSelected = selectedPlayers.includes(playerId)
                            return player ? (
                              <div
                                key={player.id}
                                className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                                  isSelected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
                                }`}
                                onClick={() => togglePlayerSelection(playerId)}
                              >
                                <div>
                                  <div className="font-medium text-sm">{player.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {player.position} • {player.rating}
                                  </div>
                                </div>
                                {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                              </div>
                            ) : null
                          })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Yedekler</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {userTeam &&
                          userTeam.substitutes.map((playerId) => {
                            const player = userTeam.players.find((p) => p.id === playerId)
                            const isSelected = selectedPlayers.includes(playerId)
                            return player ? (
                              <div
                                key={player.id}
                                className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                                  isSelected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
                                }`}
                                onClick={() => togglePlayerSelection(playerId)}
                              >
                                <div>
                                  <div className="font-medium text-sm">{player.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {player.position} • {player.rating}
                                  </div>
                                </div>
                                {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                              </div>
                            ) : null
                          })}
                      </div>
                    </div>
                  </div>
                  <Button onClick={swapPlayers} disabled={selectedPlayers.length !== 2}>
                    Değiştir
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Takım İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-bold text-green-600 text-lg">{userTeam && userTeam.wins}</div>
                      <div className="text-xs text-muted-foreground">Galibiyet</div>
                    </div>
                    <div>
                      <div className="font-bold text-yellow-600 text-lg">{userTeam && userTeam.draws}</div>
                      <div className="text-xs text-muted-foreground">Beraberlik</div>
                    </div>
                    <div>
                      <div className="font-bold text-red-600 text-lg">{userTeam && userTeam.losses}</div>
                      <div className="text-xs text-muted-foreground">Mağlubiyet</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Puan:</span>
                      <span className="font-bold">{userTeam && userTeam.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gol Farkı:</span>
                      <span className="font-bold">{userTeam && userTeam.goalDifference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ortalama Rating:</span>
                      <span className="font-bold">{userTeam && userTeam.averageRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Kadro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {userTeam &&
                      userTeam.players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{player.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {player.position} • Rating: {player.rating}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Goller: {player.goals} • Asistler: {player.assists}
                            </div>
                          </div>
                          <Badge
                            variant={userTeam.startingXI.includes(player.id) ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {userTeam.startingXI.includes(player.id) ? "İlk 11" : "Yedek"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Standings Section */}
        {activeSection === "standings" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Puan Durumu</h2>
            <Card>
              <CardHeader>
                <CardTitle>Süper Lig Puan Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Sıra</th>
                        <th className="text-left p-2 font-semibold">Takım</th>
                        <th className="text-center p-2 font-semibold">O</th>
                        <th className="text-center p-2 font-semibold">G</th>
                        <th className="text-center p-2 font-semibold">B</th>
                        <th className="text-center p-2 font-semibold">M</th>
                        <th className="text-center p-2 font-semibold">AG</th>
                        <th className="text-center p-2 font-semibold">YG</th>
                        <th className="text-center p-2 font-semibold">AV</th>
                        <th className="text-center p-2 font-semibold">P</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameState.teams
                        .sort((a, b) => {
                          if (b.points !== a.points) return b.points - a.points
                          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
                          return b.goalsFor - a.goalsFor
                        })
                        .map((team, index) => (
                          <tr
                            key={team.id}
                            className={`border-b hover:bg-muted/50 ${
                              team.name === gameState.selectedTeam ? "bg-primary/10" : ""
                            }`}
                          >
                            <td className="p-2 font-medium">{index + 1}</td>
                            <td className="p-2">{team.name}</td>
                            <td className="text-center p-2">{team.played}</td>
                            <td className="text-center p-2">{team.wins}</td>
                            <td className="text-center p-2">{team.draws}</td>
                            <td className="text-center p-2">{team.losses}</td>
                            <td className="text-center p-2">{team.goalsFor}</td>
                            <td className="text-center p-2">{team.goalsAgainst}</td>
                            <td className="text-center p-2">
                              {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                            </td>
                            <td className="text-center p-2 font-bold">{team.points}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fixtures Section */}
        {activeSection === "fixtures" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">{gameState.currentWeek}. Hafta Fikstürü</h2>
            <Card>
              <CardHeader>
                <CardTitle>Maçlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    const weekMatches = gameState.fixtures.filter((f) => f.week === gameState.currentWeek)
                    const playingTeams = new Set()

                    weekMatches.forEach((match) => {
                      playingTeams.add(match.homeTeam)
                      playingTeams.add(match.awayTeam)
                    })

                    const byeTeam = gameState.teams.find((team) => !playingTeams.has(team.name))

                    return (
                      <>
                        {weekMatches.map((match, index) => (
                          <div
                            key={index}
                            className={`flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg ${
                              match.homeTeam === gameState.selectedTeam || match.awayTeam === gameState.selectedTeam
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-4 text-sm sm:text-base">
                              <span className="font-medium text-center min-w-[100px]">{match.homeTeam}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="font-medium text-center min-w-[100px]">{match.awayTeam}</span>
                            </div>
                            {match.played && (
                              <Badge variant="secondary" className="mt-2 sm:mt-0">
                                {match.homeScore} - {match.awayScore}
                              </Badge>
                            )}
                          </div>
                        ))}

                        {byeTeam && (
                          <div className="p-4 border rounded-lg bg-gray-50 text-center">
                            <span className="text-muted-foreground">Bay: </span>
                            <span className="font-medium">{byeTeam.name}</span>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Scorers Section */}
        {activeSection === "topscorers" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Gol Krallığı</h2>
            <Card>
              <CardHeader>
                <CardTitle>En Çok Gol Atan Oyuncular</CardTitle>
              </CardHeader>
              <CardContent>
                {topScorers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Henüz hiç maç oynanmadı. İlk maçlar oynanınca gol krallığı burada görünecek.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topScorers.map((player, index) => (
                      <div
                        key={`${player.name}-${player.team}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{player.name}</div>
                            <div className="text-xs text-muted-foreground">{player.team}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm font-bold">
                          {player.goals} gol
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Assists Section */}
        {activeSection === "topassists" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Asist Krallığı</h2>
            <Card>
              <CardHeader>
                <CardTitle>En Çok Asist Yapan Oyuncular</CardTitle>
              </CardHeader>
              <CardContent>
                {topAssists.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Henüz hiç maç oynanmadı. İlk maçlar oynanınca asist krallığı burada görünecek.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topAssists.map((player, index) => (
                      <div
                        key={`${player.name}-${player.team}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{player.name}</div>
                            <div className="text-xs text-muted-foreground">{player.team}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm font-bold">
                          {player.assists} asist
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
