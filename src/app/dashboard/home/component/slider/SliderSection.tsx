'use client';
import { Grid } from "@mui/material";
import AddSliderForm from "./AddSliderForm";
import ActiveSlidersTable from "./ActiveSlidersTable";

export default function SliderSection() {
    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 5 }}>
                <AddSliderForm />
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
                <ActiveSlidersTable />
            </Grid>
        </Grid>
    );
}