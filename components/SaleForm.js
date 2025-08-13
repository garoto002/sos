import { Add, Delete, ShoppingCart, Person, Receipt, AttachMoney, Calculate } from '@mui/icons-material';
import { 
  Button, 
  Container, 
  Divider, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState, useEffect } from 'react';
import SaleSummaryPanel from './SaleSummaryPanel';

export default function SaleForm({ onSubmit, isLoading, sale }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [saleItems, setSaleItems] = useState([
    { product: '', quantity: 1, price: 0, totalPrice: 0, ivaRate: 0.16 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  const calculateTotalPrice = (price, quantity, ivaRate) => {
    return (price * (1 + ivaRate)) * quantity;
  };

  const handleProductChange = (index, value) => {
    const updatedSaleItems = [...saleItems];
    const selectedProduct = products.find((product) => product.name === value);

    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      product: value,
      price: selectedProduct ? selectedProduct.price : 0,
      totalPrice: (selectedProduct ? selectedProduct.price : 0) * updatedSaleItems[index].quantity * (1 + updatedSaleItems[index].ivaRate),
    };

    setSaleItems(updatedSaleItems);
  };
  
  const handleDiscountChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    if (numericValue < 0) {
      alert('O desconto não pode ser negativo.');
      return;
    }
    setDiscount(numericValue);
  };

  const handleAddProduct = () => {
    const newProduct = { product: '', quantity: 1, price: 0, totalPrice: 0, ivaRate: 0.16 };
    setSaleItems([...saleItems, newProduct]);
  };

  const handleQuantityChange = (index, value) => {
    const updatedSaleItems = [...saleItems];
    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      quantity: parseFloat(value) || 1,
      totalPrice: (updatedSaleItems[index].price || 0) * (parseFloat(value) || 1) * (1 + updatedSaleItems[index].ivaRate),
    };
    setSaleItems(updatedSaleItems);
  };
  
  const handleReceivedAmountChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    if (numericValue < 0) {
      alert('O valor entregue não pode ser negativo.');
      return;
    }
    setReceivedAmount(numericValue);
  };

  const handleIvaRateChange = (index, value) => {
    const updatedSaleItems = [...saleItems];
    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      ivaRate: value,
      totalPrice: (updatedSaleItems[index].price || 0) * updatedSaleItems[index].quantity * (1 + value),
    };
    setSaleItems(updatedSaleItems);
  };

  const calculateTotalIva = () => {
    const totalIva = saleItems.reduce((acc, saleItem) => {
      return acc + saleItem.totalPrice * saleItem.ivaRate;
    }, 0);
    return totalIva.toFixed(2);
  };

  const calculateSubtotal = () => {
    return saleItems.reduce((acc, saleItem) => acc + saleItem.totalPrice, 0);
  };

  const calculateTotalBeforeDiscount = () => {
    const subtotal = calculateSubtotal();
    const totalIva = parseFloat(calculateTotalIva());
    const totalBeforeDiscount = subtotal + totalIva;
    return totalBeforeDiscount.toFixed(2);
  };

  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const totalAfterDiscount = totalBeforeDiscount - discount;
    return totalAfterDiscount.toFixed(2);
  };

  const calculateDebtOrChange = () => {
    const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount());
    const debtOrChange = receivedAmount - totalAfterDiscount;
    return debtOrChange;
  };
  
  const handleRemoveProduct = (index) => {
    if (saleItems.length > 1) {
      const updatedSaleItems = [...saleItems];
      updatedSaleItems.splice(index, 1);
      setSaleItems(updatedSaleItems);
    }
  };
 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const response = await fetch("/api/customers");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();
        const customersList = data.customers || data;
        setCustomers(customersList);
        if (!selectedCustomer && customersList.length > 0) {
          setSelectedCustomer(customersList[0]);
        }
        setIsLoadingCustomers(false);
      } catch (error) {
        alert("Ocorreu um erro ao buscar Clientes");
        setIsLoadingCustomers(false);
        console.error(error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();
        setProducts(data.products);
        setIsLoadingProducts(false);
      } catch (error) {
        alert("Ocorreu um erro ao buscar Produtos");
        setIsLoadingProducts(false);
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const debtOrChange = calculateDebtOrChange();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      py: 2
    }}>
      <Container maxWidth="xl">
        {/* Header Compacto */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 3,
          gap: 2
        }}>
          <ShoppingCart sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {sale ? "✏️ Editar Venda" : "🛒 Nova Venda"}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Formulário Principal - Maximizando espaço */}
          <Grid xs={12} lg={7}>
            <Paper sx={{ 
              height: 'fit-content',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              
              {/* Cliente - Header Fixo */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 2
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Person />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Cliente</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Select
                      value={selectedCustomer?.customerName || ''}
                      onChange={(e) =>
                        setSelectedCustomer(customers.find((c) => c.customerName === e.target.value))
                      }
                      fullWidth
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 1,
                        '& .MuiSelect-select': { py: 1 }
                      }}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Selecione um cliente</MenuItem>
                      {customers.map((customer) => (
                        <MenuItem key={customer._id} value={customer.customerName}>
                          {customer.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Stack>
              </Box>

              {/* Produtos - Lista Compacta */}
              <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Produtos
                    </Typography>
                    <Chip 
                      size="small" 
                      label={saleItems.length}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  {saleItems.map((saleItem, index) => (
                    <Paper 
                      key={index}
                      variant="outlined"
                      sx={{ 
                        p: 2,
                        backgroundColor: '#fafbfc',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        {/* Produto */}
                        <Grid xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Produto</InputLabel>
                            <Select
                              label="Produto"
                              value={saleItem?.product || ''}
                              onChange={(e) => handleProductChange(index, e.target.value)}
                              required
                            >
                              {products.map((product) => (
                                <MenuItem key={product._id} value={product.name}>
                                  {product.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Quantidade */}
                        <Grid xs={6} sm={2}>
                          <TextField
                            label="Qtd"
                            type='number'
                            size="small"
                            fullWidth
                            value={saleItem.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            inputProps={{ min: 1, step: 0.01 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">un</InputAdornment>
                            }}
                          />
                        </Grid>

                        {/* IVA */}
                        <Grid xs={6} sm={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>IVA</InputLabel>
                            <Select
                              label='IVA'
                              value={saleItem.ivaRate}
                              onChange={(e) => handleIvaRateChange(index, parseFloat(e.target.value))}
                            >
                              <MenuItem value={0.16}>16%</MenuItem>
                              <MenuItem value={0}>0%</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Preço Unitário */}
                        <Grid xs={6} sm={2}>
                          <TextField 
                            label="Preço"
                            size="small"
                            fullWidth
                            value={products.find((product) => product.name === saleItem.product)?.price || ''}
                            InputProps={{ 
                              readOnly: true,
                              startAdornment: <InputAdornment position="start">MT</InputAdornment>
                            }}
                            sx={{ backgroundColor: '#f8f9fa' }}
                          />
                        </Grid>

                        {/* Total */}
                        <Grid xs={5} sm={2}>
                          <TextField 
                            label="Total"
                            size="small"
                            fullWidth
                            value={saleItem.totalPrice.toFixed(2)}
                            InputProps={{ 
                              readOnly: true,
                              startAdornment: <InputAdornment position="start">MT</InputAdornment>,
                              sx: { fontWeight: 600, color: 'primary.main' }
                            }}
                            sx={{ backgroundColor: '#e3f2fd' }}
                          />
                        </Grid>

                        {/* Ações */}
                        <Grid xs={1} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                          {saleItems.length > 1 && (
                            <IconButton 
                              onClick={() => handleRemoveProduct(index)}
                              color="error"
                              size="small"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>

                {/* Botão Adicionar */}
                <Button 
                  onClick={handleAddProduct}
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ 
                    mt: 2, 
                    py: 1.5,
                    borderStyle: 'dashed',
                    '&:hover': { borderStyle: 'solid' }
                  }}
                >
                  Adicionar Produto
                </Button>
              </Box>

              {/* Pagamento e Totais - Seção Compacta */}
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                p: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calculate color="primary" />
                  Cálculos e Pagamento
                </Typography>

                <Grid container spacing={2}>
                  {/* Linha 1 - Totais */}
                  <Grid xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        MT {calculateSubtotal().toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">IVA</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        MT {calculateTotalIva()}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={6} md={3}>
                    <TextField
                      label='Desconto'
                      type='number'
                      fullWidth
                      size="small"
                      value={discount}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">MT</InputAdornment>
                      }}
                    />
                  </Grid>

                  <Grid xs={6} md={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      backgroundColor: 'primary.main', 
                      color: 'white',
                      borderRadius: 2 
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        MT {calculateTotalAfterDiscount()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Linha 2 - Pagamento */}
                  <Grid xs={6}>
                    <TextField 
                      label='Valor Recebido'
                      type='number'
                      fullWidth
                      size="small"
                      value={receivedAmount}
                      onChange={(e) => handleReceivedAmountChange(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">MT</InputAdornment>
                      }}
                    />
                  </Grid>

                  <Grid xs={6}>
                    <TextField 
                      label={debtOrChange < 0 ? 'Dívida' : debtOrChange > 0 ? 'Troco' : 'Pagamento Exato'}
                      fullWidth
                      size="small"
                      value={Math.abs(debtOrChange).toFixed(2)}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <InputAdornment position="start">MT</InputAdornment>,
                        style: { 
                          backgroundColor: debtOrChange < 0 ? '#ffebee' : debtOrChange > 0 ? '#f3e5f5' : '#e8f5e8',
                          fontWeight: 600
                        }
                      }}
                      color={debtOrChange < 0 ? 'error' : 'success'}
                    />
                  </Grid>

                  {/* Observações */}
                  <Grid xs={12}>
                    <TextField
                      label="Observações"
                      name="description"
                      defaultValue={sale?.description}
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      placeholder="Observações sobre esta venda..."
                      onChange={(e) => {
                        // Atualizar campo hidden correspondente
                        const hiddenField = document.querySelector('textarea[name="description"]');
                        if (hiddenField) {
                          hiddenField.value = e.target.value;
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Botão de Ação */}
              <Box sx={{ p: 3, backgroundColor: 'white' }}>
                <form onSubmit={onSubmit}>
                  {/* Campos hidden para compatibilidade com FormData */}
                  <input type="hidden" name="customName" value={selectedCustomer?.customerName || ''} />
                  <input type="hidden" name="discount" value={discount} />
                  <input type="hidden" name="receivedAmount" value={receivedAmount} />
                  <textarea name="description" defaultValue={sale?.description} style={{ display: 'none' }} />
                  
                  {saleItems.map((item, index) => (
                    <div key={index}>
                      <input type="hidden" name={`product${index}`} value={item.product} />
                      <input type="hidden" name={`price${index}`} value={item.price} />
                      <input type="hidden" name={`quantity${index}`} value={item.quantity} />
                      <input type="hidden" name={`ivaRate${index}`} value={item.ivaRate} />
                      <input type="hidden" name={`totalPrice${index}`} value={item.totalPrice} />
                    </div>
                  ))}

                  <Button 
                    disabled={isLoading} 
                    type="submit" 
                    fullWidth 
                    variant="contained"
                    size="large"
                    sx={{ 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
                      }
                    }}
                  >
                    {isLoading ? '⏳ Processando...' : (sale ? "💾 Atualizar Venda" : "✅ Finalizar Venda")}
                  </Button>
                </form>
              </Box>
            </Paper>
          </Grid>

          {/* Painel de Resumo - Lado Direito */}
          <Grid xs={12} lg={5}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <SaleSummaryPanel
                saleItems={saleItems}
                discount={discount}
                receivedAmount={receivedAmount}
                selectedCustomer={selectedCustomer}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}