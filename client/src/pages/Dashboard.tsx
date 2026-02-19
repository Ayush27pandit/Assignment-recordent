import React from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { BuyerTable } from "../components/dashboard/BuyerTable";
import { UploadZone } from "../components/dashboard/UploadZone";
import { UploadHistory } from "../components/dashboard/UploadHistory";
import { UploadBuyers } from "../components/dashboard/UploadBuyers";

export const BuyersPage: React.FC = () => {
  return (
    <DashboardLayout>
      <BuyerTable />
    </DashboardLayout>
  );
};

export const ImportPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <UploadZone />
      </div>
    </DashboardLayout>
  );
};

export const HistoryPage: React.FC = () => {
  return (
    <DashboardLayout>
      <UploadHistory />
    </DashboardLayout>
  );
};

export const UploadBuyersPage: React.FC = () => {
  return (
    <DashboardLayout>
      <UploadBuyers />
    </DashboardLayout>
  );
};

export const DashboardHome: React.FC = () => {
  return (
    <DashboardLayout>
      <UploadZone />
    </DashboardLayout>
  );
};
