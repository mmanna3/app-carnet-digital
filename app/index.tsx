import { Redirect } from 'expo-router'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export default function Index() {
  return <Redirect href={RUTAS.HOME} />
}
