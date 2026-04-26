import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Lead from "@/models/Lead";

export async function GET(request) {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "agent") {
      return NextResponse.json(
        { message: "Only agents can view agent stats" },
        { status: 403 }
      );
    }

    const assignedLeads = await Lead.find({ assignedTo: currentUser.id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalAssigned = assignedLeads.length;

    const highPriority = assignedLeads.filter(
      (lead) => lead.score === "High"
    ).length;

    const overdueFollowUps = assignedLeads.filter((lead) => {
      if (!lead.followUpDate) return false;

      const followUpDate = new Date(lead.followUpDate);
      followUpDate.setHours(0, 0, 0, 0);

      return followUpDate < today;
    }).length;

    const closedLeads = assignedLeads.filter(
      (lead) => lead.status === "Closed"
    ).length;

    return NextResponse.json(
      {
        message: "Agent stats fetched successfully",
        stats: {
          totalAssigned,
          highPriority,
          overdueFollowUps,
          closedLeads,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Agent stats error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}