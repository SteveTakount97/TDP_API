import { motion } from 'framer-motion'
import Image from 'next/image'

const Logo = () => {
  return (
    <motion.div
      className="w-1/2 flex justify-center rounded-full overflow-hidden"
      animate={{ rotate: 30 }}
      transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
    >
      <Image
        src="/Tdp.png"
        alt="Logo animé"
        width={250}
        height={250}
        className="w-24 h-auto"
      />
    </motion.div>
  )
}

export default Logo
