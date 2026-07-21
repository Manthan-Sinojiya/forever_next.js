import { getSettings } from "@/actions/admin/settings";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { data, success } = await getSettings();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Settings</h1>
          <p className="text-slate-500 mt-1">
            Manage your store's core identity, contact information, and localization preferences.
          </p>
        </div>
      </div>

      {!success && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          Warning: Failed to load existing settings. You may be creating a new settings document.
        </div>
      )}

      <SettingsForm initialData={data} />
    </div>
  );
}
