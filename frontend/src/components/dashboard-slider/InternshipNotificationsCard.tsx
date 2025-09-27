
import React from "react";
import { Briefcase } from "lucide-react";
import InternshipResourceSearch from "./InternshipResourceSearch";

const InternshipNotificationsCard: React.FC = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Briefcase className="w-6 h-6 text-pink-700" />
      <h3 className="text-lg font-bold text-pink-800">Internship Notifications</h3>
    </div>
    <InternshipResourceSearch />
  </div>
);

export default InternshipNotificationsCard;
