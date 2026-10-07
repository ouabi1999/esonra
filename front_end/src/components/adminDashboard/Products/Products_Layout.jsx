import React, { useEffect, useRef, useState } from 'react'
import AdminProducts from './Admin_Products';
import { Stack } from '@mui/system';
import Pagination from "@mui/material/Pagination";
import ApiInstance from "../../../../common/baseUrl"
import ProductManagement from '../Products/ProductManagement';
import AliExpressRating from './AliExpressRating';

export default function ProductsLayout(){
   
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;
    const [totalProucts, setTotalProucts] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [products, setProducts] = useState([])
    const [EditProduct, setEditProduct] = useState({})

    const [isLoading, setIsLoading] = useState(false)
    const [isEditProductOn, setIsEditProductOn] = useState(false)
    const [isAddProductOn, setIsAddProductOn] = useState(false)
    const [isAddRatingOn, setIsAddRatingOn] = useState(false)

    const [opnedModel, setOpendModel] = useState(false)


    const scrollRef = useRef()

      useEffect(() => {
        setIsLoading(true)
        ApiInstance.get('get_dashboard_products/', { params: {currentPage, per_page: PER_PAGE } })
          .then(response => {
            setIsLoading(false)
            setProducts(response.data.products);
            setTotalProucts(response.data.total_products);
            setTotalPages(response.data.total_pages)
            
          })
          .catch(error => {
            setIsLoading(false)
            console.error(error);
          });
        
        
      }, [currentPage]);
      

   

    

 
    
   
    
    const deleteProduct =  (id)=>{
       
        ApiInstance.delete(`product/${id}/`).then(response => {
            setProducts(products.filter((x) => x.id !== id))
            return response.json()
         }
        )
         .catch(err => console.log(err))
        
    }
      // show product details

 

 const open_Edit_Modal = (product)=>{
      setIsEditProductOn(true)
      setIsAddProductOn(false)
      setOpendModel(true)
      setEditProduct(product)
      console.log(isAddProductOn)
      console.log(isEditProductOn)
      
  }
  const close_Modal = () =>{
        setIsEditProductOn(false)
        setIsAddProductOn(true)
        setOpendModel(false)

   }
   const open_addProduct_Modal = ()=>{
   
      setIsEditProductOn(false)
      setIsAddProductOn(true)
      setOpendModel(true)
      
  }
  
  const open_add_rating = (product)=>{
      setIsAddRatingOn(!isAddRatingOn) 
      console.log(product)
      setEditProduct(product)

  }
   const handleChange = (event, value) => {
        setCurrentPage(value);
        scrollRef.current?.scrollIntoView({ behavior: "auto"})
     };
   
    return (
            <div ref={scrollRef}>
                {!opnedModel && (
               <>
               
                    <AdminProducts
                        products={products}
                        deleteProduct={deleteProduct}
                        open_addProduct_Modal ={open_addProduct_Modal}
                        open_Edit_Modal={open_Edit_Modal}
                        open_add_rating = {open_add_rating}
                        isLoading = {isLoading}

                    />
                    
                    <div style={{display:"flex",margin:"10px 0", justifyContent:"center", width:"100%"}}>
                    <Stack spacing={2}>
                      <Pagination  onChange = {handleChange}  count={totalPages} variant="outlined" shape="rounded" />
                    </Stack>
                </div>
                </>
                )}
                {opnedModel && (
                <ProductManagement
                products={products}
                EditProduct = {EditProduct}
                deleteProduct={deleteProduct}
                isLoading = {isLoading}
                close_Modal = {close_Modal}
                isEditProductOn ={isEditProductOn}
                isAddProductOn = {isAddProductOn}
                      
                />
                )}
                {isAddRatingOn && (
                <AliExpressRating 
                   isAddRatingOn = {isAddRatingOn}
                   product = {EditProduct}
                   

                />
                )}
            </div>
        )

    }

