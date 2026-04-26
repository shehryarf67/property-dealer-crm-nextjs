import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Lead from "@/models/Lead";
import User from "@/models/User";

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

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can view analytics" },
        { status: 403 }
      );
    }

    const totalLeads = await Lead.countDocuments();
    const totalAgents = await User.countDocuments({ role: "agent" });

    const statusDistribution = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const priorityDistribution = await Lead.aggregate([
      {
        $group: {
          _id: "$score",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const agentPerformance = await Lead.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          totalAssigned: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0],
            },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },
          contacted: {
            $sum: {
              $cond: [{ $eq: ["$status", "Contacted"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $project: {
          _id: 1,
          totalAssigned: 1,
          closed: 1,
          inProgress: 1,
          contacted: 1,
          agentName: "$agent.name",
          agentEmail: "$agent.email",
        },
      },
      {
        $sort: { totalAssigned: -1 },
      },
    ]);

    return NextResponse.json(
      {
        message: "Analytics fetched successfully",
        analytics: {
          totalLeads,
          totalAgents,
          statusDistribution,
          priorityDistribution,
          agentPerformance,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}