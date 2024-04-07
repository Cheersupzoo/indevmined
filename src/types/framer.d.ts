type AnimatableRef = {
  start: () => Promise<void>;
  animate: () => import("framer-motion").Segment;
};
