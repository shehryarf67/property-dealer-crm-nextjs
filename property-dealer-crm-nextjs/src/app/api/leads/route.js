import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import Lead from "@/models/Lead";
import User from "@/models/User";
import ActivityLog from "@/models/ActivityLog";
import { sendEmail, newLeadEmailTemplate } from "@/lib/email";
import { validateLeadData } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimiter";

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
        const rateLimitResult = rateLimit({
            key: currentUser.id,
            limit: currentUser.role === "agent" ? 50 : 500,
            windowMs: 60 * 1000,
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { message: "Too many requests. Please try again later." },
                { status: 429 }
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

        const validationErrors = validateLeadData(body);

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { message: validationErrors[0], errors: validationErrors },
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

        const admins = await User.find({ role: "admin" }).select("email");

        for (const admin of admins) {
            await sendEmail({
                to: admin.email,
                subject: "New Lead Created",
                html: newLeadEmailTemplate(lead),
            });
        }

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
