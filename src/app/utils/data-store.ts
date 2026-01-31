/**
 * Simple data store for app state
 * In a production app, this would use a proper state management solution
 */

export interface Episode {
  id: string;
  timestamp: Date;
  duration: number; // in seconds
  context?: string; // "turning" | "doorway" | "crowds" | "stress" | "medication timing"
}

export interface PatientProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  shareCode: string;
  sharingEnabled: boolean;
}

export interface Device {
  id: string;
  name: string;
  battery: number;
  isConnected: boolean;
  signalStrength: number;
  pairedAt?: string;
  lastSyncAt?: string;
}

export interface ClinicianPatient {
  id: string;
  name: string;
  age: number;
  stabilityScore: number;
  episodesPerDay: number;
  avgDuration: number;
  trend: "improving" | "stable" | "worsening";
  lastUpdated: Date;
}

// Mock data for demonstration
export const mockPatientProfile: PatientProfile = {
  id: "P001",
  name: "Toshi",
  dateOfBirth: "1962-04-15",
  gender: "Male",
  shareCode: "PATIENT-P001-SHARE",
  sharingEnabled: true,
};

// Device state management
export function getPairedDevice(): Device | null {
  const deviceData = localStorage.getItem("pairedDevice");
  if (!deviceData) return null;
  
  try {
    return JSON.parse(deviceData);
  } catch {
    return null;
  }
}

export function updateDeviceBattery(battery: number): void {
  const device = getPairedDevice();
  if (device) {
    device.battery = battery;
    device.lastSyncAt = new Date().toISOString();
    localStorage.setItem("pairedDevice", JSON.stringify(device));
  }
}

export function disconnectDevice(): void {
  localStorage.removeItem("pairedDevice");
}

export function updateDeviceConnection(isConnected: boolean): void {
  const device = getPairedDevice();
  if (device) {
    device.isConnected = isConnected;
    device.lastSyncAt = new Date().toISOString();
    localStorage.setItem("pairedDevice", JSON.stringify(device));
  }
}

// Generate mock episodes for the last 7 days
export function generateMockEpisodes(): Episode[] {
  const episodes: Episode[] = [];
  const contexts = ["turning", "doorway", "crowds", "stress", "medication timing"];
  
  for (let day = 0; day < 7; day++) {
    const episodesPerDay = Math.floor(Math.random() * 8) + 2; // 2-10 episodes per day
    
    for (let i = 0; i < episodesPerDay; i++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(Math.random() * 14) + 6); // 6am - 8pm
      date.setMinutes(Math.floor(Math.random() * 60));
      
      episodes.push({
        id: `EP-${day}-${i}`,
        timestamp: date,
        duration: Math.floor(Math.random() * 15) + 3, // 3-18 seconds
        context: contexts[Math.floor(Math.random() * contexts.length)],
      });
    }
  }
  
  return episodes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const mockEpisodes = generateMockEpisodes();

// Mock clinician patients
export const mockClinicianPatients: ClinicianPatient[] = [
  {
    id: "P001",
    name: "Toshi K.",
    age: 62,
    stabilityScore: 74,
    episodesPerDay: 5.2,
    avgDuration: 6.8,
    trend: "stable",
    lastUpdated: new Date(),
  },
  {
    id: "P002",
    name: "Maria S.",
    age: 58,
    stabilityScore: 82,
    episodesPerDay: 3.1,
    avgDuration: 5.2,
    trend: "improving",
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "P003",
    name: "Robert L.",
    age: 67,
    stabilityScore: 58,
    episodesPerDay: 7.8,
    avgDuration: 8.5,
    trend: "worsening",
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
  },
  {
    id: "P004",
    name: "Chen W.",
    age: 71,
    stabilityScore: 88,
    episodesPerDay: 2.4,
    avgDuration: 4.1,
    trend: "improving",
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
];

// Helper functions
export function getEpisodesToday(episodes: Episode[]): Episode[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return episodes.filter(ep => ep.timestamp >= today);
}

export function getEpisodesInRange(episodes: Episode[], days: number): Episode[] {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  return episodes.filter(ep => ep.timestamp >= startDate);
}

export function getAverageDuration(episodes: Episode[]): number {
  if (episodes.length === 0) return 0;
  const total = episodes.reduce((sum, ep) => sum + ep.duration, 0);
  return Math.round((total / episodes.length) * 10) / 10;
}

export function getTotalDuration(episodes: Episode[]): number {
  return episodes.reduce((sum, ep) => sum + ep.duration, 0);
}

// Group episodes by day for charts
export interface DailyData {
  date: string;
  count: number;
  avgDuration: number;
  totalDuration: number;
}

export function groupEpisodesByDay(episodes: Episode[], days: number): DailyData[] {
  const data: { [key: string]: Episode[] } = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data[dateStr] = [];
  }
  
  episodes.forEach(ep => {
    const dateStr = ep.timestamp.toISOString().split('T')[0];
    if (data[dateStr]) {
      data[dateStr].push(ep);
    }
  });
  
  return Object.entries(data).map(([date, eps]) => ({
    date,
    count: eps.length,
    avgDuration: getAverageDuration(eps),
    totalDuration: getTotalDuration(eps),
  })).sort((a, b) => a.date.localeCompare(b.date));
}