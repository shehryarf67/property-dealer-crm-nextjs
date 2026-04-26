import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function POST(request) {
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
        { message: "Only admin can create leads" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      phone,
      propertyInterest,
      budget,
      status,
      notes,
      assignedTo,
      followUpDate,
    } = body;

    if (!name || !email || !phone || !propertyInterest || !budget) {
      return NextResponse.json(
        {
          message:
            "Name, email, phone, property interest, and budget are required",
        },
        { status: 400 }
      );
    }

    const score = calculateLeadScore(budget);

    const lead = await Lead.create({
      name,
      email,
      phone,
      propertyInterest,
      budget,
      status: status || "New",
      notes: notes || "",
      assignedTo: assignedTo || null,
      score,
      followUpDate: followUpDate || null,
      lastActivityAt: new Date(),
    });

    await ActivityLog.create({
      leadId: lead._id,
      userId: currentUser.id,
      action: "Lead Created",
      description: `Lead created with ${score} priority`,
    });

    return NextResponse.json(
      {
        message: "Lead created successfully",
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    let query = {};

    if (currentUser.role === "agent") {
      query.assignedTo = currentUser.id;
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Leads fetched successfully",
        leads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch leads error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}