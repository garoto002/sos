import { Button, FormControl, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

export default function CustomForm({onSubmit, isLoading, custom}) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">{custom ? "Editar Cliente" : "Adicionar Cliente"}</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <TextField label="Nome" type="text" name="customName" id="workName" required defaultValue={custom?.customName} fullWidth />
            <TextField label="Morada" type="text" name="location" id="location" defaultValue={custom?.location} fullWidth />
            <TextField label="Contacto" type="number" name="phone" id="phone" defaultValue={custom?.phone} fullWidth />
            <TextField label="NUIT" type="number" name="nuit" id="nuit" defaultValue={custom?.nuit} fullWidth />
          </div>
          <Button disabled={isLoading} type="submit" fullWidth className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg">
            {custom ? "Salvar Alterações" : "Adicionar Cliente"}
          </Button>
        </form>
      </div>
    )
  }