import { rollupBundle } from '../../scripts/rollup.js'

export default [...rollupBundle('node/index'), ...rollupBundle('client/index')]
