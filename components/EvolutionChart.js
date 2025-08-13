import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie } from 'recharts';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function EvolutionChart(props) {
  // Detecta se é fornecedores pelos indicadores passados
  const isFornecedores =
    props.selectedIndicators?.totalFornecedores !== undefined ||
    props.selectedIndicators?.categorias !== undefined ||
    props.selectedIndicators?.fornecedorMaisAntigo !== undefined ||
    props.selectedIndicators?.fornecedorMaisRecente !== undefined ||
    props.selectedIndicators?.nomeMaisLongo !== undefined;

  // Mapeamento de legendas para fornecedores
  const fornecedoresLegendas = {
    total: 'Total de Fornecedores',
    totalFornecedores: 'Total de Fornecedores',
    categorias: 'Categorias de Fornecedores',
    fornecedorMaisAntigo: 'Fornecedor Mais Antigo',
    fornecedorMaisRecente: 'Fornecedor Mais Recente',
    nomeMaisLongo: 'Nome Mais Longo',
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 tracking-tight">
        {isFornecedores ? 'Evolução dos Indicadores dos Fornecedores' : 'Evolução dos Indicadores de Compras'}
      </h2>
      <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-xl p-8 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <ToggleButtonGroup
              value={props.chartType}
              exclusive
              onChange={(_, newType) => newType && props.setChartType(newType)}
              size="medium"
              color="primary"
              aria-label="Tipo de Gráfico"
              className="bg-white rounded-lg shadow border border-blue-100"
            >
              <ToggleButton value="line">Linha</ToggleButton>
              <ToggleButton value="bar">Barra</ToggleButton>
              <ToggleButton value="pie">Pizza</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height={340}>
            {props.chartType === 'line' && (
              <LineChart data={props.getEvolutionData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={value => Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                <Legend />
                {isFornecedores
                  ? Object.keys(props.selectedIndicators).filter(k => props.selectedIndicators[k]).map((key, idx) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={fornecedoresLegendas[key] || key}
                        stroke={["#2563eb", "#059669", "#eab308", "#db2777", "#06b6d4"][idx % 5]}
                        strokeWidth={2}
                      />
                    ))
                  : <>
                      {props.selectedIndicators.total && <Line type="monotone" dataKey="total" name="Volume de Compras" stroke="#2563eb" strokeWidth={2} />}
                      {props.selectedIndicators.ticket && <Line type="monotone" dataKey="ticket" name="Ticket Médio de Compras" stroke="#059669" strokeWidth={2} />}
                      {props.selectedIndicators.desconto && <Line type="monotone" dataKey="desconto" name="Descontos" stroke="#eab308" strokeWidth={2} />}
                      {props.selectedIndicators.compras && <Line type="monotone" dataKey="compras" name="Nº de Compras" stroke="#db2777" strokeWidth={2} />}
                      {props.selectedIndicators.fornecedoresUnicos && <Line type="monotone" dataKey="fornecedoresUnicos" name="Fornecedores Únicos" stroke="#06b6d4" strokeWidth={2} />}
                      {props.selectedIndicators.produtosDiferentes && <Line type="monotone" dataKey="produtosDiferentes" name="Produtos Diferentes Comprados" stroke="#84cc16" strokeWidth={2} />}
                      {props.selectedIndicators.maiorCompra && <Line type="monotone" dataKey="maiorCompra" name="Maior Compra" stroke="#ef4444" strokeWidth={2} />}
                      {props.selectedIndicators.menorCompra && <Line type="monotone" dataKey="menorCompra" name="Menor Compra" stroke="#a3a3a3" strokeWidth={2} />}
                      {props.selectedIndicators.unidadesMaisCompradas && <Line type="monotone" dataKey="unidadesMaisCompradas" name="Unidades Mais Compradas" stroke="#f59e42" strokeWidth={2} />}
                      {props.selectedIndicators.unidadesMenosCompradas && <Line type="monotone" dataKey="unidadesMenosCompradas" name="Unidades Menos Compradas" stroke="#fbbf24" strokeWidth={2} />}
                    </>}
              </LineChart>
            )}
            {props.chartType === 'bar' && (
              <BarChart data={props.getEvolutionData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={value => Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                <Legend />
                {isFornecedores
                  ? Object.keys(props.selectedIndicators).filter(k => props.selectedIndicators[k]).map((key, idx) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={fornecedoresLegendas[key] || key}
                        fill={["#2563eb", "#059669", "#eab308", "#db2777", "#06b6d4"][idx % 5]}
                      />
                    ))
                  : <>
                      {props.selectedIndicators.total && <Bar dataKey="total" name="Volume de Vendas" fill="#2563eb" />}
                      {props.selectedIndicators.ticket && <Bar dataKey="ticket" name="Ticket Médio" fill="#059669" />}
                      {props.selectedIndicators.desconto && <Bar dataKey="desconto" name="Descontos" fill="#eab308" />}
                      {props.selectedIndicators.vendas && <Bar dataKey="vendas" name="Nº de Vendas" fill="#db2777" />}
                      {props.selectedIndicators.clientesUnicos && <Bar dataKey="clientesUnicos" name="Clientes Únicos" fill="#06b6d4" />}
                      {props.selectedIndicators.produtosDiferentes && <Bar dataKey="produtosDiferentes" name="Produtos Diferentes" fill="#84cc16" />}
                      {props.selectedIndicators.maiorVenda && <Bar dataKey="maiorVenda" name="Maior Venda" fill="#ef4444" />}
                      {props.selectedIndicators.menorVenda && <Bar dataKey="menorVenda" name="Menor Venda" fill="#a3a3a3" />}
                      {props.selectedIndicators.unidadesMaisVendidas && <Bar dataKey="unidadesMaisVendidas" name="Unidades do Produto Mais Vendido" fill="#f59e42" />}
                      {props.selectedIndicators.unidadesMenosVendidas && <Bar dataKey="unidadesMenosVendidas" name="Unidades do Produto Menos Vendido" fill="#fbbf24" />}
                    </>}
              </BarChart>
            )}
            {props.chartType === 'pie' && (
              <PieChart>
                {isFornecedores
                  ? Object.keys(props.selectedIndicators).filter(k => props.selectedIndicators[k]).map((key, idx) => (
                      <Pie
                        key={key}
                        data={props.getEvolutionData()}
                        dataKey={key}
                        nameKey="period"
                        cx="50%"
                        cy="50%"
                        outerRadius={80 - idx * 10}
                        fill={["#2563eb", "#059669", "#eab308", "#db2777", "#06b6d4"][idx % 5]}
                        label
                      />
                    ))
                  : Object.keys(props.selectedIndicators).filter(k => props.selectedIndicators[k]).map((key, idx) => (
                      <Pie
                        key={key}
                        data={props.getEvolutionData()}
                        dataKey={key}
                        nameKey="period"
                        cx="50%"
                        cy="50%"
                        outerRadius={80 - idx * 10}
                        fill={["#2563eb", "#059669", "#eab308", "#db2777", "#06b6d4", "#84cc16", "#ef4444", "#a3a3a3", "#f59e42", "#fbbf24"][idx % 10]}
                        label
                      />
                    ))}
                <Tooltip formatter={value => Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
