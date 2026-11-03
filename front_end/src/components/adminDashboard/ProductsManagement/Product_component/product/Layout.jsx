import React from 'react'
import ProductTitle from './ProductTitle'
import Organization from './Organization'
import Tags from './Tags'

function Layout({formData, setFormData, handelChange}) {
  return (
    <div>
      <ProductTitle formData={formData} setFormData={setFormData} handelChange={handelChange}/>
      <Organization formData={formData} setFormData={setFormData} handelChange={handelChange}/>
      <Tags formData={formData} setFormData={setFormData} handelChange={handelChange}/>      
    </div>
  )
}

export default Layout