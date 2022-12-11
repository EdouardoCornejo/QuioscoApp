import Image from "next/image"
import useQuiosco from "../hooks/useQuiosco"
import { Categorias, Categoria } from '../utils/types'

const Sidebar = () => {
    const categorias = useQuiosco()
    console.log(categorias)
    return (
        <>
            <Image
                width={300}
                height={100}
                src="/assets/img/logo.svg"
                alt="imagen logotipo"
            />

            <nav className="mt-10">
                {/* {categorias.map((categoria: Categoria) => console.log(categoria))} */}
            </nav>
        </>
    )
}

export default Sidebar