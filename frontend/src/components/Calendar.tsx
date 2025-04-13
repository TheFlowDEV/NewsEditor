import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DatePickerValue({label,value,setValue}:{label:string,value:Dayjs|null,setValue:React.Dispatch<React.SetStateAction<Dayjs|null>>}) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label={label}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
        </LocalizationProvider>
    );
}