import { useState } from 'react';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Select from '@/components/ui/Select';
import AbbreviateNumber from '@/components/shared/AbbreviateNumber';
import { options } from '../constants';
import type { Period } from '../types';

const periodLabel: Record<Period, string> = {
    thisMonth: 'month',
    thisWeek: 'week',
    thisYear: 'year',
};

const hardcodedData = {
    thisMonth: { resolved: 42, target: 50, percentage: 84 },
    thisWeek: { resolved: 10, target: 12, percentage: 83 },
    thisYear: { resolved: 320, target: 400, percentage: 80 },
};

const SalesTarget = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth');

    const currentData = hardcodedData[selectedPeriod];

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h4>Failure Recovery</h4>
                <Select
                    className="w-[120px]"
                    size="sm"
                    placeholder="Select period"
                    value={options.find(option => option.value === selectedPeriod)}
                    options={options}
                    isSearchable={false}
                    onChange={(option) => {
                        if (option?.value) {
                            setSelectedPeriod(option.value);
                        }
                    }}
                />
            </div>
            <div className="flex items-center justify-between mt-8">
                <div className="flex flex-col">
                    <h2>
                        <AbbreviateNumber value={currentData.resolved} />
                        <span className="opacity-60 text-base font-bold">
                            {' / '}
                            <AbbreviateNumber value={currentData.target} /> Resolved
                        </span>
                    </h2>
                    <div className="mt-1 text-sm text-gray-500">
                        Failures resolved this {periodLabel[selectedPeriod]}
                    </div>
                </div>
                <div>
                    <Progress
                        percent={currentData.percentage}
                        width={80}
                        variant="circle"
                        strokeWidth={8}
                    />
                </div>
            </div>
        </Card>
    );
};

export default SalesTarget;
