import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import dayLib from '@/lib/dayjs';
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { useHome } from '../useHome';
import { Agenda } from './agenda';



export function HomeContent() {
  const { workingDays, handleSelectWorkingDayId, selectWorkingDayId, isLoading } = useHome();

  const isTabletOrDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1024px)'
  });

  const [currentBlock, setCurrentBlock] = useState(0);
  const itemsPerPage = isDesktopOrLaptop ? 7 : 5;

  const totalBlocks = workingDays ? Math.ceil(workingDays.length / itemsPerPage) : 0;
  const currentItems = workingDays ? workingDays.slice(currentBlock * itemsPerPage, (currentBlock + 1) * itemsPerPage) : [];

  const handleNext = () => {
    if (currentBlock < totalBlocks - 1) {
      setCurrentBlock(currentBlock + 1);
    }
  };

  const handlePrev = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1);
    }
  };


  return (
    <div className="mt-10 flex flex-col items-center justify-center px-4">
      {isTabletOrDesktopOrLaptop ? <div className="mt-5 mb-4 p-3">
        <div className="flex items-center gap-2">
          {/* Botão de voltar, desativado se estiver no primeiro bloco */}
          <Button
            size='icon' onClick={handlePrev}
            disabled={currentBlock === 0}
          >
            <FaArrowLeft />
          </Button>

          <div className="flex justify-center gap-2 w-full">
            {isLoading ? <Skeleton className="h-[40px] w-[120px] rounded-xl" /> : currentItems.map((el, index) => {
              const dateDay = dayLib(el.date);
              return (
                <Button
                  onClick={() => handleSelectWorkingDayId(el.key)}
                  key={index}
                  variant={selectWorkingDayId === el.key ? 'default' : 'outline'}
                  className="gap-1 min-w-[100px] flex-shrink-0"
                  disabled={el.isClosed}
                >
                  <div className="text-2xl font-bold">
                    {dateDay.get('date')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dateDay.format('ddd')}
                  </div>
                </Button>
              );
            })}
          </div>

          <Button
            size='icon' onClick={handleNext}
            disabled={currentBlock === totalBlocks - 1} className="flex-shrink-0"
          >
            <FaArrowRight />
          </Button>
        </div>
      </div> : <div className="mt-5 flex items-center gap-4 mb-4 w-full overflow-x-auto p-3">
        <div className="flex justify-center gap-4">
          {workingDays && workingDays.map((el, index) => {
            const dateDay = dayLib(el.date);
            return (
              <Button
                onClick={() => handleSelectWorkingDayId(el.key)}
                key={index}
                variant={selectWorkingDayId === el.key ? 'default' : 'outline'} className='gap-1 min-w-[120px] flex-shrink-0' disabled={el.isClosed}
              >
                <div className="text-2xl font-bold">
                  {dateDay.get('date')}
                </div>
                <div className="text-sm text-gray-500">
                  {dateDay.format('ddd')}
                </div>
              </Button>
            );
          })}
        </div>
      </div>}
      <Agenda />
    </div>
  );
}


