import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import {NatureCategories} from "@/src/components/NatureCategories";


type CategorySelectProps = {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
};

export default function CategorySelect({ value, onChange, error, helperText }: CategorySelectProps) {
    return (
        <FormControl variant="filled" fullWidth error={error} sx={{ bgcolor: '#FFFFFF', borderRadius: '4px' }}>
            <InputLabel id="category-select-label" sx={{ color: '#666' }}>Category</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value={value}
                onChange={(e) => onChange(e.target.value as string)}
                disableUnderline={false}
                sx={{ color: '#000' }}
            >
                {NatureCategories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText sx={{ fontWeight: 'bold' }}>{helperText}</FormHelperText>}
        </FormControl>
    );
}