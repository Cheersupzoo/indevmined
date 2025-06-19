type AnimatableRef = {
  start: () => Promise<void>
  animate: () => import('motion/react').Segment
}
