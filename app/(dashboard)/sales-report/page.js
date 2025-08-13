"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSession } from 'next-auth/react';

export default function ReportsPage() {
  const { data: session } = useSession();
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [minSaleValue, setMinSaleValue] = useState('');
  const [maxSaleValue, setMaxSaleValue] = useState('');

  useEffect(() => {
    // Montar a query string com os parâmetros dos filtros
    let queryString = `/api/sales?`;

    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (month) queryString += `month=${month}&`;
    if (year) queryString += `year=${year}&`;
    if (categoryFilter) queryString += `category=${categoryFilter}&`;
    if (userFilter) queryString += `user=${userFilter}&`;
    if (productFilter) queryString += `product=${productFilter}&`;
    if (minSaleValue) queryString += `minSaleValue=${minSaleValue}&`;
    if (maxSaleValue) queryString += `maxSaleValue=${maxSaleValue}&`;

    fetch(queryString)
      .then(response => response.json())
      .then(data => {
        // Filtrar os dados com base nos filtros selecionados
        const filteredData = data.sales.filter(sale => {
          // Lógica para aplicar os filtros
          return (
            (!startDate || new Date(sale.createdAt) >= new Date(startDate)) &&
            (!endDate || new Date(sale.createdAt) <= new Date(endDate)) &&
            (!month || new Date(sale.createdAt).getMonth() + 1 === parseInt(month)) &&
            (!year || new Date(sale.createdAt).getFullYear() === parseInt(year)) &&
            (!categoryFilter || sale.category === categoryFilter) &&
            (!userFilter || sale.user === userFilter) &&
            (!productFilter || sale.product === productFilter) &&
            (!minSaleValue || sale.subtotal >= minSaleValue) &&
            (!maxSaleValue || sale.subtotal <= maxSaleValue)
          );
        });

        // Definir os dados filtrados no estado
        setSalesData(filteredData);
      })
      .catch(error => console.error('Erro ao buscar os dados de vendas:', error));
  }, [startDate, endDate, month, year, categoryFilter, userFilter, productFilter, minSaleValue, maxSaleValue]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleUserChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handleProductChange = (event) => {
    setProductFilter(event.target.value);
  };

  const handleMinSaleValueChange = (event) => {
    setMinSaleValue(event.target.value);
  };

  const handleMaxSaleValueChange = (event) => {
    setMaxSaleValue(event.target.value);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="mt-8">Olá {session?.user.name}, bem-vindo à página de Relatórios!</p>

      {/* Filtros */}
      <div className="filters">
        <div className="filter">
          <label htmlFor="startDate">Data de Início:</label>
          <input type="date" id="startDate" onChange={handleStartDateChange} />
        </div>
        <div className="filter">
          <label htmlFor="endDate">Data de Término:</label>
          <input type="date" id="endDate" onChange={handleEndDateChange} />
        </div>
        <div className="filter">
          <label htmlFor="month">Mês:</label>
          <select id="month" onChange={handleMonthChange}>
            <option value="">Todos</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
        <div className="filter">
          <label htmlFor="year">Ano:</label>
          <input type="number" id="year" onChange={handleYearChange} />
        </div>
        <div className="filter">
          <label htmlFor="category">Categoria:</label>
          <input type="text" id="category" onChange={handleCategoryChange} />
        </div>
        <div className="filter">
          <label htmlFor="user">Usuário:</label>
          <input type="text" id="user" onChange={handleUserChange} />
        </div>
        <div className="filter">
          <label htmlFor="product">Produto:</label>
          <input type="text" id="product" onChange={handleProductChange} />
        </div>
        <div className="filter">
          <label htmlFor="minSaleValue">Valor Mínimo de Venda:</label>
          <input type="number" id="minSaleValue" onChange={handleMinSaleValueChange} />
        </div>
        <div className="filter">
          <label htmlFor="maxSaleValue">Valor Máximo de Venda:</label>
          <input type="number" id="maxSaleValue" onChange={handleMaxSaleValueChange} />
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ width: '90%', height: 400 }}>
        <ResponsiveContainer>
          {/* Gráfico de vendas totais ao longo do tempo */}
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="createdAt" 
              label={{ value: 'Data', position: 'insideBottom', offset: -10 }} 
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR')} 
            />
            <YAxis label={{ value: 'Vendas (MZN)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name, props) => [new Date(props.payload.createdAt).toLocaleDateString('pt-BR'), value]} 
            />
            <Legend />
            <Line type="monotone" dataKey="subtotal" name="Total de Vendas" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
