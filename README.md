# ft_trascendence
42 project pong site

Backend:
auth: fatto, potenzialmente migliorabile in alcuni aspetti(oauth funziona, ma da vedere la gestione dei dati intra come immagine profilo ecc)
user profile: WIP
chat:Mich metti qua i tuoi update
game:TODO


nuove routes: 

    per ottenere dati:

    LISTA_TUTTI_GLI_UTENTI: /user           tipo: GET
    UTENTE_DA_ID_GENERIC: /user/id/'id_utente_da_cercare'   tipo: GET

    per aggiornare:

    USERNAME: /user/update_username     tipo: POST   richiede: @body con {newUsername: 'il_nuovo_username'}
    EMAIL: /user/update_email           tipo: POST     richiede: @body con {newEmail: 'la_nuova_mail'}
    IMAGE: /user/update_image           tipo: POST    richiede: @body con {newImage: 'il_nuovo_path_alla_pic'}

    tutte le routes tranne signin e signup richiedono sempre BEARER + accesToken come authorization.
    il refreshToken viene richiesto nella refresh route.(poi ci lavoriamo assieme quando la implementiamo lato frontend).

Frontend:
Gioco finito, da implementare multiplayer(Socket.io o Nest, non so)
