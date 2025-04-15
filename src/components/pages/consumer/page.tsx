import { columns } from './columns'
import { DataTable } from "./data-table"
import { useContext } from 'react'
import { Store } from '@/store/Store'
import { Skeleton } from "@/components/ui/skeleton"

export default function Consumer() {
  const context = useContext(Store)

  if (!context || !context.customers) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  const { customers } = context

  const cstmrs = customers.map(cnsr => {
    return {
      cnsr_id: cnsr.cnsr_id,
      name: cnsr.name,
      email: cnsr.email,
      address: cnsr.address,
      mobile: cnsr.mobile
    }
  })

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={cstmrs} />
    </div>
  )
}
