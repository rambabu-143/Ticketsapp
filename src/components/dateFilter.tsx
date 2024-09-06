'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SelectGroup } from '@radix-ui/react-select';

// Date options for the filter
const dateOptions = [
  { label: 'Today', value: dayjs().format('YYYY-MM-DD') },
  { label: 'Tomorrow', value: dayjs().add(1, 'day').format('YYYY-MM-DD') },
  { label: 'Yesterday', value: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
];

const DateFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDate = searchParams.get('dateFilter') || ''; 
  
    const handleDateChange = (date: string | undefined) => {
      const params = new URLSearchParams(searchParams);
  
      if (date) {
        params.set('dateFilter', date); 
      } else {
        params.delete('dateFilter');
      }
  
      const query = params.toString();
      router.push(`/tickets?${query}`);
    };
  
    return (
      <Select value={currentDate} onValueChange={handleDateChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by Date..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {dateOptions.map((date) => (
              <SelectItem key={date.value} value={date.value}>
                {date.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };
  
  export default DateFilter;
  