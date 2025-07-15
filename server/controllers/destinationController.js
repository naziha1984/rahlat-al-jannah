const Destination = require('../models/Destination');

// @desc    Obtenir toutes les destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      pays, 
      categorie, 
      prixMin, 
      prixMax, 
      disponibilite,
      langue = 'fr',
      tri = 'popularite'
    } = req.query;

    // Construire la requête de recherche
    const query = { actif: true };
    
    if (pays) query.pays = new RegExp(pays, 'i');
    if (categorie) query.categorie = categorie;
    if (disponibilite !== undefined) query.disponibilite = disponibilite === 'true';
    if (prixMin || prixMax) {
      query.prix = {};
      if (prixMin) query.prix.$gte = parseFloat(prixMin);
      if (prixMax) query.prix.$lte = parseFloat(prixMax);
    }

    // Options de tri
    let sortOptions = {};
    switch (tri) {
      case 'prix_asc':
        sortOptions = { prix: 1 };
        break;
      case 'prix_desc':
        sortOptions = { prix: -1 };
        break;
      case 'note':
        sortOptions = { note: -1 };
        break;
      case 'date':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { popularite: -1, note: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const destinations = await Destination.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total pour la pagination
    const total = await Destination.countDocuments(query);

    // Formater les destinations avec la langue spécifiée
    const destinationsFormatees = destinations.map(dest => ({
      _id: dest._id,
      nom: dest.getNom(langue),
      description: dest.getDescription(langue),
      prix: dest.prix,
      devise: dest.devise,
      prixFormate: dest.getPrixFormate(),
      imageUrl: dest.imageUrl,
      images: dest.images,
      disponibilite: dest.disponibilite,
      duree: dest.duree,
      difficulte: dest.difficulte,
      categorie: dest.categorie,
      pays: dest.pays,
      ville: dest.ville,
      coordonnees: dest.coordonnees,
      caracteristiques: dest.caracteristiques,
      note: dest.note,
      nombreAvis: dest.nombreAvis,
      popularite: dest.popularite,
      createdAt: dest.createdAt
    }));

    res.json({
      success: true,
      count: destinationsFormatees.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      destinations: destinationsFormatees
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des destinations:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir une destination par ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { langue = 'fr' } = req.query;

    const destination = await Destination.findOne({ _id: id, actif: true });

    if (!destination) {
      return res.status(404).json({
        error: 'Destination non trouvée'
      });
    }

    // Augmenter la popularité
    destination.popularite += 1;
    await destination.save();

    const destinationFormatee = {
      _id: destination._id,
      nom: destination.getNom(langue),
      description: destination.getDescription(langue),
      prix: destination.prix,
      devise: destination.devise,
      prixFormate: destination.getPrixFormate(),
      imageUrl: destination.imageUrl,
      images: destination.images,
      disponibilite: destination.disponibilite,
      duree: destination.duree,
      difficulte: destination.difficulte,
      categorie: destination.categorie,
      pays: destination.pays,
      ville: destination.ville,
      coordonnees: destination.coordonnees,
      caracteristiques: destination.caracteristiques,
      note: destination.note,
      nombreAvis: destination.nombreAvis,
      popularite: destination.popularite,
      createdAt: destination.createdAt,
      // Inclure toutes les langues pour l'édition
      nomComplet: destination.nom,
      descriptionComplete: destination.description
    };

    res.json({
      success: true,
      destination: destinationFormatee
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la destination:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Rechercher des destinations
// @route   GET /api/destinations/search
// @access  Public
const searchDestinations = async (req, res) => {
  try {
    const { q, langue = 'fr' } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Terme de recherche requis'
      });
    }

    // Recherche textuelle dans les noms et descriptions
    const destinations = await Destination.find({
      $and: [
        { actif: true },
        {
          $or: [
            { 'nom.fr': { $regex: q, $options: 'i' } },
            { 'nom.en': { $regex: q, $options: 'i' } },
            { 'nom.ar': { $regex: q, $options: 'i' } },
            { 'description.fr': { $regex: q, $options: 'i' } },
            { 'description.en': { $regex: q, $options: 'i' } },
            { 'description.ar': { $regex: q, $options: 'i' } },
            { pays: { $regex: q, $options: 'i' } },
            { ville: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).sort({ popularite: -1, note: -1 });

    const destinationsFormatees = destinations.map(dest => ({
      _id: dest._id,
      nom: dest.getNom(langue),
      description: dest.getDescription(langue),
      prix: dest.prix,
      devise: dest.devise,
      prixFormate: dest.getPrixFormate(),
      imageUrl: dest.imageUrl,
      disponibilite: dest.disponibilite,
      duree: dest.duree,
      categorie: dest.categorie,
      pays: dest.pays,
      ville: dest.ville,
      note: dest.note,
      nombreAvis: dest.nombreAvis
    }));

    res.json({
      success: true,
      count: destinationsFormatees.length,
      destinations: destinationsFormatees
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les destinations populaires
// @route   GET /api/destinations/popular
// @access  Public
const getPopularDestinations = async (req, res) => {
  try {
    const { langue = 'fr', limit = 6 } = req.query;

    const destinations = await Destination.find({ actif: true, disponibilite: true })
      .sort({ popularite: -1, note: -1 })
      .limit(parseInt(limit));

    const destinationsFormatees = destinations.map(dest => ({
      _id: dest._id,
      nom: dest.getNom(langue),
      description: dest.getDescription(langue),
      prix: dest.prix,
      devise: dest.devise,
      prixFormate: dest.getPrixFormate(),
      imageUrl: dest.imageUrl,
      duree: dest.duree,
      categorie: dest.categorie,
      pays: dest.pays,
      ville: dest.ville,
      note: dest.note,
      nombreAvis: dest.nombreAvis
    }));

    res.json({
      success: true,
      destinations: destinationsFormatees
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des destinations populaires:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les catégories disponibles
// @route   GET /api/destinations/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Destination.distinct('categorie', { actif: true });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les pays disponibles
// @route   GET /api/destinations/countries
// @access  Public
const getCountries = async (req, res) => {
  try {
    const pays = await Destination.distinct('pays', { actif: true });
    
    res.json({
      success: true,
      pays: pays.sort()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pays:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  searchDestinations,
  getPopularDestinations,
  getCategories,
  getCountries
}; 