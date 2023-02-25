import React from 'react'

const dropdownbox = () => {
  return (
    <div>
        <select onChange={selectedSechema}>
            <option value="">Add schema to segment</option>
            {filteredSQ.map((schema,index)=>{
                return(
                    <option key={index} value={schema.value} >{schema.label}</option>
                )
            })}
        </select>
    </div>
  )
}

export default dropdownbox
