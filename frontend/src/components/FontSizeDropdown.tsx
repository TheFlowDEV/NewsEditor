import React from 'react';
import { useSlate } from 'slate-react';
import {Editor, Range, Transforms} from 'slate';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {CustomText} from "../types";

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40];

export const FontSizeDropdown = () => {
    const editor = useSlate();
    const [selection, setSelection] = React.useState<Range | null>(null);

    // Получаем текущий размер шрифта для выделения
    const getCurrentFontSize = () => {
        if (!editor.selection) return 16;

        const marks = Editor.marks(editor) as Partial<CustomText> | null;
        return marks?.fontSize || 16;
    };

    // Обработчик изменения размера
    const handleFontSizeChange = (event: any) => {
        const size = event.target.value;

        if (selection) {
            Editor.addMark(editor, 'fontSize', size);
        } else {
            // Сохраняем выделение перед изменением
            setSelection(editor.selection);
            setTimeout(() => {
                if (selection) {
                    Transforms.select(editor, selection);
                    Editor.addMark(editor, 'fontSize', size);
                }
            }, 10);
        }
    };

    return (
        <FormControl size="small" variant="outlined" sx={{ minWidth: 90 }}>
    <InputLabel>Размер</InputLabel>
    <Select
    value={getCurrentFontSize()}
    onChange={handleFontSizeChange}
    label="Размер"
    renderValue={(value) => `${value}px`}
>
    {FONT_SIZES.map((size) => (
        <MenuItem key={size} value={size} sx={{ fontSize: size }}>
        {size}px
    </MenuItem>
    ))}
    </Select>
    </FormControl>
);
};

