import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import crypt from "crypto";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, message: "Slider ID is required" }, { status: 400 });
        }

        const { data: slider, error: fetchError } = await supabase
            .from("home_sliders")
            .select("image_url")
            .eq("id", id)
            .single();

        if (fetchError || !slider) {
            return NextResponse.json({ success: false, message: "Slider not found" }, { status: 404 });
        }

         const urlParts = slider.image_url.split("/");
        const uploadIndex = urlParts.indexOf("upload");
        const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = publicIdWithExt.split(".").slice(0, -1).join(".");


        const timestamp = Math.round(new Date().getTime() / 1000);
        const apiSecret = process.env.CLOUDINARY_API_SECRET!;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypt.createHash("sha1").update(signatureString).digest("hex");


        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData,
        });

        // ၅။ Supabase delete
        const { error: deleteError } = await supabase
            .from("home_sliders")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return NextResponse.json({ success: false, message: deleteError.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Slider and Cloudinary Image Deleted Successfully! 🗑️"
        });

    } catch (error) {
        console.error("DELETE Slider Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Slider ID is required" }, { status: 400 });
        }

        if (!title) {
            return NextResponse.json({ success: false, message: "Title is required to update" }, { status: 400 });
        }

         const { data: updatedSlider, error } = await supabase
            .from("home_sliders")
            .update({ title: title })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Slider Title Updated Successfully! 📝",
            data: updatedSlider
        });

    } catch (error) {
        console.error("PUT Slider Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

