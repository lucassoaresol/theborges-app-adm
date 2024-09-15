import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekday from 'dayjs/plugin/weekday';

import 'dayjs/locale/pt-br';

const dayLib = dayjs;

dayLib.locale('pt-br');
dayLib.extend(isBetween);
dayLib.extend(localizedFormat);
dayLib.extend(minMax);
dayLib.extend(relativeTime);
dayLib.extend(weekday);

export default dayLib;
