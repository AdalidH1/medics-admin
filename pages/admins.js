import Layout from "@/components/Layout";
import prettyDate from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function AdminsPage({swal}) {

    const [email, setEmail] = useState('')
    const [adminEmails, setAdminEmails] = useState([])


    function addAdmin(e){
        e.preventDefault()
        axios.post('/api/admins', {email}).then(res => {
            console.log(res.data)
            swal.fire({
                title: 'Administrador añadido',
                icon: 'success'
            })
            setEmail('')
            loadAdmins()
        }).catch(err => {
            swal.fire({
                title: '¡Error!',
                text: err.response.data.message,
                icon: 'error'
            })
        })
    }
    function loadAdmins(){
        axios.get('/api/admins').then(res => {
            setAdminEmails(res.data)
        })
    }
    useEffect(() => {
        loadAdmins()
    }, [])

    function deleteAdmin(_id, email) {
        swal.fire({
            title: '¿Estás seguro de querer borrar este administrador?',
            text: `${email}`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar',
            confirmButtonColor: '#d55',
            reverseButtons: true
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id='+_id).then(() => {
                    swal.fire({
                        title: 'Administrador eliminado',
                        icon: 'success'
                    })
                    loadAdmins()
                }) 
            }
        })
        
    }

    return (
        <Layout>
            <h1>Administradores</h1>
            <h2>Añadir nuevo administrador</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input type="text" className="mb-0" placeholder="Email de administrador" value={email} onChange={e => setEmail(e.target.value)}></input>
                    <button type="submit" className="btn-primary py-1 whitespace-nowrap">Añadir</button>
                </div>
            </form>

            <h2>Administradores existentes</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Email de administrador</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                        <tr key={adminEmail._id}>
                            <td>{adminEmail.email}</td>
                            <td>
                                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                            </td>
                            <td>
                                <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="delete">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <AdminsPage swal={swal} />
))