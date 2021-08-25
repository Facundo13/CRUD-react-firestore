import React from 'react';
import {firebase} from './firebase.js'

function App() {

  const [tareas,setTareas] = React.useState([]);
  const [tarea,setTarea] = React.useState('');
  const [modoEdicion,setModoEdicion] = React.useState(false);
  const [id,setId] = React.useState('');

  React.useEffect(()=>{
    const obtenerDatos = async() =>{
      try {
        const db = firebase.firestore()
        const data = await db.collection('tareas').get()
        const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setTareas(arrayData);
      } catch (e) {
        console.log(e);
      }
    }

    obtenerDatos();
  }, [])

  const agregar = async (e) => {
    e.preventDefault();

    if(!tarea.trim()){
      return;
    }

    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }

      const data = await db.collection('tareas').add(nuevaTarea);

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])
      setTarea('')

    } catch (e) {
      console.log(e);
    }

  }

  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('tareas').doc(id).delete();

      const arrayFiltrado = tareas.filter(item => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (e) {
      console.log(e);
    }
  }

  const activarEdicion = async (item) =>{
    setModoEdicion(true);
    setTarea(item.name)
    setId(item.id);
  }

  const editar = async(e) => {
    e.preventDefault();
    if(!tarea.trim()){
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection('tareas').doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea('')
      setId('');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            <h3 className="text-center">Tareas</h3>
            {
              tareas.map(item => (
                <li key={item.id}className="list-group-item d-flex justify-content-between">
                  {item.name}
                  <div>
                    <button className="btn btn-warning btn-sm mx-2" onClick={() => activarEdicion(item)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(item.id)}>Eliminar</button>
                  </div>

                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
            <h3 className="text-center">
              {
                modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
              }
            </h3>
            <form onSubmit={modoEdicion ? editar : agregar}>
              <input type="text" placeholder="Ingrese tarea" className="form-control mb-2" onChange={e => setTarea(e.target.value)} value={tarea}/>
              <button className=
                {
                modoEdicion ? 'btn btn-warning w-100' : 'btn btn-dark w-100'
                } 
              type="submit">
                {
                  modoEdicion ? 'Editar' : 'Agregar'
                }
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default App;
