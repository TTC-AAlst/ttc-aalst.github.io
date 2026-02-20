import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/nl';

dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale('nl');
