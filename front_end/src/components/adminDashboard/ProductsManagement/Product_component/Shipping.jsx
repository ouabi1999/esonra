import React, { useState } from 'react'
import styled from "styled-components"
import CancelIcon from '@mui/icons-material/Cancel';
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";



function Shipping({formData,  setFormData}) {
    const [available_shipping, setAvailable_shipping]= useState({
        methodName: "",
        cost : "",
        from : "",
        to : "",
      });

    const addShipping = () => {
        const currentShipping = formData.available_shipping || [];
        const new_available_shipping = [...currentShipping, available_shipping];
        setFormData((prev) => ({
            ...prev,
            available_shipping: new_available_shipping
        }));
        console.log(formData.available_shipping)
        setAvailable_shipping({
            methodName: "",
            cost: "",
            from: "",
            to:""
        })


    }

    const remove_ShippingMethod = (method) => {
        const available_shipping_slice = formData.available_shipping.slice();
        setFormData({
            ...formData,
            available_shipping: available_shipping_slice.filter((x) => x !== method),
        });
    };

    return (
        <Container>
            <h4 style={{ fontFamily:"sans-serif" }}>Shipping</h4>
            {formData.available_shipping?.map((item, index) => {
                return (
                    <div key={index} className="shipping_method_wrapper">
                        <span className="method_name">{item.methodName} </span>
                        <CancelIcon
                            className="remove-icon"
                            onClick={() => remove_ShippingMethod(item)}
                        />
                          
                    </div>
                );
            })}
            <div className="availability">
                <TextField
                    required
                    className="text_input"
                    select
                    label="Shipping Method"
                    /*helperText="Please select your currency"*/
                    value={available_shipping.methodName}
                    onChange={(event) =>
                        setAvailable_shipping({
                            ...available_shipping,
                            methodName: event.target.value,
                        })
                    }
                >
                    <MenuItem value={"Free Shipping"}> Free Shipping</MenuItem>
                    <MenuItem value={"E-Packet"}> E-Packet</MenuItem>
                    <MenuItem value={"UPS"}>UPS</MenuItem>
                    <MenuItem value={"USPS"}>USPS</MenuItem>
                    <MenuItem value={"FedEx"}>FedEx</MenuItem>
                    <MenuItem value={"DHL"}>DHL</MenuItem>
                    <MenuItem value={"EMS"}>EMS</MenuItem>
                    <MenuItem value={"CPO & Air Mail"}>CPO & Air Mai</MenuItem>
                    <MenuItem value={"Standard Shipping"}> Standard Shipping </MenuItem>
                </TextField>
            </div>
            <div>
                <TextField className="text_input"
                    required
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    type="number"
                    value={available_shipping.cost}
                    label="Shipping cost"
                    name="shipping cost"
                    onChange={(event) =>
                        setAvailable_shipping({
                            ...available_shipping,
                            cost: event.target.value,
                        })
                    }
                />
            </div>
            <span style={{fontSize:"12px", fontFamily:"sans-serif", marginBottom:"15px" }}>Delivery</span>
            <div>
                <TextField
                    required
                    className="text_input"
                    name="from"
                    value={available_shipping.from}
                    label="From "
                    inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                    type="number"
                    onChange={(event) =>
                        setAvailable_shipping({
                            ...available_shipping,
                            from : event.target.value,
                        })
                    }
                />
                 <TextField
                    required
                    className ="text_input"
                    name="to"
                    value={available_shipping.to}
                    label="To"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    type="number"
                    onChange = {(event) =>
                        setAvailable_shipping({
                            ...available_shipping,
                            to: event.target.value,
                        })
                    }
                />
            </div>
            <Button variant="contained" onClick={addShipping}>Add</Button>

        </Container>
    )
}

export default Shipping

const Container = styled.div`
    margin-bottom: 10px;
    background: rgb(245, 245, 245);
    border-radius: 6px;
    padding: 10px;

      
      .shipping_method_wrapper{
        display: flex;
        align-items: center;
        position:relative;

        
        .method_name {
          padding: 0px 5px;
          background:goldenrod;
          color: white;
          border-radius: 4px;
          margin-right: 1px;
          margin-bottom: 15px;
        }
       
    
    button{
       text-transform:capitalize;
    }

    .remove-icon{
        cursor: pointer;
        position:absolute;
        box-shadow: 2px 4px 4px  rgb(0, 0, 0, 0.45);
        background:#fff;
        border-radius:50%;
        color:red;
        font-size:15px;
        top:-8px;
        left:45px;
        z-index:1;
      }
    
      }
`