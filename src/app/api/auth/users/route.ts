import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { count, error } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true });

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            totalUsers: count || 0
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}