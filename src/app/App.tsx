import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Onboarding
import Welcome from "@/app/screens/Welcome";
import PatientOnboarding from "@/app/screens/PatientOnboarding";

// Patient Flow
import PatientLayout from "@/app/layouts/PatientLayout";
import PatientHome from "@/app/screens/patient/PatientHome";
import TrackingScreen from "@/app/screens/patient/TrackingScreen";
import TrendsScreen from "@/app/screens/patient/TrendsScreen";
import ProfileScreen from "@/app/screens/patient/ProfileScreen";
import DevicePairingScreen from "@/app/screens/patient/DevicePairingScreen";

// Clinician Flow
import ClinicianLayout from "@/app/layouts/ClinicianLayout";
import ClinicianHome from "@/app/screens/clinician/ClinicianHome";
import PatientDetail from "@/app/screens/clinician/PatientDetail";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/patient-onboarding" element={<PatientOnboarding />} />
        
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientHome />} />
          <Route path="tracking" element={<TrackingScreen />} />
          <Route path="trends" element={<TrendsScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="pair-device" element={<DevicePairingScreen />} />
        </Route>
        
        <Route path="/clinician" element={<ClinicianLayout />}>
          <Route index element={<ClinicianHome />} />
          <Route path="patient/:patientId" element={<PatientDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}