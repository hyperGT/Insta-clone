import { upload } from '@testing-library/user-event/dist/upload.js';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { auth,storage,db } from './firebase.js';


function Header(props){

    const [progress, setProgress] = useState(0)

    const [file, setFile] = useState(null)
    
    useEffect(()=>{
        
    },[])


    function criarConta(e){
        e.preventDefault()

        let email = document.getElementById('email-cad').value
        let userName = document.getElementById('userNm-cad').value
        let password = document.getElementById('pass-cad').value

        //Criar conta firebase

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName:userName
            })
            alert('Conta criada com sucesso')

            //isso aqui dps pelo amor de deus, põe como uma variavel global
            let modal = document.querySelector('.modalCriarConta')

            modal.style.display = 'none'
            
        }).catch((error)=>{
            alert(error.message)
        })
    }

    function logar(e){
        e.preventDefault()
        let email = document.getElementById('email-login').value
        let password = document.getElementById('pass-login').value

        auth.signInWithEmailAndPassword(email,password)
      .then((auth)=>{
        props.setUser(auth.user.displayName);
        window.location.href = '/'
        alert('Logado com sucesso!');
      }).catch((err)=>{
        alert(err.message);
      })
    }

    function deslogar(e){
        e.preventDefault()
        auth.signOut().then((val)=>{
            props.setUser(null)
            window.location.href = '/'
        })

    }

    function abrirModalCriarConta(e){

        e.preventDefault()
        
        let modal = document.querySelector('.modalCriarConta')

        modal.style.display = 'block'

    }

    function abrirModalUpload(e){
        let modal = document.querySelector('.modalUpload')
        modal.style.display = 'block'
    }
    function fecharModalUpload(){
        let modal = document.querySelector('.modalUpload')
        modal.style.display = 'none'

    }

    

    function uploadPost(e){

        //previne que apos o processo a pagina recarregue
        e.preventDefault()
        //variavel que guardao titulo do arquivo
        let tituloPost = document.getElementById('titulo-upload').value
        //guarda progresso da transferencia do arquivo
        let progressEl = document.getElementById('progress-upload').value
        
        //pega uma referencia da imagem e guarda o arquivo dentro do upload task
        const uploadTask = storage.ref(`images/${file.name}`).put(file)

        //que aqui vai ter seu estado mudado por uma função que vai representar o tamanho do arquivo vulgo snapshot
        uploadTask.on("state_changed",function(snapshot){
            //matematica basica pra fazer a barra de progresso se movimentar (bytes transferidos dividido pelo total de bytes) vezes 100
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes)*100;
            //seta o progresso como progresso            
            setProgress(progress)
        },function(error){ //função de decoração pq minha aplicação n da erro
            alert(error.message)

        }, function(){ //função do termino caso dê tudo certo

            //pego minha referencia da imagem a qual se encontra dentro do armazenamento da nuvem, coleto o nome do arquivo, e por fim pega o url do dowload ja pra inseri-lo no banco de dados
            storage.ref("images").child(file.name).getDownloadURL() 
            .then(function(url){
                //acessa a coleção da database qu se chama post uau...adiciona o titulo, url, o nome de usuario, e a hora. pode ser acessado a qualquer momento
                db.collection('post').add({
                    titulo:tituloPost,
                    Image:url,
                    userName:props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() //timestamp pra caso queira ordenar os posts e organizar tudo
                })
                setProgress(0)
                setFile(null)
                alert('Upload realizado com sucesso!')
                document.getElementById('form-upload').reset()
                fecharModalUpload()
            })
        })
    }


    function fecharModalCriar(){
        let modal = document.querySelector('.modalCriarConta')

        modal.style.display = 'none'
    }

    

    return(


        <div className='header'>

            <div className='modalCriarConta'>
                <div className='formCriarConta'>
                    <div onClick={()=>fecharModalCriar()} className='close-Mod-Criar'>X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e)=>criarConta(e)}>
                    <input id='email-cad' type='text' placeholder='E-mail' />
                    <input id='userNm-cad' type='text' placeholder='Insira um Nome de usuário' />
                    <input id='pass-cad' type='password' placeholder='Crie uma senha' />
                    <input type='submit' value='Criar Conta'/>
                    </form>

                </div>
            </div>

            <div className='modalUpload'>
                <div className='formUpload'>
                    <div onClick={()=>fecharModalUpload()} className='close-Mod-Upload'>X</div>
                    <h2>Fazer Upload</h2>
                    <form id="form-upload" onSubmit={(e)=>uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                    <input id='titulo-upload' type='text' placeholder='Nome da foto...' />
                    <input onChange={(e)=>setFile(e.target.files[0])} type='file' name='file'/>
                    <input type='submit' value='Postar'/>
                    </form>

                </div>
            </div>




        <div className='center'>

          <div className='header_logo'>
          <a href=''><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'></img></a>
          </div>

        {
          (props.user)?
          <div className='header_logInfo'>
            <span>Olá, <b>{props.user}</b></span>
            <a onClick={(e)=>abrirModalUpload(e)} href='#'>Upload</a>
            <a onClick={(e)=>deslogar(e)}>Deslogar</a>
          </div>
          :
          <div className='header_loginForm'>

              <form onSubmit={(e)=>logar(e)}>
                <input id='email-login' type="text" placeholder='email' />
                <input id='pass-login' type='password' placeholder='senha' />
                <input type='submit' name='acao' value="login" />
              </form>

              <div className='btn_criarAcc'>
              <a onClick={(e)=>abrirModalCriarConta(e)} href='#'>Criar Conta</a>    
              </div>  
          </div>
        }   

        </div> 

      </div>


    )

}

export default Header;

