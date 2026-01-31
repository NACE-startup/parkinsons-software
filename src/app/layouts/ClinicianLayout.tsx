import { Outlet } from "react-router-dom";

export default function ClinicianLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <Outlet />
    </div>
  );
}