import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function CustomTable({cols,rows,handleChange,key_}) {
    return (
        <TableContainer component={Paper} key={key_}>
            <Table sx={{ minWidth: 50 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {cols.map((col_name) => (
                            <TableCell key={col_name}>{col_name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Object.keys(row).map((key) => (
                                <TableCell key={key}>
                                    <input
                                        style={{
                                            backgroundColor: "transparent", border: "none", color: "black",
                                            minWidth: typeof row[key] === 'number' ? undefined : '70px',
                                            maxWidth: typeof row[key] === 'number' ? '70px' : undefined,
                                            //   `{ ${typeof row[key] === 'number'} ? MaxWidth:"20px" : minWidth:"20px"}` 
                                        }}
                                        defaultValue={row[key]}
                                        disabled={key === "item_id"}
                                    onChange={(e) => handleChange(e, rowIndex, key)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )
}

export default CustomTable