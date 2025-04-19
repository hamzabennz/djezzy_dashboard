import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { useNavigate } from 'react-router-dom'
import { FaTools, FaPlug, FaDesktop, FaLeaf, FaUserAlt } from 'react-icons/fa' // Icons for failure types

// Updated failure data for Algerian cities with icons
const failureData = [
  {
    id: 'T-1024',
    img: <FaTools size={30} />, // Icon for hardware malfunction
    name: 'Hardware Malfunction',
    location: 'Algiers, Algiers',
    growShrink: -15.4, // Representing improvement in downtime
    status: 'Resolved',
    downtime: '4.2h'
  },
  {
    id: 'T-1025',
    img: <FaPlug size={30} />, // Icon for power outage
    name: 'Power Outage',
    location: 'Oran, Oran',
    growShrink: -8.2,
    status: 'Resolved',
    downtime: '6.5h'
  },
  {
    id: 'T-1026',
    img: <FaDesktop size={30} />, // Icon for software issue
    name: 'Software Issue',
    location: 'Constantine, Constantine',
    growShrink: -20.3,
    status: 'Resolved',
    downtime: '2.1h'
  },
  {
    id: 'T-1027',
    img: <FaLeaf size={30} />, // Icon for environmental issues
    name: 'Environmental',
    location: 'Tlemcen, Tlemcen',
    growShrink: 5.8, // Representing increase in downtime (negative)
    status: 'In Progress',
    downtime: '5.8h'
  },
  {
    id: 'T-1028',
    img: <FaUserAlt size={30} />, // Icon for human error
    name: 'Human Error',
    location: 'Blida, Blida',
    growShrink: -10.5,
    status: 'Pending',
    downtime: '1.5h'
  }
]

type TopProductProps = {
  data?: any[]
}

const TopProduct = ({ data = failureData }: TopProductProps) => {
  const navigate = useNavigate()

  const handleViewAll = () => {
    navigate('/tower-failures/all')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-400';
      case 'Pending':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:bg-opacity-20 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:bg-opacity-20 dark:text-gray-400';
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4>Recent Failures</h4>
        <Button size="sm" onClick={handleViewAll}>
          All Statuses
        </Button>
      </div>
      <div className="mt-5">
        {data.map((failure, index) => (
          <div
            key={failure.id}
            className={classNames(
              'flex items-center justify-between py-2 dark:border-gray-600',
              !isLastChild(data, index) && 'mb-2 border-b',
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar
                className="bg-white"
                size={50}
                icon={failure.img} // Use the icon directly
                shape="round"
              />
              <div>
                <div className="heading-text font-bold">
                  {failure.id}
                </div>
                <div>{failure.name} - {failure.location}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <GrowShrinkValue
                className="rounded-lg py-0.5 px-2 font-bold"
                value={failure.growShrink}
                positiveClass="bg-error-subtle"  // Swapped because decrease in downtime is good
                negativeClass="bg-success-subtle" // and increase in downtime is bad
                suffix="%"
                positiveIcon="+" 
                negativeIcon=""
              />
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(failure.status)}`}>
                {failure.status}
              </span>
              <span className="text-xs text-gray-500">Downtime: {failure.downtime}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TopProduct
