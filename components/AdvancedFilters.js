import { FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

export default function AdvancedFilters(props) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Filtros Avançados</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="font-semibold">Período:</label>
          <FormControl size="small">
            <Select value={props.periodType} onChange={e => props.setPeriodType(e.target.value)}>
              <MenuItem value="year">Anual</MenuItem>
              <MenuItem value="quarter">Trimestral</MenuItem>
              <MenuItem value="month">Mensal</MenuItem>
              <MenuItem value="day">Diário</MenuItem>
            </Select>
          </FormControl>
          <label className="ml-4 font-semibold">De:</label>
          <input type="date" value={props.startDate} onChange={e => props.setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <label className="ml-2 font-semibold">Até:</label>
          <input type="date" value={props.endDate} onChange={e => props.setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <label className="font-semibold">Indicadores:</label>
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.total} onChange={() => props.handleIndicatorChange('total')} />} label="Volume de Compras" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.ticket} onChange={() => props.handleIndicatorChange('ticket')} />} label="Ticket Médio de Compras" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.desconto} onChange={() => props.handleIndicatorChange('desconto')} />} label="Total de Descontos" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.compras} onChange={() => props.handleIndicatorChange('compras')} />} label="Nº de Compras" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.fornecedoresUnicos} onChange={() => props.handleIndicatorChange('fornecedoresUnicos')} />} label="Fornecedores Únicos" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.produtosDiferentes} onChange={() => props.handleIndicatorChange('produtosDiferentes')} />} label="Produtos Diferentes Comprados" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.maiorCompra} onChange={() => props.handleIndicatorChange('maiorCompra')} />} label="Maior Compra" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.menorCompra} onChange={() => props.handleIndicatorChange('menorCompra')} />} label="Menor Compra" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.unidadesMaisCompradas} onChange={() => props.handleIndicatorChange('unidadesMaisCompradas')} />} label="Unidades Mais Compradas" />
          <FormControlLabel control={<Checkbox checked={props.selectedIndicators.unidadesMenosCompradas} onChange={() => props.handleIndicatorChange('unidadesMenosCompradas')} />} label="Unidades Menos Compradas" />
        </div>
      </div>
    </section>
  );
}
