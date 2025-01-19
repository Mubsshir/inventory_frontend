import {columns} from './columns'
import { DataTable } from "./data-table"
import { useContext } from 'react'
import { Store } from '@/store/Store'
import Loading from '@/components/ui/Loading'


export default  function Consumer() {

  const context=useContext(Store)

  if(!context){
    return <Loading/>
  }

  const {customers}=context

  const cstmrs=customers?.map(cnsr=>{
    return {cnsr_id:cnsr.cnsr_id,name:cnsr.name,email:cnsr.email,address:cnsr.address,mobile:cnsr.mobile}
  })

  console.log(cstmrs)
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={cstmrs||[]} />
    </div>
  )
}
