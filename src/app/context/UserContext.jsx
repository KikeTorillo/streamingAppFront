import { useState, useEffect, createContext } from 'react'
import { getUsersService, deleteUsersService } from '../../services/Users/usersService'; 

const UserContext = createContext();
const mode = import.meta.env.VITE_MODE;
let urlBackend = '';
if (mode !== 'local') {
    urlBackend = import.meta.env.VITE_HOST_VERCEL;
} else {
    urlBackend = import.meta.env.VITE_HOST_LOCAL;
}

function UserProvider({ children }) {

const title = 'Usuarios'
const description = 'Gestiona usuarios y permisos';
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [view, setView] = useState(false);
const buttonText = view ? '< volver' : 'Agregar Usuario';

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];


const handleView = (user) => alert(`Ver detalle de ${user.name}`);
const handleEdit = (user) => alert(`Editar ${user.name}`);

const handleDelete = async (user) => {
        try {
            setLoading(true);
            
            // Hacer la petición a la API para actualizar el usuario
            const response = await deleteUsersService(user.id);
            
            if (response.message === 'session expired' && response.error) {
                navigate('/login');
                return;
            }
            
            setLoading(false);
            alert(`Usuario ${user.name} borrado correctamente`);
            
        } catch (error) {
            setLoading(false);
            setError(error);
            alert(`Error al actualizar usuario: ${error.message}`);
        }
    };

 useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getUsersService();
                if (response.message === 'session expired' && response.error) {
                    navigate('/login');
                    return;
                }
                setLoading(false);
                setError(null);
                setData(response);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        }
        fetchUsers();
    }, [loading]);

    return (
        <UserContext.Provider value={
            {
                urlBackend,
                data,
                handleView,
                handleEdit,
                handleDelete,
                columns,
                title,
                description,
                buttonText,
                view,
                setView
            }
        }>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider }



