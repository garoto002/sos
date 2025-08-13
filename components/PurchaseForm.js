import { Add, Delete, Store, ShoppingCart, Receipt, Payment } from '@mui/icons-material';
import { 
  Container, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  FormControl, 
  Button, 
  Divider, 
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Paper,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import React, { useState, useEffect } from 'react';

export default function PurchaseForm({ onSubmit, isLoading, purchase }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([
    { product: '', quantity: 1, cost: 0, totalCost: 0, ivaRate: 0.16 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [debt, setDebt] = useState(0);

  const handleProductChange = (index, value) => {
    const updatedPurchaseItems = [...purchaseItems];
        const selectedProduct = products.find((product) => product._id === value);
    updatedPurchaseItems[index] = {
      ...updatedPurchaseItems[index],
            product: value, // armazena o _id do produto
      cost: selectedProduct ? selectedProduct.cost : 0,
      totalCost: (selectedProduct ? selectedProduct.cost : 0) * updatedPurchaseItems[index].quantity * (1 + updatedPurchaseItems[index].ivaRate),
    };
    setPurchaseItems(updatedPurchaseItems);
  };

  const handleAddProduct = () => {
    const newProduct = { product: '', quantity: 1, cost: 0, ivaRate: 0.16 , totalCost: 0, };
    setPurchaseItems([...purchaseItems, newProduct]);
  };

  const handleRemoveProduct = (index) => {
    if (purchaseItems.length > 1) {
      const updatedPurchaseItems = purchaseItems.filter((_, i) => i !== index);
      setPurchaseItems(updatedPurchaseItems);
    }
  };

  const handleIvaRateChange = (index, value) => {
    const updatedPurchaseItems = [...purchaseItems];
    updatedPurchaseItems[index] = {
      ...updatedPurchaseItems[index],
      ivaRate: value,
      totalCost: (updatedPurchaseItems[index].cost || 0) * updatedPurchaseItems[index].quantity * (1 + value),
    };
    setPurchaseItems(updatedPurchaseItems);
  };

  const handleQuantityChange = (index, value) => {
    const updatedPurchaseItems = [...purchaseItems];
    updatedPurchaseItems[index] = {
      ...updatedPurchaseItems[index],
      quantity: parseFloat(value) || 1,
      totalCost: (updatedPurchaseItems[index].cost || 0) * (parseFloat(value) || 1) * (1 + updatedPurchaseItems[index].ivaRate),
    };

    setPurchaseItems(updatedPurchaseItems);
  };

  const calculateSubtotal = () => {
    return purchaseItems.reduce((acc, purchaseItem) => acc + purchaseItem.totalCost, 0);
  };
  const calculateTotalIva = () => {
    const totalIva = purchaseItems.reduce((acc, purchaseItem) => acc + (purchaseItem.totalCost * purchaseItem.ivaRate), 0);
    return totalIva;
  };
  const calculateTotalBeforeDiscount = () => {
    const subtotal = calculateSubtotal();
    const totaIva = calculateTotalIva();
    const totalBeforeDiscount  = subtotal + totaIva;
    return totalBeforeDiscount;
  };
 
  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const totalAfterDiscount = totalBeforeDiscount - discount;
    return totalAfterDiscount.toFixed(2);
  };

  
  const calculateChange = () => {
    const total = calculateTotalAfterDiscount();
    return (receivedAmount - total).toFixed(2);
  };

  const calculateDebt = () => {
    const subtotal = calculateTotalAfterDiscount();
    const debt = (subtotal - amountPaid).toFixed(2);
    console.log('Dívida calculada:', debt); // Adicione este log para verificar o valor da dívida calculada
    return debt;
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoadingSuppliers(true);
        const response = await fetch("/api/suppliers");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();
        setSuppliers(data.suppliers);
        if (!selectedSupplier && data.suppliers.length > 0) {
          setSelectedSupplier(data.suppliers[0]);
        }
        setIsLoadingSuppliers(false);
      } catch (error) {
        alert(`Ocorreu um erro ao buscar Fornecedores: ${error.message}`);
        setIsLoadingSuppliers(false);
        console.error(error);
      }
    };
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // Handler de submit: envia direto para a API
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    if (!selectedSupplier || !selectedSupplier.supplierName) {
      alert('Selecione um fornecedor válido.');
      setFormLoading(false);
      return;
    }
    if (purchaseItems.length === 0 || purchaseItems.some(item => !item.product)) {
      alert('Adicione pelo menos um produto válido.');
      setFormLoading(false);
      return;
    }
    const payload = {
      supplierName: selectedSupplier.supplierName,
      description: e.target.description.value,
      discount: discount,
      subtotal: calculateSubtotal(),
      amountPaid: amountPaid,
      totalAfterDiscount: parseFloat(calculateTotalAfterDiscount()),
      totalIva: calculateTotalIva(),
      debt: parseFloat(calculateDebt()),
      products: purchaseItems.map(item => ({
        product: item.product,
        cost: item.cost,
        quantity: item.quantity,
        ivaRate: item.ivaRate,
        totalCost: item.totalCost
      }))
    };
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        setFormError(errorData.message || 'Erro ao registrar compra.');
        setFormLoading(false);
        return;
      }
      setFormLoading(false);
      alert('Compra registrada com sucesso!');
      if (onSubmit) onSubmit();
    } catch (err) {
      setFormError('Erro ao registrar compra.');
      setFormLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        {/* Supplier Selection Section */}
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Informações do Fornecedor" 
            avatar={<Store color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="supplierLabel">Selecionar Fornecedor</InputLabel>
                  <Select
                    labelId="supplierLabel"
                    label="Selecionar Fornecedor"
                    name="supplierName"
                    id="supplierName"
                    required
                    fullWidth
                    value={selectedSupplier ? selectedSupplier._id : ''}
                    onChange={(e) =>
                      setSelectedSupplier(suppliers.find((s) => s._id === e.target.value))
                    }
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier._id} value={supplier._id}>
                        {supplier.supplierName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Products Section */}
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Produtos da Compra" 
            avatar={<ShoppingCart color="primary" />}
            action={
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleAddProduct}
                size="small"
              >
                Adicionar Produto
              </Button>
            }
            sx={{ pb: 1 }}
          />
          <CardContent>
            {purchaseItems.map((purchaseItem, index) => (
              <Paper 
                key={index} 
                elevation={1} 
                sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={`Produto ${index + 1}`} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                  {purchaseItems.length > 1 && (
                    <IconButton 
                      onClick={() => handleRemoveProduct(index)} 
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id={`productLabel${index}`}>Produto</InputLabel>
                      <Select
                        name={`product${index}`}
                        id={`product${index}`}
                        label="Produto"
                        required
                        value={purchaseItem.product || ''}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                      >
                        {products.map((product) => (
                          <MenuItem key={product._id} value={product._id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12} md={3}>
                    <FormControl fullWidth>
                      <TextField
                        label="Custo Unitário"
                        type="number"
                        name={`cost${index}`}
                        id={`cost${index}`}
                        required
                        value={
                          products.find((product) => product._id === purchaseItem.product)?.cost || ''
                        }
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12} md={3}>
                    <FormControl fullWidth>
                      <TextField
                        label="Quantidade"
                        type="number"
                        name={`quantity${index}`}
                        id={`quantity${index}`}
                        required
                        value={purchaseItem.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id={`IVALabel${index}`}>Taxa de IVA</InputLabel>
                      <Select
                        label="Taxa de IVA"
                        name={`ivaRate${index}`}
                        id={`ivaRate${index}`}
                        value={purchaseItem.ivaRate}
                        onChange={(e) => handleIvaRateChange(index, parseFloat(e.target.value))}
                      >
                        <MenuItem value={0.16}>16% - Taxa Normal</MenuItem>
                        <MenuItem value={0}>0% - Sem IVA</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        label="Total do Item"
                        type="number"
                        name={`totalCost${index}`}
                        id={`totalCost${index}`}
                        required
                        value={purchaseItem.totalCost.toFixed(2)}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        sx={{ 
                          '& .MuiInputBase-input': { 
                            fontWeight: 'bold',
                            color: 'primary.main' 
                          } 
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Resumo da Compra" 
            avatar={<Receipt color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Cálculos
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {calculateSubtotal().toFixed(2)} MT
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">IVA Total:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {calculateTotalIva().toFixed(2)} MT
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="primary">
                      Total Final:
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {calculateTotalAfterDiscount()} MT
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Desconto"
                    type="number"
                    name="discount"
                    id="discount"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0 }}
                    helperText="Valor do desconto em meticais"
                  />
                </FormControl>
                
                <FormControl fullWidth>
                  <TextField
                    label="Descrição da Compra"
                    name="description"
                    id="description"
                    required
                    defaultValue={purchase?.description}
                    multiline
                    rows={3}
                    placeholder="Descreva os detalhes da compra..."
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Informações de Pagamento" 
            avatar={<Payment color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Valor Pago"
                    type="number"
                    name="amountPaid"
                    id="amountPaid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0 }}
                    helperText="Quanto foi pago ao fornecedor"
                  />
                </FormControl>
              </Grid>
              
              <Grid xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Dívida com o Fornecedor"
                    type="number"
                    value={calculateDebt()}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={{ 
                      '& .MuiInputBase-input': { 
                        fontWeight: 'bold',
                        color: parseFloat(calculateDebt()) > 0 ? 'error.main' : 'success.main'
                      } 
                    }}
                    helperText={
                      parseFloat(calculateDebt()) > 0 
                        ? "Valor em dívida" 
                        : parseFloat(calculateDebt()) < 0 
                          ? "Valor em excesso" 
                          : "Pagamento completo"
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12}>
                {formError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                  </Alert>
                )}
                
                <Button
                  disabled={formLoading}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                  {formLoading ? 'Processando Compra...' : (purchase ? "Salvar Alterações" : "Efetuar Compra")}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}