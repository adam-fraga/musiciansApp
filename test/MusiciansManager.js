//artifact permet de récuperer le contrat et de l'utiliser
const MusiciansManager = artifacts.require("./MusiciansManager");

//Importe le contrat et les account eth
contract("./MusiciansManager", accounts => {

  //Premier test ajout de musicien (2eme param ft async)
  it('should add à musician', async () => {
    //Récupère le contrat 
    const Contract = await MusiciansManager.deployed();
    //resultat de la fonction qui ajoute un musicien (from account est le propriétaire du contrat)
    const result = await Contract.addMusician('0x537419c84de2dc9092440d374dc74b7f7d65b2f2',
      'Adam', { from: accounts[0] });
    assert.equal(result.logs[0].args._name, "Adam", "Not equal to Adam");
  })

  //N'ajoute pas de musicien si exist
  it('should not add à musician if exist', async () => {
    const Contract = await MusiciansManager.deployed();
    let err = null;
    //Essaie d'ajouer un autre musicien sur une addresse existante pour un autre
    try {
      await Contract.addMusician('0x537419c84de2dc9092440d374dc74b7f7d65b2f2',
        'Adam2', { from: accounts[0] });
    }
    catch (error) {
      err = error;
    }
    // Si err est une instance d'une erreur alors Try catch à généré une erreur
    assert.ok(err instanceof Error);
  })

  it('should add a track', async () => {
    const Contract = await MusiciansManager.deployed();
    const result = await Contract.addTrack('0x537419c84de2dc9092440d374dc74b7f7d65b2f2',
      'codeIsLove', 346, { from: accounts[0] });
    assert.equal(result.logs[0].args._title, 'codeIsLove', "Not equals to codeIsLove");
  })

  it('should not add a track to an unknow artist', async () => {
    let err = null;
    try {
      //Passe une addresse ne correspodant pas à un artiste
      await Contract.addTrack('0x24abae56e491dc290e43282cc2076cc6faa1e41d', 'blockChainIsAwesome', 346, { from: accounts[0] });
    }
    catch (error) {
      err = error;
    }
    assert.ok(err instanceof Error);
  })

  it('should get the track from an artist', async () => {
    const Contract = await MusiciansManager.deployed();
    // Le parametre account est ici facultatif car pas de modifier onlyOwner
    const result = await Contract.getMusicianTracks('0x537419c84de2dc9092440d374dc74b7f7d65b2f2',
      { from: accounts[0] })
    // On utilise Array.isArray car l'event envoi un tableau
    assert.ok(Array.isArray(result.logs[0].args._track))
  })
})
