import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Lead from "@/models/Lead";
import User from "@/models/User";
import ActivityLog from "@/models/ActivityLog";
import {
    sendEmail,
    assignedLeadEmailTemplate,
} from "@/lib/email";

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

        if (currentUser.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can assign leads" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const { assignedTo } = await request.json();

        if (!assignedTo) {
            return NextResponse.json(
                { message: "Agent is required" },
                { status: 400 }
            );
        }

        const lead = await Lead.findById(id);

        if (!lead) {
            return NextResponse.json(
                { message: "Lead not found" },
                { status: 404 }
            );
        }

        const agent = await User.findOne({
            _id: assignedTo,
            role: "agent",
        });

        if (!agent) {
            return NextResponse.json(
                { message: "Agent not found" },
                { status: 404 }
            );
        }

        const wasAlreadyAssigned = Boolean(lead.assignedTo);

        lead.assignedTo = agent._id;
        lead.status = "Assigned";
        lead.lastActivityAt = new Date();

        await lead.save();

        await ActivityLog.create({
            leadId: lead._id,
            userId: currentUser.id,
            action: wasAlreadyAssigned ? "Lead Reassigned" : "Lead Assigned",
            description: `${lead.name} was assigned to ${agent.name}`,
        });

        await sendEmail({
            to: agent.email,
            subject: "New Lead Assigned to You",
            html: assignedLeadEmailTemplate(lead, agent),
        });

        const updatedLead = await Lead.findById(lead._id).populate(
            "assignedTo",
            "name email role"
        );

        return NextResponse.json(
            {
                message: wasAlreadyAssigned
                    ? "Lead reassigned successfully"
                    : "Lead assigned successfully",
                lead: updatedLead,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Assign lead error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
