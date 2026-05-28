import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { data: sliders, error } = await supabase
            .from("home_sliders")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: sliders
        });

    } catch (error) {
        console.error("GET Slider Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, link, imageUrl } = body;

        if (!title || !imageUrl) {
            return NextResponse.json({ success: false, message: "Title and Image URL are required" }, { status: 400 });
        }

        const { data: newSlider, error } = await supabase
            .from("home_sliders")
            .insert([
                {
                    title: title,
                    link: link || null,
                    image_url: imageUrl
                }
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Slider Banner Published Successfully! 🎉",
            data: newSlider
        });

    } catch (error) {
        console.error("POST Slider Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}