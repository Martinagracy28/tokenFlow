import { StakingStats } from "./StakingStats";
import { StakeForm } from "./StakeForm";
import { motion } from "framer-motion";

export const StakingPanel = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      <motion.div variants={item} className="lg:col-span-7">
        <StakingStats />
      </motion.div>
      <motion.div variants={item} className="lg:col-span-5 sticky top-32">
        <StakeForm />
      </motion.div>
    </motion.div>
  );
};
