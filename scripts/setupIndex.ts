// scripts/setupIndex.ts
import { createStoryIndex, redis } from '../lib/redis';

(async function main() {
  await createStoryIndex();
  await redis.quit();
})();