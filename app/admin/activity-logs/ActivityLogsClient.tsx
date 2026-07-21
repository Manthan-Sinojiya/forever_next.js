"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Clock, Shield, Database, FileEdit } from "lucide-react";

export default function ActivityLogsClient({ data }: { data: any[] }) {
  const columns = [
    {
      key: "createdAt",
      label: "Timestamp",
      render: (row: any) => (
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <Clock className="w-4 h-4 text-slate-400" />
          {new Date(row.createdAt).toLocaleString()}
        </div>
      )
    },
    {
      key: "user",
      label: "User / Origin",
      render: (row: any) => {
        const user = row.userId;
        if (user) {
          return (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                {user.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-5 h-5 text-slate-400" />
            <span className="font-medium">System/Anonymous</span>
          </div>
        );
      }
    },
    {
      key: "action",
      label: "Action Type",
      render: (row: any) => {
        const action = row.action as string;
        let color = "bg-slate-100 text-slate-700 border-slate-200";
        let icon = <Database className="w-3.5 h-3.5" />;
        
        if (action.includes("CREATE")) {
          color = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (action.includes("UPDATE")) {
          color = "bg-blue-50 text-blue-700 border-blue-200";
          icon = <FileEdit className="w-3.5 h-3.5" />;
        } else if (action.includes("DELETE")) {
          color = "bg-rose-50 text-rose-700 border-rose-200";
        }
        
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
            {icon}
            {action}
          </span>
        );
      }
    },
    {
      key: "entity",
      label: "Target Entity",
      render: (row: any) => (
        <span className="font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-sm">
          {row.entity}
        </span>
      )
    },
    {
      key: "details",
      label: "Log Details",
      render: (row: any) => (
        <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]" title={row.details}>
          {row.details || "—"}
        </span>
      )
    },
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
          <p className="text-slate-500 mt-1">Audit trail of all system and administrative events.</p>
        </div>
      </div>
      
      <DataTable 
        title="System Events"
        columns={columns} 
        data={data} 
        searchPlaceholder="Search logs by action or entity..." 
        exportFilename="activity-logs.csv"
      />
    </div>
  );
}
