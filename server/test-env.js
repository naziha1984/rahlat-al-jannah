require('dotenv').config();

console.log('🔍 Test des variables d\'environnement:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Non défini');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Défini' : '❌ Non défini');

if (process.env.MONGODB_URI) {
  console.log('✅ Le fichier .env est correctement chargé!');
} else {
  console.log('❌ Le fichier .env n\'est pas chargé ou n\'existe pas');
  console.log('📁 Vérifiez que le fichier .env existe dans le dossier server/');
} 