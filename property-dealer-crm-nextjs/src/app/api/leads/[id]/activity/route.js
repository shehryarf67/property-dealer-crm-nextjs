import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "agent" &&
      lead.assignedTo?.toString() !== currentUser.id
    ) {
      return NextResponse.json(
        { message: "You can only view activity for assigned leads" },
        { status: 403 }
      );
    }

    const activities = await ActivityLog.find({ leadId: id })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Activity fetched successfully",
        activities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch activity error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}