import React from 'react';
import { useSelector } from 'react-redux';
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Specifications = () => {
  // Example specifications data
  const productData = useSelector(state => state.products.productData)

  return (
    <Box sx={{ maxWidth: '1016px', margin: 'auto' }}>
      
      <TableContainer component={Paper} sx={{border:"1px solid lightgray", borderRadius:"0" }}>
        <Table>
          <TableBody>
            {productData[1]?.specifications?.map((spec, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                  {spec.label}
                </TableCell>
                <TableCell>{spec.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Specifications;
