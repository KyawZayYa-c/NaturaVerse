import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { data, error } = await supabase
            .from('images')
            .update({
                title: body.title,
                category: body.category,
                imageUrl: body.imageUrl,
                description: body.description,
                likes: body.likes ? Number(body.likes) : undefined,   // ဒေတာပါမှ တန်ဖိုးပြောင်းမယ်
                rating: body.rating ? Number(body.rating) : undefined
            })
            .eq('id', id) // 👈 ဘယ် ID ကို ပြင်မှာလဲဆိုတာ သတ်မှတ်ခြင်း
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Updated successfully", data: data[0] });
    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update image" }, { status: 500 });
    }
}

// 🎯 DELETE Method - ဒေတာ ဖျက်သိမ်းရန်
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // URL ထဲက ID ကို ဖတ်ခြင်း

        const { data, error } = await supabase
            .from('images')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json({ error: "Image not found သို့မဟုတ် ဖျက်ပြီးသားဖြစ်နေသည်" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully", deletedData: data[0] });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete image" }, { status: 500 });
    }
}