import dayjs from 'dayjs';
import i18n from 'i18next';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('vi');

export const getTimeline = (time) => {
    
    if (!time) return "";
    if (dayjs(time).isSame(dayjs().subtract(1, 'day'), 'day')) {
        return i18n.t('content.yesterday');
    } else if (dayjs(time).isSame(dayjs(), 'day')) {
        
        return i18n.t('content.today');
    } else return dayjs(time).format('DD/MM/YYYY');
};
