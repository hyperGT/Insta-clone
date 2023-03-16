import { db } from './firebase.js';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';

function Post(props){

  const [comentarios, setComentarios] = useState([]) //se n tiver nenhum comentario, vai ficar vazio apenas, e nao nulo(me deu mt dor de cabeça)


  useEffect(()=>{
    db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp','asc').onSnapshot((snapshot)=>{
      setComentarios(snapshot.docs.map((document)=>{
        return{id:document.id, info:document.data()}
      }))
    })
  },[])

    function comentar(id, e){
        e.preventDefault()
        let comentarioAtual = document.querySelector('#comentario-'+id).value
        
        
        //pega a coleção chamada posts do database do firebase
        db.collection('posts').doc(id).collection('comentarios').add({
          nome: props.user,
          comentario: comentarioAtual,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        
        alert('Comentario feito')

        document.querySelector('#comentario-'+id).value = ""
      }

    return(

        <div className='postSingle'>
              <img src={props.info.Image}/>
              <p><b>{props.info.userName}</b>: {props.info.titulo}</p>
              

              <div className='coments'>
                {
                  comentarios.map((val)=>{ //map guarda tudo dentro de um array super fodas
                    return(
                      <div className='coment-single'>
                        <p><b>{val.info.nome}</b>: <b>{val.info.comentario}</b></p>
                      </div>
                    )
                  })
                }
              </div>
                
                {
                  (props.user)?
              <form onSubmit={(e)=>comentar(props.id,e)}>
                <textarea id={'comentario-'+props.id}></textarea>
                <input type='submit' value='Comentar'/>
              </form>
              :
              <div></div>
                }
                </div>
    )
}
/*<div className='comments'>
                {
                  comentarios.map((val)=>{
                    return(
                      <div>comentario</div>
                    )
                  })
                }
              </div>*/

export default Post;
