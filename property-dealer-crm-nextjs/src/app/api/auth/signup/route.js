import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { validateSignupData } from "@/lib/validation";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, password, role } = body;

        const validationErrors = validateSignupData(body);

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { message: validationErrors[0], errors: validationErrors },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "agent",
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}