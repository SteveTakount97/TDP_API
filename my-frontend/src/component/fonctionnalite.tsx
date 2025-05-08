import { motion } from 'framer-motion';

const features = [
  { title: 'Gestion des membres', description: 'Ajoutez, supprimez, ou modifiez les membres de votre tontine.' },
  { title: 'Paiements sécurisés', description: 'Suivez les contributions et versements facilement.' },
  { title: 'Cycles personnalisables', description: 'Définissez la durée et le mode de tirage.' },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-black cursor-pointer">Fonctionnalités Clés</h2>
        <div className="grid md:grid-cols-3 gap-8 cursor-pointer">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              animate={{ x: [0, -20, 0] }} // aller-retour vertical
               transition={{
                    duration: 3,
                    repeat: Infinity,       
                    repeatType: 'loop',    
                    ease: 'easeInOut',
                    }}
                  viewport={{ once: true }}
              className="bg-white shadow-lg rounded-lg p-6 transition-shadow duration-300 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold mb-2 text-black">{feat.title}</h3>
              <p className="text-gray-600">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
