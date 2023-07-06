describe('Automacao Trello', () => {
    let token;
    let idBoard;
    const apiKey = '0110dfb52c71d218b652bca3f57184a7';
    const baseUrl = 'https://api.trello.com/1';


    before(() => {
        token = 'ATTAf0f8e87a91adc43170d7e5b64c888d44de7d38d91ad1ca3ba78debf3ec9c3551DE2CB70D';
    });

    it('Cadastrar um novo board', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/boards`,
            headers: {
                'Content-Type': 'application/json',
            },
            qs: {
                key: apiKey,
                token: token,
                name: 'Novo Board',
            },
        }).then((response) => {
            // }).then(resp => console.log(resp))   
            expect(response.status).to.eq(200)
            expect(response.body.name).to.be.equal("Novo Board")
            idBoard = response.body.id
            console.log(idBoard)
        });
    });


    it('Adicionando Cards', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/boards/${idBoard}`,
            qs: {
                key: apiKey,
                token: token,
                lists: 'all',
                fields: 'id,name',
            },
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.be.equal(idBoard)
            const boardName = response.body.name
            expect(boardName).to.be.equal(response.body.name)
            console.log(`ID do board: ${idBoard}`)
            console.log(`Nome do board: ${boardName}`)

            const lists = response.body.lists
            console.log(`lista: ${lists}`)
            console.log(response.body.lists)
            lists.forEach((list) => {
                const listId = list.id;
                const listName = list.name;
                expect(list.id).to.be.equal(listId)
                expect(list.name).to.be.equal(listName)
                console.log(`ID da lista: ${listId}`)
                console.log(`Nome da lista: ${listName}`)

                //Adicionando Cards na lista
                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/cards`,
                    qs: {
                        key: apiKey,
                        token: token,
                    },
                    body: {
                        name: 'Card Adicionado',
                        idList: list.id,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    const cardId = response.body.id;
                    const cardName = response.body.name;
                    console.log(`ID do card: ${cardId}`);
                    console.log(`Nome do card: ${cardName}`);
                });
            })
        })
    })

    it('Excluir todos os cards de um board', () => {
        // Obter a lista de cards do board
        cy.request({
            method: 'GET',
            url: `${baseUrl}/boards/${idBoard}/cards`,
            qs: {
                key: apiKey,
                token: token,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);

            const cards = response.body;
            cards.forEach((card) => {
                const cardId = card.id;
                console.log(`Excluindo card ${cardId}`);

                // Excluir o card
                cy.request({
                    method: 'DELETE',
                    url: `${baseUrl}/cards/${cardId}`,
                    qs: {
                        key: apiKey,
                        token: token,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    console.log(`Card ${cardId} excluído com sucesso`);
                })
            })
        })
    })

    //Excluir Board
    it('Excluir um board no Trello', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/boards/${idBoard}`,
            qs: {
                key: apiKey,
                token: token,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            console.log('Board excluído com sucesso');
        })
    })

})