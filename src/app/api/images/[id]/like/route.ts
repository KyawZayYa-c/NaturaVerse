import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { userId } = body;

        const resolvedParams = await params;
        const imageId = resolvedParams.id;

        if (!userId || userId === "guest") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: existingLike, error: fetchError } = await supabase
            .from("likes")
            .select("*")
            .eq("image_id", imageId)
            .eq("user_id", userId)
            .maybeSingle();

        if (fetchError) throw fetchError;

        const { data: imageData, error: imgError } = await supabase
            .from("images")
            .select("likes")
            .eq("id", imageId)
            .single();

        if (imgError) {
            console.error("Image Id does not exist ->", imageId, imgError);
            throw imgError;
        }

        const currentLikes = imageData?.likes || 0;

        if (existingLike) {
            await supabase
                .from("likes")
                .delete()
                .eq("image_id", imageId)
                .eq("user_id", userId);

            const newCount = Math.max(0, currentLikes - 1);
            await supabase
                .from("images")
                .update({ likes: newCount })
                .eq("id", imageId);

            return NextResponse.json({ success: true, isLiked: false, likesCount: newCount });
        } else {
            await supabase
                .from("likes")
                .insert([{ image_id: imageId, user_id: userId }]);

            const newCount = currentLikes + 1;
            await supabase
                .from("images")
                .update({ likes: newCount })
                .eq("id", imageId);

            return NextResponse.json({ success: true, isLiked: true, likesCount: newCount });
        }

    } catch (err) {
        console.error("Like Toggle Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}