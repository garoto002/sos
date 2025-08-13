import React, { useState, useEffect } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid, TextField, Chip, IconButton, InputAdornment, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person, Receipt, Add, Delete, Calculate } from '@mui/icons-material';
import SaleSummaryPanel from './SaleSummaryPanel';

const steps = ['Cliente', 'Produtos', 'Pagamento & Resumo'];

export default function SaleWizard({ onSubmit, isLoading, sale }) {
  // Estado global do wizard
  const [successModal, setSuccessModal] = useState(false);
  const [lastSaleData, setLastSaleData] = useState(null);
  const [generatedSaleId, setGeneratedSaleId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [saleItems, setSaleItems] = useState([
    { product: '', quantity: 1, price: 0, totalPrice: 0, ivaRate: 0.16 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [selectedCartIndex, setSelectedCartIndex] = useState(null);

  // Fetch clientes e produtos
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Verificar se há uma sessão ativa
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (!sessionData?.user) {
          console.error('Usuário não autenticado');
          return;
        }

        const response = await fetch("/api/customers", {
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include' // Importante para incluir cookies de autenticação
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Erro HTTP: ${response.status}`, errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta da API de clientes:', data); // Para debug

        if (data.customers && Array.isArray(data.customers)) {
          console.log(`${data.customers.length} clientes encontrados`);
          setCustomers(data.customers);
          if (!selectedCustomer && data.customers.length > 0) {
            setSelectedCustomer(data.customers[0]);
          }
        } else {
          console.error('Estrutura de dados inválida:', data);
        }
      } catch (e) {
        console.error('Erro detalhado ao buscar clientes:', e);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error('Erro ao buscar produtos:', e);
      }
    };
    fetchProducts();
  }, []);

  // Funções auxiliares
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addProductToCart = (product) => {
    if (!product) return;
    const index = saleItems.findIndex(it => it.product === product.name);
    if (index >= 0) {
      // Incrementa quantidade
      const currentQty = saleItems[index].quantity || 0;
      handleQuantityChange(index, currentQty + 1);
      setSelectedCartIndex(index);
    } else {
      const newIndex = saleItems.length;
      setSaleItems([
        ...saleItems,
        {
          product: product.name,
          quantity: 1,
          price: product.price || 0,
          ivaRate: 0.16,
          totalPrice: product.price || 0
        }
      ]);
      setSelectedCartIndex(newIndex);
    }
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
  const handleQuantityChange = (index, value) => {
    const updatedSaleItems = [...saleItems];
    updatedSaleItems[index] = {
      ...updatedSaleItems[index],
      quantity: parseFloat(value) || 1,
      totalPrice: (updatedSaleItems[index].price || 0) * (parseFloat(value) || 1) * (1 + updatedSaleItems[index].ivaRate),
    };
    setSaleItems(updatedSaleItems);
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
  const handleAddProduct = () => {
    setSaleItems([...saleItems, { product: '', quantity: 1, price: 0, totalPrice: 0, ivaRate: 0.16 }]);
  };
  const handleRemoveProduct = (index) => {
    if (saleItems.length > 1) {
      const updatedSaleItems = [...saleItems];
      updatedSaleItems.splice(index, 1);
      setSaleItems(updatedSaleItems);
    }
  };

  // Cálculos
  const calculateSubtotal = () => saleItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const calculateTotalIva = () => saleItems.reduce((acc, item) => acc + item.totalPrice * item.ivaRate, 0).toFixed(2);
  const calculateTotalAfterDiscount = () => (parseFloat(calculateSubtotal()) + parseFloat(calculateTotalIva()) - discount).toFixed(2);
  const calculateDebtOrChange = () => receivedAmount - parseFloat(calculateTotalAfterDiscount());

  // Subforms
  function ClienteStep() {
    return (
      <Box>
        <Typography variant="h6" mb={2}>Selecione o Cliente</Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Cliente</InputLabel>
          <Select
            label="Cliente"
            value={selectedCustomer?.customerName || ''}
            onChange={(e) => setSelectedCustomer(customers.find((c) => c.customerName === e.target.value))}
            displayEmpty
          >
            <MenuItem value="" disabled>Selecione um cliente</MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer._id} value={customer.customerName}>{customer.customerName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setActiveStep(1)} sx={{ mt: 3 }} disabled={!selectedCustomer}>Próximo</Button>
      </Box>
    );
  }

  function ProdutosStep() {
    return (
      <Box>
        <Typography variant="h6" mb={2}>Adicione Produtos</Typography>
        <Stack spacing={2}>
          {saleItems.map((saleItem, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Produto</InputLabel>
                    <Select
                      label="Produto"
                      value={saleItem?.product || ''}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      required
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product.name}>{product.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6} sm={2}>
                  <TextField
                    label="Qtd"
                    type="number"
                    size="small"
                    fullWidth
                    value={saleItem.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    inputProps={{ min: 1, step: 0.01 }}
                  />
                </Grid>
                <Grid xs={6} sm={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>IVA</InputLabel>
                    <Select
                      label="IVA"
                      value={saleItem.ivaRate}
                      onChange={(e) => handleIvaRateChange(index, parseFloat(e.target.value))}
                    >
                      <MenuItem value={0.16}>16%</MenuItem>
                      <MenuItem value={0}>0%</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6} sm={2}>
                  <TextField
                    label="Preço"
                    size="small"
                    fullWidth
                    value={products.find((product) => product.name === saleItem.product)?.price || ''}
                    InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">MT</InputAdornment> }}
                  />
                </Grid>
                <Grid xs={6} sm={2}>
                  <TextField
                    label="Total"
                    size="small"
                    fullWidth
                    value={saleItem.totalPrice.toFixed(2)}
                    InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">MT</InputAdornment> }}
                  />
                </Grid>
                <Grid xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {saleItems.length > 1 && (
                    <IconButton onClick={() => handleRemoveProduct(index)} color="error" size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
        <Button onClick={handleAddProduct} variant="outlined" startIcon={<Add />} fullWidth sx={{ mt: 2 }}>Adicionar Produto</Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" onClick={() => setActiveStep(0)}>Voltar</Button>
          <Button variant="contained" onClick={() => setActiveStep(2)} disabled={saleItems.some(item => !item.product)}>Próximo</Button>
        </Box>
      </Box>
    );
  }

  function PagamentoResumoStep() {
    const debtOrChange = calculateDebtOrChange();
    return (
      <Box>
        <Typography variant="h6" mb={2}>Pagamento & Resumo</Typography>
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <TextField
              label='Desconto'
              type='number'
              fullWidth
              size="small"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: <InputAdornment position="start">MT</InputAdornment> }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label='Valor Recebido'
              type='number'
              fullWidth
              size="small"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: <InputAdornment position="start">MT</InputAdornment> }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              label={debtOrChange < 0 ? 'Dívida' : debtOrChange > 0 ? 'Troco' : 'Pagamento Exato'}
              fullWidth
              size="small"
              value={Math.abs(debtOrChange).toFixed(2)}
              InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">MT</InputAdornment> }}
              color={debtOrChange < 0 ? 'error' : 'success'}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Observações"
              multiline
              rows={2}
              fullWidth
              size="small"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre esta venda..."
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={() => setActiveStep(1)}>Voltar</Button>
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Finalizar Venda'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Envio final
  async function handleSubmit(e) {
    if (e) e.preventDefault();

    // Validação do cliente
    const customName = selectedCustomer?.customerName || 'Cliente Padrao';

    // Validações
    if (!saleItems.some(item => item.product)) {
      alert('Adicione pelo menos um produto à venda.');
      return;
    }

    // Monta objeto de venda
    const saleData = {
      customName,  // Nome do campo conforme esperado pelo modelo
      discount,
      receivedAmount,
      description: observacoes,
      items: saleItems.filter(item => item.product).map(item => ({
        product: item.product,
        price: item.price,
        quantity: item.quantity,
        ivaRate: item.ivaRate,
        totalPrice: item.totalPrice
      }))
    };
    setLastSaleData(saleData);
    
    // Chama o onSubmit e captura o ID da venda gerada
    if (onSubmit) {
      try {
        const response = await onSubmit(saleData);
        
        // Tenta obter o ID da venda da resposta
        const saleId = 
          response?.sale?._id ||  // Formato { sale: { _id: ... } }
          response?._id ||        // Formato { _id: ... }
          response?.saleId ||     // Formato { saleId: ... }
          (response?.data?.sale?._id) || // Formato { data: { sale: { _id: ... } } }
          (typeof response === 'string' ? response : null); // Caso seja apenas o ID

        if (saleId) {
          setGeneratedSaleId(saleId);
          console.log('ID da venda capturado:', saleId);
          
          // Capturar dados da venda, incluindo o número da fatura
          const saleData = response?.sale || response;
          setLastSaleData(saleData);
          setInvoiceNumber(saleData?.invoiceNumber);
          
          setSuccessModal(true);
        } else {
          console.error('Estrutura da resposta:', response);
          throw new Error('ID da venda não encontrado na resposta');
        }
      } catch (error) {
        console.error('Erro ao processar venda:', error);
        // Você pode adicionar um toast ou notificação aqui para mostrar o erro ao usuário
      }
    } else {
      setSuccessModal(true);
    }
  }
  // Função para imprimir recibo
  function handlePrint() {
    if (generatedSaleId) {
      console.log('Tentando imprimir PDF para venda ID:', generatedSaleId);
      window.open(`/api/sales/${generatedSaleId}/pdf?autoprint=true`, '_blank');
    } else {
      console.error('ID da venda não encontrado para impressão');
      alert('Erro: ID da venda não encontrado. Tente novamente.');
    }
  }

  // Função para finalizar e imprimir
  function handleFinishAndPrint() {
    handlePrint();
    handleFinish();
  }

  // Função para criar nova venda
  function handleNewSale() {
    // Reset do wizard para nova venda
    setActiveStep(0);
    setSelectedCustomer(customers.length > 0 ? customers[0] : null);
    setSaleItems([{ product: '', quantity: 1, price: 0, totalPrice: 0, ivaRate: 0.16 }]);
    setDiscount(0);
    setReceivedAmount(0);
    setObservacoes('');
    setGeneratedSaleId(null);
    setLastSaleData(null);
    setSuccessModal(false);
  }

  // Função para ver vendas
  function handleViewSales() {
    window.location.href = '/sales';
  }

  // Função para apenas finalizar
  function handleFinish() {
    setSuccessModal(false);
    // Pode redirecionar ou resetar conforme necessário
  }

  // Atalhos de teclado
  useEffect(() => {
    const handler = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
      if (!isTyping) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          const idx = selectedCartIndex ?? saleItems.findIndex(it => it.product);
          if (idx >= 0) {
            const currentQty = saleItems[idx].quantity || 0;
            handleQuantityChange(idx, currentQty + 1);
          }
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          const idx = selectedCartIndex ?? saleItems.findIndex(it => it.product);
          if (idx >= 0) {
            const currentQty = saleItems[idx].quantity || 0;
            if (currentQty > 1) {
              handleQuantityChange(idx, currentQty - 1);
            }
          }
        } else if (e.key === 'F2') {
          e.preventDefault();
          handleSubmit();
        } else if (e.key === 'F3' && generatedSaleId) {
          e.preventDefault();
          handlePrint();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saleItems, selectedCartIndex, generatedSaleId]);

  return (
    <>
      <Box sx={{ maxWidth: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Cabeçalho com cliente e busca */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Cliente</InputLabel>
                <Select
                  label="Cliente"
                  value={selectedCustomer?.customerName || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setSelectedCustomer({ customerName: 'Cliente Avulso' });
                    } else {
                      const customer = customers.find((c) => c.customerName === value);
                      setSelectedCustomer(customer || { customerName: value });
                    }
                  }}
                >
                  <MenuItem value="">Cliente Avulso</MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer._id} value={customer.customerName}>{customer.customerName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                label="Buscar produtos"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Digite para buscar produtos..."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Conteúdo principal em 3 colunas */}
        <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
          {/* Coluna 1: Grid de produtos */}
          <Paper sx={{ flex: '0 0 35%', p: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            <Typography variant="h6" gutterBottom>Produtos</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 1 }}>
              {filteredProducts.map((product) => (
                <Button
                  key={product._id}
                  variant="outlined"
                  onClick={() => addProductToCart(product)}
                  sx={{ 
                    height: 'auto',
                    py: 1,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    textAlign: 'left',
                    gap: 0.5
                  }}
                >
                  <Typography noWrap>{product.name}</Typography>
                  <Typography variant="body2" color="primary.main">
                    {product.price?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Coluna 2: Carrinho */}
          <Paper sx={{ flex: '1 1 40%', p: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            <Typography variant="h6" gutterBottom>Carrinho</Typography>
            <Stack spacing={1}>
              {saleItems.map((item, index) => {
                if (!item.product) return null;
                return (
                  <Paper 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      p: 1,
                      cursor: 'pointer',
                      borderColor: selectedCartIndex === index ? 'primary.main' : 'divider',
                      borderWidth: selectedCartIndex === index ? 2 : 1
                    }}
                    onClick={() => setSelectedCartIndex(index)}
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography noWrap fontWeight={500}>{item.product}</Typography>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <TextField
                          size="small"
                          type="number"
                          label="Qtd"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          inputProps={{ min: 1, step: 1 }}
                        />
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>IVA</InputLabel>
                          <Select
                            label="IVA"
                            value={item.ivaRate}
                            onChange={(e) => handleIvaRateChange(index, parseFloat(e.target.value))}
                          >
                            <MenuItem value={0.16}>16%</MenuItem>
                            <MenuItem value={0}>0%</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="body2" color="text.secondary">Preço unit:</Typography>
                        <Typography>
                          {item.price?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={8} sm={2}>
                        <Typography variant="body2" color="text.secondary">Total:</Typography>
                        <Typography fontWeight={500}>
                          {item.totalPrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={1}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>
            {saleItems.every(item => !item.product) && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                Clique nos produtos para adicionar ao carrinho
              </Typography>
            )}
          </Paper>

          {/* Coluna 3: Pagamento e resumo */}
          <Paper sx={{ flex: '0 0 25%', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Pagamento</Typography>
              {lastSaleData && (
                <Chip
                  label={`Fatura Nº ${lastSaleData.invoiceNumber || invoiceNumber || '---'}`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            
            <TextField
              label="Desconto"
              type="number"
              size="small"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">MT</InputAdornment>
              }}
            />

            <TextField
              label="Valor Recebido"
              type="number"
              size="small"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">MT</InputAdornment>
              }}
            />

            <TextField
              label="Observações"
              multiline
              rows={2}
              size="small"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                bgcolor: 'background.default'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal</Typography>
                <Typography>{calculateSubtotal().toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>IVA</Typography>
                <Typography>{calculateTotalIva()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Desconto</Typography>
                <Typography>
                  {discount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'primary.main' }}>
                <Typography>Total a pagar</Typography>
                <Typography>{calculateTotalAfterDiscount()}</Typography>
              </Box>
              {receivedAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: calculateDebtOrChange() < 0 ? 'error.main' : 'success.main' }}>
                  <Typography>{calculateDebtOrChange() < 0 ? 'Falta' : 'Troco'}</Typography>
                  <Typography>{Math.abs(calculateDebtOrChange()).toFixed(2)}</Typography>
                </Box>
              )}
            </Paper>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
              disabled={isLoading || !saleItems.some(item => item.product)}
            >
              {isLoading ? 'Processando...' : 'Finalizar Venda (F2)'}
            </Button>

            {/* Legenda de atalhos */}
            <Paper 
              elevation={0} 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: 'background.default',
                borderRadius: 1,
                '& .shortcut': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.5
                }
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 1 }}>
                Atalhos do Teclado:
              </Typography>
              <Box className="shortcut">
                <Chip 
                  size="small" 
                  label="+" 
                  variant="outlined" 
                  sx={{ minWidth: 40 }}
                />
                <Typography variant="body2">Aumentar quantidade do item selecionado</Typography>
              </Box>
              <Box className="shortcut">
                <Chip 
                  size="small" 
                  label="-" 
                  variant="outlined" 
                  sx={{ minWidth: 40 }}
                />
                <Typography variant="body2">Diminuir quantidade do item selecionado</Typography>
              </Box>
              <Box className="shortcut">
                <Chip 
                  size="small" 
                  label="F2" 
                  variant="outlined" 
                  color="success" 
                  sx={{ minWidth: 40 }}
                />
                <Typography variant="body2">Finalizar venda</Typography>
              </Box>
              {generatedSaleId && (
                <Box className="shortcut">
                  <Chip 
                    size="small" 
                    label="F3" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ minWidth: 40 }}
                  />
                  <Typography variant="body2">Imprimir recibo</Typography>
                </Box>
              )}
            </Paper>
          </Paper>
        </Box>
      </Box>
      <Dialog open={successModal} onClose={handleFinish} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main', fontSize: '1.5rem' }}>
          ✅ Venda Finalizada com Sucesso!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
            Fatura Nº {lastSaleData?.invoiceNumber || invoiceNumber || '---'}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Cliente: {lastSaleData?.customName || 'Cliente Avulso'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Total: {lastSaleData ? (
              (lastSaleData.items?.reduce((acc, item) => acc + item.totalPrice, 0) - (lastSaleData.discount || 0))
                .toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })
            ) : ''}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            O que deseja fazer agora?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
          <Button 
            onClick={handleFinishAndPrint} 
            variant="contained" 
            color="primary" 
            fullWidth
            size="large"
            startIcon={<Receipt />}
          >
            🖨️ Finalizar e Imprimir Recibo
          </Button>
          <Button 
            onClick={handleNewSale} 
            variant="contained" 
            color="success" 
            fullWidth
            size="large"
            startIcon={<Add />}
          >
            🛒 Nova Venda
          </Button>
          <Button 
            onClick={handleViewSales} 
            variant="outlined" 
            color="info" 
            fullWidth
            size="large"
          >
            📋 Ver Todas as Vendas
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
