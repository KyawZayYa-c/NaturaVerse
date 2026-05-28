import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized - No Token Found" }, { status: 401 });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string; role: string };

        return NextResponse.json({
            success: true,
            user: {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid or Expired Token" }, { status: 401 });
    }
}