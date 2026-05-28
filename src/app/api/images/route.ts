import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");
        const userId = searchParams.get("userId") || "";

        let query = supabase
            .from('images')
            .select('*', { count: 'exact' })
            .order('id', { ascending: true });

        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);
        }

        const { data: imagesData, error, count } = await query;
        if (error) throw error;

        const imagesWithLikeStatus = await Promise.all((imagesData || []).map(async (img) => {

            const { count: realCommentsCount } = await supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("image_id", img.id);

            if (!userId || userId === "guest") {
                return {
                    ...img,
                    likesCount: img.likes || 0,
                    isLikedByUser: false,
                    commentsCount: realCommentsCount || 0
                };
            }

            const { data: userLike } = await supabase
                .from("likes")
                .select("*")
                .eq("image_id", img.id)
                .eq("user_id", userId)
                .maybeSingle();

            return {
                ...img,
                likesCount: img.likes || 0,
                isLikedByUser: !!userLike,
                commentsCount: realCommentsCount || 0
            };
        }));

        const totalCount = count || 0;
        const limitVal = limitParam ? parseInt(limitParam) : totalCount;
        const totalPages = limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1;

        return NextResponse.json({
            data: imagesWithLikeStatus,
            meta: {
                page: pageParam ? parseInt(pageParam) : 1,
                limit: limitVal,
                totalCount,
                totalPages
            }
        });

    } catch (err) {
        console.error("Backend Error ->", err);
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("API Received Body:", body);

        const { data, error } = await supabase
            .from('images')
            .insert([
                {
                    title: body.title,
                    category: body.category,
                    imageUrl: body.imageUrl,
                    description: body.description,
                    likes: body.likes ? Number(body.likes) : 0,
                }
            ])
            .select();

        if (error) {
            console.error("Supabase Error Details:", error);
            throw error;
        }

        return NextResponse.json(data[0], { status: 201 });
    } catch (error) {
        console.error("DB Save Error:", error);
        return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }
}