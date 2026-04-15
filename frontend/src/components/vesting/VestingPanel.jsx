import { motion } from "framer-motion";
import { VestingStats } from "./VestingStats";
import { VestingSchedule } from "./VestingSchedule";

export const VestingPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <VestingStats />
      <VestingSchedule />
    </motion.div>
  );
};
