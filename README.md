# ft_trascendence
42 project pong site

Backend:
auth: fatto, potenzialmente migliorabile in alcuni aspetti(oauth funziona, ma da vedere la gestione dei dati intra come immagine profilo ecc)
user profile: WIP
chat:Mich metti qua i tuoi update
game:TODO


nuove routes:

    per ottenere dati:

    UTENTE_DA_ID_GENERIC: /user/id/'id_utente_da_cercare'   tipo: GET   richiede: no body required

    per aggiornare:
    
    USERNAME: /user/update_username     tipo: POST   richiede: @body con {newUsername: 'il_nuovo_username'}
    EMAIL: /user/update_email           tipo: POST     richiede: @body con {newEmail: 'la_nuova_mail'}
    IMAGE: /user/update_image           tipo: POST    richiede: @body con {newImage: 'il_nuovo_path_alla_pic'}

Frontend:
Gioco finito, da implementare multiplayer(Socket.io o Nest, non so)
