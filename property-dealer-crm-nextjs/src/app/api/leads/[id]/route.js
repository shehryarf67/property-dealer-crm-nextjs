import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function PUT(request, { params }) {
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
    const body = await request.json();

    const existingLead = await Lead.findById(id);

    if (!existingLead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    if (
      currentUser.role === "agent" &&
      existingLead.assignedTo?.toString() !== currentUser.id
    ) {
      return NextResponse.json(
        { message: "You can only update assigned leads" },
        { status: 403 }
      );
    }

    const updatedData = {
      ...body,
      lastActivityAt: new Date(),
    };

    if (body.budget) {
      updatedData.score = calculateLeadScore(body.budget);
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name email role");

    await ActivityLog.create({
      leadId: updatedLead._id,
      userId: currentUser.id,
      action: "Lead Updated",
      description: `Lead details were updated by ${currentUser.name}`,
    });

    return NextResponse.json(
      {
        message: "Lead updated successfully",
        lead: updatedLead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update lead error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can delete leads" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    await ActivityLog.create({
      leadId: deletedLead._id,
      userId: currentUser.id,
      action: "Lead Deleted",
      description: `Lead was deleted by ${currentUser.name}`,
    });

    return NextResponse.json(
      { message: "Lead deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete lead error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}