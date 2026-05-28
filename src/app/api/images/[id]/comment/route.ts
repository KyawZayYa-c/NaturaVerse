import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { userName, text } = body;
        const { id: imageId } = await params;
        if (!text || text.trim() === "") {
            return NextResponse.json({ success: false, message: "Comment text cannot be empty" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("comments")
            .insert([
                {
                    image_id: imageId,
                    user_name: userName,
                    text: text
                }
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, comment: data });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: imageId } = await params;

        const { data: comments, error } = await supabase
            .from("comments")
            .select("id, user_name, text, created_at")
            .eq("image_id", imageId)
            .order("created_at", { ascending: true });

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

        return NextResponse.json({ success: true, comments: comments || [] });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}