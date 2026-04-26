import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
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
        { message: "Only admin can view agents" },
        { status: 403 }
      );
    }

    const agents = await User.find({ role: "agent" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Agents fetched successfully",
        agents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch agents error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}