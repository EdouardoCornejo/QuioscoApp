import { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { Categorias, Categoria } from '../utils/types'
interface providerProps {
    children?: JSX.Element
    categorias?: Categorias[]
}

const QuioscoContext = createContext<Categoria[]>([])

const QuioscoProvider = ({ children }: providerProps) => {
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const obtenerCategorias = async () => {
        const { data } = await axios('/api/categorias')
        setCategorias(data)
    }

    useEffect(() => {
        obtenerCategorias()
    }, [])

    return (
        <QuioscoContext.Provider
            value={ 
                categorias
            }
        >
            {children}

        </QuioscoContext.Provider>
    )
}

export {
    QuioscoProvider
}

export default QuioscoContext
