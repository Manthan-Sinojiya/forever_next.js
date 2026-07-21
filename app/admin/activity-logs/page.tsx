import React from "react";
import { getActivityLogs } from "@/actions/admin/activityLogs";
import ActivityLogsClient from "./ActivityLogsClient";

export default async function ActivityLogsPage() {
  const logs = await getActivityLogs();

  return <ActivityLogsClient data={logs} />;
}
