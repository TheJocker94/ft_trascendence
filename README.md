# ft_trascendence
42 project pong site

Backend:
auth: fatto, potenzialmente migliorabile in alcuni aspetti(oauth funziona, ma da vedere la gestione dei dati intra come immagine profilo ecc)
user profile: WIP
chat:Mich metti qua i tuoi update
game:TODO

TODO    da aggiungere ma gia presente il service: getReceivedFriendRequest, getSentFriendRequest.

routes:
    per ottenere dati:

    LISTA_TUTTI_GLI_UTENTI: /user           tipo: GET
    UTENTE_DA_ID_GENERIC: /user/id/'id_utente_da_cercare'   tipo: GET

    per aggiornare:

    USERNAME: /user/update_username     tipo: POST   richiede: @body con {newUsername: 'il_nuovo_username'}
    EMAIL: /user/update_email           tipo: POST     richiede: @body con {newEmail: 'la_nuova_mail'}
    IMAGE: /user/update_image           tipo: POST    richiede: @body con {newImage: 'il_nuovo_path_alla_pic'}
    AGGIUNGI AMICO: /user/add_friend                        tipo: POST      richiede @body con {friendId: 'id dell'amico da aggiungere'}        TESTATA
    ACCETTA RICHIESTA AMICIZIA: /user/accept_friend_request tipo POST       richiede @body con {friendId: 'id dell'amico da aggiungere'}        TESTATA
    RIMUOVI AMICO/DECLINA RICHIESTA: /user/remove_friend    tipo DELETE     richiede @body con {friendId: 'id dell'amico da aggiungere'}        TESTATA
    OTTIENI LISTA AMICI: /user/friends                      tipo GET                                                                            NON TESTATA
    BLOCCA UTENTE: /user/block_user                         tipo POST       richiede @body con {blockedId: 'id dell'utente da bloccare'}        TESTATA
    RIMUOVI DA LISTA BLOCCATI: /user/block_remove           tipo POST       richiede @body con {userIdToUnblock: 'id dell'utente da sbloccare'} TESTATA
    OTTIENI LISTA BLOCCATI: /user/blocked_users             tipo GET                                                                            TESTATA POCO

NUOVE ROUTES:

    OTTIENI CLASSIFICA: /user/leaderboard           tipo GET

    tutte le routes tranne signin e signup richiedono sempre BEARER + accesToken come authorization.
    il refreshToken viene richiesto nella refresh route.(poi ci lavoriamo assieme quando la implementiamo lato frontend).


Frontend:
Gioco finito, da implementare multiplayer(Socket.io o Nest, non so)
